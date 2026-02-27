import { RefreshCw } from "lucide-react";
import React from "react";

export function BreathCard() {
  return (
    <div className="bg-surface rounded-[24px] p-6 shadow-sm shadow-black/[0.02] flex flex-col h-full relative overflow-hidden">
      <div className="flex items-start justify-between mb-6">
        <div className="flex flex-col">
          <h3 className="text-2xl font-bold text-dark-primary leading-tight max-w-[150px]">
            TAKE A BREATH NOW
          </h3>
          <div className="flex items-center gap-2 mt-4">
            <div className="bg-gray-100 text-text-secondary text-[10px] font-bold px-3 py-1.5 rounded-full">
              35/m2
            </div>
            <span className="text-xs font-medium text-text-secondary">
              Breath Level is Normal now, 12
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-xs font-bold text-dark-primary max-w-[120px] text-right leading-tight mb-4">
            Waite 2 sec, and then take a deep breath!
          </p>
          <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-dark-primary hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-end justify-between mt-auto">
        <div className="bg-lime-primary rounded-[20px] p-4 pr-12 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-dark-primary"></div>
            <span className="text-[10px] font-bold text-dark-primary">04%</span>
          </div>
          <div className="flex items-center gap-1 mb-2">
            <div className="w-2 h-2 rounded-full border border-dark-primary"></div>
            <div className="w-2 h-2 rounded-full bg-dark-primary"></div>
            <div className="w-2 h-2 rounded-full border border-dark-primary"></div>
          </div>
          <h2 className="text-4xl font-bold text-dark-primary tracking-tight">10.57</h2>
          
          <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-8 opacity-50">
            <img src="https://picsum.photos/seed/human/200/200" alt="Human Body" className="w-full h-full object-cover mix-blend-multiply" referrerPolicy="no-referrer" />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-lime-primary text-dark-primary text-[10px] font-bold px-2 py-1 rounded-md mb-2 flex items-center gap-1">
            <ArrowUpRightIcon className="w-3 h-3" />
            2.76%
          </div>
          <div className="flex items-end gap-2 h-16">
            {[10, 20, 15, 30, 25, 10, 20].map((height, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-1.5 bg-gray-200 rounded-full relative" style={{ height: `${height}px` }}>
                  {i === 3 && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-lime-primary -mt-1"></div>
                  )}
                </div>
                <span className="text-[8px] font-medium text-text-secondary">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}
                </span>
              </div>
            ))}
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
