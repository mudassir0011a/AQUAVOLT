import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNotification } from './NotificationContext';

type User = {
    type: 'user' | 'admin';
    identifier: string; // phone number for user, adminId for admin
    name?: string;
    email?: string;
};

interface AuthContextType {
    user: User | null;
    login: (credentials: any, type: 'user' | 'admin') => Promise<boolean>;
    logout: () => void;
    loading: boolean;
    updateUser: (updatedData: Partial<Pick<User, 'name' | 'email'>>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy credentials and OTP
const DUMMY_OTP = '181025';
const ADMIN_ID = 'ADMIN_AQUAVOLT';
const ADMIN_PASS = 'Admin@123';


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useNotification();

    useEffect(() => {
        try {
            const storedUser = sessionStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from session storage", error);
            sessionStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (credentials: any, type: 'user' | 'admin'): Promise<boolean> => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        let success = false;
        let loggedInUser: User | null = null;

        if (type === 'user' && credentials.otp === DUMMY_OTP) {
            loggedInUser = { 
                type: 'user', 
                identifier: credentials.phone,
                name: 'Demo Citizen',
                email: `citizen.${credentials.phone.slice(6)}@email.com`
            };
            success = true;
        } else if (type === 'admin' && credentials.adminId === ADMIN_ID && credentials.password === ADMIN_PASS) {
            loggedInUser = { 
                type: 'admin', 
                identifier: credentials.adminId,
                name: 'Admin User',
                email: 'admin@aquavolt.gov'
            };
            success = true;
        }

        if (success && loggedInUser) {
            setUser(loggedInUser);
            sessionStorage.setItem('user', JSON.stringify(loggedInUser));
            showToast('Login successful. Welcome!', 'success');
        }
        
        return success;
    };

    const logout = () => {
        const userName = user?.name || 'Citizen';
        setUser(null);
        sessionStorage.removeItem('user');
        showToast(`Logout successful. Goodbye, ${userName}!`, 'success');
    };

    const updateUser = (updatedData: Partial<Pick<User, 'name' | 'email'>>) => {
        if (!user) return;
        
        const newUser: User = { ...user, ...updatedData };
        setUser(newUser);
        sessionStorage.setItem('user', JSON.stringify(newUser));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};