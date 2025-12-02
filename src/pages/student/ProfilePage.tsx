import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Hash, BookOpen, GraduationCap, 
  Edit, Save, X, Camera, Phone, MapPin, Calendar
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row items-center gap-6 -mt-16 relative">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-white dark:bg-gray-700 rounded-2xl shadow-xl flex items-center justify-center border-4 border-white dark:border-gray-800">
                <User className="w-16 h-16 text-primary-600 dark:text-primary-400" />
              </div>
              <button className="absolute bottom-2 right-2 w-8 h-8 bg-primary-600 text-white rounded-lg flex items-center justify-center hover:bg-primary-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Info */}
            <div className="text-center md:text-right flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {user?.full_name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mb-3">
                {user?.email}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-lg text-sm font-medium">
                  {t(`auth.${user?.role}`)}
                </span>
                {user?.level && (
                  <span className="bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400 px-3 py-1 rounded-lg text-sm font-medium">
                    {language === 'ar' ? `المستوى ${user.level}` : `Level ${user.level}`}
                  </span>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                isEditing
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-primary-800 hover:bg-primary-700 text-white'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isEditing ? (
                <>
                  <Save className="w-5 h-5" />
                  {t('common.save')}
                </>
              ) : (
                <>
                  <Edit className="w-5 h-5" />
                  {t('common.edit')}
                </>
              )}
            </button>

            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Profile Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-primary-600" />
            {language === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                {t('auth.fullName')}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 outline-none"
                />
              ) : (
                <p className="text-gray-900 dark:text-white font-medium">{user?.full_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                {t('auth.email')}
              </label>
              <p className="text-gray-900 dark:text-white font-medium">{user?.email}</p>
            </div>

            {user?.role === 'student' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {t('auth.studentId')}
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">{user?.student_id || '-'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {t('auth.major')}
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">{user?.major || '-'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {t('auth.level')}
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {user?.level ? (language === 'ar' ? `المستوى ${user.level}` : `Level ${user.level}`) : '-'}
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary-600" />
            {language === 'ar' ? 'معلومات الحساب' : 'Account Information'}
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                <Hash className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('auth.role')}</p>
                <p className="font-medium text-gray-900 dark:text-white">{t(`auth.${user?.role}`)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {language === 'ar' ? 'تاريخ الانضمام' : 'Join Date'}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US') : '-'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {language === 'ar' ? 'حالة الحساب' : 'Account Status'}
                </p>
                <p className="font-medium text-green-600 dark:text-green-400">
                  {language === 'ar' ? 'نشط' : 'Active'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
