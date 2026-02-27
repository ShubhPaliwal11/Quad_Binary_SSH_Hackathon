import React, { useState } from "react";
import {
    Users, Search, Filter, Download, ArrowRight, Plus,
    X, FileText, Trash2, Edit2, UserPlus, FileCheck
} from "lucide-react";
import { generatePatientDossierPDF } from "../../../lib/pdfGenerator";
import type { Ambulance } from "../../../stores/useHospitalStore";

interface Patient {
    id: string; name: string; age: number; gender: string;
    condition: string; status: string; ward: string; date: string;
    phone: string; bloodGroup: string;
}

const INITIAL_PATIENTS: Patient[] = [
    { id: 'PT-10023', name: 'Priya Sharma', age: 32, gender: 'F', condition: 'Cardiac distress', status: 'Admitted', ward: 'ICU', date: '25 Feb 2026', phone: '9876543210', bloodGroup: 'O+' },
    { id: 'PT-10024', name: 'Abdul Rahman', age: 58, gender: 'M', condition: 'Stroke', status: 'En Route', ward: 'Emergency', date: '25 Feb 2026', phone: '9823456712', bloodGroup: 'B-' },
    { id: 'PT-10025', name: 'Kavita Iyer', age: 41, gender: 'F', condition: 'Accident trauma', status: 'Surgery', ward: 'OT-2', date: '25 Feb 2026', phone: '9898765432', bloodGroup: 'AB+' },
    { id: 'PT-10026', name: 'Rohit Singh', age: 27, gender: 'M', condition: 'Internal bleeding', status: 'Admitted', ward: 'Ward 4B', date: '24 Feb 2026', phone: '9812345678', bloodGroup: 'A+' },
    { id: 'PT-10027', name: 'Meena Joshi', age: 65, gender: 'F', condition: 'Hypertension', status: 'Discharged', ward: 'N/A', date: '23 Feb 2026', phone: '9834567123', bloodGroup: 'O-' },
];

