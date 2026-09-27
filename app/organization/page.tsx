"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  MapPin, 
  PlusCircle, 
  Search, 
  Filter, 
  Ticket, 
  CheckCircle2, 
  Layers, 
  HeartHandshake,
  FileSpreadsheet,
  Info
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { CreateCampaignModal } from "@/components/campaigns/create-campaign-modal";
import { HouseholdDetailsModal } from "@/components/households/household-details-modal";
import { Campaign } from "@/types";
import { formatCurrencyPKR } from "@/lib/utils";

interface HouseholdItem {
  id: string;
  householdId: string;
  headOfFamily: string;
  familySize: number;
  area: string;
  assessment: string;
  entitlementAmount: number;
  remainingAmount: number;
  status: "VERIFIED" | "PENDING" | "FLAGGED";
  lastVoucherCode: string;
  campaignTitle?: string;
}

export default function OrganizationPage() {
  const [households, setHouseholds] = useState<HouseholdItem[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "VERIFIED" | "PENDING">("ALL");

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const [inspectedHousehold, setInspectedHousehold] = useState<HouseholdItem | null>(null);

  // Form states for new household
  const [newHeadName, setNewHeadName] = useState("");
  const [newFamilySize, setNewFamilySize] = useState("5");
  const [newArea, setNewArea] = useState("Johi Rural, Dadu");
  const [newAssessment, setNewAssessment] = useState("Flood Affected / Priority Category A");
  const [newAmount, setNewAmount] = useState("4000");
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [hhRes, campRes] = await Promise.all([
          fetch("/api/households"),
          fetch("/api/campaigns"),
        ]);
        const hhData = await hhRes.json();
        const campData = await campRes.json();

        if (hhData.success && hhData.households) {
          setHouseholds(hhData.households);
        }
        if (campData.success && campData.campaigns) {
          setCampaigns(campData.campaigns);
          if (campData.campaigns.length > 0) {
            setSelectedCampaignId(campData.campaigns[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load organization data:", err);
      }
    }
    loadData();
  }, []);

  const handleRegisterHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/households", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headOfHousehold: newHeadName,
          familySize: Number(newFamilySize) || 5,
          area: newArea,
          city: "Dadu",
          displacementStatus: "Flood Displaced",
          assessment: newAssessment,
          campaignId: selectedCampaignId || campaigns[0]?.id || "cmp-01",
          entitlementAmount: Number(newAmount) || 4000,
        }),
      });

      const data = await res.json();
      if (data.success && data.household) {
        const campObj = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];
        setHouseholds([
          {
            ...data.household,
            campaignTitle: campObj?.title || "Dadu Flood Emergency Food Relief",
          },
          ...households,
        ]);
        setIsRegisterModalOpen(false);
        setNewHeadName("");
      }
    } catch (err) {
      console.error("Household creation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredHouseholds = households.filter((h) => {
    const matchesStatus = statusFilter === "ALL" || h.status === statusFilter;
    const matchesSearch =
      h.headOfFamily.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.householdId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalEntrusted = households.reduce((acc, h) => acc + h.entitlementAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="indigo">
              <Users className="w-3.5 h-3.5" />
              <span>Authorized Relief Partner Node</span>
            </Badge>
            <Badge variant="emerald">Sindh Relief Foundation (Dadu)</Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Household Registry & Entitlement Issuance
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Register vulnerable families, conduct dignified assessments, and allocate food vouchers against approved aid pools. PII remains off-chain.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsCreateCampaignOpen(true)}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Launch Aid Pool</span>
          </Button>

          <Button
            variant="primary"
            onClick={() => setIsRegisterModalOpen(true)}
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Household</span>
          </Button>
        </div>
      </div>

      {/* Summary Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Verified Families"
          value={households.length}
          subtitle="Dadu field records"
          icon={<Users className="w-4 h-4" />}
          accentColor="indigo"
        />
        <StatCard
          title="Total Aid Entrusted"
          value={formatCurrencyPKR(totalEntrusted)}
          subtitle="Allocated to vouchers"
          icon={<Ticket className="w-4 h-4" />}
          accentColor="emerald"
        />
        <StatCard
          title="Active Aid Pools"
          value={`${campaigns.length} Pools`}
          subtitle="Emergency & Community"
          icon={<Layers className="w-4 h-4" />}
          accentColor="cyan"
        />
      </div>

      {/* Search & Status Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            type="text"
            icon={<Search className="w-4 h-4" />}
            placeholder="Search by ID, name, or UC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === "ALL"
                ? "bg-slate-800 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All Families
          </button>
          <button
            onClick={() => setStatusFilter("VERIFIED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === "VERIFIED"
                ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Verified ({households.filter((h) => h.status === "VERIFIED").length})
          </button>
          <button
            onClick={() => setStatusFilter("PENDING")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === "PENDING"
                ? "bg-amber-950 text-amber-300 border border-amber-800/50 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Pending Survey
          </button>
        </div>
      </div>

      {/* Registry Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Household Aid Records (Dadu Basin)</CardTitle>
              <CardDescription>
                Click any household row to inspect field survey notes, view redemption history, or copy SMS voucher codes.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Household ID</th>
                  <th className="py-3 px-4">Head of Household</th>
                  <th className="py-3 px-4">Family Size</th>
                  <th className="py-3 px-4">Associated Aid Pool</th>
                  <th className="py-3 px-4">Area / UC</th>
                  <th className="py-3 px-4">Allocated</th>
                  <th className="py-3 px-4">Remaining</th>
                  <th className="py-3 px-4">Voucher PIN</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredHouseholds.map((hh) => (
                  <tr
                    key={hh.id}
                    className="hover:bg-slate-850/60 transition-colors cursor-pointer"
                    onClick={() => setInspectedHousehold(hh)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                      {hh.householdId}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white">{hh.headOfFamily}</td>
                    <td className="py-3.5 px-4">{hh.familySize} members</td>
                    <td className="py-3.5 px-4 text-slate-300 truncate max-w-[160px]">
                      {hh.campaignTitle || "Emergency Food Pool"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{hh.area}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {formatCurrencyPKR(hh.entitlementAmount)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      {formatCurrencyPKR(hh.remainingAmount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-600/40">
                        {hh.lastVoucherCode || "4827"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={hh.status === "VERIFIED" ? "verified" : "pending"}>
                        {hh.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px]">
                        <Info className="w-3.5 h-3.5 mr-1" />
                        <span>View</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Household Details Modal */}
      <HouseholdDetailsModal
        household={inspectedHousehold}
        isOpen={!!inspectedHousehold}
        onClose={() => setInspectedHousehold(null)}
      />

      {/* Register Household Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Register Vulnerable Household"
        description="Attach field survey details and issue an initial aid entitlement for Dadu relief."
      >
        <form onSubmit={handleRegisterHousehold} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold uppercase tracking-wider">
              Associate with Aid Pool
            </label>
            <select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="w-full h-11 rounded-xl border border-slate-700 bg-slate-950 px-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.mode === "EMERGENCY" ? "Emergency" : "Community"})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold uppercase tracking-wider">
              Head of Household Name
            </label>
            <Input
              type="text"
              value={newHeadName}
              onChange={(e) => setNewHeadName(e.target.value)}
              placeholder="e.g. Allah Dino / Maryam Bibi"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold uppercase tracking-wider">
                Family Size
              </label>
              <Input
                type="number"
                value={newFamilySize}
                onChange={(e) => setNewFamilySize(e.target.value)}
                placeholder="6"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold uppercase tracking-wider">
                Entitlement Amount (PKR)
              </label>
              <Input
                type="number"
                prefixText="Rs."
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="4000"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold uppercase tracking-wider">
              Location / Union Council (Dadu)
            </label>
            <Input
              type="text"
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              placeholder="e.g. Johi UC 4, Dadu"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold uppercase tracking-wider">
              Field Assessment Notes
            </label>
            <Input
              type="text"
              value={newAssessment}
              onChange={(e) => setNewAssessment(e.target.value)}
              placeholder="e.g. Inundated Farmland / Extreme Food Insecurity"
              required
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Privacy Assurance
            </span>
            <p>
              This record generates a unique internal ID (e.g. AMN-48294). No personal names or phone numbers are stored on public blockchain layers.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsRegisterModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={isSubmitting || !newHeadName}
            >
              {isSubmitting ? "Registering..." : "Save & Generate Voucher"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={isCreateCampaignOpen}
        onClose={() => setIsCreateCampaignOpen(false)}
        onCreated={(newCamp) => setCampaigns([newCamp, ...campaigns])}
      />
    </div>
  );
}
