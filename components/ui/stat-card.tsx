import * as React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    label: string;
    positive?: boolean;
  };
  accentColor?: "emerald" | "cyan" | "rose" | "amber" | "indigo";
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = "emerald",
  className,
}: StatCardProps) {
  const colorStyles = {
    emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-950/20",
    cyan: "text-cyan-400 border-cyan-500/20 bg-cyan-950/20",
    rose: "text-rose-400 border-rose-500/20 bg-rose-950/20",
    amber: "text-amber-400 border-amber-500/20 bg-amber-950/20",
    indigo: "text-indigo-400 border-indigo-500/20 bg-indigo-950/20",
  };

  const iconColorStyles = {
    emerald: "bg-emerald-950/80 border-emerald-600/40 text-emerald-400",
    cyan: "bg-cyan-950/80 border-cyan-600/40 text-cyan-400",
    rose: "bg-rose-950/80 border-rose-600/40 text-rose-400",
    amber: "bg-amber-950/80 border-amber-600/40 text-amber-400",
    indigo: "bg-indigo-950/80 border-indigo-600/40 text-indigo-400",
  };

  return (
    <div
      className={cn(
        "p-5 rounded-2xl border border-slate-800/80 bg-slate-900/90 shadow-lg relative overflow-hidden transition-all hover:border-slate-700/80",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div
            className={cn(
              "w-8 h-8 rounded-xl border flex items-center justify-center text-sm",
              iconColorStyles[accentColor]
            )}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
        {value}
      </div>

      {(subtitle || trend) && (
        <div className="mt-1 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={cn(
                "font-semibold",
                trend.positive ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {trend.label}
            </span>
          )}
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
