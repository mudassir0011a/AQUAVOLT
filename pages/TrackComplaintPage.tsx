import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import type { Complaint, TimelineEvent, Task } from '../types';
import { MOCK_DB } from '../data/mockDatabase';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { mockTasks } from '../data/mockAdminData';
import { technicians } from '../data/mockAdminData';

const StatusBadge: React.FC<{ status: Complaint['status'] }> = ({ status }) => {
    const statusConfig = {
        'in-progress': { text: 'In Progress', icon: '⏰', classes: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300' },
        'resolved': { text: 'Resolved', icon: '✅', classes: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
        'pending': { text: 'Pending', icon: '⚠️', classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
    };
    const config = statusConfig[status];
    return (
        <span className={`px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2 ${config.classes}`}>
            {config.icon} {config.text}
        </span>
    );
};

const TimelineItem: React.FC<{ item: TimelineEvent, isLast: boolean }> = ({ item, isLast }) => (
    <div className="flex gap-4">
        <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.completed ? 'bg-green-500 text-white' : 'bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300'}`}>
                <span className="text-xl">{item.completed ? '✅' : '⏰'}</span>
            </div>
            {!isLast && <div className={`w-px flex-grow ${item.completed ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>}
        </div>
        <div className="flex-1 pb-8">
            <p className={`font-semibold ${item.completed ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>{item.status}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{item.time}</p>
        </div>
    </div>
);


const AdminActions: React.FC<{ complaint: Complaint; setComplaint: React.Dispatch<React.SetStateAction<Complaint | null>> }> = ({ complaint, setComplaint }) => {
    const { showToast, sendPushNotification } = useNotification();
    const [loading, setLoading] = useState(false);

    const handleStatusUpdate = (newStatus: 'resolved' | 'in-progress') => {
        setLoading(true);
        setTimeout(() => {
            const now = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
            let updatedComplaint = { ...complaint, status: newStatus };
            let updatedTimeline = [...complaint.timeline];

            if (newStatus === 'resolved') {
                const resolvedIndex = updatedTimeline.findIndex(e => e.status === 'Resolved');
                if (resolvedIndex !== -1) {
                    updatedTimeline[resolvedIndex] = { ...updatedTimeline[resolvedIndex], time: now, completed: true };
                }
            } else if (newStatus === 'in-progress') {
                const resolvedIndex = updatedTimeline.findIndex(e => e.status === 'Resolved');
                if (resolvedIndex !== -1) {
                    updatedTimeline[resolvedIndex] = { ...updatedTimeline[resolvedIndex], time: 'Pending', completed: false };
                }
                updatedTimeline.push({ status: 'Re-opened by Admin', time: now, completed: true });
            }

            updatedComplaint.timeline = updatedTimeline;
            MOCK_DB[complaint.id] = updatedComplaint;
            setComplaint(updatedComplaint);
            showToast(`Status updated to '${newStatus}'.`, 'success');
            
            // Send push notification
            sendPushNotification('Complaint Status Updated!', {
                body: `Your complaint #${complaint.id} has been marked as "${newStatus}".`
            });

            setLoading(false);
        }, 500);
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Admin Actions</h3>
            <div className="flex flex-col sm:flex-row gap-4">
                {complaint.status !== 'resolved' && (
                    <button onClick={() => handleStatusUpdate('resolved')} disabled={loading} className="bg-green-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-slate-400">
                        {loading ? 'Updating...' : 'Mark as Resolved'}
                    </button>
                )}
                {complaint.status === 'resolved' && (
                    <button onClick={() => handleStatusUpdate('in-progress')} disabled={loading} className="bg-amber-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-amber-700 disabled:bg-slate-400">
                        {loading ? 'Re-opening...' : 'Re-open Issue'}
                    </button>
                )}
            </div>
        </div>
    );
};

