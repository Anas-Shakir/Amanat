"use client";

import { KiryanaStoreLocation, ReliefZone } from "./dadu-map-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Store, 
  MapPin, 
  Phone, 
  Package, 
  ShieldCheck, 
  ExternalLink, 
  X, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Flame,
  Layers,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { formatCurrencyPKR } from "@/lib/utils";

interface MapInspectorCardProps {
  selectedStore: KiryanaStoreLocation | null;
  selectedZone: ReliefZone | null;
  onClose: () => void;
}

export function MapInspectorCard({
  selectedStore,
  selectedZone,
  onClose,
}: MapInspectorCardProps) {
  if (!selectedStore && !selectedZone) return null;

  if (selectedStore) {
    return (
      <div className="absolute top-4 right-4 z-[500] w-full max-w-sm bg-slate-950/95 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl shadow-2xl space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                {selectedStore.merchantCode}
              </div>
              <h3 className="text-sm font-bold text-white leading-tight">
                {selectedStore.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="verified" className="text-[10px]">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Verified Partner Store
          </Badge>
          <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-300">
            Stock: {selectedStore.inventoryStatus}
          </Badge>
          <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-300">
            {selectedStore.tehsil}
          </Badge>
        </div>

        {/* Location & Contact Info */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 space-y-2 text-xs">
          <div className="flex items-start gap-2 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{selectedStore.area}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-mono">{selectedStore.phone}</span>
            <span className="text-slate-500 text-[10px]">({selectedStore.ownerName})</span>
          </div>
        </div>

        {/* Fulfilled Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 text-[11px]">Aid Fulfilled</span>
            <div className="text-base font-bold text-emerald-400 mt-0.5">
              {formatCurrencyPKR(selectedStore.totalFulfilledPKR)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 text-[11px]">Households</span>
            <div className="text-base font-bold text-white mt-0.5">
              {selectedStore.householdsServed} families
            </div>
          </div>
        </div>

        {/* Supported Rations */}
        <div className="space-y-1.5 text-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Package className="w-3 h-3 text-cyan-400" />
            <span>Authorized Essential Inventory</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedStore.supportedRations.map((item, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Action Shortcut Buttons */}
        <div className="pt-1 flex gap-2">
          <Link href="/merchant" className="flex-1">
            <Button size="sm" variant="primary" className="w-full text-xs bg-emerald-600 hover:bg-emerald-500">
              <span>Open Merchant POS</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
          <Link href="/admin" className="flex-1">
            <Button size="sm" variant="outline" className="w-full text-xs">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              <span>Relayer Proof</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (selectedZone) {
    return (
      <div className="absolute top-4 right-4 z-[500] w-full max-w-sm bg-slate-950/95 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl shadow-2xl space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center border"
              style={{
                backgroundColor: `${selectedZone.color}20`,
                borderColor: selectedZone.color,
                color: selectedZone.color,
              }}
            >
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider font-semibold" style={{ color: selectedZone.color }}>
                {selectedZone.type.replace("_", " ")}
              </div>
              <h3 className="text-sm font-bold text-white leading-tight">
                {selectedZone.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Risk Badge */}
        <div className="flex items-center gap-1.5">
          <Badge 
            variant="outline"
            className="text-[10px] font-bold"
            style={{ borderColor: selectedZone.color, color: selectedZone.color }}
          >
            <Flame className="w-3 h-3 mr-1" /> Risk: {selectedZone.riskLevel}
          </Badge>
          <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-300">
            Tehsil: {selectedZone.tehsil}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          {selectedZone.description}
        </p>

        {/* Zone Statistics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 text-[11px]">Funded Pool</span>
            <div className="text-base font-bold text-white mt-0.5">
              {formatCurrencyPKR(selectedZone.activePoolAmount)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 text-[11px]">Fulfilled</span>
            <div className="text-base font-bold text-emerald-400 mt-0.5">
              {formatCurrencyPKR(selectedZone.fulfilledAmount)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs px-1 text-slate-400">
          <span>Verified Target Families:</span>
          <span className="font-bold text-white">{selectedZone.verifiedHouseholds} Households</span>
        </div>

        <div className="pt-1">
          <Link href="/organization" className="w-full">
            <Button size="sm" variant="primary" className="w-full text-xs bg-indigo-600 hover:bg-indigo-500">
              <Users className="w-3.5 h-3.5 mr-1.5" />
              <span>Manage Households in this Zone</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
