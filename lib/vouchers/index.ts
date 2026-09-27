import crypto from "crypto";
import { formatCurrencyPKR } from "@/lib/utils";

export interface VoucherPayload {
  voucherCode: string;
  tokenHash: string;
  entitlementId: string;
  householdCode: string;
  amount: number;
  remainingAmount: number;
  category: string;
  expiresAt: string;
}

export function generateVoucherCode(): string {
  // 4-digit non-sequential human code
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function generateTokenHash(voucherCode: string, entitlementId: string): string {
  return crypto
    .createHash("sha256")
    .update(`amanat_salt_${voucherCode}_${entitlementId}_${Date.now()}`)
    .digest("hex");
}

export function formatBeneficiaryMessage(
  voucherCode: string,
  householdCode: string,
  amount: number,
  category: string = "Emergency Food Ration",
  daysValid: number = 30
): { en: string; ur: string } {
  const pkr = formatCurrencyPKR(amount);

  const en = `AMANAT AID RELIEF:
Assalam-o-Alaikum,
Household [${householdCode}] has been allocated ${pkr} for ${category} under Dadu Flood Relief.

Your Voucher PIN: [${voucherCode}]
Valid for ${daysValid} days at any authorized Amanat Kiryana store (Madina Kiryana Johi, Bismillah Store Mehar).
Partial redemptions allowed. Keep this PIN safe.`;

  const ur = `امانت امداد:
السلام علیکم،
آپ کے گھرانہ [${householdCode}] کے لیے دادو فلڈ ریلیف کے تحت ${pkr} راشن کی منظوری ہو گئی ہے۔

آپ کا واؤچر کوڈ: [${voucherCode}]
اپنے قریبی امانت کریانہ اسٹور پر یہ کوڈ بتا کر راشن حاصل کریں۔ آپ جزوی رقم بھی لے سکتے ہیں۔`;

  return { en, ur };
}
