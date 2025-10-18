import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Tab = 'user' | 'admin';

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeSlashedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
    </svg>
);


const LoginPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('user');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [resendTimer, setResendTimer] = useState(0);
    const timerRef = useRef<number | null>(null);

    const navigate = useNavigate();
    const { login } = useAuth();
    
    const startResendTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setResendTimer(30);
        timerRef.current = window.setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) {
                    if(timerRef.current) clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
            setError('Please enter a valid 10-digit phone number.');
            return;
        }
        setLoading(true);
        // Simulate sending OTP
        setTimeout(() => {
            setOtpSent(true);
            setLoading(false);
            startResendTimer();
        }, 1000);
    };

    const handleResendOtp = () => {
        if (resendTimer > 0 || loading) return;

        setLoading(true);
        // Simulate resending OTP
        setTimeout(() => {
            setLoading(false);
            startResendTimer();
        }, 1000);
    };

    const handleUserLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (otp.length !== 6) {
            setError('OTP must be 6 digits.');
            return;
        }
        setLoading(true);
        const success = await login({ phone, otp }, 'user');
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Invalid OTP. Please try again. (Hint: 181025)');
        }
        setLoading(false);
    };

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!adminId || !password) {
            setError('Please fill in both Admin ID and Password.');
            return;
        }
        setLoading(true);
        const success = await login({ adminId, password }, 'admin');
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Invalid credentials. Please check your ID and Password.');
        }
        setLoading(false);
    };


    const TabButton: React.FC<{ tab: Tab; label: string }> = ({ tab, label }) => (
        <button
            onClick={() => { setActiveTab(tab); setError(''); }}
            className={`w-1/2 py-3 text-center font-semibold border-b-2 transition-colors duration-300 ${activeTab === tab ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="container mx-auto px-4 py-12 flex justify-center items-center">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
                <div className="flex">
                    <TabButton tab="user" label="User Login" />
                    <TabButton tab="admin" label="Admin Login" />
                </div>

                <div className="p-8">
                    {activeTab === 'user' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100">Citizen Login</h2>
                            {!otpSent ? (
                                <form onSubmit={handleSendOtp} className="space-y-4">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Enter your 10-digit number"
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                            required
                                            maxLength={10}
                                        />
                                    </div>
                                    <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-emerald-700 dark:bg-emerald-400 dark:hover:bg-emerald-500 transition-colors disabled:bg-slate-400">
                                        {loading ? 'Sending...' : 'Send OTP'}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleUserLogin} className="space-y-4">
                                    <p className="text-sm text-center text-slate-600 dark:text-slate-400">An OTP has been sent to +91 {phone}.</p>
                                    <div>
                                        <label htmlFor="otp" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Enter OTP</label>
                                        <input
                                            id="otp"
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="Enter 6-digit OTP"
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                            required
                                            maxLength={6}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setOtpSent(false);
                                                setError('');
                                                setOtp('');
                                                if (timerRef.current) clearInterval(timerRef.current);
                                                setResendTimer(0);
                                            }}
                                            className="text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                                        >
                                            Change number
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleResendOtp}
                                            disabled={resendTimer > 0 || loading}
                                            className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed disabled:no-underline"
                                        >
                                            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                                        </button>
                                    </div>
                                    <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-emerald-700 dark:bg-emerald-400 dark:hover:bg-emerald-500 transition-colors disabled:bg-slate-400">
                                        {loading ? 'Verifying...' : 'Login'}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    {activeTab === 'admin' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100">Admin Login</h2>
                            <form onSubmit={handleAdminLogin} className="space-y-4">
                                <div>
                                    <label htmlFor="adminId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Admin ID</label>
                                    <input
                                        id="adminId"
                                        type="text"
                                        value={adminId}
                                        onChange={(e) => setAdminId(e.target.value)}
                                        placeholder="Enter your Admin ID"
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={isPasswordVisible ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            className="w-full px-4 py-2 pr-10 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                            className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                                        >
                                            {isPasswordVisible ? <EyeSlashedIcon /> : <EyeIcon />}
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-emerald-700 dark:bg-emerald-400 dark:hover:bg-emerald-500 transition-colors disabled:bg-slate-400">
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </button>
                            </form>
                        </div>
                    )}
                     {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;