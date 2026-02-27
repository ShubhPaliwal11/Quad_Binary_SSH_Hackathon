import { Heart } from "lucide-react";

export function ExposureCard() {
  return (
    <div className="bg-surface rounded-[24px] p-6 shadow-sm shadow-black/[0.02] flex flex-col relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 w-64 h-64 bg-lime-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

      <h3 className="text-2xl font-bold text-dark-primary leading-tight mb-4 max-w-[200px] relative z-10">
        Get more exposure and monitor with precision
      </h3>

      <p className="text-xs text-text-secondary leading-relaxed mb-8 max-w-[240px] relative z-10">
        Experience a new era of healthcare with our AI-powered blockchain platform. Keep a watchful eye on your heart's BPM (Beats Per Minute) like never before.
      </p>

      <div className="flex items-center gap-4 mt-auto relative z-10">
        <button className="bg-dark-primary text-white text-xs font-bold py-3 px-6 rounded-full hover:bg-black transition-colors">
          Get App
        </button>
        <button className="text-xs font-bold text-dark-primary underline underline-offset-4 hover:text-black transition-colors">
          Learn more
        </button>
      </div>

      <div className="absolute bottom-4 right-4 w-32 h-32 flex items-center justify-center">
        <div className="absolute inset-0 bg-lime-primary/20 rounded-full border border-lime-primary/30 flex items-center justify-center">
          <div className="w-24 h-24 bg-lime-primary rounded-full flex flex-col items-center justify-center shadow-[0_0_30px_rgba(217,255,65,0.4)]">
            <Heart className="w-6 h-6 text-dark-primary mb-1" fill="currentColor" />
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-dark-primary">89</span>
              <span className="text-[10px] font-medium text-dark-primary">bpm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
