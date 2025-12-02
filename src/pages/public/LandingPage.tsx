import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, BookOpen, Users, Clock, Shield,
  ChevronLeft, ChevronRight, Award, TrendingUp, Calendar,
  CheckCircle, ArrowRight, Sparkles, MessageSquare, Globe
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const LandingPage: React.FC = () => {
  const { t, language, isRTL } = useLanguage();

  const features = [
    {
      icon: BookOpen,
      title: language === 'ar' ? 'تسجيل المقررات' : 'Course Registration',
      description: language === 'ar' 
        ? 'سجّل مقرراتك بسهولة مع نظام ذكي يتحقق من المتطلبات المسبقة' 
        : 'Register your courses easily with smart prerequisite checking',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: TrendingUp,
      title: language === 'ar' ? 'حساب المعدل' : 'GPA Calculator',
      description: language === 'ar' 
        ? 'احسب معدلك التراكمي تلقائياً مع رسوم بيانية تفاعلية' 
        : 'Calculate your GPA automatically with interactive charts',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Calendar,
      title: language === 'ar' ? 'الجدول الدراسي' : 'Class Schedule',
      description: language === 'ar' 
        ? 'عرض جدولك الأسبوعي بشكل منظم وواضح' 
        : 'View your weekly schedule in an organized manner',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Shield,
      title: language === 'ar' ? 'نظام آمن' : 'Secure System',
      description: language === 'ar' 
        ? 'حماية بياناتك بأحدث تقنيات الأمان' 
        : 'Your data protected with the latest security technologies',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: MessageSquare,
      title: language === 'ar' ? 'مساعد ذكي' : 'AI Assistant',
      description: language === 'ar' 
        ? 'روبوت محادثة ذكي للإجابة على استفساراتك' 
        : 'Smart chatbot to answer your questions',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      icon: Globe,
      title: language === 'ar' ? 'دعم اللغات' : 'Multilingual',
      description: language === 'ar' 
        ? 'واجهة كاملة بالعربية والإنجليزية' 
        : 'Full interface in Arabic and English',
      color: 'from-teal-500 to-teal-600',
    },
  ];

  const stats = [
    { value: '49', label: language === 'ar' ? 'مقرر دراسي' : 'Courses' },
    { value: '8', label: language === 'ar' ? 'مستويات' : 'Levels' },
    { value: '140', label: language === 'ar' ? 'ساعة معتمدة' : 'Credits' },
    { value: '6', label: language === 'ar' ? 'تخصصات' : 'Majors' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background with University Image */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900" />
        </div>
        
        {/* Animated Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-secondary-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-700/10 rounded-full blur-3xl" />
        </div>

        {/* Islamic Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 0l40 40-40 40L0 40 40 0zm0 10L10 40l30 30 30-30L40 10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-right"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-5 h-5 text-secondary-400" />
                <span className="text-white/90 text-sm font-medium">
                  {language === 'ar' ? 'نظام حديث ومتطور' : 'Modern & Advanced System'}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {language === 'ar' ? (
                  <>نظام تسجيل المقررات<br /><span className="text-secondary-400">جامعة الملك خالد</span></>
                ) : (
                  <>Course Registration<br /><span className="text-secondary-400">King Khalid University</span></>
                )}
              </h1>

              <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0">
                {language === 'ar' 
                  ? 'نظام متكامل وحديث لتسجيل المقررات الدراسية يوفر تجربة سلسة للطلاب والمرشدين الأكاديميين والمدراء' 
                  : 'A comprehensive modern system for course registration providing a seamless experience for students, advisors, and administrators'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-primary-900 px-8 py-4 rounded-xl font-bold hover:from-secondary-400 hover:to-secondary-500 transition-all duration-300 shadow-lg shadow-secondary-500/30 flex items-center justify-center gap-2 group"
                >
                  {t('common.getStarted')}
                  {isRTL ? (
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </Link>
                <Link
                  to="/login"
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  {t('auth.login')}
                </Link>
              </div>
            </motion.div>

            {/* Visual Element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <GraduationCap className="w-9 h-9 text-primary-900" />
                    </div>
                    <div>
                      <h3 className="text-white text-xl font-bold">
                        {language === 'ar' ? 'كلية إدارة الأعمال' : 'College of Business'}
                      </h3>
                      <p className="text-white/70">
                        {language === 'ar' ? 'قسم نظم المعلومات الإدارية' : 'MIS Department'}
                      </p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="bg-white/10 rounded-xl p-4 text-center"
                      >
                        <p className="text-3xl font-bold text-secondary-400">{stat.value}</p>
                        <p className="text-white/70 text-sm">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-8 -left-8 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {language === 'ar' ? 'تم التسجيل' : 'Registered'}
                      </p>
                      <p className="text-xs text-gray-500">MIS101</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">GPA</p>
                      <p className="text-2xl font-bold text-primary-600">4.75</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-2.5 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              {language === 'ar' ? 'مميزات النظام' : 'System Features'}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'ar' ? 'كل ما تحتاجه في مكان واحد' : 'Everything You Need in One Place'}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'نظام شامل يوفر جميع الأدوات اللازمة لإدارة رحلتك الأكاديمية' 
                : 'A comprehensive system providing all the tools needed to manage your academic journey'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* University Showcase Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80')`,
            }}
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80" 
                  alt={language === 'ar' ? 'جامعة الملك خالد' : 'King Khalid University'}
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-800 to-primary-600 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-9 h-9 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">KKU</p>
                    <p className="text-sm text-gray-500">{language === 'ar' ? 'جامعة الملك خالد' : 'King Khalid University'}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {language === 'ar' ? 'جامعة الملك خالد' : 'King Khalid University'}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {language === 'ar' 
                  ? 'جامعة الملك خالد هي إحدى الجامعات الحكومية في المملكة العربية السعودية، تأسست عام 1419 هـ. تقدم الجامعة برامج أكاديمية متميزة في مختلف التخصصات، وتلتزم بتقديم تعليم عالي الجودة يواكب متطلبات العصر.'
                  : 'King Khalid University is one of the public universities in Saudi Arabia, established in 1998. The university offers distinguished academic programs in various disciplines and is committed to providing high-quality education that meets the requirements of the modern era.'}
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                  <p className="text-3xl font-bold text-primary-600 mb-1">50+</p>
                  <p className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'كلية' : 'Colleges'}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                  <p className="text-3xl font-bold text-primary-600 mb-1">100K+</p>
                  <p className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'طالب' : 'Students'}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20">
              <GraduationCap className="w-10 h-10 text-secondary-400" />
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {language === 'ar' ? 'ابدأ رحلتك الأكاديمية الآن' : 'Start Your Academic Journey Now'}
            </h2>

            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'انضم إلى آلاف الطلاب الذين يستخدمون نظام تسجيل المقررات لإدارة مسيرتهم الأكاديمية' 
                : 'Join thousands of students using the course registration system to manage their academic career'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-primary-900 px-10 py-4 rounded-xl font-bold hover:from-secondary-400 hover:to-secondary-500 transition-all duration-300 shadow-lg shadow-secondary-500/30 flex items-center justify-center gap-2"
              >
                {language === 'ar' ? 'إنشاء حساب جديد' : 'Create New Account'}
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
              <Link
                to="/about"
                className="bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                {t('nav.about')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Award className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {language === 'ar' ? 'جامعة معتمدة' : 'Accredited University'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'جامعة الملك خالد معتمدة من وزارة التعليم' : 'King Khalid University is accredited by MOE'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {language === 'ar' ? 'دعم متواصل' : 'Continuous Support'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'فريق دعم متاح للمساعدة على مدار الساعة' : 'Support team available 24/7'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Clock className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {language === 'ar' ? 'توفير الوقت' : 'Save Time'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'سجّل مقرراتك في دقائق بدلاً من ساعات' : 'Register courses in minutes instead of hours'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
