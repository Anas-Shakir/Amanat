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
      color: "text-white bg-[#f58549] border-[#e07133]",
    },
    {
      role: "MERCHANT",
      label: "Kiryana Merchant",
      description: "Haji Rafiq (Madina Kiryana, Johi, Dadu)",
      path: "/merchant",
      icon: Store,
      color: "text-white bg-[#772f1a] border-[#521f11]",
    },
    {
      role: "ORGANIZATION",
      label: "Relief Issuer / NGO",
      description: "Tariq Shah (Sindh Relief Foundation)",
      path: "/organization",
      icon: Users,
      color: "text-white bg-[#585123] border-[#736b32]",
    },
    {
      role: "ADMIN",
      label: "Node & Relayer Admin",
      description: "Base Sepolia Relayer Operator",
      path: "/admin",
      icon: Activity,
      color: "text-[#772f1a] bg-[#f2a65a] border-[#f7d7b5]",
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
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#eadecd] hover:border-[#f58549] text-xs text-[#2b1712] transition-all shadow-2xs group"
      >
        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${currentRoleConfig.color}`}>
          <IconComponent className="w-3 h-3" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[9px] uppercase tracking-widest text-[#6e5c54] font-bold leading-none">
            Active Persona
          </span>
          <span className="font-bold text-[#772f1a] group-hover:text-[#f58549] transition-colors leading-tight">
            {currentRoleConfig.label}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-[#6e5c54] group-hover:text-[#772f1a] transition-transform" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-[#eadecd] shadow-xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-[#f2e8dc] text-[11px] text-[#6e5c54] flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5 text-[#772f1a] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#f58549]" /> 1-Click Role Switcher
              </span>
              <span className="text-[10px] text-[#585123] bg-[#f5f4ed] px-1.5 py-0.5 rounded font-bold">Demo Mode</span>
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
                      ? "bg-[#fdf8f2] border border-[#f2a65a] text-[#772f1a]"
                      : "hover:bg-[#f5f0e8] text-[#2b1712]"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs ${item.color}`}>
                    <ItemIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#772f1a]">{item.label}</span>
                      {isSelected && (
                        <span className="text-[10px] font-extrabold text-white bg-[#772f1a] px-2 py-0.5 rounded-full">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#6e5c54] truncate mt-0.5 font-medium">
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
