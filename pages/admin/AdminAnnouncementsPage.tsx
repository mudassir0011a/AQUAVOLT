import React, { useState } from 'react';
import { MOCK_ANNOUNCEMENTS } from '../../data/mockDatabase';
import { useNotification } from '../../context/NotificationContext';
import type { Announcement } from '../../types';

const AnnouncementCard: React.FC<{ announcement: Announcement }> = ({ announcement }) => {
    const typeStyles = {
        Water: { icon: '💧', border: 'border-cyan-500' },
        Power: { icon: '⚡', border: 'border-yellow-500' },
        Civic: { icon: '🏢', border: 'border-slate-500' },
        Health: { icon: '⚕️', border: 'border-green-500' },
    };
    const style = typeStyles[announcement.type as keyof typeof typeStyles];

    return (
        <div className={`bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border-l-4 ${style.border}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">{announcement.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{announcement.date} &bull; {announcement.type}</p>
                </div>
                <div className="text-2xl">{style.icon}</div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{announcement.description}</p>
        </div>
    );
};

const AdminAnnouncementsPage: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>(() => 
        [...MOCK_ANNOUNCEMENTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
    const { showToast, sendPushNotification } = useNotification();
    
    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'Water' | 'Power' | 'Civic' | 'Health'>('Civic');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description) {
            showToast('Title and description are required.', 'error');
            return;
        }
        
        const newAnnouncement: Announcement = {
            id: `ANNC${Date.now()}`,
            title,
            description,
            type,
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        };

        // Mutate shared data source to simulate database update
        MOCK_ANNOUNCEMENTS.unshift(newAnnouncement);
        
        // Update local state to re-render UI
        setAnnouncements(prev => [newAnnouncement, ...prev]);

        showToast('Announcement posted successfully!', 'success');

        // Send push notification to users
        sendPushNotification(`New Announcement: ${title}`, {
            body: description,
        });
        
        // Reset form
        setTitle('');
        setDescription('');
        setType('Civic');
    };

    return (
         <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Announcement Form */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm h-fit">
                    <h2 className="text-xl font-bold mb-4">Create New Announcement</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                         <div>
                            <label htmlFor="ann-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                            <input id="ann-title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="ann-desc" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                            <textarea id="ann-desc" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md" />
                        </div>
                        <div>
                             <label htmlFor="ann-type" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                            <select id="ann-type" value={type} onChange={e => setType(e.target.value as any)} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md">
                                <option>Civic</option>
                                <option>Water</option>
                                <option>Power</option>
                                <option>Health</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-emerald-600 text-white font-semibold py-2 rounded-md hover:bg-emerald-700">
                            Post Announcement
                        </button>
                    </form>
                </div>

                {/* Existing Announcements */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4">Posted Announcements</h2>
                    <div className="space-y-4">
                        {announcements.map(ann => (
                            <AnnouncementCard key={ann.id} announcement={ann} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminAnnouncementsPage;
