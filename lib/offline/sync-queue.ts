export interface QueuedRedemption {
  id: string;
  voucherCode: string;
  amount: number;
  merchantCode: string;
  itemsDelivered: string[];
  timestamp: string;
  synced: boolean;
}

const STORAGE_KEY = "amanat_offline_redemptions_queue";

export function getOfflineQueue(): QueuedRedemption[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Error reading offline queue:", err);
    return [];
  }
}

export function queueOfflineRedemption(redemption: Omit<QueuedRedemption, "id" | "synced">): QueuedRedemption {
  const queue = getOfflineQueue();
  const newEntry: QueuedRedemption = {
    ...redemption,
    id: `queue-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    synced: false,
  };
  queue.push(newEntry);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  }
  return newEntry;
}

export async function processOfflineQueue(): Promise<{ syncedCount: number; failedCount: number }> {
  const queue = getOfflineQueue();
  const pending = queue.filter((item) => !item.synced);

  if (pending.length === 0) {
    return { syncedCount: 0, failedCount: 0 };
  }

  let syncedCount = 0;
  let failedCount = 0;
  const updatedQueue = [...queue];

  for (const item of pending) {
    try {
      const res = await fetch("/api/settlement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voucherCode: item.voucherCode,
          amount: item.amount,
          merchantCode: item.merchantCode,
          itemsDelivered: item.itemsDelivered,
        }),
      });

      if (res.ok) {
        const idx = updatedQueue.findIndex((q) => q.id === item.id);
        if (idx !== -1) {
          updatedQueue[idx].synced = true;
        }
        syncedCount++;
      } else {
        failedCount++;
      }
    } catch (err) {
      console.warn("Could not sync item:", item.id, err);
      failedCount++;
    }
  }

  // Keep only unsynced or clean up synced entries older than 24 hours
  const filtered = updatedQueue.filter((q) => !q.synced);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }

  return { syncedCount, failedCount };
}
