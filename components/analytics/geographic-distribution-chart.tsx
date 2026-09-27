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
  { area: "Johi UC 4", families: 14, pkr: 56000, color: "#772f1a" },
  { area: "Mehar Main", families: 9, pkr: 36000, color: "#f58549" },
  { area: "KN Shah", families: 7, pkr: 28000, color: "#f2a65a" },
  { area: "Radhan Station", families: 5, pkr: 20000, color: "#585123" },
];

interface TooltipProps {
  active?: boolean;
  payload?: any[];
}

function RegionTooltip({ active, payload }: TooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-[#eadecd] p-3 rounded-xl shadow-lg text-xs space-y-1">
        <div className="font-bold text-[#772f1a]">{data.area}</div>
        <div className="text-[#585123]">
          Families Assisted: <strong className="text-[#2b1712]">{data.families}</strong>
        </div>
        <div className="text-[#6e5c54]">
          Aid Volume: <strong className="text-[#772f1a]">Rs. {data.pkr.toLocaleString()}</strong>
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
          <XAxis type="number" stroke="#6e5c54" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis 
            dataKey="area" 
            type="category" 
            stroke="#2b1712" 
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
