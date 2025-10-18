
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminUserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>;
const CollapseLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>;
const CollapseRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>;


const getPageTitle = (pathname: string): string => {
    const path = pathname.split('/').pop() || 'dashboard';
    switch(path) {
        case 'dashboard': return 'Dashboard';
        case 'complaints': return 'All Complaints';
        case 'technicians': return 'Manage Technicians';
        case 'analytics': return 'Analytics';
        case 'calendar': return 'Calendar';
        case 'announcements': return 'Manage Announcements';
        case 'profile': return 'Admin Profile';
        default: return 'Admin Panel';
    }
};

interface AdminHeaderProps {
    toggleSidebar: () => void;
    toggleMobileMenu: () => void;
    isSidebarCollapsed: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ toggleSidebar, toggleMobileMenu, isSidebarCollapsed }) => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const pageTitle = getPageTitle(location.pathname);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-30 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
            <div className="px-4 sm:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={toggleMobileMenu} className="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300">
                        <MenuIcon />
                    </button>
                    <button onClick={toggleSidebar} className="hidden md:block p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:text-emerald-500">
                        {isSidebarCollapsed ? <CollapseRightIcon /> : <CollapseLeftIcon />}
                    </button>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 hidden sm:block">{pageTitle}</h1>
                </div>

                <div className="relative" ref={profileMenuRef}>
                    <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 px-3 py-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <AdminUserIcon />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 hidden sm:block">{user?.name || 'Admin'}</span>
                    </button>
                    {isProfileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 animate-fade-in-up">
                            <Link to="/admin/profile" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Manage Account</Link>
                            <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
