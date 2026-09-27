"use client";

import { Store, ShieldCheck, MapPin, Users, HeartHandshake, Layers } from "lucide-react";
import { formatCurrencyPKR } from "@/lib/utils";

interface MapStatsHudProps {
  activeStoreCount: number;
  totalVolumePKR: number;
  totalHouseholds: number;
  activeFilter: string;
  onFilterChange: (filter: "ALL" | "MERCHANTS" | "EMERGENCY" | "COMMUNITY") => void;
}

export function MapStatsHud({
  activeStoreCount,
  totalVolumePKR,
  totalHouseholds,
  activeFilter,
  onFilterChange,
}: MapStatsHudProps) {
  return (
    <div className="absolute top-4 left-4 z-[500] max-w-lg w-[calc(100%-2rem)] sm:w-auto bg-slate-950/90 backdrop-blur-xl border border-slate-800 p-3.5 rounded-2xl shadow-2xl space-y-3">
      {/* Title and live status */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold text-white tracking-wide uppercase">
            Dadu Aid Telemetry Map
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
          <MapPin className="w-3 h-3 text-emerald-400" />
          <span>Sindh, Pakistan</span>
        </div>
      </div>

      {/* Mini Stat Badges */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800/80">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Store className="w-3 h-3 text-emerald-400" />
            <span>Kiryana Stores</span>
          </div>
          <div className="text-sm font-bold text-white mt-0.5">{activeStoreCount} Active</div>
        </div>

        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800/80">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Users className="w-3 h-3 text-cyan-400" />
            <span>Families</span>
          </div>
          <div className="text-sm font-bold text-white mt-0.5">{totalHouseholds} Verified</div>
        </div>

        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800/80">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-indigo-400" />
            <span>Disbursed</span>
          </div>
          <div className="text-sm font-bold text-emerald-400 mt-0.5">
            {formatCurrencyPKR(totalVolumePKR)}
          </div>
        </div>
      </div>

      {/* Interactive Layer Filter Buttons */}
      <div className="flex items-center gap-1 pt-1 border-t border-slate-800/80">
        <button
          onClick={() => onFilterChange("ALL")}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
            activeFilter === "ALL"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          All Layers
        </button>
        <button
          onClick={() => onFilterChange("MERCHANTS")}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
            activeFilter === "MERCHANTS"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          Stores Only
        </button>
        <button
          onClick={() => onFilterChange("EMERGENCY")}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
            activeFilter === "EMERGENCY"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          Flood Risk
        </button>
        <button
          onClick={() => onFilterChange("COMMUNITY")}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
            activeFilter === "COMMUNITY"
              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          Zakat Zones
        </button>
      </div>
    </div>
  );
}
