import React, { useState } from "react";
import {
    Stethoscope, UserPlus, Edit2, Trash2, Phone,
    X, Check, Clock, Search, Calendar
} from "lucide-react";
import { useStaffStore, Doctor } from "../../../stores/useStaffStore";

const SHIFTS: Doctor['shift'][] = ['Morning', 'Afternoon', 'Night', 'Off'];
const SHIFT_COLORS: Record<string, string> = {
    Morning: 'bg-amber-50 text-amber-600 border-amber-200',
    Afternoon: 'bg-blue-50 text-blue-600 border-blue-200',
    Night: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    Off: 'bg-slate-100 text-slate-500 border-slate-200',
};
const STATUS_COLORS: Record<string, string> = {
    Available: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'In Surgery': 'bg-red-50 text-red-600 border-red-200',
    'On Break': 'bg-yellow-50 text-yellow-600 border-yellow-200',
    'Off Duty': 'bg-slate-100 text-slate-500 border-slate-200',
};

export default function StaffManagement() {
    const { doctors, addDoctor, updateDoctor, removeDoctor, assignDoctorToCase } = useStaffStore();
    const [search, setSearch] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [assignId, setAssignId] = useState<string | null>(null);
    const [caseInput, setCaseInput] = useState('');
    const [form, setForm] = useState({ name: '', specialization: '', phone: '', shift: 'Morning' as Doctor['shift'] });

    const filtered = doctors.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.specialization.toLowerCase().includes(search.toLowerCase())
    );

    const handleAdd = () => {
        if (!form.name || !form.specialization) return;
        addDoctor(form.name, form.specialization, form.phone, form.shift);
        setShowAdd(false); setForm({ name: '', specialization: '', phone: '', shift: 'Morning' });
    };

    return (
        <div className="p-6 lg:p-8 h-full overflow-y-auto bg-[#F3F4F6] animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <div className="inline-flex items-center justify-center p-3 bg-teal-100 rounded-2xl mb-4 shadow-sm border border-teal-200">
                        <Stethoscope className="w-8 h-8 text-teal-600" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Staff Management</h1>
                    <p className="text-slate-500 text-lg">Manage doctors, shifts, and case assignments</p>
                </div>
                <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-teal-500/30 transition-colors">
                    <UserPlus className="w-4 h-4" /> Add Doctor
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text" value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full bg-white border border-slate-200 shadow-sm rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                    placeholder="Search by name or specialization..."
                />
            </div>

            {/* Shift Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {SHIFTS.map(shift => {
                    const count = doctors.filter(d => d.shift === shift).length;
                    return (
                        <div key={shift} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{shift}</p>
                            <p className="text-3xl font-black text-slate-900">{count}</p>
                            <p className="text-xs text-slate-500 font-medium mt-1">doctors</p>
                        </div>
                    );
                })}
            </div>

            {/* Doctor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(doc => (
                    <div key={doc.id} className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-lg shadow-slate-200/50 group hover:-translate-y-0.5 transition-transform">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-lg font-bold text-slate-900">{doc.name}</p>
                                <p className="text-xs text-slate-500 font-semibold">{doc.specialization}</p>
                            </div>
                            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setEditId(doc.id); setForm({ name: doc.name, specialization: doc.specialization, phone: doc.phone, shift: doc.shift }); }} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
                                    <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => removeDoctor(doc.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border ${SHIFT_COLORS[doc.shift]}`}>
                                <Clock className="w-3 h-3 inline mr-1" />{doc.shift}
                            </span>
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border ${STATUS_COLORS[doc.status]}`}>
                                {doc.status}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <a href={`tel:${doc.phone}`} className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline">
                                <Phone className="w-3.5 h-3.5" /> {doc.phone}
                            </a>
                            {doc.assignedCase ? (
                                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg border border-purple-100">{doc.assignedCase}</span>
                            ) : (
                                <button onClick={() => setAssignId(doc.id)} className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-lg border border-teal-100 hover:bg-teal-100 transition-colors">
                                    Assign Case
                                </button>
                            )}
                        </div>

                        {/* Shift Scheduler */}
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Change Shift</p>
                            <div className="flex gap-2">
                                {SHIFTS.map(s => (
                                    <button key={s} onClick={() => updateDoctor(doc.id, { shift: s, status: s === 'Off' ? 'Off Duty' : doc.status === 'Off Duty' ? 'Available' : doc.status })}
                                        className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border ${doc.shift === s ? 'bg-teal-500 border-teal-600 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                                    >
                                        {s.slice(0, 3)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add / Edit Modal */}
            {(showAdd || editId) && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-in fade-in" onClick={() => { setShowAdd(false); setEditId(null); }}>
                    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-slate-900 mb-6">{editId ? 'Edit Doctor' : 'Add New Doctor'}</h3>
                        <div className="space-y-4">
                            <input type="text" placeholder="Doctor Name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium" />
                            <input type="text" placeholder="Specialization *" value={form.specialization} onChange={e => setForm(p => ({ ...p, specialization: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium" />
                            <input type="tel" placeholder="Phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium" />
                            <div>
                                <p className="text-[10px] text-slate-400 font-black uppercase mb-2">Shift</p>
                                <div className="flex gap-2">
                                    {SHIFTS.map(s => (
                                        <button key={s} type="button" onClick={() => setForm(p => ({ ...p, shift: s }))}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border-2 ${form.shift === s ? 'bg-teal-500 border-teal-600 text-white' : 'bg-white border-slate-200 text-slate-500'}`}
                                        >{s}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button onClick={() => {
                            if (editId) { updateDoctor(editId, form); setEditId(null); }
                            else handleAdd();
                        }} className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-teal-500/30 transition-colors">
                            {editId ? 'Save Changes' : 'Add Doctor'}
                        </button>
                    </div>
                </div>
            )}

            {/* Assign Case Modal */}
            {assignId && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-in fade-in" onClick={() => setAssignId(null)}>
                    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Assign Case to {doctors.find(d => d.id === assignId)?.name}</h3>
                        <input type="text" autoFocus value={caseInput} onChange={e => setCaseInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && caseInput.trim()) { assignDoctorToCase(assignId, caseInput.trim()); setAssignId(null); setCaseInput(''); } }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium mb-4"
                            placeholder="Enter Patient ID (e.g. PT-10023)"
                        />
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setAssignId(null)} className="px-4 py-2 text-sm font-bold text-slate-600">Cancel</button>
                            <button onClick={() => { if (caseInput.trim()) { assignDoctorToCase(assignId, caseInput.trim()); setAssignId(null); setCaseInput(''); } }}
                                className="flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-500/30 transition-colors">
                                <Check className="w-4 h-4" /> Assign
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
