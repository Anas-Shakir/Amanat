"use client";

import { usePWA } from "./pwa-provider";
import { WifiOff, RefreshCw, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export function OfflineBanner() {
  const { isOnline, pendingQueueCount, triggerSync } = usePWA();
  const [isSyncing, setIsSyncing] = useState(false);

  if (isOnline && pendingQueueCount === 0) return null;

  const handleManualSync = async () => {
    setIsSyncing(true);
    await triggerSync();
    setIsSyncing(false);
  };

  if (!isOnline) {
    return (
      <div className="bg-amber-950/90 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-200 flex items-center justify-between z-50 sticky top-0 shadow-lg backdrop-blur">
        <div className="flex items-center gap-2 max-w-xl">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Offline Mode:</strong> Internet disconnected. Merchant redemptions will be stored locally and synced automatically when back online.
          </span>
        </div>
        {pendingQueueCount > 0 && (
          <span className="font-mono bg-amber-900/60 border border-amber-600/40 px-2 py-0.5 rounded text-[11px] font-bold">
            {pendingQueueCount} Queued
          </span>
        )}
      </div>
    );
  }

  // Back online with pending items
  return (
    <div className="bg-emerald-950/90 border-b border-emerald-500/30 px-4 py-2 text-xs text-emerald-200 flex items-center justify-between z-50 sticky top-0 shadow-lg backdrop-blur">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          Back online. <strong>{pendingQueueCount}</strong> pending redemptions ready to sync.
        </span>
      </div>
      <button
        onClick={handleManualSync}
        disabled={isSyncing}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-colors"
      >
        <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
        <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
      </button>
    </div>
  );
}