const UserActions: React.FC<{ complaint: Complaint; setComplaint: React.Dispatch<React.SetStateAction<Complaint | null>> }> = ({ complaint, setComplaint }) => {
    const { showToast } = useNotification();
    const [loading, setLoading] = useState(false);

    const handleReportDiscrepancy = () => {
        setLoading(true);
        setTimeout(() => {
            const now = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
            const updatedComplaint = { ...complaint, status: 'in-progress' as const };
            const updatedTimeline = [...complaint.timeline];

            const resolvedIndex = updatedTimeline.findIndex(e => e.status === 'Resolved');
            if (resolvedIndex !== -1) {
                updatedTimeline[resolvedIndex] = { ...updatedTimeline[resolvedIndex], time: 'Pending', completed: false };
            }
            updatedTimeline.push({ status: 'Discrepancy Reported', time: now, completed: true });

            updatedComplaint.timeline = updatedTimeline;
            MOCK_DB[complaint.id] = updatedComplaint;
            setComplaint(updatedComplaint);
            showToast('Discrepancy reported. The issue has been re-opened.', 'info');
            setLoading(false);
        }, 500);
    };

    return (
        <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 p-6 rounded-r-lg mt-6">
            <h3 className="font-bold text-amber-800 dark:text-amber-300">Is the issue still unresolved?</h3>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1 mb-4">If the problem persists, please let us know so we can re-investigate.</p>
            <button onClick={handleReportDiscrepancy} disabled={loading} className="bg-amber-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-amber-700 disabled:bg-slate-400">
                {loading ? 'Submitting...' : 'Report Discrepancy'}
            </button>
        </div>
    );
};

