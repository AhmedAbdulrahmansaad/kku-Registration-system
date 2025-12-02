import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, BookOpen, ClipboardCheck, Settings,
  TrendingUp, ChevronLeft, ChevronRight, Shield,
  User, GraduationCap, BarChart3, RefreshCw, AlertCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, getCourses, getRequests } from '../../lib/supabase';
import { User as UserType, Course, Request } from '../../types';

const AdminDashboard: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const { user } = useAuth();
  const [users, setUsers] = useState<UserType[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching admin dashboard data...');
      
      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (usersError) {
        console.error('Error fetching users:', usersError);
      } else {
        console.log(`✅ Fetched ${usersData?.length || 0} users`);
        setUsers(usersData || []);
      }

      // Fetch all courses
      const coursesData = await getCourses();
      console.log(`✅ Fetched ${coursesData?.length || 0} courses`);
      setCourses(coursesData || []);

      // Fetch all requests
      const requestsData = await getRequests();
      console.log(`✅ Fetched ${requestsData?.length || 0} requests`);
      setRequests(requestsData || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const stats = {
    totalUsers: users.length,
    students: users.filter(u => u.role === 'student').length,
    advisors: users.filter(u => u.role === 'advisor').length,
    admins: users.filter(u => u.role === 'admin').length,
    totalCourses: courses.length,
    totalRequests: requests.length,
    pendingRequests: requests.filter(r => r.status === 'pending').length,
  };

  const userDistribution = [
    { name: language === 'ar' ? 'طلاب' : 'Students', value: stats.students, color: '#3B82F6' },
    { name: language === 'ar' ? 'مرشدين' : 'Advisors', value: stats.advisors, color: '#8B5CF6' },
    { name: language === 'ar' ? 'مدراء' : 'Admins', value: stats.admins, color: '#EF4444' },
  ];

  const levelDistribution = [1, 2, 3, 4, 5, 6, 7, 8].map(level => ({
    level: language === 'ar' ? `المستوى ${level}` : `Level ${level}`,
    courses: courses.filter(c => c.level === level).length,
    students: users.filter(u => u.level === level && u.role === 'student').length,
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
        className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 rounded-3xl p-8 text-white relative overflow-hidden"
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
              {language === 'ar' ? 'مدير النظام' : 'System Administrator'}
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
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
          <p className="text-gray-500 dark:text-gray-400">{language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/30">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalCourses}</p>
          <p className="text-gray-500 dark:text-gray-400">{language === 'ar' ? 'إجمالي المقررات' : 'Total Courses'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
            <ClipboardCheck className="w-6 h-6 text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalRequests}</p>
          <p className="text-gray-500 dark:text-gray-400">{language === 'ar' ? 'إجمالي الطلبات' : 'Total Requests'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/30">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pendingRequests}</p>
          <p className="text-gray-500 dark:text-gray-400">{language === 'ar' ? 'طلبات معلقة' : 'Pending Requests'}</p>
        </motion.div>
      </div>

      {/* Detailed Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            {language === 'ar' ? 'توزيع المستخدمين' : 'Users Distribution'}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'طلاب' : 'Students'}</span>
              <span className="font-bold text-blue-600">{stats.students}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'مرشدين' : 'Advisors'}</span>
              <span className="font-bold text-purple-600">{stats.advisors}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'مدراء' : 'Admins'}</span>
              <span className="font-bold text-red-600">{stats.admins}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            {language === 'ar' ? 'توزيع المستويات' : 'Level Distribution'}
          </h3>
          {levelDistribution.some(l => l.courses > 0 || l.students > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={levelDistribution}>
                <XAxis dataKey="level" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="courses" fill="#10B981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="students" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-200 flex items-center justify-center text-gray-400">
              {language === 'ar' ? 'لا توجد بيانات بعد' : 'No data yet'}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-600" />
            {language === 'ar' ? 'المستخدمين' : 'Users'}
          </h3>
          {userDistribution.some(u => u.value > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-200 flex items-center justify-center text-gray-400">
              {language === 'ar' ? 'لا توجد بيانات بعد' : 'No data yet'}
            </div>
          )}
        </motion.div>
      </div>

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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/courses"
            className="flex flex-col items-center gap-3 p-6 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
          >
            <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-green-500/30">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <span className="font-medium text-green-800 dark:text-green-400 text-center">
              {language === 'ar' ? 'إدارة المقررات' : 'Manage Courses'}
            </span>
          </Link>

          <Link
            to="/admin/users"
            className="flex flex-col items-center gap-3 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
          >
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
              <Users className="w-7 h-7 text-white" />
            </div>
            <span className="font-medium text-blue-800 dark:text-blue-400 text-center">
              {language === 'ar' ? 'إدارة المستخدمين' : 'Manage Users'}
            </span>
          </Link>

          <Link
            to="/admin/settings"
            className="flex flex-col items-center gap-3 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group"
          >
            <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <span className="font-medium text-purple-800 dark:text-purple-400 text-center">
              {language === 'ar' ? 'إعدادات النظام' : 'System Settings'}
            </span>
          </Link>

          <div className="flex flex-col items-center gap-3 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="w-14 h-14 bg-gray-400 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <span className="font-medium text-gray-600 dark:text-gray-400 text-center">
              {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-red-600" />
              {language === 'ar' ? 'المستخدمون الجدد' : 'Recent Users'}
            </h3>
            <Link 
              to="/admin/users" 
              className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
            >
              {t('common.viewAll')}
              {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Link>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">{language === 'ar' ? 'لا يوجد مستخدمون بعد' : 'No users yet'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.slice(0, 5).map((userItem, index) => (
                <motion.div
                  key={userItem.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    userItem.role === 'student' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    userItem.role === 'advisor' ? 'bg-purple-100 dark:bg-purple-900/30' :
                    'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    <User className={`w-5 h-5 ${
                      userItem.role === 'student' ? 'text-blue-600' :
                      userItem.role === 'advisor' ? 'text-purple-600' :
                      'text-red-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {userItem.full_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {userItem.email} • {userItem.role}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-green-600" />
              {language === 'ar' ? 'المقررات المتاحة' : 'Available Courses'}
            </h3>
            <Link 
              to="/admin/courses" 
              className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
            >
              {t('common.viewAll')}
              {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">{language === 'ar' ? 'لا توجد مقررات بعد' : 'No courses yet'}</p>
              <Link
                to="/admin/courses"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
              >
                {language === 'ar' ? 'إضافة مقرر جديد' : 'Add new course'}
                <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {courses.slice(0, 5).map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {language === 'ar' ? course.name_ar : course.name_en}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {course.course_code} • {language === 'ar' ? `المستوى ${course.level}` : `Level ${course.level}`}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
