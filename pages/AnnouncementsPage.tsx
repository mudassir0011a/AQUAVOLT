import React, { useMemo } from 'react';
import { MOCK_ANNOUNCEMENTS, MOCK_DB } from '../data/mockDatabase';
import type { Announcement } from '../types';

const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const AlertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;

const AnnouncementCard: React.FC<{ announcement: Announcement }> = ({ announcement }) => {
    const typeStyles = {
        Water: { icon: '💧', bg: 'bg-cyan-100 dark:bg-cyan-900/50', text: 'text-cyan-800 dark:text-cyan-300' },
        Power: { icon: '⚡', bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-800 dark:text-yellow-300' },
        Civic: { icon: '🏢', bg: 'bg-slate-100 dark:bg-slate-700/50', text: 'text-slate-800 dark:text-slate-300' },
        Health: { icon: '⚕️', bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-300' },
    };
    const style = typeStyles[announcement.type as keyof typeof typeStyles] || typeStyles.Civic;

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md transition-colors duration-300 border border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl ${style.bg}`}>
                    {style.icon}
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                         <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>{announcement.type}</span>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{announcement.date}</p>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{announcement.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">{announcement.description}</p>
                </div>
            </div>
        </div>
    );
};

const LiveAlertCard: React.FC<{ alert: { title: string; location: string; time: string; description: string; } }> = ({ alert }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md transition-colors duration-300 border-l-4 border-amber-500">
         <div className="flex items-start gap-4">
            <div className="text-amber-500 mt-1 flex-shrink-0">
                <AlertIcon />
            </div>
            <div>
                 <p className="text-sm text-slate-500 dark:text-slate-400">{alert.location} &bull; {alert.time}</p>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{alert.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1">{alert.description}</p>
            </div>
        </div>
    </div>
);


const AnnouncementsPage: React.FC = () => {
    const announcements = useMemo(() => 
        [...MOCK_ANNOUNCEMENTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), 
    []);

    const liveAlertsFromDB = useMemo(() => {
        const sortedComplaints = Object.values(MOCK_DB)
            .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());

        const recentActiveComplaints = sortedComplaints
            .filter(c => c.status !== 'resolved')
            .slice(0, 3);

        return recentActiveComplaints.map(complaint => ({
            title: complaint.issue,
            location: complaint.location,
            time: complaint.reportedAt,
            description: `A new ${complaint.type} issue has been reported in this area. Our teams have been notified.`
        }));
    }, []);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold">Announcements & Live Alerts</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Stay updated with official news and real-time community reports.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <BellIcon /> Official Announcements
                    </h2>
                    <div className="space-y-6">
                        {announcements.map((item) => <AnnouncementCard key={item.id} announcement={item} />)}
                    </div>
                </section>
                <section>
                     <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <AlertIcon /> Live Community Alerts
                    </h2>
                     <div className="space-y-6">
                        {liveAlertsFromDB.map((item, index) => <LiveAlertCard key={index} alert={item} />)}
                         {liveAlertsFromDB.length === 0 && (
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg text-center text-slate-500 dark:text-slate-400">
                                No active community alerts right now.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AnnouncementsPage;
