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
  Layers, 
  Flame, 
  CheckCircle2, 
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
    <div className="space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="outline" className="border-[#585123]/30 text-[#585123] bg-[#585123]/5">
              <MapPin className="w-3 h-3 mr-1" /> Dadu District • Sindh, Pakistan
            </Badge>
            <Badge variant="verified">100% On-Chain Verified</Badge>
          </div>
          <h1 className="text-3xl font-black text-[#772f1a] tracking-tight">
            Geographic Aid & Merchant Network
          </h1>
          <p className="text-sm text-[#6e5c54] max-w-2xl mt-1">
            Live geospatial distribution of participating Kiryana merchants, emergency flood relief sectors, and verified beneficiary household clusters across Dadu District.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/merchant">
            <Button variant="outline" size="sm" className="text-xs">
              <Store className="w-3.5 h-3.5 mr-1.5 text-[#772f1a]" />
              <span>Merchant Terminal</span>
            </Button>
          </Link>
          <Link href="/donor">
            <Button variant="primary" size="sm" className="text-xs">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
              <span>Donor Impact</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-[#eadecd] shadow-md">
        <DaduAidMapDynamic height="620px" initialSelectedStoreId={selectedStoreId} />
      </div>

      {/* Tehsil Summary Cards & Zone Overviews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Johi Relief Sector */}
        <Card className="bg-white border-[#eadecd] shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge variant="emergency">
                <Flame className="w-3 h-3 mr-1" /> Emergency Flood Zone
              </Badge>
              <span className="font-mono text-xs text-[#6e5c54]">Tehsil Johi</span>
            </div>
            <CardTitle className="text-base text-[#772f1a] mt-2">Johi Flood Inundation Sector</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-[#6e5c54] leading-relaxed">
              Western foothill corridor near Main Nara Valley Drain. Primary ration partner: <strong className="text-[#2b1712]">Madina Kiryana Store</strong>.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#f4ede4]">
              <div className="bg-[#fbf9f6] p-2.5 rounded-xl border border-[#eadecd]">
                <span className="text-[#6e5c54] text-[10px] uppercase font-bold tracking-wider">Disbursed Aid</span>
                <div className="font-bold text-[#585123] text-sm mt-0.5">Rs. 245,000</div>
              </div>
              <div className="bg-[#fbf9f6] p-2.5 rounded-xl border border-[#eadecd]">
                <span className="text-[#6e5c54] text-[10px] uppercase font-bold tracking-wider">Served</span>
                <div className="font-bold text-[#772f1a] text-sm mt-0.5">85 Families</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Khairpur Nathan Shah */}
        <Card className="bg-white border-[#eadecd] shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge variant="pending">
                <Layers className="w-3 h-3 mr-1" /> Post-Inundation Rebuild
              </Badge>
              <span className="font-mono text-xs text-[#6e5c54]">Tehsil K.N. Shah</span>
            </div>
            <CardTitle className="text-base text-[#772f1a] mt-2">K.N. Shah Core Relief Sector</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-[#6e5c54] leading-relaxed">
              Urban-rural lowlands recovery program. Primary partner: <strong className="text-[#2b1712]">Al-Razaq Ration Mart</strong>.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#f4ede4]">
              <div className="bg-[#fbf9f6] p-2.5 rounded-xl border border-[#eadecd]">
                <span className="text-[#6e5c54] text-[10px] uppercase font-bold tracking-wider">Disbursed Aid</span>
                <div className="font-bold text-[#585123] text-sm mt-0.5">Rs. 195,000</div>
              </div>
              <div className="bg-[#fbf9f6] p-2.5 rounded-xl border border-[#eadecd]">
                <span className="text-[#6e5c54] text-[10px] uppercase font-bold tracking-wider">Served</span>
                <div className="font-bold text-[#772f1a] text-sm mt-0.5">90 Families</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mehar & Radhan */}
        <Card className="bg-white border-[#eadecd] shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge variant="community">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Community Welfare
              </Badge>
              <span className="font-mono text-xs text-[#6e5c54]">Tehsil Mehar & Radhan</span>
            </div>
            <CardTitle className="text-base text-[#772f1a] mt-2">Mehar & Radhan Safety Net</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-[#6e5c54] leading-relaxed">
              Predictable monthly Zakat ration distribution. Primary partners: <strong className="text-[#2b1712]">Bismillah Store & Radhan Mart</strong>.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#f4ede4]">
              <div className="bg-[#fbf9f6] p-2.5 rounded-xl border border-[#eadecd]">
                <span className="text-[#6e5c54] text-[10px] uppercase font-bold tracking-wider">Disbursed Aid</span>
                <div className="font-bold text-[#585123] text-sm mt-0.5">Rs. 410,000</div>
              </div>
              <div className="bg-[#fbf9f6] p-2.5 rounded-xl border border-[#eadecd]">
                <span className="text-[#6e5c54] text-[10px] uppercase font-bold tracking-wider">Served</span>
                <div className="font-bold text-[#772f1a] text-sm mt-0.5">110 Families</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Participating Merchants Directory Table */}
      <Card className="bg-white border-[#eadecd] shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base text-[#772f1a] flex items-center gap-2">
                <Store className="w-4 h-4 text-[#f58549]" />
                <span>Participating Kiryana Outlets in Dadu</span>
              </CardTitle>
              <p className="text-xs text-[#6e5c54] mt-1">
                Field-vetted grocery merchants equipped with the Amanat gasless offline-friendly keypad terminal.
              </p>
            </div>
            <Badge variant="verified" className="text-xs">
              4 Live Merchants
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#f4ede4] bg-[#fbf9f6] text-[#6e5c54] font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 pl-3">Store & Merchant</th>
                  <th className="py-3">Tehsil / Area</th>
                  <th className="py-3">Inventory Status</th>
                  <th className="py-3">Families Served</th>
                  <th className="py-3">Total Disbursed</th>
                  <th className="py-3 text-right pr-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4ede4]">
                {DADU_MERCHANT_STORES.map((store) => (
                  <tr key={store.id} className="hover:bg-[#fbf9f6] transition-colors">
                    <td className="py-3.5 pl-3">
                      <div className="font-bold text-[#2b1712]">{store.name}</div>
                      <div className="text-[11px] text-[#6e5c54] font-mono flex items-center gap-1.5 mt-0.5">
                        <span className="text-[#772f1a] font-bold">{store.merchantCode}</span>
                        <span>•</span>
                        <span>{store.ownerName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-[#2b1712]">
                      <div className="font-bold text-[#772f1a]">{store.tehsil}</div>
                      <div className="text-[11px] text-[#6e5c54] truncate max-w-xs">{store.area}</div>
                    </td>
                    <td className="py-3.5">
                      <Badge variant="verified" className="text-[10px]">
                        {store.inventoryStatus}
                      </Badge>
                    </td>
                    <td className="py-3.5 font-bold text-[#2b1712]">
                      {store.householdsServed} households
                    </td>
                    <td className="py-3.5 font-bold text-[#585123] font-mono">
                      {formatCurrencyPKR(store.totalFulfilledPKR)}
                    </td>
                    <td className="py-3.5 text-right pr-3">
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
