"use client";

import { Activity, ShieldCheck, Zap, Database, Server, RefreshCw } from "lucide-react";

export default function AdminPage() {
  const auditLogs = [
    {
      id: "AUD-1092",
      action: "MERCHANT_REDEMPTION_SETTLED",
      actor: "Relayer Service (0x4a...c9)",
      entity: "Voucher #4827 / Entitlement #AMN-48291",
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
      txHash: "Off-Chain RLS",
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
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-xs font-semibold text-amber-300 mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Amanat Core Administration & Audit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            System Status & Audit Ledger
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time telemetry on gasless relayers, merchant nodes, and Base Sepolia settlement verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
            All Systems Operational
          </span>
        </div>
      </div>

      {/* System Node Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Base Sepolia Relayer</span>
            <Server className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-white">Online (Gas Subsidized)</div>
          <div className="text-[11px] text-slate-400 font-mono">Balance: 0.420 Sepolia ETH</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Off-Chain Data Engine</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-white">Supabase PostgreSQL</div>
          <div className="text-[11px] text-emerald-400">RLS Policies Enforced</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Messaging Gateway</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-white">Demo & SMS Fallback</div>
          <div className="text-[11px] text-slate-400">Zero Beneficiary Cost</div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-white text-base">Immutable Audit Trail</h2>
          <span className="text-xs text-slate-400">Live feed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Tx Hash / Proof</th>
                <th className="py-3 px-4">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">{log.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-200">{log.action}</td>
                  <td className="py-3 px-4 text-slate-400">{log.actor}</td>
                  <td className="py-3 px-4 text-slate-300">{log.entity}</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">{log.amount}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-cyan-400 truncate max-w-[140px]">
                    {log.txHash}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
