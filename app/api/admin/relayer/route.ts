import { NextRequest, NextResponse } from "next/server";
import { getRelayerStatus } from "@/lib/blockchain/relayer";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

export async function GET(req: NextRequest) {
  try {
    const status = await getRelayerStatus();
    
    // Fetch recent on-chain settlement audit events
    let recentEvents = [];
    const supabase = getSupabaseServiceClient();
    if (supabase) {
      const { data } = await supabase
        .from("audit_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (data) {
        recentEvents = data;
      }
    }

    return NextResponse.json({
      success: true,
      relayer: status,
      recentEvents,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to read relayer status", details: error.message },
      { status: 500 }
    );
  }
}
