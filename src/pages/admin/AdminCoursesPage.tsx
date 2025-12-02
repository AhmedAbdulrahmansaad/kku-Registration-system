import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Search, Plus, Edit, Trash2, X, 
  AlertCircle, CheckCircle, Filter, ChevronDown
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '../../contexts/LanguageContext';
import { getCourses, updateCourse, deleteCourse, supabase } from '../../lib/supabase';
import { Course } from '../../types';

interface CourseFormData {
  course_code: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  credit_hours: number;
  level: number;
  semester: 'fall' | 'spring' | 'summer';
  instructor_name: string;
  room_number: string;
  max_students: number;
}

const AdminCoursesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CourseFormData>();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const coursesData = await getCourses();
      setCourses(coursesData || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CourseFormData) => {
    setProcessing(true);
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, data);
        setMessage({ type: 'success', text: t('admin.courseUpdated') });
      } else {
        await supabase.from('courses').insert({
          ...data,
          major: 'نظم المعلومات الإدارية',
          schedule: { days: ['sunday', 'tuesday'], start_time: '10:00', end_time: '11:30' },
          prerequisites: [],
          enrolled_count: 0,
        });
        setMessage({ type: 'success', text: t('admin.courseAdded') });
      }
      
      setShowModal(false);
      setEditingCourse(null);
      reset();
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      setMessage({ type: 'error', text: t('common.error') });
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (courseId: string) => {
    setProcessing(true);
    try {
      await deleteCourse(courseId);
      setMessage({ type: 'success', text: t('admin.courseDeleted') });
      setDeleteConfirm(null);
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      setMessage({ type: 'error', text: t('common.error') });
    } finally {
      setProcessing(false);
    }
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    reset({
      course_code: course.course_code,
      name_ar: course.name_ar,
      name_en: course.name_en,
      description_ar: course.description_ar,
      description_en: course.description_en,
      credit_hours: course.credit_hours,
      level: course.level,
      semester: course.semester,
      instructor_name: course.instructor_name,
      room_number: course.room_number,
      max_students: course.max_students,
    });
    setShowModal(true);
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    
    return matchesSearch && matchesLevel;
  });

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
            {t('admin.manageCourses')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {courses.length} {language === 'ar' ? 'مقرر في النظام' : 'courses in the system'}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCourse(null);
            reset({});
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {t('admin.addCourse')}
        </button>
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
            <button onClick={() => setMessage(null)} className="mr-auto">
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

      {/* Courses Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
      >
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">{t('common.noData')}</p>
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
                    {t('courses.level')}
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('courses.creditHours')}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('courses.instructor')}
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-primary-800 dark:text-primary-400">
                        {course.course_code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {language === 'ar' ? course.name_ar : course.name_en}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-600 rounded-full text-sm">
                        {course.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">
                      {course.credit_hours}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {course.instructor_name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(course)}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(course.id)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {editingCourse ? t('admin.editCourse') : t('admin.addCourse')}
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('courses.courseCode')}
                    </label>
                    <input
                      {...register('course_code', { required: t('errors.required') })}
                      className="input-primary"
                      placeholder="MIS101"
                    />
                    {errors.course_code && (
                      <p className="mt-1 text-sm text-red-600">{errors.course_code.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('courses.creditHours')}
                    </label>
                    <input
                      type="number"
                      {...register('credit_hours', { required: t('errors.required'), min: 1, max: 6 })}
                      className="input-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الاسم بالعربية
                    </label>
                    <input
                      {...register('name_ar', { required: t('errors.required') })}
                      className="input-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الاسم بالإنجليزية
                    </label>
                    <input
                      {...register('name_en', { required: t('errors.required') })}
                      className="input-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('courses.level')}
                    </label>
                    <select {...register('level', { required: true })} className="input-primary">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => (
                        <option key={level} value={level}>المستوى {level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('courses.semester')}
                    </label>
                    <select {...register('semester', { required: true })} className="input-primary">
                      <option value="fall">{t('courses.fall')}</option>
                      <option value="spring">{t('courses.spring')}</option>
                      <option value="summer">{t('courses.summer')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('courses.instructor')}
                    </label>
                    <input {...register('instructor_name')} className="input-primary" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('courses.room')}
                    </label>
                    <input {...register('room_number')} className="input-primary" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('courses.maxStudents')}
                    </label>
                    <input
                      type="number"
                      {...register('max_students', { min: 1 })}
                      className="input-primary"
                      defaultValue={30}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الوصف بالعربية
                  </label>
                  <textarea {...register('description_ar')} rows={2} className="input-primary resize-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الوصف بالإنجليزية
                  </label>
                  <textarea {...register('description_en')} rows={2} className="input-primary resize-none" />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-outline">
                    {t('common.cancel')}
                  </button>
                  <button type="submit" disabled={processing} className="flex-1 btn-primary">
                    {processing ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    ) : (
                      t('common.save')
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('admin.deleteCourse')}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {t('admin.deleteConfirm')}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 btn-outline"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    disabled={processing}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
                  >
                    {processing ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    ) : (
                      t('common.delete')
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCoursesPage;

