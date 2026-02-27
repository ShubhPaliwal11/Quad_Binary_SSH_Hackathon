import { Hourglass, Plus, Minus } from "lucide-react";
import React from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { HourlyStep } from "../types";

interface AnalyticsChartProps {
  hourlySteps: HourlyStep[];
  totalSteps: number;
}

export function AnalyticsChart({ hourlySteps, totalSteps }: AnalyticsChartProps) {
  return (
    <div className="bg-surface rounded-[24px] p-6 shadow-sm shadow-black/[0.02] flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-lime-primary"></div>
          <span className="text-sm font-medium text-dark-primary">Analytics</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full flex items-center justify-center text-dark-primary hover:bg-gray-50">
            <Hourglass className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center text-dark-primary hover:bg-gray-50">
            <Plus className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center text-dark-primary hover:bg-gray-50">
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-end gap-12 mb-8">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-text-secondary mb-1">Tracker</span>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-dark-primary tracking-tight">{totalSteps.toLocaleString()}</h2>
            <span className="text-sm font-bold text-dark-primary">Steps</span>
            <div className="bg-lime-primary text-dark-primary text-[10px] font-bold px-2 py-1 rounded-md ml-2 flex items-center gap-1">
              <ArrowUpRightIcon className="w-3 h-3" />
              Today
            </div>
          </div>
        </div>
      </div>

      <div className="h-[200px] w-full mb-8 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hourlySteps} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#7C7C7C", fontSize: 10, fontWeight: 500 }}
              dy={10}
              interval={3}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              labelStyle={{ color: "#121212", fontWeight: "bold" }}
            />
            <Bar dataKey="steps" radius={[10, 10, 10, 10]} barSize={12}>
              {hourlySteps.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.steps > 500 ? "#D9FF41" : "#121212"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 mt-auto scrollbar-hide">
        <button className="bg-lime-primary text-dark-primary text-xs font-bold py-2 px-4 rounded-full whitespace-nowrap">
          Steps
        </button>
        <button className="bg-white border border-gray-200 text-text-secondary hover:text-dark-primary text-xs font-medium py-2 px-4 rounded-full whitespace-nowrap transition-colors">
          Calories
        </button>
        <button className="bg-white border border-gray-200 text-text-secondary hover:text-dark-primary text-xs font-medium py-2 px-4 rounded-full whitespace-nowrap transition-colors">
          Distance
        </button>
        <button className="bg-white border border-gray-200 text-text-secondary hover:text-dark-primary text-xs font-medium py-2 px-4 rounded-full whitespace-nowrap transition-colors">
          Heart Rate
        </button>
      </div>
    </div>
  );
}

function ArrowUpRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}
