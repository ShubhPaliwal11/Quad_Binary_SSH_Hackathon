import React, { useState } from 'react';
import { Search, Plus, User, Phone, Mail } from 'lucide-react';

const PATIENTS = [
    { id: 1, name: 'Priya Kapoor', age: 54, gender: 'Female', condition: 'Hypertension', visits: 8, phone: '+91 98765-43210', email: 'priya.k@email.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100', lastVisit: 'Feb 25, 2026' },
    { id: 2, name: 'Rajesh Singh', age: 41, gender: 'Male', condition: 'Chest Pain', visits: 3, phone: '+91 98765-43211', email: 'rajesh.s@email.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100', lastVisit: 'Feb 25, 2026' },
    { id: 3, name: 'Amit Patel', age: 29, gender: 'Male', condition: 'Annual Checkup', visits: 2, phone: '+91 98765-43212', email: 'amit.p@email.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100', lastVisit: 'Feb 25, 2026' },
    { id: 4, name: 'Aisha Patel', age: 67, gender: 'Female', condition: 'Type 2 Diabetes', visits: 14, phone: '+91 98765-43213', email: 'aisha.p@email.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', lastVisit: 'Feb 25, 2026' },
    { id: 5, name: 'Rahul Verma', age: 35, gender: 'Male', condition: 'Post-Surgery', visits: 5, phone: '+91 98765-43214', email: 'rahul.v@email.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', lastVisit: 'Feb 20, 2026' },
    { id: 6, name: 'Sneha Joshi', age: 28, gender: 'Female', condition: 'Dermatitis', visits: 2, phone: '+91 98765-43215', email: 'sneha.j@email.com', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100', lastVisit: 'Feb 25, 2026' },
    { id: 7, name: 'Vikram Gupta', age: 52, gender: 'Male', condition: 'Lumbar Pain', visits: 4, phone: '+91 98765-43216', email: 'vikram.g@email.com', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100', lastVisit: 'Feb 10, 2026' },
    { id: 8, name: 'Priya Sharma', age: 39, gender: 'Female', condition: 'Hypothyroidism', visits: 6, phone: '+91 98765-43217', email: 'priya.s@email.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100', lastVisit: 'Feb 15, 2026' },
    { id: 9, name: 'Sameer Desai', age: 44, gender: 'Male', condition: 'Asthma', visits: 7, phone: '+91 98765-43218', email: 'sameer.d@email.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', lastVisit: 'Jan 30, 2026' },
];

export default function PatientsPage() {
    const [search, setSearch] = useState('');
    const filtered = PATIENTS.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.condition.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Patients</h2>
                    <p className="page-subtitle">{PATIENTS.length} patients under your care</p>
                </div>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, width: 'auto', padding: '10px 20px' }}>
                    <Plus size={16} /> Add Patient
                </button>
            </div>

            <div className="glass page-toolbar">
                <div className="search-bar" style={{ flex: 1 }}>
                    <Search size={16} color="var(--text-secondary)" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or condition…" />
                </div>
            </div>

            <div className="patients-grid">
                {filtered.map(p => (
                    <div key={p.id} className="glass patient-card">
                        <div className="patient-card-top">
                            <img src={p.avatar} alt={p.name} className="patient-card-avatar" />
                            <div>
                                <h4 className="patient-card-name">{p.name}</h4>
                                <p className="patient-card-meta">{p.age} yrs · {p.gender}</p>
                            </div>
                        </div>
                        <div className="patient-card-body">
                            <div className="patient-detail-row">
                                <span className="detail-label">Condition</span>
                                <span className="patient-condition">{p.condition}</span>
                            </div>
                            <div className="patient-detail-row">
                                <span className="detail-label">Last Visit</span>
                                <span>{p.lastVisit}</span>
                            </div>
                            <div className="patient-detail-row">
                                <span className="detail-label">Total Visits</span>
                                <span>{p.visits}</span>
                            </div>
                        </div>
                        <div className="patient-card-contacts">
                            <a href={`tel:${p.phone}`} className="contact-chip"><Phone size={12} /> {p.phone}</a>
                            <a href={`mailto:${p.email}`} className="contact-chip"><Mail size={12} /> {p.email}</a>
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                            <button className="btn-primary" style={{ flex: 1, padding: '9px 10px', fontSize: 13 }}>View History</button>
                            <button className="btn-secondary" style={{ flex: 1, padding: '9px 10px', fontSize: 13 }}>Book Appt.</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
