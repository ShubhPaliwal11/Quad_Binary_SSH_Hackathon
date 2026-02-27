import React, { useEffect, useRef } from "react";
import {
    Activity, BedDouble, Users, Stethoscope, AlertTriangle,
    TrendingUp, TrendingDown, Clock, Phone, MapPin,
    ChevronRight, Siren, HeartPulse, Thermometer, Droplets
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useHospitalStore } from "../../../stores/useHospitalStore";
import { Link } from "react-router-dom";

// Raw Leaflet mini-map for the dashboard
function DashboardMap({ hospitalLocation, ambulances }: { hospitalLocation: [number, number]; ambulances: any[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markersRef = useRef<Map<string, L.Marker>>(new Map());
    const polylinesRef = useRef<Map<string, L.Polyline>>(new Map());

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;
        const map = L.map(containerRef.current, {
            center: [hospitalLocation[1], hospitalLocation[0]],
            zoom: 11.5,
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            scrollWheelZoom: false,
            touchZoom: false,
            doubleClickZoom: false,
        });
        L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png").addTo(map);
        // Hospital marker
        const hIcon = L.divIcon({
            className: "",
            html: `<div style="width:36px;height:36px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid #e11d48;box-shadow:0 2px 12px rgba(225,29,72,0.3);overflow:hidden;"><img src="/hospitalicon/Health_(208).jpg" style="width:100%;height:100%;object-fit:cover;" /></div>`,
            iconSize: [36, 36], iconAnchor: [18, 18],
        });
        L.marker([hospitalLocation[1], hospitalLocation[0]], { icon: hIcon }).addTo(map);
        mapRef.current = map;
        return () => { map.remove(); mapRef.current = null; };
    }, []);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;
        const currentIds = new Set(ambulances.filter(a => a.status !== 'Completed').map(a => a.id));
        // Remove stale
        markersRef.current.forEach((m, id) => { if (!currentIds.has(id)) { map.removeLayer(m); markersRef.current.delete(id); } });
        polylinesRef.current.forEach((p, id) => { if (!currentIds.has(id)) { map.removeLayer(p); polylinesRef.current.delete(id); } });

        ambulances.filter(a => a.status !== 'Completed').forEach(amb => {
            const latLng: L.LatLngExpression = [amb.location[1], amb.location[0]];
            const icon = L.divIcon({
                className: "",
                html: `<div style="width:24px;height:24px;background:#fff;border-radius:50%;border:2px solid #e11d48;box-shadow:0 2px 8px rgba(225,29,72,0.3);overflow:hidden;display:flex;align-items:center;justify-content:center;"><img src="/red-cartoon-style-ambulance-white-stripe-star-life-emblem-features-red-cartoon-style-ambulance-white-stripe-390002025.jpg" style="width:100%;height:100%;object-fit:cover;" /></div>`,
                iconSize: [24, 24], iconAnchor: [12, 12],
            });
            if (markersRef.current.has(amb.id)) {
                markersRef.current.get(amb.id)!.setLatLng(latLng).setIcon(icon);
            } else {
                markersRef.current.set(amb.id, L.marker(latLng, { icon }).addTo(map));
            }
            // Route polylines
            if (amb.routeCoordinates?.length >= 2) {
                const coords = amb.routeCoordinates.slice(amb.routeIndex).map((c: [number, number]) => [c[1], c[0]] as L.LatLngExpression);
                if (coords.length >= 2) {
                    if (polylinesRef.current.has(amb.id)) {
                        polylinesRef.current.get(amb.id)!.setLatLngs(coords);
                    } else {
                        polylinesRef.current.set(amb.id, L.polyline(coords, { color: "#F26B7A", weight: 3, opacity: 0.5 }).addTo(map));
                    }
                }
            }
        });
    }, [ambulances]);

    return <div ref={containerRef} style={{ height: "100%", width: "100%", zIndex: 0 }} />;
}

