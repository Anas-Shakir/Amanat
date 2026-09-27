import { NextRequest, NextResponse } from "next/server";
import { getRecentNotifications } from "@/lib/messaging";

export async function GET(req: NextRequest) {
  try {
    const history = getRecentNotifications();
    return NextResponse.json({
      success: true,
      history,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to read notification history", details: error.message },
      { status: 500 }
    );
  }
}
