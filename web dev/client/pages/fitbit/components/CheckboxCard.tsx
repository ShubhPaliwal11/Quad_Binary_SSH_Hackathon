import { ArrowUp, ArrowDown, Check } from "lucide-react";
import React from "react";

export function CheckboxCard() {
  return (
    <div className="bg-surface rounded-[24px] p-6 shadow-sm shadow-black/[0.02] flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-lime-primary"></div>
          <span className="text-sm font-medium text-dark-primary">Checkbox</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-dark-primary hover:bg-gray-50">
            <ArrowUp className="w-3 h-3" />
          </button>
          <button className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-dark-primary hover:bg-gray-50">
            <ArrowDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border border-gray-200"></div>
            <span className="text-xs font-bold text-dark-primary">0.5h45s</span>
            <span className="text-[10px] font-medium text-text-secondary">Workout</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-dark-primary">
            <ArrowUpRightIcon className="w-3 h-3" />
            15
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border border-gray-200"></div>
            <span className="text-xs font-bold text-dark-primary">Apple</span>
            <span className="text-[10px] font-medium text-text-secondary">Fruit Juice</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-dark-primary">
            <ArrowUpRightIcon className="w-3 h-3" />
            12
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-dark-primary flex items-center justify-center">
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
            <span className="text-xs font-bold text-dark-primary">4,596m</span>
            <span className="text-[10px] font-medium text-text-secondary">Running</span>
          </div>
          <div className="bg-lime-primary text-dark-primary text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            <ArrowUpRightIcon className="w-3 h-3" />
            20
          </div>
        </div>

        <div className="flex items-center justify-between opacity-50">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border border-gray-200"></div>
            <span className="text-xs font-bold text-dark-primary">3,000ml</span>
            <span className="text-[10px] font-medium text-text-secondary">Water</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-dark-primary">
            More
            <ArrowUpRightIcon className="w-3 h-3" />
          </div>
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
