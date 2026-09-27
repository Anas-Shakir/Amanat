-- ==============================================================================
-- AMANAT — Verifiable Local Aid Infrastructure
-- Initial Database Schema & Security Layer (Dadu, Sindh)
-- Idempotent Migration Script
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS (Safe idempotent creation)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('DONOR', 'MERCHANT', 'ORGANIZATION', 'ADMIN');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'aid_mode') THEN
    CREATE TYPE aid_mode AS ENUM ('EMERGENCY', 'COMMUNITY');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'aid_category') THEN
    CREATE TYPE aid_category AS ENUM (
      'EMERGENCY_FOOD',
      'CLEAN_WATER',
      'MEDICAL_SUPPLIES',
      'SHELTER_REPAIR',
      'ZAKAT_RATION',
      'MONTHLY_FOOD_BASKET'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'household_status') THEN
    CREATE TYPE household_status AS ENUM ('PENDING', 'VERIFIED', 'FLAGGED', 'REJECTED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'voucher_status') THEN
    CREATE TYPE voucher_status AS ENUM ('ACTIVE', 'PARTIALLY_REDEEMED', 'FULLY_REDEEMED', 'EXPIRED', 'REVOKED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'on_chain_status') THEN
    CREATE TYPE on_chain_status AS ENUM ('PENDING', 'CONFIRMED', 'FAILED', 'SIMULATED');
  END IF;
END $$;

-- 2. ORGANIZATIONS (Relief NGOs / Issuers)
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  registration_number TEXT,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Dadu',
  is_authorized BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PROFILES (Extended User Accounts)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'DONOR',
  full_name TEXT NOT NULL,
  phone TEXT,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. MERCHANTS (Decentralized Kiryana Store Fulfillment Nodes)
CREATE TABLE IF NOT EXISTS public.merchants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  business_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  area TEXT NOT NULL DEFAULT 'Johi Main Bazaar',
  city TEXT NOT NULL DEFAULT 'Dadu',
  latitude NUMERIC(10, 7) NOT NULL DEFAULT 26.6918,
  longitude NUMERIC(10, 7) NOT NULL DEFAULT 67.7766,
  is_authorized BOOLEAN NOT NULL DEFAULT true,
  total_fulfilled_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. CAMPAIGNS (Geographic Aid Pools)
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'Dadu, Sindh',
  city TEXT NOT NULL DEFAULT 'Dadu',
  mode aid_mode NOT NULL DEFAULT 'EMERGENCY',
  category aid_category NOT NULL DEFAULT 'EMERGENCY_FOOD',
  target_amount NUMERIC(12, 2) NOT NULL,
  funded_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  target_households INTEGER NOT NULL DEFAULT 25,
  reached_households INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  contract_campaign_id INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. HOUSEHOLDS (Off-Chain Verification Records — Zero On-Chain PII)
CREATE TABLE IF NOT EXISTS public.households (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_code TEXT NOT NULL UNIQUE, -- e.g. AMN-48291
  head_of_household TEXT NOT NULL,
  family_size INTEGER NOT NULL DEFAULT 5,
  area TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Dadu',
  displacement_status TEXT DEFAULT 'Flood Displaced',
  verification_status household_status NOT NULL DEFAULT 'VERIFIED',
  verified_by_org_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ENTITLEMENTS (Approved Aid Allocations)
CREATE TABLE IF NOT EXISTS public.entitlements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  org_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  allocated_amount NUMERIC(12, 2) NOT NULL,
  remaining_amount NUMERIC(12, 2) NOT NULL,
  category aid_category NOT NULL DEFAULT 'EMERGENCY_FOOD',
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  status voucher_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. VOUCHERS (Beneficiary Tokens)
CREATE TABLE IF NOT EXISTS public.vouchers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entitlement_id UUID NOT NULL REFERENCES public.entitlements(id) ON DELETE CASCADE,
  voucher_code TEXT NOT NULL UNIQUE, -- 4-6 digit human code (e.g. 4827)
  token_hash TEXT NOT NULL,
  remaining_amount NUMERIC(12, 2) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  status voucher_status NOT NULL DEFAULT 'ACTIVE',
  last_redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. REDEMPTIONS (Merchant Fulfillment Transactions)
CREATE TABLE IF NOT EXISTS public.redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voucher_id UUID NOT NULL REFERENCES public.vouchers(id) ON DELETE CASCADE,
  entitlement_id UUID NOT NULL REFERENCES public.entitlements(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  remaining_balance_after NUMERIC(12, 2) NOT NULL,
  blockchain_tx_hash TEXT,
  on_chain_status on_chain_status NOT NULL DEFAULT 'CONFIRMED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. AUDIT EVENTS (Immutable Telemetry)
CREATE TABLE IF NOT EXISTS public.audit_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  actor_role user_role NOT NULL,
  actor_id TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  blockchain_tx_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR SPEED & CONCURRENCY PROTECTION
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_vouchers_code ON public.vouchers(voucher_code);
CREATE INDEX IF NOT EXISTS idx_households_code ON public.households(household_code);
CREATE INDEX IF NOT EXISTS idx_entitlements_household ON public.entitlements(household_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_redemptions_merchant ON public.redemptions(merchant_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Clean existing policies for idempotency
DROP POLICY IF EXISTS "Public can view active campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Public can view authorized merchants" ON public.merchants;
DROP POLICY IF EXISTS "Public can view audit events" ON public.audit_events;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create correct policies with USING clauses
CREATE POLICY "Public can view active campaigns" ON public.campaigns FOR SELECT USING (true);
CREATE POLICY "Public can view authorized merchants" ON public.merchants FOR SELECT USING (is_authorized = true);
CREATE POLICY "Public can view audit events" ON public.audit_events FOR SELECT USING (true);
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ==============================================================================
-- SEED DATA (Dadu, Sindh Realistic Ecosystem)
-- ==============================================================================
DO $$
DECLARE
  v_org_id UUID;
  v_merch_1 UUID;
  v_merch_2 UUID;
  v_merch_3 UUID;
  v_camp_1 UUID;
  v_camp_2 UUID;
  v_hh_1 UUID;
  v_hh_2 UUID;
  v_ent_1 UUID;
  v_ent_2 UUID;
  v_vouch_1 UUID;
BEGIN
  -- Check if already seeded to avoid duplicates
  IF NOT EXISTS (SELECT 1 FROM public.organizations WHERE registration_number = 'SRWF-SD-2022-89') THEN
    
    -- 1. Organization
    INSERT INTO public.organizations (id, name, registration_number, contact_person, phone, city, is_authorized)
    VALUES (
      uuid_generate_v4(),
      'Sindh Relief & Welfare Foundation (Dadu Chapter)',
      'SRWF-SD-2022-89',
      'Tariq Shah',
      '+92 300 1234567',
      'Dadu',
      true
    ) RETURNING id INTO v_org_id;

    -- 2. Merchants (Kiryana Stores in Dadu)
    INSERT INTO public.merchants (id, business_name, owner_name, phone, address, area, city, latitude, longitude, is_authorized, total_fulfilled_amount)
    VALUES 
    (
      uuid_generate_v4(),
      'Madina Kiryana Store',
      'Haji Mohammad Rafiq',
      '+92 312 9876543',
      'Shop 14, Main Bazaar, Johi',
      'Johi',
      'Dadu',
      26.6918,
      67.6167,
      true,
      72000.00
    ) RETURNING id INTO v_merch_1;

    INSERT INTO public.merchants (id, business_name, owner_name, phone, address, area, city, latitude, longitude, is_authorized, total_fulfilled_amount)
    VALUES 
    (
      uuid_generate_v4(),
      'Bismillah General Store',
      'Abdul Sattar Jamali',
      '+92 333 4567890',
      'Chowk Ghanta Ghar, Mehar',
      'Mehar',
      'Dadu',
      27.1814,
      67.8222,
      true,
      45000.00
    ) RETURNING id INTO v_merch_2;

    INSERT INTO public.merchants (id, business_name, owner_name, phone, address, area, city, latitude, longitude, is_authorized, total_fulfilled_amount)
    VALUES 
    (
      uuid_generate_v4(),
      'Al-Razaq Ration Mart',
      'Manzoor Ahmed',
      '+92 345 6789012',
      'Station Road, KN Shah',
      'Khairpur Nathan Shah',
      'Dadu',
      26.9667,
      67.7500,
      true,
      18000.00
    ) RETURNING id INTO v_merch_3;

    -- 3. Campaigns
    INSERT INTO public.campaigns (id, organization_id, title, description, location, city, mode, category, target_amount, funded_amount, target_households, reached_households, status, contract_campaign_id)
    VALUES 
    (
      uuid_generate_v4(),
      v_org_id,
      'Dadu Flood Emergency Food Relief',
      'Emergency food supply pool providing staple rations to flood displaced families in Johi and Mehar.',
      'Johi & Mehar, Dadu, Sindh',
      'Dadu',
      'EMERGENCY',
      'EMERGENCY_FOOD',
      100000.00,
      100000.00,
      25,
      18,
      'ACTIVE',
      1
    ) RETURNING id INTO v_camp_1;

    INSERT INTO public.campaigns (id, organization_id, title, description, location, city, mode, category, target_amount, funded_amount, target_households, reached_households, status, contract_campaign_id)
    VALUES 
    (
      uuid_generate_v4(),
      v_org_id,
      'Dadu Community — Monthly Zakat Ration Support',
      'Monthly welfare ration support for verified impoverished families and daily wage earners across Dadu.',
      'Khairpur Nathan Shah, Dadu',
      'Dadu',
      'COMMUNITY',
      'ZAKAT_RATION',
      250000.00,
      180000.00,
      50,
      32,
      'ACTIVE',
      2
    ) RETURNING id INTO v_camp_2;

    -- 4. Verified Households
    INSERT INTO public.households (id, household_code, head_of_household, family_size, area, city, displacement_status, verification_status, verified_by_org_id, notes)
    VALUES 
    (
      uuid_generate_v4(),
      'AMN-48291',
      'Ghulam Nabi',
      6,
      'Johi UC 4, Dadu',
      'Dadu',
      'Flood Displaced',
      'VERIFIED',
      v_org_id,
      'Family lost crop harvest; verified on-site by field volunteer.'
    ) RETURNING id INTO v_hh_1;

    INSERT INTO public.households (id, household_code, head_of_household, family_size, area, city, displacement_status, verification_status, verified_by_org_id, notes)
    VALUES 
    (
      uuid_generate_v4(),
      'AMN-48292',
      'Zulekha Bibi',
      4,
      'Mehar Main, Dadu',
      'Dadu',
      'Widow Household',
      'VERIFIED',
      v_org_id,
      'Widowed mother of 3; prioritized for emergency nutrition.'
    ) RETURNING id INTO v_hh_2;

    -- 5. Entitlements
    INSERT INTO public.entitlements (id, campaign_id, household_id, org_id, allocated_amount, remaining_amount, category, status)
    VALUES 
    (
      uuid_generate_v4(),
      v_camp_1,
      v_hh_1,
      v_org_id,
      4000.00,
      2650.00,
      'EMERGENCY_FOOD',
      'PARTIALLY_REDEEMED'
    ) RETURNING id INTO v_ent_1;

    INSERT INTO public.entitlements (id, campaign_id, household_id, org_id, allocated_amount, remaining_amount, category, status)
    VALUES 
    (
      uuid_generate_v4(),
      v_camp_1,
      v_hh_2,
      v_org_id,
      4000.00,
      4000.00,
      'EMERGENCY_FOOD',
      'ACTIVE'
    ) RETURNING id INTO v_ent_2;

    -- 6. Vouchers (Demo Code: 4827)
    INSERT INTO public.vouchers (id, entitlement_id, voucher_code, token_hash, remaining_amount, status, last_redeemed_at)
    VALUES 
    (
      uuid_generate_v4(),
      v_ent_1,
      '4827',
      encode(sha256('amanat-secret-token-4827'::bytea), 'hex'),
      2650.00,
      'PARTIALLY_REDEEMED',
      NOW() - INTERVAL '2 hours'
    ) RETURNING id INTO v_vouch_1;

    -- 7. Redemptions
    INSERT INTO public.redemptions (voucher_id, entitlement_id, merchant_id, amount, remaining_balance_after, blockchain_tx_hash, on_chain_status)
    VALUES 
    (
      v_vouch_1,
      v_ent_1,
      v_merch_1,
      1350.00,
      2650.00,
      '0x8fa37d2f9b1c08e5e8a6d71c4a0e7f53942b03ef820468903c15d48726b1a9f0',
      'CONFIRMED'
    );

    -- 8. Audit Event
    INSERT INTO public.audit_events (action, entity_type, entity_id, actor_role, actor_id, details, blockchain_tx_hash)
    VALUES 
    (
      'MERCHANT_REDEMPTION_SETTLED',
      'REDEMPTION',
      v_vouch_1::text,
      'MERCHANT',
      v_merch_1::text,
      jsonb_build_object('fulfilledAmount', 1350.00, 'remainingAmount', 2650.00, 'householdId', 'AMN-48291'),
      '0x8fa37d2f9b1c08e5e8a6d71c4a0e7f53942b03ef820468903c15d48726b1a9f0'
    );
  END IF;
END $$;
