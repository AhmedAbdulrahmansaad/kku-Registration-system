import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, BookOpen, ClipboardCheck, Settings,
  TrendingUp, ChevronLeft, ChevronRight, Shield,
  User, GraduationCap, BarChart3
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { User as UserType, Course, Request } from '../../types';

const AdminDashboard: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const { user } = useAuth();
  const [users, setUsers] = useState<UserType[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, coursesRes, requestsRes] = await Promise.all([
          supabase.from('users').select('*'),
          supabase.from('courses').select('*'),
          supabase.from('requests').select('*'),
        ]);
        
        setUsers(usersRes.data || []);
        setCourses(coursesRes.data || []);
        setRequests(requestsRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    level: language === 'ar' ? `${level}` : `L${level}`,
    courses: courses.filter(c => c.level === level).length,
    students: users.filter(u => u.level === level).length,
  }));

  const monthlyData = [
    { month: language === 'ar' ? 'يناير' : 'Jan', users: 120, requests: 45 },
    { month: language === 'ar' ? 'فبراير' : 'Feb', users: 145, requests: 62 },
    { month: language === 'ar' ? 'مارس' : 'Mar', users: 178, requests: 89 },
    { month: language === 'ar' ? 'أبريل' : 'Apr', users: 205, requests: 72 },
    { month: language === 'ar' ? 'مايو' : 'May', users: 248, requests: 95 },
    { month: language === 'ar' ? 'يونيو' : 'Jun', users: 290, requests: 110 },
  ];

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
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{user?.full_name}</h1>
            <p className="text-white/80 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {language === 'ar' ? 'مدير النظام' : 'System Administrator'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/settings"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors px-6 py-3 rounded-xl flex items-center gap-2 font-semibold"
            >
              <Settings className="w-5 h-5" />
              {language === 'ar' ? 'الإعدادات' : 'Settings'}
            </Link>
          </div>
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
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
          <p className="text-gray-500 dark:text-gray-400">{language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/30">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalCourses}</p>
          <p className="text-gray-500 dark:text-gray-400">{language === 'ar' ? 'المقررات' : 'Courses'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
            <ClipboardCheck className="w-6 h-6 text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalRequests}</p>
          <p className="text-gray-500 dark:text-gray-400">{language === 'ar' ? 'الطلبات' : 'Requests'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/30">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.students}</p>
          <p className="text-gray-500 dark:text-gray-400">{language === 'ar' ? 'الطلاب' : 'Students'}</p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-red-600" />
            {language === 'ar' ? 'توزيع المستخدمين' : 'User Distribution'}
          </h3>
          <div className="flex items-center gap-8">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistribution}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {userDistribution.map((stat) => (
                <div key={stat.name} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: stat.color }} />
                  <span className="text-gray-600 dark:text-gray-400 flex-1">{stat.name}</span>
                  <span className="font-bold text-gray-900 dark:text-white">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-600" />
            {language === 'ar' ? 'نمو المستخدمين' : 'User Growth'}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(255,255,255,0.9)', 
                  border: 'none', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#DC2626" 
                strokeWidth={3}
                fill="url(#userGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Courses by Level */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-red-600" />
          {language === 'ar' ? 'المقررات حسب المستوى' : 'Courses by Level'}
        </h3>
        <ResponsiveContainer width="100%" height={250}>
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
            <Bar dataKey="courses" fill="#184A2C" radius={[8, 8, 0, 0]} name={language === 'ar' ? 'المقررات' : 'Courses'} />
            <Bar dataKey="students" fill="#D4AF37" radius={[8, 8, 0, 0]} name={language === 'ar' ? 'الطلاب' : 'Students'} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link
            to="/admin/courses"
            className="block bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group"
          >
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-7 h-7 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {t('admin.manageCourses')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {language === 'ar' ? 'إضافة وتعديل وحذف المقررات' : 'Add, edit, and delete courses'}
            </p>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Link
            to="/admin/users"
            className="block bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group"
          >
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {t('admin.manageUsers')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {language === 'ar' ? 'إدارة حسابات المستخدمين' : 'Manage user accounts'}
            </p>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Link
            to="/admin/settings"
            className="block bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group"
          >
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Settings className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {t('nav.settings')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {language === 'ar' ? 'إعدادات النظام' : 'System settings'}
            </p>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
