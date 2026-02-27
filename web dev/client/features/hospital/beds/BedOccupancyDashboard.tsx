import React, { useState } from "react";
import { useHospitalStore, BedPatientInfo } from "../../../stores/useHospitalStore";
import {
    BedDouble, Activity, UserPlus, X, Check,
    Calendar, DollarSign, History as HistoryIcon, User,
    Stethoscope, FileText, HeartPulse, Thermometer, Droplets
} from "lucide-react";

export default function BedOccupancyDashboard() {
    const {
        beds,
        bedPatients,
        updateBedOccupancy,
        initializeHospitalLocation,
        hospitalLocation
    } = useHospitalStore();
    const [selectedWard, setSelectedWard] = useState<string>('icu');
    const [viewingPatient, setViewingPatient] = useState<BedPatientInfo | null>(null);

    // Ensure hospital location and patients are initialized if landing directly here
    React.useEffect(() => {
        if (!hospitalLocation) {
            // Default center if no geolocation
            initializeHospitalLocation(28.6139, 77.2090);
        }
    }, [hospitalLocation, initializeHospitalLocation]);

    const wardData = beds[selectedWard as keyof typeof beds];
    const percentage = Math.round((wardData.occupied / wardData.total) * 100);

    // Get beds for the current ward
    const wardBeds = Array.from({ length: wardData.total }, (_, i) => {
        const id = `${selectedWard.toUpperCase().slice(0, 3)}-${String(i + 1).padStart(2, '0')}`;
        const patient = bedPatients.find(p => p.id === id);
        return {
            id,
            patient: patient ? patient.name : null,
            patientData: patient,
            status: patient ? 'occupied' : (i === wardData.total - 1 && wardData.occupied >= wardData.total - 2 ? 'maintenance' : 'available')
        };
    });

    const handleRelease = (bedId: string) => {
        updateBedOccupancy(selectedWard, Math.max(wardData.occupied - 1, 0));
        setViewingPatient(null);
    };

    return (
        <div className="flex h-full bg-[#F3F4F6] overflow-hidden relative">
            {/* Main Content Area */}
            <div className={`flex-1 p-6 lg:p-8 overflow-y-auto transition-all duration-500 ${viewingPatient ? 'pr-[400px]' : ''}`}>
                {/* Header */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-2xl mb-4 shadow-sm border border-emerald-200">
                        <BedDouble className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Bed Management</h1>
                    <p className="text-slate-500 text-lg font-medium italic">Indian Ward Command Center — Real-time Bed Status & AB Verification</p>
                </div>

                {/* Ward Tabs */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {Object.entries(beds).map(([key, data]) => {
                        const pct = Math.round((data.occupied / data.total) * 100);
                        const isActive = key === selectedWard;
                        return (
                            <button
                                key={key}
                                onClick={() => setSelectedWard(key)}
                                className={`px-5 py-3 rounded-xl text-sm font-bold capitalize transition-all border-2 ${isActive
                                    ? 'bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 shadow-sm'
                                    }`}
                            >
                                {key} <span className={`ml-2 text-xs font-black ${isActive ? 'text-emerald-100' : pct > 85 ? 'text-red-500' : 'text-slate-400'}`}>{pct}%</span>
                            </button>
                        );
                    })}
                </div>

                {/* Ward Stats Bar */}
                <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-lg shadow-slate-200/50 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 capitalize">{selectedWard} Ward</h2>
                            <p className="text-sm text-slate-500 font-bold">{wardData.occupied} / {wardData.total} beds occupied</p>
                        </div>
                        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-400"></span> Available</span>
                            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-blue-500"></span> Occupied</span>
                            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-slate-200"></span> Maintenance</span>
                        </div>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner flex">
                        <div
                            className={`h-full rounded-full transition-all duration-700 ${percentage > 85 ? 'bg-red-500' : percentage > 70 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>

                {/* Bed Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 pb-20">
                    {wardBeds.map(bed => (
                        <div
                            key={bed.id}
                            className={`relative p-3 rounded-xl border-2 text-center cursor-pointer transition-all group hover:scale-105 ${viewingPatient?.id === bed.id ? 'bg-blue-600 border-blue-700 text-white shadow-xl scale-110 z-10' :
                                bed.status === 'occupied' ? 'bg-blue-50 border-blue-200 hover:border-blue-400' :
                                    bed.status === 'maintenance' ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-60' :
                                        'bg-white border-slate-100 hover:border-emerald-300'
                                }`}
                            onClick={() => {
                                if (bed.status === 'maintenance') return;
                                if (bed.status === 'occupied') setViewingPatient(bed.patientData || null);
                            }}
                        >
                            <BedDouble className={`w-5 h-5 mx-auto mb-1 ${viewingPatient?.id === bed.id ? 'text-white' :
                                bed.status === 'occupied' ? 'text-blue-500' :
                                    bed.status === 'maintenance' ? 'text-slate-300' : 'text-slate-200'
                                }`} />
                            <p className={`text-[10px] font-black ${viewingPatient?.id === bed.id ? 'text-blue-100' : 'text-slate-900'}`}>{bed.id}</p>
                            {bed.patient && (
                                <p className={`text-[9px] font-bold mt-1 truncate ${viewingPatient?.id === bed.id ? 'text-white' : 'text-blue-600'}`}>{bed.patient}</p>
                            )}
                            {bed.status === 'occupied' && viewingPatient?.id !== bed.id && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Activity className="w-2.5 h-2.5 text-white" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side Toggle Bar (Patient Side Panel) */}
            <aside className={`fixed right-0 top-0 h-full w-[400px] bg-white border-l border-slate-200 shadow-[-20px_0_50px_rgba(0,0,0,0.05)] transition-transform duration-500 ease-out z-[100] flex flex-col ${viewingPatient ? 'translate-x-0' : 'translate-x-full'
                }`}>
                {viewingPatient && (
                    <>
                        {/* Panel Header */}
                        <div className="p-8 bg-slate-900 text-white relative">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">{viewingPatient.id}</span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${viewingPatient.status === 'Critical' ? 'bg-red-500' : 'bg-blue-500'
                                    }`}>
                                    <Activity size={10} /> {viewingPatient.status}
                                </span>
                            </div>
                            <h3 className="text-3xl font-black mb-1">{viewingPatient.name}</h3>
                            <div className="flex items-center gap-3 text-slate-400 font-bold text-xs">
                                <span>{viewingPatient.patientId}</span>
                                <span>•</span>
                                <span>{viewingPatient.age} Y/O</span>
                                <span>•</span>
                                <span>{viewingPatient.gender}</span>
                            </div>
                            <button onClick={() => setViewingPatient(null)} className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-xl transition-colors">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        {/* Panel Body */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 pb-32">
                            {/* Ayushman Bharat Toggle Card */}
                            <div className={`p-5 rounded-3xl border-2 transition-all ${viewingPatient.isAyushmanBharat ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-100'
                                }`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${viewingPatient.isAyushmanBharat ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Health Scheme</p>
                                            <p className="text-sm font-black text-slate-900">Ayushman Bharat</p>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${viewingPatient.isAyushmanBharat ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-slate-200 text-slate-500'
                                        }`}>
                                        {viewingPatient.isAyushmanBharat ? 'YES' : 'NO'}
                                    </div>
                                </div>
                            </div>

                            {/* Billing Overview */}
                            <div>
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Billing & Hospitalization</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Total Due</p>
                                        <p className="text-lg font-black text-slate-900">₹ {viewingPatient.totalBill.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Adm. Date</p>
                                        <p className="text-sm font-black text-slate-900">{viewingPatient.admittedDate}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Vital Indicators */}
                            <div>
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Real-time Vitals</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <VitalBox icon={<HeartPulse size={16} className="text-rose-500" />} label="Heart" value={`${viewingPatient.history.vitals.heartRate} bpm`} />
                                    <VitalBox icon={<Activity size={16} className="text-blue-500" />} label="BP" value={viewingPatient.history.vitals.bp} />
                                    <VitalBox icon={<Thermometer size={16} className="text-orange-500" />} label="Temp" value={`${viewingPatient.history.vitals.temp}°F`} />
                                    <VitalBox icon={<Droplets size={16} className="text-cyan-500" />} label="SpO2" value={`${viewingPatient.history.vitals.spO2}%`} />
                                </div>
                            </div>

                            {/* Info Sections */}
                            <section>
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 leading-none">Medical Intelligence</h4>
                                <div className="space-y-4">
                                    <HistoryItem label="Blood Type" items={[viewingPatient.bloodGroup]} />
                                    <HistoryItem label="Allergies" items={viewingPatient.history.allergies} />
                                    <HistoryItem label="Chronic Issues" items={viewingPatient.history.chronic} />
                                </div>
                            </section>
                        </div>

                        {/* Quick Actions Footer */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex gap-3">
                            <button className="flex-1 px-6 py-4 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                                REPORT
                            </button>
                            <button
                                onClick={() => handleRelease(viewingPatient.id)}
                                className="flex-[2] px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/30 transition-all active:scale-95"
                            >
                                DISCHARGE
                            </button>
                        </div>
                    </>
                )}
            </aside>
        </div>
    );
}

// Subcomponents

function VitalBox({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-blue-200 transition-colors">
            <div className="p-2.5 bg-slate-50 rounded-2xl">{icon}</div>
            <div>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className="text-xs font-black text-slate-900">{value}</p>
            </div>
        </div>
    );
}

function HistoryItem({ label, items }: { label: string, items: string[] }) {
    return (
        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-2 leading-none">{label}</p>
            <div className="flex flex-wrap gap-2">
                {items.map((item, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white text-slate-600 rounded-lg text-[10px] font-black uppercase border border-slate-200">
                        {item}
                    </span>
                ))}
                {items.length === 0 && <span className="text-[10px] text-slate-400 font-bold italic uppercase">N/A</span>}
            </div>
        </div>
    );
}
