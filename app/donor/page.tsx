"use client";

import { HeartHandshake, TrendingUp, Users, CheckCircle, ExternalLink, ShieldCheck, MapPin } from "lucide-react";
import Link from "next/link";
import { formatCurrencyPKR } from "@/lib/utils";

export default function DonorPage() {
  const sampleCampaign = {
    title: "Dadu Flood Emergency Food Relief",
    targetAmount: 100000,
    fundedAmount: 100000,
    redeemedAmount: 72000,
    targetHouseholds: 25,
    reachedHouseholds: 18,
    fulfillmentRate: 72,
    location: "Johi & Mehar, Dadu, Sindh",
    contractTx: "0x8f2d...4c19",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs font-semibold text-emerald-300 mb-2">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Donor Impact Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Verifiable Aid Campaigns
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track real-time fulfillment from pooled donations to goods handed over at local kiryana shops.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">
            Network: Base Sepolia
          </span>
        </div>
      </div>

      {/* Featured Active Campaign Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/40">
                Active Emergency Pool
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {sampleCampaign.location}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {sampleCampaign.title}
            </h2>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400 uppercase font-semibold">Total Target</div>
            <div className="text-2xl font-black text-white">{formatCurrencyPKR(sampleCampaign.targetAmount)}</div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-4 pt-2">
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
              <span>Fulfillment to Beneficiaries ({sampleCampaign.fulfillmentRate}%)</span>
              <span className="text-emerald-400 font-bold">{formatCurrencyPKR(sampleCampaign.redeemedAmount)} fulfilled</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${sampleCampaign.fulfillmentRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-xs text-slate-400 font-medium">Funded Pool</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">{formatCurrencyPKR(sampleCampaign.fundedAmount)}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">100% committed</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-xs text-slate-400 font-medium">Families Reached</div>
            <div className="text-lg font-bold text-cyan-400 mt-1">
              {sampleCampaign.reachedHouseholds} / {sampleCampaign.targetHouseholds}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Verified entitlements</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-xs text-slate-400 font-medium">Remaining Balance</div>
            <div className="text-lg font-bold text-amber-400 mt-1">
              {formatCurrencyPKR(sampleCampaign.targetAmount - sampleCampaign.redeemedAmount)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Pending merchant visits</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-xs text-slate-400 font-medium">Settlement Record</div>
            <div className="text-sm font-bold text-slate-200 mt-1 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Base Sepolia</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Gasless Relayer</div>
          </div>
        </div>
      </div>
    </div>
  );
}
