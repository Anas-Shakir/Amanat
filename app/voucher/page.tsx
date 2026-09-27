"use client";

import { Smartphone, CheckCircle, ShieldCheck, MapPin, Store, MessageSquare, Copy } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { formatCurrencyPKR } from "@/lib/utils";

export default function VoucherDemoPage() {
  const [copied, setCopied] = useState(false);

  const sampleSms = {
    voucherCode: "4827",
    householdId: "AMN-48291",
    amount: 4000,
    category: "Emergency Food Relief",
    validDays: 30,
    issuer: "Sindh Relief & Amanat Aid Pool",
  };

  const copyCode = () => {
    navigator.clipboard.writeText(sampleSms.voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 w-full space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Beneficiary Experience (Zero Crypto / No App Required)</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Simulated Beneficiary Message</h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Beneficiaries receive a lightweight SMS or WhatsApp message with their 4-digit voucher. No internet or crypto wallet needed.
        </p>
      </div>

      {/* Realistic Mobile SMS Card */}
      <div className="bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              A
            </div>
            <div>
              <div className="text-xs font-bold text-white">AMANAT AID NOTIFICATION</div>
              <div className="text-[10px] text-slate-400">Official Relief Dispatch</div>
            </div>
          </div>
          <span className="text-[11px] text-slate-500">Just now</span>
        </div>

        {/* SMS Message Bubble */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs leading-relaxed text-slate-200">
          <p className="font-semibold text-emerald-300">
            Assalam-o-Alaikum,
          </p>
          <p>
            Your household (<span className="font-mono font-bold text-white">{sampleSms.householdId}</span>) has been approved for a food assistance entitlement of <strong className="text-emerald-400 text-sm">{formatCurrencyPKR(sampleSms.amount)}</strong> under the Dadu Flood Emergency Relief pool.
          </p>

          <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 text-center space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Your Private Voucher Code</div>
            <div className="text-3xl font-mono font-black text-white tracking-widest py-1">
              {sampleSms.voucherCode}
            </div>
            <div className="text-[11px] text-emerald-400 font-medium">Valid for {sampleSms.validDays} days at any participating Amanat shop</div>
          </div>

          <p className="text-slate-400 text-[11px]">
            • You can redeem partial amounts across multiple visits (e.g. Rs. 1,200 today).<br />
            • Simply tell the shopkeeper your 4-digit code. Keep this message safe.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={copyCode}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? "Code Copied!" : "Copy Code (4827)"}</span>
          </button>

          <Link
            href="/merchant"
            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-950"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Open Merchant PWA</span>
          </Link>
        </div>
      </div>

      {/* Participating Stores Nearby */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>Participating Kiryana Stores in Dadu</span>
        </h3>
        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
            <div>
              <div className="font-semibold text-white">Madina Kiryana Store</div>
              <div className="text-[11px] text-slate-400">Johi Main Bazaar, Dadu</div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
              Active Node
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
            <div>
              <div className="font-semibold text-white">Bismillah General Store</div>
              <div className="text-[11px] text-slate-400">Mehar Chowk, Dadu</div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
              Active Node
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
