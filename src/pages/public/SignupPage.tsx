import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff, GraduationCap, User, 
  AlertCircle, CheckCircle, Hash, BookOpen
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

interface SignupFormData {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  role: 'student' | 'advisor' | 'admin';
  student_id?: string;
  level?: number;
}

const SignupPage: React.FC = () => {
  const { t } = useLanguage();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupFormData>({
    defaultValues: {
      role: 'student',
    }
  });

  const selectedRole = watch('role');
  const password = watch('password');

  const onSubmit = async (data: SignupFormData) => {
    setError('');
    setLoading(true);

    try {
      await signUp(data.email, data.password, {
        full_name: data.full_name,
        role: data.role,
        student_id: data.role === 'student' ? data.student_id : undefined,
        major: data.role === 'student' ? 'نظم المعلومات الإدارية' : undefined,
        level: data.role === 'student' ? data.level : undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: unknown) {
      console.error('Signup error:', err);
      if (err instanceof Error) {
        setError(err.message || 'حدث خطأ أثناء إنشاء الحساب');
      } else {
        setError('حدث خطأ أثناء إنشاء الحساب');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('auth.signupSuccess')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            تم إنشاء حسابك بنجاح. يرجى تأكيد بريدك الإلكتروني ثم تسجيل الدخول.
          </p>
          <Link to="/login" className="btn-primary inline-block">
            {t('auth.login')}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-primary-900" />
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=1200&fit=crop"
          alt="Students"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
        />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8">
              <GraduationCap className="w-12 h-12" />
            </div>
            <h2 className="text-4xl font-bold mb-4">انضم إلينا</h2>
            <p className="text-xl text-white/80 mb-8">
              ابدأ رحلتك الأكاديمية مع نظام تسجيل المقررات
            </p>
            <div className="space-y-4 text-right max-w-sm mx-auto">
              {[
                'تسجيل سهل وسريع للمقررات',
                'متابعة فورية للمعدل التراكمي',
                'جدول دراسي منظم',
                'مساعد ذكي على مدار الساعة',
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <CheckCircle className="w-5 h-5 text-secondary-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-800 to-primary-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-800 dark:text-primary-400">
                {t('landing.title')}
              </h1>
              <p className="text-sm text-gray-500">{t('landing.subtitle')}</p>
            </div>
          </Link>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('auth.signup')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            أنشئ حسابك الآن للوصول إلى نظام التسجيل
          </p>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.role')}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['student', 'advisor', 'admin'] as const).map((role) => (
                  <label
                    key={role}
                    className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedRole === role
                        ? 'border-primary-800 bg-primary-50 dark:bg-primary-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-400'
                    }`}
                  >
                    <input
                      type="radio"
                      {...register('role')}
                      value={role}
                      className="sr-only"
                    />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      selectedRole === role
                        ? 'bg-primary-800 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {role === 'student' && <User className="w-5 h-5" />}
                      {role === 'advisor' && <BookOpen className="w-5 h-5" />}
                      {role === 'admin' && <GraduationCap className="w-5 h-5" />}
                    </div>
                    <span className={`text-sm font-medium ${
                      selectedRole === role
                        ? 'text-primary-800 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {t(`auth.${role}`)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.fullName')}
              </label>
              <div className="relative">
                <User className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  {...register('full_name', { required: t('errors.required') })}
                  className="input-primary pr-12"
                  placeholder="محمد أحمد"
                />
              </div>
              {errors.full_name && (
                <p className="mt-2 text-sm text-red-600">{errors.full_name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  {...register('email', { 
                    required: t('auth.emailRequired'),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t('errors.invalidEmail'),
                    }
                  })}
                  className="input-primary pr-12"
                  placeholder="example@kku.edu.sa"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Student-specific fields */}
            {selectedRole === 'student' && (
              <>
                {/* Student ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('auth.studentId')}
                  </label>
                  <div className="relative">
                    <Hash className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      {...register('student_id', { required: selectedRole === 'student' ? t('errors.required') : false })}
                      className="input-primary pr-12"
                      placeholder="44012345"
                    />
                  </div>
                  {errors.student_id && (
                    <p className="mt-2 text-sm text-red-600">{errors.student_id.message}</p>
                  )}
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('auth.level')}
                  </label>
                  <select
                    {...register('level', { required: selectedRole === 'student' ? t('errors.required') : false })}
                    className="input-primary"
                  >
                    <option value="">{t('auth.selectLevel')}</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => (
                      <option key={level} value={level}>
                        المستوى {level}
                      </option>
                    ))}
                  </select>
                  {errors.level && (
                    <p className="mt-2 text-sm text-red-600">{errors.level.message}</p>
                  )}
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { 
                    required: t('auth.passwordRequired'),
                    minLength: {
                      value: 6,
                      message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
                    }
                  })}
                  className="input-primary px-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.confirmPassword')}
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirm_password', { 
                    required: t('errors.required'),
                    validate: value => value === password || t('auth.passwordMismatch')
                  })}
                  className="input-primary px-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="mt-2 text-sm text-red-600">{errors.confirm_password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                t('auth.signup')
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link
              to="/login"
              className="text-primary-800 dark:text-primary-400 font-semibold hover:underline"
            >
              {t('auth.login')}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;

