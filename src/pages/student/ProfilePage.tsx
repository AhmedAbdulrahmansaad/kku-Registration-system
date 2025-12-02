import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Hash, BookOpen, GraduationCap, Camera, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface ProfileFormData {
  full_name: string;
  phone: string;
}

interface PasswordFormData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const ProfilePage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm<ProfileFormData>({
    defaultValues: {
      full_name: user?.full_name || '',
      phone: user?.phone || '',
    },
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, watch, reset: resetPassword, formState: { errors: passwordErrors } } = useForm<PasswordFormData>();

  const newPassword = watch('new_password');

  const onProfileSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: data.full_name,
          phone: data.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshUser();
      setMessage({ type: 'success', text: t('profile.updateSuccess') });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: t('common.error') });
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setPasswordLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.new_password,
      });

      if (error) throw error;

      resetPassword();
      setMessage({ type: 'success', text: t('profile.passwordUpdateSuccess') });
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage({ type: 'error', text: t('common.error') });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('profile.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {language === 'ar' ? 'إدارة معلوماتك الشخصية وإعدادات الحساب' : 'Manage your personal information and account settings'}
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

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
      >
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-primary-800 to-primary-600" />
        
        {/* Avatar & Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <div className="relative">
              <div className="w-24 h-24 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg">
                <User className="w-12 h-12 text-gray-400" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-800 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.full_name}</h2>
              <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400 rounded-full text-sm">
                {t(`auth.${user?.role}`)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Personal Info Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            {t('profile.personalInfo')}
          </h3>

          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.fullName')}
              </label>
              <div className="relative">
                <User className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  {...registerProfile('full_name', { required: t('errors.required') })}
                  className="input-primary pr-12"
                />
              </div>
              {profileErrors.full_name && (
                <p className="mt-2 text-sm text-red-600">{profileErrors.full_name.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('common.phone')}
              </label>
              <div className="relative">
                <Phone className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  {...registerProfile('phone')}
                  className="input-primary pr-12"
                  placeholder="05XXXXXXXX"
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input-primary pr-12 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                t('profile.updateProfile')
              )}
            </button>
          </form>
        </motion.div>

        {/* Academic Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            {t('profile.academicInfo')}
          </h3>

          <div className="space-y-4">
            {user?.role === 'student' && (
              <>
                {/* Student ID */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                    <Hash className="w-5 h-5 text-primary-800 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('auth.studentId')}</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{user.student_id}</p>
                  </div>
                </div>

                {/* Level */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('auth.level')}</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {language === 'ar' ? `المستوى ${user.level}` : `Level ${user.level}`}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Major */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('auth.major')}</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {user?.major || 'نظم المعلومات الإدارية'}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('auth.role')}</p>
                <p className="font-semibold text-gray-900 dark:text-white">{t(`auth.${user?.role}`)}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          {t('profile.changePassword')}
        </h3>

        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4 max-w-md">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('profile.currentPassword')}
            </label>
            <input
              type="password"
              {...registerPassword('current_password', { required: t('errors.required') })}
              className="input-primary"
            />
            {passwordErrors.current_password && (
              <p className="mt-2 text-sm text-red-600">{passwordErrors.current_password.message}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('profile.newPassword')}
            </label>
            <input
              type="password"
              {...registerPassword('new_password', { 
                required: t('errors.required'),
                minLength: { value: 6, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }
              })}
              className="input-primary"
            />
            {passwordErrors.new_password && (
              <p className="mt-2 text-sm text-red-600">{passwordErrors.new_password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('profile.confirmNewPassword')}
            </label>
            <input
              type="password"
              {...registerPassword('confirm_password', { 
                required: t('errors.required'),
                validate: value => value === newPassword || t('auth.passwordMismatch')
              })}
              className="input-primary"
            />
            {passwordErrors.confirm_password && (
              <p className="mt-2 text-sm text-red-600">{passwordErrors.confirm_password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="btn-primary"
          >
            {passwordLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
            ) : (
              t('profile.changePassword')
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfilePage;

