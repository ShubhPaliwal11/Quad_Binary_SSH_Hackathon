import React, { useState } from 'react';
import { Clock, Plus, Search, Video, Filter } from 'lucide-react';

const APPOINTMENTS = [
    { id: 1, date: 'Feb 25, 2026', time: '09:00 AM', name: 'Priya Kapoor', reason: 'Follow-up – Hypertension', status: 'completed', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100' },
    { id: 2, date: 'Feb 25, 2026', time: '10:30 AM', name: 'Rajesh Singh', reason: 'Chest pain evaluation', status: 'completed', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' },
    { id: 3, date: 'Feb 25, 2026', time: '11:00 AM', name: 'Amit Patel', reason: 'Annual health checkup', status: 'waiting', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100' },
    { id: 4, date: 'Feb 25, 2026', time: '12:00 PM', name: 'Aisha Patel', reason: 'Diabetes review', status: 'in-progress', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100' },
    { id: 5, date: 'Feb 25, 2026', time: '02:00 PM', name: 'Rahul Verma', reason: 'Post-surgery consult', status: 'scheduled', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
    { id: 6, date: 'Feb 25, 2026', time: '03:00 PM', name: 'Sneha Joshi', reason: 'Skin rash consultation', status: 'scheduled', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100' },
    { id: 7, date: 'Feb 26, 2026', time: '09:30 AM', name: 'Vikram Gupta', reason: 'Back pain evaluation', status: 'scheduled', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100' },
    { id: 8, date: 'Feb 26, 2026', time: '11:00 AM', name: 'Priya Sharma', reason: 'Thyroid follow-up', status: 'scheduled', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
    { id: 9, date: 'Feb 27, 2026', time: '10:00 AM', name: 'Sameer Desai', reason: 'Respiratory assessment', status: 'scheduled', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
];

const STATUS_MAP = {
    scheduled: { label: 'Scheduled', cls: 'appt-status-scheduled' },
    waiting: { label: 'Waiting', cls: 'appt-status-waiting' },
    'in-progress': { label: 'In Progress', cls: 'appt-status-inprogress' },
    completed: { label: 'Completed', cls: 'appt-status-completed' },
};

export default function AppointmentsPage() {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const filtered = APPOINTMENTS.filter(a => {
        const matchStatus = filter === 'all' || a.status === filter;
        const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Appointments</h2>
                    <p className="page-subtitle">Manage all your teleconsultation appointments</p>
                </div>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, width: 'auto', padding: '10px 20px' }}>
                    <Plus size={16} /> New Appointment
                </button>
            </div>

            {/* Filters */}
            <div className="glass page-toolbar">
                <div className="search-bar" style={{ flex: 1 }}>
                    <Search size={16} color="var(--text-secondary)" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by patient name…" />
                </div>
                <div className="filter-pills">
                    {['all', 'scheduled', 'waiting', 'in-progress', 'completed'].map(s => (
                        <button key={s} onClick={() => setFilter(s)} className={`filter-pill ${filter === s ? 'active' : ''}`}>
                            {s === 'all' ? 'All' : STATUS_MAP[s]?.label || s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="glass page-table-card">
                <table className="appt-table">
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(a => {
                            const st = STATUS_MAP[a.status];
                            const canJoin = a.status === 'waiting' || a.status === 'in-progress';
                            return (
                                <tr key={a.id}>
                                    <td>
                                        <div className="table-patient">
                                            <img src={a.avatar} alt={a.name} className="appt-avatar" />
                                            <span>{a.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{a.date}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                                            <Clock size={13} color="var(--text-secondary)" /> {a.time}
                                        </div>
                                    </td>
                                    <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{a.reason}</td>
                                    <td><span className={`status-badge ${st.cls}`}>{st.label}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            {canJoin && (
                                                <button className="btn-join" style={{ fontSize: 12, padding: '6px 12px' }}>
                                                    <Video size={13} /> Join
                                                </button>
                                            )}
                                            <button className="btn-details">Details</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {filtered.length === 0 && (
                            <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>No appointments found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
