import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  sublabel?: string;
  colorVariant?: "emerald" | "cyan" | "rose" | "amber" | "terracotta" | "olive" | "maroon" | "sand";
  heightClassName?: string;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  sublabel,
  colorVariant = "olive",
  heightClassName = "h-2.5",
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const solidColorStyles: Record<string, string> = {
    emerald: "bg-[#585123]",
    olive: "bg-[#585123]",
    cyan: "bg-[#772f1a]",
    maroon: "bg-[#772f1a]",
    rose: "bg-[#772f1a]",
    amber: "bg-[#f58549]",
    terracotta: "bg-[#f58549]",
    sand: "bg-[#f2a65a]",
  };

  return (
    <div className={cn("space-y-1.5 w-full", className)}>
      {(label || sublabel) && (
        <div className="flex justify-between items-center text-xs font-semibold">
          {label && <span className="text-[#2b1712]">{label}</span>}
          {sublabel && <span className="text-[#772f1a] font-mono font-bold">{sublabel}</span>}
        </div>
      )}
      <div className={cn("w-full bg-[#f4ede4] rounded-full overflow-hidden border border-[#eadecd]", heightClassName)}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            solidColorStyles[colorVariant] || "bg-[#585123]"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
