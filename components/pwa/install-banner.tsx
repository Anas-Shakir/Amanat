"use client";

import { usePWA } from "./pwa-provider";
import { Download, X, Smartphone, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function InstallBanner() {
  const { isInstallable, installPWA } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("amanat_install_dismissed");
    if (isDismissed) setDismissed(true);
  }, []);

  if (!isInstallable || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("amanat_install_dismissed", "true");
  };

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 bg-white border border-[#eadecd] p-4 rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#772f1a] flex items-center justify-center text-white shrink-0 shadow-xs">
          <Smartphone className="w-5 h-5" />
        </div>
        <div className="text-xs">
          <div className="font-bold text-[#772f1a] flex items-center gap-1.5">
            <span>Install Amanat PWA</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#f5f4ed] text-[#585123] font-bold">
              Offline Ready
            </span>
          </div>
          <div className="text-[#6e5c54] mt-0.5 text-[11px] leading-tight font-medium">
            Add to home screen for instant merchant POS keypad & field access.
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <Button
          size="sm"
          variant="primary"
          onClick={installPWA}
          className="text-xs bg-[#f58549] hover:bg-[#e07133] text-white px-3 h-8 shadow-xs"
        >
          <Download className="w-3.5 h-3.5 mr-1" />
          <span>Install</span>
        </Button>
        <button
          onClick={handleDismiss}
          className="text-[#6e5c54] hover:text-[#772f1a] p-1.5 rounded-lg hover:bg-[#f5f0e8] transition-colors"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
