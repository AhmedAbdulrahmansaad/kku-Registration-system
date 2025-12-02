import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { getEnrollments, calculateGPA } from '../../lib/supabase';
import { Enrollment, GRADE_POINTS } from '../../types';

const GPAPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [gpaData, setGpaData] = useState({ gpa: 0, completedCredits: 0, totalCredits: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const [enrollmentsData, gpa] = await Promise.all([
          getEnrollments(user.id),
          calculateGPA(user.id),
        ]);
        
        setEnrollments(enrollmentsData?.filter(e => e.status === 'completed') || []);
        setGpaData(gpa);
      } catch (error) {
        console.error('Error fetching GPA data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Calculate semester GPAs for chart
  const semesterData = enrollments.reduce((acc, enrollment) => {
    const key = `${enrollment.semester}-${enrollment.year}`;
    if (!acc[key]) {
      acc[key] = {
        semester: `${enrollment.semester === 'fall' ? 'خريف' : enrollment.semester === 'spring' ? 'ربيع' : 'صيف'} ${enrollment.year}`,
        courses: [],
      };
    }
    acc[key].courses.push(enrollment);
    return acc;
  }, {} as Record<string, { semester: string; courses: Enrollment[] }>);

  const chartData = Object.values(semesterData).map(semester => {
    let totalPoints = 0;
    let totalCredits = 0;
    
    semester.courses.forEach(enrollment => {
      if (enrollment.grade && enrollment.course) {
        totalPoints += (GRADE_POINTS[enrollment.grade] || 0) * enrollment.course.credit_hours;
        totalCredits += enrollment.course.credit_hours;
      }
    });
    
    return {
      name: semester.semester,
      gpa: totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0,
    };
  });

  // Grade distribution for pie chart
  const gradeDistribution = enrollments.reduce((acc, enrollment) => {
    if (enrollment.grade) {
      acc[enrollment.grade] = (acc[enrollment.grade] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(gradeDistribution).map(([grade, count]) => ({
    name: grade,
    value: count,
  }));

  const COLORS = ['#184A2C', '#2d8848', '#3baa5e', '#D4AF37', '#e8c84d', '#f59e0b', '#ef4444', '#dc2626', '#b91c1c'];

  const getGPAClassification = (gpa: number) => {
    if (gpa >= 4.5) return { text: t('gpa.excellent'), color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' };
    if (gpa >= 3.75) return { text: t('gpa.veryGood'), color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' };
    if (gpa >= 2.75) return { text: t('gpa.good'), color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' };
    if (gpa >= 2.0) return { text: t('gpa.acceptable'), color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' };
    return { text: t('gpa.weak'), color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' };
  };

  const classification = getGPAClassification(gpaData.gpa);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('gpa.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {language === 'ar' ? 'تتبع معدلك التراكمي وتقدمك الأكاديمي' : 'Track your GPA and academic progress'}
        </p>
      </div>

      {/* GPA Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary-800 to-primary-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <p className="text-white/70 text-sm">{t('gpa.currentGPA')}</p>
              <p className="text-4xl font-bold">{gpaData.gpa.toFixed(2)}</p>
              <p className="text-sm text-white/70">من 5.00</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-6 ${classification.bg}`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center`}>
              <Award className={`w-8 h-8 ${classification.color}`} />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">التقدير</p>
              <p className={`text-3xl font-bold ${classification.color}`}>{classification.text}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl flex items-center justify-center">
              <Target className="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{t('transcript.completedCredits')}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{gpaData.completedCredits}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">من 140 ساعة</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-secondary-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((gpaData.completedCredits / 140) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {((gpaData.completedCredits / 140) * 100).toFixed(1)}% مكتمل
            </p>
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* GPA Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            {t('gpa.semesterProgress')}
          </h3>
          
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  domain={[0, 5]} 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [value.toFixed(2), 'المعدل']}
                />
                <Line 
                  type="monotone" 
                  dataKey="gpa" 
                  stroke="#184A2C" 
                  strokeWidth={3}
                  dot={{ fill: '#184A2C', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: '#D4AF37' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              {t('common.noData')}
            </div>
          )}
        </motion.div>

        {/* Grade Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            {t('gpa.gradeDistribution')}
          </h3>
          
          {pieData.length > 0 ? (
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              {t('common.noData')}
            </div>
          )}
          
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {entry.name}: {entry.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* GPA Scale Reference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          نظام الدرجات والنقاط
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
          {Object.entries(GRADE_POINTS).map(([grade, points]) => (
            <div 
              key={grade}
              className={`text-center p-4 rounded-xl ${
                points >= 4.5 
                  ? 'bg-green-100 dark:bg-green-900/30' 
                  : points >= 3.5
                  ? 'bg-blue-100 dark:bg-blue-900/30'
                  : points >= 2.5
                  ? 'bg-yellow-100 dark:bg-yellow-900/30'
                  : points >= 2.0
                  ? 'bg-orange-100 dark:bg-orange-900/30'
                  : 'bg-red-100 dark:bg-red-900/30'
              }`}
            >
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{grade}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{points.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GPAPage;

