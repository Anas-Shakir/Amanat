interface RateLimitRecord {
  attempts: number;
  firstAttemptTime: number;
  lockedUntil?: number;
}

const ATTEMPT_MAP = new Map<string, RateLimitRecord>();
const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MS = 60 * 1000; // 1 minute window
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minute lockout

/**
 * Checks if a specific key (e.g. IP or voucher code) is currently locked out
 */
export function checkRateLimit(key: string): { allowed: boolean; remainingAttempts: number; lockedForSeconds?: number } {
  const now = Date.now();
  const record = ATTEMPT_MAP.get(key);

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  // If locked, check if lockout expired
  if (record.lockedUntil) {
    if (now < record.lockedUntil) {
      const remainingSecs = Math.ceil((record.lockedUntil - now) / 1000);
      return { allowed: false, remainingAttempts: 0, lockedForSeconds: remainingSecs };
    } else {
      // Lockout expired, reset record
      ATTEMPT_MAP.delete(key);
      return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
    }
  }

  // Check if sliding window has elapsed
  if (now - record.firstAttemptTime > WINDOW_MS) {
    ATTEMPT_MAP.delete(key);
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - record.attempts);
  return { allowed: remaining > 0, remainingAttempts: remaining };
}

/**
 * Records a failed attempt for a given key
 */
export function recordFailedAttempt(key: string): { isNowLocked: boolean; lockedForSeconds?: number } {
  const now = Date.now();
  const record = ATTEMPT_MAP.get(key);

  if (!record || now - record.firstAttemptTime > WINDOW_MS) {
    ATTEMPT_MAP.set(key, { attempts: 1, firstAttemptTime: now });
    return { isNowLocked: false };
  }

  record.attempts += 1;

  if (record.attempts >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    return { isNowLocked: true, lockedForSeconds: LOCKOUT_DURATION_MS / 1000 };
  }

  return { isNowLocked: false };
}

/**
 * Clears failed attempts upon successful authentication/verification
 */
export function resetRateLimit(key: string): void {
  ATTEMPT_MAP.delete(key);
}
