import React, { useState } from "react";
import {
    BarChart as BarChartIcon, TrendingUp, DollarSign, Download,
    Calendar, Activity, Users
} from "lucide-react";
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

const admissionsData = [
    { month: 'Jan', admissions: 120, discharges: 105 },
    { month: 'Feb', admissions: 145, discharges: 130 },
    { month: 'Mar', admissions: 160, discharges: 142 },
    { month: 'Apr', admissions: 130, discharges: 125 },
    { month: 'May', admissions: 175, discharges: 160 },
    { month: 'Jun', admissions: 190, discharges: 178 },
];

const revenueData = [
    { week: 'W1', revenue: 8.2 },
    { week: 'W2', revenue: 7.5 },
    { week: 'W3', revenue: 9.1 },
    { week: 'W4', revenue: 8.8 },
    { week: 'W5', revenue: 10.2 },
    { week: 'W6', revenue: 9.4 },
];

const deptData = [
    { name: 'Cardio', value: 45, fill: '#6366f1' },
    { name: 'Neuro', value: 80, fill: '#8b5cf6' },
    { name: 'Ortho', value: 65, fill: '#a78bfa' },
    { name: 'Emergency', value: 90, fill: '#ef4444' },
    { name: 'Pediatrics', value: 30, fill: '#06b6d4' },
    { name: 'Oncology', value: 55, fill: '#f97316' },
    { name: 'General', value: 70, fill: '#10b981' },
];

const ambUtilData = [
    { hour: '6AM', utilization: 40 },
    { hour: '8AM', utilization: 65 },
    { hour: '10AM', utilization: 88 },
    { hour: '12PM', utilization: 92 },
    { hour: '2PM', utilization: 85 },
    { hour: '4PM', utilization: 72 },
    { hour: '6PM', utilization: 78 },
    { hour: '8PM', utilization: 60 },
    { hour: '10PM', utilization: 45 },
];

export default function AnalyticsDashboard() {
    const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

    const exportCSV = () => {
        const headers = 'Month,Admissions,Discharges\n';
        const rows = admissionsData.map(d => `${d.month},${d.admissions},${d.discharges}`).join('\n');
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'analytics_report.csv'; a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6 lg:p-8 h-full overflow-y-auto bg-[#F3F4F6] animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-4 shadow-sm border border-indigo-200">
                        <BarChartIcon className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Hospital Analytics</h1>
                    <p className="text-slate-500 text-lg">Performance metrics, trends, and department insights</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        {(['week', 'month', 'year'] as const).map(p => (
                            <button key={p} onClick={() => setPeriod(p)}
                                className={`px-4 py-2 text-xs font-bold capitalize transition-colors ${period === p ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                            >{p}</button>
                        ))}
                    </div>
                    <button onClick={exportCSV} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors">
                        <Download className="w-4 h-4" /> CSV
                    </button>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                <MiniKPI icon={<DollarSign />} label="Monthly Revenue" value="₹52.4L" change="+12.5%" positive />
                <MiniKPI icon={<Activity />} label="Ambulance Utilization" value="92%" change="Peak: 10AM-2PM" positive />
                <MiniKPI icon={<Users />} label="Avg. Length of Stay" value="3.2 days" change="-0.4 days" positive />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">

                {/* Admissions Trend */}
                <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-lg shadow-slate-200/50">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">Admissions vs Discharges</h2>
                    <p className="text-xs text-slate-400 mb-6">Monthly trend comparison</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={admissionsData} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, fontWeight: 600 }} cursor={{ fill: '#f8fafc' }} />
                            <Bar dataKey="admissions" fill="#6366f1" radius={[6, 6, 0, 0]} name="Admissions" />
                            <Bar dataKey="discharges" fill="#a5b4fc" radius={[6, 6, 0, 0]} name="Discharges" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue Trend */}
                <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-lg shadow-slate-200/50">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">Revenue Trend</h2>
                    <p className="text-xs text-slate-400 mb-6">Weekly revenue in ₹ Lakhs</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, fontWeight: 600 }} />
                            <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fill="url(#revenueGradient)" name="Revenue (₹L)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Department Performance */}
                <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-lg shadow-slate-200/50">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">Department Performance</h2>
                    <p className="text-xs text-slate-400 mb-6">Admissions by department</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={deptData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                            <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 700 }} axisLine={false} tickLine={false} width={80} />
                            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, fontWeight: 600 }} cursor={{ fill: '#f8fafc' }} />
                            <Bar dataKey="value" radius={[0, 6, 6, 0]} name="Admissions">
                                {deptData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Ambulance Utilization */}
                <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-lg shadow-slate-200/50">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">Ambulance Utilization</h2>
                    <p className="text-xs text-slate-400 mb-6">Fleet utilization by hour</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={ambUtilData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, fontWeight: 600 }} />
                            <Line type="monotone" dataKey="utilization" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }} name="Utilization %" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

function MiniKPI({ icon, label, value, change, positive }: {
    icon: React.ReactNode, label: string, value: string, change: string, positive: boolean
}) {
    return (
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-lg shadow-slate-200/50">
            <div className="flex justify-between items-start mb-3">
                <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-600">
                    {icon}
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${positive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                    {positive && <TrendingUp className="w-3 h-3" />}
                    {change}
                </span>
            </div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{label}</p>
            <p className="text-2xl font-black text-slate-900">{value}</p>
        </div>
    );
}
