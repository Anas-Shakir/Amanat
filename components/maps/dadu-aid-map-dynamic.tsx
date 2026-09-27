"use client";

import dynamic from "next/dynamic";
import { Loader2, MapPin } from "lucide-react";

const DaduAidMap = dynamic(() => import("./dadu-aid-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-2xl border border-slate-800 bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-400">
      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 animate-pulse">
        <MapPin className="w-6 h-6" />
      </div>
      <div className="flex items-center gap-2 text-xs font-mono">
        <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
        <span>Loading Dadu Aid Network Telemetry Map...</span>
      </div>
    </div>
  ),
});

interface DaduAidMapDynamicProps {
  height?: string;
  initialSelectedStoreId?: string;
  interactive?: boolean;
}

export function DaduAidMapDynamic(props: DaduAidMapDynamicProps) {
  return <DaduAidMap {...props} />;
}
