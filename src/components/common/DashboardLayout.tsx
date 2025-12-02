import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Bell, LogOut, User, Sun, Moon, Globe,
  Home, BookOpen, Calendar, FileText, TrendingUp,
  Users, ClipboardCheck, Settings, GraduationCap, ChevronDown
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import ChatBot from '../chat/ChatBot';

interface DashboardLayoutProps {
  allowedRoles: string[];
}

const DashboardLayout: React.FC<DashboardLayoutProps> = () => {
  const { t, language, toggleLanguage, isRTL } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const getNavItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'student':
        return [
          { path: '/student/dashboard', label: t('nav.dashboard'), icon: Home },
          { path: '/student/courses', label: t('nav.courses'), icon: BookOpen },
          { path: '/student/registered', label: t('nav.registeredCourses'), icon: ClipboardCheck },
          { path: '/student/schedule', label: t('nav.schedule'), icon: Calendar },
          { path: '/student/transcript', label: t('nav.transcript'), icon: FileText },
          { path: '/student/gpa', label: t('nav.gpa'), icon: TrendingUp },
          { path: '/student/requests', label: t('nav.requests'), icon: ClipboardCheck },
          { path: '/student/profile', label: t('nav.profile'), icon: User },
        ];
      case 'advisor':
        return [
          { path: '/advisor/dashboard', label: t('nav.dashboard'), icon: Home },
          { path: '/advisor/students', label: t('nav.students'), icon: Users },
          { path: '/advisor/requests', label: t('nav.requests'), icon: ClipboardCheck },
          { path: '/advisor/profile', label: t('nav.profile'), icon: User },
        ];
      case 'admin':
        return [
          { path: '/admin/dashboard', label: t('nav.dashboard'), icon: Home },
          { path: '/admin/courses', label: t('admin.manageCourses'), icon: BookOpen },
          { path: '/admin/users', label: t('admin.manageUsers'), icon: Users },
          { path: '/admin/settings', label: t('nav.settings'), icon: Settings },
          { path: '/admin/profile', label: t('nav.profile'), icon: User },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleSignOut = async () => {
    await signOut();
  };

  const getRoleBadge = () => {
    if (!user) return null;
    
    const roleConfig = {
      student: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
      advisor: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
      admin: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' },
    };

    const config = roleConfig[user.role as keyof typeof roleConfig];
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {t(`auth.${user.role}`)}
      </span>
    );
  };

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Sidebar - Desktop */}
      <aside className={`fixed top-0 bottom-0 z-40 w-72 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'
      } ${isRTL ? 'right-0' : 'left-0'}`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-800 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-primary-800 dark:text-primary-400">
                {language === 'ar' ? 'نظام التسجيل' : 'Registration'}
              </h1>
              <p className="text-xs text-gray-500">{language === 'ar' ? 'جامعة الملك خالد' : 'KKU'}</p>
            </div>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 mx-4 mt-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate">{user?.full_name}</p>
              {getRoleBadge()}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-800 text-white shadow-lg shadow-primary-800/30'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{t('auth.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className={`min-h-screen transition-all duration-300 ${isRTL ? 'lg:mr-72' : 'lg:ml-72'}`}>
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Page Title */}
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {navItems.find(item => item.path === location.pathname)?.label || t('nav.dashboard')}
              </h1>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={language === 'ar' ? 'English' : 'العربية'}
              >
                <Globe className="w-5 h-5" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Notifications */}
              <button className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 relative transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${
                        isRTL ? 'left-0' : 'right-0'
                      }`}
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-medium text-gray-900 dark:text-white">{user?.full_name}</p>
                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                        <div className="mt-2">{getRoleBadge()}</div>
                      </div>
                      <div className="p-2">
                        <Link
                          to={`/${user?.role}/profile`}
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <User className="w-5 h-5" />
                          {t('nav.profile')}
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                        >
                          <LogOut className="w-5 h-5" />
                          {t('auth.logout')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* ChatBot */}
      <ChatBot />
    </div>
  );
};

export default DashboardLayout;
