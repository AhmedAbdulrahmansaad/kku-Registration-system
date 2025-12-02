import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

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

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import CoursesPage from './pages/student/CoursesPage';
import TranscriptPage from './pages/student/TranscriptPage';
import SchedulePage from './pages/student/SchedulePage';
import RequestsPage from './pages/student/RequestsPage';
import GPAPage from './pages/student/GPAPage';
import ProfilePage from './pages/student/ProfilePage';

// Advisor Pages
import AdvisorDashboard from './pages/advisor/AdvisorDashboard';
import AdvisorRequestsPage from './pages/advisor/AdvisorRequestsPage';
import AdvisorStudentsPage from './pages/advisor/AdvisorStudentsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';

// Loading Component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-500 dark:text-gray-400">جاري التحميل...</p>
    </div>
  </div>
);

// Redirect based on role
const RoleBasedRedirect: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

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
      </Route>

      {/* Auth Routes (no layout) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Dashboard redirect */}
      <Route path="/dashboard" element={<RoleBasedRedirect />} />

      {/* Student Routes */}
      <Route path="/student" element={<DashboardLayout allowedRoles={['student']} />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="registered" element={<CoursesPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="transcript" element={<TranscriptPage />} />
        <Route path="gpa" element={<GPAPage />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Advisor Routes */}
      <Route path="/advisor" element={<DashboardLayout allowedRoles={['advisor']} />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdvisorDashboard />} />
        <Route path="requests" element={<AdvisorRequestsPage />} />
        <Route path="students" element={<AdvisorStudentsPage />} />
        <Route path="students/:id" element={<AdvisorStudentsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<DashboardLayout allowedRoles={['admin']} />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="courses" element={<AdminCoursesPage />} />
        <Route path="users" element={<AdminCoursesPage />} />
        <Route path="settings" element={<AdminCoursesPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

