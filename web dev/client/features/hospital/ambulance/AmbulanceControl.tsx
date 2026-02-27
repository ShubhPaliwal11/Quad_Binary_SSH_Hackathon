import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
    MapIcon, Search, Phone,
    FileCheck, PhoneCall, ArrowLeft, Siren, X
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useHospitalStore } from "../../../stores/useHospitalStore";
import { generatePatientDossierPDF } from "../../../lib/pdfGenerator";

// ── Raw Leaflet Map Component ──────────────────────────────────────
function LiveMap({
    hospitalLocation,
    ambulances,
    selectedAmbulanceId,
    onSelectAmbulance,
}: {
    hospitalLocation: [number, number];
    ambulances: any[];
    selectedAmbulanceId: string | null;
    onSelectAmbulance: (id: string) => void;
}) {
    const mapRef = useRef<L.Map | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<Map<string, L.Marker>>(new Map());
    const polylinesRef = useRef<Map<string, L.Polyline>>(new Map());
    const hospitalMarkerRef = useRef<L.Marker | null>(null);

    // Initialize map once
    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        const map = L.map(containerRef.current, {
            center: [hospitalLocation[1], hospitalLocation[0]],
            zoom: 12,
            zoomControl: true,
            attributionControl: false,
        });

        L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
            attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        }).addTo(map);

        mapRef.current = map;

        // Hospital marker
        const hIcon = L.divIcon({
            className: "",
            html: `<div style="width:56px;height:56px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;border:4px solid #F26B7A;box-shadow:0 4px 20px rgba(242,107,122,0.35);overflow:hidden;cursor:pointer;">
                <img src="/hospitalicon/Health_(208).jpg" alt="Hospital" style="width:100%;height:100%;object-fit:cover;" />
            </div>`,
            iconSize: [56, 56],
            iconAnchor: [28, 28],
        });
        hospitalMarkerRef.current = L.marker([hospitalLocation[1], hospitalLocation[0]], { icon: hIcon }).addTo(map);

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []); // Run only once

    // Update markers and polylines reactively
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        // --- Update hospital marker position ---
        if (hospitalMarkerRef.current) {
            hospitalMarkerRef.current.setLatLng([hospitalLocation[1], hospitalLocation[0]]);
        }

        // --- Sync ambulance markers ---
        const currentIds = new Set(ambulances.map(a => a.id));

        // Remove stale markers
        markersRef.current.forEach((marker, id) => {
            if (!currentIds.has(id)) {
                map.removeLayer(marker);
                markersRef.current.delete(id);
            }
        });
        // Remove stale polylines
        polylinesRef.current.forEach((pl, id) => {
            if (!currentIds.has(id)) {
                map.removeLayer(pl);
                polylinesRef.current.delete(id);
            }
        });

        ambulances.forEach(amb => {
            const isSelected = amb.id === selectedAmbulanceId;
            const latLng: L.LatLngExpression = [amb.location[1], amb.location[0]];

            // --- Marker ---
            const icon = L.divIcon({
                className: "",
                html: `<div style="width:48px;height:48px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;border:4px solid ${isSelected ? '#F26B7A' : '#94a3b8'};box-shadow:0 4px 16px ${isSelected ? 'rgba(242,107,122,0.4)' : 'rgba(0,0,0,0.12)'};overflow:hidden;cursor:pointer;transform:scale(${isSelected ? 1.2 : 1});transition:transform 0.3s;">
                    <img src="/red-cartoon-style-ambulance-white-stripe-star-life-emblem-features-red-cartoon-style-ambulance-white-stripe-390002025.jpg" alt="Ambulance" style="width:100%;height:100%;object-fit:cover;" />
                </div>`,
                iconSize: [48, 48],
                iconAnchor: [24, 24],
            });

            if (markersRef.current.has(amb.id)) {
                const existing = markersRef.current.get(amb.id)!;
                existing.setLatLng(latLng);
                existing.setIcon(icon);
                existing.setZIndexOffset(isSelected ? 1000 : 0);
            } else {
                const marker = L.marker(latLng, { icon, zIndexOffset: isSelected ? 1000 : 0 })
                    .addTo(map)
                    .on("click", () => onSelectAmbulance(amb.id));
                markersRef.current.set(amb.id, marker);
            }

            // --- Route polyline ---
            if (amb.routeCoordinates?.length >= 2 && amb.status !== "Completed") {
                const coords: L.LatLngExpression[] = amb.routeCoordinates
                    .slice(amb.routeIndex)
                    .map((c: [number, number]) => [c[1], c[0]] as L.LatLngExpression);

                if (coords.length >= 2) {
                    if (polylinesRef.current.has(amb.id)) {
                        const existing = polylinesRef.current.get(amb.id)!;
                        existing.setLatLngs(coords);
                        existing.setStyle({
                            color: isSelected ? "#F26B7A" : "#94a3b8",
                            weight: isSelected ? 6 : 3,
                            opacity: 0.8,
                        });
                    } else {
                        const pl = L.polyline(coords, {
                            color: isSelected ? "#F26B7A" : "#94a3b8",
                            weight: isSelected ? 6 : 3,
                            opacity: 0.8,
                            lineCap: "round",
                            lineJoin: "round",
                        }).addTo(map);
                        polylinesRef.current.set(amb.id, pl);
                    }
                }
            } else {
                // Remove polyline if route completed or not available
                if (polylinesRef.current.has(amb.id)) {
                    map.removeLayer(polylinesRef.current.get(amb.id)!);
                    polylinesRef.current.delete(amb.id);
                }
            }
        });

        // Fit map to show ALL ambulances + hospital
        const allPoints: L.LatLngExpression[] = [
            [hospitalLocation[1], hospitalLocation[0]],
            ...ambulances.map(a => [a.location[1], a.location[0]] as L.LatLngExpression)
        ];
        if (allPoints.length > 1) {
            const bounds = L.latLngBounds(allPoints);
            map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14, animate: true, duration: 0.5 });
        }
    }, [ambulances, selectedAmbulanceId, hospitalLocation, onSelectAmbulance]);

    return <div ref={containerRef} style={{ height: "100%", width: "100%", zIndex: 0 }} />;
}

