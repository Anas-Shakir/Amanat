"use client";

import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  MapPin, 
  ShieldCheck, 
  Ticket, 
  Store, 
  Clock, 
  FileText,
  Copy,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { useState } from "react";
import { formatCurrencyPKR } from "@/lib/utils";

interface HouseholdDetailsModalProps {
  household: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function HouseholdDetailsModal({
  household,
  isOpen,
  onClose,
}: HouseholdDetailsModalProps) {
  const [copied, setCopied] = useState(false);

  if (!household) return null;

  const copyVoucherCode = () => {
    navigator.clipboard.writeText(household.lastVoucherCode || "4827");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleRedemptions = [
    {
      store: "Madina Kiryana Store (Johi)",
      amount: 1350,
      timestamp: "Today, 11:30 AM",
      txHash: "0x8fa3...a9f0",
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Household: ${household.householdId}`}
      description="Field Verification & Entitlement Profile"
      className="max-w-xl"
    >
      <div className="space-y-5 text-xs text-slate-300">
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <Badge variant={household.status === "VERIFIED" ? "verified" : "pending"}>
            {household.status === "VERIFIED" ? "Field Verified (Dadu)" : "Pending Survey"}
          </Badge>
          <span className="font-mono text-indigo-400 font-bold text-sm">
            {household.householdId}
          </span>
        </div>

        {/* Core Info Grid */}
        <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div>
            <span className="text-slate-400 text-[11px]">Head of Household</span>
            <div className="font-bold text-white text-sm mt-0.5">{household.headOfFamily}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[11px]">Family Size</span>
            <div className="font-bold text-white text-sm mt-0.5">{household.familySize} Members</div>
          </div>
          <div>
            <span className="text-slate-400 text-[11px]">Location</span>
            <div className="text-slate-200 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              {household.area}
            </div>
          </div>
          <div>
            <span className="text-slate-400 text-[11px]">Associated Pool</span>
            <div className="text-slate-200 mt-0.5 truncate">{household.campaignTitle || "Emergency Food"}</div>
          </div>
        </div>

        {/* Assessment Notes */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
          <div className="text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1 text-[11px]">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Field Assessment Notes (Off-Chain Only)</span>
          </div>
          <p className="text-slate-200 text-xs leading-relaxed italic">
            "{household.assessment}"
          </p>
        </div>

        {/* Voucher & Entitlement Card */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/30 p-4 rounded-2xl border border-emerald-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Ticket className="w-4 h-4" />
              <span>Active Beneficiary Voucher</span>
            </div>
            <span className="text-slate-400 text-[11px]">Valid 30 Days</span>
          </div>

          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Voucher PIN</div>
              <div className="text-2xl font-mono font-black text-white tracking-widest mt-0.5">
                {household.lastVoucherCode || "4827"}
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={copyVoucherCode}
              className="text-xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? "Copied" : "Copy Code"}</span>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Total Allocated:</span>
              <div className="font-bold text-white text-sm mt-0.5">
                {formatCurrencyPKR(household.entitlementAmount)}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Remaining Balance:</span>
              <div className="font-bold text-emerald-400 text-sm mt-0.5">
                {formatCurrencyPKR(household.remainingAmount)}
              </div>
            </div>
          </div>
        </div>

        {/* Redemption History */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-cyan-400" />
            <span>Store Fulfillment History</span>
          </h4>
          <div className="space-y-1.5">
            {sampleRedemptions.map((r, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-white">{r.store}</div>
                  <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{r.timestamp} • Tx: {r.txHash}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400">
                    {formatCurrencyPKR(r.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" onClick={onClose} className="w-full sm:w-auto">
            Close Profile
          </Button>
        </div>
      </div>
    </Modal>
  );
}
