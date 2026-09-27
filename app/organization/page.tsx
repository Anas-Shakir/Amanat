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
  HeartHandshake
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { CreateCampaignModal } from "@/components/campaigns/create-campaign-modal";
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
  status: "VERIFIED" | "PENDING_ASSESSMENT" | "FLAGGED";
  lastVoucherCode: string;
  campaignTitle?: string;
}

export default function OrganizationPage() {
  const [households, setHouseholds] = useState<HouseholdItem[]>([
    {
      id: "1",
      householdId: "AMN-48291",
      headOfFamily: "Ghulam Nabi",
      familySize: 6,
      area: "Johi Union Council 4, Dadu",
      assessment: "Flood Displaced (2022/2024)",
      entitlementAmount: 4000,
      remainingAmount: 2650,
      status: "VERIFIED",
      lastVoucherCode: "4827",
      campaignTitle: "Dadu Flood Emergency Food Relief",
    },
    {
      id: "2",
      householdId: "AMN-48292",
      headOfFamily: "Zulekha Bibi",
      familySize: 4,
      area: "Mehar Main Bazaar, Dadu",
      assessment: "Widow Household / Food Insecure",
      entitlementAmount: 4000,
      remainingAmount: 4000,
      status: "VERIFIED",
      lastVoucherCode: "5914",
      campaignTitle: "Dadu Flood Emergency Food Relief",
    },
    {
      id: "3",
      householdId: "AMN-48293",
      headOfFamily: "Ali Murad",
      familySize: 8,
      area: "Radhan Station, Dadu",
      assessment: "Crop Inundation Loss",
      entitlementAmount: 5000,
      remainingAmount: 5000,
      status: "PENDING_ASSESSMENT",
      lastVoucherCode: "8203",
      campaignTitle: "Dadu Community Zakat Support",
    },
  ]);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);

  // Form states for new household
  const [newHeadName, setNewHeadName] = useState("");
  const [newFamilySize, setNewFamilySize] = useState("5");
  const [newArea, setNewArea] = useState("Johi Rural, Dadu");
  const [newAssessment, setNewAssessment] = useState("Flood Affected / Priority Category A");
  const [newAmount, setNewAmount] = useState("4000");
  const [selectedCampaignId, setSelectedCampaignId] = useState("");

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await fetch("/api/campaigns");
        const data = await res.json();
        if (data.success && data.campaigns) {
          setCampaigns(data.campaigns);
          if (data.campaigns.length > 0) {
            setSelectedCampaignId(data.campaigns[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load campaigns:", err);
      }
    }
    fetchCampaigns();
  }, []);

  const handleRegisterHousehold = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `AMN-${Math.floor(10000 + Math.random() * 90000)}`;
    const newVoucher = `${Math.floor(1000 + Math.random() * 9000)}`;
    const campObj = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

    const newEntry: HouseholdItem = {
      id: String(households.length + 1),
      householdId: newId,
      headOfFamily: newHeadName,
      familySize: Number(newFamilySize) || 5,
      area: newArea,
      assessment: newAssessment,
      entitlementAmount: Number(newAmount) || 4000,
      remainingAmount: Number(newAmount) || 4000,
      status: "VERIFIED",
      lastVoucherCode: newVoucher,
      campaignTitle: campObj?.title || "Dadu Flood Relief",
    };

    setHouseholds([newEntry, ...households]);
    setIsRegisterModalOpen(false);
    setNewHeadName("");
  };

  const handleCampaignCreated = (newCamp: Campaign) => {
    setCampaigns([newCamp, ...campaigns]);
  };

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
          value={formatCurrencyPKR(households.reduce((acc, h) => acc + h.entitlementAmount, 0))}
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

      {/* Registry Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Household Aid Records (Dadu Basin)</CardTitle>
              <CardDescription>
                Click any household to view entitlement details or re-issue SMS voucher codes.
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
                  <th className="py-3 px-4">Assessment</th>
                  <th className="py-3 px-4">Allocated</th>
                  <th className="py-3 px-4">Remaining</th>
                  <th className="py-3 px-4">Voucher</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {households.map((hh) => (
                  <tr key={hh.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                      {hh.householdId}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white">{hh.headOfFamily}</td>
                    <td className="py-3.5 px-4">{hh.familySize} members</td>
                    <td className="py-3.5 px-4 text-slate-300 truncate max-w-[160px]">
                      {hh.campaignTitle || "Emergency Pool"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{hh.area}</td>
                    <td className="py-3.5 px-4 text-slate-300">{hh.assessment}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {formatCurrencyPKR(hh.entitlementAmount)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      {formatCurrencyPKR(hh.remainingAmount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-600/40">
                        {hh.lastVoucherCode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={hh.status === "VERIFIED" ? "verified" : "pending"}>
                        {hh.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

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
            <Button type="submit" variant="primary" className="flex-1">
              Save & Generate Voucher
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={isCreateCampaignOpen}
        onClose={() => setIsCreateCampaignOpen(false)}
        onCreated={handleCampaignCreated}
      />
    </div>
  );
}
