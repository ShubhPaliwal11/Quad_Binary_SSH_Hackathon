import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const MOCK_SLOTS = [
    { id: 1, day: 2, hour: 9, duration: 1, patient: 'Emily Henderson', status: 'completed' },
    { id: 2, day: 2, hour: 10, duration: 1, patient: 'Markus Wright', status: 'completed' },
    { id: 3, day: 2, hour: 11, duration: 1, patient: 'John Smith', status: 'waiting' },
    { id: 4, day: 2, hour: 12, duration: 1, patient: 'Aisha Patel', status: 'in-progress' },
    { id: 5, day: 2, hour: 14, duration: 1, patient: 'Carlos Vega', status: 'scheduled' },
    { id: 6, day: 2, hour: 15, duration: 1, patient: 'Nora Kim', status: 'scheduled' },
    { id: 7, day: 3, hour: 9, duration: 1, patient: 'Stefan Müller', status: 'scheduled' },
    { id: 8, day: 3, hour: 11, duration: 1, patient: 'Priya Sharma', status: 'scheduled' },
    { id: 9, day: 4, hour: 10, duration: 1, patient: 'James Okafor', status: 'scheduled' },
];

const STATUS_STYLES = {
    scheduled: { bg: '#e8f5e9', color: '#2e7d32', label: 'Scheduled' },
    waiting: { bg: '#fff8e1', color: '#f57f17', label: 'Waiting' },
    'in-progress': { bg: '#e3f2fd', color: '#1565c0', label: 'In Progress' },
    completed: { bg: '#f3e5f5', color: '#6a1b9a', label: 'Completed' },
};

const TODAY_COL = 2; // Wednesday = column index 2

export default function CalendarView({ onSlotClick }) {
    const [view, setView] = useState('week');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const currentHour = currentTime.getHours() + currentTime.getMinutes() / 60;
    const timeLineTop = ((currentHour - HOURS[0]) / HOURS.length) * 100;

    return (
        <div className="calendar-view">
            <div className="calendar-header">
                <div>
                    <h3>Schedule</h3>
                    <span className="calendar-date">February 24 – 28, 2026</span>
                </div>
                <div className="calendar-controls">
                    <div className="view-toggle">
                        <button className={view === 'day' ? 'active' : ''} onClick={() => setView('day')}>Day</button>
                        <button className={view === 'week' ? 'active' : ''} onClick={() => setView('week')}>Week</button>
                    </div>
                    <button className="icon-btn-sm"><ChevronLeft size={16} /></button>
                    <button className="icon-btn-sm"><ChevronRight size={16} /></button>
                </div>
            </div>

            <div className="calendar-grid-wrapper">
                {/* Day headers */}
                <div className="cal-day-headers">
                    <div className="cal-time-gutter" />
                    {DAYS.map((d, i) => (
                        <div key={d} className={`cal-day-header ${i === TODAY_COL ? 'today' : ''}`}>
                            <span className="day-name">{d}</span>
                            <span className={`day-num ${i === TODAY_COL ? 'today-circle' : ''}`}>{19 + i}</span>
                        </div>
                    ))}
                </div>

                {/* Scrollable time grid */}
                <div className="cal-grid-scroll">
                    <div className="cal-grid" style={{ '--rows': HOURS.length }}>
                        {/* Time labels */}
                        <div className="cal-time-col">
                            {HOURS.map(h => (
                                <div key={h} className="cal-time-label">
                                    {h < 12 ? `${h}:00 AM` : h === 12 ? '12:00 PM' : `${h - 12}:00 PM`}
                                </div>
                            ))}
                        </div>

                        {/* Day columns */}
                        {DAYS.map((d, di) => (
                            <div key={d} className={`cal-col ${di === TODAY_COL ? 'today-col' : ''}`}>
                                {HOURS.map(h => (
                                    <div key={h} className="cal-cell" />
                                ))}

                                {/* Current time line */}
                                {di === TODAY_COL && currentHour >= HOURS[0] && currentHour <= HOURS[HOURS.length - 1] && (
                                    <div className="current-time-line" style={{ top: `${timeLineTop}%` }}>
                                        <div className="time-dot" />
                                        <div className="time-bar" />
                                    </div>
                                )}

                                {/* Appointments */}
                                {MOCK_SLOTS.filter(s => s.day === di).map(slot => {
                                    const topPct = ((slot.hour - HOURS[0]) / HOURS.length) * 100;
                                    const heightPct = (slot.duration / HOURS.length) * 100;
                                    const style = STATUS_STYLES[slot.status];
                                    return (
                                        <div
                                            key={slot.id}
                                            className="cal-event"
                                            style={{
                                                top: `calc(${topPct}% + 4px)`,
                                                height: `calc(${heightPct}% - 8px)`,
                                                background: style.bg,
                                                borderLeft: `3px solid ${style.color}`,
                                            }}
                                            onClick={() => onSlotClick && onSlotClick(slot)}
                                        >
                                            <span className="event-patient">{slot.patient}</span>
                                            <span className="event-status" style={{ color: style.color }}>{style.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="cal-legend">
                {Object.entries(STATUS_STYLES).map(([k, v]) => (
                    <div key={k} className="legend-item">
                        <span className="legend-dot" style={{ background: v.color }} />
                        <span>{v.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
