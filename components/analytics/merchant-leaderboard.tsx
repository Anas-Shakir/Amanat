"use client";

import { Store, MapPin, CheckCircle2, TrendingUp } from "lucide-react";
import { formatCurrencyPKR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface MerchantStat {
  name: string;
  owner: string;
  area: string;
  totalFulfilledPKR: number;
  householdsServed: number;
  averageHandoverPKR: number;
  status: string;
}

export function MerchantLeaderboard() {
  const merchants: MerchantStat[] = [
    {
      name: "Madina Kiryana Store",
      owner: "Haji Mohammad Rafiq",
      area: "Johi Main Bazaar, Dadu",
      totalFulfilledPKR: 73200,
      householdsServed: 19,
      averageHandoverPKR: 1280,
      status: "Active Node",
    },
    {
      name: "Bismillah General Store",
      owner: "Abdul Sattar Jamali",
      area: "Chowk Ghanta Ghar, Mehar",
      totalFulfilledPKR: 45000,
      householdsServed: 11,
      averageHandoverPKR: 1200,
      status: "Active Node",
    },
    {
      name: "Al-Razaq Ration Mart",
      owner: "Manzoor Ahmed",
      area: "Station Road, KN Shah",
      totalFulfilledPKR: 18000,
      householdsServed: 5,
      averageHandoverPKR: 1200,
      status: "Active Node",
    },
  ];

  return (
    <div className="space-y-3">
      {merchants.map((m, idx) => (
        <div
          key={idx}
          className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-700/40 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">
              #{idx + 1}
            </div>
            <div>
              <div className="font-bold text-white text-sm flex items-center gap-1.5">
                <span>{m.name}</span>
                <Badge variant="verified" className="text-[9px] py-0 px-1.5">
                  {m.status}
                </Badge>
              </div>
              <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{m.area} • Owner: {m.owner}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 sm:text-right">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Households Served</div>
              <div className="font-bold text-white text-sm mt-0.5">{m.householdsServed} Families</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Handed Over</div>
              <div className="font-bold text-emerald-400 text-base mt-0.5">
                {formatCurrencyPKR(m.totalFulfilledPKR)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