// ── Main Component ─────────────────────────────────────────────────
export default function AmbulanceControl() {
    const {
        ambulances,
        selectedAmbulanceId,
        selectAmbulance,
        updateAmbulanceLocations,
        hospitalLocation,
        initializeHospitalLocation,
        incomingRequests,
        addIncomingRequest,
        dismissIncomingRequest,
        addEmergencyCase
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
        const interval = setInterval(updateAmbulanceLocations, 3000);
        return () => clearInterval(interval);
    }, [updateAmbulanceLocations]);

    // ── BroadcastChannel Listener for Patient Booking Pings ────────
    useEffect(() => {
        const channel = new BroadcastChannel('ambulance_booking');
        channel.onmessage = (event) => {
            if (event.data?.type === 'NEW_REQUEST') {
                const payload = event.data.payload;
                addIncomingRequest({
                    id: payload.id || `REQ-${Date.now()}`,
                    pickupLocation: payload.pickupLocation || 'Unknown',
                    distance: payload.distance || '—',
                    eta: payload.eta || '—',
                    patientName: payload.patientName || 'Unknown Patient',
                    contactNumber: payload.contactNumber || '—',
                    timestamp: Date.now(),
                });
            }
        };
        return () => channel.close();
    }, [addIncomingRequest]);

    const handleAcceptRequest = (req: typeof incomingRequests[0]) => {
        addEmergencyCase(req.patientName, 21, 'Emergency Pickup', 'Family', req.contactNumber);
        dismissIncomingRequest(req.id);
    };

    const selectedAmb = ambulances.find(a => a.id === selectedAmbulanceId) || ambulances[0];

    if (!hospitalLocation) return <div className="p-8 text-center font-bold">Initializing Dispatch Base...</div>;

    return (
        <div className="flex h-screen w-full bg-[#f8f9fa] font-sans overflow-hidden text-slate-800 relative">

            {/* ── Incoming Request Popup ─────────────────────────── */}
            {incomingRequests.length > 0 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 w-[480px] animate-in slide-in-from-top duration-500">
                    {incomingRequests.map(req => (
                        <div key={req.id} className="bg-gradient-to-r from-red-600 to-rose-500 text-white rounded-2xl shadow-2xl shadow-red-500/40 p-5 border border-red-400">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                                        <Siren className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider opacity-80">🚨 New Ambulance Request</p>
                                        <p className="text-lg font-extrabold">{req.patientName}</p>
                                    </div>
                                </div>
                                <button onClick={() => dismissIncomingRequest(req.id)} className="text-white/70 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-3 text-xs mb-4">
                                <div className="bg-white/15 rounded-lg p-2">
                                    <p className="opacity-70">Pickup</p>
                                    <p className="font-bold truncate">{req.pickupLocation}</p>
                                </div>
                                <div className="bg-white/15 rounded-lg p-2">
                                    <p className="opacity-70">Distance</p>
                                    <p className="font-bold">{req.distance}</p>
                                </div>
                                <div className="bg-white/15 rounded-lg p-2">
                                    <p className="opacity-70">ETA</p>
                                    <p className="font-bold">{req.eta}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleAcceptRequest(req)}
                                    className="flex-1 bg-white text-red-600 font-extrabold py-2.5 rounded-xl hover:bg-red-50 transition-colors text-sm shadow-lg"
                                >
                                    ✅ Accept & Dispatch
                                </button>
                                <button
                                    onClick={() => dismissIncomingRequest(req.id)}
                                    className="px-4 bg-white/20 text-white font-bold py-2.5 rounded-xl hover:bg-white/30 transition-colors text-sm"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Central Tracking Panel */}
            <main className="flex-[1] flex flex-col min-w-[350px] bg-[#f8f9fa] border-r border-slate-200 z-10">
                <div className="p-6 md:p-8 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                to="/hospital/dashboard"
                                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold text-xs transition-colors shadow-sm"
                            >
                                <ArrowLeft className="w-4 h-4" /> Go Back
                            </Link>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tracking</h1>
                        </div>
                        <Search className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
                    </div>

                    <div>
                        <p className="text-xs text-slate-400 font-medium mb-3">Show</p>
                        <div className="flex flex-wrap gap-2">
                            <FilterChip label="Active" badge={ambulances.filter(a => a.status !== 'Completed').length.toString()} />
                            <FilterChip label="Inactive" badge="0" />
                            <FilterChip label="All" badge={ambulances.length.toString()} active />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-8">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {ambulances.map((v) => (
                            <VehicleCard
                                key={v.id}
                                data={v}
                                active={v.id === selectedAmb?.id}
                                onClick={() => selectAmbulance(v.id)}
                            />
                        ))}
                    </div>
                </div>
            </main>

            {/* Right Detail Panel */}
            <aside className="flex-[1.2] flex flex-col bg-white overflow-hidden min-w-[400px]">
                {selectedAmb ? (
                    <>
                        <div className="px-8 pt-8 pb-4 flex justify-between items-center bg-white border-b border-slate-100 shrink-0">
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{selectedAmb.id}</h2>
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${selectedAmb.status === 'At Pickup' ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                                    <span className={`text-xs font-bold ${selectedAmb.status === 'At Pickup' ? 'text-orange-500' : 'text-green-500'}`}>{selectedAmb.status}</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <a href={`tel:${selectedAmb.driverPhone}`} className="flex items-center gap-2 px-4 py-2 bg-white border border-[#F26B7A] text-[#F26B7A] hover:bg-pink-50 rounded-xl font-bold text-xs transition-colors">
                                    <Phone className="w-4 h-4" /> Call Driver
                                </a>
                            </div>
                        </div>

                        <div className="px-8 border-b border-slate-100 flex gap-8 shrink-0 overflow-x-auto">
                            <Tab label="Patient Info" active />
                            <Tab label="Driver Info" />
                            <Tab label="Documents" />
                            <Tab label="Billing" />
                        </div>

                        <div className="flex-1 overflow-y-auto bg-slate-50/30 p-8 space-y-8">

                            {/* Route Info & Live Map — FIRST for visibility */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-slate-900">🗺️ Live OSRM Route</h3>
                                    <div className="flex items-center gap-6">
                                        <span className="font-bold text-slate-900">ETA: {Math.max(1, Math.round(selectedAmb.eta))} Min</span>
                                        <span className="text-sm font-medium text-slate-400">Status: {selectedAmb.status}</span>
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#F26B7A] text-[#F26B7A] hover:bg-pink-50 rounded-lg font-bold text-[10px] transition-colors ml-4 shadow-sm">
                                            <MapIcon className="w-3 h-3" /> Change Route
                                        </button>
                                    </div>
                                </div>

                                <div className="h-[420px] rounded-2xl overflow-hidden border-2 border-[#F26B7A]/40 shadow-lg shadow-pink-500/15 relative isolate bg-slate-100">
                                    <LiveMap
                                        hospitalLocation={hospitalLocation}
                                        ambulances={ambulances}
                                        selectedAmbulanceId={selectedAmbulanceId}
                                        onSelectAmbulance={selectAmbulance}
                                    />
                                </div>
                            </div>

                            {/* Patient Emergency Details — below map */}
                            <div className="animate-in fade-in duration-500">
                                <h3 className="text-sm font-bold text-slate-900 mb-6 flex justify-between items-center">
                                    Patient Emergency Details
                                    <button
                                        onClick={() => generatePatientDossierPDF(selectedAmb)}
                                        className="text-[#F26B7A] flex items-center gap-1.5 hover:underline font-bold text-xs bg-pink-50 px-3 py-1.5 rounded-lg border border-pink-100"
                                    >
                                        <FileCheck className="w-4 h-4" /> View / Download Medical History
                                    </button>
                                </h3>

                                <div className="bg-white border text-center border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 border-r border-slate-100 pr-6">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Patient Name</p>
                                        <p className="text-lg font-bold text-slate-900 mb-4">{selectedAmb.patientName} <span className="text-sm font-normal text-slate-500">({selectedAmb.patientAge} Yrs)</span></p>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Condition</p>
                                        <p className="text-sm font-medium text-red-600 bg-red-50 p-2 rounded-lg border border-red-100 inline-block px-3">{selectedAmb.patientCondition}</p>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Local Guardian</p>
                                        <p className="text-lg font-bold text-slate-900 mb-4">{selectedAmb.guardianName}</p>
                                        <a href={`tel:${selectedAmb.guardianPhone}`} className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                                            <PhoneCall className="w-4 h-4" /> +91 {selectedAmb.guardianPhone}
                                        </a>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Driver Details</p>
                                        <p className="text-lg font-bold text-slate-900 mb-4">{selectedAmb.driverName}</p>
                                        <p className="text-sm font-medium text-slate-600">{selectedAmb.driverPhone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400 font-bold">
                        Select an ambulance to view details
                    </div>
                )}
            </aside>
        </div>
    );
}

// ── Subcomponents ─────────────────────────────────────────────────

function FilterChip({ label, badge, active }: { label: string, badge?: string, active?: boolean }) {
    return (
        <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-colors border ${active
            ? 'bg-[#F26B7A] text-white border-[#F26B7A] shadow-sm'
            : 'bg-white text-[#F26B7A] border-[#F26B7A]/30 hover:bg-pink-50'
            }`}>
            {label}
            {badge && (
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] ${active ? 'bg-white text-[#F26B7A]' : 'bg-[#F26B7A] text-white'
                    }`}>
                    {badge}
                </span>
            )}
        </button>
    );
}

