import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-950/50 hover:shadow-emerald-900/40",
        secondary:
          "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700 hover:border-slate-600",
        outline:
          "border border-slate-700 bg-transparent text-slate-200 hover:bg-slate-850 hover:text-white hover:border-slate-600",
        ghost:
          "text-slate-300 hover:bg-slate-800/80 hover:text-white",
        danger:
          "bg-rose-600 text-white hover:bg-rose-500 shadow-md shadow-rose-950/50",
        accent:
          "bg-cyan-600 text-white hover:bg-cyan-500 shadow-md shadow-cyan-950/50",
        // Specialized high-contrast merchant action button for mobile
        merchant:
          "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-lg py-4 px-6 rounded-2xl shadow-xl shadow-emerald-950 hover:brightness-110 active:brightness-90",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-lg",
        default: "h-10 px-4 py-2",
        lg: "h-12 px-6 text-base rounded-xl",
        xl: "h-14 px-8 text-lg rounded-2xl",
        icon: "h-10 w-10 p-0 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
