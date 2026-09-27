import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "border border-[#eadecd] bg-[#f5f0e8] text-[#772f1a]",
        outline:
          "border border-[#f2a65a] bg-transparent text-[#772f1a]",
        emerald:
          "border border-[#d4d0b6] bg-[#f5f4ed] text-[#585123]",
        rose:
          "border border-[#f5c2b8] bg-[#fbf4f2] text-[#943b22]",
        amber:
          "border border-[#f7d7b5] bg-[#fdf8f2] text-[#e07133]",
        cyan:
          "border border-[#d4d0b6] bg-[#f5f4ed] text-[#585123]",
        indigo:
          "border border-[#f7d7b5] bg-[#fef4ee] text-[#772f1a]",
        // Status specific
        emergency:
          "border border-[#943b22] bg-[#772f1a] text-white font-bold uppercase text-[10px] tracking-widest",
        community:
          "border border-[#585123] bg-[#585123] text-white font-bold uppercase text-[10px] tracking-widest",
        verified:
          "border border-[#585123]/30 bg-[#f5f4ed] text-[#585123] font-bold",
        pending:
          "border border-[#f58549]/30 bg-[#fef4ee] text-[#e07133] font-semibold",
        onChain:
          "border border-[#585123]/40 bg-[#f5f4ed] text-[#585123] font-mono text-[11px] font-bold",
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