export default function HospitalDashboard() {
    const {
        ambulances,
        hospitalLocation,
        initializeHospitalLocation,
        updateAmbulanceLocations,
        beds,
        crisisLevel
    } = useHospitalStore();

    useEffect(() => {
        if (!hospitalLocation) {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => initializeHospitalLocation(pos.coords.latitude, pos.coords.longitude),
                    () => initializeHospitalLocation(28.6139, 77.2090)
                );
            } else {
                initializeHospitalLocation(28.6139, 77.2090);
            }
        }
    }, [hospitalLocation, initializeHospitalLocation]);

    useEffect(() => {
        const interval = setInterval(updateAmbulanceLocations, 2500);
        return () => clearInterval(interval);
    }, [updateAmbulanceLocations]);

    const activeAmbulances = ambulances.filter(a => a.status !== 'Completed').length;
    const totalBeds = Object.values(beds).reduce((s, b) => s + b.total, 0);
    const occupiedBeds = Object.values(beds).reduce((s, b) => s + b.occupied, 0);
    const bedOccupancy = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;



    const RECENT_ACTIVITY = [
        { time: "2 min ago", text: "Ambulance MH-12-AB-1234 dispatched for cardiac emergency", type: "critical" },
        { time: "8 min ago", text: "Patient Kavita Iyer admitted to ICU Ward", type: "info" },
        { time: "15 min ago", text: "Bed 4B-12 freed — Ward 4B now at 78% capacity", type: "success" },
        { time: "22 min ago", text: "Dr. Ananya Mehta assigned to trauma case PT-10025", type: "info" },
        { time: "35 min ago", text: "Crisis level downgraded from Elevated to Normal", type: "success" },
        { time: "1 hr ago", text: "Shift handover completed — Night team on duty", type: "info" },
    ];

    return (
        <div className="p-6 lg:p-8 h-full overflow-y-auto bg-[#F3F4F6] animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Command Center</h1>
                    <p className="text-slate-500 mt-1">Real-time hospital operations overview</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border shadow-sm ${crisisLevel === 'Critical' ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' :
                        crisisLevel === 'Elevated' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                            'bg-emerald-50 text-emerald-600 border-emerald-200'
                        }`}>
                        <span className={`w-2 h-2 rounded-full ${crisisLevel === 'Critical' ? 'bg-red-500' :
                            crisisLevel === 'Elevated' ? 'bg-yellow-500' : 'bg-emerald-500'
                            }`}></span>
                        {crisisLevel}
                    </div>
                    <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                <KPICard
                    icon={<Siren className="w-6 h-6" />}
                    iconBg="bg-rose-50 border-rose-100"
                    iconColor="text-rose-600"
                    label="Active Ambulances"
                    value={activeAmbulances.toString()}
                    subtext={`${ambulances.length} total fleet`}
                    change="+2 dispatched"
                    changeType="neutral"
                />
                <KPICard
                    icon={<BedDouble className="w-6 h-6" />}
                    iconBg="bg-blue-50 border-blue-100"
                    iconColor="text-blue-600"
                    label="Bed Occupancy"
                    value={`${bedOccupancy}%`}
                    subtext={`${occupiedBeds} / ${totalBeds} beds`}
                    change={bedOccupancy > 85 ? "Critical" : bedOccupancy > 70 ? "High" : "Normal"}
                    changeType={bedOccupancy > 85 ? "negative" : bedOccupancy > 70 ? "warning" : "positive"}
                />
                <KPICard
                    icon={<Users className="w-6 h-6" />}
                    iconBg="bg-purple-50 border-purple-100"
                    iconColor="text-purple-600"
                    label="Patients Today"
                    value="47"
                    subtext="12 new admissions"
                    change="+8.2%"
                    changeType="positive"
                />
                <KPICard
                    icon={<Stethoscope className="w-6 h-6" />}
                    iconBg="bg-teal-50 border-teal-100"
                    iconColor="text-teal-600"
                    label="Staff On Duty"
                    value="34"
                    subtext="8 doctors, 26 nurses"
                    change="Full shift"
                    changeType="positive"
                />
            </div>

            {/* Main Content Row */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-8">
                {/* Live Map Preview */}
                <div className="xl:col-span-3 bg-white rounded-[1.5rem] border border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Live Fleet Tracking</h2>
                            <p className="text-xs text-slate-400 mt-0.5">{activeAmbulances} ambulances active on OSRM routes</p>
                        </div>
                        <Link
                            to="/hospital/ambulance"
                            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                        >
                            Open Full Map <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <div className="h-[380px] relative isolate z-0">
                        {hospitalLocation ? (
                            <DashboardMap hospitalLocation={hospitalLocation} ambulances={ambulances} />
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 font-bold">Loading map...</div>
                        )}
                    </div>
                </div>

                {/* Ward Status Sidebar */}
                <div className="xl:col-span-2 bg-white rounded-[1.5rem] border border-slate-200 shadow-lg shadow-slate-200/50 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-slate-900">Ward Status</h2>
                        <Link to="/hospital/beds" className="text-xs font-bold text-blue-600 hover:underline">View All</Link>
                    </div>
                    <div className="flex-1 space-y-4 overflow-y-auto">
                        {Object.entries(beds).map(([key, data]) => {
                            const pct = Math.round((data.occupied / data.total) * 100);
                            const isCrit = pct >= 85;
                            return (
                                <div key={key} className={`p-4 rounded-xl border ${isCrit ? 'border-red-200 bg-red-50/50' : 'border-slate-100 bg-slate-50/50'} transition-all`}>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-bold text-slate-800 capitalize">{key} Ward</span>
                                        <span className={`text-xs font-black px-2 py-0.5 rounded-full ${isCrit ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                            {pct}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${isCrit ? 'bg-red-500' : pct > 70 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-semibold mt-2">{data.occupied} / {data.total} beds occupied</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                {/* Active Ambulances List */}
                <div className="xl:col-span-2 bg-white rounded-[1.5rem] border border-slate-200 shadow-lg shadow-slate-200/50 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-slate-900">Active Dispatch</h2>
                        <Link to="/hospital/ambulance" className="text-xs font-bold text-blue-600 hover:underline">Track All</Link>
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        {ambulances.filter(a => a.status !== 'Completed').map(amb => (
                            <div key={amb.id} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all cursor-pointer group">
                                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100 shrink-0 overflow-hidden">
                                    <img
                                        src="/red-cartoon-style-ambulance-white-stripe-star-life-emblem-features-red-cartoon-style-ambulance-white-stripe-390002025.jpg"
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate">{amb.id}</p>
                                    <p className="text-[10px] text-slate-400 font-medium truncate">{amb.patientName} — {amb.patientCondition}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${amb.status === 'En Route' ? 'bg-blue-50 text-blue-600' :
                                        amb.status === 'To Hospital' ? 'bg-green-50 text-green-600' :
                                            'bg-orange-50 text-orange-600'
                                        }`}>{amb.status}</span>
                                    <p className="text-[10px] text-slate-400 font-semibold mt-1">ETA {Math.max(1, Math.round(amb.eta))}m</p>
                                </div>
                            </div>
                        ))}
                        {ambulances.filter(a => a.status !== 'Completed').length === 0 && (
                            <p className="text-sm text-slate-400 text-center py-8">No active dispatches</p>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="xl:col-span-3 bg-white rounded-[1.5rem] border border-slate-200 shadow-lg shadow-slate-200/50 p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-5">Recent Activity</h2>
                    <div className="space-y-5 max-h-[300px] overflow-y-auto pr-1">
                        {RECENT_ACTIVITY.map((item, i) => (
                            <div key={i} className="flex gap-4 items-start">
                                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${item.type === 'critical' ? 'bg-red-500' :
                                    item.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                                    }`} />
                                <div className="flex-1">
                                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{item.text}</p>
                                    <p className="text-[10px] text-slate-400 font-semibold mt-1 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {item.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-components

function KPICard({ icon, iconBg, iconColor, label, value, subtext, change, changeType }: {
    icon: React.ReactNode, iconBg: string, iconColor: string,
    label: string, value: string, subtext: string,
    change: string, changeType: 'positive' | 'negative' | 'warning' | 'neutral'
}) {
    return (
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-lg shadow-slate-200/50 hover:-translate-y-0.5 transition-transform">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl border ${iconBg} ${iconColor} shadow-sm`}>
                    {icon}
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 ${changeType === 'positive' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    changeType === 'negative' ? 'bg-red-50 text-red-600 border border-red-100' :
                        changeType === 'warning' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                            'bg-slate-50 text-slate-500 border border-slate-100'
                    }`}>
                    {changeType === 'positive' && <TrendingUp className="w-3 h-3" />}
                    {changeType === 'negative' && <TrendingDown className="w-3 h-3" />}
                    {changeType === 'warning' && <AlertTriangle className="w-3 h-3" />}
                    {change}
                </span>
            </div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{label}</p>
            <p className="text-3xl font-black text-slate-900 mb-1">{value}</p>
            <p className="text-xs text-slate-500 font-medium">{subtext}</p>
        </div>
    );
}
