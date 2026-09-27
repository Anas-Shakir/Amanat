"use client";

import { DaduAidMapDynamic } from "@/components/maps/dadu-aid-map-dynamic";
import { DADU_MERCHANT_STORES, DADU_RELIEF_ZONES } from "@/components/maps/dadu-map-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Store, 
  ShieldCheck, 
  Users, 
  ExternalLink, 
  Layers, 
  Flame, 
  CheckCircle2, 
  Sparkles,
  ArrowUpRight,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { formatCurrencyPKR } from "@/lib/utils";
import { useState } from "react";

export default function AidMapPage() {
  const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>(undefined);

  const totalFulfilled = DADU_MERCHANT_STORES.reduce((s, m) => s + m.totalFulfilledPKR, 0);
  const totalFamilies = DADU_MERCHANT_STORES.reduce((s, m) => s + m.householdsServed, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
              <MapPin className="w-3 h-3 mr-1" /> Dadu District • Sindh, Pakistan
            </Badge>
            <Badge variant="verified">100% On-Chain Verified</Badge>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Geographic Aid & Merchant Network
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Live geospatial distribution of participating Kiryana merchants, emergency flood relief sectors, and verified beneficiary household clusters across Dadu District.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/merchant">
            <Button variant="outline" size="sm" className="text-xs">
              <Store className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              <span>Merchant Terminal</span>
            </Button>
          </Link>
          <Link href="/donor">
            <Button variant="primary" size="sm" className="text-xs bg-emerald-600 hover:bg-emerald-500">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
              <span>Donor Impact</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="relative">
        <DaduAidMapDynamic height="620px" initialSelectedStoreId={selectedStoreId} />
      </div>

      {/* Tehsil Summary Cards & Zone Overviews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Johi Relief Sector */}
        <Card className="bg-slate-950/80 border-slate-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="border-red-500/30 text-red-400">
                <Flame className="w-3 h-3 mr-1" /> Emergency Flood Zone
              </Badge>
              <span className="font-mono text-xs text-slate-400">Tehsil Johi</span>
            </div>
            <CardTitle className="text-base text-white mt-2">Johi Flood Inundation Sector</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-slate-400 leading-relaxed">
              Western foothill corridor near Main Nara Valley Drain. Primary ration partner: <strong className="text-slate-200">Madina Kiryana Store</strong>.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-900">
              <div className="bg-slate-900/60 p-2 rounded-xl">
                <span className="text-slate-500 text-[10px]">Disbursed Aid</span>
                <div className="font-bold text-emerald-400 text-sm mt-0.5">Rs. 245,000</div>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl">
                <span className="text-slate-500 text-[10px]">Served</span>
                <div className="font-bold text-white text-sm mt-0.5">85 Families</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Khairpur Nathan Shah */}
        <Card className="bg-slate-950/80 border-slate-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                <Layers className="w-3 h-3 mr-1" /> Post-Inundation Rebuild
              </Badge>
              <span className="font-mono text-xs text-slate-400">Tehsil K.N. Shah</span>
            </div>
            <CardTitle className="text-base text-white mt-2">K.N. Shah Core Relief Sector</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-slate-400 leading-relaxed">
              Urban-rural lowlands recovery program. Primary partner: <strong className="text-slate-200">Al-Razaq Ration Mart</strong>.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-900">
              <div className="bg-slate-900/60 p-2 rounded-xl">
                <span className="text-slate-500 text-[10px]">Disbursed Aid</span>
                <div className="font-bold text-emerald-400 text-sm mt-0.5">Rs. 195,000</div>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl">
                <span className="text-slate-500 text-[10px]">Served</span>
                <div className="font-bold text-white text-sm mt-0.5">90 Families</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mehar & Radhan */}
        <Card className="bg-slate-950/80 border-slate-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Community Welfare
              </Badge>
              <span className="font-mono text-xs text-slate-400">Tehsil Mehar & Radhan</span>
            </div>
            <CardTitle className="text-base text-white mt-2">Mehar & Radhan Safety Net</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-slate-400 leading-relaxed">
              Predictable monthly Zakat ration distribution. Primary partners: <strong className="text-slate-200">Bismillah Store & Radhan Mart</strong>.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-900">
              <div className="bg-slate-900/60 p-2 rounded-xl">
                <span className="text-slate-500 text-[10px]">Disbursed Aid</span>
                <div className="font-bold text-emerald-400 text-sm mt-0.5">Rs. 410,000</div>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl">
                <span className="text-slate-500 text-[10px]">Served</span>
                <div className="font-bold text-white text-sm mt-0.5">110 Families</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Participating Merchants Directory Table */}
      <Card className="bg-slate-950 border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-400" />
                <span>Participating Kiryana Outlets in Dadu</span>
              </CardTitle>
              <p className="text-xs text-slate-400 mt-1">
                Field-vetted grocery merchants equipped with the Amanat gasless offline-friendly keypad terminal.
              </p>
            </div>
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-xs">
              4 Live Merchants
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3 pl-2">Store & Merchant</th>
                  <th className="pb-3">Tehsil / Area</th>
                  <th className="pb-3">Inventory Status</th>
                  <th className="pb-3">Families Served</th>
                  <th className="pb-3">Total Disbursed</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {DADU_MERCHANT_STORES.map((store) => (
                  <tr key={store.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 pl-2">
                      <div className="font-bold text-white">{store.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                        <span className="text-emerald-400">{store.merchantCode}</span>
                        <span>•</span>
                        <span>{store.ownerName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-300">
                      <div className="font-semibold text-white">{store.tehsil}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{store.area}</div>
                    </td>
                    <td className="py-3.5">
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-300 text-[10px]">
                        {store.inventoryStatus}
                      </Badge>
                    </td>
                    <td className="py-3.5 font-bold text-white">
                      {store.householdsServed} households
                    </td>
                    <td className="py-3.5 font-bold text-emerald-400 font-mono">
                      {formatCurrencyPKR(store.totalFulfilledPKR)}
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <Link href="/merchant">
                        <Button size="sm" variant="outline" className="text-[11px] h-7 px-2.5">
                          <span>Simulate POS</span>
                          <ArrowUpRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
