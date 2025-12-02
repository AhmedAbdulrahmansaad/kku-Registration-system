import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, BookOpen, Printer } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { getEnrollments } from '../../lib/supabase';
import { Enrollment } from '../../types';

const SchedulePage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  const days = language === 'ar' 
    ? ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

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

  const getClassForTimeSlot = (day: number, time: string) => {
    // Sample schedule data - in real app, this would come from course schedule
    const sampleSchedule: Record<string, { day: number; time: string; duration: number }[]> = {
      'course1': [{ day: 0, time: '08:00', duration: 2 }, { day: 2, time: '08:00', duration: 2 }],
      'course2': [{ day: 1, time: '10:00', duration: 2 }, { day: 3, time: '10:00', duration: 2 }],
      'course3': [{ day: 0, time: '12:00', duration: 2 }, { day: 4, time: '12:00', duration: 2 }],
      'course4': [{ day: 2, time: '14:00', duration: 2 }],
      'course5': [{ day: 1, time: '14:00', duration: 2 }, { day: 3, time: '14:00', duration: 2 }],
    };

    return enrollments.map((enrollment, index) => {
      const key = `course${(index % 5) + 1}`;
      const schedule = sampleSchedule[key];
      if (!schedule) return null;
      
      const slot = schedule.find(s => s.day === day && s.time === time);
      if (!slot) return null;

      return {
        enrollment,
        duration: slot.duration,
      };
    }).filter(Boolean)[0];
  };

  const colors = [
    'bg-blue-100 dark:bg-blue-900/30 border-blue-500 text-blue-800 dark:text-blue-300',
    'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-300',
    'bg-purple-100 dark:bg-purple-900/30 border-purple-500 text-purple-800 dark:text-purple-300',
    'bg-orange-100 dark:bg-orange-900/30 border-orange-500 text-orange-800 dark:text-orange-300',
    'bg-pink-100 dark:bg-pink-900/30 border-pink-500 text-pink-800 dark:text-pink-300',
  ];

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
            {t('nav.schedule')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {language === 'ar' ? 'الفصل الدراسي الثاني 2024' : 'Spring Semester 2024'}
          </p>
        </div>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-primary-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
        >
          <Printer className="w-5 h-5" />
          {t('transcript.print')}
        </button>
      </div>

      {/* Current Courses Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary-600" />
          {language === 'ar' ? 'المقررات المسجلة' : 'Registered Courses'}
        </h2>
        
        {enrollments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            {t('common.noData')}
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.map((enrollment, index) => (
              <div
                key={enrollment.id}
                className={`p-4 rounded-xl border-r-4 ${colors[index % colors.length]}`}
              >
                <p className="font-semibold">
                  {language === 'ar' ? enrollment.course?.name_ar : enrollment.course?.name_en}
                </p>
                <p className="text-sm opacity-75 mt-1">
                  {enrollment.course?.course_code} • {enrollment.course?.credit_hours} {t('courses.creditHours')}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Schedule Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            {language === 'ar' ? 'الجدول الأسبوعي' : 'Weekly Schedule'}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="p-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400 w-20">
                  {language === 'ar' ? 'الوقت' : 'Time'}
                </th>
                {days.map((day) => (
                  <th key={day} className="p-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time) => (
                <tr key={time} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {time}
                  </td>
                  {days.map((_, dayIndex) => {
                    const classData = getClassForTimeSlot(dayIndex, time);
                    
                    return (
                      <td key={dayIndex} className="p-2 relative h-20">
                        {classData && (
                          <div className={`absolute inset-2 rounded-xl p-2 border-r-4 ${colors[enrollments.indexOf(classData.enrollment) % colors.length]}`}>
                            <p className="font-medium text-sm truncate">
                              {language === 'ar' 
                                ? classData.enrollment.course?.name_ar 
                                : classData.enrollment.course?.name_en}
                            </p>
                            <p className="text-xs opacity-75 mt-1">
                              {classData.enrollment.course?.course_code}
                            </p>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          {language === 'ar' ? 'دليل الألوان' : 'Color Legend'}
        </h3>
        <div className="flex flex-wrap gap-4">
          {enrollments.slice(0, 5).map((enrollment, index) => (
            <div key={enrollment.id} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${colors[index % colors.length].split(' ')[0]}`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {enrollment.course?.course_code}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SchedulePage;
