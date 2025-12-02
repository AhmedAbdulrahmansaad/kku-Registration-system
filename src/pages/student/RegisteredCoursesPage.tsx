import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, User, MapPin, Calendar, Trash2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { getEnrollments } from '../../lib/supabase';
import { Enrollment } from '../../types';

const RegisteredCoursesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const enrollmentsData = await getEnrollments(user.id, 'current');
        setEnrollments(enrollmentsData || []);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const totalCredits = enrollments.reduce((sum, e) => sum + (e.course?.credit_hours || 0), 0);

  const getDayName = (day: string) => {
    const days: Record<string, string> = {
      sunday: t('courses.days.sunday'),
      monday: t('courses.days.monday'),
      tuesday: t('courses.days.tuesday'),
      wednesday: t('courses.days.wednesday'),
      thursday: t('courses.days.thursday'),
    };
    return days[day] || day;
  };

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('courses.registered')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {language === 'ar' ? 'الفصل الدراسي الثاني 2024' : 'Spring Semester 2024'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-primary-100 dark:bg-primary-900/30 px-4 py-2 rounded-xl">
            <span className="text-sm text-gray-600 dark:text-gray-400">إجمالي الساعات: </span>
            <span className="font-bold text-primary-800 dark:text-primary-400">{totalCredits}</span>
          </div>
        </div>
      </div>

      {/* Courses List */}
      {enrollments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center"
        >
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">{t('common.noData')}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            لم تقم بتسجيل أي مقررات لهذا الفصل
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enrollment, index) => (
            <motion.div
              key={enrollment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Course Header */}
                <div className="bg-gradient-to-r from-primary-800 to-primary-600 p-6 lg:w-1/3 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {enrollment.course?.course_code}
                      </span>
                      <h3 className="font-bold text-xl mt-3">
                        {language === 'ar' ? enrollment.course?.name_ar : enrollment.course?.name_en}
                      </h3>
                    </div>
                    <div className="text-center bg-white/10 rounded-xl p-3">
                      <p className="text-2xl font-bold">{enrollment.course?.credit_hours}</p>
                      <p className="text-xs text-white/70">ساعات</p>
                    </div>
                  </div>
                </div>

                {/* Course Details */}
                <div className="flex-1 p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <User className="w-5 h-5 text-primary-800 dark:text-primary-400" />
                      <div>
                        <p className="text-xs text-gray-400">{t('courses.instructor')}</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {enrollment.course?.instructor_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-5 h-5 text-primary-800 dark:text-primary-400" />
                      <div>
                        <p className="text-xs text-gray-400">{t('courses.room')}</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {enrollment.course?.room_number}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-5 h-5 text-primary-800 dark:text-primary-400" />
                      <div>
                        <p className="text-xs text-gray-400">الأيام</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {enrollment.course?.schedule?.days?.map(d => getDayName(d)).join(' - ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <Clock className="w-5 h-5 text-primary-800 dark:text-primary-400" />
                      <div>
                        <p className="text-xs text-gray-400">الوقت</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {enrollment.course?.schedule?.start_time} - {enrollment.course?.schedule?.end_time}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    {language === 'ar' ? enrollment.course?.description_ar : enrollment.course?.description_en}
                  </p>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      enrollment.status === 'current'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {enrollment.status === 'current' ? 'مسجل' : t(`requests.${enrollment.status}`)}
                    </span>
                    
                    <button className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">{t('courses.drop')}</span>
                    </button>
                  </div>
                </div>
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
          className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6"
        >
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">ملخص التسجيل</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-primary-800 dark:text-primary-400">
                {enrollments.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">مقررات مسجلة</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-secondary-600 dark:text-secondary-400">
                {totalCredits}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">ساعات معتمدة</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {21 - totalCredits}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">ساعات متبقية</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RegisteredCoursesPage;

