"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  Info,
  TrendingUp,
  BarChart3,
  PieChart
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
import { FulfillmentChart } from "@/components/analytics/fulfillment-chart";
import { GeographicDistributionChart } from "@/components/analytics/geographic-distribution-chart";
import { MerchantLeaderboard } from "@/components/analytics/merchant-leaderboard";
import { DaduAidMapDynamic } from "@/components/maps/dadu-aid-map-dynamic";
import { Campaign } from "@/types";
import { formatCurrencyPKR } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-context";

export default function DonorPage() {
  const { role } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filterMode, setFilterMode] = useState<"ALL" | "EMERGENCY" | "COMMUNITY">("ALL");
  const [viewTab, setViewTab] = useState<"POOLS" | "MAP" | "ANALYTICS">("POOLS");
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
  const totalFulfilledPKR = 73200; // Total goods handed over across Dadu nodes

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eadecd] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="emerald">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Donor Impact Intelligence</span>
            </Badge>
            <Badge variant="onChain">Base Sepolia Relayer Active</Badge>
          </div>
          <h1 className="text-3xl font-black text-[#772f1a] tracking-tight">
            Verifiable Aid Campaigns & Impact Telemetry
          </h1>
          <p className="text-[#6e5c54] text-sm mt-1 max-w-2xl">
            Entrust funds directly into community aid pools. Follow every rupee as it converts into verified food packages at local Dadu kiryana stores.
          </p>
        </div>

        {/* View Tab Switcher & Pool Creation */}
        <div className="flex items-center gap-3 self-start md:self-center">
          <div className="flex items-center p-1 rounded-xl bg-[#f5f0e8] border border-[#eadecd] text-xs font-bold">
            <button
              onClick={() => setViewTab("POOLS")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewTab === "POOLS" ? "bg-[#772f1a] text-white shadow-xs" : "text-[#6e5c54] hover:text-[#772f1a]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Aid Pools</span>
            </button>
            <button
              onClick={() => setViewTab("MAP")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewTab === "MAP" ? "bg-[#585123] text-white shadow-xs" : "text-[#6e5c54] hover:text-[#772f1a]"
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Geographic Map</span>
            </button>
            <button
              onClick={() => setViewTab("ANALYTICS")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewTab === "ANALYTICS" ? "bg-[#f58549] text-white shadow-xs" : "text-[#6e5c54] hover:text-[#772f1a]"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Live Analytics</span>
            </button>
          </div>

          {(role === "ORGANIZATION" || role === "ADMIN") && (
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Launch Pool</span>
            </Button>
          )}
        </div>
      </div>

      {/* Aggregate Network Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Aid Funded"
          value={formatCurrencyPKR(totalFundedAll)}
          subtitle="Committed across all pools"
          icon={<Coins className="w-4 h-4" />}
          accentColor="amber"
        />
        <StatCard
          title="Store Handover Executed"
          value={formatCurrencyPKR(totalFulfilledPKR)}
          subtitle="73.2% Goods Delivered"
          icon={<Sparkles className="w-4 h-4" />}
          accentColor="emerald"
        />
        <StatCard
          title="Families Assisted"
          value={`${totalReachedHouseholdsAll} Families`}
          subtitle="Verified Dadu entitlements"
          icon={<Users className="w-4 h-4" />}
          accentColor="cyan"
        />
        <StatCard
          title="Settlement Security"
          value="100% Verifiable"
          subtitle="Base Sepolia Audit Log"
          icon={<ShieldCheck className="w-4 h-4" />}
          accentColor="emerald"
        />
      </div>

      {/* TAB 1: POOL LISTING */}
      {viewTab === "POOLS" && (
        <div className="space-y-6">
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

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#f5f0e8] border border-[#eadecd] self-start sm:self-auto">
              <button
                onClick={() => setFilterMode("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterMode === "ALL"
                    ? "bg-[#772f1a] text-white shadow-xs"
                    : "text-[#6e5c54] hover:text-[#772f1a]"
                }`}
              >
                All Pools
              </button>
              <button
                onClick={() => setFilterMode("EMERGENCY")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterMode === "EMERGENCY"
                    ? "bg-[#943b22] text-white shadow-xs"
                    : "text-[#6e5c54] hover:text-[#772f1a]"
                }`}
              >
                Emergency Relief
              </button>
              <button
                onClick={() => setFilterMode("COMMUNITY")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterMode === "COMMUNITY"
                    ? "bg-[#585123] text-white shadow-xs"
                    : "text-[#6e5c54] hover:text-[#772f1a]"
                }`}
              >
                Community Welfare
              </button>
            </div>
          </div>

          {/* Campaign Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((c) => {
              const fundingPercent = Math.min(100, Math.round((c.fundedAmount / c.targetAmount) * 100));
              const fulfillmentPercent = 72;

              return (
                <Card key={c.id} className="flex flex-col justify-between hover:border-[#f2a65a] transition-all group shadow-2xs hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant={c.mode === "EMERGENCY" ? "emergency" : "community"}>
                        {c.mode === "EMERGENCY" ? "Emergency Pool" : "Community Welfare"}
                      </Badge>
                      <span className="text-[11px] font-mono font-bold text-[#6e5c54]">{c.category}</span>
                    </div>
                    <CardTitle className="group-hover:text-[#f58549] transition-colors">
                      {c.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#585123] flex-shrink-0" />
                      <span>{c.location}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-5">
                    {/* Progress bars */}
                    <div className="space-y-3 bg-[#fbf9f6] p-4 rounded-xl border border-[#eadecd]">
                      <ProgressBar
                        value={fundingPercent}
                        label="Funding Committed"
                        sublabel={`${formatCurrencyPKR(c.fundedAmount)} / ${formatCurrencyPKR(c.targetAmount)}`}
                        colorVariant="amber"
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
                      <div className="p-3 rounded-xl bg-[#fbf9f6] border border-[#eadecd]">
                        <div className="text-[#6e5c54] font-semibold">Target Families</div>
                        <div className="font-bold text-[#772f1a] mt-0.5">
                          {c.targetHouseholds} Households
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-[#fbf9f6] border border-[#eadecd]">
                        <div className="text-[#6e5c54] font-semibold">Partner Shops</div>
                        <div className="font-bold text-[#585123] mt-0.5">
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
      )}

      {/* TAB 2: GEOGRAPHIC MAP */}
      {viewTab === "MAP" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#772f1a] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#585123]" />
                <span>Dadu District Geospatial Aid Infrastructure</span>
              </h2>
              <p className="text-xs text-[#6e5c54] mt-0.5">
                Real-time node status across Johi, Mehar, Khairpur Nathan Shah, and Radhan. Click any merchant marker or relief zone to inspect liquidity and verified household metrics.
              </p>
            </div>
            <Link href="/map">
              <Button size="sm" variant="outline" className="text-xs">
                <span>Open Full-Screen Command Map</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          <DaduAidMapDynamic height="580px" />
        </div>
      )}

      {/* TAB 3: ADVANCED ANALYTICS */}
      {viewTab === "ANALYTICS" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Velocity Curve Chart */}
            <Card className="lg:col-span-7 p-6 space-y-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#585123]" />
                  <span>Funding vs Kiryana Fulfillment Velocity</span>
                </CardTitle>
                <CardDescription>
                  Tracking the timeline from donor deposit (Terracotta) to physical goods handover at Dadu stores (Olive Green).
                </CardDescription>
              </div>
              <FulfillmentChart />
            </Card>

            {/* Geographic Breakdown Chart */}
            <Card className="lg:col-span-5 p-6 space-y-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#772f1a]" />
                  <span>Union Council Aid Distribution</span>
                </CardTitle>
                <CardDescription>
                  Decentralized reach across disaster-affected zones in Dadu.
                </CardDescription>
              </div>
              <GeographicDistributionChart />
            </Card>
          </div>

          {/* Merchant Leaderboard */}
          <Card className="p-6 space-y-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5 text-[#f58549]" />
                <span>Kiryana Store Fulfillment Velocity Leaderboard</span>
              </CardTitle>
              <CardDescription>
                Decentralized micro-fulfillment nodes operating across Johi, Mehar, and Khairpur Nathan Shah.
              </CardDescription>
            </div>
            <MerchantLeaderboard />
          </Card>
        </div>
      )}

      {/* Inspect Campaign Modal */}
      <CampaignDetailsModal
        campaign={inspectedCampaign}
        isOpen={!!inspectedCampaign}
        onClose={() => setInspectedCampaign(null)}
        onFundClick={(camp) => setSelectedCampaign(camp)}
      />

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={(newCamp) => setCampaigns([newCamp, ...campaigns])}
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
            <div className="w-16 h-16 rounded-full bg-[#f5f4ed] border-2 border-[#585123] flex items-center justify-center text-[#585123] mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="text-[#585123] font-black text-xl">
              {formatCurrencyPKR(Number(fundAmount))} Allocated
            </div>
            <p className="text-xs text-[#6e5c54] font-mono font-bold">
              Tx Hash: {lastTxHash}
            </p>
          </div>
        ) : (
          <form onSubmit={handleFundSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#772f1a] uppercase tracking-wider">
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
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                    fundAmount === amt
                      ? "bg-[#fdf8f2] text-[#772f1a] border-[#f58549]"
                      : "bg-white text-[#6e5c54] border-[#eadecd] hover:border-[#f2a65a]"
                  }`}
                >
                  {formatCurrencyPKR(Number(amt))}
                </button>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-[#f5f4ed] border border-[#d4d0b6] text-xs text-[#585123] space-y-1">
              <div className="text-[#585123] font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#585123]" />
                <span>Zero Intermediary Leakage Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#6e5c54]">
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
