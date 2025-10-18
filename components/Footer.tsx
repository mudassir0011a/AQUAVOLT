import React from 'react';
import { Link } from 'react-router-dom';

const SocialIcon: React.FC<{ href: string, children: React.ReactNode, label: string }> = ({ href, children, label }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors" aria-label={label}>
        {children}
    </a>
);

const TwitterIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085c.645 1.956 2.52 3.375 4.738 3.423a9.898 9.898 0 01-6.117 2.107c-.398 0-.79-.023-1.175-.068a13.963 13.963 0 007.548 2.212c9.054 0 14.01-7.496 14.01-14.01l-.01- .638A10.035 10.035 0 0024 4.59z" /></svg>
);

const FacebookIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.35C0 23.41.59 24 1.325 24H12.82v-9.29h-3.128V11.12h3.128V8.625c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.918c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.58h-3.12V24h5.698c.735 0 1.325-.59 1.325-1.325V1.325C24 .59 23.41 0 22.675 0z" /></svg>
);

const InstagramIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98C23.986 15.667 24 15.259 24 12s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" /></svg>
);


const Footer: React.FC = () => {
    return (
        <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left Column: Brand Info */}
                    <div className="md:col-span-12 lg:col-span-4">
                        <Link to="/" className="text-2xl font-bold text-emerald-600 dark:text-emerald-500 flex items-center gap-2">
                             💧⚡ AquaVolt
                        </Link>
                        <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-xs">
                            A unified platform for reporting and tracking civic issues in Navi Mumbai.
                        </p>
                    </div>

                    {/* Right Columns: Links */}
                    <div className="md:col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Navigation</h2>
                            <ul className="text-slate-600 dark:text-slate-400 space-y-3">
                                <li><Link to="/" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Home</Link></li>
                                <li><Link to="/report" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Report Issue</Link></li>
                                <li><Link to="/track" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Track Complaint</Link></li>
                                <li><Link to="/dashboard" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Dashboard</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Resources</h2>
                            <ul className="text-slate-600 dark:text-slate-400 space-y-3">
                                <li><Link to="/announcements" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Announcements</Link></li>
                                <li><Link to="/faq" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">FAQ</Link></li>
                                <li><Link to="/about" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">About Us</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Follow Us</h2>
                            <div className="flex space-x-5">
                                <SocialIcon href="#" label="Facebook"><FacebookIcon /></SocialIcon>
                                <SocialIcon href="#" label="Instagram"><InstagramIcon /></SocialIcon>
                                <SocialIcon href="#" label="Twitter"><TwitterIcon /></SocialIcon>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="my-8 border-slate-200 dark:border-slate-700" />
                
                <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                    © {new Date().getFullYear()} AquaVolt. All Rights Reserved. A Community Project for a Better Navi Mumbai.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
