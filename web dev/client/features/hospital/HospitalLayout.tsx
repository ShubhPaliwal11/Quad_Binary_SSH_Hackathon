import { Outlet, Link, useLocation } from "react-router-dom";
import {
    Activity, Home, Users, ClipboardList, FileText,
    TestTube, BedDouble, Settings, Plus, LogOut,
    Siren, Stethoscope, BarChart3, ShieldAlert
} from "lucide-react";

export default function HospitalLayout() {
    const location = useLocation();

    const navigation = [
        { name: "Dashboard", href: "/hospital/dashboard", icon: Home },
        { name: "Ambulance", href: "/hospital/ambulance", icon: Siren },
        { name: "Intake", href: "/hospital/intake", icon: ShieldAlert },
        { name: "Beds", href: "/hospital/beds", icon: BedDouble },
        { name: "Patients", href: "/hospital/patients", icon: Users },
        { name: "Staff", href: "/hospital/staff", icon: Stethoscope },
        { name: "Analytics", href: "/hospital/analytics", icon: BarChart3 },
        { name: "Crisis", href: "/hospital/crisis", icon: Activity },
    ];

    return (
        <div className="flex h-screen bg-[#F3F4F6] text-slate-900 overflow-hidden font-sans">
            {/* Narrow Sidebar */}
            <aside className="w-[72px] bg-white border-r border-slate-200 flex flex-col items-center py-6 z-20 shrink-0 shadow-sm">
                <button className="w-12 h-12 bg-[#E0F2FE] text-[#0EA5E9] rounded-xl flex items-center justify-center mb-10 hover:bg-[#BAE6FD] transition-colors shadow-sm">
                    <Plus className="w-6 h-6 stroke-[2.5]" />
                </button>

                <nav className="flex-1 flex flex-col gap-4 w-full px-2">
                    {navigation.map((item) => {
                        const isActive = location.pathname.startsWith(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center transition-all duration-200 group relative ${isActive
                                    ? "bg-[#EFF6FF] text-blue-600"
                                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                                    }`}
                                title={item.name}
                            >
                                <Icon className={`w-6 h-6 ${isActive ? "stroke-[2.5]" : "stroke-[2]"}`} />
                                {isActive && (
                                    <div className="absolute left-[-8px] w-1 h-6 bg-blue-600 rounded-r-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto flex flex-col items-center gap-6">
                    <button className="text-slate-400 hover:text-red-500 transition-colors">
                        <LogOut className="w-6 h-6" />
                    </button>
                    <div className="relative group cursor-pointer p-0.5 rounded-full border-2 border-slate-100 hover:border-blue-400 transition-colors">
                        <img
                            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100"
                            alt="User"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
