import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Plus, Clock } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const initialAvailability = {
    Monday: { enabled: true, start: '08:00', end: '17:00', breakStart: '13:00', breakEnd: '14:00' },
    Tuesday: { enabled: true, start: '08:00', end: '17:00', breakStart: '13:00', breakEnd: '14:00' },
    Wednesday: { enabled: true, start: '09:00', end: '17:00', breakStart: '12:30', breakEnd: '13:30' },
    Thursday: { enabled: true, start: '08:00', end: '17:00', breakStart: '13:00', breakEnd: '14:00' },
    Friday: { enabled: true, start: '08:00', end: '15:00', breakStart: '12:00', breakEnd: '13:00' },
    Saturday: { enabled: false, start: '09:00', end: '13:00', breakStart: '', breakEnd: '' },
    Sunday: { enabled: false, start: '09:00', end: '13:00', breakStart: '', breakEnd: '' },
};

export default function SchedulePage() {
    const [avail, setAvail] = useState(initialAvailability);

    const toggle = (day) => setAvail(prev => ({ ...prev, [day]: { ...prev[day], enabled: !prev[day].enabled } }));
    const update = (day, field, val) => setAvail(prev => ({ ...prev, [day]: { ...prev[day], [field]: val } }));

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Schedule &amp; Availability</h2>
                    <p className="page-subtitle">Set your working hours and break times</p>
                </div>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, width: 'auto', padding: '10px 20px' }}>
                    <Plus size={16} /> Block Time Off
                </button>
            </div>

            <div className="glass schedule-card">
                <div className="schedule-intro">
                    <Clock size={18} color="var(--primary-teal)" />
                    <span>Set your availability for each day. Patients can only book within your available hours.</span>
                </div>

                <div className="schedule-days">
                    {DAYS.map(day => {
                        const d = avail[day];
                        return (
                            <div key={day} className={`schedule-row ${!d.enabled ? 'schedule-row-off' : ''}`}>
                                <div className="schedule-day-name">
                                    <button
                                        onClick={() => toggle(day)}
                                        className="toggle-btn"
                                        aria-label={`Toggle ${day}`}
                                    >
                                        {d.enabled
                                            ? <ToggleRight size={28} color="var(--primary-teal)" />
                                            : <ToggleLeft size={28} color="#ccc" />}
                                    </button>
                                    <span className={`day-label ${!d.enabled ? 'day-label-off' : ''}`}>{day}</span>
                                    {!d.enabled && <span className="day-off-tag">Day Off</span>}
                                </div>

                                {d.enabled && (
                                    <div className="schedule-times">
                                        <div className="time-group">
                                            <label>Start</label>
                                            <input type="time" value={d.start} onChange={e => update(day, 'start', e.target.value)} className="time-input" />
                                        </div>
                                        <span className="time-sep">–</span>
                                        <div className="time-group">
                                            <label>End</label>
                                            <input type="time" value={d.end} onChange={e => update(day, 'end', e.target.value)} className="time-input" />
                                        </div>
                                        <div className="break-group">
                                            <label>Break</label>
                                            <input type="time" value={d.breakStart} onChange={e => update(day, 'breakStart', e.target.value)} className="time-input" />
                                            <span className="time-sep">–</span>
                                            <input type="time" value={d.breakEnd} onChange={e => update(day, 'breakEnd', e.target.value)} className="time-input" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn-primary" style={{ width: 'auto', padding: '11px 28px' }}>Save Availability</button>
                </div>
            </div>
        </div>
    );
}
