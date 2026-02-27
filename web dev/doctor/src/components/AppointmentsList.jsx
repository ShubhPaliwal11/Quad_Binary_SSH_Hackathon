import React from 'react';
import { Video, FileText } from 'lucide-react';

const APPOINTMENTS = [
    { id: 1, time: '09:00 AM', name: 'Emily Henderson', reason: 'Follow-up – Hypertension', status: 'completed', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100' },
    { id: 2, time: '10:30 AM', name: 'Markus Wright', reason: 'Chest pain evaluation', status: 'completed', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' },
    { id: 3, time: '11:00 AM', name: 'John Smith', reason: 'Annual health checkup', status: 'waiting', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100' },
    { id: 4, time: '12:00 PM', name: 'Aisha Patel', reason: 'Diabetes review', status: 'in-progress', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100' },
    { id: 5, time: '02:00 PM', name: 'Carlos Vega', reason: 'Post-surgery consult', status: 'scheduled', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
    { id: 6, time: '03:00 PM', name: 'Nora Kim', reason: 'Skin rash consultation', status: 'scheduled', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100' },
];

const STATUS_MAP = {
    scheduled: { label: 'Scheduled', className: 'appt-status-scheduled' },
    waiting: { label: 'Waiting', className: 'appt-status-waiting' },
    'in-progress': { label: 'In Progress', className: 'appt-status-inprogress' },
    completed: { label: 'Completed', className: 'appt-status-completed' },
};

export default function AppointmentsList({ onViewDetails }) {
    return (
        <div className="appt-list-container">
            <div className="section-header" style={{ marginBottom: '16px' }}>
                <h3>Today's Appointments</h3>
                <span className="appt-count">{APPOINTMENTS.length} total</span>
            </div>
            <div className="appt-list">
                {APPOINTMENTS.map(appt => {
                    const st = STATUS_MAP[appt.status];
                    const canJoin = appt.status === 'waiting' || appt.status === 'in-progress';
                    return (
                        <div key={appt.id} className={`appt-item ${appt.status === 'in-progress' ? 'appt-item-active' : ''}`}>
                            <div className="appt-time">{appt.time}</div>
                            <div className="appt-info">
                                <div className="appt-top">
                                    <img src={appt.avatar} alt={appt.name} className="appt-avatar" />
                                    <div>
                                        <p className="appt-name">{appt.name}</p>
                                        <p className="appt-reason">{appt.reason}</p>
                                    </div>
                                </div>
                                <div className="appt-actions">
                                    <span className={`status-badge ${st.className}`}>{st.label}</span>
                                    <div className="appt-btns">
                                        {canJoin && (
                                            <button className="btn-join">
                                                <Video size={14} /> Join Call
                                            </button>
                                        )}
                                        <button
                                            className="btn-details"
                                            onClick={() => onViewDetails && onViewDetails(appt)}
                                        >
                                            <FileText size={14} /> Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
