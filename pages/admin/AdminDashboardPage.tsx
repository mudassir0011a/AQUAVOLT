
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MOCK_DB } from '../../data/mockDatabase';
import type { Complaint } from '../../types';

// --- ICONS ---
const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M20 4s-1-1-4-1-5 2-8 2-4-1-4-1M4 20s1 1 4 1 5-2 8-2 4 1 4 1" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;
const ReportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;

// --- SUB-COMPONENTS ---

const StatCard: React.FC<{ title: string; value: number | string; icon: string; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm flex items-center gap-4">
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}1A`, color }}>{icon}</div>
        <div>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">{title}</p>
        </div>
    </div>
);

const QuickActionButton: React.FC<{ icon: React.ReactNode; children: React.ReactNode; to: string; }> = ({ icon, children, to }) => (
    <Link to={to} className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm px-4 py-2 rounded-lg shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700">
        {icon}
        {children}
    </Link>
);

const InteractiveMap: React.FC = () => (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-sm h-full flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Live Area Map</h3>
        <div className="flex-grow rounded-md overflow-hidden bg-slate-200 dark:bg-slate-700">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120645.3142018898!2d72.9902330420707!3d19.08320982542353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c21ae9422607%3A0x8227c693a1055536!2sNavi%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1709911253911!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Map of Navi Mumbai"
            ></iframe>
        </div>
    </div>
);

const ActivityItem: React.FC<{ icon: string; text: React.ReactNode; time: string; color: string }> = ({ icon, text, time, color }) => (
    <div className="flex gap-3">
        <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm`} style={{ backgroundColor: `${color}20`, color }}>{icon}</div>
            <div className="w-px flex-grow bg-slate-200 dark:bg-slate-700"></div>
        </div>
        <div>
            <p className="text-sm text-slate-700 dark:text-slate-300 -mt-1">{text}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{time}</p>
        </div>
    </div>
);

const RecentActivity: React.FC = () => (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-sm h-full">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Recent Activity</h3>
        <div className="space-y-4">
             <ActivityItem icon="✅" text={<>Complaint <b>#ELC-2025-045</b> resolved in Seawoods.</>} time="5m ago" color="#22c55e" />
             <ActivityItem icon="➕" text={<>New complaint <b>#WTR-2025-002</b> submitted for Sanpada.</>} time="2h ago" color="#3b82f6" />
             <ActivityItem icon="👤" text={<>Technician 'R. Sharma' assigned to <b>#WTR-2025-001</b>.</>} time="4h ago" color="#a855f7" />
             <ActivityItem icon="🔥" text={<>Complaint <b>#ELC-2025-046</b> marked as CRITICAL.</>} time="Yesterday" color="#ef4444" />
        </div>
    </div>
);


// --- MAIN DASHBOARD COMPONENT ---

const AdminDashboardPage: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const location = useLocation();

    useEffect(() => {
        // Load fresh data on navigation
        setComplaints(Object.values(MOCK_DB));

        const timer = setInterval(() => setCurrentTime(new Date()), 1000 * 60);

        // Simulate a real-time update for a complaint status
        const realTimeUpdateTimeout = setTimeout(() => {
            if (MOCK_DB['WTR-2025-002']?.status === 'pending') {
                MOCK_DB['WTR-2025-002'].status = 'in-progress';
                setComplaints(Object.values(MOCK_DB));
            }
        }, 5000);

        return () => {
            clearInterval(timer);
            clearTimeout(realTimeUpdateTimeout);
        };
    }, [location.pathname]);

    const totalComplaints = complaints.length;
    const pending = complaints.filter(c => c.status === 'pending').length;
    const waterIssues = complaints.filter(c => c.type === 'water').length;
    const electricityIssues = complaints.filter(c => c.type === 'electricity').length;

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Complaints" value={totalComplaints} icon="📊" color="#3b82f6" />
                <StatCard title="Pending" value={pending} icon="⏳" color="#f59e0b" />
                <StatCard title="Water Issues" value={waterIssues} icon="💧" color="#06b6d4" />
                <StatCard title="Electricity Issues" value={electricityIssues} icon="⚡" color="#facc15" />
            </div>
            
            {/* Quick Actions */}
             <div className="flex flex-wrap items-center gap-4">
                <QuickActionButton to="/admin/announcements" icon={<PlusIcon />}>New Announcement</QuickActionButton>
                <QuickActionButton to="/admin/technicians" icon={<PlusIcon />}>Add Technician</QuickActionButton>
                <QuickActionButton to="/admin/analytics" icon={<ReportIcon />}>Generate Report</QuickActionButton>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-[450px]">
                    <InteractiveMap />
                </div>
                <div className="lg:col-span-1">
                    <RecentActivity />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
