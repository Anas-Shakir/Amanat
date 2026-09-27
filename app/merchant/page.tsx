"use client";

import { useState } from "react";
import { 
  Store, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  ArrowLeft, 
  RotateCcw,
  Sparkles,
  MapPin,
  Clock,
  Printer,
  Copy
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrencyPKR } from "@/lib/utils";

interface VerifiedVoucherData {
  code: string;
  householdId: string;
  headOfHousehold?: string;
  campaignTitle: string;
  totalEntitlement: number;
  alreadyRedeemed: number;
  remainingAmount: number;
  status: string;
  category: string;
}

export default function MerchantPage() {
  const [voucherCode, setVoucherCode] = useState("");
  const [step, setStep] = useState<"ENTER" | "VERIFIED" | "CONFIRMED">("ENTER");
  const [fulfillAmount, setFulfillAmount] = useState("1200");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verifiedData, setVerifiedData] = useState<VerifiedVoucherData | null>(null);
  const [redemptionReceipt, setRedemptionReceipt] = useState<any | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  const handleKeypadPress = (digit: string) => {
    if (voucherCode.length < 6) {
      setVoucherCode((prev) => prev + digit);
      setErrorMessage("");
    }
  };

  const handleKeypadBackspace = () => {
    setVoucherCode((prev) => prev.slice(0, -1));
    setErrorMessage("");
  };

  const handleVerify = async (codeToTest?: string) => {
    const code = (codeToTest || voucherCode).trim();
    if (!code || code.length < 3) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/vouchers/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voucherCode: code }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.voucher) {
        setVerifiedData(data.voucher);
        // Default fulfillment amount to Rs. 1,200 or remaining
        const defaultAmt = Math.min(1200, data.voucher.remainingAmount);
        setFulfillAmount(String(defaultAmt));
        setStep("VERIFIED");
      } else {
        setErrorMessage(data.error || "Voucher code not found. Try demo code '4827'.");
      }
    } catch (err: any) {
      setErrorMessage("Network error during verification. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmFulfillment = async () => {
    if (!verifiedData) return;
    const amountNum = Number(fulfillAmount);

    if (isNaN(amountNum) || amountNum <= 0) {
      setErrorMessage("Enter a valid amount.");
      return;
    }

    if (amountNum > verifiedData.remainingAmount) {
      setErrorMessage(`Amount exceeds remaining balance of ${formatCurrencyPKR(verifiedData.remainingAmount)}`);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/settlement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voucherCode: verifiedData.code,
          merchantId: "merch-dadu-01",
          amount: amountNum,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.redemption) {
        setRedemptionReceipt(data.redemption);
        setStep("CONFIRMED");
      } else {
        setErrorMessage(data.error || "Failed to settle redemption. Please try again.");
      }
    } catch (err) {
      // Offline fallback: Queue redemption locally
      const { queueOfflineRedemption } = await import("@/lib/offline/sync-queue");
      const queued = queueOfflineRedemption({
        voucherCode: verifiedData.code,
        merchantCode: "MER-DADU-01",
        amount: amountNum,
        itemsDelivered: ["Emergency Food Package (Offline Handover)"],
        timestamp: new Date().toISOString(),
      });

      setRedemptionReceipt({
        id: queued.id,
        householdId: verifiedData.householdId,
        fulfilledAmount: amountNum,
        remainingBalance: Math.max(0, verifiedData.remainingAmount - amountNum),
        merchantStore: "Madina Kiryana Store (Johi)",
        blockchainTxHash: "PENDING_OFFLINE_SYNC",
        timestamp: new Date().toLocaleTimeString(),
        isOfflineQueued: true,
      });
      setStep("CONFIRMED");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep("ENTER");
    setVoucherCode("");
    setErrorMessage("");
    setVerifiedData(null);
    setRedemptionReceipt(null);
  };

  const copyReceiptDetails = () => {
    if (!redemptionReceipt) return;
    const txt = `AMANAT FULFILLMENT RECEIPT\nReceipt ID: ${redemptionReceipt.id}\nHousehold: ${redemptionReceipt.householdId}\nFulfilled: Rs. ${redemptionReceipt.fulfilledAmount}\nRemaining: Rs. ${redemptionReceipt.remainingBalance}\nTx Proof: ${redemptionReceipt.blockchainTxHash}\nTime: ${redemptionReceipt.timestamp}`;
    navigator.clipboard.writeText(txt);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 w-full space-y-6">
      {/* Merchant Header / Node Identifier */}
      <div className="bg-white border border-[#eadecd] rounded-2xl p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#772f1a] flex items-center justify-center text-white shadow-xs">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#6e5c54]">
              Merchant Node #MER-02
            </div>
            <div className="text-base font-bold text-[#772f1a] leading-tight">
              Madina Kiryana Store
            </div>
            <div className="text-xs text-[#585123] font-bold flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Johi Main Bazaar, Dadu • Authorized</span>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 1: Tactile Voucher Entry Keypad */}
      {step === "ENTER" && (
        <div className="bg-white border border-[#eadecd] rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-[#772f1a]">Enter Voucher PIN</h2>
            <p className="text-xs text-[#6e5c54]">
              Ask beneficiary for their 4-digit SMS / WhatsApp code.
            </p>
          </div>

          {/* Display Screen */}
          <div className="bg-[#fbf9f6] rounded-2xl border-2 border-[#f2a65a] p-4 text-center">
            <div className="text-4xl font-mono font-black text-[#772f1a] tracking-[0.3em] min-h-[48px] flex items-center justify-center">
              {voucherCode ? voucherCode : <span className="text-[#a8978c]">_ _ _ _</span>}
            </div>
            {errorMessage && (
              <div className="text-xs text-[#943b22] font-bold mt-2 flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Touch-Friendly Numeric Keypad */}
          <div className="grid grid-cols-3 gap-2.5">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeypadPress(digit)}
                className="h-14 rounded-2xl bg-[#f5f0e8] hover:bg-[#fae4cb] active:bg-[#f2a65a] border border-[#eadecd] text-[#772f1a] font-extrabold text-2xl transition-all select-none shadow-2xs cursor-pointer"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleKeypadBackspace}
              className="h-14 rounded-2xl bg-[#f5f0e8] hover:bg-[#fae4cb] active:bg-[#f2a65a] border border-[#eadecd] text-[#6e5c54] font-bold text-sm transition-all select-none cursor-pointer"
            >
              DEL
            </button>
            <button
              type="button"
              onClick={() => handleKeypadPress("0")}
              className="h-14 rounded-2xl bg-[#f5f0e8] hover:bg-[#fae4cb] active:bg-[#f2a65a] border border-[#eadecd] text-[#772f1a] font-extrabold text-2xl transition-all select-none shadow-2xs cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => {
                setVoucherCode("4827");
                handleVerify("4827");
              }}
              className="h-14 rounded-2xl bg-[#585123] hover:bg-[#736b32] text-white font-bold text-xs transition-all select-none flex items-center justify-center text-center leading-tight shadow-xs cursor-pointer"
            >
              Demo (4827)
            </button>
          </div>

          {/* Action Button */}
          <Button
            variant="merchant"
            size="xl"
            className="w-full shadow-md"
            disabled={voucherCode.length < 3 || isLoading}
            onClick={() => handleVerify()}
          >
            <span>{isLoading ? "Verifying with Node..." : "Verify Voucher"}</span>
          </Button>
        </div>
      )}

      {/* STEP 2: Entitlement Verified & Amount Selection */}
      {step === "VERIFIED" && verifiedData && (
        <div className="bg-white border-2 border-[#585123] rounded-3xl p-6 space-y-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <Badge variant="verified" className="text-xs py-1 px-3">
              <CheckCircle2 className="w-4 h-4 text-[#585123]" />
              <span>VALID CODE #{verifiedData.code}</span>
            </Badge>
            <button
              onClick={handleReset}
              className="text-xs text-[#6e5c54] hover:text-[#772f1a] font-bold flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          {/* Household summary */}
          <div className="bg-[#fbf9f6] rounded-2xl border border-[#eadecd] p-4 space-y-3 text-xs">
            <div className="flex justify-between text-[#6e5c54]">
              <span>Household Reference:</span>
              <span className="font-mono font-bold text-[#772f1a] text-sm">
                {verifiedData.householdId}
              </span>
            </div>
            <div className="flex justify-between text-[#6e5c54]">
              <span>Campaign Pool:</span>
              <span className="text-[#2b1712] font-semibold truncate max-w-[180px]">
                {verifiedData.campaignTitle}
              </span>
            </div>
            <div className="flex justify-between text-[#6e5c54]">
              <span>Original Entitlement:</span>
              <span className="text-[#772f1a] font-bold">
                {formatCurrencyPKR(verifiedData.totalEntitlement)}
              </span>
            </div>
            <div className="flex justify-between text-[#6e5c54]">
              <span>Already Handed Over:</span>
              <span className="text-[#6e5c54] font-medium">
                {formatCurrencyPKR(verifiedData.alreadyRedeemed)}
              </span>
            </div>
            <div className="pt-2 border-t border-[#eadecd] flex justify-between items-center">
              <span className="text-xs font-bold text-[#2b1712]">Available Balance:</span>
              <span className="text-2xl font-black text-[#585123]">
                {formatCurrencyPKR(verifiedData.remainingAmount)}
              </span>
            </div>
          </div>

          {/* Handover Amount Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#772f1a] uppercase tracking-wider">
              Goods Amount to Hand Over:
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#772f1a] font-black text-xl">
                Rs.
              </span>
              <input
                type="number"
                max={verifiedData.remainingAmount}
                value={fulfillAmount}
                onChange={(e) => setFulfillAmount(e.target.value)}
                className="w-full text-left pl-14 pr-4 py-4 rounded-2xl bg-white border-2 border-[#f58549] text-[#772f1a] font-black text-2xl focus:outline-none focus:ring-2 focus:ring-[#f58549]/20 shadow-2xs"
              />
            </div>

            {/* Quick Partial Amount Buttons */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[
                { label: "Rs. 500", val: "500" },
                { label: "Rs. 1,000", val: "1000" },
                { label: "Rs. 1,200", val: "1200" },
                { label: "Full Max", val: String(verifiedData.remainingAmount) },
              ].map((btn, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFulfillAmount(btn.val)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    fulfillAmount === btn.val
                      ? "bg-[#f58549] text-white border-[#f58549]"
                      : "bg-[#f5f0e8] text-[#772f1a] border-[#eadecd] hover:border-[#f2a65a]"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {errorMessage && (
              <div className="text-xs text-[#943b22] font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Confirm Button */}
          <Button
            variant="merchant"
            size="xl"
            className="w-full shadow-md"
            disabled={isLoading || Number(fulfillAmount) <= 0 || Number(fulfillAmount) > verifiedData.remainingAmount}
            onClick={handleConfirmFulfillment}
          >
            <span>{isLoading ? "Processing Settlement..." : "Confirm Goods Handover"}</span>
          </Button>
        </div>
      )}

      {/* STEP 3: Handover Receipt & Settlement Telemetry */}
      {step === "CONFIRMED" && redemptionReceipt && (
        <div className="bg-white border-2 border-[#585123] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-[#f5f4ed] border-2 border-[#585123] flex items-center justify-center text-[#585123] mx-auto shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            {redemptionReceipt.isOfflineQueued ? (
              <Badge variant="pending">OFFLINE HANDOVER (QUEUED)</Badge>
            ) : (
              <Badge variant="verified">HANDOVER CONFIRMED</Badge>
            )}
            <h2 className="text-2xl font-black text-[#772f1a] pt-1">
              {formatCurrencyPKR(redemptionReceipt.fulfilledAmount)} Fulfilled
            </h2>
            <p className="text-xs text-[#6e5c54]">
              Household reference: <strong className="text-[#772f1a] font-bold">{redemptionReceipt.householdId}</strong>
            </p>
          </div>

          {/* Receipt Details */}
          <div className="bg-[#fbf9f6] rounded-2xl border border-[#eadecd] p-4 text-left space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#6e5c54]">Receipt Number:</span>
              <span className="font-mono text-[#772f1a] font-bold">{redemptionReceipt.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6e5c54]">Remaining Household Balance:</span>
              <span className="text-[#585123] font-black">
                {formatCurrencyPKR(redemptionReceipt.remainingBalance)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6e5c54]">Merchant Payout:</span>
              <span className="text-[#585123] font-bold">Relayer Subsidized (Gasless)</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#eadecd]">
              <span className="text-[#6e5c54]">Base Sepolia Tx Proof:</span>
              <span className="text-[11px] font-mono text-[#772f1a] font-bold truncate max-w-[140px]">
                {redemptionReceipt.isOfflineQueued ? "Queued for Auto-Sync" : redemptionReceipt.blockchainTxHash}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 text-xs"
              onClick={copyReceiptDetails}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedReceipt ? "Receipt Copied!" : "Copy Receipt"}</span>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="flex-1 text-xs"
              onClick={handleReset}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Next Voucher</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
