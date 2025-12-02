import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useEffect } from 'react';

// Layouts
import PublicLayout from './components/common/PublicLayout';
import DashboardLayout from './components/common/DashboardLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import SignupPage from './pages/public/SignupPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import TeamPage from './pages/public/TeamPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import CoursesPage from './pages/student/CoursesPage';
import RegisteredCoursesPage from './pages/student/RegisteredCoursesPage';
import TranscriptPage from './pages/student/TranscriptPage';
import SchedulePage from './pages/student/SchedulePage';
import RequestsPage from './pages/student/RequestsPage';
import GPAPage from './pages/student/GPAPage';
import ProfilePage from './pages/student/ProfilePage';

// Advisor Pages
import AdvisorDashboard from './pages/advisor/AdvisorDashboard';
import AdvisorRequestsPage from './pages/advisor/AdvisorRequestsPage';
import AdvisorStudentsPage from './pages/advisor/AdvisorStudentsPage';
import StudentDetailsPage from './pages/advisor/StudentDetailsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// Loading Component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-6 relative">
        <div className="absolute inset-0 border-4 border-primary-400/30 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-secondary-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-transparent border-t-primary-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <p className="text-white/80 text-lg font-medium">جاري التحميل...</p>
      <p className="text-white/50 text-sm mt-2">نظام تسجيل المقررات - جامعة الملك خالد</p>
    </div>
  </div>
);

// Auth Redirect Component
const AuthRedirect: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      switch (user.role) {
        case 'student':
          navigate('/student/dashboard', { replace: true });
          break;
        case 'advisor':
          navigate('/advisor/dashboard', { replace: true });
          break;
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <LoadingScreen />;
  }

  return null;
};

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    switch (user.role) {
      case 'student':
        return <Navigate to="/student/dashboard" replace />;
      case 'advisor':
        return <Navigate to="/advisor/dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/team" element={<TeamPage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Auth Redirect */}
      <Route path="/dashboard" element={<AuthRedirect />} />

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout allowedRoles={['student']} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="registered" element={<RegisteredCoursesPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="transcript" element={<TranscriptPage />} />
        <Route path="gpa" element={<GPAPage />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Advisor Routes */}
      <Route
        path="/advisor"
        element={
          <ProtectedRoute allowedRoles={['advisor']}>
            <DashboardLayout allowedRoles={['advisor']} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdvisorDashboard />} />
        <Route path="requests" element={<AdvisorRequestsPage />} />
        <Route path="students" element={<AdvisorStudentsPage />} />
        <Route path="students/:id" element={<StudentDetailsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout allowedRoles={['admin']} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="courses" element={<AdminCoursesPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* 404 - Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
