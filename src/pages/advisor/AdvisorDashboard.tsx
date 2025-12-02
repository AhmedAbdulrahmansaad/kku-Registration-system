import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, ClipboardCheck, Clock, CheckCircle, XCircle,
  TrendingUp, ChevronLeft, ChevronRight, User, BookOpen
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { User as UserType, Request } from '../../types';

const AdvisorDashboard: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const { user } = useAuth();
  const [students, setStudents] = useState<UserType[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, requestsRes] = await Promise.all([
          supabase.from('users').select('*').eq('role', 'student'),
          supabase.from('requests').select('*, course:courses(*), student:users!requests_student_id_fkey(*)'),
        ]);
        
        setStudents(studentsRes.data || []);
        setRequests(requestsRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const rejectedRequests = requests.filter(r => r.status === 'rejected');

  const requestStats = [
    { name: language === 'ar' ? 'معلق' : 'Pending', value: pendingRequests.length, color: '#F59E0B' },
    { name: language === 'ar' ? 'موافق' : 'Approved', value: approvedRequests.length, color: '#10B981' },
    { name: language === 'ar' ? 'مرفوض' : 'Rejected', value: rejectedRequests.length, color: '#EF4444' },
  ];

  const levelDistribution = [1, 2, 3, 4, 5, 6, 7, 8].map(level => ({
    level: language === 'ar' ? `${level}` : `L${level}`,
    count: students.filter(s => s.level === level).length,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin" />
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

        <div className="relative z-10">
          <p className="text-white/80 mb-1">
            {language === 'ar' ? 'مرحباً بك،' : 'Welcome back,'}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{user?.full_name}</h1>
          <p className="text-white/80">
            {language === 'ar' ? 'المرشد الأكاديمي' : 'Academic Advisor'}
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
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
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
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
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/30">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{approvedRequests.length}</p>
          <p className="text-gray-500 dark:text-gray-400">{language === 'ar' ? 'طلبات موافق عليها' : 'Approved'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-red-500/30">
            <XCircle className="w-6 h-6 text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{rejectedRequests.length}</p>
          <p className="text-gray-500 dark:text-gray-400">{language === 'ar' ? 'طلبات مرفوضة' : 'Rejected'}</p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Request Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-purple-600" />
            {language === 'ar' ? 'إحصائيات الطلبات' : 'Request Statistics'}
          </h3>
          <div className="flex items-center gap-8">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={requestStats}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {requestStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {requestStats.map((stat) => (
                <div key={stat.name} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: stat.color }} />
                  <span className="text-gray-600 dark:text-gray-400 flex-1">{stat.name}</span>
                  <span className="font-bold text-gray-900 dark:text-white">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Level Distribution */}
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
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={levelDistribution}>
              <XAxis dataKey="level" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(255,255,255,0.9)', 
                  border: 'none', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              />
              <Bar dataKey="count" fill="#7C3AED" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Pending Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            {language === 'ar' ? 'الطلبات المعلقة' : 'Pending Requests'}
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
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {language === 'ar' ? 'لا توجد طلبات معلقة' : 'No pending requests'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.slice(0, 5).map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {request.student?.full_name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {language === 'ar' ? request.course?.name_ar : request.course?.name_en}
                  </p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-sm rounded-full">
                  {t('common.pending')}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Recent Students */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            {language === 'ar' ? 'أحدث الطلاب' : 'Recent Students'}
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
              transition={{ delay: 0.9 + index * 0.05 }}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{student.full_name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{student.student_id}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdvisorDashboard;
