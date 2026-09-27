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
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 bg-slate-950/95 backdrop-blur-xl border border-emerald-500/40 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-900/40">
          <Smartphone className="w-5 h-5" />
        </div>
        <div className="text-xs">
          <div className="font-bold text-white flex items-center gap-1.5">
            <span>Install Amanat PWA</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
              Fast & Offline
            </span>
          </div>
          <div className="text-slate-400 mt-0.5 text-[11px] leading-tight">
            Add to home screen for instant merchant POS keypad & field access.
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <Button
          size="sm"
          variant="primary"
          onClick={installPWA}
          className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 h-8"
        >
          <Download className="w-3.5 h-3.5 mr-1" />
          <span>Install</span>
        </Button>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
