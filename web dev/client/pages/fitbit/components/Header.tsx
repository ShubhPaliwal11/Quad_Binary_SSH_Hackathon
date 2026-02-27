import { Stethoscope, RefreshCw, Check, Heart, Dumbbell, Sparkles, Bell, Menu, Bluetooth, Battery } from "lucide-react";
import React, { useState, useEffect } from "react";
import { BandData } from "../types";
import { useMiBand } from "../../../miband/MiBandContext";
import { BluetoothDeviceWrapper, getBatteryLevel } from "../../../miband/band-connection";

export function Header() {
  const { authorizedDevices } = useMiBand();

  const [bandData, setBandData] = useState<BandData | null>({
    steps: 0, distance: 0, calories: 0, goal: 10000, spo2: 0,
    currentHeartRate: 0, battery: 0, isConnected: authorizedDevices.length > 0,
    hourlySteps: [], lastSync: new Date().toISOString()
  });

  useEffect(() => {
    let isMounted = true;

    const updateHeaderData = async () => {
      if (authorizedDevices.length > 0) {
        setBandData(prev => prev ? { ...prev, isConnected: true } : null);

        try {
          const rawDevice = authorizedDevices[0];
          if (rawDevice.gatt?.connected) {
            const device = new BluetoothDeviceWrapper(rawDevice);
            const batteryInfo = await getBatteryLevel(device);
            if (isMounted) {
              setBandData(prev => prev ? { ...prev, battery: batteryInfo.batteryLevel } : null);
            }
          }
        } catch (err) {
          console.error("Failed to fetch battery info for header:", err);
        }
      } else {
        if (isMounted) {
          setBandData(prev => prev ? { ...prev, isConnected: false } : null);
        }
      }
    };

    updateHeaderData();

    return () => {
      isMounted = false;
    };
  }, [authorizedDevices]);

  return (
    <header className="flex items-center justify-between py-6 px-8 bg-surface rounded-b-[32px] mb-8 sticky top-0 z-10 shadow-sm shadow-black/[0.02]">
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-100">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-dark-primary hover:bg-white transition-colors">
            <Stethoscope className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-dark-primary hover:bg-white transition-colors">
            <RefreshCw className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-dark-primary hover:bg-white transition-colors">
            <Check className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 rounded-full py-2 px-4 border border-gray-100">
          <img
            src="https://picsum.photos/seed/celeste/100/100"
            alt="Celeste T. Koch"
            className="w-8 h-8 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-dark-primary leading-tight">Celeste T. Koch</span>
            <span className="text-[10px] text-text-secondary leading-tight">@mkochceleste</span>
          </div>
          <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
            <Heart className="w-4 h-4 text-dark-primary" fill="currentColor" />
            <Dumbbell className="w-4 h-4 text-dark-primary" strokeWidth={2} />
            <Sparkles className="w-4 h-4 text-dark-primary" strokeWidth={2} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-lime-primary to-blue-400 text-white">
            <AsteriskIcon className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-dark-primary leading-tight">Hi Celeste, —</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-secondary leading-tight">Welcome to AI-BL</span>
              {bandData && (
                <div className="flex items-center gap-1 bg-lime-primary/20 px-2 py-0.5 rounded-full">
                  <Bluetooth className="w-2.5 h-2.5 text-dark-primary" />
                  <span className="text-[8px] font-bold text-dark-primary">
                    {bandData.isConnected ? "CONNECTED" : "DISCONNECTED"}
                  </span>
                  <Battery className="w-2.5 h-2.5 text-dark-primary ml-1" />
                  <span className="text-[8px] font-bold text-dark-primary">{bandData.battery}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-50 rounded-full py-2 px-4 border border-gray-100">
            <Bell className="w-4 h-4 text-text-secondary" strokeWidth={2} />
            <span className="text-sm font-medium text-dark-primary">Sat, 26 Aug</span>
            <div className="w-5 h-5 rounded-full bg-dark-primary text-white flex items-center justify-center text-[10px] font-bold ml-1">
              5
            </div>
          </div>
          <button className="w-12 h-12 rounded-full flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors">
            <Menu className="w-5 h-5 text-dark-primary" strokeWidth={2} />
          </button>
        </div>
      </div>
    </header>
  );
}

function AsteriskIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 6v12" />
      <path d="M17.196 9 6.804 15" />
      <path d="m6.804 9 10.392 6" />
    </svg>
  );
}
