"use client";

import { useState, useEffect } from "react";
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
  AlertTriangle,
  Radio
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { formatCurrencyPKR } from "@/lib/utils";
import { E2EStepperModal } from "@/components/demo/e2e-stepper-modal";

interface RelayerTelemetry {
  isConfigured: boolean;
  relayerAddress: string;
  contractAddress: string;
  network: string;
  chainId: number;
  balanceETH: string;
}

export default function AdminPage() {
  const [isEmergencyMode, setIsEmergencyMode] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isE2EOpen, setIsE2EOpen] = useState(false);
  const [relayerInfo, setRelayerInfo] = useState<RelayerTelemetry>({
    isConfigured: false,
    relayerAddress: "0x4a9d...c9b2",
    contractAddress: "0x0000000000000000000000000000000000000000",
    network: "Base Sepolia Testnet",
    chainId: 84532,
    balanceETH: "0.420 Sepolia ETH",
  });

  const [auditLogs, setAuditLogs] = useState<any[]>([
    {
      id: "AUD-1092",
      action: "MERCHANT_REDEMPTION_SETTLED",
      actor: "Relayer Service (0x4a...c9)",
      entity: "Voucher #4827 (Household AMN-48291)",
      amount: "Rs. 1,200",
      txHash: "0x8fa37d2f9b1c08e5e8a6d71c4a0e7f53942b03ef820468903c15d48726b1a9f0",
      timestamp: "Just now",
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
      txHash: "0x1b4c9e82a981c2f901ab29e4726b1a9f0e8a6d71c4a0e7f53942b03ef8204689",
      timestamp: "1 hour ago",
    },
  ]);

  useEffect(() => {
    async function loadRelayerStatus() {
      try {
        const res = await fetch("/api/admin/relayer");
        const data = await res.json();
        if (data.success && data.relayer) {
          setRelayerInfo(data.relayer);
          if (data.recentEvents && data.recentEvents.length > 0) {
            const mapped = data.recentEvents.map((e: any) => ({
              id: `AUD-${e.id.slice(0, 6)}`,
              action: e.action,
              actor: e.actor_role,
              entity: e.entity_type,
              amount: e.details?.fulfilledAmount ? formatCurrencyPKR(e.details.fulfilledAmount) : "N/A",
              txHash: e.blockchain_tx_hash || "Off-Chain",
              timestamp: new Date(e.created_at).toLocaleTimeString(),
            }));
            setAuditLogs(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to load relayer status:", err);
      }
    }
    loadRelayerStatus();
  }, []);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eadecd] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="emerald">
              <Activity className="w-3.5 h-3.5" />
              <span>Amanat Infrastructure Control Plane</span>
            </Badge>
            <Badge variant="onChain">Base Sepolia Chain #84532</Badge>
          </div>
          <h1 className="text-3xl font-black text-[#772f1a] tracking-tight">
            System Administration & Relayer Ledger
          </h1>
          <p className="text-[#6e5c54] text-sm mt-1 max-w-2xl">
            Audit cryptographic settlement events, inspect server-relayer gas balances, and manage regional emergency protocols for Dadu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsE2EOpen(true)}
            className="text-xs"
          >
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            <span>Run Complete E2E Flow</span>
          </Button>

          {/* Emergency Mode Switcher */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#eadecd] flex items-center gap-4 shadow-2xs">
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-[#6e5c54]">Network Mode</div>
              <div className="text-xs font-bold text-[#2b1712] flex items-center gap-1.5 mt-0.5">
                {isEmergencyMode ? (
                  <span className="text-[#943b22] font-black flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-[#943b22]" /> Emergency Mode
                  </span>
                ) : (
                  <span className="text-[#585123] font-black flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#585123]" /> Community Mode
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
      </div>

      <E2EStepperModal
        isOpen={isE2EOpen}
        onClose={() => setIsE2EOpen(false)}
      />

      {/* Node Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Base Sepolia Relayer"
          value={relayerInfo.balanceETH}
          subtitle={relayerInfo.isConfigured ? "Live Relayer Active" : "Gas Subsidized (Demo)"}
          icon={<Server className="w-4 h-4" />}
          accentColor="cyan"
        />
        <StatCard
          title="Off-Chain Engine"
          value="PostgreSQL / RLS"
          subtitle="Supabase Active"
          icon={<Database className="w-4 h-4" />}
          accentColor="emerald"
        />
        <StatCard
          title="Active Kiryana Nodes"
          value="3 Stores"
          subtitle="Johi, Mehar, KN Shah"
          icon={<Zap className="w-4 h-4" />}
          accentColor="amber"
        />
        <StatCard
          title="Settlements Executed"
          value={`${auditLogs.length} Events`}
          subtitle="100% Cryptographic Match"
          icon={<ShieldCheck className="w-4 h-4" />}
          accentColor="indigo"
        />
      </div>

      {/* Relayer Node Details Card */}
      <Card className="p-6 bg-white border border-[#eadecd] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f2e8dc] pb-3">
          <div className="flex items-center gap-2 text-[#772f1a] font-bold text-sm">
            <Radio className="w-4 h-4 text-[#585123] animate-pulse" />
            <span>Gasless Relayer Service Health</span>
          </div>
          <span className="text-xs font-mono font-bold text-[#585123] bg-[#f5f4ed] px-2.5 py-0.5 rounded-full">
            Chain ID: 84532 (Base Sepolia)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#fbf9f6] p-3.5 rounded-xl border border-[#eadecd] space-y-1">
            <span className="text-[#6e5c54] font-bold">Relayer Wallet Address:</span>
            <div className="font-mono text-[#772f1a] font-bold truncate">{relayerInfo.relayerAddress}</div>
          </div>

          <div className="bg-[#fbf9f6] p-3.5 rounded-xl border border-[#eadecd] space-y-1">
            <span className="text-[#6e5c54] font-bold">Smart Contract Address:</span>
            <div className="font-mono text-[#772f1a] font-bold truncate">{relayerInfo.contractAddress}</div>
          </div>
        </div>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Immutable Transaction & Settlement Trail</CardTitle>
              <CardDescription>
                Synchronized audit stream between Supabase off-chain entitlements and Base Sepolia smart contract state.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fbf9f6] text-[#772f1a] border-b border-[#eadecd] uppercase tracking-wider font-bold">
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
              <tbody className="divide-y divide-[#f2e8dc] text-[#2b1712]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#fdf8f2] transition-colors font-medium">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#772f1a]">{log.id}</td>
                    <td className="py-3.5 px-4 font-bold text-[#2b1712]">{log.action}</td>
                    <td className="py-3.5 px-4 text-[#6e5c54]">{log.actor}</td>
                    <td className="py-3.5 px-4 text-[#2b1712] font-medium">{log.entity}</td>
                    <td className="py-3.5 px-4 font-black text-[#585123]">{log.amount}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#f58549] font-bold">
                      {log.txHash.startsWith("0x") ? (
                        <a
                          href={`https://sepolia.basescan.org/tx/${log.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:underline hover:text-[#e07133]"
                        >
                          <span className="truncate max-w-[140px]">{log.txHash}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      ) : (
                        <span className="text-[#6e5c54]">{log.txHash}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#6e5c54] whitespace-nowrap">{log.timestamp}</td>
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
