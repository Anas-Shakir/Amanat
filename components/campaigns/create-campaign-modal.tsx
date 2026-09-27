"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Flame, 
  ShieldCheck, 
  Sparkles
} from "lucide-react";
import { AidMode, AidCategory } from "@/types";

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newCampaign: any) => void;
}

export function CreateCampaignModal({
  isOpen,
  onClose,
  onCreated,
}: CreateCampaignModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState<AidMode>("EMERGENCY");
  const [category, setCategory] = useState<AidCategory>("EMERGENCY_FOOD");
  const [targetAmount, setTargetAmount] = useState("150000");
  const [location, setLocation] = useState("Johi & Mehar, Dadu, Sindh");
  const [targetHouseholds, setTargetHouseholds] = useState("35");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          mode,
          category,
          targetAmount: Number(targetAmount),
          location,
          city: "Dadu",
          targetHouseholds: Number(targetHouseholds),
        }),
      });

      const data = await res.json();
      if (data.success) {
        onCreated(data.campaign);
        onClose();
        // Reset form
        setTitle("");
        setDescription("");
      }
    } catch (err) {
      console.error("Failed to create campaign:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Verifiable Aid Pool"
      description="Launch a new geographic aid pool in Dadu to connect humanitarian donations with verified household entitlements."
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Mode Selector */}
        <div className="space-y-1.5">
          <label className="text-[#2b1712] font-bold uppercase tracking-wider">
            Operational Mode
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode("EMERGENCY")}
              className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                mode === "EMERGENCY"
                  ? "bg-[#fbf4f2] border-[#772f1a] text-[#772f1a] shadow-sm font-bold"
                  : "bg-white border-[#eadecd] text-[#6e5c54] hover:border-[#f2a65a]"
              }`}
            >
              <Flame className="w-4 h-4 text-[#772f1a] mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-bold text-xs text-[#772f1a]">Emergency Mode</div>
                <div className="text-[10px] text-[#6e5c54]">Flood / Sudden Crisis</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMode("COMMUNITY")}
              className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                mode === "COMMUNITY"
                  ? "bg-[#f5f4ed] border-[#585123] text-[#585123] shadow-sm font-bold"
                  : "bg-white border-[#eadecd] text-[#6e5c54] hover:border-[#f2a65a]"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#585123] mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-bold text-xs text-[#585123]">Community Mode</div>
                <div className="text-[10px] text-[#6e5c54]">Zakat / Monthly Welfare</div>
              </div>
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-[#2b1712] font-bold uppercase tracking-wider">
            Pool Title
          </label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Mehar Union Council Flood Relief Food Pool"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-[#2b1712] font-bold uppercase tracking-wider">
            Objective & Scope
          </label>
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Providing 30-day emergency food ration entitlements to flood-affected families."
            required
          />
        </div>

        {/* Category & Location */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[#2b1712] font-bold uppercase tracking-wider">
              Aid Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as AidCategory)}
              className="w-full h-11 rounded-xl border border-[#eadecd] bg-white px-3 text-xs text-[#2b1712] focus:outline-none focus:border-[#f58549]"
            >
              <option value="EMERGENCY_FOOD">Emergency Food & Water</option>
              <option value="CLEAN_WATER">Clean Drinking Water</option>
              <option value="ZAKAT_RATION">Zakat Monthly Ration</option>
              <option value="MEDICAL_SUPPLIES">Emergency Medical Supplies</option>
              <option value="MONTHLY_FOOD_BASKET">Monthly Food Basket</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[#2b1712] font-bold uppercase tracking-wider">
              Target Households
            </label>
            <Input
              type="number"
              value={targetHouseholds}
              onChange={(e) => setTargetHouseholds(e.target.value)}
              placeholder="35"
              required
            />
          </div>
        </div>

        {/* Funding Goal & Location */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[#2b1712] font-bold uppercase tracking-wider">
              Target Funding (PKR)
            </label>
            <Input
              type="number"
              prefixText="Rs."
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="150000"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[#2b1712] font-bold uppercase tracking-wider">
              Location / Dadu Area
            </label>
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Johi & Mehar, Dadu"
              required
            />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#fbf9f6] border border-[#eadecd] text-[11px] text-[#6e5c54] flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-[#f58549] mt-0.5 flex-shrink-0" />
          <p>
            Once published, this pool becomes immediately available for donor funding and authorized household entitlement allocation.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={isSubmitting || !title || !description}
          >
            {isSubmitting ? "Creating Pool..." : "Publish Aid Pool"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
