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
  const iconColorStyles = {
    emerald: "bg-[#585123] text-white shadow-xs",
    cyan: "bg-[#772f1a] text-white shadow-xs",
    rose: "bg-[#943b22] text-white shadow-xs",
    amber: "bg-[#f58549] text-white shadow-xs",
    indigo: "bg-[#772f1a] text-white shadow-xs",
  };

  return (
    <div
      className={cn(
        "p-5 rounded-2xl border border-[#eadecd] bg-[#ffffff] shadow-xs relative overflow-hidden transition-all hover:border-[#f2a65a] hover:shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-[#6e5c54] uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold",
              iconColorStyles[accentColor]
            )}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2 text-2xl sm:text-3xl font-black text-[#772f1a] tracking-tight">
        {value}
      </div>

      {(subtitle || trend) && (
        <div className="mt-1 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={cn(
                "font-bold",
                trend.positive ? "text-[#585123]" : "text-[#943b22]"
              )}
            >
              {trend.label}
            </span>
          )}
          {subtitle && <span className="text-[#6e5c54] font-medium">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
