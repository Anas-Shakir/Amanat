import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const VerifyVoucherSchema = z.object({
  voucherCode: z.string().min(4).max(8),
  merchantId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = VerifyVoucherSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid voucher format", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { voucherCode } = parsed.data;

    // Demonstration voucher response
    if (voucherCode === "4827") {
      return NextResponse.json({
        success: true,
        voucher: {
          code: "4827",
          householdId: "AMN-48291",
          campaignTitle: "Dadu Flood Emergency Food Relief",
          totalEntitlement: 4000,
          alreadyRedeemed: 1350,
          remainingAmount: 2650,
          status: "ACTIVE",
          validUntil: "2026-10-31",
        },
      });
    }

    return NextResponse.json(
      { error: "Voucher not found or invalid" },
      { status: 404 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
