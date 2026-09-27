export type UserRole = 'DONOR' | 'MERCHANT' | 'ORGANIZATION' | 'ADMIN';

export type AidMode = 'EMERGENCY' | 'COMMUNITY';

export type AidCategory = 
  | 'EMERGENCY_FOOD'
  | 'CLEAN_WATER'
  | 'MEDICAL_SUPPLIES'
  | 'SHELTER_REPAIR'
  | 'ZAKAT_RATION'
  | 'MONTHLY_FOOD_BASKET';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  location: string;
  city: string;
  mode: AidMode;
  category: AidCategory;
  targetAmount: number;
  fundedAmount: number;
  targetHouseholds: number;
  reachedHouseholds: number;
  startDate: string;
  endDate?: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  contractCampaignId?: number;
  createdAt: string;
}

export interface Household {
  id: string;
  householdId: string; // E.g., AMN-48291
  headOfHousehold: string;
  familySize: number;
  area: string;
  city: string;
  displacementStatus?: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'FLAGGED' | 'REJECTED';
  verifiedBy?: string;
  notes?: string;
  createdAt: string;
}

export interface Entitlement {
  id: string;
  campaignId: string;
  householdId: string;
  allocatedAmount: number;
  remainingAmount: number;
  category: AidCategory;
  validFrom: string;
  validUntil: string;
  status: 'ACTIVE' | 'PARTIALLY_REDEEMED' | 'FULLY_REDEEMED' | 'EXPIRED' | 'REVOKED';
  issuedByOrgId: string;
  createdAt: string;
}

export interface Voucher {
  id: string;
  entitlementId: string;
  voucherCode: string; // 4-6 digit human-friendly verification code
  tokenHash: string;
  qrPayload?: string;
  remainingAmount: number;
  expiresAt: string;
  status: 'ACTIVE' | 'PARTIALLY_REDEEMED' | 'FULLY_REDEEMED' | 'EXPIRED';
  lastRedeemedAt?: string;
  createdAt: string;
}

export interface Merchant {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  address: string;
  area: string;
  city: string;
  latitude: number;
  longitude: number;
  isAuthorized: boolean;
  totalFulfilledAmount: number;
  assignedCampaignIds: string[];
}

export interface Redemption {
  id: string;
  voucherId: string;
  entitlementId: string;
  merchantId: string;
  amount: number;
  remainingBalanceAfter: number;
  blockchainTxHash?: string;
  onChainStatus: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'SIMULATED';
  timestamp: string;
}

export interface AuditEvent {
  id: string;
  action: string;
  entityType: 'CAMPAIGN' | 'ENTITLEMENT' | 'VOUCHER' | 'REDEMPTION' | 'SETTLEMENT';
  entityId: string;
  actorRole: UserRole;
  actorId: string;
  details: Record<string, unknown>;
  blockchainTxHash?: string;
  timestamp: string;
}
