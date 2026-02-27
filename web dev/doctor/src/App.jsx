import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Users, Clock, Calendar, ClipboardCheck } from 'lucide-react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CalendarView from './components/CalendarView';
import AppointmentsList from './components/AppointmentsList';
import PatientPreview from './components/PatientPreview';

import AppointmentsPage from './pages/AppointmentsPage';
import CalendarPage from './pages/CalendarPage';
import PatientsPage from './pages/PatientsPage';
import PrescriptionsPage from './pages/PrescriptionsPage';
import SchedulePage from './pages/SchedulePage';
import SettingsPage from './pages/SettingsPage';

import './index.css';

// ─── Summary Card ──────────────────────────────────────────────────────────────
const SummaryCard = ({ icon: Icon, title, value, footer, color, footerColor }) => (
  <div className="glass summary-card">
    <div className="card-icon" style={{ backgroundColor: color + '22', color }}>
      <Icon size={22} />
    </div>
    <span className="card-title">{title}</span>
    <div className="card-value">{value}</div>
    {footer && <span className="card-footer" style={{ color: footerColor || 'var(--text-secondary)' }}>{footer}</span>}
  </div>
);

// ─── Pending Review Card ───────────────────────────────────────────────────────
const PendingReviewItem = ({ name, time, avatar, urgency }) => (
  <div className={`glass review-card ${urgency === 'urgent' ? 'review-urgent' : ''}`}>
    <div className="review-info">
      <img src={avatar} alt={name} className="patient-avatar" />
      <div>
        <h4 style={{ fontSize: '15px', fontWeight: 600 }}>{name}</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '2px 0' }}>Consultation: {time}</p>
        <span className="status-badge status-ai">AI DRAFT READY</span>
      </div>
    </div>
    <button className="btn-primary">Review &amp; Approve</button>
  </div>
);

// ─── Countdown Hook ─────────────────────────────────────────────────────────────
function useCountdown(targetMinutes) {
  const [remaining, setRemaining] = useState(targetMinutes * 60);
  useEffect(() => {
    const t = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(remaining / 60).toString().padStart(2, '0');
  const s = (remaining % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ─── Dashboard Page ────────────────────────────────────────────────────────────
function DashboardPage({ onSelectAppt }) {
  const countdown = useCountdown(17);

  return (
    <>
      {/* ── Summary Cards ── */}
      <div className="widgets-grid">
        <SummaryCard icon={Clock} title="Today's Appointments" value="18" footer="4 calls remaining" color="var(--primary-teal)" />
        <SummaryCard icon={Users} title="Patients Waiting Now" value="03" footer="Est. wait: 12 min" color="#ffa726" footerColor="#e65100" />
        <SummaryCard icon={Calendar} title="Next Appointment" value="John Smith"
          footer={<span>Starts in <span className="countdown">{countdown}</span></span>} color="#42a5f5" />
        <SummaryCard icon={ClipboardCheck} title="Pending Reviews" value="07" footer="2 urgent reports" color="#ef5350" footerColor="#c62828" />
      </div>

      {/* ── Pending AI Reviews ── */}
      <div className="pending-reviews-section">
        <div className="section-header">
          <h3>Pending AI Reviews <span className="section-badge">7</span></h3>
          <button className="link-btn">View all reports</button>
        </div>
        <div className="review-cards-row">
          <PendingReviewItem name="Emily Henderson" time="10:30 AM" avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" urgency="urgent" />
          <PendingReviewItem name="Markus Wright" time="09:15 AM" avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" />
          <PendingReviewItem name="Aisha Patel" time="12:00 PM" avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" />
        </div>
      </div>

      {/* ── Calendar + Appointments ── */}
      <div className="dashboard-layout">
        <div className="glass calendar-container">
          <CalendarView onSlotClick={slot => onSelectAppt({ id: slot.id, name: slot.patient, time: `${slot.hour}:00`, status: slot.status, reason: 'See full details' })} />
        </div>
        <div className="glass appointments-side-list">
          <AppointmentsList onViewDetails={onSelectAppt} />
        </div>
      </div>
    </>
  );
}

// ─── App Shell ─────────────────────────────────────────────────────────────────
export default function App() {
  const [selectedAppt, setSelectedAppt] = useState(null);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <Routes>
          <Route path="/" element={<DashboardPage onSelectAppt={setSelectedAppt} />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/calendar" element={<CalendarPage onSelectAppt={setSelectedAppt} />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/prescriptions" element={<PrescriptionsPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
      <PatientPreview appointment={selectedAppt} onClose={() => setSelectedAppt(null)} />
    </div>
  );
}
