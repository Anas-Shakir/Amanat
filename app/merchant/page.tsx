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
      setErrorMessage("Network error during settlement.");
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
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-400">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Merchant Node #MER-02
            </div>
            <div className="text-base font-bold text-white leading-tight">
              Madina Kiryana Store
            </div>
            <div className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />
              <span>Johi Main Bazaar, Dadu • Authorized</span>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 1: Tactile Voucher Entry Keypad */}
      {step === "ENTER" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-white">Enter Voucher PIN</h2>
            <p className="text-xs text-slate-400">
              Ask beneficiary for their 4-digit SMS / WhatsApp code.
            </p>
          </div>

          {/* Display Screen */}
          <div className="bg-slate-950 rounded-2xl border-2 border-slate-700 p-4 text-center">
            <div className="text-4xl font-mono font-black text-white tracking-[0.3em] min-h-[48px] flex items-center justify-center">
              {voucherCode ? voucherCode : <span className="text-slate-600">_ _ _ _</span>}
            </div>
            {errorMessage && (
              <div className="text-xs text-rose-400 font-medium mt-2 flex items-center justify-center gap-1">
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
                className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 border border-slate-700/80 text-white font-bold text-2xl transition-all select-none shadow-sm"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleKeypadBackspace}
              className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 border border-slate-700/80 text-slate-300 font-semibold text-sm transition-all select-none"
            >
              DEL
            </button>
            <button
              type="button"
              onClick={() => handleKeypadPress("0")}
              className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 border border-slate-700/80 text-white font-bold text-2xl transition-all select-none"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => {
                setVoucherCode("4827");
                handleVerify("4827");
              }}
              className="h-14 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-300 font-bold text-xs transition-all select-none flex items-center justify-center text-center leading-tight"
            >
              Demo (4827)
            </button>
          </div>

          {/* Action Button */}
          <Button
            variant="merchant"
            size="xl"
            className="w-full"
            disabled={voucherCode.length < 3 || isLoading}
            onClick={() => handleVerify()}
          >
            <span>{isLoading ? "Verifying with Node..." : "Verify Voucher"}</span>
          </Button>
        </div>
      )}

      {/* STEP 2: Entitlement Verified & Amount Selection */}
      {step === "VERIFIED" && verifiedData && (
        <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <Badge variant="verified" className="text-xs py-1 px-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>VALID CODE #{verifiedData.code}</span>
            </Badge>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          {/* Household summary */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-3 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Household Reference:</span>
              <span className="font-mono font-bold text-white text-sm">
                {verifiedData.householdId}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Campaign Pool:</span>
              <span className="text-slate-200 truncate max-w-[180px]">
                {verifiedData.campaignTitle}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Original Entitlement:</span>
              <span className="text-slate-300 font-medium">
                {formatCurrencyPKR(verifiedData.totalEntitlement)}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Already Handed Over:</span>
              <span className="text-slate-300">
                {formatCurrencyPKR(verifiedData.alreadyRedeemed)}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-200">Available Balance:</span>
              <span className="text-2xl font-black text-emerald-400">
                {formatCurrencyPKR(verifiedData.remainingAmount)}
              </span>
            </div>
          </div>

          {/* Handover Amount Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Goods Amount to Hand Over:
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl">
                Rs.
              </span>
              <input
                type="number"
                max={verifiedData.remainingAmount}
                value={fulfillAmount}
                onChange={(e) => setFulfillAmount(e.target.value)}
                className="w-full text-left pl-14 pr-4 py-4 rounded-2xl bg-slate-950 border-2 border-emerald-500/50 text-white font-black text-2xl focus:outline-none focus:border-emerald-400 shadow-inner"
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
                      ? "bg-emerald-600 text-white border-emerald-500"
                      : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {errorMessage && (
              <div className="text-xs text-rose-400 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Confirm Button */}
          <Button
            variant="merchant"
            size="xl"
            className="w-full"
            disabled={isLoading || Number(fulfillAmount) <= 0 || Number(fulfillAmount) > verifiedData.remainingAmount}
            onClick={handleConfirmFulfillment}
          >
            <span>{isLoading ? "Processing Settlement..." : "Confirm Goods Handover"}</span>
          </Button>
        </div>
      )}

      {/* STEP 3: Handover Receipt & Settlement Telemetry */}
      {step === "CONFIRMED" && redemptionReceipt && (
        <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-900/50">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <Badge variant="verified">HANDOVER CONFIRMED</Badge>
            <h2 className="text-2xl font-black text-white pt-1">
              {formatCurrencyPKR(redemptionReceipt.fulfilledAmount)} Fulfilled
            </h2>
            <p className="text-xs text-slate-400">
              Household reference: <strong className="text-white">{redemptionReceipt.householdId}</strong>
            </p>
          </div>

          {/* Receipt Details */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 text-left space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Receipt Number:</span>
              <span className="font-mono text-slate-200 font-bold">{redemptionReceipt.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Remaining Household Balance:</span>
              <span className="text-emerald-400 font-bold">
                {formatCurrencyPKR(redemptionReceipt.remainingBalance)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Merchant Payout:</span>
              <span className="text-cyan-400 font-bold">Relayer Subsidized (Gasless)</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
              <span className="text-slate-400">Base Sepolia Tx Proof:</span>
              <span className="text-[11px] font-mono text-cyan-400 truncate max-w-[140px]">
                {redemptionReceipt.blockchainTxHash}
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
