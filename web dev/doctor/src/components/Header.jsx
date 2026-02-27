import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, Clock, FileText, X, User, Settings, LogOut } from 'lucide-react';

const NOTIFICATIONS = [
    { id: 1, type: 'ai', icon: FileText, title: 'AI Report Ready', body: "Priya Kapoor's consultation report is ready for review.", time: '2 min ago', unread: true },
    { id: 2, type: 'waiting', icon: Clock, title: 'Patient Waiting', body: 'Amit Patel has joined the waiting room for his 11:00 AM slot.', time: '5 min ago', unread: true },
    { id: 3, type: 'ai', icon: FileText, title: 'AI Report Ready', body: "Aisha Patel's diabetes review report is ready for approval.", time: '18 min ago', unread: false },
    { id: 4, type: 'approved', icon: CheckCircle2, title: 'Prescription Approved', body: 'Levothyroxine prescription for Priya Sharma was countersigned.', time: '1 hr ago', unread: false },
];

const TYPE_COLORS = {
    ai: { bg: '#e1f5fe', color: '#0277bd' },
    waiting: { bg: '#fff8e1', color: '#e65100' },
    approved: { bg: '#e8f5e9', color: '#2e7d32' },
};

export default function Header() {
    const navigate = useNavigate();
    const [now, setNow] = useState(new Date());
    const [showNotifs, setShowNotifs] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [notifs, setNotifs] = useState(NOTIFICATIONS);
    const notifRef = useRef(null);
    const profileRef = useRef(null);

    const goTo = (path) => { setShowProfile(false); navigate(path); };
    const handleLogout = () => {
        setShowProfile(false);
        if (window.confirm('Are you sure you want to log out?')) {
            alert('Logged out. (Connect to your auth system here.)');
        }
    };

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(t);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
            if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const greet = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';
    const unreadCount = notifs.filter(n => n.unread).length;
    const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, unread: false })));
    const dismiss = (id) => setNotifs(prev => prev.filter(n => n.id !== id));

    return (
        <header className="header">
            <div className="header-left">
                <p className="header-greeting">{greet},</p>
                <h1 className="header-title">Dr. Aditi Sharma 👋</h1>
            </div>

            <div className="header-right">

                {/* ── Notification Bell ── */}
                <div className="notif-wrapper" ref={notifRef}>
                    <button
                        className="icon-btn notification-btn"
                        onClick={() => { setShowNotifs(v => !v); setShowProfile(false); }}
                        aria-label="Notifications"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                    </button>

                    {showNotifs && (
                        <div className="notif-dropdown">
                            <div className="notif-dropdown-header">
                                <span className="notif-dropdown-title">Notifications</span>
                                {unreadCount > 0 && (
                                    <button className="link-btn" style={{ fontSize: 12 }} onClick={markAllRead}>
                                        Mark all read
                                    </button>
                                )}
                            </div>
                            <div className="notif-list">
                                {notifs.length === 0 && <div className="notif-empty">No notifications</div>}
                                {notifs.map(n => {
                                    const Icon = n.icon;
                                    const col = TYPE_COLORS[n.type];
                                    return (
                                        <div key={n.id} className={`notif-item ${n.unread ? 'notif-unread' : ''}`}>
                                            <div className="notif-icon" style={{ background: col.bg, color: col.color }}>
                                                <Icon size={15} />
                                            </div>
                                            <div className="notif-body">
                                                <p className="notif-title">{n.title}</p>
                                                <p className="notif-text">{n.body}</p>
                                                <p className="notif-time">{n.time}</p>
                                            </div>
                                            <button className="notif-dismiss" onClick={() => dismiss(n.id)} aria-label="Dismiss">
                                                <X size={13} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                            {notifs.length > 0 && (
                                <div className="notif-footer">
                                    <button className="link-btn" style={{ fontSize: 13, width: '100%', textAlign: 'center' }}>
                                        View all activity
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Profile Avatar + Dropdown ── */}
                <div className="profile-popup-wrapper" ref={profileRef}>
                    <button
                        className="user-initial-avatar"
                        onClick={() => { setShowProfile(v => !v); setShowNotifs(false); }}
                        aria-label="Profile menu"
                    >
                        A
                    </button>

                    {showProfile && (
                        <div className="profile-dropdown">
                            <div className="profile-dropdown-top">
                                <div className="user-initial-avatar" style={{ cursor: 'default', width: 44, height: 44, fontSize: 19 }}>A</div>
                                <div>
                                    <p className="pd-name">Dr. Aditi Sharma</p>
                                    <p className="pd-spec">Cardiologist · MD-2023-4892</p>
                                </div>
                            </div>
                            <hr className="pd-divider" />
                            <button className="pd-item" onClick={() => goTo('/settings')}><User size={14} style={{ marginRight: 8 }} />View Profile</button>
                            <button className="pd-item" onClick={() => goTo('/settings')}><Settings size={14} style={{ marginRight: 8 }} />Settings</button>
                            <hr className="pd-divider" />
                            <button className="pd-item pd-logout" onClick={handleLogout}><LogOut size={14} style={{ marginRight: 8 }} />Log out</button>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
}
