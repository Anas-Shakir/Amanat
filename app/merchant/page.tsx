"use client";

import { useState } from "react";
import { 
  Store, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  ArrowLeft, 
  QrCode, 
  RotateCcw,
  Sparkles,
  MapPin
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrencyPKR } from "@/lib/utils";

export default function MerchantPage() {
  const [voucherCode, setVoucherCode] = useState("");
  const [step, setStep] = useState<"ENTER" | "VERIFIED" | "CONFIRMED">("ENTER");
  const [fulfillAmount, setFulfillAmount] = useState("1200");
  const [errorMessage, setErrorMessage] = useState("");

  const sampleVoucher = {
    code: "4827",
    householdId: "AMN-48291",
    totalEntitlement: 4000,
    alreadyRedeemed: 1350,
    remainingAmount: 2650,
    category: "Emergency Food Assistance",
    storeName: "Madina Kiryana Store, Johi Branch",
  };

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

  const handleVerify = (codeToTest?: string) => {
    const code = codeToTest || voucherCode;
    if (code.trim() === "4827" || code.trim().length >= 4) {
      setErrorMessage("");
      setStep("VERIFIED");
    } else {
      setErrorMessage("Voucher code not recognized. Try demo code '4827'.");
    }
  };

  const handleFulfill = () => {
    setStep("CONFIRMED");
  };

  const handleReset = () => {
    setStep("ENTER");
    setVoucherCode("");
    setErrorMessage("");
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

      {/* STEP 1: Tactile Voucher Entry */}
      {step === "ENTER" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-white">Enter Voucher Code</h2>
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
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Touch-Friendly Numeric Keypad for Mobile Shopkeepers */}
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
            disabled={voucherCode.length < 3}
            onClick={() => handleVerify()}
          >
            <span>Verify Voucher</span>
          </Button>
        </div>
      )}

      {/* STEP 2: Entitlement Verified & Handover Amount Selection */}
      {step === "VERIFIED" && (
        <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <Badge variant="verified" className="text-xs py-1 px-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>VALID CODE #{voucherCode || "4827"}</span>
            </Badge>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          {/* Household summary card */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-3">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Household Reference:</span>
              <span className="font-mono font-bold text-white text-sm">
                {sampleVoucher.householdId}
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Original Entitlement:</span>
              <span className="text-slate-300 font-medium">
                {formatCurrencyPKR(sampleVoucher.totalEntitlement)}
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Already Handed Over:</span>
              <span className="text-slate-300">
                {formatCurrencyPKR(sampleVoucher.alreadyRedeemed)}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-200">Remaining Balance:</span>
              <span className="text-2xl font-black text-emerald-400">
                {formatCurrencyPKR(sampleVoucher.remainingAmount)}
              </span>
            </div>
          </div>

          {/* Handover Amount Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Goods Amount to Provide Today:
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl">
                Rs.
              </span>
              <input
                type="number"
                max={sampleVoucher.remainingAmount}
                value={fulfillAmount}
                onChange={(e) => setFulfillAmount(e.target.value)}
                className="w-full text-left pl-14 pr-4 py-4 rounded-2xl bg-slate-950 border-2 border-emerald-500/50 text-white font-black text-2xl focus:outline-none focus:border-emerald-400 shadow-inner"
              />
            </div>

            {/* Quick Partial Amount Buttons */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {["500", "1000", "1200", "2650"].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setFulfillAmount(preset)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    fulfillAmount === preset
                      ? "bg-emerald-600 text-white border-emerald-500"
                      : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {preset === "2650" ? "Max All" : `Rs. ${preset}`}
                </button>
              ))}
            </div>
          </div>

          {/* Confirm Button */}
          <Button
            variant="merchant"
            size="xl"
            className="w-full"
            onClick={handleFulfill}
          >
            <span>Confirm Goods Handover</span>
          </Button>
        </div>
      )}

      {/* STEP 3: Handover Receipt & Settlement Telemetry */}
      {step === "CONFIRMED" && (
        <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-900/50">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <Badge variant="verified">HANDOVER CONFIRMED</Badge>
            <h2 className="text-2xl font-black text-white pt-1">
              {formatCurrencyPKR(Number(fulfillAmount) || 1200)} Fulfilled
            </h2>
            <p className="text-xs text-slate-400">
              Household reference: <strong className="text-white">{sampleVoucher.householdId}</strong>
            </p>
          </div>

          {/* Receipt Details */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 text-left space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Remaining Balance:</span>
              <span className="text-emerald-400 font-bold">
                {formatCurrencyPKR(sampleVoucher.remainingAmount - (Number(fulfillAmount) || 1200))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Merchant Payout:</span>
              <span className="text-cyan-400 font-bold">Guaranteed by Relayer</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
              <span className="text-slate-400">Base Sepolia Tx:</span>
              <span className="text-[11px] font-mono text-cyan-400">0x8fa3...a9f0</span>
            </div>
          </div>

          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Process Next Voucher</span>
          </Button>
        </div>
      )}
    </div>
  );
}
