
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Icons
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" /></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-8v8M4 16h16" /></svg>;
const AnnounceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;

interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    isCollapsed: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, children, isCollapsed, onClick }) => {
    const baseClasses = "flex items-center gap-4 py-3 rounded-lg transition-all duration-200 overflow-hidden";
    const inactiveClasses = "text-slate-300 hover:bg-slate-700/50 hover:text-white";
    const activeClasses = "bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/20";
    const paddingClass = isCollapsed ? 'px-3 justify-center' : 'px-4';

    return (
        <NavLink 
            to={to} 
            onClick={onClick}
            className={({ isActive }) => `${baseClasses} ${paddingClass} ${isActive ? activeClasses : inactiveClasses}`}
            end
        >
            {icon}
            <span className={`whitespace-nowrap transition-opacity ease-in-out ${isCollapsed ? 'opacity-0 duration-100' : 'opacity-100 duration-200 delay-150'}`}>{children}</span>
        </NavLink>
    );
};

interface AdminSidebarProps {
    isCollapsed: boolean;
    isOpenOnMobile: boolean;
    setIsOpenOnMobile: (isOpen: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, isOpenOnMobile, setIsOpenOnMobile }) => {
    const handleNavClick = () => {
        if (isOpenOnMobile) {
            setIsOpenOnMobile(false);
        }
    };

    const sidebarClasses = `
        bg-slate-900 text-white flex flex-col fixed top-0 left-0 h-full
        shadow-2xl z-50
        transition-transform md:transition-all duration-300 ease-in-out
        transform ${isOpenOnMobile ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        ${isCollapsed ? 'w-20' : 'w-64'}
    `;

    return (
        <aside className={sidebarClasses}>
            <div className={`flex items-center gap-2 h-16 border-b border-slate-700/50 flex-shrink-0 overflow-hidden ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}>
                <Link to="/admin/dashboard" onClick={handleNavClick} className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-emerald-500 flex-shrink-0">💧⚡</span>
                    <span className={`text-xl font-bold whitespace-nowrap transition-opacity ease-in-out ${isCollapsed ? 'opacity-0 duration-100' : 'opacity-100 duration-200 delay-150'}`}>
                        AquaVolt <span className="font-light text-slate-300">Admin</span>
                    </span>
                </Link>
            </div>

            <nav className={`flex-1 flex flex-col gap-2 p-3 overflow-y-auto`}>
                <NavItem to="/admin/dashboard" icon={<DashboardIcon />} isCollapsed={isCollapsed} onClick={handleNavClick}>Dashboard</NavItem>
                <NavItem to="/admin/complaints" icon={<ListIcon />} isCollapsed={isCollapsed} onClick={handleNavClick}>All Complaints</NavItem>
                <NavItem to="/admin/technicians" icon={<UsersIcon />} isCollapsed={isCollapsed} onClick={handleNavClick}>Technicians</NavItem>
                <NavItem to="/admin/analytics" icon={<ChartIcon />} isCollapsed={isCollapsed} onClick={handleNavClick}>Analytics</NavItem>
                <NavItem to="/admin/calendar" icon={<CalendarIcon />} isCollapsed={isCollapsed} onClick={handleNavClick}>Calendar</NavItem>
                <NavItem to="/admin/announcements" icon={<AnnounceIcon />} isCollapsed={isCollapsed} onClick={handleNavClick}>Announcements</NavItem>
            </nav>

            <div className={`mt-auto border-t border-slate-700/50 pt-4 pb-4 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
                <Link
                    to="/"
                    onClick={handleNavClick}
                    className={`flex items-center gap-4 py-3 rounded-lg text-slate-400 hover:bg-slate-700/50 hover:text-white transition-colors duration-200 overflow-hidden ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <BackIcon />
                    <span className={`text-sm whitespace-nowrap transition-opacity ease-in-out ${isCollapsed ? 'opacity-0 duration-100' : 'opacity-100 duration-200 delay-150'}`}>Back to Site</span>
                </Link>
            </div>
        </aside>
    );
};

export default AdminSidebar;
