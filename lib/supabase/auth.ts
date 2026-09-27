import { getSupabaseBrowserClient } from "./client";
import { UserRole } from "@/types";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  merchantId?: string;
  merchantName?: string;
  organizationId?: string;
  organizationName?: string;
  city: string;
}

export const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  DONOR: {
    id: "demo-donor-01",
    email: "donor@amanat.org",
    role: "DONOR",
    fullName: "Anas Shakir (Donor)",
    city: "Karachi / Global",
  },
  MERCHANT: {
    id: "demo-merch-01",
    email: "merchant.johi@amanat.org",
    role: "MERCHANT",
    fullName: "Haji Mohammad Rafiq",
    merchantId: "merch-dadu-01",
    merchantName: "Madina Kiryana Store (Johi Branch)",
    city: "Johi, Dadu",
  },
  ORGANIZATION: {
    id: "demo-org-01",
    email: "relief.dadu@amanat.org",
    role: "ORGANIZATION",
    fullName: "Tariq Shah (Field Lead)",
    organizationId: "org-srwf-dadu",
    organizationName: "Sindh Relief & Welfare Foundation",
    city: "Dadu",
  },
  ADMIN: {
    id: "demo-admin-01",
    email: "admin@amanat.org",
    role: "ADMIN",
    fullName: "Amanat Core Operator",
    city: "Dadu Node",
  },
};

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    // Return stored demo profile or default
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("amanat_active_role");
      if (stored && DEMO_PROFILES[stored as UserRole]) {
        return DEMO_PROFILES[stored as UserRole];
      }
    }
    return DEMO_PROFILES.DONOR;
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("amanat_active_role");
      if (stored && DEMO_PROFILES[stored as UserRole]) {
        return DEMO_PROFILES[stored as UserRole];
      }
    }
    return DEMO_PROFILES.DONOR;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, organizations(*)")
    .eq("id", session.user.id)
    .single();

  if (profile) {
    return {
      id: profile.id,
      email: session.user.email || "",
      role: profile.role as UserRole,
      fullName: profile.full_name,
      organizationId: profile.organization_id,
      organizationName: profile.organizations?.name,
      city: "Dadu",
    };
  }

  return {
    id: session.user.id,
    email: session.user.email || "",
    role: "DONOR",
    fullName: session.user.email?.split("@")[0] || "User",
    city: "Dadu",
  };
}

export async function signInDemoRole(role: UserRole): Promise<UserProfile> {
  if (typeof window !== "undefined") {
    localStorage.setItem("amanat_active_role", role);
  }
  return DEMO_PROFILES[role];
}