function VehicleCard({ data, active, onClick }: { data: any, active: boolean, onClick: () => void }) {
    const isWaiting = data.status === "At Pickup";
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-[20px] p-5 shadow-sm border-2 transition-all cursor-pointer ${active
                ? 'border-[#F26B7A] shadow-[0_4px_24px_rgba(242,107,122,0.15)] ring-4 ring-pink-50'
                : 'border-slate-100 hover:border-slate-200 hover:shadow-md'
                }`}>
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-bold text-slate-900">{data.id}</h3>
                <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${isWaiting ? 'bg-red-500' : 'bg-green-500'}`}></span>
                    <span className={`text-[10px] font-bold ${isWaiting ? 'text-red-500' : 'text-green-500'}`}>{data.status}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{Math.max(1, Math.round(data.eta))} min left</span>
                </div>
                <div className="flex flex-col gap-1 border-l border-slate-100 pl-3">
                    <div className="flex items-center gap-1 line-clamp-1 text-[8px] text-slate-400 font-bold">
                        <span className="w-1 h-1 rounded-full bg-[#F26B7A]"></span> {data.driverName}
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-center items-end h-20 relative">
                <img
                    src="/red-cartoon-style-ambulance-white-stripe-star-life-emblem-features-red-cartoon-style-ambulance-white-stripe-390002025.jpg"
                    alt="Ambulance"
                    className="h-16 object-contain z-10 drop-shadow-md rounded-full border-2 border-slate-100"
                />
            </div>
        </div>
    );
}

function Tab({ label, active }: { label: string, active?: boolean }) {
    return (
        <button className={`py-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${active
            ? 'border-[#F26B7A] text-slate-900'
            : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}>
            {label}
        </button>
    );
}
