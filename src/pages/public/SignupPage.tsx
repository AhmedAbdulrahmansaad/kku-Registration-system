import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff, GraduationCap, User, 
  AlertCircle, CheckCircle, Hash, BookOpen, Shield
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
  major?: string;
}

const MAJORS = [
  { id: 'mis', name_ar: 'نظم المعلومات الإدارية', name_en: 'Management Information Systems' },
  { id: 'acc', name_ar: 'المحاسبة', name_en: 'Accounting' },
  { id: 'fin', name_ar: 'المالية', name_en: 'Finance' },
  { id: 'mkt', name_ar: 'التسويق', name_en: 'Marketing' },
  { id: 'hrm', name_ar: 'إدارة الموارد البشرية', name_en: 'Human Resource Management' },
  { id: 'mgt', name_ar: 'الإدارة', name_en: 'Management' },
];

const SignupPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupFormData>({
    defaultValues: {
      role: 'student',
      major: 'نظم المعلومات الإدارية',
      level: 1,
    }
  });

  const selectedRole = watch('role');
  const password = watch('password');

  // إذا كان المستخدم مسجل دخول، وجهه للوحة التحكم
  useEffect(() => {
    if (!authLoading && user) {
      console.log('User logged in after signup, redirecting...', user.role);
      switch (user.role) {
        case 'student':
          navigate('/student/dashboard', { replace: true });
          break;
        case 'advisor':
          navigate('/advisor/dashboard', { replace: true });
          break;
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        default:
          navigate('/student/dashboard', { replace: true });
      }
    }
  }, [user, authLoading, navigate]);

  const onSubmit = async (data: SignupFormData) => {
    setError('');
    setLoading(true);

    try {
      console.log('Attempting signup with data:', {
        email: data.email,
        role: data.role,
        full_name: data.full_name
      });
      
      await signUp(data.email, data.password, {
        full_name: data.full_name,
        role: data.role,
        student_id: data.role === 'student' ? data.student_id : undefined,
        major: data.role === 'student' ? data.major : undefined,
        level: data.role === 'student' ? Number(data.level) : undefined,
      });

      console.log('Signup successful, user should be set now');
      // التوجيه يتم تلقائياً من خلال useEffect عندما يتم تعيين user
    } catch (err: unknown) {
      console.error('Signup error:', err);
      if (err instanceof Error) {
        if (err.message.includes('already registered') || err.message.includes('already exists')) {
          setError(language === 'ar' ? 'البريد الإلكتروني مسجل مسبقاً' : 'Email already registered');
        } else {
          setError(err.message || (language === 'ar' ? 'حدث خطأ أثناء إنشاء الحساب' : 'Error creating account'));
        }
      } else {
        setError(language === 'ar' ? 'حدث خطأ أثناء إنشاء الحساب' : 'Error creating account');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/80">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  // If user is logged in, show redirecting message
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'ar' ? 'تم إنشاء الحساب بنجاح!' : 'Account Created Successfully!'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {language === 'ar' 
              ? 'جاري توجيهك إلى لوحة التحكم...' 
              : 'Redirecting you to dashboard...'}
          </p>
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900" />
        
        {/* Patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-secondary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-600/30 rounded-full blur-3xl" />
        </div>

        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 1 }}
            className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-8 border border-white/20"
          >
            <GraduationCap className="w-16 h-16 text-secondary-400" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold mb-4 text-center"
          >
            {language === 'ar' ? 'انضم إلينا' : 'Join Us'}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/80 mb-12 text-center max-w-md"
          >
            {language === 'ar' 
              ? 'ابدأ رحلتك الأكاديمية مع نظام تسجيل المقررات الحديث' 
              : 'Start your academic journey with our modern registration system'}
          </motion.p>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4 w-full max-w-sm"
          >
            {[
              { icon: BookOpen, text: language === 'ar' ? 'تسجيل سهل وسريع للمقررات' : 'Easy course registration' },
              { icon: User, text: language === 'ar' ? 'متابعة المعدل التراكمي' : 'Track your GPA' },
              { icon: Shield, text: language === 'ar' ? 'حساب آمن ومحمي' : 'Secure account' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <div className="w-10 h-10 bg-secondary-500/30 rounded-lg flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-secondary-400" />
                </div>
                <span className="text-white/90">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md py-8"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-800 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-800/30">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-800 dark:text-primary-400">
                {language === 'ar' ? 'نظام تسجيل المقررات' : 'Course Registration'}
              </h1>
              <p className="text-sm text-gray-500">{language === 'ar' ? 'جامعة الملك خالد' : 'King Khalid University'}</p>
            </div>
          </Link>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('auth.signup')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {language === 'ar' ? 'أنشئ حسابك الآن للوصول إلى النظام' : 'Create your account to access the system'}
          </p>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('auth.role')}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['student', 'advisor', 'admin'] as const).map((role) => (
                  <label
                    key={role}
                    className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedRole === role
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-400'
                    }`}
                  >
                    <input
                      type="radio"
                      {...register('role')}
                      value={role}
                      className="sr-only"
                    />
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
                      selectedRole === role
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {role === 'student' && <User className="w-6 h-6" />}
                      {role === 'advisor' && <BookOpen className="w-6 h-6" />}
                      {role === 'admin' && <Shield className="w-6 h-6" />}
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
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                  placeholder={language === 'ar' ? 'محمد أحمد' : 'Mohammed Ahmed'}
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
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
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
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                      placeholder="44012345"
                    />
                  </div>
                  {errors.student_id && (
                    <p className="mt-2 text-sm text-red-600">{errors.student_id.message}</p>
                  )}
                </div>

                {/* Major */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('auth.major')}
                  </label>
                  <select
                    {...register('major')}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                  >
                    {MAJORS.map((major) => (
                      <option key={major.id} value={major.name_ar}>
                        {language === 'ar' ? major.name_ar : major.name_en}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('auth.level')}
                  </label>
                  <select
                    {...register('level', { required: selectedRole === 'student' ? t('errors.required') : false, valueAsNumber: true })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => (
                      <option key={level} value={level}>
                        {language === 'ar' ? `المستوى ${level}` : `Level ${level}`}
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
                      message: language === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters',
                    }
                  })}
                  className="w-full px-4 py-3 px-12 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
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
                  className="w-full px-4 py-3 px-12 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
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
              className="w-full bg-gradient-to-r from-primary-800 to-primary-700 text-white py-4 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-600 transition-all duration-300 shadow-lg shadow-primary-800/30 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
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
