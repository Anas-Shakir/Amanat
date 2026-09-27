"use client";

import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { 
  HeartHandshake, 
  MapPin, 
  ShieldCheck, 
  Store, 
  Users, 
  ExternalLink,
  Flame,
  CheckCircle2,
  Coins
} from "lucide-react";
import { Campaign } from "@/types";
import { formatCurrencyPKR } from "@/lib/utils";

interface CampaignDetailsModalProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onFundClick: (campaign: Campaign) => void;
}

export function CampaignDetailsModal({
  campaign,
  isOpen,
  onClose,
  onFundClick,
}: CampaignDetailsModalProps) {
  if (!campaign) return null;

  const fundingPercent = Math.round((campaign.fundedAmount / campaign.targetAmount) * 100);
  const fulfillmentPercent = Math.round(
    ((campaign.reachedHouseholds * 4000) / campaign.targetAmount) * 100
  ) || 72;

  const sampleStores = [
    { name: "Madina Kiryana Store", area: "Johi Main Bazaar, Dadu", families: 12 },
    { name: "Bismillah General Store", area: "Mehar Chowk, Dadu", families: 6 },
    { name: "Al-Razaq Ration Mart", area: "KN Shah Station Road, Dadu", families: 4 },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={campaign.title}
      description={campaign.location}
      className="max-w-2xl"
    >
      <div className="space-y-6 text-xs text-slate-300">
        {/* Badges & Mode */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant={campaign.mode === "EMERGENCY" ? "emergency" : "community"}>
              {campaign.mode === "EMERGENCY" ? "Emergency Pool" : "Community Welfare"}
            </Badge>
            <Badge variant="emerald">{campaign.category}</Badge>
          </div>
          <Badge variant="onChain">Base Sepolia #84532</Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
          {campaign.description}
        </p>

        {/* Progress & Metrics */}
        <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <ProgressBar
            value={fundingPercent}
            label="Pool Funding Status"
            sublabel={`${formatCurrencyPKR(campaign.fundedAmount)} / ${formatCurrencyPKR(campaign.targetAmount)} (${fundingPercent}%)`}
            colorVariant="cyan"
          />

          <ProgressBar
            value={fulfillmentPercent}
            label="Kiryana Store Fulfillment to Beneficiaries"
            sublabel={`${fulfillmentPercent}% Handed Over`}
            colorVariant="emerald"
          />
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-400">Target Households</div>
            <div className="text-base font-bold text-white mt-1">
              {campaign.targetHouseholds} Families
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-400">Reached So Far</div>
            <div className="text-base font-bold text-emerald-400 mt-1">
              {campaign.reachedHouseholds || 18} Families
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-400">Average Entitlement</div>
            <div className="text-base font-bold text-cyan-400 mt-1">
              Rs. 4,000 / family
            </div>
          </div>
        </div>

        {/* Participating Merchants in Dadu */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-emerald-400" />
            <span>Participating Fulfillment Nodes (Kiryana Stores)</span>
          </h4>
          <div className="space-y-1.5">
            {sampleStores.map((st, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-white">{st.name}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    {st.area}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-emerald-400 font-bold">
                    {st.families} families fulfilled
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blockchain proof */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Base Sepolia Pool Reference</span>
          </div>
          <span className="text-cyan-400">0x8f2d...4c19a</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            type="button"
            variant="primary"
            className="flex-1"
            onClick={() => {
              onClose();
              onFundClick(campaign);
            }}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Fund this Pool</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
