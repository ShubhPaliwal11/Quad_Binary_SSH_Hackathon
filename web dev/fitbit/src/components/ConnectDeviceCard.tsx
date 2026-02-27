import { Bluetooth, ArrowRight } from "lucide-react";
import React from "react";

export function ConnectDeviceCard() {
  const handleConnect = () => {
    alert("Connecting to your fitness band...");
  };

  return (
    <div 
      onClick={handleConnect}
      className="bg-dark-primary rounded-[24px] p-6 shadow-lg shadow-black/10 flex flex-col relative overflow-hidden group cursor-pointer active:scale-[0.99] transition-all"
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-lime-primary/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-lime-primary/20 transition-colors duration-500"></div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="w-10 h-10 rounded-full bg-lime-primary flex items-center justify-center text-dark-primary">
          <Bluetooth className="w-5 h-5" />
        </div>
        <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">
          <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">New Device</span>
        </div>
      </div>

      <div className="mb-8 relative z-10">
        <h3 className="text-xl font-bold text-white mb-2 leading-tight">
          Connect your <br /> fitness band
        </h3>
        <p className="text-xs text-white/60 leading-relaxed max-w-[180px]">
          Sync your latest health data and activity metrics automatically.
        </p>
      </div>

      <div className="relative h-24 mb-6 flex items-center justify-center">
        {/* Simplified Fitness Band Illustration */}
        <div className="relative w-16 h-24 bg-gray-800 rounded-2xl border-2 border-gray-700 shadow-2xl transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
          <div className="absolute top-2 left-1/2 -translateX-1/2 w-10 h-14 bg-black rounded-lg overflow-hidden border border-gray-600">
            <div className="w-full h-1 bg-lime-primary animate-pulse"></div>
            <div className="p-1 flex flex-col gap-1">
              <div className="w-full h-0.5 bg-white/20 rounded"></div>
              <div className="w-2/3 h-0.5 bg-white/20 rounded"></div>
            </div>
          </div>
          <div className="absolute bottom-2 left-1/2 -translateX-1/2 w-4 h-4 rounded-full bg-gray-700 border border-gray-600"></div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-1/4 w-2 h-2 bg-lime-primary rounded-full animate-ping"></div>
        <div className="absolute bottom-4 right-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
      </div>

      <button className="w-full bg-lime-primary hover:bg-[#e6ff80] text-dark-primary font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] relative z-10">
        <span>Connect Now</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
