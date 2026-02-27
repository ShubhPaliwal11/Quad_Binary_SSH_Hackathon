import React from 'react';
import CalendarView from '../components/CalendarView';

export default function CalendarPage({ onSelectAppt }) {
    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Calendar</h2>
                    <p className="page-subtitle">Your full schedule overview</p>
                </div>
            </div>
            <div className="glass" style={{ flex: 1, minHeight: 560, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <CalendarView onSlotClick={slot => onSelectAppt({ id: slot.id, name: slot.patient, time: `${slot.hour}:00`, status: slot.status, reason: 'See full details' })} />
            </div>
        </div>
    );
}
