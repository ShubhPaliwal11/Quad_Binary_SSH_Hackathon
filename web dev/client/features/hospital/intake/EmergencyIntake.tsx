import React, { useState } from "react";
import {
    Siren, UserPlus, Phone, ShieldAlert, AlertTriangle,
    CheckCircle, ArrowRight, Loader2
} from "lucide-react";
import { useHospitalStore } from "../../../stores/useHospitalStore";
import { useNavigate } from "react-router-dom";

export default function EmergencyIntake() {
    const { addEmergencyCase, ambulances } = useHospitalStore();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        patientName: '', age: '', condition: '', severity: 'High',
        guardianName: '', guardianPhone: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.patientName || !form.condition) return;
        setLoading(true);
        setTimeout(() => {
            addEmergencyCase(
                form.patientName,
                parseInt(form.age) || 30,
                form.condition,
                form.guardianName || 'N/A',
                form.guardianPhone || 'N/A'
            );
            setLoading(false);
            setSubmitted(true);
        }, 800);
    };

    const SEVERITY_OPTIONS = ['Critical', 'High', 'Medium', 'Low'];

    if (submitted) {
        return (
            <div className="p-8 h-full overflow-y-auto bg-[#F3F4F6] flex items-center justify-center animate-in fade-in">
                <div className="bg-white p-12 rounded-[2rem] border border-slate-200 shadow-xl max-w-lg w-full text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-200">
                        <CheckCircle className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Ambulance Dispatched</h2>
                    <p className="text-slate-500 mb-2">
                        Patient <span className="font-bold text-slate-800">{form.patientName}</span> has been registered.
                    </p>
                    <p className="text-slate-500 mb-8">
                        An ambulance has been assigned and is now en route via the nearest road.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => navigate('/hospital/ambulance')}
                            className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-rose-500/30 transition-colors"
                        >
                            <Siren className="w-4 h-4" /> Track Ambulance
                        </button>
                        <button
                            onClick={() => { setSubmitted(false); setForm({ patientName: '', age: '', condition: '', severity: 'High', guardianName: '', guardianPhone: '' }); }}
                            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors"
                        >
                            <UserPlus className="w-4 h-4" /> New Case
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 h-full overflow-y-auto bg-[#F3F4F6] animate-in fade-in duration-500">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-2xl mb-4 shadow-sm border border-red-200">
                        <ShieldAlert className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Emergency Intake</h1>
                    <p className="text-slate-500 text-lg">Register a new emergency case and dispatch an ambulance</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2 block">Patient Name *</label>
                            <input
                                type="text" required value={form.patientName}
                                onChange={e => setForm(p => ({ ...p, patientName: e.target.value }))}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium transition-shadow"
                                placeholder="Full Name"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2 block">Age</label>
                            <input
                                type="number" value={form.age}
                                onChange={e => setForm(p => ({ ...p, age: e.target.value }))}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium transition-shadow"
                                placeholder="Patient Age"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2 block">Emergency Condition *</label>
                        <input
                            type="text" required value={form.condition}
                            onChange={e => setForm(p => ({ ...p, condition: e.target.value }))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium transition-shadow"
                            placeholder="e.g. Cardiac distress, Accident trauma, Stroke"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3 block">Severity Level</label>
                        <div className="flex gap-3">
                            {SEVERITY_OPTIONS.map(s => (
                                <button type="button" key={s} onClick={() => setForm(p => ({ ...p, severity: s }))}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all ${form.severity === s
                                            ? s === 'Critical' ? 'bg-red-500 border-red-600 text-white shadow-lg shadow-red-500/30' :
                                                s === 'High' ? 'bg-orange-500 border-orange-600 text-white shadow-lg shadow-orange-500/30' :
                                                    s === 'Medium' ? 'bg-yellow-500 border-yellow-600 text-white shadow-lg shadow-yellow-500/30' :
                                                        'bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                        <p className="text-xs font-bold text-slate-600 mb-4">Guardian / Emergency Contact</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2 block">Guardian Name</label>
                                <input
                                    type="text" value={form.guardianName}
                                    onChange={e => setForm(p => ({ ...p, guardianName: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium transition-shadow"
                                    placeholder="Guardian Name"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2 block">Guardian Phone</label>
                                <input
                                    type="tel" value={form.guardianPhone}
                                    onChange={e => setForm(p => ({ ...p, guardianPhone: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium transition-shadow"
                                    placeholder="+91 XXXXXXXXXX"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-red-500/30 transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Siren className="w-5 h-5" />}
                        {loading ? 'Dispatching Ambulance...' : 'Register & Dispatch Ambulance'}
                    </button>
                </form>
            </div>
        </div>
    );
}
