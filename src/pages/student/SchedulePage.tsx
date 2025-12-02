import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, BookOpen } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { getEnrollments } from '../../lib/supabase';
import { Enrollment } from '../../types';

const SchedulePage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'];
  const dayNames = {
    ar: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
  };

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00'
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const enrollmentsData = await getEnrollments(user.id, 'current');
        setEnrollments(enrollmentsData || []);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getCoursesForDayAndTime = (day: string, time: string) => {
    return enrollments.filter(enrollment => {
      const schedule = enrollment.course?.schedule;
      if (!schedule) return false;
      
      const hasDday = schedule.days?.includes(day);
      const startHour = parseInt(schedule.start_time?.split(':')[0] || '0');
      const timeHour = parseInt(time.split(':')[0]);
      
      return hasDday && startHour === timeHour;
    });
  };

  const getCourseColor = (index: number) => {
    const colors = [
      'bg-primary-100 dark:bg-primary-900/30 border-primary-500',
      'bg-blue-100 dark:bg-blue-900/30 border-blue-500',
      'bg-purple-100 dark:bg-purple-900/30 border-purple-500',
      'bg-green-100 dark:bg-green-900/30 border-green-500',
      'bg-orange-100 dark:bg-orange-900/30 border-orange-500',
      'bg-pink-100 dark:bg-pink-900/30 border-pink-500',
    ];
    return colors[index % colors.length];
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
            {t('schedule.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {language === 'ar' ? 'الفصل الدراسي الثاني 2024' : 'Spring Semester 2024'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{enrollments.length} {language === 'ar' ? 'مقررات مسجلة' : 'registered courses'}</span>
        </div>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg"
      >
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          {t('courses.registered')}
        </h3>
        <div className="flex flex-wrap gap-3">
          {enrollments.map((enrollment, index) => (
            <div
              key={enrollment.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border-r-4 ${getCourseColor(index)}`}
            >
              <BookOpen className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {enrollment.course?.course_code} - {language === 'ar' ? enrollment.course?.name_ar : enrollment.course?.name_en}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Schedule Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-primary-800 text-white">
                <th className="p-4 text-right w-20">{t('schedule.time')}</th>
                {days.map((day, index) => (
                  <th key={day} className="p-4 text-center">
                    {language === 'ar' ? dayNames.ar[index] : dayNames.en[index]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time, timeIndex) => (
                <tr 
                  key={time} 
                  className={`border-b border-gray-200 dark:border-gray-700 ${
                    timeIndex % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''
                  }`}
                >
                  <td className="p-4 text-gray-600 dark:text-gray-400 font-medium text-center">
                    {time}
                  </td>
                  {days.map((day) => {
                    const courses = getCoursesForDayAndTime(day, time);
                    return (
                      <td key={day} className="p-2">
                        {courses.map((enrollment, courseIndex) => (
                          <div
                            key={enrollment.id}
                            className={`p-3 rounded-xl border-r-4 ${getCourseColor(
                              enrollments.findIndex(e => e.id === enrollment.id)
                            )}`}
                          >
                            <p className="font-bold text-gray-900 dark:text-white text-sm">
                              {enrollment.course?.course_code}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              {language === 'ar' ? enrollment.course?.name_ar : enrollment.course?.name_en}
                            </p>
                            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="w-3 h-3" />
                              <span>
                                {enrollment.course?.schedule?.start_time} - {enrollment.course?.schedule?.end_time}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <MapPin className="w-3 h-3" />
                              <span>{enrollment.course?.room_number}</span>
                            </div>
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Mobile View - List */}
      <div className="lg:hidden space-y-4">
        {days.map((day, dayIndex) => {
          const dayEnrollments = enrollments.filter(e => 
            e.course?.schedule?.days?.includes(day)
          );

          if (dayEnrollments.length === 0) return null;

          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4"
            >
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                {language === 'ar' ? dayNames.ar[dayIndex] : dayNames.en[dayIndex]}
              </h3>
              <div className="space-y-3">
                {dayEnrollments
                  .sort((a, b) => {
                    const timeA = a.course?.schedule?.start_time || '00:00';
                    const timeB = b.course?.schedule?.start_time || '00:00';
                    return timeA.localeCompare(timeB);
                  })
                  .map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className={`p-4 rounded-xl border-r-4 ${getCourseColor(
                        enrollments.findIndex(e => e.id === enrollment.id)
                      )}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">
                            {enrollment.course?.course_code}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {language === 'ar' ? enrollment.course?.name_ar : enrollment.course?.name_en}
                          </p>
                        </div>
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                          {enrollment.course?.credit_hours} {t('courses.creditHours')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {enrollment.course?.schedule?.start_time} - {enrollment.course?.schedule?.end_time}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{enrollment.course?.room_number}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* No Courses */}
      {enrollments.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{t('schedule.noClasses')}</p>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;

