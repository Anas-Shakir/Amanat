import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { getCampaigns } from "@/lib/supabase/db";

const CreateCampaignSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().default("Johi & Mehar, Dadu, Sindh"),
  city: z.string().default("Dadu"),
  mode: z.enum(["EMERGENCY", "COMMUNITY"]),
  category: z.enum([
    "EMERGENCY_FOOD",
    "CLEAN_WATER",
    "MEDICAL_SUPPLIES",
    "SHELTER_REPAIR",
    "ZAKAT_RATION",
    "MONTHLY_FOOD_BASKET",
  ]),
  targetAmount: z.number().positive("Target amount must be greater than 0"),
  targetHouseholds: z.number().int().positive().default(25),
});

// GET: Fetch all campaigns
export async function GET() {
  try {
    const campaigns = await getCampaigns();
    return NextResponse.json({ success: true, campaigns });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch campaigns", details: error.message },
      { status: 500 }
    );
  }
}

// POST: Create a new campaign pool
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateCampaignSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid campaign parameters", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { title, description, location, city, mode, category, targetAmount, targetHouseholds } = parsed.data;

    const supabase = getSupabaseServiceClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("campaigns")
        .insert({
          title,
          description,
          location,
          city,
          mode,
          category,
          target_amount: targetAmount,
          funded_amount: 0,
          target_households: targetHouseholds,
          reached_households: 0,
          status: "ACTIVE",
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Log audit event
      await supabase.from("audit_events").insert({
        action: "CAMPAIGN_POOL_CREATED",
        entity_type: "CAMPAIGN",
        entity_id: data.id,
        actor_role: "ORGANIZATION",
        actor_id: "org-srwf-dadu",
        details: { title, targetAmount, mode, category },
      });

      return NextResponse.json({ success: true, campaign: data }, { status: 201 });
    }

    // Fallback response for demo
    const simulatedCampaign = {
      id: `CMP-DADU-${Math.floor(10 + Math.random() * 90)}`,
      title,
      description,
      location,
      city,
      mode,
      category,
      targetAmount,
      fundedAmount: 0,
      targetHouseholds,
      reachedHouseholds: 0,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, campaign: simulatedCampaign }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
