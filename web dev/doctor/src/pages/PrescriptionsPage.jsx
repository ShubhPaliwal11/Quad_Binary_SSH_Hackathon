import React, { useState } from 'react';
import { Search, Plus, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const PRESCRIPTIONS = [
    { id: 1, patient: 'Priya Kapoor', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100', medication: 'Lisinopril 10mg', dosage: '1 tablet once daily', duration: '30 days', date: 'Feb 25, 2026', status: 'pending' },
    { id: 2, patient: 'Aisha Patel', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', medication: 'Insulin Glargine', dosage: '20 units at bedtime', duration: '90 days', date: 'Feb 25, 2026', status: 'pending' },
    { id: 3, patient: 'Sameer Desai', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', medication: 'Salbutamol Inhaler', dosage: '2 puffs as needed', duration: '60 days', date: 'Feb 24, 2026', status: 'pending' },
    { id: 4, patient: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100', medication: 'Levothyroxine 50mcg', dosage: '1 tablet every morning', duration: '90 days', date: 'Feb 22, 2026', status: 'approved' },
    { id: 5, patient: 'Rahul Verma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', medication: 'Ibuprofen 400mg', dosage: '1 tablet 3x daily (with food)', duration: '10 days', date: 'Feb 20, 2026', status: 'approved' },
    { id: 6, patient: 'Sneha Joshi', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100', medication: 'Hydrocortisone Cream 1%', dosage: 'Apply twice daily to affected area', duration: '14 days', date: 'Feb 18, 2026', status: 'approved' },
    { id: 7, patient: 'Vikram Gupta', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100', medication: 'Diclofenac 50mg', dosage: '1 tablet twice daily', duration: '7 days', date: 'Feb 10, 2026', status: 'approved' },
];

const STATUS_ICONS = {
    pending: <AlertCircle size={14} color="#f57c00" />,
    approved: <CheckCircle size={14} color="#2e7d32" />,
};

export default function PrescriptionsPage() {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const filtered = PRESCRIPTIONS.filter(p => {
        const matchStatus = filter === 'all' || p.status === filter;
        const matchSearch = p.patient.toLowerCase().includes(search.toLowerCase()) ||
            p.medication.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    const pendingCount = PRESCRIPTIONS.filter(p => p.status === 'pending').length;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Prescriptions</h2>
                    <p className="page-subtitle">{pendingCount} pending review · {PRESCRIPTIONS.length} total</p>
                </div>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, width: 'auto', padding: '10px 20px' }}>
                    <Plus size={16} /> New Prescription
                </button>
            </div>

            <div className="glass page-toolbar">
                <div className="search-bar" style={{ flex: 1 }}>
                    <Search size={16} color="var(--text-secondary)" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by patient or medication…" />
                </div>
                <div className="filter-pills">
                    {['all', 'pending', 'approved'].map(s => (
                        <button key={s} onClick={() => setFilter(s)} className={`filter-pill ${filter === s ? 'active' : ''}`}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                            {s === 'pending' && pendingCount > 0 && <span className="pill-badge">{pendingCount}</span>}
                        </button>
                    ))}
                </div>
            </div>

            <div className="prescriptions-list">
                {filtered.map(rx => (
                    <div key={rx.id} className={`glass rx-card ${rx.status === 'pending' ? 'rx-pending' : ''}`}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                            <img src={rx.avatar} alt={rx.patient} className="appt-avatar" />
                            <div>
                                <p className="rx-patient">{rx.patient}</p>
                                <p className="rx-date"><Clock size={11} /> {rx.date}</p>
                            </div>
                        </div>
                        <div className="rx-drug-info">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <FileText size={15} color="var(--primary-teal)" />
                                <span className="rx-drug-name">{rx.medication}</span>
                            </div>
                            <p className="rx-dosage">{rx.dosage} · {rx.duration}</p>
                        </div>
                        <div className="rx-status-col">
                            <span className={`status-badge ${rx.status === 'pending' ? 'appt-status-waiting' : 'appt-status-completed'}`}
                                style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                {STATUS_ICONS[rx.status]} {rx.status.charAt(0).toUpperCase() + rx.status.slice(1)}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                            {rx.status === 'pending' && (
                                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13, width: 'auto' }}>Approve</button>
                            )}
                            <button className="btn-details">View</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
