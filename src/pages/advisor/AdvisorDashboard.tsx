import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, ClipboardList, Clock, CheckCircle, XCircle,
  ChevronLeft, ChevronRight, TrendingUp
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { getRequests, getStudentsByAdvisor } from '../../lib/supabase';
import { Request, User } from '../../types';

const AdvisorDashboard: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const [requestsData, studentsData] = await Promise.all([
          getRequests(user.id),
          getStudentsByAdvisor(user.id),
        ]);
        
        setRequests(requestsData || []);
        setStudents(studentsData || []);
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
      title: t('dashboard.totalStudents'),
      value: students.length,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: t('dashboard.pendingRequests'),
      value: requests.filter(r => r.status === 'pending').length,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    {
      title: t('dashboard.approvedRequests'),
      value: requests.filter(r => r.status === 'approved').length,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      title: 'طلبات مرفوضة',
      value: requests.filter(r => r.status === 'rejected').length,
      icon: XCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
    },
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
              {language === 'ar' ? 'مشرف أكاديمي - قسم نظم المعلومات الإدارية' : 'Academic Advisor - MIS Department'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{requests.filter(r => r.status === 'pending').length}</p>
              <p className="text-sm text-white/70">طلبات معلقة</p>
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Requests */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('requests.pendingRequests')}
            </h2>
            <Link
              to="/advisor/requests"
              className="text-primary-800 dark:text-primary-400 text-sm font-medium hover:underline flex items-center gap-1"
            >
              {t('common.viewDetails')}
              <Arrow className="w-4 h-4" />
            </Link>
          </div>

          {requests.filter(r => r.status === 'pending').length === 0 ? (
            <div className="text-center py-8">
              <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">{t('requests.noRequests')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests
                .filter(r => r.status === 'pending')
                .slice(0, 5)
                .map((request, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-xl"
                  >
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {request.student?.full_name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {language === 'ar' ? request.course?.name_ar : request.course?.name_en}
                      </p>
                    </div>
                    <span className="text-xs text-yellow-600 dark:text-yellow-400">
                      {t(`requests.${request.request_type}`)}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </motion.div>

        {/* Students List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('students.myStudents')}
            </h2>
            <Link
              to="/advisor/students"
              className="text-primary-800 dark:text-primary-400 text-sm font-medium hover:underline flex items-center gap-1"
            >
              {t('common.viewDetails')}
              <Arrow className="w-4 h-4" />
            </Link>
          </div>

          {students.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">{t('students.noStudents')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {students.slice(0, 5).map((student, index) => (
                <Link
                  key={index}
                  to={`/advisor/students/${student.id}`}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-800 dark:text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {student.full_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {student.student_id} • المستوى {student.level}
                    </p>
                  </div>
                  <Arrow className="w-5 h-5 text-gray-400" />
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Stats Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          ملخص الإحصائيات
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <TrendingUp className="w-10 h-10 text-primary-800 dark:text-primary-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {students.length > 0 
                ? (students.reduce((sum, s) => sum + (s.level || 0), 0) / students.length).toFixed(1)
                : '0'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">متوسط المستوى</p>
          </div>
          
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <ClipboardList className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {requests.length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">إجمالي الطلبات</p>
          </div>
          
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {requests.length > 0 
                ? ((requests.filter(r => r.status === 'approved').length / requests.length) * 100).toFixed(0)
                : '0'}%
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">نسبة القبول</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdvisorDashboard;

