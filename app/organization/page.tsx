"use client";

import { useState } from "react";
import { Users, UserPlus, FileCheck, PlusCircle, ShieldCheck, MapPin } from "lucide-react";
import { formatCurrencyPKR } from "@/lib/utils";

export default function OrganizationPage() {
  const [households] = useState([
    {
      id: "AMN-48291",
      headOfFamily: "Ghulam Nabi",
      familySize: 6,
      area: "Johi Union Council 4, Dadu",
      assessment: "Flood Displaced (2022/2024)",
      entitlementAmount: 4000,
      status: "VERIFIED",
    },
    {
      id: "AMN-48292",
      headOfFamily: "Zulekha Bibi",
      familySize: 4,
      area: "Mehar Main, Dadu",
      assessment: "Widow Household / Food Insecure",
      entitlementAmount: 4000,
      status: "VERIFIED",
    },
    {
      id: "AMN-48293",
      headOfFamily: "Ali Murad",
      familySize: 8,
      area: "Radhan Station, Dadu",
      assessment: "Crop Inundation Loss",
      entitlementAmount: 5000,
      status: "PENDING_ASSESSMENT",
    },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-xs font-semibold text-indigo-300 mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Authorized Aid Organization / Issuer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Household Verification & Entitlements
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Register vulnerable households in Dadu, attach field assessments, and issue verifiable aid vouchers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-indigo-950">
            <UserPlus className="w-4 h-4" />
            <span>Register Household</span>
          </button>
        </div>
      </div>

      {/* Household Register Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-white text-base">Registered Households (Dadu Node)</h2>
          <span className="text-xs text-slate-400">{households.length} families on record</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Household ID</th>
                <th className="py-3 px-4">Head of Family</th>
                <th className="py-3 px-4">Family Size</th>
                <th className="py-3 px-4">Area / UC</th>
                <th className="py-3 px-4">Assessment</th>
                <th className="py-3 px-4">Entitlement</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {households.map((hh) => (
                <tr key={hh.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">{hh.id}</td>
                  <td className="py-3.5 px-4 font-medium text-white">{hh.headOfFamily}</td>
                  <td className="py-3.5 px-4">{hh.familySize} members</td>
                  <td className="py-3.5 px-4 text-slate-400">{hh.area}</td>
                  <td className="py-3.5 px-4">{hh.assessment}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">{formatCurrencyPKR(hh.entitlementAmount)}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                      <ShieldCheck className="w-3 h-3" />
                      {hh.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
