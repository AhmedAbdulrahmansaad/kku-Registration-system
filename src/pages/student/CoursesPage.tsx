import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Search, Filter, ChevronDown, Clock,
  CheckCircle, AlertCircle, Users, Calendar, Plus
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, getCourses, getEnrollments, createRequest } from '../../lib/supabase';
import { Course, Enrollment } from '../../types';

const CoursesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [registering, setRegistering] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const [coursesData, enrollmentsData] = await Promise.all([
          getCourses(),
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
    return enrollments.some(e => e.course_id === courseId && (e.status === 'current' || e.status === 'completed'));
  };

  const isPending = (courseId: string) => {
    return enrollments.some(e => e.course_id === courseId && e.status === 'pending');
  };

  const handleRegister = async (course: Course) => {
    if (!user) return;
    
    setRegistering(course.id);
    setMessage(null);

    try {
      // Check prerequisites
      if (course.prerequisites && course.prerequisites.length > 0) {
        const completedCourses = enrollments
          .filter(e => e.status === 'completed')
          .map(e => e.course?.course_code);
        
        const missingPrereqs = course.prerequisites.filter(p => !completedCourses?.includes(p));
        
        if (missingPrereqs.length > 0) {
          setMessage({
            type: 'error',
            text: language === 'ar' 
              ? `المتطلبات السابقة غير مكتملة: ${missingPrereqs.join(', ')}`
              : `Missing prerequisites: ${missingPrereqs.join(', ')}`
          });
          return;
        }
      }

      // Create registration request
      await createRequest({
        student_id: user.id,
        course_id: course.id,
        request_type: 'registration',
        status: 'pending',
      });

      setMessage({
        type: 'success',
        text: language === 'ar' 
          ? 'تم إرسال طلب التسجيل للمرشد الأكاديمي'
          : 'Registration request sent to academic advisor'
      });

      // Refresh enrollments
      const updatedEnrollments = await getEnrollments(user.id);
      setEnrollments(updatedEnrollments || []);
    } catch (error) {
      console.error('Error registering:', error);
      setMessage({
        type: 'error',
        text: language === 'ar' ? 'حدث خطأ أثناء التسجيل' : 'Error during registration'
      });
    } finally {
      setRegistering(null);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = levelFilter === 'all' || course.level === Number(levelFilter);
    
    return matchesSearch && matchesLevel;
  });

  const groupedCourses = filteredCourses.reduce((acc, course) => {
    const level = course.level;
    if (!acc[level]) acc[level] = [];
    acc[level].push(course);
    return acc;
  }, {} as Record<number, Course[]>);

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
          {t('nav.courses')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {language === 'ar' ? 'اختر المقررات التي تريد تسجيلها' : 'Choose the courses you want to register'}
        </p>
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

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'ar' ? 'البحث عن مقرر...' : 'Search for a course...'}
            className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-gray-400" />
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full md:w-48 px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none appearance-none"
          >
            <option value="all">{language === 'ar' ? 'جميع المستويات' : 'All Levels'}</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(level => (
              <option key={level} value={level}>
                {language === 'ar' ? `المستوى ${level}` : `Level ${level}`}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute top-1/2 -translate-y-1/2 left-4 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Courses List */}
      {Object.keys(groupedCourses).length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{t('common.noData')}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedCourses)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([level, levelCourses]) => (
              <motion.div
                key={level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-bold">{level}</span>
                  </div>
                  {language === 'ar' ? `المستوى ${level}` : `Level ${level}`}
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {levelCourses.map((course, index) => {
                    const registered = isRegistered(course.id);
                    const pending = isPending(course.id);
                    
                    return (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                          registered ? 'ring-2 ring-green-500' : pending ? 'ring-2 ring-yellow-500' : ''
                        }`}
                      >
                        <div className="p-6">
                          {/* Course Code Badge */}
                          <div className="flex items-center justify-between mb-4">
                            <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-lg text-sm font-semibold">
                              {course.course_code}
                            </span>
                            {registered && (
                              <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                {language === 'ar' ? 'مسجل' : 'Registered'}
                              </span>
                            )}
                            {pending && (
                              <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {t('common.pending')}
                              </span>
                            )}
                          </div>

                          {/* Course Name */}
                          <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                            {language === 'ar' ? course.name_ar : course.name_en}
                          </h3>

                          {/* Course Details */}
                          <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{course.credit_hours} {t('courses.creditHours')}</span>
                            </div>
                            {course.instructor && (
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>{course.instructor}</span>
                              </div>
                            )}
                            {course.prerequisites && course.prerequisites.length > 0 && (
                              <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 mt-0.5 text-orange-500" />
                                <span className="text-orange-600 dark:text-orange-400">
                                  {language === 'ar' ? 'متطلبات: ' : 'Prerequisites: '}
                                  {course.prerequisites.join(', ')}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Register Button */}
                          {!registered && !pending && (
                            <button
                              onClick={() => handleRegister(course)}
                              disabled={registering === course.id}
                              className="w-full mt-4 bg-gradient-to-r from-primary-800 to-primary-700 text-white py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                              {registering === course.id ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <>
                                  <Plus className="w-5 h-5" />
                                  {t('courses.register')}
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
