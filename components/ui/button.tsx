import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f58549] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:scale-[0.97]",
  {
    variants: {
      variant: {
        primary:
          "bg-[#f58549] text-white hover:bg-[#e07133] shadow-sm shadow-[#f58549]/30",
        secondary:
          "bg-[#772f1a] text-white hover:bg-[#521f11] shadow-sm shadow-[#772f1a]/20",
        outline:
          "border border-[#f2a65a] bg-white text-[#772f1a] hover:bg-[#fdf8f2] hover:border-[#f58549]",
        ghost:
          "text-[#772f1a] hover:bg-[#f5f0e8] hover:text-[#521f11]",
        danger:
          "bg-[#943b22] text-white hover:bg-[#772f1a] shadow-sm",
        accent:
          "bg-[#585123] text-white hover:bg-[#736b32] shadow-sm shadow-[#585123]/25",
        // High-contrast merchant action button for mobile
        merchant:
          "bg-[#f58549] text-white font-extrabold text-lg py-4 px-6 rounded-2xl shadow-lg shadow-[#f58549]/30 hover:bg-[#e07133] active:scale-[0.96]",
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
