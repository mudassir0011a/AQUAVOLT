
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ReportIssuePage from './pages/ReportIssuePage';
import TrackComplaintPage from './pages/TrackComplaintPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import FaqPage from './pages/FaqPage';
import LoginPage from './pages/LoginPage';
import AboutUsPage from './pages/AboutUsPage';
import UserDashboardPage from './pages/UserDashboardPage';
import UserProfilePage from './pages/UserProfilePage';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import LoadingOverlay from './components/LoadingOverlay';
import Toast from './components/Toast';

// Admin Imports
import AdminLayout from './components/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AllComplaintsPage from './pages/admin/AllComplaintsPage';
import TechniciansPage from './pages/admin/TechniciansPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import AdminAnnouncementsPage from './pages/admin/AdminAnnouncementsPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import CalendarPage from './pages/admin/CalendarPage';


const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly = false }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && user.type !== 'admin') {
     return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

// FIX: Removed AdminRoutes component to adopt standard nested routing with an Outlet.

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return user.type === 'user' ? <UserDashboardPage /> : <Navigate to="/admin/dashboard" replace />;
};


const AppContent: React.FC = () => {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const navTimeoutRef = useRef<number | null>(null);
  const { toast } = useNotification();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    setIsNavigating(true);

    if (navTimeoutRef.current) {
      clearTimeout(navTimeoutRef.current);
    }

    navTimeoutRef.current = window.setTimeout(() => {
      window.scrollTo(0, 0);
      setIsNavigating(false);
    }, 500);

    return () => {
      if (navTimeoutRef.current) {
        clearTimeout(navTimeoutRef.current);
      }
    };
  }, [location.pathname]);

  return (
    <div className={`bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-900 dark:text-slate-200 font-sans transition-colors duration-300 flex flex-col antialiased`}>
      {toast && <Toast message={toast.message} type={toast.type} key={toast.id} />}
      <LoadingOverlay isLoading={isNavigating} />
      {!isAdminRoute && <Navbar />}
      <main className={`flex-grow transition-opacity duration-300 ease-in-out ${isNavigating ? 'opacity-0' : 'opacity-100'}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/report" element={<ReportIssuePage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
          <Route path="/track" element={<TrackComplaintPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* FIX: Replaced /admin/* route with a nested route structure for proper layout handling */}
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="complaints" element={<AllComplaintsPage />} />
            <Route path="technicians" element={<TechniciansPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="announcements" element={<AdminAnnouncementsPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <HashRouter>
            <AppContent />
          </HashRouter>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
