import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Printer, GraduationCap, TrendingUp, Award } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { getEnrollments, calculateGPA } from '../../lib/supabase';
import { Enrollment } from '../../types';

const TranscriptPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [gpaData, setGpaData] = useState({ gpa: 0, completedCredits: 0, totalCredits: 140 });
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
        console.error('Error fetching transcript:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getGradeColor = (grade: string | undefined) => {
    if (!grade) return 'text-gray-600';
    if (grade.startsWith('A')) return 'text-green-600 dark:text-green-400';
    if (grade.startsWith('B')) return 'text-blue-600 dark:text-blue-400';
    if (grade.startsWith('C')) return 'text-yellow-600 dark:text-yellow-400';
    if (grade.startsWith('D')) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getGPAClassification = (gpa: number) => {
    if (gpa >= 4.5) return { text: language === 'ar' ? 'ممتاز' : 'Excellent', color: 'text-green-600' };
    if (gpa >= 3.75) return { text: language === 'ar' ? 'جيد جداً' : 'Very Good', color: 'text-blue-600' };
    if (gpa >= 2.75) return { text: language === 'ar' ? 'جيد' : 'Good', color: 'text-yellow-600' };
    if (gpa >= 2.0) return { text: language === 'ar' ? 'مقبول' : 'Acceptable', color: 'text-orange-600' };
    return { text: language === 'ar' ? 'ضعيف' : 'Weak', color: 'text-red-600' };
  };

  const classification = getGPAClassification(gpaData.gpa);

  // Group enrollments by semester
  const groupedEnrollments = enrollments.reduce((acc, enrollment) => {
    const key = `${enrollment.semester}-${enrollment.year}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(enrollment);
    return acc;
  }, {} as Record<string, Enrollment[]>);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('transcript.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {user?.full_name} - {user?.student_id}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Printer className="w-5 h-5" />
            {t('transcript.print')}
          </button>
          <button className="flex items-center gap-2 bg-primary-800 text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-700 transition-colors">
            <Download className="w-5 h-5" />
            {t('transcript.download')}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary-800 to-primary-600 rounded-2xl p-6 text-white"
        >
          <TrendingUp className="w-10 h-10 mb-3 text-white/80" />
          <p className="text-4xl font-bold">{gpaData.gpa.toFixed(2)}</p>
          <p className="text-white/80">{t('transcript.cumulativeGPA')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <Award className="w-10 h-10 mb-3 text-secondary-500" />
          <p className={`text-2xl font-bold ${classification.color}`}>{classification.text}</p>
          <p className="text-gray-500 dark:text-gray-400">{language === 'ar' ? 'التقدير العام' : 'Classification'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <GraduationCap className="w-10 h-10 mb-3 text-blue-500" />
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{gpaData.completedCredits}</p>
          <p className="text-gray-500 dark:text-gray-400">{t('dashboard.completedCredits')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <FileText className="w-10 h-10 mb-3 text-purple-500" />
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{enrollments.length}</p>
          <p className="text-gray-500 dark:text-gray-400">{language === 'ar' ? 'مقررات منجزة' : 'Completed Courses'}</p>
        </motion.div>
      </div>

      {/* Transcript Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
      >
        {/* University Header for Print */}
        <div className="hidden print:block p-6 text-center border-b">
          <h1 className="text-2xl font-bold">{language === 'ar' ? 'جامعة الملك خالد' : 'King Khalid University'}</h1>
          <p>{language === 'ar' ? 'كلية إدارة الأعمال - قسم نظم المعلومات الإدارية' : 'College of Business - MIS Department'}</p>
          <h2 className="text-xl font-bold mt-4">{t('transcript.title')}</h2>
        </div>

        <div className="p-6 border-b border-gray-200 dark:border-gray-700 print:hidden">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600" />
            {language === 'ar' ? 'السجل الأكاديمي التفصيلي' : 'Detailed Academic Record'}
          </h2>
        </div>

        {enrollments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">{t('transcript.noRecords')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('courses.courseCode')}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('courses.courseName')}
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('courses.creditHours')}
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('transcript.grade')}
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('transcript.points')}
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('transcript.semester')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-lg text-sm font-medium">
                        {enrollment.course?.course_code}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                      {language === 'ar' ? enrollment.course?.name_ar : enrollment.course?.name_en}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">
                      {enrollment.course?.credit_hours}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold text-lg ${getGradeColor(enrollment.grade)}`}>
                        {enrollment.grade || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">
                      {enrollment.gpa_points?.toFixed(2) || '-'}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">
                      {enrollment.semester} {enrollment.year}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">
                    {language === 'ar' ? 'الإجمالي' : 'Total'}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-gray-900 dark:text-white">
                    {gpaData.completedCredits}
                  </td>
                  <td colSpan={2} className="px-6 py-4 text-center">
                    <span className="text-primary-600 dark:text-primary-400 font-bold">
                      {t('transcript.cumulativeGPA')}: {gpaData.gpa.toFixed(2)}
                    </span>
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TranscriptPage;
