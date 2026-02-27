import { Calendar, Clock, ArrowRight, Loader2, RefreshCw, Activity, Footprints, HeartPulse, Route } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { WellnessCard } from "./WellnessCard";
import { ExposureCard } from "./ExposureCard";
import { ConnectDeviceCard } from "./ConnectDeviceCard";
import { AnalyticsChart } from "./AnalyticsChart";
import { BreathCard } from "./BreathCard";
import { ProgressCard } from "./ProgressCard";
import { CheckboxCard } from "./CheckboxCard";
import { WorkoutCard } from "./WorkoutCard";
import { BandData } from "../types";

import { useMiBand } from "../../../miband/MiBandContext";
import { BluetoothDeviceWrapper, requestDevice, getHeartRate, startHeartRateMonitoring, getCurrentStatus, getBatteryLevel, authenticate, authKeyStringToKey } from "../../../miband/band-connection";

export function Dashboard() {
  const { bands, authorizedDevices } = useMiBand();

  const [bandData, setBandData] = useState<BandData | null>({
    steps: 0,
    distance: 0,
    calories: 0,
    hourlySteps: [
      { time: '08:00', steps: 0 },
      { time: '09:00', steps: 0 },
      { time: '10:00', steps: 0 },
      { time: '11:00', steps: 0 },
      { time: '12:00', steps: 0 },
      { time: '13:00', steps: 0 },
      { time: '14:00', steps: 0 },
      { time: '15:00', steps: 0 },
      { time: '16:00', steps: 0 },
      { time: '17:00', steps: 0 }
    ],
    goal: 10000,
    spo2: 0,
    currentHeartRate: 0,
    isConnected: authorizedDevices.length > 0,
    battery: 0,
    lastSync: new Date().toISOString()
  });

  const [loading, setLoading] = useState(false);

  // Sync connection state and start heart rate monitoring
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let isMounted = true;

    const setupDevice = async () => {
      if (authorizedDevices.length > 0) {
        setBandData(prev => prev ? { ...prev, isConnected: true } : null);
        const rawDevice = authorizedDevices[0];
        const matchedBand = bands.find(b => b.deviceId === rawDevice.id);

        if (matchedBand) {
          try {
            const device = new BluetoothDeviceWrapper(rawDevice);

            // Fetch initial real-time data
            try {
              if (!rawDevice.gatt?.connected) {
                const key = await authKeyStringToKey(matchedBand.authKey);
                await authenticate(device, key);
              }

              const status = await getCurrentStatus(device);
              const batteryInfo = await getBatteryLevel(device);

              if (isMounted) {
                setBandData(prev => prev ? {
                  ...prev,
                  steps: status.steps,
                  distance: Number((status.meters / 1000).toFixed(2)),
                  calories: status.calories,
                  battery: batteryInfo.batteryLevel,
                  lastSync: new Date().toISOString()
                } : null);
              }
            } catch (dataErr) {
              console.error("Failed to fetch initial band status:", dataErr);
            }

            cleanup = await startHeartRateMonitoring(device, (bpm) => {
              if (isMounted) {
                setBandData(prev => prev ? { ...prev, currentHeartRate: bpm } : null);
              }
            });
          } catch (err) {
            console.error("Failed to start HR monitoring:", err);
          }
        }
      } else {
        if (isMounted) {
          setBandData(prev => prev ? { ...prev, isConnected: false } : null);
        }
      }
    };

    setupDevice();

    return () => {
      isMounted = false;
      if (cleanup) cleanup();
    };
  }, [authorizedDevices, bands]);

  // Fetch the data from the band manually
  const fetchBandData = async () => {
    if (authorizedDevices.length === 0) return;
    setLoading(true);
    try {
      const rawDevice = authorizedDevices[0];
      const matchedBand = bands.find(b => b.deviceId === rawDevice.id);

      if (matchedBand) {
        const device = new BluetoothDeviceWrapper(rawDevice);

        if (!rawDevice.gatt?.connected) {
          const key = await authKeyStringToKey(matchedBand.authKey);
          await authenticate(device, key);
        }

        const status = await getCurrentStatus(device);
        const batteryInfo = await getBatteryLevel(device);

        setBandData(prev => prev ? {
          ...prev,
          steps: status.steps,
          distance: Number((status.meters / 1000).toFixed(2)),
          calories: status.calories,
          battery: batteryInfo.batteryLevel,
          lastSync: new Date().toISOString()
        } : null);
      }
    } catch (err) {
      console.error("Failed to manual sync band data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!bandData) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-secondary">
        Failed to load band data.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 flex-1 max-w-[1600px] mx-auto w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xl text-text-secondary font-medium leading-tight">Fitness Band Data</span>
            <h1 className="text-4xl font-bold text-dark-primary tracking-tight">Real-Time Tracker</h1>
          </div>
          <div className="w-12 h-12 rounded-full bg-lime-primary flex items-center justify-center text-dark-primary ml-4">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={fetchBandData}
            disabled={loading || !bandData.isConnected}
            className="flex items-center gap-2 bg-gradient-to-r from-lime-primary to-[#c2e63b] hover:from-[#c2e63b] hover:to-[#b0d52a] text-dark-primary rounded-full py-3 px-6 shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-bold">Sync Data</span>
          </button>
        </div>
      </div>

      {/* HIGHLIGHTED METRICS AT THE TOP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[24px] p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-lime-primary/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-lime-primary/20 transition-all"></div>
          <div className="flex items-center justify-between relative z-10 mb-4">
            <div className="w-12 h-12 rounded-full bg-lime-primary/20 flex items-center justify-center">
              <Footprints className="w-6 h-6 text-lime-primary" />
            </div>
            <span className="bg-lime-primary/10 text-lime-primary text-xs font-bold px-3 py-1 rounded-full border border-lime-primary/20">
              Today
            </span>
          </div>
          <h3 className="text-5xl font-black text-white tracking-tight relative z-10 mb-1">
            {bandData.steps.toLocaleString()}
          </h3>
          <p className="text-gray-400 font-medium relative z-10">Total Steps</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-[24px] p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-400/20 transition-all"></div>
          <div className="flex items-center justify-between relative z-10 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-400/20 flex items-center justify-center">
              <Route className="w-6 h-6 text-blue-400" />
            </div>
            <span className="bg-blue-400/10 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-400/20">
              Kilometers
            </span>
          </div>
          <h3 className="text-5xl font-black text-white tracking-tight relative z-10 mb-1">
            {bandData.distance} <span className="text-2xl text-blue-200">km</span>
          </h3>
          <p className="text-gray-300 font-medium relative z-10">Distance Covered</p>
        </div>

        <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-[24px] p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-400/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-red-400/20 transition-all"></div>
          <div className="flex items-center justify-between relative z-10 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-400/20 flex items-center justify-center animate-pulse">
              <HeartPulse className="w-6 h-6 text-red-400" />
            </div>
            <span className="bg-red-400/10 text-red-400 text-xs font-bold px-3 py-1 rounded-full border border-red-400/20">
              Live Monitor
            </span>
          </div>
          <h3 className="text-5xl font-black text-white tracking-tight relative z-10 mb-1 flex items-baseline gap-2">
            {bandData.currentHeartRate} <span className="text-xl text-red-200">BPM</span>
          </h3>
          <p className="text-gray-300 font-medium relative z-10">Current Heart Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 mt-2">
        {/* Left Column */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <ConnectDeviceCard />
        </div>

        {/* Center Column */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <AnalyticsChart hourlySteps={bandData.hourlySteps} totalSteps={bandData.steps} />
          <WellnessCard steps={bandData.steps} distance={bandData.distance} calories={bandData.calories} />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <WorkoutCard spo2={bandData.spo2} heartRate={bandData.currentHeartRate} />
          <ProgressCard steps={bandData.steps} goal={bandData.goal} />
        </div>
      </div>
    </div>
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
