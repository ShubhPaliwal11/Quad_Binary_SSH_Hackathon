import { Asterisk, Activity, Pill, Bone, HeartPulse, RefreshCw, Box, Maximize2, Settings } from "lucide-react";
import { cnMerge } from "../lib/utils";

export function Sidebar() {
  const icons = [
    { icon: Asterisk, label: "Asterisk" },
    { icon: Activity, label: "SpO2", active: true },
    { icon: Pill, label: "Rx" },
    { icon: Bone, label: "BMD" },
    { icon: HeartPulse, label: "Pulse" },
    { icon: RefreshCw, label: "Sync" },
    { icon: Box, label: "Box" },
  ];

  return (
    <aside className="w-20 bg-surface h-screen flex flex-col items-center py-8 border-r border-gray-100 flex-shrink-0 sticky top-0">
      <div className="flex flex-col items-center mb-12">
        <Asterisk className="w-8 h-8 text-dark-primary mb-1" />
        <span className="text-[10px] font-bold tracking-wider">AI-BL</span>
      </div>

      <nav className="flex flex-col items-center gap-6 flex-1">
        {icons.map((item, i) => (
          <button
            key={i}
            className={cnMerge(
              "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
              item.active
                ? "bg-lime-primary text-dark-primary"
                : "text-text-secondary hover:bg-gray-50"
            )}
            title={item.label}
          >
            {item.label === "SpO2" ? (
              <span className="text-[10px] font-bold">SpO2</span>
            ) : item.label === "Rx" ? (
              <span className="text-xs font-bold">Rx</span>
            ) : item.label === "BMD" ? (
              <span className="text-[10px] font-bold">BMD</span>
            ) : item.label === "Pulse" ? (
              <span className="text-[10px] font-bold">Pulse</span>
            ) : (
              <item.icon className="w-5 h-5" strokeWidth={1.5} />
            )}
          </button>
        ))}
        <div className="text-[10px] font-medium text-text-secondary mt-2">12:34</div>
      </nav>

      <div className="flex flex-col items-center gap-4 mt-auto">
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-gray-50">
          <Maximize2 className="w-4 h-4" strokeWidth={1.5} />
        </button>
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-gray-50 bg-gray-100">
          <Settings className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>
    </aside>
  );
}
