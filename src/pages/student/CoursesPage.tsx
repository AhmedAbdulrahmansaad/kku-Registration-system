import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Search, Filter, Clock, User, MapPin,
  CheckCircle, AlertCircle, Plus, X, ChevronDown
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { getCourses, getEnrollments, createRequest } from '../../lib/supabase';
import { Course, Enrollment } from '../../types';

const CoursesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const [coursesData, enrollmentsData] = await Promise.all([
          getCourses(user.level || 8),
          getEnrollments(user.id),
        ]);
        
        setCourses(coursesData || []);
        setEnrollments(enrollmentsData || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const isRegistered = (courseId: string) => {
    return enrollments.some(e => 
      e.course_id === courseId && 
      ['pending', 'approved', 'current'].includes(e.status)
    );
  };

  const isCompleted = (courseCode: string) => {
    return enrollments.some(e => 
      e.course?.course_code === courseCode && 
      e.status === 'completed'
    );
  };

  const hasPrerequisites = (course: Course) => {
    if (!course.prerequisites || course.prerequisites.length === 0) return true;
    return course.prerequisites.every(prereq => isCompleted(prereq));
  };

  const handleRegister = async (course: Course) => {
    if (!user || !user.advisor_id) {
      setMessage({ type: 'error', text: 'لم يتم تعيين مشرف أكاديمي لك' });
      return;
    }

    if (isRegistered(course.id)) {
      setMessage({ type: 'error', text: t('courses.alreadyRegistered') });
      return;
    }

    if (!hasPrerequisites(course)) {
      setMessage({ type: 'error', text: t('courses.prerequisiteNotMet') });
      return;
    }

    setRegistering(true);
    try {
      await createRequest({
        student_id: user.id,
        course_id: course.id,
        advisor_id: user.advisor_id,
        request_type: 'enroll',
      });
      
      setMessage({ type: 'success', text: t('courses.registerSuccess') });
      setSelectedCourse(null);
      
      // Refresh enrollments
      const enrollmentsData = await getEnrollments(user.id);
      setEnrollments(enrollmentsData || []);
    } catch (error) {
      console.error('Error registering:', error);
      setMessage({ type: 'error', text: t('common.error') });
    } finally {
      setRegistering(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    
    return matchesSearch && matchesLevel;
  });

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
            {t('courses.available')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {language === 'ar' 
              ? `المقررات المتاحة للمستوى ${user?.level} وما قبله`
              : `Courses available for level ${user?.level} and below`
            }
          </p>
        </div>
      </div>

      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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
            <button
              onClick={() => setMessage(null)}
              className="mr-auto"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('common.search')}
            className="input-primary pr-12"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-gray-400" />
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="input-primary pr-12 appearance-none min-w-[200px]"
          >
            <option value="all">{t('common.all')} المستويات</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => (
              <option key={level} value={level}>
                المستوى {level}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute top-1/2 -translate-y-1/2 left-4 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, index) => {
          const registered = isRegistered(course.id);
          const completed = isCompleted(course.course_code);
          const hasPrereq = hasPrerequisites(course);

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden ${
                completed ? 'opacity-60' : ''
              }`}
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-primary-800 to-primary-600 p-4 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      {course.course_code}
                    </span>
                    <h3 className="font-bold mt-2">
                      {language === 'ar' ? course.name_ar : course.name_en}
                    </h3>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{course.credit_hours}</p>
                    <p className="text-xs text-white/70">{t('courses.creditHours')}</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <User className="w-4 h-4" />
                  <span>{course.instructor_name}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>
                    {course.schedule?.days?.map(d => getDayName(d)).join(', ')} | {course.schedule?.start_time} - {course.schedule?.end_time}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{course.room_number}</span>
                </div>

                {/* Prerequisites */}
                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {t('courses.prerequisites')}:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {course.prerequisites.map((prereq, i) => (
                        <span
                          key={i}
                          className={`text-xs px-2 py-0.5 rounded ${
                            isCompleted(prereq)
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          }`}
                        >
                          {prereq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="pt-2">
                  {completed ? (
                    <span className="badge-success flex items-center gap-1 w-fit">
                      <CheckCircle className="w-4 h-4" />
                      {t('courses.completed')}
                    </span>
                  ) : registered ? (
                    <span className="badge-info flex items-center gap-1 w-fit">
                      <CheckCircle className="w-4 h-4" />
                      {t('courses.registered')}
                    </span>
                  ) : !hasPrereq ? (
                    <span className="badge-warning flex items-center gap-1 w-fit">
                      <AlertCircle className="w-4 h-4" />
                      {t('courses.prerequisiteNotMet')}
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => setSelectedCourse(course)}
                  disabled={completed || registered || !hasPrereq}
                  className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                    completed || registered || !hasPrereq
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-primary-800 text-white hover:bg-primary-700'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  {t('courses.register')}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{t('common.noData')}</p>
        </div>
      )}

      {/* Registration Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCourse(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                تأكيد التسجيل
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                هل أنت متأكد من تسجيل المقرر التالي؟
              </p>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
                <p className="font-bold text-gray-900 dark:text-white">
                  {language === 'ar' ? selectedCourse.name_ar : selectedCourse.name_en}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedCourse.course_code} • {selectedCourse.credit_hours} ساعات
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="flex-1 btn-outline"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={() => handleRegister(selectedCourse)}
                  disabled={registering}
                  className="flex-1 btn-primary"
                >
                  {registering ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                  ) : (
                    t('courses.register')
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoursesPage;

