import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, BookOpen, Calendar, FileText, 
  TrendingUp, ClipboardList, User, Users, Settings,
  GraduationCap, CheckSquare, PlusCircle
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();

  const studentLinks = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/student/courses', icon: BookOpen, label: t('courses.available') },
    { to: '/student/registered', icon: CheckSquare, label: t('courses.registered') },
    { to: '/student/schedule', icon: Calendar, label: t('nav.schedule') },
    { to: '/student/transcript', icon: FileText, label: t('nav.transcript') },
    { to: '/student/gpa', icon: TrendingUp, label: t('nav.gpa') },
    { to: '/student/requests', icon: ClipboardList, label: t('nav.requests') },
    { to: '/student/profile', icon: User, label: t('nav.profile') },
  ];

  const advisorLinks = [
    { to: '/advisor/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/advisor/requests', icon: ClipboardList, label: t('requests.pendingRequests') },
    { to: '/advisor/students', icon: Users, label: t('students.myStudents') },
    { to: '/advisor/profile', icon: User, label: t('nav.profile') },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/admin/courses', icon: BookOpen, label: t('admin.manageCourses') },
    { to: '/admin/users', icon: Users, label: t('admin.manageUsers') },
    { to: '/admin/settings', icon: Settings, label: t('nav.settings') },
  ];

  const getLinks = () => {
    switch (user?.role) {
      case 'student': return studentLinks;
      case 'advisor': return advisorLinks;
      case 'admin': return adminLinks;
      default: return [];
    }
  };

  const links = getLinks();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isOpen ? 0 : (isRTL ? 280 : -280)
        }}
        className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-[280px] bg-white dark:bg-gray-900 border-${isRTL ? 'l' : 'r'} border-gray-200 dark:border-gray-800 z-50 lg:translate-x-0 lg:z-30`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-gray-200 dark:border-gray-800">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-800 to-primary-600 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-primary-800 dark:text-primary-400">
              {t('landing.title')}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t(`auth.${user?.role}`)}
            </p>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-800 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {user?.full_name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.student_id || user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-200px)]">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;

            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary-800 text-white shadow-lg shadow-primary-800/30' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-800 dark:hover:text-primary-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </motion.aside>
    </>
  );
};

export default Sidebar;

