import { useHospitalStore } from "../../../stores/useHospitalStore";
import { AlertTriangle, Shield, CheckCircle, Radio, Clock } from "lucide-react";

export default function EmergencyCrisisManager() {
    const { crisisLevel, triggerCrisis } = useHospitalStore();

    const isCrisis = crisisLevel !== 'Normal';

    return (
        <div className="p-8 pb-32 h-full overflow-y-auto bg-slate-50 z-10 relative animate-in fade-in max-w-7xl mx-auto">
            <header className="mb-10 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-2xl mb-4 shadow-sm border border-red-200">
                    <Shield className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Crisis Manager</h1>
                <p className="text-slate-500 text-lg">Broadcast alerts and manage mass casualty protocols</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Control Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <div className={`p-8 rounded-[2rem] border transition-all duration-300 ${isCrisis ? 'bg-red-50 border-red-200 shadow-xl shadow-red-500/10' : 'bg-white border-slate-100 shadow-lg shadow-slate-200/50'}`}>
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-1">Command Level</h2>
                                <p className={`font-semibold ${isCrisis ? 'text-red-600' : 'text-emerald-600'}`}>Status: {crisisLevel}</p>
                            </div>
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-4 ${isCrisis ? 'border-red-200 bg-red-100 shadow-inner' : 'border-emerald-200 bg-emerald-100'}`}>
                                {isCrisis ? <AlertTriangle className="w-8 h-8 text-red-600 animate-pulse" /> : <CheckCircle className="w-8 h-8 text-emerald-600" />}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <button onClick={() => triggerCrisis('Normal')} className={`p-4 rounded-2xl border-2 font-black tracking-widest text-[10px] uppercase transition-all shadow-sm ${crisisLevel === 'Normal' ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-300'}`}>Normal</button>
                            <button onClick={() => triggerCrisis('Elevated')} className={`p-4 rounded-2xl border-2 font-black tracking-widest text-[10px] uppercase transition-all shadow-sm ${crisisLevel === 'Elevated' ? 'bg-yellow-500 border-yellow-600 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-yellow-300'}`}>Elevated</button>
                            <button onClick={() => triggerCrisis('Critical')} className={`p-4 rounded-2xl border-2 font-black tracking-widest text-[10px] uppercase transition-all shadow-sm ${crisisLevel === 'Critical' ? 'bg-red-600 border-red-700 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-red-300'}`}>Critical</button>
                        </div>
                    </div>

                    {/* Broadcast System */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/50">
                        <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <Radio className="w-5 h-5 text-blue-600" />
                            Mass Broadcast
                        </h2>
                        <p className="text-slate-500 text-sm mb-6">Send urgent alerts to all active ambulances, nurses, and doctors.</p>

                        <textarea
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 mb-6 h-32 resize-none transition-shadow"
                            placeholder="Enter emergency broadcast message here..."
                        ></textarea>

                        <button className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase text-sm tracking-widest px-8 py-4 rounded-xl transition-colors shadow-lg shadow-red-500/30 w-full md:w-auto">
                            Initiate Protocol
                        </button>
                    </div>
                </div>

                {/* Activity Log */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col h-[550px]">
                    <h2 className="text-lg font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">Activity Log</h2>
                    <div className="flex-1 overflow-y-auto space-y-8 pr-2">
                        <div className="relative pl-6 border-l-2 border-slate-100">
                            <div className="absolute w-4 h-4 bg-red-100 border-2 border-red-500 rounded-full -left-[9px] top-0"></div>
                            <p className="text-[10px] text-slate-400 font-mono font-bold mb-1 flex items-center gap-2"><Clock className="w-3 h-3" /> 14:32:11 IST</p>
                            <p className="text-sm font-medium text-slate-700 leading-relaxed">System triggered auto-escalation due to ICU bed shortage.</p>
                        </div>
                        <div className="relative pl-6 border-l-2 border-slate-100">
                            <div className="absolute w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded-full -left-[9px] top-0"></div>
                            <p className="text-[10px] text-slate-400 font-mono font-bold mb-1 flex items-center gap-2"><Clock className="w-3 h-3" /> 13:15:00 IST</p>
                            <p className="text-sm font-medium text-slate-700 leading-relaxed">Ambulance assigned to critical stroke patient: Abdul Rahman.</p>
                        </div>
                        <div className="relative pl-6 border-l-2 border-slate-100">
                            <div className="absolute w-4 h-4 bg-emerald-100 border-2 border-emerald-500 rounded-full -left-[9px] top-0"></div>
                            <p className="text-[10px] text-slate-400 font-mono font-bold mb-1 flex items-center gap-2"><Clock className="w-3 h-3" /> 12:00:00 IST</p>
                            <p className="text-sm font-medium text-slate-700 leading-relaxed">Shift handover and equipment auth sequence complete.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
