import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, ArrowRight, BookOpen, TrendingUp, Calendar,
  Award, FileText, Mail, Phone, Hash
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase, getEnrollments, calculateGPA } from '../../lib/supabase';
import { User as UserType, Enrollment } from '../../types';

const StudentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language, isRTL } = useLanguage();
  const [student, setStudent] = useState<UserType | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [gpaData, setGpaData] = useState({ gpa: 0, completedCredits: 0, totalCredits: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        const [studentRes, enrollmentsData, gpa] = await Promise.all([
          supabase.from('users').select('*').eq('id', id).single(),
          getEnrollments(id),
          calculateGPA(id),
        ]);
        
        setStudent(studentRes.data);
        setEnrollments(enrollmentsData || []);
        setGpaData(gpa);
      } catch (error) {
        console.error('Error fetching student details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getGPAClassification = (gpa: number) => {
    if (gpa >= 4.5) return { text: language === 'ar' ? 'ممتاز' : 'Excellent', color: 'text-green-600 dark:text-green-400' };
    if (gpa >= 3.75) return { text: language === 'ar' ? 'جيد جداً' : 'Very Good', color: 'text-blue-600 dark:text-blue-400' };
    if (gpa >= 2.75) return { text: language === 'ar' ? 'جيد' : 'Good', color: 'text-yellow-600 dark:text-yellow-400' };
    if (gpa >= 2.0) return { text: language === 'ar' ? 'مقبول' : 'Acceptable', color: 'text-orange-600 dark:text-orange-400' };
    return { text: language === 'ar' ? 'ضعيف' : 'Weak', color: 'text-red-600 dark:text-red-400' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          {language === 'ar' ? 'الطالب غير موجود' : 'Student not found'}
        </p>
      </div>
    );
  }

  const classification = getGPAClassification(gpaData.gpa);
  const currentEnrollments = enrollments.filter(e => e.status === 'current');
  const completedEnrollments = enrollments.filter(e => e.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/advisor/students"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
      >
        <ArrowRight className={`w-5 h-5 ${isRTL ? '' : 'rotate-180'}`} />
        <span>{language === 'ar' ? 'العودة لقائمة الطلاب' : 'Back to students list'}</span>
      </Link>

      {/* Student Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-800 to-primary-600 p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="text-center md:text-right text-white">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{student.full_name}</h1>
              <p className="text-white/80">{student.student_id}</p>
              <span className="inline-block mt-2 bg-secondary-500 text-primary-900 px-4 py-1 rounded-full text-sm font-semibold">
                {language === 'ar' ? `المستوى ${student.level}` : `Level ${student.level}`}
              </span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('common.email')}</p>
              <p className="font-medium text-gray-900 dark:text-white text-sm">{student.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('auth.major')}</p>
              <p className="font-medium text-gray-900 dark:text-white text-sm">{student.major}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.gpa')}</p>
              <p className="font-bold text-2xl text-gray-900 dark:text-white">{gpaData.gpa.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{language === 'ar' ? 'التقدير' : 'Classification'}</p>
              <p className={`font-bold text-lg ${classification.color}`}>{classification.text}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-primary-800 to-primary-700 rounded-2xl p-6 text-white"
        >
          <FileText className="w-10 h-10 mb-4 text-white/80" />
          <p className="text-4xl font-bold">{gpaData.completedCredits}</p>
          <p className="text-white/80">{t('dashboard.completedCredits')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <BookOpen className="w-10 h-10 mb-4 text-blue-600 dark:text-blue-400" />
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{currentEnrollments.length}</p>
          <p className="text-gray-500 dark:text-gray-400">{language === 'ar' ? 'مقررات حالية' : 'Current Courses'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <Calendar className="w-10 h-10 mb-4 text-green-600 dark:text-green-400" />
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{completedEnrollments.length}</p>
          <p className="text-gray-500 dark:text-gray-400">{language === 'ar' ? 'مقررات منجزة' : 'Completed Courses'}</p>
        </motion.div>
      </div>

      {/* Current Courses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          {language === 'ar' ? 'المقررات الحالية' : 'Current Courses'}
        </h2>

        {currentEnrollments.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">{t('common.noData')}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {currentEnrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {language === 'ar' ? enrollment.course?.name_ar : enrollment.course?.name_en}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {enrollment.course?.course_code} • {enrollment.course?.credit_hours} {t('courses.creditHours')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Academic Record */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('students.academicRecord')}
          </h2>
        </div>

        {completedEnrollments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {completedEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-primary-600 dark:text-primary-400 font-medium">
                      {enrollment.course?.course_code}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      {language === 'ar' ? enrollment.course?.name_ar : enrollment.course?.name_en}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">
                      {enrollment.course?.credit_hours}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold ${
                        enrollment.grade === 'F' 
                          ? 'text-red-600' 
                          : enrollment.grade?.startsWith('A')
                          ? 'text-green-600'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {enrollment.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">
                      {enrollment.gpa_points?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StudentDetailsPage;


