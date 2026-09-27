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
      <div className="absolute top-4 right-4 z-[500] w-full max-w-sm bg-white border border-[#eadecd] p-5 rounded-2xl shadow-xl space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#772f1a] flex items-center justify-center text-white shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-[#585123] uppercase tracking-wider font-bold">
                {selectedStore.merchantCode}
              </div>
              <h3 className="text-sm font-bold text-[#772f1a] leading-tight">
                {selectedStore.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#6e5c54] hover:text-[#772f1a] p-1 rounded-lg hover:bg-[#f5f0e8] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="verified" className="text-[10px]">
            <CheckCircle2 className="w-3 h-3 mr-1 text-[#585123]" /> Verified Partner Store
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            Stock: {selectedStore.inventoryStatus}
          </Badge>
          <Badge variant="default" className="text-[10px]">
            {selectedStore.tehsil}
          </Badge>
        </div>

        {/* Location & Contact Info */}
        <div className="bg-[#fbf9f6] p-3 rounded-xl border border-[#eadecd] space-y-2 text-xs">
          <div className="flex items-start gap-2 text-[#2b1712]">
            <MapPin className="w-3.5 h-3.5 text-[#585123] shrink-0 mt-0.5" />
            <span className="leading-snug font-medium">{selectedStore.area}</span>
          </div>
          <div className="flex items-center gap-2 text-[#2b1712]">
            <Phone className="w-3.5 h-3.5 text-[#585123] shrink-0" />
            <span className="font-mono font-bold">{selectedStore.phone}</span>
            <span className="text-[#6e5c54] text-[10px]">({selectedStore.ownerName})</span>
          </div>
        </div>

        {/* Fulfilled Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-[#fbf9f6] border border-[#eadecd]">
            <span className="text-[#6e5c54] text-[11px] font-bold">Aid Fulfilled</span>
            <div className="text-base font-black text-[#585123] mt-0.5">
              {formatCurrencyPKR(selectedStore.totalFulfilledPKR)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#fbf9f6] border border-[#eadecd]">
            <span className="text-[#6e5c54] text-[11px] font-bold">Households</span>
            <div className="text-base font-black text-[#772f1a] mt-0.5">
              {selectedStore.householdsServed} families
            </div>
          </div>
        </div>

        {/* Supported Rations */}
        <div className="space-y-1.5 text-xs">
          <div className="text-[11px] font-bold text-[#6e5c54] uppercase tracking-wider flex items-center gap-1">
            <Package className="w-3 h-3 text-[#f58549]" />
            <span>Authorized Essential Inventory</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedStore.supportedRations.map((item, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-[#f5f0e8] border border-[#eadecd] text-[11px] text-[#772f1a] font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Action Shortcut Buttons */}
        <div className="pt-1 flex gap-2">
          <Link href="/merchant" className="flex-1">
            <Button size="sm" variant="primary" className="w-full text-xs">
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
      <div className="absolute top-4 right-4 z-[500] w-full max-w-sm bg-white border border-[#eadecd] p-5 rounded-2xl shadow-xl space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs"
              style={{
                backgroundColor: `${selectedZone.color}15`,
                borderColor: selectedZone.color,
                color: selectedZone.color,
              }}
            >
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider font-bold" style={{ color: selectedZone.color }}>
                {selectedZone.type.replace("_", " ")}
              </div>
              <h3 className="text-sm font-bold text-[#772f1a] leading-tight">
                {selectedZone.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#6e5c54] hover:text-[#772f1a] p-1 rounded-lg hover:bg-[#f5f0e8] transition-colors"
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
          <Badge variant="default" className="text-[10px]">
            Tehsil: {selectedZone.tehsil}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-xs text-[#6e5c54] leading-relaxed bg-[#fbf9f6] p-3 rounded-xl border border-[#eadecd] font-medium">
          {selectedZone.description}
        </p>

        {/* Zone Statistics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-[#fbf9f6] border border-[#eadecd]">
            <span className="text-[#6e5c54] text-[11px] font-bold">Funded Pool</span>
            <div className="text-base font-black text-[#772f1a] mt-0.5">
              {formatCurrencyPKR(selectedZone.activePoolAmount)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#fbf9f6] border border-[#eadecd]">
            <span className="text-[#6e5c54] text-[11px] font-bold">Fulfilled</span>
            <div className="text-base font-black text-[#585123] mt-0.5">
              {formatCurrencyPKR(selectedZone.fulfilledAmount)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs px-1 text-[#6e5c54]">
          <span className="font-semibold">Verified Target Families:</span>
          <span className="font-bold text-[#772f1a]">{selectedZone.verifiedHouseholds} Households</span>
        </div>

        <div className="pt-1">
          <Link href="/organization" className="w-full">
            <Button size="sm" variant="secondary" className="w-full text-xs">
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
