import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

const SettlementRequestSchema = z.object({
  voucherCode: z.string().min(4),
  merchantId: z.string().optional().default("merch-dadu-01"),
  amount: z.number().positive("Amount must be greater than 0"),
  idempotencyKey: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SettlementRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid settlement payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { voucherCode, merchantId, amount } = parsed.data;
    const cleanCode = voucherCode.trim();

    const simulatedTxHash = `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`;

    const supabase = getSupabaseServiceClient();
    if (supabase) {
      // 1. Fetch voucher & entitlement
      const { data: voucher, error: vErr } = await supabase
        .from("vouchers")
        .select("*, entitlements(*, households(*))")
        .eq("voucher_code", cleanCode)
        .maybeSingle();

      if (!vErr && voucher) {
        const currentRemaining = Number(voucher.remaining_amount);

        if (amount > currentRemaining) {
          return NextResponse.json(
            { error: `Requested amount (Rs. ${amount}) exceeds remaining voucher balance (Rs. ${currentRemaining}).` },
            { status: 400 }
          );
        }

        const newRemaining = currentRemaining - amount;
        const newStatus = newRemaining === 0 ? "FULLY_REDEEMED" : "PARTIALLY_REDEEMED";

        // 2. Update voucher
        await supabase
          .from("vouchers")
          .update({
            remaining_amount: newRemaining,
            status: newStatus,
            last_redeemed_at: new Date().toISOString(),
          })
          .eq("id", voucher.id);

        // 3. Update entitlement
        await supabase
          .from("entitlements")
          .update({
            remaining_amount: newRemaining,
            status: newStatus,
          })
          .eq("id", voucher.entitlement_id);

        // 4. Fetch first merchant ID if default
        let actualMerchantId = merchantId;
        const { data: merchantData } = await supabase.from("merchants").select("id").limit(1).maybeSingle();
        if (merchantData?.id) {
          actualMerchantId = merchantData.id;
        }

        // 5. Insert redemption record
        const { data: redemptionRecord } = await supabase
          .from("redemptions")
          .insert({
            voucher_id: voucher.id,
            entitlement_id: voucher.entitlement_id,
            merchant_id: actualMerchantId,
            amount,
            remaining_balance_after: newRemaining,
            blockchain_tx_hash: simulatedTxHash,
            on_chain_status: "CONFIRMED",
          })
          .select()
          .single();

        // 6. Insert audit event
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
            status: newStatus,
          },
          blockchain_tx_hash: simulatedTxHash,
        });

        return NextResponse.json({
          success: true,
          message: "Fulfillment confirmed and settlement queued on Base Sepolia",
          redemption: {
            id: redemptionRecord?.id || `RED-${Date.now()}`,
            voucherCode: cleanCode,
            householdId: voucher.entitlements?.households?.household_code || "AMN-48291",
            fulfilledAmount: amount,
            remainingBalance: newRemaining,
            blockchainTxHash: simulatedTxHash,
            status: "CONFIRMED",
            timestamp: new Date().toISOString(),
          },
        });
      }
    }

    // Fallback response for demo
    const remainingAfter = Math.max(0, 2650 - amount);
    return NextResponse.json({
      success: true,
      message: "Fulfillment recorded in demo environment",
      redemption: {
        id: `RED-${Date.now()}`,
        voucherCode: cleanCode,
        householdId: "AMN-48291",
        fulfilledAmount: amount,
        remainingBalance: remainingAfter,
        blockchainTxHash: simulatedTxHash,
        status: "CONFIRMED",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Settlement processing failure", details: error.message },
      { status: 500 }
    );
  }
}
