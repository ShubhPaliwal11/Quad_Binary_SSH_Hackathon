import { MoreHorizontal } from "lucide-react";
import React from "react";

interface WorkoutCardProps {
  spo2: number;
  heartRate: number;
}

export function WorkoutCard({ spo2, heartRate }: WorkoutCardProps) {
  const hrColor =
    heartRate < 100 ? "text-dark-primary" :
    heartRate < 130 ? "text-yellow-500" :
    "text-red-500";

  return (
    <div className="bg-surface rounded-[24px] p-6 shadow-sm shadow-black/[0.02] flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-lime-primary"></div>
          <span className="text-sm font-medium text-dark-primary">Workout</span>
        </div>
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:bg-gray-50">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="w-24 h-24 relative">
          <img
            src="https://picsum.photos/seed/pushup/200/200"
            alt="Pushup"
            className="w-full h-full object-cover rounded-2xl mix-blend-multiply"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-text-secondary">Time Tracking</span>
            <div className="bg-lime-primary text-dark-primary text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
              <ArrowUpRightIcon className="w-3 h-3" />
              35%
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <h2 className="text-4xl font-bold text-dark-primary tracking-tight">139</h2>
            <span className="text-sm font-medium text-text-secondary">/160h</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-auto">
        <div className="bg-gray-50 rounded-2xl p-4 flex flex-col justify-between border border-gray-100">
          <span className="text-xs font-medium text-text-secondary mb-2">Oxygen</span>
          <div className="flex items-baseline gap-1 mb-4">
            <h3 className="text-2xl font-bold text-dark-primary tracking-tight">{spo2}</h3>
            <span className="text-sm font-bold text-dark-primary">%</span>
          </div>
          <span className="text-[8px] font-medium text-text-secondary uppercase tracking-wider">
            SPO2 LEVEL
          </span>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 flex flex-col justify-between border border-gray-100">
          <span className="text-xs font-medium text-text-secondary mb-2">Heart Rate</span>
          <div className="flex items-baseline gap-1 mb-4">
            <h3 className={`text-2xl font-bold tracking-tight ${hrColor}`}>{heartRate}</h3>
            <span className="text-sm font-medium text-text-secondary">bpm</span>
          </div>
          <span className="text-[8px] font-medium text-text-secondary uppercase tracking-wider">
            LIVE MONITOR
          </span>
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
