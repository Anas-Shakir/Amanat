"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { processOfflineQueue, getOfflineQueue } from "@/lib/offline/sync-queue";

interface PWAContextType {
  isOnline: boolean;
  isInstallable: boolean;
  pendingQueueCount: number;
  installPWA: () => Promise<void>;
  triggerSync: () => Promise<void>;
}

const PWAContext = createContext<PWAContextType>({
  isOnline: true,
  isInstallable: false,
  pendingQueueCount: 0,
  installPWA: async () => {},
  triggerSync: async () => {},
});

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [pendingQueueCount, setPendingQueueCount] = useState(0);

  useEffect(() => {
    // 1. Initial online check
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      setPendingQueueCount(getOfflineQueue().length);
    }

    // 2. Service Worker Registration
    if (typeof window !== "undefined" && "serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("PWA Service Worker registered with scope:", reg.scope);
        })
        .catch((err) => {
          console.warn("Service Worker registration failed:", err);
        });
    }

    // 3. Online/Offline Listeners
    const handleOnline = async () => {
      setIsOnline(true);
      const res = await processOfflineQueue();
      setPendingQueueCount(getOfflineQueue().length);
      if (res.syncedCount > 0) {
        console.log(`Successfully synced ${res.syncedCount} queued transactions.`);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setPendingQueueCount(getOfflineQueue().length);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // 4. BeforeInstallPrompt Listener
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const triggerSync = async () => {
    if (isOnline) {
      await processOfflineQueue();
      setPendingQueueCount(getOfflineQueue().length);
    }
  };

  return (
    <PWAContext.Provider
      value={{
        isOnline,
        isInstallable,
        pendingQueueCount,
        installPWA,
        triggerSync,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
}

export function usePWA() {
  return useContext(PWAContext);
}
