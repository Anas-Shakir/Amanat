"use client";

import { useState } from "react";
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
  CheckCircle2
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { formatCurrencyPKR } from "@/lib/utils";

interface CampaignItem {
  id: string;
  title: string;
  location: string;
  mode: "EMERGENCY" | "COMMUNITY";
  category: string;
  targetAmount: number;
  fundedAmount: number;
  redeemedAmount: number;
  targetHouseholds: number;
  reachedHouseholds: number;
  merchantsCount: number;
  txHash: string;
}

export default function DonorPage() {
  const [filterMode, setFilterMode] = useState<"ALL" | "EMERGENCY" | "COMMUNITY">("ALL");
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignItem | null>(null);
  const [fundAmount, setFundAmount] = useState("10000");
  const [isFundingSuccess, setIsFundingSuccess] = useState(false);

  const campaigns: CampaignItem[] = [
    {
      id: "CMP-DADU-01",
      title: "Dadu — Flood Emergency Food Relief Pool",
      location: "Johi & Mehar, Dadu, Sindh",
      mode: "EMERGENCY",
      category: "Emergency Food & Clean Water",
      targetAmount: 100000,
      fundedAmount: 100000,
      redeemedAmount: 72000,
      targetHouseholds: 25,
      reachedHouseholds: 18,
      merchantsCount: 3,
      txHash: "0x8f2d7e90c1...4c19a",
    },
    {
      id: "CMP-DADU-02",
      title: "Dadu Community — Monthly Zakat Ration Support",
      location: "Khairpur Nathan Shah, Dadu",
      mode: "COMMUNITY",
      category: "Zakat / Monthly Staple Ration",
      targetAmount: 250000,
      fundedAmount: 180000,
      redeemedAmount: 110000,
      targetHouseholds: 50,
      reachedHouseholds: 32,
      merchantsCount: 5,
      txHash: "0x3e1a8b99d...2f80c",
    },
    {
      id: "CMP-DADU-03",
      title: "Johi Union Council — Emergency Wheat & Oil Pool",
      location: "Johi Rural, Dadu",
      mode: "EMERGENCY",
      category: "Flour & Cooking Oil",
      targetAmount: 80000,
      fundedAmount: 80000,
      redeemedAmount: 45000,
      targetHouseholds: 20,
      reachedHouseholds: 11,
      merchantsCount: 2,
      txHash: "0x91d4e04f...b7182",
    },
  ];

  const filteredCampaigns = campaigns.filter((c) => {
    if (filterMode === "ALL") return true;
    return c.mode === filterMode;
  });

  const totalFundedAll = campaigns.reduce((acc, c) => acc + c.fundedAmount, 0);
  const totalRedeemedAll = campaigns.reduce((acc, c) => acc + c.redeemedAmount, 0);
  const totalReachedHouseholdsAll = campaigns.reduce((acc, c) => acc + c.reachedHouseholds, 0);

  const handleFundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFundingSuccess(true);
    setTimeout(() => {
      setIsFundingSuccess(false);
      setSelectedCampaign(null);
    }, 2000);
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
            <Badge variant="onChain">Base Sepolia #84532</Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Verifiable Aid Campaigns & Pools
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Entrust funds to community aid pools. Follow every rupee as it converts into verified food packages at local Dadu kiryana stores.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start md:self-center">
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
            Emergency Pools
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

      {/* Aggregate Network Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Aid Funded"
          value={formatCurrencyPKR(totalFundedAll)}
          subtitle="Direct donor contributions"
          icon={<Coins className="w-4 h-4" />}
          accentColor="emerald"
        />
        <StatCard
          title="Fulfillment Executed"
          value={formatCurrencyPKR(totalRedeemedAll)}
          subtitle={`${Math.round((totalRedeemedAll / totalFundedAll) * 100)}% goods handed over`}
          icon={<Sparkles className="w-4 h-4" />}
          accentColor="cyan"
        />
        <StatCard
          title="Families Assisted"
          value={`${totalReachedHouseholdsAll} Families`}
          subtitle="Verified Dadu households"
          icon={<Users className="w-4 h-4" />}
          accentColor="indigo"
        />
        <StatCard
          title="Settlement Security"
          value="100% Verifiable"
          subtitle="Relayer Base Sepolia logs"
          icon={<ShieldCheck className="w-4 h-4" />}
          accentColor="amber"
        />
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
            const fulfillmentPercent = Math.round((c.redeemedAmount / c.targetAmount) * 100);
            const fundingPercent = Math.round((c.fundedAmount / c.targetAmount) * 100);

            return (
              <Card key={c.id} className="flex flex-col justify-between hover:border-slate-700/80 group">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant={c.mode === "EMERGENCY" ? "emergency" : "community"}>
                      {c.mode === "EMERGENCY" ? "Emergency Relief" : "Community Welfare"}
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
                      sublabel={`${formatCurrencyPKR(c.redeemedAmount)} (${fulfillmentPercent}%)`}
                      colorVariant="emerald"
                    />
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800">
                      <div className="text-slate-400">Households</div>
                      <div className="font-bold text-white mt-0.5">
                        {c.reachedHouseholds} of {c.targetHouseholds} reached
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800">
                      <div className="text-slate-400">Partner Shops</div>
                      <div className="font-bold text-emerald-400 mt-0.5">
                        {c.merchantsCount} Kiryana stores
                      </div>
                    </div>
                  </div>

                  {/* Blockchain audit tag */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono bg-slate-950 px-3 py-2 rounded-lg border border-slate-800/60">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-cyan-400" />
                      Tx Proof
                    </span>
                    <span className="text-cyan-400">{c.txHash}</span>
                  </div>

                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => setSelectedCampaign(c)}
                  >
                    <span>Contribute to Pool</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Funding Modal */}
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
            <p className="text-xs text-slate-400">
              Transaction hash recorded on Base Sepolia relayer node.
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

            {/* Preset Amount Pills */}
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
                Funds are unlocked only upon cryptographic confirmation of physical goods handed over by authorized kiryana merchants in Dadu.
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
              <Button type="submit" variant="primary" className="flex-1">
                Confirm Contribution
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
