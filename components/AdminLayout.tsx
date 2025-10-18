
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout: React.FC = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="bg-slate-100 dark:bg-slate-900 min-h-screen flex text-slate-800 dark:text-slate-200">
            {isMobileMenuOpen && (
                <div 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="fixed inset-0 bg-black/60 z-40 md:hidden"
                    aria-hidden="true"
                />
            )}
            <AdminSidebar 
                isCollapsed={isSidebarCollapsed} 
                isOpenOnMobile={isMobileMenuOpen}
                setIsOpenOnMobile={setIsMobileMenuOpen} 
            />
            <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} flex flex-col`}>
                <AdminHeader 
                    toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    isSidebarCollapsed={isSidebarCollapsed}
                />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
