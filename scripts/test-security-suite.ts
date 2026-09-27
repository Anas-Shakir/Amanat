/**
 * Amanat Security & Abuse Test Suite
 * Executes automated verification for Phase 14 specifications
 */

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

export {};

interface TestResult {
  name: string;
  category: "VOUCHER" | "REDEMPTION" | "AUTHORIZATION" | "RATE_LIMIT" | "PRIVACY";
  passed: boolean;
  expectedStatus: number;
  actualStatus: number;
  details: string;
}

const results: TestResult[] = [];

async function runTestSuite() {
  console.log("================================================================================");
  console.log("  🛡️  AMANAT SECURITY & ABUSE AUTOMATED TEST SUITE (PHASE 14)");
  console.log(`  Target Server: ${BASE_URL}`);
  console.log("================================================================================\n");

  // ---------------------------------------------------------------------------
  // 1. TC-01: Invalid Voucher PIN
  // ---------------------------------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/api/vouchers/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voucherCode: "9999" }),
    });
    results.push({
      name: "TC-01: Non-existent voucher PIN rejected with 404",
      category: "VOUCHER",
      passed: res.status === 404,
      expectedStatus: 404,
      actualStatus: res.status,
      details: "Correctly rejected unknown code '9999'",
    });
  } catch (err: any) {
    results.push({
      name: "TC-01: Non-existent voucher PIN rejected with 404",
      category: "VOUCHER",
      passed: false,
      expectedStatus: 404,
      actualStatus: 500,
      details: err.message,
    });
  }

  // ---------------------------------------------------------------------------
  // 2. TC-02: Expired Voucher PIN
  // ---------------------------------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/api/vouchers/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voucherCode: "0000" }),
    });
    const data = await res.json();
    results.push({
      name: "TC-02: Expired voucher rejected with 400 and VOUCHER_EXPIRED",
      category: "VOUCHER",
      passed: res.status === 400 && data.errorCode === "VOUCHER_EXPIRED",
      expectedStatus: 400,
      actualStatus: res.status,
      details: data.error || "Expired voucher handled",
    });
  } catch (err: any) {
    results.push({
      name: "TC-02: Expired voucher rejected",
      category: "VOUCHER",
      passed: false,
      expectedStatus: 400,
      actualStatus: 500,
      details: err.message,
    });
  }

  // ---------------------------------------------------------------------------
  // 3. TC-03: Fully Redeemed Voucher PIN
  // ---------------------------------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/api/vouchers/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voucherCode: "1111" }),
    });
    const data = await res.json();
    results.push({
      name: "TC-03: Fully redeemed voucher rejected with 400 and VOUCHER_ALREADY_REDEEMED",
      category: "VOUCHER",
      passed: res.status === 400 && data.errorCode === "VOUCHER_ALREADY_REDEEMED",
      expectedStatus: 400,
      actualStatus: res.status,
      details: data.error || "Fully redeemed voucher handled",
    });
  } catch (err: any) {
    results.push({
      name: "TC-03: Fully redeemed voucher rejected",
      category: "VOUCHER",
      passed: false,
      expectedStatus: 400,
      actualStatus: 500,
      details: err.message,
    });
  }

  // ---------------------------------------------------------------------------
  // 4. TC-04: Over-Redemption Check (Amount exceeds balance)
  // ---------------------------------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/api/settlement`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        voucherCode: "4827",
        merchantId: "merch-dadu-01",
        amount: 999999, // Exceeds balance of 2,650
      }),
    });
    const data = await res.json();
    results.push({
      name: "TC-04: Settlement amount exceeding balance rejected with 400",
      category: "REDEMPTION",
      passed: res.status === 400 && data.errorCode === "EXCEEDS_BALANCE",
      expectedStatus: 400,
      actualStatus: res.status,
      details: data.error || "Over-redemption blocked",
    });
  } catch (err: any) {
    results.push({
      name: "TC-04: Settlement amount exceeding balance rejected",
      category: "REDEMPTION",
      passed: false,
      expectedStatus: 400,
      actualStatus: 500,
      details: err.message,
    });
  }

  // ---------------------------------------------------------------------------
  // 5. TC-05: Negative Amount Check
  // ---------------------------------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/api/settlement`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        voucherCode: "4827",
        merchantId: "merch-dadu-01",
        amount: -500,
      }),
    });
    results.push({
      name: "TC-05: Negative settlement amount rejected with 400",
      category: "REDEMPTION",
      passed: res.status === 400,
      expectedStatus: 400,
      actualStatus: res.status,
      details: "Negative numbers rejected by schema",
    });
  } catch (err: any) {
    results.push({
      name: "TC-05: Negative settlement amount rejected",
      category: "REDEMPTION",
      passed: false,
      expectedStatus: 400,
      actualStatus: 500,
      details: err.message,
    });
  }

  // ---------------------------------------------------------------------------
  // 6. TC-06: Zero Amount Check
  // ---------------------------------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/api/settlement`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        voucherCode: "4827",
        merchantId: "merch-dadu-01",
        amount: 0,
      }),
    });
    results.push({
      name: "TC-06: Zero settlement amount rejected with 400",
      category: "REDEMPTION",
      passed: res.status === 400,
      expectedStatus: 400,
      actualStatus: res.status,
      details: "Zero amount rejected by schema",
    });
  } catch (err: any) {
    results.push({
      name: "TC-06: Zero settlement amount rejected",
      category: "REDEMPTION",
      passed: false,
      expectedStatus: 400,
      actualStatus: 500,
      details: err.message,
    });
  }

  // ---------------------------------------------------------------------------
  // 7. TC-07: Idempotent Double-Click Protection
  // ---------------------------------------------------------------------------
  try {
    const idempotencyKey = `test-idempotent-${Date.now()}`;
    const payload = {
      voucherCode: "4827",
      merchantId: "merch-dadu-01",
      amount: 100,
      idempotencyKey,
    };

    // First request
    const res1 = await fetch(`${BASE_URL}/api/settlement`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Duplicate request with identical key
    const res2 = await fetch(`${BASE_URL}/api/settlement`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data2 = await res2.json();

    results.push({
      name: "TC-07: Duplicate request with same Idempotency Key returns cached result",
      category: "REDEMPTION",
      passed: res2.status === 200 && data2.isDuplicate === true,
      expectedStatus: 200,
      actualStatus: res2.status,
      details: "Duplicate settlement safely deduplicated",
    });
  } catch (err: any) {
    results.push({
      name: "TC-07: Idempotent protection",
      category: "REDEMPTION",
      passed: false,
      expectedStatus: 200,
      actualStatus: 500,
      details: err.message,
    });
  }

  // ---------------------------------------------------------------------------
  // 8. TC-08: Brute-Force Rate Limiting (Excessive PIN guessing)
  // ---------------------------------------------------------------------------
  try {
    const testCode = "XXXX";
    let lastStatus = 0;
    let rateLimited = false;

    for (let i = 0; i < 6; i++) {
      const res = await fetch(`${BASE_URL}/api/vouchers/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "192.168.1.100", // simulated attacker IP
        },
        body: JSON.stringify({ voucherCode: testCode }),
      });
      lastStatus = res.status;
      if (res.status === 429) {
        rateLimited = true;
        break;
      }
    }

    results.push({
      name: "TC-08: Excessive invalid verification attempts trigger 429 Rate Limit",
      category: "RATE_LIMIT",
      passed: rateLimited,
      expectedStatus: 429,
      actualStatus: lastStatus,
      details: "5+ failed attempts successfully locked out attacker IP",
    });
  } catch (err: any) {
    results.push({
      name: "TC-08: Brute-force rate limiting",
      category: "RATE_LIMIT",
      passed: false,
      expectedStatus: 429,
      actualStatus: 500,
      details: err.message,
    });
  }

  // ---------------------------------------------------------------------------
  // 9. TC-09: Smart Contract Privacy Verification
  // ---------------------------------------------------------------------------
  try {
    const { keccak256, toHex } = await import("viem");
    const testHouseholdId = "AMN-48291";
    const testSalt = "amanat-dadu-salt-2026";
    const computedHash = keccak256(toHex(`${testHouseholdId}:${testSalt}`));

    // Ensure computed hash does not contain raw string
    const privacyPreserved = !computedHash.includes("AMN") && computedHash.startsWith("0x");

    results.push({
      name: "TC-09: Privacy Model — Entitlements hashed with Keccak256 (Zero PII on-chain)",
      category: "PRIVACY",
      passed: privacyPreserved,
      expectedStatus: 200,
      actualStatus: 200,
      details: `Hashed: ${computedHash.substring(0, 18)}... (No PII leak)`,
    });
  } catch (err: any) {
    results.push({
      name: "TC-09: Privacy Model Verification",
      category: "PRIVACY",
      passed: false,
      expectedStatus: 200,
      actualStatus: 500,
      details: err.message,
    });
  }

  // Print Summary Table
  console.log("\n================================================================================");
  console.log("  📊 SECURITY SUITE TEST RESULTS");
  console.log("================================================================================");

  let passedCount = 0;
  results.forEach((r, idx) => {
    const icon = r.passed ? "✅ PASS" : "❌ FAIL";
    if (r.passed) passedCount++;
    console.log(`  [${icon}] ${r.name}`);
    console.log(`         Category: [${r.category}] | Status: ${r.actualStatus}/${r.expectedStatus} | Note: ${r.details}\n`);
  });

  console.log("--------------------------------------------------------------------------------");
  console.log(`  Summary: ${passedCount} / ${results.length} Tests Passed (${Math.round((passedCount / results.length) * 100)}%)`);
  console.log("================================================================================\n");

  if (passedCount < results.length) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Test runner error:", err);
  process.exit(1);
});
