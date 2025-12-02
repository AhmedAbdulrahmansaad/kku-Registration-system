import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, BookOpen, ClipboardList, TrendingUp,
  ChevronLeft, ChevronRight, Settings, BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const AdminDashboard: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalAdvisors: 0,
    totalCourses: 0,
    totalRequests: 0,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, coursesRes, requestsRes] = await Promise.all([
          supabase.from('users').select('role'),
          supabase.from('courses').select('id'),
          supabase.from('requests').select('status'),
        ]);

        const users = usersRes.data || [];
        const courses = coursesRes.data || [];
        const requests = requestsRes.data || [];

        setStats({
          totalUsers: users.length,
          totalStudents: users.filter(u => u.role === 'student').length,
          totalAdvisors: users.filter(u => u.role === 'advisor').length,
          totalCourses: courses.length,
          totalRequests: requests.length,
          pendingRequests: requests.filter(r => r.status === 'pending').length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const Arrow = isRTL ? ChevronLeft : ChevronRight;

  const statsCards = [
    {
      title: t('dashboard.totalStudents'),
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: 'المشرفين الأكاديميين',
      value: stats.totalAdvisors,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      title: t('dashboard.totalCourses'),
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'bg-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      title: t('dashboard.pendingRequests'),
      value: stats.pendingRequests,
      icon: ClipboardList,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
  ];

  const levelDistribution = [
    { name: 'المستوى 1', value: 15 },
    { name: 'المستوى 2', value: 22 },
    { name: 'المستوى 3', value: 28 },
    { name: 'المستوى 4', value: 35 },
    { name: 'المستوى 5', value: 42 },
    { name: 'المستوى 6', value: 38 },
    { name: 'المستوى 7', value: 25 },
    { name: 'المستوى 8', value: 18 },
  ];

  const roleDistribution = [
    { name: 'طلاب', value: stats.totalStudents, color: '#184A2C' },
    { name: 'مشرفين', value: stats.totalAdvisors, color: '#D4AF37' },
    { name: 'مدراء', value: stats.totalUsers - stats.totalStudents - stats.totalAdvisors, color: '#3baa5e' },
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
              {language === 'ar' ? 'لوحة تحكم مدير النظام' : 'System Administrator Dashboard'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/settings"
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors"
            >
              <Settings className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsCards.map((stat, index) => (
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
          <Link
            to="/admin/courses"
            className="bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <BookOpen className="w-8 h-8 mb-4" />
            <p className="font-semibold">{t('admin.manageCourses')}</p>
          </Link>
          <Link
            to="/admin/users"
            className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <Users className="w-8 h-8 mb-4" />
            <p className="font-semibold">{t('admin.manageUsers')}</p>
          </Link>
          <Link
            to="/admin/courses"
            className="bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <BarChart3 className="w-8 h-8 mb-4" />
            <p className="font-semibold">{t('admin.systemStats')}</p>
          </Link>
          <Link
            to="/admin/settings"
            className="bg-gradient-to-br from-orange-600 to-orange-800 text-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <Settings className="w-8 h-8 mb-4" />
            <p className="font-semibold">{t('nav.settings')}</p>
          </Link>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Level Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            توزيع الطلاب حسب المستوى
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={levelDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" fill="#184A2C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Role Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            توزيع المستخدمين
          </h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            {roleDistribution.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {entry.name}: {entry.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* System Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          معلومات النظام
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">إجمالي المستخدمين</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">إجمالي الطلبات</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRequests}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">الفصل الدراسي</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">الثاني 2024</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;

