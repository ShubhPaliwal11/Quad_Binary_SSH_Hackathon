export interface HourlyStep {
  time: string;
  steps: number;
}

export interface BandData {
  steps: number;
  distance: number;
  calories: number;
  goal: number;
  spo2: number;
  currentHeartRate: number;
  battery: number;
  isConnected: boolean;
  hourlySteps: HourlyStep[];
  lastSync: string;
}
