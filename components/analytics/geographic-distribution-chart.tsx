"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

const regionData = [
  { area: "Johi UC 4", families: 14, pkr: 56000, color: "#10b981" },
  { area: "Mehar Main", families: 9, pkr: 36000, color: "#06b6d4" },
  { area: "KN Shah", families: 7, pkr: 28000, color: "#6366f1" },
  { area: "Radhan Station", families: 5, pkr: 20000, color: "#f59e0b" },
];

interface TooltipProps {
  active?: boolean;
  payload?: any[];
}

function RegionTooltip({ active, payload }: TooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-950/95 border border-slate-800 p-3 rounded-xl shadow-xl text-xs space-y-1">
        <div className="font-bold text-white">{data.area}</div>
        <div className="text-emerald-400">
          Families Assisted: <strong className="text-white">{data.families}</strong>
        </div>
        <div className="text-slate-400">
          Aid Volume: <strong className="text-slate-200">Rs. {data.pkr.toLocaleString()}</strong>
        </div>
      </div>
    );
  }
  return null;
}

export function GeographicDistributionChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={regionData} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
          <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis 
            dataKey="area" 
            type="category" 
            stroke="#94a3b8" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip content={<RegionTooltip />} />
          <Bar dataKey="families" radius={[0, 8, 8, 0]}>
            {regionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
