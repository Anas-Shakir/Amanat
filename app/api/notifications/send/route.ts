import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendVoucherNotification, MessagingChannel } from "@/lib/messaging";

const SendNotificationSchema = z.object({
  householdCode: z.string().min(3),
  voucherCode: z.string().min(4),
  amount: z.number().positive(),
  phone: z.string().optional().default("+92 300 1234567"),
  channel: z.enum(["SMS", "WHATSAPP", "DEMO"]).optional().default("SMS"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SendNotificationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid dispatch parameters", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { householdCode, voucherCode, amount, phone, channel } = parsed.data;

    const log = await sendVoucherNotification(
      householdCode,
      voucherCode,
      amount,
      phone,
      channel as MessagingChannel
    );

    return NextResponse.json({
      success: true,
      message: "Voucher notification dispatched successfully",
      dispatch: log,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Notification dispatch failure", details: error.message },
      { status: 500 }
    );
  }
}
