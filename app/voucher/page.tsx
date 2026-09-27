"use client";

import { useState, useEffect } from "react";
import { 
  Smartphone, 
  CheckCircle, 
  ShieldCheck, 
  MapPin, 
  Store, 
  MessageSquare, 
  Copy, 
  Sparkles, 
  Globe, 
  ExternalLink,
  Send,
  Radio,
  Clock
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrencyPKR } from "@/lib/utils";

interface BeneficiaryOption {
  householdId: string;
  headOfFamily: string;
  voucherCode: string;
  amount: number;
  remainingAmount: number;
  area: string;
  campaignTitle: string;
}

export default function VoucherDemoPage() {
  const [copied, setCopied] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<"EN" | "UR">("EN");
  const [testPhone, setTestPhone] = useState("+92 300 1234567");
  const [selectedChannel, setSelectedChannel] = useState<"SMS" | "WHATSAPP">("SMS");
  const [isSending, setIsSending] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);
  const [recentDispatches, setRecentDispatches] = useState<any[]>([]);

  const [households, setHouseholds] = useState<BeneficiaryOption[]>([
    {
      householdId: "AMN-48291",
      headOfFamily: "Ghulam Nabi",
      voucherCode: "4827",
      amount: 4000,
      remainingAmount: 2650,
      area: "Johi Union Council 4, Dadu",
      campaignTitle: "Dadu Flood Emergency Food Relief",
    },
    {
      householdId: "AMN-48292",
      headOfFamily: "Zulekha Bibi",
      voucherCode: "5914",
      amount: 4000,
      remainingAmount: 4000,
      area: "Mehar Main Bazaar, Dadu",
      campaignTitle: "Dadu Flood Emergency Food Relief",
    },
    {
      householdId: "AMN-48293",
      headOfFamily: "Ali Murad",
      voucherCode: "8203",
      amount: 5000,
      remainingAmount: 5000,
      area: "Radhan Station, Dadu",
      campaignTitle: "Dadu Community — Monthly Zakat Ration Support",
    },
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [hhRes, histRes] = await Promise.all([
          fetch("/api/households"),
          fetch("/api/notifications/history"),
        ]);
        const hhData = await hhRes.json();
        const histData = await histRes.json();

        if (hhData.success && hhData.households && hhData.households.length > 0) {
          const mapped = hhData.households.map((h: any) => ({
            householdId: h.householdId,
            headOfFamily: h.headOfFamily,
            voucherCode: h.lastVoucherCode || "4827",
            amount: h.entitlementAmount,
            remainingAmount: h.remainingAmount,
            area: h.area,
            campaignTitle: h.campaignTitle || "Dadu Flood Emergency Relief",
          }));
          setHouseholds(mapped);
        }

        if (histData.success && histData.history) {
          setRecentDispatches(histData.history);
        }
      } catch (err) {
        console.error("Failed to load voucher data:", err);
      }
    }
    loadData();
  }, []);

  const activeHH = households[selectedIndex] || households[0];

  const copyCode = () => {
    navigator.clipboard.writeText(activeHH.voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const res = await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          householdCode: activeHH.householdId,
          voucherCode: activeHH.voucherCode,
          amount: activeHH.amount,
          phone: testPhone,
          channel: selectedChannel,
        }),
      });

      const data = await res.json();
      if (data.success && data.dispatch) {
        setDispatchSuccess(true);
        setRecentDispatches([data.dispatch, ...recentDispatches]);
        setTimeout(() => setDispatchSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Dispatch failure:", err);
    } finally {
      setIsSending(false);
    }
  };

  const nearbyStores = [
    {
      name: "Madina Kiryana Store",
      owner: "Haji Mohammad Rafiq",
      area: "Shop 14, Main Bazaar, Johi, Dadu",
      distance: "0.8 km",
    },
    {
      name: "Bismillah General Store",
      owner: "Abdul Sattar Jamali",
      area: "Chowk Ghanta Ghar, Mehar, Dadu",
      distance: "2.4 km",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 w-full space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Beneficiary Messaging Engine (Zero Crypto / No App Required)</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Beneficiary Voucher Notification Hub
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Dignified, dual-language SMS & WhatsApp notifications delivered directly to household heads in Dadu without requiring internet or wallet setup.
        </p>
      </div>

      {/* Household Selector Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block text-center">
          Select Target Household Record:
        </label>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {households.map((hh, idx) => (
            <button
              key={hh.householdId}
              onClick={() => setSelectedIndex(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                selectedIndex === idx
                  ? "bg-slate-800 text-white border-emerald-500/60 shadow-md shadow-emerald-950/40"
                  : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="font-bold text-white">{hh.headOfFamily}</div>
              <div className="text-[10px] text-slate-400 font-mono">{hh.householdId}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left: Mobile Phone SMS Simulator */}
        <div className="md:col-span-7 bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-5">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-black text-xs">
                A
              </div>
              <div>
                <div className="text-xs font-bold text-white">AMANAT AID DISPATCH</div>
                <div className="text-[10px] text-emerald-400 font-medium">Official Relief Notification</div>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
              <button
                onClick={() => setSelectedLanguage("EN")}
                className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                  selectedLanguage === "EN" ? "bg-slate-800 text-white" : "text-slate-400"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setSelectedLanguage("UR")}
                className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                  selectedLanguage === "UR" ? "bg-slate-800 text-white" : "text-slate-400"
                }`}
              >
                اردو
              </button>
            </div>
          </div>

          {/* SMS Bubble */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs leading-relaxed text-slate-200">
            {selectedLanguage === "EN" ? (
              <>
                <p className="font-semibold text-emerald-300">
                  Assalam-o-Alaikum,
                </p>
                <p>
                  Your household (<strong className="font-mono text-white">{activeHH.householdId}</strong> — {activeHH.headOfFamily}) has been approved for a food ration entitlement of <strong className="text-emerald-400 text-sm font-bold">{formatCurrencyPKR(activeHH.amount)}</strong> under the {activeHH.campaignTitle}.
                </p>

                {/* Voucher PIN Card */}
                <div className="p-4 rounded-xl bg-slate-900 border-2 border-emerald-500/50 text-center space-y-1 shadow-inner">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Your Private Voucher PIN
                  </div>
                  <div className="text-3xl font-mono font-black text-white tracking-[0.25em] py-1">
                    {activeHH.voucherCode}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium">
                    Remaining Balance: {formatCurrencyPKR(activeHH.remainingAmount)}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 space-y-1">
                  <p>• Valid at participating Amanat Kiryana stores in Dadu.</p>
                  <p>• Partial visits supported (e.g. redeem Rs. 1,200 today).</p>
                  <p>• Simply present your 4-digit code to the shopkeeper.</p>
                </div>
              </>
            ) : (
              <div className="text-right space-y-3 font-sans" dir="rtl">
                <p className="font-semibold text-emerald-300">
                  السلام علیکم،
                </p>
                <p>
                  آپ کے گھرانہ (<strong className="font-mono text-white">{activeHH.householdId}</strong>) کے لیے دادو فلڈ ریلیف کے تحت <strong className="text-emerald-400 font-bold">{formatCurrencyPKR(activeHH.amount)}</strong> کے راشن کی منظوری دی گئی ہے۔
                </p>

                <div className="p-4 rounded-xl bg-slate-900 border-2 border-emerald-500/50 text-center space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    آپ کا پرائیویٹ واؤچر کوڈ
                  </div>
                  <div className="text-3xl font-mono font-black text-white tracking-[0.25em] py-1">
                    {activeHH.voucherCode}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium">
                    باقی بیلنس: {formatCurrencyPKR(activeHH.remainingAmount)}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 space-y-1">
                  <p>• قریبی امانت کریانہ اسٹور پر یہ کوڈ بتا کر راشن حاصل کریں۔</p>
                  <p>• آپ جزوی رقم (مثلاً 1,200 روپے) بھی نکال سکتے ہیں۔</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1 text-xs"
              onClick={copyCode}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? "Code Copied!" : `Copy Code (${activeHH.voucherCode})`}</span>
            </Button>

            <Link
              href="/merchant"
              className="flex-1"
            >
              <Button
                variant="primary"
                className="w-full text-xs"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Test in Merchant PWA</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Right: Live Dispatch Trigger & History */}
        <div className="md:col-span-5 space-y-4">
          {/* Dispatch Trigger Card */}
          <Card className="p-5 space-y-4">
            <CardHeader className="p-0 border-none space-y-1">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <Send className="w-4 h-4 text-cyan-400" />
                <span>Trigger Voucher Notification</span>
              </CardTitle>
              <p className="text-[11px] text-slate-400">
                Simulate or broadcast live SMS / WhatsApp dispatch for {activeHH.householdId}.
              </p>
            </CardHeader>

            <form onSubmit={handleSendDispatch} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Recipient Phone Number</label>
                <Input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Dispatch Channel</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedChannel("SMS")}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      selectedChannel === "SMS"
                        ? "bg-cyan-950 text-cyan-300 border-cyan-500/50"
                        : "bg-slate-950 text-slate-400 border-slate-800"
                    }`}
                  >
                    SMS Gateway
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedChannel("WHATSAPP")}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      selectedChannel === "WHATSAPP"
                        ? "bg-emerald-950 text-emerald-300 border-emerald-500/50"
                        : "bg-slate-950 text-slate-400 border-slate-800"
                    }`}
                  >
                    WhatsApp API
                  </button>
                </div>
              </div>

              {dispatchSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Voucher PIN {activeHH.voucherCode} dispatched!</span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full text-xs"
                disabled={isSending}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? "Dispatching..." : `Send ${selectedChannel} to Beneficiary`}</span>
              </Button>
            </form>
          </Card>

          {/* Recent Dispatch Stream */}
          <Card className="p-5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Recent Dispatches ({recentDispatches.length})</span>
            </h3>

            <div className="space-y-2 text-xs max-h-48 overflow-y-auto">
              {recentDispatches.length === 0 ? (
                <div className="text-[11px] text-slate-500 italic py-2">
                  No notifications triggered yet. Send one above!
                </div>
              ) : (
                recentDispatches.slice(0, 4).map((d, i) => (
                  <div
                    key={d.id || i}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-indigo-400">{d.householdCode}</span>
                      <Badge variant={d.status === "DELIVERED" ? "verified" : "default"} className="text-[9px] py-0">
                        {d.status} ({d.provider})
                      </Badge>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span>PIN: <strong className="text-amber-400 font-mono">{d.voucherCode}</strong></span>
                      <span className="text-[10px] text-slate-500">{new Date(d.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
