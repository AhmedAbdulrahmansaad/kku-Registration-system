import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, ClipboardCheck, Clock, CheckCircle, XCircle,
  TrendingUp, ChevronLeft, ChevronRight, User, BookOpen, RefreshCw, AlertCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, getRequests } from '../../lib/supabase';
import { User as UserType, Request } from '../../types';

const AdvisorDashboard: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const { user } = useAuth();
  const [students, setStudents] = useState<UserType[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching advisor dashboard data...');
      
      // Fetch all students
      const { data: studentsData, error: studentsError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false });
      
      if (studentsError) {
        console.error('Error fetching students:', studentsError);
      } else {
        console.log(`✅ Fetched ${studentsData?.length || 0} students`);
        setStudents(studentsData || []);
      }

      // Fetch all requests
      const requestsData = await getRequests();
      console.log(`✅ Fetched ${requestsData?.length || 0} requests`);
      setRequests(requestsData || []);
    } catch (error) {
      console.error('Error fetching advisor data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const rejectedRequests = requests.filter(r => r.status === 'rejected');

  const requestStats = [
    { name: language === 'ar' ? 'معلق' : 'Pending', value: pendingRequests.length, color: '#F59E0B' },
    { name: language === 'ar' ? 'موافق' : 'Approved', value: approvedRequests.length, color: '#10B981' },
    { name: language === 'ar' ? 'مرفوض' : 'Rejected', value: rejectedRequests.length, color: '#EF4444' },
  ];

  const levelDistribution = [1, 2, 3, 4, 5, 6, 7, 8].map(level => ({
    level: language === 'ar' ? `المستوى ${level}` : `Level ${level}`,
    count: students.filter(s => s.level === level).length,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          {language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please login first'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-white/80 mb-1">
              {language === 'ar' ? 'مرحباً بك،' : 'Welcome back,'}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{user.full_name}</h1>
            <p className="text-white/80">
              {language === 'ar' ? 'المرشد الأكاديمي' : 'Academic Advisor'}
            </p>
          </div>
          <button
            onClick={fetchData}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            title={language === 'ar' ? 'تحديث' : 'Refresh'}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
            <Users className="w-6 h-6 text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{students.length}</p>
          <p className="text-gray-500 dark:text-gray-400">{language === 'ar' ? 'إجمالي الطلاب' : 'Total Students'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/30">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{pendingRequests.length}</p>
          <p className="text-gray-500 dark:text-gray-400">{language === 'ar' ? 'طلبات معلقة' : 'Pending Requests'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/30">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{approvedRequests.length}</p>
          <p className="text-gray-500 dark:text-gray-400">{language === 'ar' ? 'طلبات موافق عليها' : 'Approved Requests'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-red-500/30">
            <XCircle className="w-6 h-6 text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{rejectedRequests.length}</p>
          <p className="text-gray-500 dark:text-gray-400">{language === 'ar' ? 'طلبات مرفوضة' : 'Rejected Requests'}</p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Requests Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-purple-600" />
            {language === 'ar' ? 'توزيع الطلبات' : 'Requests Distribution'}
          </h3>
          {requestStats.some(s => s.value > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={requestStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {requestStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-250 flex items-center justify-center text-gray-400">
              {language === 'ar' ? 'لا توجد طلبات بعد' : 'No requests yet'}
            </div>
          )}
        </motion.div>

        {/* Students by Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            {language === 'ar' ? 'توزيع الطلاب حسب المستوى' : 'Students by Level'}
          </h3>
          {levelDistribution.some(l => l.count > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={levelDistribution}>
                <XAxis dataKey="level" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#7C3AED" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-250 flex items-center justify-center text-gray-400">
              {language === 'ar' ? 'لا توجد بيانات بعد' : 'No data yet'}
            </div>
          )}
        </motion.div>
      </div>

      {/* Pending Requests & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              {language === 'ar' ? 'طلبات بانتظار المراجعة' : 'Pending Requests'}
            </h3>
            <Link 
              to="/advisor/requests" 
              className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
            >
              {t('common.viewAll')}
              {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Link>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">{language === 'ar' ? 'لا توجد طلبات معلقة' : 'No pending requests'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.slice(0, 5).map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors border border-yellow-200 dark:border-yellow-800"
                >
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {language === 'ar' ? request.course?.name_ar : request.course?.name_en}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {request.student?.full_name} • {request.student?.student_id}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 text-sm rounded-full font-medium">
                    {t('common.pending')}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
          </h3>
          <div className="space-y-3">
            <Link
              to="/advisor/requests"
              className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group"
            >
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ClipboardCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-purple-800 dark:text-purple-400">
                {language === 'ar' ? 'مراجعة الطلبات' : 'Review Requests'}
              </span>
            </Link>

            <Link
              to="/advisor/students"
              className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-blue-800 dark:text-blue-400">
                {language === 'ar' ? 'قائمة الطلاب' : 'Students List'}
              </span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Recent Students */}
      {students.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              {language === 'ar' ? 'الطلاب المسجلين' : 'Registered Students'}
            </h3>
            <Link 
              to="/advisor/students" 
              className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
            >
              {t('common.viewAll')}
              {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.slice(0, 6).map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {student.full_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {student.student_id} • {language === 'ar' ? `المستوى ${student.level}` : `Level ${student.level}`}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdvisorDashboard;
