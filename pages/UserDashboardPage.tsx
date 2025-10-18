import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOCK_DB } from '../data/mockDatabase';
import type { Complaint } from '../types';
import { useNotification } from '../context/NotificationContext';

const UserStatCard: React.FC<{ title: string; value: string; icon: string; colorClass: string }> = ({ title, value, icon, colorClass }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex items-center gap-4 border-l-4 border-transparent transition-all hover:shadow-lg hover:-translate-y-1" style={{ borderLeftColor: colorClass }}>
        <div className="text-3xl p-3 rounded-lg bg-slate-100 dark:bg-slate-700" style={{ color: colorClass }}>{icon}</div>
        <div>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
        </div>
    </div>
);

const StatusBadge: React.FC<{ status: Complaint['status'] }> = ({ status }) => {
    const statusConfig = {
        'in-progress': { text: 'In Progress', classes: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300' },
        'resolved': { text: 'Resolved', classes: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
        'pending': { text: 'Pending', classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
    };
    const config = statusConfig[status];
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center ${config.classes}`}>
            {config.text}
        </span>
    );
};

// Mock announcements data for the dashboard widget
const announcements = [
    { type: 'Water', title: 'Planned Water Supply Disruption in Vashi', date: 'July 30, 2024' },
    { type: 'Power', title: 'MSEDCL Infrastructure Upgrade - Nerul', date: 'July 29, 2024' },
];

const NotificationOptInBanner: React.FC = () => {
    const { notificationPermission, requestNotificationPermission } = useNotification();

    if (notificationPermission !== 'default') {
        return null; // Don't show if permission is already granted or denied
    }

    return (
        <div className="bg-emerald-50 dark:bg-emerald-900/30 border-l-4 border-emerald-500 p-4 rounded-r-lg animate-fade-in-up flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Get Real-Time Updates</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Enable notifications to know immediately when your complaint status changes.</p>
                </div>
            </div>
            <button onClick={requestNotificationPermission} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-full transition-colors whitespace-nowrap text-sm flex-shrink-0">
                Enable Notifications
            </button>
        </div>
    );
};


const UserDashboardPage: React.FC = () => {
    const { user } = useAuth();
    
    const userComplaints = useMemo(() => {
        if (!user) return [];
        return Object.values(MOCK_DB).filter(c => c.userId === user.identifier);
    }, [user]);

    const totalReports = userComplaints.length;
    const inProgress = userComplaints.filter(c => c.status === 'in-progress').length;
    const resolved = userComplaints.filter(c => c.status === 'resolved').length;
    const pending = userComplaints.filter(c => c.status === 'pending').length;

    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in-up">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">My Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">
                            Welcome back, {user?.name}! Here’s a summary of your activity.
                        </p>
                    </div>
                     <Link to="/report" className="bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-emerald-700 dark:bg-emerald-400 dark:hover:bg-emerald-500 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 inline-flex items-center gap-2 text-base whitespace-nowrap">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        <span>Report a New Issue</span>
                    </Link>
                </div>

                {/* Notification Banner */}
                <NotificationOptInBanner />

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <UserStatCard title="Total Reports" value={String(totalReports)} icon="📊" colorClass="#10b981" />
                    <UserStatCard title="In Progress" value={String(inProgress)} icon="⏳" colorClass="#0ea5e9" />
                    <UserStatCard title="Resolved" value={String(resolved)} icon="✅" colorClass="#22c55e" />
                    <UserStatCard title="Pending Review" value={String(pending)} icon="⚠️" colorClass="#f59e0b" />
                </div>

                {/* Main Content: Complaints Table */}
                <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-md transition-colors duration-300">
                    <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">My Complaint History</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b-2 border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Type</th>
                                    <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Tracking ID</th>
                                    <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Issue Summary</th>
                                    <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-right">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userComplaints.length > 0 ? userComplaints.map(complaint => (
                                    <tr key={complaint.id} className="border-b border-slate-200 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="p-4 text-2xl">
                                            {complaint.type === 'water' ? '💧' : '⚡'}
                                        </td>
                                        <td className="p-4 font-mono text-sm text-slate-500 dark:text-slate-400">{complaint.id}</td>
                                        <td className="p-4 text-slate-800 dark:text-slate-200 font-medium">{complaint.issue}</td>
                                        <td className="p-4"><StatusBadge status={complaint.status} /></td>
                                        <td className="p-4 text-right">
                                            <Link to={`/track?id=${complaint.id}`} className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                                                Track
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-12 text-slate-500 dark:text-slate-400">
                                            You haven't reported any issues yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                 {/* Announcements Section */}
                 <div className="bg-slate-50 dark:bg-slate-800/50 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">Latest Updates</h2>
                     <div className="space-y-4">
                        {announcements.map((item, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-xl bg-white dark:bg-slate-700 shadow-sm">
                                    {item.type === 'Water' ? '💧' : '⚡'}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-700 dark:text-slate-200">{item.title}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.date}</p>
                                </div>
                            </div>
                        ))}
                         <Link to="/announcements" className="inline-block text-emerald-600 dark:text-emerald-400 font-semibold hover:underline mt-2">
                            View All Announcements →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboardPage;