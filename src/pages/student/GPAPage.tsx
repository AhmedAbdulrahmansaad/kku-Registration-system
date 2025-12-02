import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calculator, Award, Target, Plus, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { getEnrollments, calculateGPA } from '../../lib/supabase';
import { Enrollment } from '../../types';

interface SimulatedCourse {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

const GPAPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [gpaData, setGpaData] = useState({ gpa: 0, completedCredits: 0, totalCredits: 140 });
  const [loading, setLoading] = useState(true);
  const [simulatedCourses, setSimulatedCourses] = useState<SimulatedCourse[]>([]);
  const [newCourse, setNewCourse] = useState({ name: '', credits: 3, grade: 'A' });

  const grades = [
    { value: 'A+', points: 5.0, label: 'A+ (5.0)' },
    { value: 'A', points: 4.75, label: 'A (4.75)' },
    { value: 'B+', points: 4.5, label: 'B+ (4.5)' },
    { value: 'B', points: 4.0, label: 'B (4.0)' },
    { value: 'C+', points: 3.5, label: 'C+ (3.5)' },
    { value: 'C', points: 3.0, label: 'C (3.0)' },
    { value: 'D+', points: 2.5, label: 'D+ (2.5)' },
    { value: 'D', points: 2.0, label: 'D (2.0)' },
    { value: 'F', points: 0, label: 'F (0)' },
  ];

  const getGradePoints = (grade: string) => {
    return grades.find(g => g.value === grade)?.points || 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const gpa = await calculateGPA(user.id);
        setGpaData(gpa);
      } catch (error) {
        console.error('Error fetching GPA:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const calculateSimulatedGPA = () => {
    const totalExistingPoints = gpaData.gpa * gpaData.completedCredits;
    const totalExistingCredits = gpaData.completedCredits;

    let simulatedPoints = 0;
    let simulatedCredits = 0;

    simulatedCourses.forEach(course => {
      simulatedPoints += getGradePoints(course.grade) * course.credits;
      simulatedCredits += course.credits;
    });

    const totalPoints = totalExistingPoints + simulatedPoints;
    const totalCredits = totalExistingCredits + simulatedCredits;

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const addSimulatedCourse = () => {
    if (!newCourse.name) return;
    
    setSimulatedCourses([
      ...simulatedCourses,
      {
        id: Date.now().toString(),
        name: newCourse.name,
        credits: newCourse.credits,
        grade: newCourse.grade,
      },
    ]);
    setNewCourse({ name: '', credits: 3, grade: 'A' });
  };

  const removeSimulatedCourse = (id: string) => {
    setSimulatedCourses(simulatedCourses.filter(c => c.id !== id));
  };

  const getGPAClassification = (gpa: number) => {
    if (gpa >= 4.5) return { text: language === 'ar' ? 'ممتاز' : 'Excellent', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' };
    if (gpa >= 3.75) return { text: language === 'ar' ? 'جيد جداً' : 'Very Good', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' };
    if (gpa >= 2.75) return { text: language === 'ar' ? 'جيد' : 'Good', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' };
    if (gpa >= 2.0) return { text: language === 'ar' ? 'مقبول' : 'Acceptable', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' };
    return { text: language === 'ar' ? 'ضعيف' : 'Weak', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' };
  };

  const classification = getGPAClassification(gpaData.gpa);
  const simulatedGPA = calculateSimulatedGPA();
  const simulatedClassification = getGPAClassification(simulatedGPA);

  const progressData = [
    { name: language === 'ar' ? 'منجز' : 'Completed', value: gpaData.completedCredits },
    { name: language === 'ar' ? 'متبقي' : 'Remaining', value: gpaData.totalCredits - gpaData.completedCredits },
  ];

  const COLORS = ['#184A2C', '#e5e7eb'];

  const semesterData = [
    { semester: '1', gpa: 4.2 },
    { semester: '2', gpa: 4.4 },
    { semester: '3', gpa: 4.1 },
    { semester: '4', gpa: 4.5 },
    { semester: '5', gpa: 4.3 },
  ];

  const gradeDistribution = grades.slice(0, 5).map(g => ({
    grade: g.value,
    count: Math.floor(Math.random() * 10) + 1,
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('nav.gpa')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {language === 'ar' ? 'حساب ومتابعة المعدل التراكمي' : 'Calculate and track your GPA'}
        </p>
      </div>

      {/* Current GPA Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary-800 to-primary-600 rounded-2xl p-6 text-white"
        >
          <TrendingUp className="w-10 h-10 mb-3 text-white/80" />
          <p className="text-4xl font-bold">{gpaData.gpa.toFixed(2)}</p>
          <p className="text-white/80">{t('dashboard.gpa')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <Award className="w-10 h-10 mb-3 text-secondary-500" />
          <p className={`text-2xl font-bold ${classification.color}`}>{classification.text}</p>
          <p className="text-gray-500 dark:text-gray-400">{language === 'ar' ? 'التقدير' : 'Classification'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <Target className="w-10 h-10 mb-3 text-blue-500" />
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{gpaData.completedCredits}</p>
          <p className="text-gray-500 dark:text-gray-400">{t('dashboard.completedCredits')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <Calculator className="w-10 h-10 mb-3 text-purple-500" />
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            {Math.round((gpaData.completedCredits / gpaData.totalCredits) * 100)}%
          </p>
          <p className="text-gray-500 dark:text-gray-400">{language === 'ar' ? 'نسبة الإنجاز' : 'Progress'}</p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-600" />
            {language === 'ar' ? 'التقدم الأكاديمي' : 'Academic Progress'}
          </h3>
          <div className="flex items-center justify-center">
            <div className="w-48 h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={progressData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {progressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-600">
                    {Math.round((gpaData.completedCredits / gpaData.totalCredits) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-4">
            {progressData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* GPA Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            {language === 'ar' ? 'تطور المعدل' : 'GPA Trend'}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={semesterData}>
              <defs>
                <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#184A2C" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#184A2C" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="semester" axisLine={false} tickLine={false} />
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
        </motion.div>
      </div>

      {/* GPA Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary-600" />
          {language === 'ar' ? 'حاسبة المعدل المتوقع' : 'GPA Calculator'}
        </h3>

        {/* Add Course Form */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            value={newCourse.name}
            onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
            placeholder={language === 'ar' ? 'اسم المقرر' : 'Course Name'}
            className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 outline-none"
          />
          <select
            value={newCourse.credits}
            onChange={(e) => setNewCourse({ ...newCourse, credits: Number(e.target.value) })}
            className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 outline-none"
          >
            {[1, 2, 3, 4, 5].map(c => (
              <option key={c} value={c}>{c} {language === 'ar' ? 'ساعات' : 'Credits'}</option>
            ))}
          </select>
          <select
            value={newCourse.grade}
            onChange={(e) => setNewCourse({ ...newCourse, grade: e.target.value })}
            className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 outline-none"
          >
            {grades.map(g => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
          <button
            onClick={addSimulatedCourse}
            className="bg-primary-800 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {t('common.add')}
          </button>
        </div>

        {/* Simulated Courses List */}
        {simulatedCourses.length > 0 && (
          <div className="space-y-2 mb-6">
            {simulatedCourses.map(course => (
              <div
                key={course.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{course.name}</p>
                  <p className="text-sm text-gray-500">{course.credits} {t('courses.creditHours')} • {course.grade}</p>
                </div>
                <button
                  onClick={() => removeSimulatedCourse(course.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Simulated GPA Result */}
        {simulatedCourses.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {language === 'ar' ? 'المعدل الحالي' : 'Current GPA'}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{gpaData.gpa.toFixed(2)}</p>
              <p className={`text-sm ${classification.color}`}>{classification.text}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {language === 'ar' ? 'المعدل المتوقع' : 'Expected GPA'}
              </p>
              <p className="text-3xl font-bold text-primary-600">{simulatedGPA.toFixed(2)}</p>
              <p className={`text-sm ${simulatedClassification.color}`}>{simulatedClassification.text}</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Grading Scale */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          {language === 'ar' ? 'نظام الدرجات' : 'Grading Scale'}
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {grades.map(grade => (
            <div
              key={grade.value}
              className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
            >
              <p className="text-2xl font-bold text-primary-600">{grade.value}</p>
              <p className="text-sm text-gray-500">{grade.points.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GPAPage;
