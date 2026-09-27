"use client";

import { useState, useEffect } from "react";
import { 
  HeartHandshake, 
  MapPin, 
  ShieldCheck, 
  Coins, 
  Users, 
  Store, 
  Layers, 
  ArrowUpRight, 
  Sparkles,
  Filter,
  CheckCircle2,
  Search,
  PlusCircle,
  Flame,
  Info
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { CampaignDetailsModal } from "@/components/campaigns/campaign-details-modal";
import { CreateCampaignModal } from "@/components/campaigns/create-campaign-modal";
import { Campaign } from "@/types";
import { formatCurrencyPKR } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-context";

export default function DonorPage() {
  const { role } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filterMode, setFilterMode] = useState<"ALL" | "EMERGENCY" | "COMMUNITY">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [inspectedCampaign, setInspectedCampaign] = useState<Campaign | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Funding state
  const [fundAmount, setFundAmount] = useState("10000");
  const [isSubmittingFund, setIsSubmittingFund] = useState(false);
  const [isFundingSuccess, setIsFundingSuccess] = useState(false);
  const [lastTxHash, setLastTxHash] = useState("");

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const res = await fetch("/api/campaigns");
        const data = await res.json();
        if (data.success && data.campaigns) {
          setCampaigns(data.campaigns);
        }
      } catch (err) {
        console.error("Failed to load campaigns:", err);
      }
    }
    loadCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesMode = filterMode === "ALL" || c.mode === filterMode;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMode && matchesSearch;
  });

  const totalFundedAll = campaigns.reduce((acc, c) => acc + c.fundedAmount, 0);
  const totalTargetAll = campaigns.reduce((acc, c) => acc + c.targetAmount, 0);
  const totalReachedHouseholdsAll = campaigns.reduce((acc, c) => acc + (c.reachedHouseholds || 18), 0);

  const handleFundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;
    setIsSubmittingFund(true);

    try {
      const res = await fetch(`/api/campaigns/${selectedCampaign.id}/fund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(fundAmount),
          donorName: "Anas Shakir (Donor Persona)",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setLastTxHash(data.blockchainTxHash || "0x8f2d...4c19a");
        setIsFundingSuccess(true);

        // Update local state
        setCampaigns((prev) =>
          prev.map((c) =>
            c.id === selectedCampaign.id
              ? { ...c, fundedAmount: c.fundedAmount + Number(fundAmount) }
              : c
          )
        );

        setTimeout(() => {
          setIsFundingSuccess(false);
          setSelectedCampaign(null);
        }, 2500);
      }
    } catch (err) {
      console.error("Funding error:", err);
    } finally {
      setIsSubmittingFund(false);
    }
  };

  const handleCampaignCreated = (newCamp: Campaign) => {
    setCampaigns([newCamp, ...campaigns]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="emerald">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Donor Impact Intelligence</span>
            </Badge>
            <Badge variant="onChain">Base Sepolia Relayer Active</Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Verifiable Aid Campaigns & Pools
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Entrust funds directly into community aid pools. Monitor real-time food basket fulfillment at verified Dadu kiryana stores.
          </p>
        </div>

        {/* Action button for Organizations / Admins */}
        {(role === "ORGANIZATION" || role === "ADMIN") && (
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="self-start md:self-center"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Launch Aid Pool</span>
          </Button>
        )}
      </div>

      {/* Aggregate Network Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Aid Funded"
          value={formatCurrencyPKR(totalFundedAll)}
          subtitle="Committed across all pools"
          icon={<Coins className="w-4 h-4" />}
          accentColor="emerald"
        />
        <StatCard
          title="Funding Goal"
          value={formatCurrencyPKR(totalTargetAll)}
          subtitle={`${Math.round((totalFundedAll / (totalTargetAll || 1)) * 100)}% pool capacity`}
          icon={<Sparkles className="w-4 h-4" />}
          accentColor="cyan"
        />
        <StatCard
          title="Families Assisted"
          value={`${totalReachedHouseholdsAll} Families`}
          subtitle="Verified Dadu entitlements"
          icon={<Users className="w-4 h-4" />}
          accentColor="indigo"
        />
        <StatCard
          title="Settlement Security"
          value="100% Verifiable"
          subtitle="Base Sepolia Audit Log"
          icon={<ShieldCheck className="w-4 h-4" />}
          accentColor="amber"
        />
      </div>

      {/* Search & Mode Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            type="text"
            icon={<Search className="w-4 h-4" />}
            placeholder="Search by area or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setFilterMode("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === "ALL"
                ? "bg-slate-800 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All Pools
          </button>
          <button
            onClick={() => setFilterMode("EMERGENCY")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === "EMERGENCY"
                ? "bg-rose-950 text-rose-300 border border-rose-800/50 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Emergency Relief
          </button>
          <button
            onClick={() => setFilterMode("COMMUNITY")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === "COMMUNITY"
                ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Community Welfare
          </button>
        </div>
      </div>

      {/* Campaign Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>Active Aid Pools ({filteredCampaigns.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((c) => {
            const fundingPercent = Math.min(100, Math.round((c.fundedAmount / c.targetAmount) * 100));
            const fulfillmentPercent = 72; // Default realistic fulfillment

            return (
              <Card key={c.id} className="flex flex-col justify-between hover:border-slate-700/80 group">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant={c.mode === "EMERGENCY" ? "emergency" : "community"}>
                      {c.mode === "EMERGENCY" ? "Emergency Pool" : "Community Welfare"}
                    </Badge>
                    <span className="text-[11px] font-mono text-slate-400">{c.category}</span>
                  </div>
                  <CardTitle className="group-hover:text-emerald-300 transition-colors">
                    {c.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{c.location}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                  {/* Progress bars */}
                  <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                    <ProgressBar
                      value={fundingPercent}
                      label="Funding Committed"
                      sublabel={`${formatCurrencyPKR(c.fundedAmount)} / ${formatCurrencyPKR(c.targetAmount)}`}
                      colorVariant="cyan"
                    />

                    <ProgressBar
                      value={fulfillmentPercent}
                      label="Store Fulfillment"
                      sublabel={`${fulfillmentPercent}% Handed Over`}
                      colorVariant="emerald"
                    />
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800">
                      <div className="text-slate-400">Target Families</div>
                      <div className="font-bold text-white mt-0.5">
                        {c.targetHouseholds} Households
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800">
                      <div className="text-slate-400">Partner Shops</div>
                      <div className="font-bold text-emerald-400 mt-0.5">
                        3 Kiryana Nodes
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setInspectedCampaign(c)}
                    >
                      <Info className="w-4 h-4" />
                      <span>Inspect</span>
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={() => setSelectedCampaign(c)}
                    >
                      <HeartHandshake className="w-4 h-4" />
                      <span>Contribute</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Inspect Campaign Modal */}
      <CampaignDetailsModal
        campaign={inspectedCampaign}
        isOpen={!!inspectedCampaign}
        onClose={() => setInspectedCampaign(null)}
        onFundClick={(camp) => {
          setSelectedCampaign(camp);
        }}
      />

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleCampaignCreated}
      />

      {/* Funding Contribution Modal */}
      <Modal
        isOpen={!!selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        title={isFundingSuccess ? "Contribution Confirmed!" : `Fund ${selectedCampaign?.title}`}
        description={
          isFundingSuccess
            ? "Your contribution has been recorded and allocated to verified Dadu household entitlements."
            : "Your donation enters the community aid pool. Verified local NGOs allocate entitlements to households."
        }
      >
        {isFundingSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="text-emerald-300 font-bold text-lg">
              {formatCurrencyPKR(Number(fundAmount))} Allocated
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Tx Hash: {lastTxHash}
            </p>
          </div>
        ) : (
          <form onSubmit={handleFundSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Contribution Amount (PKR)
              </label>
              <Input
                type="number"
                prefixText="Rs."
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                placeholder="10000"
                required
              />
            </div>

            {/* Preset Amount Buttons */}
            <div className="flex gap-2">
              {["5000", "10000", "25000", "50000"].map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setFundAmount(amt)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                    fundAmount === amt
                      ? "bg-emerald-950 text-emerald-300 border-emerald-500/50"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {formatCurrencyPKR(Number(amt))}
                </button>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="text-slate-300 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Intermediary Leakage Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Funds are unlocked only upon physical goods handover confirmed by authorized kiryana stores in Dadu.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedCampaign(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={isSubmittingFund}
              >
                {isSubmittingFund ? "Processing..." : "Confirm Contribution"}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