export default function PatientRegistry() {
    const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
    const [search, setSearch] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState<Partial<Patient>>({});

    const filtered = patients.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.condition.toLowerCase().includes(search.toLowerCase())
    );

    const handleAdd = () => {
        if (!form.name || !form.condition) return;
        const newPt: Patient = {
            id: 'PT-' + (10028 + patients.length),
            name: form.name || '', age: parseInt(form.age as any) || 30,
            gender: form.gender || 'M', condition: form.condition || '',
            status: form.status || 'Admitted', ward: form.ward || 'Emergency',
            date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            phone: form.phone || '', bloodGroup: form.bloodGroup || 'O+'
        };
        setPatients(prev => [newPt, ...prev]);
        setShowAdd(false); setForm({});
    };

    const handleDelete = (id: string) => {
        setPatients(prev => prev.filter(p => p.id !== id));
    };

    const handleEdit = (pt: Patient) => {
        setEditId(pt.id); setForm(pt);
    };

    const handleSaveEdit = () => {
        setPatients(prev => prev.map(p => p.id === editId ? { ...p, ...form } as Patient : p));
        setEditId(null); setForm({});
    };

    const handleDischargePDF = (pt: Patient) => {
        // Build a mock ambulance-like object for the PDF generator
        const mockAmb: Ambulance = {
            id: pt.id, driverName: 'N/A', driverPhone: 'N/A',
            patientName: pt.name, patientAge: pt.age, patientCondition: pt.condition,
            guardianName: 'N/A', guardianPhone: pt.phone,
            medicalHistory: {
                bloodGroup: pt.bloodGroup, allergies: ['None'], chronic: [pt.condition],
                pastVisits: [{ date: pt.date, reason: pt.condition }],
                medications: [{ name: 'Paracetamol', dosage: '500mg', frequency: 'As needed' }],
                vitals: { bp: '120/80', heartRate: 72, temp: 98.6, spO2: 98 },
                previousSurgeries: [], reports: ['Discharge Summary Generated']
            },
            status: 'Completed', eta: 0, speed: 0, location: [0, 0], routeCoordinates: [], routeIndex: 0
        };
        generatePatientDossierPDF(mockAmb);
    };

    const exportCSV = () => {
        const headers = 'ID,Name,Age,Gender,Condition,Status,Ward,Date,Phone,BloodGroup\n';
        const rows = patients.map(p => `${p.id},${p.name},${p.age},${p.gender},${p.condition},${p.status},${p.ward},${p.date},${p.phone},${p.bloodGroup}`).join('\n');
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'patients.csv'; a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6 lg:p-8 h-full overflow-y-auto bg-[#F3F4F6] animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-2xl mb-4 shadow-sm border border-purple-200">
                        <Users className="w-8 h-8 text-purple-600" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Patient Registry</h1>
                    <p className="text-slate-500 text-lg">Manage patients, upload reports, generate discharge PDFs</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={exportCSV} className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-xl border border-slate-200 shadow-sm font-bold text-sm transition-colors">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button onClick={() => { setShowAdd(true); setForm({}); }} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-purple-500/30 transition-colors">
                        <UserPlus className="w-4 h-4" /> Add Patient
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text" value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full bg-white border border-slate-200 shadow-sm rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                    placeholder="Search by UHID, name, or condition..."
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">UHID</th>
                                <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                                <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Condition</th>
                                <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ward</th>
                                <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map(pt => (
                                <tr key={pt.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-5 py-4 font-mono text-slate-500 text-sm font-semibold">{pt.id}</td>
                                    <td className="px-5 py-4">
                                        <p className="font-bold text-slate-900">{pt.name}</p>
                                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{pt.age} yrs, {pt.gender} • {pt.bloodGroup}</p>
                                    </td>
                                    <td className="px-5 py-4 text-slate-600 font-medium text-sm">{pt.condition}</td>
                                    <td className="px-5 py-4 text-slate-500 text-sm font-semibold">{pt.ward}</td>
                                    <td className="px-5 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-black border ${pt.status === 'Admitted' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                pt.status === 'Discharged' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                                    pt.status === 'Surgery' ? 'bg-red-50 text-red-600 border-red-200' :
                                                        'bg-yellow-50 text-yellow-600 border-yellow-200'
                                            }`}>
                                            {pt.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(pt)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100" title="Edit">
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => handleDischargePDF(pt)} className="p-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100" title="Discharge PDF">
                                                <FileCheck className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => handleDelete(pt.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100" title="Delete">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add / Edit Modal */}
            {(showAdd || editId) && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-in fade-in" onClick={() => { setShowAdd(false); setEditId(null); setForm({}); }}>
                    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-900">{editId ? 'Edit Patient' : 'Add New Patient'}</h3>
                            <button onClick={() => { setShowAdd(false); setEditId(null); setForm({}); }} className="p-1 text-slate-400 hover:text-slate-800">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input type="text" placeholder="Patient Name *" value={form.name || ''} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium" />
                            <div className="grid grid-cols-3 gap-3">
                                <input type="number" placeholder="Age" value={form.age || ''} onChange={e => setForm(p => ({ ...p, age: parseInt(e.target.value) }))} className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium" />
                                <select value={form.gender || 'M'} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))} className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium">
                                    <option value="M">Male</option><option value="F">Female</option><option value="O">Other</option>
                                </select>
                                <input type="text" placeholder="Blood Grp" value={form.bloodGroup || ''} onChange={e => setForm(p => ({ ...p, bloodGroup: e.target.value }))} className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium" />
                            </div>
                            <input type="text" placeholder="Condition *" value={form.condition || ''} onChange={e => setForm(p => ({ ...p, condition: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium" />
                            <div className="grid grid-cols-2 gap-3">
                                <input type="text" placeholder="Ward" value={form.ward || ''} onChange={e => setForm(p => ({ ...p, ward: e.target.value }))} className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium" />
                                <select value={form.status || 'Admitted'} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium">
                                    <option>Admitted</option><option>En Route</option><option>Surgery</option><option>Discharged</option>
                                </select>
                            </div>
                            <input type="tel" placeholder="Phone" value={form.phone || ''} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium" />
                        </div>
                        <button onClick={editId ? handleSaveEdit : handleAdd} className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-purple-500/30 transition-colors">
                            {editId ? 'Save Changes' : 'Add Patient'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
