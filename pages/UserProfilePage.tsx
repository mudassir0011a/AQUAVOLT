import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;

const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-md transition-colors duration-300">
        <div className="flex items-center gap-3 mb-6">
            <div className="text-emerald-500">{icon}</div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
        </div>
        {children}
    </div>
);

const Toggle: React.FC<{ label: string; enabled: boolean; onToggle: () => void }> = ({ label, enabled, onToggle }) => (
    <div className="flex items-center justify-between">
        <span className="text-slate-600 dark:text-slate-300">{label}</span>
        <button
            onClick={onToggle}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const UserProfilePage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { showToast } = useNotification();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || 'Citizen');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleInfoSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            updateUser({ name, email });
            showToast('Profile information updated!', 'success');
        }, 500);
    };

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            showToast('New passwords do not match.', 'error');
            return;
        }
        // Simulate API call
        setTimeout(() => {
            showToast('Password changed successfully.', 'success');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }, 500);
    };
    
    const handleNotificationSave = () => {
        // Simulate API call
        setTimeout(() => {
            showToast('Notification preferences saved!', 'success');
        }, 500);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">My Profile</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Manage your account details and preferences.</p>
                </div>
                
                {/* Personal Information */}
                <SectionCard title="Personal Information" icon={<UserIcon />}>
                    <form onSubmit={handleInfoSave} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-emerald-500 focus:border-emerald-500" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-emerald-500 focus:border-emerald-500" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone / Admin ID</label>
                            <input type="text" value={user?.identifier || ''} className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-700/50 rounded-md cursor-not-allowed" readOnly />
                        </div>
                        <div className="text-right">
                            <button type="submit" className="bg-emerald-600 text-white font-semibold px-5 py-2 rounded-md hover:bg-emerald-700 dark:bg-emerald-400 dark:hover:bg-emerald-500 transition-colors">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </SectionCard>

                {/* Change Password */}
                <SectionCard title="Change Password" icon={<LockIcon />}>
                     <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                            <input id="currentPassword" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-emerald-500 focus:border-emerald-500" />
                        </div>
                         <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                            <input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-emerald-500 focus:border-emerald-500" />
                        </div>
                         <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                            <input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-emerald-500 focus:border-emerald-500" />
                        </div>
                         <div className="text-right">
                            <button type="submit" className="bg-emerald-600 text-white font-semibold px-5 py-2 rounded-md hover:bg-emerald-700 dark:bg-emerald-400 dark:hover:bg-emerald-500 transition-colors">
                                Update Password
                            </button>
                        </div>
                    </form>
                </SectionCard>

                {/* Notification Settings */}
                 <SectionCard title="Notification Settings" icon={<BellIcon />}>
                    <div className="space-y-4">
                        <Toggle label="Email Notifications" enabled={emailNotifications} onToggle={() => setEmailNotifications(!emailNotifications)} />
                        <Toggle label="SMS Notifications" enabled={smsNotifications} onToggle={() => setSmsNotifications(!smsNotifications)} />
                        <div className="text-right pt-2">
                            <button onClick={handleNotificationSave} className="bg-emerald-600 text-white font-semibold px-5 py-2 rounded-md hover:bg-emerald-700 dark:bg-emerald-400 dark:hover:bg-emerald-500 transition-colors">
                                Save Preferences
                            </button>
                        </div>
                    </div>
                </SectionCard>
            </div>
        </div>
    );
};

export default UserProfilePage;