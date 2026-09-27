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
  Send,
  Check
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
  const [isSendingNotif, setIsSendingNotif] = useState(false);
  const [notifSent, setNotifSent] = useState(false);

  if (!household) return null;

  const copyVoucherCode = () => {
    navigator.clipboard.writeText(household.lastVoucherCode || "4827");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendNotification = async () => {
    try {
      setIsSendingNotif(true);
      await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          householdCode: household.householdId,
          voucherCode: household.lastVoucherCode || "4827",
          amount: household.remainingAmount || household.entitlementAmount || 4000,
          phone: household.contactPhone || "+923001234567",
          channel: "SMS",
        }),
      });
      setNotifSent(true);
      setTimeout(() => setNotifSent(false), 3000);
    } catch (err) {
      console.error("Failed to send notification", err);
    } finally {
      setIsSendingNotif(false);
    }
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
      className="max-w-xl bg-white"
    >
      <div className="space-y-5 text-xs text-[#2b1712]">
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <Badge variant={household.status === "VERIFIED" ? "verified" : "pending"}>
            {household.status === "VERIFIED" ? "Field Verified (Dadu)" : "Pending Survey"}
          </Badge>
          <span className="font-mono text-[#772f1a] font-black text-sm">
            {household.householdId}
          </span>
        </div>

        {/* Core Info Grid */}
        <div className="grid grid-cols-2 gap-3 bg-[#fbf9f6] p-4 rounded-2xl border border-[#eadecd]">
          <div>
            <span className="text-[#6e5c54] font-semibold text-[11px]">Head of Household</span>
            <div className="font-bold text-[#2b1712] text-sm mt-0.5">{household.headOfFamily}</div>
          </div>
          <div>
            <span className="text-[#6e5c54] font-semibold text-[11px]">Family Size</span>
            <div className="font-bold text-[#2b1712] text-sm mt-0.5">{household.familySize} Members</div>
          </div>
          <div>
            <span className="text-[#6e5c54] font-semibold text-[11px]">Location</span>
            <div className="text-[#2b1712] font-medium mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#585123]" />
              {household.area}
            </div>
          </div>
          <div>
            <span className="text-[#6e5c54] font-semibold text-[11px]">Associated Pool</span>
            <div className="text-[#2b1712] font-medium mt-0.5 truncate">{household.campaignTitle || "Emergency Food"}</div>
          </div>
        </div>

        {/* Assessment Notes */}
        <div className="bg-[#fbf9f6] p-4 rounded-2xl border border-[#eadecd] space-y-1.5">
          <div className="text-[#772f1a] font-bold uppercase tracking-wider flex items-center gap-1 text-[11px]">
            <FileText className="w-3.5 h-3.5 text-[#f58549]" />
            <span>Field Assessment Notes (Off-Chain Only)</span>
          </div>
          <p className="text-[#2b1712] text-xs leading-relaxed italic">
            "{household.assessment}"
          </p>
        </div>

        {/* Voucher & Entitlement Card */}
        <div className="bg-[#fbf9f6] p-4 rounded-2xl border border-[#eadecd] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#772f1a] font-bold">
              <Ticket className="w-4 h-4 text-[#f58549]" />
              <span>Active Beneficiary Voucher</span>
            </div>
            <span className="text-[#6e5c54] text-[11px] font-semibold">Valid 30 Days</span>
          </div>

          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#eadecd] shadow-sm">
            <div>
              <div className="text-[10px] text-[#6e5c54] uppercase font-bold">Voucher PIN</div>
              <div className="text-2xl font-mono font-black text-[#772f1a] tracking-widest mt-0.5">
                {household.lastVoucherCode || "4827"}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={copyVoucherCode}
                className="text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Code"}</span>
              </Button>
              <Button
                size="sm"
                variant="primary"
                disabled={isSendingNotif}
                onClick={handleSendNotification}
                className="text-xs"
              >
                {isSendingNotif ? (
                  <span>Sending...</span>
                ) : notifSent ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Sent!
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Send className="w-3.5 h-3.5" /> Send SMS
                  </span>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 rounded-lg bg-white border border-[#eadecd]">
              <span className="text-[#6e5c54] font-semibold">Total Allocated:</span>
              <div className="font-bold text-[#772f1a] text-sm mt-0.5">
                {formatCurrencyPKR(household.entitlementAmount)}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-[#eadecd]">
              <span className="text-[#6e5c54] font-semibold">Remaining Balance:</span>
              <div className="font-bold text-[#585123] text-sm mt-0.5">
                {formatCurrencyPKR(household.remainingAmount)}
              </div>
            </div>
          </div>
        </div>

        {/* Redemption History */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#772f1a] uppercase tracking-wider flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-[#f58549]" />
            <span>Store Fulfillment History</span>
          </h4>
          <div className="space-y-1.5">
            {sampleRedemptions.map((r, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#fbf9f6] border border-[#eadecd] flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-[#2b1712]">{r.store}</div>
                  <div className="text-[10px] text-[#6e5c54] font-mono flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-[#6e5c54]" />
                    <span>{r.timestamp} • Tx: {r.txHash}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#585123]">
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
