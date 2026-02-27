import React, { useState } from 'react';
import { User, Bell, Shield, Video, Smartphone } from 'lucide-react';

const TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'video', label: 'Video & Audio', icon: Video },
    { id: 'security', label: 'Security', icon: Shield },
];

function ProfileTab() {
    return (
        <div className="settings-section">
            <div className="settings-avatar-row">
                <div className="user-initial-avatar settings-initial-avatar">S</div>
                <div>
                    <button className="btn-secondary">Change Photo</button>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>JPG, PNG up to 5MB</p>
                </div>
            </div>
            <div className="settings-form-grid">
                {[['First Name', 'Sarah'], ['Last Name', 'Jenkins'], ['Specialty', 'Cardiologist'], ['License No.', 'MD-2023-4892'], ['Phone', '+1 555-0001'], ['Email', 'sarah.j@medconsult.com']].map(([label, val]) => (
                    <div key={label} className="form-field">
                        <label className="field-label">{label}</label>
                        <input className="field-input" defaultValue={val} />
                    </div>
                ))}
                <div className="form-field form-field-full">
                    <label className="field-label">Bio / About</label>
                    <textarea className="field-input" rows={3} defaultValue="Cardiologist with 12 years of experience specializing in interventional cardiology and preventive cardiac care." />
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px' }}>Save Profile</button>
            </div>
        </div>
    );
}

function NotificationsTab() {
    const [prefs, setPrefs] = useState({
        newBooking: true,
        patientWaiting: true,
        aiReportReady: true,
        prescription: true,
        smsAlerts: false,
        emailDigest: true,
    });
    const toggle = k => setPrefs(p => ({ ...p, [k]: !p[k] }));
    const items = [
        ['newBooking', 'New patient booking'],
        ['patientWaiting', 'Patient waiting in lobby'],
        ['aiReportReady', 'AI report ready for review'],
        ['prescription', 'Prescription pending approval'],
        ['smsAlerts', 'SMS alerts (to phone)'],
        ['emailDigest', 'Daily email digest'],
    ];
    return (
        <div className="settings-section">
            <h4 className="settings-group-title">Notification Preferences</h4>
            {items.map(([key, label]) => (
                <div key={key} className="settings-toggle-row">
                    <span className="toggle-label">{label}</span>
                    <button
                        onClick={() => toggle(key)}
                        className="settings-toggle-btn"
                        style={{ color: prefs[key] ? 'var(--primary-teal)' : '#ccc' }}
                    >
                        {prefs[key] ? '●  ON' : 'OFF  ○'}
                    </button>
                </div>
            ))}
        </div>
    );
}

function VideoTab() {
    return (
        <div className="settings-section">
            <h4 className="settings-group-title">Video Call Settings</h4>
            {[['Default Camera', 'Built-in FaceTime HD Camera'], ['Default Microphone', 'Built-in Microphone'], ['Default Speaker', 'Built-in Speakers']].map(([label, val]) => (
                <div key={label} className="form-field" style={{ marginBottom: 16 }}>
                    <label className="field-label">{label}</label>
                    <select className="field-input">
                        <option>{val}</option>
                    </select>
                </div>
            ))}
            <div className="settings-toggle-row">
                <span className="toggle-label">Enable noise cancellation</span>
                <button className="settings-toggle-btn" style={{ color: 'var(--primary-teal)' }}>●  ON</button>
            </div>
            <div className="settings-toggle-row">
                <span className="toggle-label">HD Video quality</span>
                <button className="settings-toggle-btn" style={{ color: 'var(--primary-teal)' }}>●  ON</button>
            </div>
        </div>
    );
}

function SecurityTab() {
    return (
        <div className="settings-section">
            <h4 className="settings-group-title">Change Password</h4>
            {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
                <div key={label} className="form-field" style={{ marginBottom: 14 }}>
                    <label className="field-label">{label}</label>
                    <input type="password" className="field-input" placeholder="••••••••" />
                </div>
            ))}
            <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px', marginTop: 8 }}>Update Password</button>

            <h4 className="settings-group-title" style={{ marginTop: 24 }}>Two-Factor Authentication</h4>
            <div className="settings-toggle-row">
                <div>
                    <span className="toggle-label">Enable 2FA</span>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Additional security via authenticator app</p>
                </div>
                <button className="settings-toggle-btn" style={{ color: '#ccc' }}>OFF  ○</button>
            </div>
        </div>
    );
}

const TAB_CONTENT = { profile: ProfileTab, notifications: NotificationsTab, video: VideoTab, security: SecurityTab };

export default function SettingsPage() {
    const [active, setActive] = useState('profile');
    const Content = TAB_CONTENT[active];
    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Settings</h2>
                    <p className="page-subtitle">Manage your account and preferences</p>
                </div>
            </div>
            <div className="settings-layout">
                <div className="glass settings-tabs">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => setActive(id)} className={`settings-tab-btn ${active === id ? 'active' : ''}`}>
                            <Icon size={16} /> {label}
                        </button>
                    ))}
                </div>
                <div className="glass settings-content"><Content /></div>
            </div>
        </div>
    );
}
