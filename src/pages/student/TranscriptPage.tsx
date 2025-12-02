import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Printer, TrendingUp, Award } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { getEnrollments, calculateGPA } from '../../lib/supabase';
import { Enrollment, GRADE_POINTS } from '../../types';

const TranscriptPage: React.FC = () => {
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
        console.error('Error fetching transcript:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Group enrollments by semester
  const groupedEnrollments = enrollments.reduce((acc, enrollment) => {
    const key = `${enrollment.semester}-${enrollment.year}`;
    if (!acc[key]) {
      acc[key] = {
        semester: enrollment.semester,
        year: enrollment.year,
        courses: [],
      };
    }
    acc[key].courses.push(enrollment);
    return acc;
  }, {} as Record<string, { semester: string; year: number; courses: Enrollment[] }>);

  const calculateSemesterGPA = (courses: Enrollment[]) => {
    let totalPoints = 0;
    let totalCredits = 0;
    
    courses.forEach(enrollment => {
      if (enrollment.grade && enrollment.course) {
        totalPoints += (GRADE_POINTS[enrollment.grade] || 0) * enrollment.course.credit_hours;
        totalCredits += enrollment.course.credit_hours;
      }
    });
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const getSemesterName = (semester: string) => {
    const names: Record<string, string> = {
      fall: t('courses.fall'),
      spring: t('courses.spring'),
      summer: t('courses.summer'),
    };
    return names[semester] || semester;
  };

  const getGPAClassification = (gpa: number) => {
    if (gpa >= 4.5) return { text: t('gpa.excellent'), color: 'text-green-600 dark:text-green-400' };
    if (gpa >= 3.75) return { text: t('gpa.veryGood'), color: 'text-blue-600 dark:text-blue-400' };
    if (gpa >= 2.75) return { text: t('gpa.good'), color: 'text-yellow-600 dark:text-yellow-400' };
    if (gpa >= 2.0) return { text: t('gpa.acceptable'), color: 'text-orange-600 dark:text-orange-400' };
    return { text: t('gpa.weak'), color: 'text-red-600 dark:text-red-400' };
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  const classification = getGPAClassification(gpaData.gpa);

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
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="btn-outline flex items-center gap-2"
          >
            <Printer className="w-5 h-5" />
            {t('common.print')}
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Download className="w-5 h-5" />
            {t('common.export')} PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary-800 to-primary-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <p className="text-white/70 text-sm">{t('transcript.cumulativeGPA')}</p>
              <p className="text-3xl font-bold">{gpaData.gpa.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{t('transcript.completedCredits')}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{gpaData.completedCredits}</p>
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
            <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
              <Award className="w-7 h-7 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">التقدير</p>
              <p className={`text-2xl font-bold ${classification.color}`}>{classification.text}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Transcript Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden print:shadow-none"
      >
        {/* Student Info Header - Print Only */}
        <div className="hidden print:block p-6 border-b border-gray-200 text-center">
          <h2 className="text-2xl font-bold mb-2">جامعة الملك خالد</h2>
          <h3 className="text-lg mb-4">كلية إدارة الأعمال - قسم نظم المعلومات الإدارية</h3>
          <p>الاسم: {user?.full_name}</p>
          <p>الرقم الجامعي: {user?.student_id}</p>
          <p>التخصص: نظم المعلومات الإدارية</p>
        </div>

        {enrollments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">{t('transcript.noRecords')}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {Object.values(groupedEnrollments).map((semester, semesterIndex) => (
              <div key={semesterIndex} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    {getSemesterName(semester.semester)} {semester.year}
                  </h3>
                  <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400 px-3 py-1 rounded-full text-sm font-medium">
                    {t('transcript.semesterGPA')}: {calculateSemesterGPA(semester.courses)}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-gray-700">
                        <th className="text-right pb-3 font-medium">{t('courses.courseCode')}</th>
                        <th className="text-right pb-3 font-medium">{t('courses.courseName')}</th>
                        <th className="text-center pb-3 font-medium">{t('courses.creditHours')}</th>
                        <th className="text-center pb-3 font-medium">{t('transcript.grade')}</th>
                        <th className="text-center pb-3 font-medium">{t('transcript.points')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {semester.courses.map((enrollment, courseIndex) => (
                        <tr key={courseIndex} className="border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                          <td className="py-3 text-gray-600 dark:text-gray-400">
                            {enrollment.course?.course_code}
                          </td>
                          <td className="py-3 text-gray-900 dark:text-white font-medium">
                            {language === 'ar' ? enrollment.course?.name_ar : enrollment.course?.name_en}
                          </td>
                          <td className="py-3 text-center text-gray-600 dark:text-gray-400">
                            {enrollment.course?.credit_hours}
                          </td>
                          <td className="py-3 text-center">
                            <span className={`font-bold ${
                              enrollment.grade === 'F' 
                                ? 'text-red-600 dark:text-red-400' 
                                : enrollment.grade?.startsWith('A')
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {enrollment.grade}
                            </span>
                          </td>
                          <td className="py-3 text-center text-gray-600 dark:text-gray-400">
                            {enrollment.gpa_points?.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 dark:bg-gray-700/50">
                        <td colSpan={2} className="py-3 font-bold text-gray-900 dark:text-white">
                          المجموع
                        </td>
                        <td className="py-3 text-center font-bold text-gray-900 dark:text-white">
                          {semester.courses.reduce((sum, e) => sum + (e.course?.credit_hours || 0), 0)}
                        </td>
                        <td colSpan={2} className="py-3 text-center font-bold text-primary-800 dark:text-primary-400">
                          {t('transcript.semesterGPA')}: {calculateSemesterGPA(semester.courses)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total Summary */}
        {enrollments.length > 0 && (
          <div className="bg-primary-50 dark:bg-primary-900/20 p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-gray-600 dark:text-gray-400">{t('transcript.totalCredits')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{gpaData.completedCredits} ساعة</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600 dark:text-gray-400">{t('transcript.cumulativeGPA')}</p>
                <p className="text-3xl font-bold text-primary-800 dark:text-primary-400">{gpaData.gpa.toFixed(2)}</p>
                <p className={`text-sm ${classification.color}`}>{classification.text}</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TranscriptPage;

