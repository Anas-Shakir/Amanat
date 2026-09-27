"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2b1712]/60 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={cn(
          "relative w-full max-w-lg rounded-3xl border border-[#eadecd] bg-white p-6 sm:p-8 text-[#2b1712] shadow-2xl z-10 space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200",
          className
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#f2e8dc] pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#772f1a] tracking-tight">{title}</h2>
            {description && (
              <p className="text-xs sm:text-sm text-[#6e5c54] mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-[#6e5c54] hover:bg-[#f5f0e8] hover:text-[#772f1a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
