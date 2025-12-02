import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, TrendingUp, Calendar, Bell, Clock,
  CheckCircle, AlertCircle, ChevronLeft, ChevronRight,
  FileText, Award, Target, ArrowRight, RefreshCw
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { getEnrollments, calculateGPA, getRequests } from '../../lib/supabase';
import { Enrollment, Request } from '../../types';

const StudentDashboard: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [gpaData, setGpaData] = useState({ gpa: 0, completedCredits: 0, totalCredits: 140 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log('Fetching dashboard data for user:', user.id);
      const [enrollmentsData, requestsData, gpa] = await Promise.all([
        getEnrollments(user.id),
        getRequests(user.id),
        calculateGPA(user.id),
      ]);
      
      console.log('Dashboard data fetched:', {
        enrollments: enrollmentsData?.length,
        requests: requestsData?.length,
        gpa: gpa.gpa
      });
      
      setEnrollments(enrollmentsData || []);
      setRequests(requestsData || []);
      setGpaData(gpa);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const currentCourses = enrollments.filter(e => e.status === 'current');
  const completedCourses = enrollments.filter(e => e.status === 'completed');
  const pendingRequests = requests.filter(r => r.status === 'pending');

  const getGPAClassification = (gpa: number) => {
    if (gpa >= 4.5) return { text: language === 'ar' ? 'ممتاز' : 'Excellent', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' };
    if (gpa >= 3.75) return { text: language === 'ar' ? 'جيد جداً' : 'Very Good', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' };
    if (gpa >= 2.75) return { text: language === 'ar' ? 'جيد' : 'Good', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' };
    if (gpa >= 2.0) return { text: language === 'ar' ? 'مقبول' : 'Acceptable', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' };
    return { text: language === 'ar' ? 'ضعيف' : 'Weak', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' };
  };

  const classification = getGPAClassification(gpaData.gpa);

  const progressData = [
    { name: language === 'ar' ? 'منجز' : 'Completed', value: gpaData.completedCredits },
    { name: language === 'ar' ? 'متبقي' : 'Remaining', value: Math.max(0, gpaData.totalCredits - gpaData.completedCredits) },
  ];

  const COLORS = ['#184A2C', '#e5e7eb'];

  // Calculate semester GPAs from enrollments
  const semesterGPAs = React.useMemo(() => {
    const semesters: Record<string, { points: number; credits: number }> = {};
    
    completedCourses.forEach(enrollment => {
      const key = `${enrollment.semester}-${enrollment.year}`;
      if (!semesters[key]) {
        semesters[key] = { points: 0, credits: 0 };
      }
      if (enrollment.grade && enrollment.course) {
        const gradePoints = {
          'A+': 5.0, 'A': 4.75, 'B+': 4.5, 'B': 4.0,
          'C+': 3.5, 'C': 3.0, 'D+': 2.5, 'D': 2.0, 'F': 0
        }[enrollment.grade] || 0;
        semesters[key].points += gradePoints * enrollment.course.credit_hours;
        semesters[key].credits += enrollment.course.credit_hours;
      }
    });

    return Object.entries(semesters)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(0, 5)
      .map(([key, data], index) => ({
        name: String(index + 1),
        gpa: data.credits > 0 ? data.points / data.credits : 0
      }));
  }, [completedCourses]);

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
        className="bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 rounded-3xl p-8 text-white relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-500 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-500 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-white/80 mb-1">
              {language === 'ar' ? 'مرحباً بك،' : 'Welcome back,'}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{user.full_name}</h1>
            <p className="text-white/80">
              {user.student_id} • {language === 'ar' ? `المستوى ${user.level}` : `Level ${user.level}`}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchData}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              title={language === 'ar' ? 'تحديث' : 'Refresh'}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <div className={`${classification.bg} rounded-2xl px-6 py-3`}>
              <p className={`text-lg font-bold ${classification.color}`}>{classification.text}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {language === 'ar' ? 'التقدير العام' : 'Overall Grade'}
              </p>
            </div>
          </div>
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
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
              {language === 'ar' ? 'حالي' : 'Current'}
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{currentCourses.length}</p>
          <p className="text-gray-500 dark:text-gray-400">{t('dashboard.currentCourses')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{gpaData.gpa.toFixed(2)}</p>
          <p className="text-gray-500 dark:text-gray-400">{t('dashboard.gpa')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{gpaData.completedCredits}</p>
          <p className="text-gray-500 dark:text-gray-400">{t('dashboard.completedCredits')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
              <Clock className="w-6 h-6 text-white" />
            </div>
            {pendingRequests.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {pendingRequests.length}
              </span>
            )}
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{pendingRequests.length}</p>
          <p className="text-gray-500 dark:text-gray-400">{t('dashboard.pendingRequests')}</p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-600" />
            {language === 'ar' ? 'التقدم الأكاديمي' : 'Academic Progress'}
          </h3>
          <div className="flex items-center gap-8">
            <div className="w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={progressData}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {progressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'الساعات المنجزة' : 'Completed Credits'}</span>
                    <span className="font-bold text-primary-600">{gpaData.completedCredits}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary-600 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${Math.min(100, (gpaData.completedCredits / gpaData.totalCredits) * 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'الساعات المتبقية' : 'Remaining Credits'}</span>
                    <span className="font-bold text-gray-400">{Math.max(0, gpaData.totalCredits - gpaData.completedCredits)}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gray-400 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${Math.min(100, ((gpaData.totalCredits - gpaData.completedCredits) / gpaData.totalCredits) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              <p className="mt-4 text-center text-2xl font-bold text-primary-600">
                {Math.round((gpaData.completedCredits / gpaData.totalCredits) * 100)}%
              </p>
            </div>
          </div>
        </motion.div>

        {/* GPA Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            {language === 'ar' ? 'تطور المعدل' : 'GPA Trend'}
          </h3>
          {semesterGPAs.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={semesterGPAs}>
                <defs>
                  <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#184A2C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#184A2C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} axisLine={false} tickLine={false} />
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
                  dataKey="gpa" 
                  stroke="#184A2C" 
                  strokeWidth={3}
                  fill="url(#gpaGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-200 flex items-center justify-center text-gray-400">
              {language === 'ar' ? 'لا توجد بيانات بعد' : 'No data yet'}
            </div>
          )}
        </motion.div>
      </div>

      {/* Current Courses & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Current Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-600" />
              {t('dashboard.currentCourses')}
            </h3>
            <Link 
              to="/student/registered" 
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
            >
              {t('common.viewAll')}
              {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Link>
          </div>

          {currentCourses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">{t('common.noData')}</p>
              <Link
                to="/student/courses"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                {language === 'ar' ? 'سجل مقرراتك الآن' : 'Register courses now'}
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {currentCourses.slice(0, 4).map((enrollment, index) => (
                <motion.div
                  key={enrollment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {language === 'ar' ? enrollment.course?.name_ar : enrollment.course?.name_en}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {enrollment.course?.course_code} • {enrollment.course?.credit_hours} {t('courses.creditHours')}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm rounded-full">
                    {language === 'ar' ? 'مسجل' : 'Registered'}
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
              to="/student/courses"
              className="flex items-center gap-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors group"
            >
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-primary-800 dark:text-primary-400">
                {language === 'ar' ? 'تسجيل مقررات' : 'Register Courses'}
              </span>
            </Link>

            <Link
              to="/student/schedule"
              className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-blue-800 dark:text-blue-400">
                {language === 'ar' ? 'عرض الجدول' : 'View Schedule'}
              </span>
            </Link>

            <Link
              to="/student/transcript"
              className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group"
            >
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-purple-800 dark:text-purple-400">
                {language === 'ar' ? 'السجل الأكاديمي' : 'Academic Record'}
              </span>
            </Link>

            <Link
              to="/student/gpa"
              className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
            >
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-green-800 dark:text-green-400">
                {language === 'ar' ? 'حاسبة المعدل' : 'GPA Calculator'}
              </span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-400">
              {language === 'ar' ? 'طلبات بانتظار الموافقة' : 'Pending Requests'}
            </h3>
          </div>
          <div className="space-y-2">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="text-gray-900 dark:text-white">
                    {language === 'ar' ? request.course?.name_ar : request.course?.name_en}
                  </span>
                </div>
                <span className="text-sm text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full">
                  {t('common.pending')}
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/student/requests"
            className="mt-4 inline-flex items-center gap-2 text-yellow-700 dark:text-yellow-400 font-medium hover:underline"
          >
            {language === 'ar' ? 'عرض جميع الطلبات' : 'View all requests'}
            {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default StudentDashboard;
