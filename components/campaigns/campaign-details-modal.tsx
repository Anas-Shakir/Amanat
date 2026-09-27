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
      className="max-w-2xl bg-white"
    >
      <div className="space-y-6 text-xs text-[#2b1712]">
        {/* Badges & Mode */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant={campaign.mode === "EMERGENCY" ? "emergency" : "community"}>
              {campaign.mode === "EMERGENCY" ? "Emergency Pool" : "Community Welfare"}
            </Badge>
            <Badge variant="verified">{campaign.category}</Badge>
          </div>
          <Badge variant="verified">Base Sepolia #84532</Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-[#2b1712] leading-relaxed bg-[#fbf9f6] p-4 rounded-xl border border-[#eadecd]">
          {campaign.description}
        </p>

        {/* Progress & Metrics */}
        <div className="space-y-3 bg-[#fbf9f6] p-4 rounded-2xl border border-[#eadecd]">
          <ProgressBar
            value={fundingPercent}
            label="Pool Funding Status"
            sublabel={`${formatCurrencyPKR(campaign.fundedAmount)} / ${formatCurrencyPKR(campaign.targetAmount)} (${fundingPercent}%)`}
            colorVariant="terracotta"
          />

          <ProgressBar
            value={fulfillmentPercent}
            label="Kiryana Store Fulfillment to Beneficiaries"
            sublabel={`${fulfillmentPercent}% Handed Over`}
            colorVariant="olive"
          />
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-[#fbf9f6] border border-[#eadecd]">
            <div className="text-[#6e5c54] font-semibold">Target Households</div>
            <div className="text-base font-bold text-[#772f1a] mt-1">
              {campaign.targetHouseholds} Families
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#fbf9f6] border border-[#eadecd]">
            <div className="text-[#6e5c54] font-semibold">Reached So Far</div>
            <div className="text-base font-bold text-[#585123] mt-1">
              {campaign.reachedHouseholds || 18} Families
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#fbf9f6] border border-[#eadecd]">
            <div className="text-[#6e5c54] font-semibold">Average Entitlement</div>
            <div className="text-base font-bold text-[#f58549] mt-1">
              Rs. 4,000 / family
            </div>
          </div>
        </div>

        {/* Participating Merchants in Dadu */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#772f1a] uppercase tracking-wider flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-[#f58549]" />
            <span>Participating Fulfillment Nodes (Kiryana Stores)</span>
          </h4>
          <div className="space-y-1.5">
            {sampleStores.map((st, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#fbf9f6] border border-[#eadecd] flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-[#2b1712]">{st.name}</div>
                  <div className="text-[11px] text-[#6e5c54] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#585123]" />
                    {st.area}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#585123] font-bold">
                    {st.families} families fulfilled
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blockchain proof */}
        <div className="p-3.5 rounded-xl bg-[#fbf9f6] border border-[#eadecd] flex items-center justify-between font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-[#6e5c54]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#585123]" />
            <span>Base Sepolia Pool Reference</span>
          </div>
          <span className="text-[#772f1a] font-bold">0x6767...7A9C</span>
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
