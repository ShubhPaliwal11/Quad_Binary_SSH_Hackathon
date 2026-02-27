import { Plus, Minus } from "lucide-react";
import React from "react";

interface WellnessCardProps {
  steps: number;
  distance: number;
  calories: number;
}

export function WellnessCard({ steps, distance, calories }: WellnessCardProps) {
  return (
    <div className="bg-surface rounded-[24px] p-6 shadow-sm shadow-black/[0.02] flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-lime-primary"></div>
          <span className="text-sm font-medium text-dark-primary">Wellness</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-dark-primary"></div>
          <span className="text-sm font-medium text-text-secondary">News</span>
        </div>
      </div>

      <div className="flex items-start justify-between mb-12">
        <div className="flex flex-col">
          <h2 className="text-4xl font-bold text-dark-primary tracking-tight">{steps.toLocaleString()}</h2>
          <span className="text-xs font-medium text-text-secondary mt-1">Steps Today</span>
        </div>
        <div className="bg-lime-primary text-dark-primary text-[10px] font-bold px-2 py-1 rounded-md">
          +7%
        </div>
      </div>

      <div className="flex items-end justify-between mb-6">
        <p className="text-[10px] font-bold text-text-secondary leading-relaxed max-w-[140px] tracking-wider uppercase">
          {distance} km • {calories} kcal
        </p>
        <div className="flex flex-col gap-2">
          <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-dark-primary hover:bg-gray-50">
            <Plus className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-dark-primary hover:bg-gray-50">
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="h-[1px] w-full bg-gray-100 mb-6"></div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-dark-primary">{calories}</span>
          <span className="text-[10px] font-medium text-text-secondary mt-1">KCAL</span>
          <span className="text-[10px] font-medium text-text-secondary mt-1 max-w-[60px] leading-tight">Calories Burned</span>
        </div>
        <div className="w-[1px] h-12 bg-gray-100 mx-4"></div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-dark-primary">{steps > 5000 ? 1 : 0}</span>
          <span className="text-[10px] font-medium text-text-secondary mt-1 max-w-[60px] leading-tight">Goals Reached</span>
        </div>
        <div className="flex flex-col items-end ml-auto">
          <div className="flex items-center gap-1 text-[10px] font-bold text-dark-primary">
            <ArrowUpRightIcon className="w-3 h-3" />
            +34%
          </div>
          <span className="text-[10px] font-medium text-text-secondary mt-1">2d</span>
        </div>
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
