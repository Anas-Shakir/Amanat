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
      <div className="bg-slate-950/95 border border-slate-800 p-3 rounded-xl shadow-2xl text-xs space-y-1">
        <div className="font-bold text-white mb-1">{label}</div>
        <div className="text-cyan-400 flex items-center justify-between gap-3">
          <span>Pool Funded:</span>
          <span className="font-mono font-bold">{formatCurrencyPKR(payload[0]?.value || 0)}</span>
        </div>
        <div className="text-emerald-400 flex items-center justify-between gap-3">
          <span>Store Fulfilled:</span>
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
          <defs>
            <linearGradient id="colorFunded" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorFulfilled" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="day" 
            stroke="#64748b" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#64748b" 
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
            stroke="#06b6d4"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorFunded)"
          />
          <Area
            type="monotone"
            dataKey="fulfilled"
            name="Goods Handed Over"
            stroke="#10b981"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorFulfilled)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
