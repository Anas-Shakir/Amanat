import { getSupabaseBrowserClient } from "./client";
import { getSupabaseServiceClient } from "./service";
import { Campaign, Household, Voucher, Redemption, AuditEvent } from "@/types";

// Seed fallback data for deterministic demo
const SEED_CAMPAIGNS: Campaign[] = [
  {
    id: "CMP-DADU-01",
    title: "Dadu — Flood Emergency Food Relief Pool",
    description: "Emergency food supply pool providing staple rations to flood displaced families in Johi and Mehar.",
    location: "Johi & Mehar, Dadu, Sindh",
    city: "Dadu",
    mode: "EMERGENCY",
    category: "EMERGENCY_FOOD",
    targetAmount: 100000,
    fundedAmount: 100000,
    targetHouseholds: 25,
    reachedHouseholds: 18,
    status: "ACTIVE",
    startDate: "2026-09-01",
    contractCampaignId: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "CMP-DADU-02",
    title: "Dadu Community — Monthly Zakat Ration Support",
    description: "Monthly welfare ration support for verified impoverished families and daily wage earners across Dadu.",
    location: "Khairpur Nathan Shah, Dadu",
    city: "Dadu",
    mode: "COMMUNITY",
    category: "ZAKAT_RATION",
    targetAmount: 250000,
    fundedAmount: 180000,
    targetHouseholds: 50,
    reachedHouseholds: 32,
    status: "ACTIVE",
    startDate: "2026-09-01",
    contractCampaignId: 2,
    createdAt: new Date().toISOString(),
  },
];

export async function getCampaigns(): Promise<Campaign[]> {
  const supabase = getSupabaseServiceClient() || getSupabaseBrowserClient();
  if (supabase) {
    const { data, error } = await supabase.from("campaigns").select("*");
    if (!error && data && data.length > 0) {
      return data.map((d: any) => ({
        id: d.id,
        title: d.title,
        description: d.description,
        location: d.location,
        city: d.city,
        mode: d.mode,
        category: d.category,
        targetAmount: Number(d.target_amount),
        fundedAmount: Number(d.funded_amount),
        targetHouseholds: d.target_households,
        reachedHouseholds: d.reached_households,
        status: d.status,
        contractCampaignId: d.contract_campaign_id,
        startDate: d.created_at,
        createdAt: d.created_at,
      }));
    }
  }
  return SEED_CAMPAIGNS;
}

export async function verifyVoucherInDb(voucherCode: string) {
  const supabase = getSupabaseServiceClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("vouchers")
      .select("*, entitlements(*, households(*), campaigns(*))")
      .eq("voucher_code", voucherCode)
      .single();

    if (!error && data) {
      return {
        found: true,
        voucher: {
          id: data.id,
          code: data.voucher_code,
          remainingAmount: Number(data.remaining_amount),
          status: data.status,
          householdId: data.entitlements?.households?.household_code || "AMN-48291",
          campaignTitle: data.entitlements?.campaigns?.title || "Dadu Emergency Relief",
          totalEntitlement: Number(data.entitlements?.allocated_amount || 4000),
          alreadyRedeemed: Number(data.entitlements?.allocated_amount || 4000) - Number(data.remaining_amount),
        },
      };
    }
  }

  // Fallback demo voucher
  if (voucherCode === "4827") {
    return {
      found: true,
      voucher: {
        id: "vouch-seed-4827",
        code: "4827",
        remainingAmount: 2650,
        status: "ACTIVE",
        householdId: "AMN-48291",
        campaignTitle: "Dadu Flood Emergency Food Relief",
        totalEntitlement: 4000,
        alreadyRedeemed: 1350,
      },
    };
  }

  return { found: false, voucher: null };
}
