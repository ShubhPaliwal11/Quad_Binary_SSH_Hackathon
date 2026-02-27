import React from 'react';
import { X, AlertTriangle, FileText, Video, Clock } from 'lucide-react';

const MOCK_PATIENTS = {
    1: {
        name: 'Priya Kapoor', age: 54, gender: 'Female', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
        reason: 'Follow-up – Hypertension',
        symptoms: ['Occasional headaches', 'Mild dizziness', 'Fatigue in mornings'],
        allergies: ['Penicillin', 'Aspirin'],
        lastVisit: 'Jan 10, 2026',
        lastSummary: 'BP recorded at 145/92. Increased lisinopril dosage. Advised reduced salt intake and daily walks.',
        reports: [
            { name: 'ECG Report.pdf', type: 'pdf', date: 'Feb 20, 2026' },
            { name: 'Blood Panel.pdf', type: 'pdf', date: 'Feb 22, 2026' },
        ],
    },
    2: {
        name: 'Rajesh Singh', age: 41, gender: 'Male', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
        reason: 'Chest pain evaluation',
        symptoms: ['Sharp chest pain (left side)', 'Shortness of breath on exertion', 'Occasional palpitations'],
        allergies: ['Sulfonamides'],
        lastVisit: 'Dec 5, 2025',
        lastSummary: 'Stress ECG performed, within normal limits. Troponin levels normal. Advised follow-up in 6 weeks.',
        reports: [
            { name: 'Stress ECG.pdf', type: 'pdf', date: 'Dec 5, 2025' },
        ],
    },
    3: {
        name: 'Amit Patel', age: 29, gender: 'Male', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
        reason: 'Annual health checkup',
        symptoms: ['No acute complaints'],
        allergies: [],
        lastVisit: 'Feb 24, 2025',
        lastSummary: 'Annual checkup. All vitals normal. BMI 23.4. Cholesterol borderline – dietary counseling provided.',
        reports: [
            { name: 'Full Blood Count.pdf', type: 'pdf', date: 'Feb 24, 2025' },
            { name: 'Urine Analysis.pdf', type: 'pdf', date: 'Feb 24, 2025' },
        ],
    },
    4: {
        name: 'Aisha Patel', age: 67, gender: 'Female', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
        reason: 'Diabetes review',
        symptoms: ['Increased thirst', 'Frequent urination', 'Blurred vision (intermittent)'],
        allergies: ['Metformin (GI intolerance)'],
        lastVisit: 'Jan 28, 2026',
        lastSummary: 'HbA1c at 8.2%. Adjusted insulin dosage. Referred to dietician. Foot exam normal.',
        reports: [
            { name: 'HbA1c Report.pdf', type: 'pdf', date: 'Jan 26, 2026' },
        ],
    },
};

export default function PatientPreview({ appointment, onClose }) {
    if (!appointment) return null;
    const patient = MOCK_PATIENTS[appointment.id] || MOCK_PATIENTS[1];
    const canJoin = appointment.status === 'waiting' || appointment.status === 'in-progress';

    return (
        <>
            <div className="drawer-backdrop" onClick={onClose} />
            <div className="patient-drawer">
                <div className="drawer-header">
                    <h3>Patient Details</h3>
                    <button className="icon-btn close-btn" onClick={onClose}><X size={18} /></button>
                </div>

                {/* Profile */}
                <div className="patient-profile-card glass">
                    <img src={patient.avatar} alt={patient.name} className="patient-large-avatar" />
                    <div>
                        <h2 className="patient-name-lg">{patient.name}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '4px 0' }}>
                            {patient.age} yrs · {patient.gender}
                        </p>
                        <p style={{ color: 'var(--primary-teal)', fontSize: '13px', fontWeight: 600 }}>{appointment.reason}</p>
                    </div>
                    {canJoin && (
                        <button className="btn-join btn-join-lg">
                            <Video size={16} /> Join Call
                        </button>
                    )}
                </div>

                {/* Previous Visit */}
                <div className="drawer-section">
                    <div className="drawer-section-title"><Clock size={14} /> Last Visit: {patient.lastVisit}</div>
                    <p className="drawer-text">{patient.lastSummary}</p>
                </div>

                {/* Symptoms */}
                <div className="drawer-section">
                    <div className="drawer-section-title">Current Symptoms</div>
                    <ul className="symptom-list">
                        {patient.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>

                {/* Allergies */}
                {patient.allergies.length > 0 && (
                    <div className="drawer-section allergy-section">
                        <div className="drawer-section-title allergy-title">
                            <AlertTriangle size={14} color="#e65100" /> Allergies
                        </div>
                        <div className="allergy-tags">
                            {patient.allergies.map((a, i) => (
                                <span key={i} className="allergy-tag">{a}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reports */}
                <div className="drawer-section">
                    <div className="drawer-section-title">Uploaded Reports</div>
                    <div className="reports-list">
                        {patient.reports.map((r, i) => (
                            <div key={i} className="report-item glass">
                                <FileText size={20} color="var(--primary-teal)" />
                                <div>
                                    <p className="report-name">{r.name}</p>
                                    <p className="report-date">{r.date}</p>
                                </div>
                                <button className="btn-secondary btn-sm">View</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
