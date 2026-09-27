import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const CreateHouseholdSchema = z.object({
  headOfHousehold: z.string().min(2, "Name must be at least 2 characters"),
  familySize: z.number().int().min(1).default(5),
  area: z.string().min(3, "Area/UC required"),
  city: z.string().default("Dadu"),
  displacementStatus: z.string().default("Flood Displaced"),
  assessment: z.string().optional().default("Field verified household requiring immediate nutrition assistance."),
  assessmentNotes: z.string().optional(),
  campaignId: z.string(),
  entitlementAmount: z.number().positive().default(4000),
});

// GET: Fetch all registered households
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient() || getSupabaseBrowserClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("households")
        .select("*, entitlements(*, vouchers(*), campaigns(title))")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped = data.map((h: any) => {
          const firstEnt = h.entitlements?.[0];
          const firstVouch = firstEnt?.vouchers?.[0];

          return {
            id: h.id,
            householdId: h.household_code,
            headOfFamily: h.head_of_household,
            familySize: h.family_size,
            area: h.area,
            city: h.city,
            displacementStatus: h.displacement_status,
            assessment: h.notes || "Flood Displaced Household",
            entitlementAmount: Number(firstEnt?.allocated_amount || 4000),
            remainingAmount: Number(firstEnt?.remaining_amount ?? 4000),
            status: h.verification_status,
            lastVoucherCode: firstVouch?.voucher_code || "4827",
            campaignTitle: firstEnt?.campaigns?.title || "Dadu Flood Emergency Relief",
            createdAt: h.created_at,
          };
        });

        return NextResponse.json({ success: true, households: mapped });
      }
    }

    // Fallback seed records for demo
    const seedHouseholds = [
      {
        id: "1",
        householdId: "AMN-48291",
        headOfFamily: "Ghulam Nabi",
        familySize: 6,
        area: "Johi Union Council 4, Dadu",
        city: "Dadu",
        displacementStatus: "Flood Displaced",
        assessment: "Family lost crop harvest; verified on-site by field volunteer.",
        entitlementAmount: 4000,
        remainingAmount: 2650,
        status: "VERIFIED",
        lastVoucherCode: "4827",
        campaignTitle: "Dadu Flood Emergency Food Relief",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        householdId: "AMN-48292",
        headOfFamily: "Zulekha Bibi",
        familySize: 4,
        area: "Mehar Main Bazaar, Dadu",
        city: "Dadu",
        displacementStatus: "Widow Household",
        assessment: "Widowed mother of 3; prioritized for emergency nutrition.",
        entitlementAmount: 4000,
        remainingAmount: 4000,
        status: "VERIFIED",
        lastVoucherCode: "5914",
        campaignTitle: "Dadu Flood Emergency Food Relief",
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        householdId: "AMN-48293",
        headOfFamily: "Ali Murad",
        familySize: 8,
        area: "Radhan Station, Dadu",
        city: "Dadu",
        displacementStatus: "Crop Inundation Loss",
        assessment: "Field surveyed: 8 family members without daily wage.",
        entitlementAmount: 5000,
        remainingAmount: 5000,
        status: "PENDING",
        lastVoucherCode: "8203",
        campaignTitle: "Dadu Community — Monthly Zakat Ration Support",
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({ success: true, households: seedHouseholds });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch households", details: error.message },
      { status: 500 }
    );
  }
}

// POST: Register a new household and issue initial entitlement + voucher
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateHouseholdSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid household registration data", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { headOfHousehold, familySize, area, city, displacementStatus, assessment, assessmentNotes, campaignId, entitlementAmount } = parsed.data;
    const finalNotes = assessmentNotes || assessment || "Field verified household requiring immediate nutrition assistance.";

    const generatedHouseholdCode = `AMN-${Math.floor(10000 + Math.random() * 90000)}`;
    const generatedVoucherCode = `${Math.floor(1000 + Math.random() * 9000)}`;

    const supabase = getSupabaseServiceClient();
    if (supabase) {
      // 1. Insert household
      const { data: householdData, error: hhErr } = await supabase
        .from("households")
        .insert({
          household_code: generatedHouseholdCode,
          head_of_household: headOfHousehold,
          family_size: familySize,
          area,
          city,
          displacement_status: displacementStatus,
          verification_status: "VERIFIED",
          notes: finalNotes,
        })
        .select()
        .single();

      if (hhErr) {
        return NextResponse.json({ error: hhErr.message }, { status: 500 });
      }

      // 2. Insert entitlement
      const { data: entData, error: entErr } = await supabase
        .from("entitlements")
        .insert({
          campaign_id: campaignId,
          household_id: householdData.id,
          allocated_amount: entitlementAmount,
          remaining_amount: entitlementAmount,
          category: "EMERGENCY_FOOD",
          status: "ACTIVE",
        })
        .select()
        .single();

      if (entErr) {
        return NextResponse.json({ error: entErr.message }, { status: 500 });
      }

      // 3. Insert voucher
      await supabase.from("vouchers").insert({
        entitlement_id: entData.id,
        voucher_code: generatedVoucherCode,
        token_hash: `hash_${Date.now()}_${generatedVoucherCode}`,
        remaining_amount: entitlementAmount,
        status: "ACTIVE",
      });

      // 4. Log audit event
      await supabase.from("audit_events").insert({
        action: "HOUSEHOLD_VERIFIED_AND_ENTITLED",
        entity_type: "HOUSEHOLD",
        entity_id: householdData.id,
        actor_role: "ORGANIZATION",
        actor_id: "org-srwf-dadu",
        details: {
          householdCode: generatedHouseholdCode,
          entitlementAmount,
          voucherCode: generatedVoucherCode,
        },
      });

      return NextResponse.json(
        {
          success: true,
          household: {
            id: householdData.id,
            householdId: generatedHouseholdCode,
            headOfFamily: headOfHousehold,
            familySize,
            area,
            city,
            assessment,
            entitlementAmount,
            remainingAmount: entitlementAmount,
            status: "VERIFIED",
            lastVoucherCode: generatedVoucherCode,
            createdAt: householdData.created_at,
          },
        },
        { status: 201 }
      );
    }

    // Fallback response for demo
    const simulatedResponse = {
      id: `hh-${Date.now()}`,
      householdId: generatedHouseholdCode,
      headOfFamily: headOfHousehold,
      familySize,
      area,
      city,
      assessment,
      entitlementAmount,
      remainingAmount: entitlementAmount,
      status: "VERIFIED",
      lastVoucherCode: generatedVoucherCode,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, household: simulatedResponse }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