const AssociatedTasks: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
    const getTechnicianName = (id: string) => technicians.find(t => t.id === id)?.name || 'Unknown';

    const getTaskStatus = (dueDateStr: string): { text: string; classes: string } => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(dueDateStr + 'T00:00:00');
        if (dueDate < today) {
            return { text: 'Overdue', classes: 'text-red-600 dark:text-red-400 font-semibold' };
        }
        if (dueDate.getTime() === today.getTime()) {
            return { text: 'Due Today', classes: 'text-amber-600 dark:text-amber-400 font-semibold' };
        }
        return { text: 'Upcoming', classes: 'text-slate-500 dark:text-slate-400' };
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Associated Tasks</h3>
            <div className="space-y-4">
                {tasks.map(task => (
                    <div key={task.id} className="p-4 rounded-md bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{task.title}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm mt-1">
                            <span>Assigned to: <strong>{getTechnicianName(task.assignedTo)}</strong></span>
                            <span className={getTaskStatus(task.dueDate).classes}>
                                Due: {new Date(task.dueDate + 'T00:00:00').toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PhotoModal: React.FC<{ isOpen: boolean; onClose: () => void; complaint: Complaint | null }> = ({ isOpen, onClose, complaint }) => {
    if (!isOpen || !complaint) return null;

    const imageUrl = "https://media.istockphoto.com/id/178821937/photo/water-pipe-burst.jpg?s=612x612&w=0&k=20&c=2s-5d55-1Q_2WST0JkDidO0551B5d_pW9xxo0JmE=";

    return (
        <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in"
            aria-labelledby="photo-modal-title"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl m-4 transform transition-all animate-fade-in-up flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100" id="photo-modal-title">
                        Photo for {complaint.id}
                    </h3>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Close photo viewer">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-4 overflow-y-auto">
                    <img src={imageUrl} alt={`Attached photo for complaint ${complaint.id}`} className="w-full h-auto object-contain rounded-md max-h-[70vh]" />
                </div>
            </div>
        </div>
    );
};

const TrackComplaintPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { user } = useAuth();
    const [trackingId, setTrackingId] = useState(searchParams.get('id') || '');
    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [error, setError] = useState('');
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

    useEffect(() => {
        const idFromUrl = searchParams.get('id');
        if (idFromUrl) {
            const upperId = idFromUrl.toUpperCase();
            const complaintData = MOCK_DB[upperId];
            
            if (complaintData) {
                setComplaint(complaintData);
                setError('');
            } else {
                setError('No complaint found with this Tracking ID. Please check the ID and try again.');
                setComplaint(null);
            }
        } else {
            setComplaint(null);
        }
    }, [searchParams]);
    
    const handleSearchClick = () => {
        if (trackingId) {
            setSearchParams({ id: trackingId });
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearchClick();
        }
    };
    
    const associatedTasks = useMemo(() => {
        if (!complaint) return [];
        return mockTasks.filter(task => task.complaintId === complaint.id);
    }, [complaint]);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto space-y-8">
                 {user?.type === 'admin' ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                         <h1 className="text-3xl font-bold">Complaint Details</h1>
                         <Link to="/admin/complaints" className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Back to Complaints List
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="text-center">
                            <h1 className="text-4xl font-bold">Track Your Complaint</h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-2">Enter your tracking ID to view the complaint status.</p>
                        </div>
                         <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md transition-colors duration-300">
                            <label htmlFor="trackingId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tracking ID</label>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    id="trackingId"
                                    type="text"
                                    placeholder="e.g., WTR-2025-001"
                                    value={trackingId}
                                    onChange={(e) => setTrackingId(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="flex-grow w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                />
                                <button onClick={handleSearchClick} className="bg-emerald-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-emerald-700 dark:bg-emerald-400 dark:hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                                    Search
                                </button>
                            </div>
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                             <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                You received this ID via SMS/Email after reporting the issue.
                            </p>
                        </div>
                    </>
                )}

                {complaint && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md transition-colors duration-300">
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
                                <div className="flex items-start gap-4">
                                    <div className={`p-4 rounded-lg ${complaint.type === 'water' ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50' : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50'}`}>
                                        <span className="text-3xl">{complaint.type === 'water' ? '💧' : '⚡'}</span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{complaint.id}</h2>
                                        <p className="text-slate-600 dark:text-slate-400">{complaint.issue}</p>
                                    </div>
                                </div>
                                <StatusBadge status={complaint.status} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoCard icon="📍" label="Location" value={complaint.location} />
                                <InfoCard icon="📅" label="Reported At" value={complaint.reportedAt} />
                                <InfoCard icon="👤" label="Assigned Team" value={complaint.assignedTeam} />
                                <InfoCard icon="⏰" label="Est. Resolution" value={complaint.estimatedResolution} />
                                {user?.type === 'admin' && (
                                    <InfoCard icon="📞" label="Reported By (Phone)" value={complaint.userId} />
                                )}
                            </div>
                            {complaint.hasPhoto && (
                                <div className="mt-4">
                                    <button
                                        onClick={() => setIsPhotoModalOpen(true)}
                                        className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-300 font-medium text-slate-800 dark:text-slate-200"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        View Attached Photo
                                    </button>
                                </div>
                            )}
                            {user?.type === 'user' && user.identifier === complaint.userId && complaint.status === 'resolved' && (
                                <UserActions complaint={complaint} setComplaint={setComplaint} />
                            )}
                        </div>

                        {user?.type === 'admin' && associatedTasks.length > 0 && (
                           <AssociatedTasks tasks={associatedTasks} />
                        )}

                        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md transition-colors duration-300">
                            <h3 className="text-xl font-bold mb-6">Status Timeline</h3>
                            <div>
                                {complaint.timeline.map((item, index) => (
                                    <TimelineItem key={index} item={item} isLast={index === complaint.timeline.length - 1} />
                                ))}
                            </div>
                        </div>
                        {user?.type === 'admin' && <AdminActions complaint={complaint} setComplaint={setComplaint} />}
                    </div>
                )}
            </div>
            <PhotoModal isOpen={isPhotoModalOpen} onClose={() => setIsPhotoModalOpen(false)} complaint={complaint} />
        </div>
    );
};

const InfoCard: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-100 dark:bg-slate-700 transition-colors duration-300">
        <span className="text-slate-500 dark:text-slate-400 text-xl mt-1">{icon}</span>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className="font-medium text-slate-800 dark:text-slate-200">{value}</p>
        </div>
    </div>
);

export default TrackComplaintPage;