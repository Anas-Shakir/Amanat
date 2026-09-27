import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  prefixText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, prefixText, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3.5 text-[#6e5c54] pointer-events-none flex items-center">
            {icon}
          </div>
        )}
        {prefixText && (
          <div className="absolute left-3.5 text-[#772f1a] font-bold text-sm pointer-events-none flex items-center">
            {prefixText}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-xl border border-[#eadecd] bg-white px-3.5 py-2 text-sm text-[#2b1712] placeholder:text-[#a8978c] focus:border-[#f58549] focus:outline-none focus:ring-2 focus:ring-[#f58549]/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150 shadow-2xs",
            icon && "pl-10",
            prefixText && "pl-12",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
