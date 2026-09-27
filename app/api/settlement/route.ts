import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const SettlementRequestSchema = z.object({
  voucherCode: z.string().min(4),
  merchantId: z.string(),
  amount: z.number().positive(),
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

    // Simulation of relayer settlement
    const simulatedTxHash = `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`;

    return NextResponse.json({
      success: true,
      message: "Redemption processed and queued for settlement",
      redemption: {
        voucherCode,
        merchantId,
        fulfilledAmount: amount,
        blockchainNetwork: "Base Sepolia (84532)",
        txHash: simulatedTxHash,
        status: "CONFIRMED",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Settlement processing error" },
      { status: 500 }
    );
  }
}
