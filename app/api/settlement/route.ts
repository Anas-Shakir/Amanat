import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { submitOnChainRedemption } from "@/lib/blockchain/relayer";

const SettlementRequestSchema = z.object({
  voucherCode: z.string().min(4),
  merchantId: z.string().optional().default("merch-dadu-01"),
  amount: z.number().positive("Amount must be greater than 0"),
  idempotencyKey: z.string().optional(),
});

// Concurrency locks & Idempotency store
const ACTIVE_REDEMPTION_LOCKS = new Set<string>();
const PROCESSED_IDEMPOTENCY_KEYS = new Map<string, any>();

export async function POST(req: NextRequest) {
  let cleanCode: string | null = null;

  try {
    const body = await req.json();
    const parsed = SettlementRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid settlement payload", details: parsed.error.format(), errorCode: "INVALID_PAYLOAD" },
        { status: 400 }
      );
    }

    const { voucherCode, merchantId, amount, idempotencyKey } = parsed.data;
    cleanCode = voucherCode.trim();

    // 1. Idempotency Check
    if (idempotencyKey && PROCESSED_IDEMPOTENCY_KEYS.has(idempotencyKey)) {
      return NextResponse.json(
        {
          success: true,
          message: "Duplicate request ignored (idempotent result returned)",
          redemption: PROCESSED_IDEMPOTENCY_KEYS.get(idempotencyKey),
          isDuplicate: true,
        },
        { status: 200 }
      );
    }

    // 2. Concurrency Lock check (prevents parallel race conditions on same voucher PIN)
    if (ACTIVE_REDEMPTION_LOCKS.has(cleanCode)) {
      return NextResponse.json(
        {
          error: "Simultaneous redemption detected on this voucher PIN. Please wait a moment.",
          errorCode: "CONCURRENT_REDEMPTION_LOCKED",
        },
        { status: 409 }
      );
    }

    ACTIVE_REDEMPTION_LOCKS.add(cleanCode);

    // 3. Demo voucher balance bounds checking
    if (cleanCode === "4827" && amount > 2650) {
      return NextResponse.json(
        {
          error: `Requested amount (Rs. ${amount}) exceeds remaining voucher balance (Rs. 2,650).`,
          errorCode: "EXCEEDS_BALANCE",
        },
        { status: 400 }
      );
    }

    if (cleanCode === "5914" && amount > 4000) {
      return NextResponse.json(
        {
          error: `Requested amount (Rs. ${amount}) exceeds remaining voucher balance (Rs. 4,000).`,
          errorCode: "EXCEEDS_BALANCE",
        },
        { status: 400 }
      );
    }

    if (cleanCode === "1111" || cleanCode === "0000") {
      return NextResponse.json(
        {
          error: "Cannot settle against an expired or fully redeemed voucher.",
          errorCode: "VOUCHER_INELIGIBLE",
        },
        { status: 400 }
      );
    }

    // 4. Submit on-chain via Backend Relayer
    const relayerResult = await submitOnChainRedemption(
      1, // Campaign ID
      cleanCode,
      amount
    );

    const supabase = getSupabaseServiceClient();
    if (supabase) {
      // Fetch voucher & entitlement
      const { data: voucher, error: vErr } = await supabase
        .from("vouchers")
        .select("*, entitlements(*, households(*))")
        .eq("voucher_code", cleanCode)
        .maybeSingle();

      if (!vErr && voucher) {
        const currentRemaining = Number(voucher.remaining_amount);

        if (amount > currentRemaining) {
          return NextResponse.json(
            {
              error: `Requested amount (Rs. ${amount}) exceeds remaining voucher balance (Rs. ${currentRemaining}).`,
              errorCode: "EXCEEDS_BALANCE",
            },
            { status: 400 }
          );
        }

        const newRemaining = currentRemaining - amount;
        const newStatus = newRemaining === 0 ? "FULLY_REDEEMED" : "PARTIALLY_REDEEMED";

        // Update voucher
        await supabase
          .from("vouchers")
          .update({
            remaining_amount: newRemaining,
            status: newStatus,
            last_redeemed_at: new Date().toISOString(),
          })
          .eq("id", voucher.id);

        // Update entitlement
        await supabase
          .from("entitlements")
          .update({
            remaining_amount: newRemaining,
            status: newStatus,
          })
          .eq("id", voucher.entitlement_id);

        // Fetch first merchant ID if default
        let actualMerchantId = merchantId;
        const { data: merchantData } = await supabase.from("merchants").select("id").limit(1).maybeSingle();
        if (merchantData?.id) {
          actualMerchantId = merchantData.id;
        }

        // Insert redemption record with relayer txHash
        const { data: redemptionRecord } = await supabase
          .from("redemptions")
          .insert({
            voucher_id: voucher.id,
            entitlement_id: voucher.entitlement_id,
            merchant_id: actualMerchantId,
            amount,
            remaining_balance_after: newRemaining,
            blockchain_tx_hash: relayerResult.txHash,
            on_chain_status: relayerResult.isSimulated ? "SIMULATED" : "CONFIRMED",
          })
          .select()
          .single();

        // Insert audit event
        await supabase.from("audit_events").insert({
          action: "MERCHANT_REDEMPTION_SETTLED",
          entity_type: "REDEMPTION",
          entity_id: redemptionRecord?.id || voucher.id,
          actor_role: "MERCHANT",
          actor_id: actualMerchantId,
          details: {
            voucherCode: cleanCode,
            householdId: voucher.entitlements?.households?.household_code || "AMN-48291",
            fulfilledAmount: amount,
            remainingBalanceAfter: newRemaining,
            isSimulated: relayerResult.isSimulated,
          },
          blockchain_tx_hash: relayerResult.txHash,
        });

        const responsePayload = {
          id: redemptionRecord?.id || `RED-${Date.now()}`,
          voucherCode: cleanCode,
          householdId: voucher.entitlements?.households?.household_code || "AMN-48291",
          fulfilledAmount: amount,
          remainingBalance: newRemaining,
          blockchainTxHash: relayerResult.txHash,
          explorerUrl: relayerResult.explorerUrl,
          isSimulated: relayerResult.isSimulated,
          status: "CONFIRMED",
          timestamp: new Date().toISOString(),
        };

        if (idempotencyKey) {
          PROCESSED_IDEMPOTENCY_KEYS.set(idempotencyKey, responsePayload);
        }

        return NextResponse.json({
          success: true,
          message: "Fulfillment confirmed and settlement processed",
          redemption: responsePayload,
        });
      }
    }

    // Fallback response for demo
    const remainingAfter = Math.max(0, 2650 - amount);
    const demoPayload = {
      id: `RED-${Date.now()}`,
      voucherCode: cleanCode,
      householdId: "AMN-48291",
      fulfilledAmount: amount,
      remainingBalance: remainingAfter,
      blockchainTxHash: relayerResult.txHash,
      explorerUrl: relayerResult.explorerUrl,
      isSimulated: relayerResult.isSimulated,
      status: "CONFIRMED",
      timestamp: new Date().toISOString(),
    };

    if (idempotencyKey) {
      PROCESSED_IDEMPOTENCY_KEYS.set(idempotencyKey, demoPayload);
    }

    return NextResponse.json({
      success: true,
      message: "Fulfillment recorded in demo environment",
      redemption: demoPayload,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Settlement processing failure", details: error.message },
      { status: 500 }
    );
  } finally {
    if (cleanCode) {
      ACTIVE_REDEMPTION_LOCKS.delete(cleanCode);
    }
  }
}
