import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Clock, Calendar, Users, ClipboardCheck, CheckCircle2, Settings,
    ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
    { icon: Clock, label: 'Appointments', to: '/appointments' },
    { icon: Calendar, label: 'Calendar', to: '/calendar' },
    { icon: Users, label: 'Patients', to: '/patients' },
    { icon: ClipboardCheck, label: 'Prescriptions', to: '/prescriptions', badge: 12 },
    { icon: CheckCircle2, label: 'Schedule', to: '/schedule' },
    { icon: Settings, label: 'Settings', to: '/settings' },
];

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    return (
        <aside className={`floating-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Logo */}
            <div className="sidebar-logo-section">
                <div className="sidebar-logo-icon">⚕</div>
                {!isCollapsed && <span className="sidebar-logo-text">MedConsult</span>}
            </div>

            {/* Collapse Toggle */}
            <button className="sidebar-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
                {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            </button>

            {/* Nav Links */}
            <nav className="sidebar-nav">
                {NAV_ITEMS.map(({ icon: Icon, label, to, badge }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        className={({ isActive }) =>
                            `sidebar-nav-item ${isActive ? 'active' : ''} ${isCollapsed ? 'icon-only' : ''}`
                        }
                        title={isCollapsed ? label : undefined}
                    >
                        <div className={`sidebar-nav-icon-wrapper ${location.pathname === to || (to !== '/' && location.pathname.startsWith(to)) ? 'active' : ''}`}>
                            <Icon size={18} />
                        </div>
                        {!isCollapsed && <span className="sidebar-nav-label">{label}</span>}
                        {badge && !isCollapsed && <span className="sidebar-nav-badge">{badge}</span>}
                        {badge && isCollapsed && (
                            <span className="sidebar-badge-dot">{badge > 9 ? '9+' : badge}</span>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Doctor Profile */}
            <div className="sidebar-profile">
                <div className="sidebar-avatar">A</div>
                {!isCollapsed && (
                    <div className="sidebar-profile-info">
                        <p className="sidebar-doc-name">Dr. Aditi Sharma</p>
                        <p className="sidebar-doc-spec">Cardiologist</p>
                    </div>
                )}
            </div>
        </aside>
    );
}
