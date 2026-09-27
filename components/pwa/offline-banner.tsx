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
      <div className="bg-[#fef4ee] border-b border-[#f7d7b5] px-4 py-2 text-xs text-[#772f1a] flex items-center justify-between z-50 sticky top-0 shadow-sm">
        <div className="flex items-center gap-2 max-w-xl">
          <WifiOff className="w-4 h-4 text-[#f58549] shrink-0" />
          <span>
            <strong>Offline Mode:</strong> Internet disconnected. Merchant redemptions will be stored locally and synced automatically when back online.
          </span>
        </div>
        {pendingQueueCount > 0 && (
          <span className="font-mono bg-[#f58549] text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold">
            {pendingQueueCount} Queued
          </span>
        )}
      </div>
    );
  }

  // Back online with pending items
  return (
    <div className="bg-[#f5f4ed] border-b border-[#d4d0b6] px-4 py-2 text-xs text-[#585123] flex items-center justify-between z-50 sticky top-0 shadow-sm">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-[#585123] shrink-0" />
        <span>
          Back online. <strong>{pendingQueueCount}</strong> pending redemptions ready to sync.
        </span>
      </div>
      <button
        onClick={handleManualSync}
        disabled={isSyncing}
        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#585123] hover:bg-[#736b32] text-white font-bold text-[11px] transition-colors"
      >
        <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
        <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
      </button>
    </div>
  );
}
