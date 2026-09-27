"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid 
} from "recharts";
import { formatCurrencyPKR } from "@/lib/utils";

const sampleData = [
  { day: "Day 1", funded: 20000, fulfilled: 0 },
  { day: "Day 5", funded: 50000, fulfilled: 12000 },
  { day: "Day 10", funded: 80000, fulfilled: 34000 },
  { day: "Day 15", funded: 100000, fulfilled: 52000 },
  { day: "Day 20", funded: 100000, fulfilled: 68000 },
  { day: "Day 25", funded: 100000, fulfilled: 72000 },
  { day: "Today", funded: 100000, fulfilled: 73200 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#eadecd] p-3 rounded-xl shadow-lg text-xs space-y-1">
        <div className="font-bold text-[#772f1a] mb-1">{label}</div>
        <div className="text-[#f58549] flex items-center justify-between gap-3">
          <span className="font-semibold">Pool Funded:</span>
          <span className="font-mono font-bold">{formatCurrencyPKR(payload[0]?.value || 0)}</span>
        </div>
        <div className="text-[#585123] flex items-center justify-between gap-3">
          <span className="font-semibold">Store Fulfilled:</span>
          <span className="font-mono font-bold">{formatCurrencyPKR(payload[1]?.value || 0)}</span>
        </div>
      </div>
    );
  }
  return null;
}

export function FulfillmentChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sampleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eadecd" vertical={false} />
          <XAxis 
            dataKey="day" 
            stroke="#6e5c54" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#6e5c54" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(val) => `Rs.${val / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="funded"
            name="Funds Committed"
            stroke="#f58549"
            strokeWidth={2}
            fill="#f2a65a"
            fillOpacity={0.25}
          />
          <Area
            type="monotone"
            dataKey="fulfilled"
            name="Goods Handed Over"
            stroke="#585123"
            strokeWidth={2.5}
            fill="#585123"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
