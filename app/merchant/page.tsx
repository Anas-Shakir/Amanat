"use client";

import { useState } from "react";
import { Store, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { formatCurrencyPKR } from "@/lib/utils";

export default function MerchantPage() {
  const [voucherCode, setVoucherCode] = useState("");
  const [step, setStep] = useState<"ENTER" | "VERIFIED" | "CONFIRMED">("ENTER");
  const [fulfillAmount, setFulfillAmount] = useState("1200");

  // Sample voucher for interactive demonstration
  const sampleVoucher = {
    code: "4827",
    householdId: "AMN-48291",
    totalEntitlement: 4000,
    alreadyRedeemed: 1350,
    remainingAmount: 2650,
    category: "Emergency Food Assistance",
    storeName: "Madina Kiryana Store, Johi Branch",
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (voucherCode.trim() === "4827" || voucherCode.trim().length >= 4) {
      setStep("VERIFIED");
    }
  };

  const handleFulfill = () => {
    setStep("CONFIRMED");
  };

  const handleReset = () => {
    setStep("ENTER");
    setVoucherCode("");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 w-full space-y-6">
      {/* Merchant Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-400">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Amanat Merchant Node</div>
            <div className="text-sm font-bold text-white">Madina Kiryana Store</div>
            <div className="text-[11px] text-emerald-400 font-medium">Johi, Dadu • Authorized</div>
          </div>
        </div>
      </div>

      {/* Step 1: Voucher Code Input */}
      {step === "ENTER" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-white">Verify Aid Voucher</h2>
            <p className="text-xs text-slate-400">
              Enter the 4-digit code provided by the beneficiary.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label htmlFor="voucherCode" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 text-center">
                Voucher Code
              </label>
              <input
                id="voucherCode"
                type="text"
                maxLength={6}
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                placeholder="4827"
                className="w-full text-center text-3xl font-mono tracking-widest py-4 px-4 rounded-2xl bg-slate-950 border-2 border-slate-700 text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={voucherCode.length < 3}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-base shadow-lg shadow-emerald-950 transition-all active:scale-98"
            >
              Verify Voucher
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => setVoucherCode("4827")}
              className="text-xs text-slate-500 hover:text-emerald-400 underline underline-offset-4"
            >
              Use Demo Voucher (4827)
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Voucher Verified & Amount Selection */}
      {step === "VERIFIED" && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 space-y-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold justify-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>VALID VOUCHER: #{voucherCode || "4827"}</span>
          </div>

          {/* Balance breakdown */}
          <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Beneficiary Ref</span>
              <span className="font-mono text-slate-200 font-bold">{sampleVoucher.householdId}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Total Entitlement</span>
              <span className="text-slate-200 font-medium">{formatCurrencyPKR(sampleVoucher.totalEntitlement)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Already Redeemed</span>
              <span className="text-slate-200">{formatCurrencyPKR(sampleVoucher.alreadyRedeemed)}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold">
              <span className="text-slate-200">Remaining Balance</span>
              <span className="text-emerald-400 text-base">{formatCurrencyPKR(sampleVoucher.remainingAmount)}</span>
            </div>
          </div>

          {/* Amount to Fulfill */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Amount of Goods Provided
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">Rs.</span>
              <input
                type="number"
                max={sampleVoucher.remainingAmount}
                value={fulfillAmount}
                onChange={(e) => setFulfillAmount(e.target.value)}
                className="w-full text-left pl-14 pr-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white font-bold text-xl focus:outline-none focus:border-cyan-500"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Supports partial redemption up to remaining {formatCurrencyPKR(sampleVoucher.remainingAmount)}.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleFulfill}
              className="w-full py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-base shadow-lg shadow-cyan-950 transition-all active:scale-98"
            >
              Confirm Goods Handover
            </button>
            <button
              onClick={handleReset}
              className="w-full py-2.5 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Fulfillment Success Receipt */}
      {step === "CONFIRMED" && (
        <div className="bg-slate-900 border border-emerald-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-900/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white">Fulfillment Recorded</h2>
            <p className="text-xs text-slate-400">
              Assistance confirmed for Household {sampleVoucher.householdId}
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Redeemed Today</span>
              <span className="text-emerald-400 font-bold text-sm">{formatCurrencyPKR(Number(fulfillAmount) || 1200)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Remaining Household Balance</span>
              <span className="text-slate-200 font-bold">{formatCurrencyPKR(sampleVoucher.remainingAmount - (Number(fulfillAmount) || 1200))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Settlement Status</span>
              <span className="text-cyan-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Relayer Queued (Gasless)
              </span>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-all"
          >
            Next Customer / Voucher
          </button>
        </div>
      )}
    </div>
  );
}
