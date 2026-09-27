"use client";

import { useAuth } from "./auth-context";
import { UserRole } from "@/types";
import { 
  HeartHandshake, 
  Store, 
  Users, 
  Activity, 
  ChevronDown, 
  UserCheck, 
  Sparkles 
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function DemoRoleSwitcher() {
  const { user, role, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const rolesList: {
    role: UserRole;
    label: string;
    description: string;
    path: string;
    icon: typeof HeartHandshake;
    color: string;
  }[] = [
    {
      role: "DONOR",
      label: "Donor Persona",
      description: "Anas Shakir (Global Aid Pool Contributor)",
      path: "/donor",
      icon: HeartHandshake,
      color: "text-emerald-400 bg-emerald-950/60 border-emerald-500/30",
    },
    {
      role: "MERCHANT",
      label: "Kiryana Merchant",
      description: "Haji Rafiq (Madina Kiryana, Johi, Dadu)",
      path: "/merchant",
      icon: Store,
      color: "text-cyan-400 bg-cyan-950/60 border-cyan-500/30",
    },
    {
      role: "ORGANIZATION",
      label: "Relief Issuer / NGO",
      description: "Tariq Shah (Sindh Relief Foundation)",
      path: "/organization",
      icon: Users,
      color: "text-indigo-400 bg-indigo-950/60 border-indigo-500/30",
    },
    {
      role: "ADMIN",
      label: "Node & Relayer Admin",
      description: "Base Sepolia Relayer Operator",
      path: "/admin",
      icon: Activity,
      color: "text-amber-400 bg-amber-950/60 border-amber-500/30",
    },
  ];

  const handleSelectRole = async (targetRole: UserRole, targetPath: string) => {
    await switchRole(targetRole);
    setIsOpen(false);
    router.push(targetPath);
  };

  const currentRoleConfig = rolesList.find((r) => r.role === role) || rolesList[0];
  const IconComponent = currentRoleConfig.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 text-xs text-slate-200 transition-all shadow-inner group"
      >
        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${currentRoleConfig.color}`}>
          <IconComponent className="w-3 h-3" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold leading-none">
            Active Persona
          </span>
          <span className="font-semibold text-white group-hover:text-emerald-300 transition-colors leading-tight">
            {currentRoleConfig.label}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-medium">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Sparkles className="w-3 h-3" /> 1-Click Role Switcher
              </span>
              <span className="text-[10px] text-slate-500">Live Demo</span>
            </div>

            {rolesList.map((item) => {
              const ItemIcon = item.icon;
              const isSelected = item.role === role;

              return (
                <button
                  key={item.role}
                  onClick={() => handleSelectRole(item.role, item.path)}
                  className={`w-full text-left p-2.5 rounded-xl flex items-start gap-3 transition-all ${
                    isSelected
                      ? "bg-slate-800/90 border border-slate-700 text-white"
                      : "hover:bg-slate-800/50 text-slate-300"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5 ${item.color}`}>
                    <ItemIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{item.label}</span>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800/50">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
