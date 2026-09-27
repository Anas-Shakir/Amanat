import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export {};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function seedDatabase() {
  console.log("================================================================================");
  console.log("  🌱 AMANAT DETERMINISTIC DATABASE SEEDER (DADU, SINDH)");
  console.log("================================================================================\n");

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your-project")) {
    console.log("⚠️ Supabase credentials not found in .env.local. Running in offline/demo mode.");
    console.log("   The application will continue to use in-memory seed records seamlessly.\n");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log(`Connecting to Supabase at: ${supabaseUrl}\n`);

  // 1. Seed Merchants
  console.log("1. Seeding Kiryana Merchants (Johi, Mehar, KN Shah)...");
  const merchants = [
    {
      business_name: "Madina Kiryana Store",
      owner_name: "Tariq Mehmood Babar",
      phone: "+92 301 5551201",
      address: "Main Bazaar, Opp. Civil Hospital, Johi",
      area: "Johi",
      city: "Dadu",
      latitude: 26.6917,
      longitude: 67.6139,
      is_authorized: true,
      total_fulfilled_amount: 245000,
    },
    {
      business_name: "Bismillah General & Kiryana Store",
      owner_name: "Haji Abdul Rasheed",
      phone: "+92 302 5551202",
      address: "Larkana Road, Near Clock Tower, Mehar",
      area: "Mehar",
      city: "Dadu",
      latitude: 27.1806,
      longitude: 67.8222,
      is_authorized: true,
      total_fulfilled_amount: 310000,
    },
    {
      business_name: "Al-Razaq Ration Mart",
      owner_name: "Muhammad Aslam Soomro",
      phone: "+92 303 5551203",
      address: "Station Road, KN Shah City Center",
      area: "Khairpur Nathan Shah",
      city: "Dadu",
      latitude: 27.0917,
      longitude: 67.7333,
      is_authorized: true,
      total_fulfilled_amount: 195000,
    },
  ];

  for (const m of merchants) {
    const { error } = await supabase.from("merchants").insert(m);
    if (error) console.warn(`   - Merchant ${m.business_name} note:`, error.message);
    else console.log(`   + Seeded merchant: ${m.business_name} (${m.area})`);
  }

  // 2. Seed Campaigns
  console.log("\n2. Seeding Disaster & Community Aid Pools...");
  const campaigns = [
    {
      title: "Dadu Flood Emergency Food Relief",
      description: "Emergency high-priority wheat flour, cooking oil, and dry ration packages for monsoon-displaced households across Johi and Mehar.",
      location: "Johi & Mehar Union Councils, Dadu",
      city: "Dadu",
      mode: "EMERGENCY",
      category: "EMERGENCY_FOOD",
      target_amount: 500000,
      funded_amount: 350000,
      target_households: 125,
      reached_households: 85,
      status: "ACTIVE",
      contract_campaign_id: 1,
    },
    {
      title: "Dadu Community — Monthly Zakat Ration Support",
      description: "Predictable social welfare pool funding monthly grain and nutrition hampers for verified low-income households.",
      location: "Radhan & KN Shah, Dadu",
      city: "Dadu",
      mode: "COMMUNITY",
      category: "ZAKAT_RATION",
      target_amount: 300000,
      funded_amount: 200000,
      target_households: 75,
      reached_households: 45,
      status: "ACTIVE",
      contract_campaign_id: 2,
    },
  ];

  for (const c of campaigns) {
    const { error } = await supabase.from("campaigns").insert(c);
    if (error) console.warn(`   - Campaign ${c.title} note:`, error.message);
    else console.log(`   + Seeded campaign: ${c.title}`);
  }

  console.log("\n✅ Database seeding process complete!");
}

seedDatabase().catch((err) => {
  console.error("Seed error:", err);
});
