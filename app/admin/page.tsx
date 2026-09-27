"use client";

import { useState } from "react";
import { 
  Activity, 
  ShieldCheck, 
  Zap, 
  Database, 
  Server, 
  Flame, 
  CheckCircle2, 
  ExternalLink,
  Lock,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { formatCurrencyPKR } from "@/lib/utils";

export default function AdminPage() {
  const [isEmergencyMode, setIsEmergencyMode] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);

  const [auditLogs] = useState([
    {
      id: "AUD-1092",
      action: "MERCHANT_REDEMPTION_SETTLED",
      actor: "Relayer Service (0x4a...c9)",
      entity: "Voucher #4827 (Household AMN-48291)",
      amount: "Rs. 1,200",
      txHash: "0x8fa37d2f9b1c08e5e8a6d71c4a0e7f53942b03ef820468903c15d48726b1a9f0",
      timestamp: "2 minutes ago",
    },
    {
      id: "AUD-1091",
      action: "VOUCHER_CODE_VERIFIED",
      actor: "Merchant #MER-02 (Madina Kiryana)",
      entity: "Voucher #4827",
      amount: "N/A",
      txHash: "Supabase RLS Policy Pass",
      timestamp: "3 minutes ago",
    },
    {
      id: "AUD-1090",
      action: "ENTITLEMENT_ISSUED",
      actor: "Org #ORG-DADU (Sindh Relief Foundation)",
      entity: "Household AMN-48291",
      amount: "Rs. 4,000",
      txHash: "Off-Chain / Committed",
      timestamp: "12 minutes ago",
    },
    {
      id: "AUD-1089",
      action: "CAMPAIGN_POOL_FUNDED",
      actor: "Donor (0x71...8b)",
      entity: "Dadu Emergency Relief Pool",
      amount: "Rs. 100,000",
      txHash: "0x1b4c9e82a...981c2",
      timestamp: "1 hour ago",
    },
  ]);

  const toggleEmergencyMode = () => {
    setIsSwitching(true);
    setTimeout(() => {
      setIsEmergencyMode(!isEmergencyMode);
      setIsSwitching(false);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="amber">
              <Activity className="w-3.5 h-3.5" />
              <span>Amanat Infrastructure Control Plane</span>
            </Badge>
            <Badge variant="onChain">Base Sepolia Node: Healthy</Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            System Administration & Relayer Ledger
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Audit cryptographic settlement events, verify merchant payouts, and toggle regional emergency protocols for Dadu.
          </p>
        </div>

        {/* Emergency Mode Switcher */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold text-slate-400">Network State</div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
              {isEmergencyMode ? (
                <span className="text-rose-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Emergency Mode
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Community Mode
                </span>
              )}
            </div>
          </div>

          <Button
            size="sm"
            variant={isEmergencyMode ? "danger" : "secondary"}
            onClick={toggleEmergencyMode}
            disabled={isSwitching}
          >
            {isSwitching ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : isEmergencyMode ? (
              "Switch to Community"
            ) : (
              "Trigger Emergency Mode"
            )}
          </Button>
        </div>
      </div>

      {/* Node Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Base Sepolia Relayer"
          value="0.420 ETH"
          subtitle="Gas Subsidized • No Tx Queue"
          icon={<Server className="w-4 h-4" />}
          accentColor="cyan"
        />
        <StatCard
          title="PostgreSQL Database"
          value="Active (Supabase)"
          subtitle="RLS Policies Enforced"
          icon={<Database className="w-4 h-4" />}
          accentColor="emerald"
        />
        <StatCard
          title="Active Kiryana Nodes"
          value="3 Stores"
          subtitle="Dadu, Johi, Mehar"
          icon={<Zap className="w-4 h-4" />}
          accentColor="amber"
        />
        <StatCard
          title="Redemptions Settled"
          value="18 Orders"
          subtitle="100% Cryptographic Match"
          icon={<ShieldCheck className="w-4 h-4" />}
          accentColor="indigo"
        />
      </div>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Immutable Transaction & Settlement Trail</CardTitle>
              <CardDescription>
                Synchronized log between Supabase off-chain entitlements and Base Sepolia smart contract state.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Entity Reference</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Base Sepolia Tx / Proof</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{log.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">{log.action}</td>
                    <td className="py-3.5 px-4 text-slate-400">{log.actor}</td>
                    <td className="py-3.5 px-4 text-slate-200">{log.entity}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">{log.amount}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-cyan-400">
                      {log.txHash.startsWith("0x") ? (
                        <a
                          href={`https://sepolia.basescan.org/tx/${log.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:underline hover:text-cyan-300"
                        >
                          <span className="truncate max-w-[120px]">{log.txHash}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      ) : (
                        <span className="text-slate-400">{log.txHash}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
