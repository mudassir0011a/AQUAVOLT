import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const BellSlashedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-11.25L5.25 6m0 0l2.25 2.25M5.25 6l2.25-2.25M5.25 6l-2.25 2.25M3 10.5a8.25 8.25 0 0113.829-5.462m-1.329 5.462a8.25 8.25 0 01-12.5 0C4.545 6.089 6.276 4.5 8.25 4.5 9.828 4.5 11.25 5.123 12.33 6.012M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-3.999-5.659M9 9V5a3 3 0 016 0v4m-6 0a3 3 0 00-3 3v2.158a2.032 2.032 0 01-.595 1.436L4 17h5m-2 0v1a1 1 0 001 1h2a1 1 0 001-1v-1m-4 0H9" /></svg>;


const Navbar: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const { notificationPermission, requestNotificationPermission } = useNotification();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    // Close profile dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const activeLinkClass = "text-emerald-500 dark:text-emerald-400 font-semibold";
    const inactiveLinkClass = "text-slate-700 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors";
    const mobileActiveLinkClass = "bg-emerald-50 dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 block px-3 py-2 rounded-md text-base font-medium";
    const mobileInactiveLinkClass = "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 block px-3 py-2 rounded-md text-base font-medium";

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        setIsProfileMenuOpen(false);
        navigate('/');
    };
    
    const handleNavClick = () => setIsMobileMenuOpen(false);
    const handleProfileMenuNav = () => setIsProfileMenuOpen(false);

    const notificationButtonTitle = {
        granted: 'Notifications are enabled',
        denied: 'Notifications are blocked by your browser',
        default: 'Click to enable notifications',
    };

    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <NavLink to="/" onClick={handleNavClick} className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
                            💧⚡ AquaVolt
                        </NavLink>
                    </div>

                    <div className="hidden md:flex justify-center flex-1">
                        <div className="flex items-baseline space-x-6">
                            <NavLink to="/" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>Home</NavLink>
                            {user && <NavLink to="/dashboard" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>Dashboard</NavLink>}
                            <NavLink to="/report" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>Report Issue</NavLink>
                            <NavLink to="/track" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>Track Complaint</NavLink>
                            <NavLink to="/announcements" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>Announcements</NavLink>
                            <NavLink to="/faq" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>FAQ</NavLink>
                            <NavLink to="/about" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>About Us</NavLink>
                        </div>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-2">
                        {user ? (
                            <>
                                <button
                                    onClick={requestNotificationPermission}
                                    className={`p-2 rounded-full transition-colors ${notificationPermission === 'granted' ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'} hover:bg-slate-200 dark:hover:bg-slate-700`}
                                    title={notificationButtonTitle[notificationPermission]}
                                    aria-label={notificationButtonTitle[notificationPermission]}
                                >
                                    {notificationPermission === 'denied' ? <BellSlashedIcon /> : <BellIcon />}
                                </button>
                                <div className="relative" ref={profileMenuRef}>
                                    <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 px-3 py-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                        <UserIcon />
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user.name || 'Profile'}</span>
                                    </button>
                                    {isProfileMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 animate-fade-in-up">
                                            <NavLink to="/profile" onClick={handleProfileMenuNav} className={({ isActive }) => `block px-4 py-2 text-sm ${isActive ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-200'} hover:bg-slate-100 dark:hover:bg-slate-700`}>My Profile</NavLink>
                                            <NavLink to="/dashboard" onClick={handleProfileMenuNav} className={({ isActive }) => `block px-4 py-2 text-sm ${isActive ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-200'} hover:bg-slate-100 dark:hover:bg-slate-700`}>Dashboard</NavLink>
                                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Logout</button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <NavLink to="/login" className="bg-emerald-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-emerald-700 dark:bg-emerald-400 dark:hover:bg-emerald-500 transition-colors text-sm">
                                Login
                            </NavLink>
                        )}
                        <button onClick={toggleTheme} className="p-2 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Toggle theme">
                            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        </button>
                    </div>
                    
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} type="button" className="p-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-controls="mobile-menu" aria-expanded={isMobileMenuOpen}>
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                        </button>
                    </div>
                </div>
            </nav>

            <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-slate-200 dark:border-slate-800`} id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <NavLink to="/" onClick={handleNavClick} className={({ isActive }) => isActive ? mobileActiveLinkClass : mobileInactiveLinkClass}>Home</NavLink>
                    {user && <NavLink to="/dashboard" onClick={handleNavClick} className={({ isActive }) => isActive ? mobileActiveLinkClass : mobileInactiveLinkClass}>Dashboard</NavLink>}
                    <NavLink to="/report" onClick={handleNavClick} className={({ isActive }) => isActive ? mobileActiveLinkClass : mobileInactiveLinkClass}>Report Issue</NavLink>
                    <NavLink to="/track" onClick={handleNavClick} className={({ isActive }) => isActive ? mobileActiveLinkClass : mobileInactiveLinkClass}>Track Complaint</NavLink>
                    <NavLink to="/announcements" onClick={handleNavClick} className={({ isActive }) => isActive ? mobileActiveLinkClass : mobileInactiveLinkClass}>Announcements</NavLink>
                    <NavLink to="/faq" onClick={handleNavClick} className={({ isActive }) => isActive ? mobileActiveLinkClass : mobileInactiveLinkClass}>FAQ</NavLink>
                    <NavLink to="/about" onClick={handleNavClick} className={({ isActive }) => isActive ? mobileActiveLinkClass : mobileInactiveLinkClass}>About Us</NavLink>
                </div>
                <div className="pt-4 pb-3 border-t border-slate-200 dark:border-slate-700">
                     <div className="px-5 flex items-center justify-between">
                         {user ? (
                            <div>
                                <div className="text-base font-medium text-slate-800 dark:text-white">{user.name}</div>
                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{user.email || user.identifier}</div>
                            </div>
                         ) : (
                            <div className="text-base font-medium text-slate-800 dark:text-white">Menu</div>
                         )}
                        <button onClick={toggleTheme} className="p-2 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Toggle theme">
                            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        </button>
                    </div>
                    <div className="mt-3 px-2 space-y-1">
                        {user ? (
                            <>
                                <NavLink to="/profile" onClick={handleNavClick} className={mobileInactiveLinkClass}>My Profile</NavLink>
                                <button onClick={handleLogout} className="w-full text-left text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 block px-3 py-2 rounded-md text-base font-medium">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <NavLink to="/login" onClick={handleNavClick} className="block w-full text-left bg-emerald-50 dark:bg-slate-700/50 text-emerald-600 dark:text-emerald-300 px-3 py-2 rounded-md text-base font-medium">
                                Login
                            </NavLink>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;