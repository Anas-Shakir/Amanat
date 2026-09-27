import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

const FundCampaignSchema = z.object({
  amount: z.number().positive("Funding amount must be positive"),
  donorName: z.string().optional().default("Anonymous Contributor"),
  donorRole: z.string().optional().default("DONOR"),
});

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const parsed = FundCampaignSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid contribution amount", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { amount, donorName } = parsed.data;
    const simulatedTxHash = `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`;

    const supabase = getSupabaseServiceClient();
    if (supabase) {
      // 1. Fetch current campaign
      const { data: campaign, error: fetchErr } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .single();

      if (!fetchErr && campaign) {
        const newFunded = Number(campaign.funded_amount) + amount;
        await supabase
          .from("campaigns")
          .update({ funded_amount: newFunded })
          .eq("id", id);

        // 2. Insert audit event
        await supabase.from("audit_events").insert({
          action: "CAMPAIGN_POOL_FUNDED",
          entity_type: "CAMPAIGN",
          entity_id: id,
          actor_role: "DONOR",
          actor_id: donorName,
          details: { amount, newFunded, campaignTitle: campaign.title },
          blockchain_tx_hash: simulatedTxHash,
        });

        return NextResponse.json({
          success: true,
          message: "Contribution allocated to campaign pool",
          fundedAmount: newFunded,
          blockchainTxHash: simulatedTxHash,
        });
      }
    }

    // Fallback response for demo
    return NextResponse.json({
      success: true,
      message: "Contribution recorded in demo state",
      campaignId: id,
      contributedAmount: amount,
      blockchainTxHash: simulatedTxHash,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Funding processing error", details: error.message },
      { status: 500 }
    );
  }
}
