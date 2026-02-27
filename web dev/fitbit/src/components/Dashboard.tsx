import { Calendar, Clock, ArrowRight, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { WellnessCard } from "./WellnessCard";
import { ExposureCard } from "./ExposureCard";
import { ConnectDeviceCard } from "./ConnectDeviceCard";
import { AnalyticsChart } from "./AnalyticsChart";
import { BreathCard } from "./BreathCard";
import { ProgressCard } from "./ProgressCard";
import { CheckboxCard } from "./CheckboxCard";
import { WorkoutCard } from "./WorkoutCard";
import { BandData } from "../types";

export function Dashboard() {
  const [bandData, setBandData] = useState<BandData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/band-data")
      .then((res) => res.json())
      .then((data) => {
        setBandData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch band data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-lime-primary" />
      </div>
    );
  }

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
            <span className="text-xl text-text-secondary font-medium leading-tight">Health Records</span>
            <h1 className="text-4xl font-bold text-dark-primary tracking-tight">Dashboard</h1>
          </div>
          <div className="w-12 h-12 rounded-full bg-lime-primary flex items-center justify-center text-dark-primary ml-4">
            <AsteriskIcon className="w-6 h-6" />
          </div>
          <div className="w-8 h-8 rounded-full bg-dark-primary flex items-center justify-center text-white">
            <ArrowRight className="w-4 h-4 rotate-45" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white rounded-full py-3 px-5 shadow-sm shadow-black/[0.02]">
            <Calendar className="w-4 h-4 text-text-secondary" />
            <span className="text-sm font-medium text-dark-primary">Sep 02 - Sep 09</span>
          </div>
          <div className="flex items-center bg-white rounded-full p-1 shadow-sm shadow-black/[0.02]">
            <div className="flex items-center gap-2 py-2 px-4 rounded-full text-text-secondary">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">24h</span>
            </div>
            <div className="flex items-center gap-2 py-2 px-6 rounded-full bg-dark-primary text-white">
              <span className="text-sm font-medium">Weekly</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left Column */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <ConnectDeviceCard />
          <WellnessCard steps={bandData.steps} distance={bandData.distance} calories={bandData.calories} />
          <ExposureCard />
        </div>

        {/* Center Column */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <AnalyticsChart hourlySteps={bandData.hourlySteps} totalSteps={bandData.steps} />
          <BreathCard />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <ProgressCard steps={bandData.steps} goal={bandData.goal} />
          <CheckboxCard />
          <WorkoutCard spo2={bandData.spo2} heartRate={bandData.currentHeartRate} />
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
