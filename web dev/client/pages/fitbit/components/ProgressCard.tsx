import { MoreHorizontal } from "lucide-react";

interface ProgressCardProps {
  steps: number;
  goal: number;
}

export function ProgressCard({ steps, goal }: ProgressCardProps) {
  const progress = Math.min(Math.round((steps / goal) * 100), 100);

  return (
    <div className="bg-surface rounded-[24px] p-6 shadow-sm shadow-black/[0.02] flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-lime-primary"></div>
          <span className="text-sm font-medium text-dark-primary">Progress</span>
        </div>
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:bg-gray-50">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-24 h-24 rounded-2xl overflow-hidden relative">
          <img
            src="https://picsum.photos/seed/watch/200/200"
            alt="Running Watch"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-lime-primary/20 mix-blend-multiply"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-text-secondary mb-1">Goal: {goal.toLocaleString()}</span>
          <h2 className="text-4xl font-bold text-dark-primary tracking-tight">{progress}%</h2>
          <span className="text-[10px] font-medium text-text-secondary mt-1">{steps.toLocaleString()} Completed</span>
        </div>
      </div>

      <div className="w-full bg-gray-100 h-2 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-lime-primary h-full rounded-full transition-all duration-1000" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex flex-wrap gap-2 mt-auto">
        <span className="text-[10px] font-medium text-text-secondary bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">Daily Goal</span>
        <span className="text-[10px] font-medium text-text-secondary bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">Weekly Avg</span>
        <span className="text-[10px] font-medium text-text-secondary bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">Streak: 5d</span>
      </div>
    </div>
  );
}

