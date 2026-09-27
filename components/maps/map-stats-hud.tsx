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
    <div className="absolute top-4 left-4 z-[500] max-w-lg w-[calc(100%-2rem)] sm:w-auto bg-white/95 backdrop-blur-md border border-[#eadecd] p-3.5 rounded-2xl shadow-xl space-y-3">
      {/* Title and live status */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#585123] animate-ping" />
          <span className="text-xs font-black text-[#772f1a] tracking-wide uppercase">
            Dadu Aid Telemetry Map
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-[#6e5c54] font-bold">
          <MapPin className="w-3.5 h-3.5 text-[#585123]" />
          <span>Sindh, Pakistan</span>
        </div>
      </div>

      {/* Mini Stat Badges */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#fbf9f6] p-2.5 rounded-xl border border-[#eadecd]">
          <div className="text-[10px] text-[#6e5c54] font-bold flex items-center gap-1">
            <Store className="w-3 h-3 text-[#f58549]" />
            <span>Kiryana Stores</span>
          </div>
          <div className="text-sm font-black text-[#772f1a] mt-0.5">{activeStoreCount} Active</div>
        </div>

        <div className="bg-[#fbf9f6] p-2.5 rounded-xl border border-[#eadecd]">
          <div className="text-[10px] text-[#6e5c54] font-bold flex items-center gap-1">
            <Users className="w-3 h-3 text-[#772f1a]" />
            <span>Families</span>
          </div>
          <div className="text-sm font-black text-[#772f1a] mt-0.5">{totalHouseholds} Verified</div>
        </div>

        <div className="bg-[#fbf9f6] p-2.5 rounded-xl border border-[#eadecd]">
          <div className="text-[10px] text-[#6e5c54] font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#585123]" />
            <span>Disbursed</span>
          </div>
          <div className="text-sm font-black text-[#585123] mt-0.5">
            {formatCurrencyPKR(totalVolumePKR)}
          </div>
        </div>
      </div>

      {/* Interactive Layer Filter Buttons */}
      <div className="flex items-center gap-1 pt-1 border-t border-[#f2e8dc]">
        <button
          onClick={() => onFilterChange("ALL")}
          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
            activeFilter === "ALL"
              ? "bg-[#772f1a] text-white"
              : "text-[#6e5c54] hover:text-[#772f1a] hover:bg-[#f5f0e8]"
          }`}
        >
          All Layers
        </button>
        <button
          onClick={() => onFilterChange("MERCHANTS")}
          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
            activeFilter === "MERCHANTS"
              ? "bg-[#f58549] text-white"
              : "text-[#6e5c54] hover:text-[#772f1a] hover:bg-[#f5f0e8]"
          }`}
        >
          Stores Only
        </button>
        <button
          onClick={() => onFilterChange("EMERGENCY")}
          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
            activeFilter === "EMERGENCY"
              ? "bg-[#943b22] text-white"
              : "text-[#6e5c54] hover:text-[#772f1a] hover:bg-[#f5f0e8]"
          }`}
        >
          Flood Risk
        </button>
        <button
          onClick={() => onFilterChange("COMMUNITY")}
          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
            activeFilter === "COMMUNITY"
              ? "bg-[#585123] text-white"
              : "text-[#6e5c54] hover:text-[#772f1a] hover:bg-[#f5f0e8]"
          }`}
        >
          Zakat Zones
        </button>
      </div>
    </div>
  );
}
