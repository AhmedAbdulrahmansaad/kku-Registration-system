import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, TrendingUp, Clock, Bell, Calendar, 
  CheckCircle, AlertCircle, ChevronLeft, ChevronRight,
  FileText, ClipboardList
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { getEnrollments, getRequests, getNotifications, calculateGPA } from '../../lib/supabase';
import { Enrollment, Request, Notification } from '../../types';

const StudentDashboard: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [gpaData, setGpaData] = useState({ gpa: 0, completedCredits: 0, totalCredits: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const [enrollmentsData, requestsData, notificationsData, gpa] = await Promise.all([
          getEnrollments(user.id, 'current'),
          getRequests(undefined, user.id),
          getNotifications(user.id),
          calculateGPA(user.id),
        ]);
        
        setEnrollments(enrollmentsData || []);
        setRequests(requestsData || []);
        setNotifications(notificationsData || []);
        setGpaData(gpa);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const Arrow = isRTL ? ChevronLeft : ChevronRight;

  const stats = [
    {
      title: t('dashboard.gpa'),
      value: gpaData.gpa.toFixed(2),
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      title: t('dashboard.completedCredits'),
      value: gpaData.completedCredits,
      icon: CheckCircle,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: t('dashboard.currentCredits'),
      value: enrollments.reduce((sum, e) => sum + (e.course?.credit_hours || 0), 0),
      icon: BookOpen,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      title: t('dashboard.pendingRequests'),
      value: requests.filter(r => r.status === 'pending').length,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
  ];

  const quickActions = [
    { title: t('dashboard.registerCourses'), icon: BookOpen, to: '/student/courses', color: 'from-primary-600 to-primary-800' },
    { title: t('dashboard.viewSchedule'), icon: Calendar, to: '/student/schedule', color: 'from-blue-600 to-blue-800' },
    { title: t('dashboard.viewTranscript'), icon: FileText, to: '/student/transcript', color: 'from-purple-600 to-purple-800' },
    { title: t('nav.requests'), icon: ClipboardList, to: '/student/requests', color: 'from-orange-600 to-orange-800' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-800 to-primary-600 rounded-2xl p-6 md:p-8 text-white"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {t('dashboard.welcome')}، {user?.full_name} 👋
            </h1>
            <p className="text-white/80">
              {language === 'ar' 
                ? `المستوى ${user?.level} - نظم المعلومات الإدارية`
                : `Level ${user?.level} - Management Information Systems`
              }
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{gpaData.gpa.toFixed(2)}</p>
              <p className="text-sm text-white/70">{t('dashboard.gpa')}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {t('dashboard.quickActions')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.to}
              className={`bg-gradient-to-br ${action.color} text-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <action.icon className="w-8 h-8 mb-4" />
              <p className="font-semibold">{action.title}</p>
            </Link>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Current Courses */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('courses.registered')}
            </h2>
            <Link
              to="/student/registered"
              className="text-primary-800 dark:text-primary-400 text-sm font-medium hover:underline flex items-center gap-1"
            >
              {t('common.viewDetails')}
              <Arrow className="w-4 h-4" />
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">{t('common.noData')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {enrollments.slice(0, 4).map((enrollment, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                >
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary-800 dark:text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {language === 'ar' ? enrollment.course?.name_ar : enrollment.course?.name_en}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {enrollment.course?.course_code} • {enrollment.course?.credit_hours} {t('courses.creditHours')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Notifications */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('notifications.title')}
            </h2>
            <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium px-2 py-1 rounded-full">
              {notifications.filter(n => !n.is_read).length} {language === 'ar' ? 'جديد' : 'new'}
            </span>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">{t('notifications.noNotifications')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, 4).map((notification, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 p-4 rounded-xl ${
                    notification.is_read 
                      ? 'bg-gray-50 dark:bg-gray-700/50' 
                      : 'bg-primary-50 dark:bg-primary-900/20'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    notification.type === 'success' 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : notification.type === 'error'
                      ? 'bg-red-100 dark:bg-red-900/30'
                      : notification.type === 'warning'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30'
                      : 'bg-blue-100 dark:bg-blue-900/30'
                  }`}>
                    {notification.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : notification.type === 'error' ? (
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    ) : (
                      <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {language === 'ar' ? notification.title_ar : notification.title_en}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {language === 'ar' ? notification.message_ar : notification.message_en}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('dashboard.recentActivity')}
          </h2>
          <Link
            to="/student/requests"
            className="text-primary-800 dark:text-primary-400 text-sm font-medium hover:underline flex items-center gap-1"
          >
            {t('common.viewDetails')}
            <Arrow className="w-4 h-4" />
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-8">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">{t('requests.noRequests')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-500 dark:text-gray-400 text-sm">
                  <th className="text-right pb-4">{t('courses.courseName')}</th>
                  <th className="text-right pb-4">{t('requests.requestType')}</th>
                  <th className="text-right pb-4">{t('common.status')}</th>
                  <th className="text-right pb-4">{t('common.date')}</th>
                </tr>
              </thead>
              <tbody>
                {requests.slice(0, 5).map((request, index) => (
                  <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="py-4">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {language === 'ar' ? request.course?.name_ar : request.course?.name_en}
                      </p>
                      <p className="text-sm text-gray-500">{request.course?.course_code}</p>
                    </td>
                    <td className="py-4">
                      <span className="text-gray-600 dark:text-gray-300">
                        {t(`requests.${request.request_type}`)}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        request.status === 'approved' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : request.status === 'rejected'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {t(`requests.${request.status}`)}
                      </span>
                    </td>
                    <td className="py-4 text-gray-500 dark:text-gray-400">
                      {new Date(request.created_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StudentDashboard;

