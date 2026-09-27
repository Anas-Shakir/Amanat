import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "border border-slate-700 bg-slate-800/80 text-slate-200",
        emerald:
          "border border-emerald-500/30 bg-emerald-950/70 text-emerald-300",
        rose:
          "border border-rose-500/30 bg-rose-950/70 text-rose-300",
        amber:
          "border border-amber-500/30 bg-amber-950/70 text-amber-300",
        cyan:
          "border border-cyan-500/30 bg-cyan-950/70 text-cyan-300",
        indigo:
          "border border-indigo-500/30 bg-indigo-950/70 text-indigo-300",
        // Status specific
        emergency:
          "border border-rose-500/50 bg-gradient-to-r from-rose-950 to-red-950 text-rose-200 font-bold uppercase text-[10px] tracking-widest",
        community:
          "border border-emerald-500/50 bg-gradient-to-r from-emerald-950 to-teal-950 text-emerald-200 font-bold uppercase text-[10px] tracking-widest",
        verified:
          "border border-emerald-500/40 bg-emerald-950/80 text-emerald-300 font-medium",
        pending:
          "border border-amber-500/40 bg-amber-950/80 text-amber-300 font-medium",
        onChain:
          "border border-cyan-500/40 bg-cyan-950/80 text-cyan-300 font-mono text-[11px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
