import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  sublabel?: string;
  colorVariant?: "emerald" | "cyan" | "rose" | "amber";
  heightClassName?: string;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  sublabel,
  colorVariant = "emerald",
  heightClassName = "h-2.5",
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const gradientStyles = {
    emerald: "from-emerald-500 via-teal-400 to-emerald-400",
    cyan: "from-cyan-500 via-sky-400 to-teal-400",
    rose: "from-rose-500 via-red-400 to-amber-500",
    amber: "from-amber-500 via-yellow-400 to-emerald-400",
  };

  return (
    <div className={cn("space-y-1.5 w-full", className)}>
      {(label || sublabel) && (
        <div className="flex justify-between items-center text-xs font-medium">
          {label && <span className="text-slate-300">{label}</span>}
          {sublabel && <span className="text-slate-400 font-mono">{sublabel}</span>}
        </div>
      )}
      <div className={cn("w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800", heightClassName)}>
        <div
          className={cn(
            "bg-gradient-to-r h-full rounded-full transition-all duration-500 ease-out",
            gradientStyles[colorVariant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
