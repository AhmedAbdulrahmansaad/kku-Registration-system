import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Clock, MapPin, User, Calendar, 
  Trash2, AlertCircle, CheckCircle
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { getEnrollments, supabase } from '../../lib/supabase';
import { Enrollment } from '../../types';

const RegisteredCoursesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const data = await getEnrollments(user.id);
        setEnrollments(data?.filter(e => e.status === 'current') || []);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleDrop = async (enrollmentId: string) => {
    try {
      await supabase
        .from('enrollments')
        .delete()
        .eq('id', enrollmentId);

      setEnrollments(prev => prev.filter(e => e.id !== enrollmentId));
      setMessage({
        type: 'success',
        text: language === 'ar' ? 'تم حذف المقرر بنجاح' : 'Course dropped successfully'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: language === 'ar' ? 'حدث خطأ أثناء الحذف' : 'Error dropping course'
      });
    }
  };

  const totalCredits = enrollments.reduce((sum, e) => sum + (e.course?.credit_hours || 0), 0);

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
            {t('nav.registeredCourses')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {language === 'ar' ? 'الفصل الدراسي الثاني 2024' : 'Spring Semester 2024'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400 px-6 py-3 rounded-xl">
            <span className="font-semibold">{totalCredits}</span>
            <span className="text-sm ml-1">{t('courses.creditHours')}</span>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          )}
          <p className={message.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
            {message.text}
          </p>
        </motion.div>
      )}

      {/* Courses List */}
      {enrollments.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">{t('common.noData')}</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            {language === 'ar' ? 'لم تقم بتسجيل أي مقررات بعد' : "You haven't registered any courses yet"}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {enrollments.map((enrollment, index) => (
            <motion.div
              key={enrollment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-primary-800 to-primary-600 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="bg-white/20 px-3 py-1 rounded-lg text-sm font-semibold">
                      {enrollment.course?.course_code}
                    </span>
                    <h3 className="font-bold text-xl mt-3">
                      {language === 'ar' ? enrollment.course?.name_ar : enrollment.course?.name_en}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">{enrollment.course?.credit_hours}</p>
                    <p className="text-white/80 text-sm">{t('courses.creditHours')}</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="space-y-3">
                  {enrollment.course?.instructor && (
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <User className="w-5 h-5 text-primary-600" />
                      <span>{enrollment.course.instructor}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <span>
                      {language === 'ar' ? `المستوى ${enrollment.course?.level}` : `Level ${enrollment.course?.level}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <span>{enrollment.semester} {enrollment.year}</span>
                  </div>
                </div>

                {/* Prerequisites */}
                {enrollment.course?.prerequisites && enrollment.course.prerequisites.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {t('courses.prerequisites')}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {enrollment.course.prerequisites.map((prereq) => (
                        <span
                          key={prereq}
                          className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2 py-1 rounded text-sm"
                        >
                          {prereq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Drop Button */}
                <button
                  onClick={() => handleDrop(enrollment.id)}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-3 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                >
                  <Trash2 className="w-5 h-5" />
                  {t('courses.drop')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Summary */}
      {enrollments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-2xl p-6"
        >
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-4xl font-bold text-primary-800 dark:text-primary-400">{enrollments.length}</p>
              <p className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'مقررات مسجلة' : 'Registered Courses'}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary-800 dark:text-primary-400">{totalCredits}</p>
              <p className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'إجمالي الساعات' : 'Total Credits'}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary-800 dark:text-primary-400">
                {language === 'ar' ? 'الثاني' : 'Spring'}
              </p>
              <p className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'الفصل الدراسي' : 'Semester'}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RegisteredCoursesPage;
