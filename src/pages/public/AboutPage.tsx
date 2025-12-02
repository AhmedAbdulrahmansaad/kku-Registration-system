import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, Target, Users, Shield, 
  Zap, Globe, BookOpen, Award, CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutPage: React.FC = () => {
  const { language, isRTL } = useLanguage();

  const features = [
    {
      icon: BookOpen,
      title_ar: 'تسجيل سهل',
      title_en: 'Easy Registration',
      desc_ar: 'سجّل مقرراتك بخطوات بسيطة وواضحة',
      desc_en: 'Register your courses with simple steps',
    },
    {
      icon: Shield,
      title_ar: 'أمان عالي',
      title_en: 'High Security',
      desc_ar: 'حماية بياناتك بأحدث التقنيات',
      desc_en: 'Protect your data with latest technologies',
    },
    {
      icon: Zap,
      title_ar: 'سرعة فائقة',
      title_en: 'Super Fast',
      desc_ar: 'أداء سريع وتجربة سلسة',
      desc_en: 'Fast performance and smooth experience',
    },
    {
      icon: Globe,
      title_ar: 'دعم اللغات',
      title_en: 'Multilingual',
      desc_ar: 'دعم كامل للعربية والإنجليزية',
      desc_en: 'Full Arabic and English support',
    },
  ];

  const stats = [
    { value: '49', label_ar: 'مقرر دراسي', label_en: 'Courses' },
    { value: '8', label_ar: 'مستويات', label_en: 'Levels' },
    { value: '140', label_ar: 'ساعة معتمدة', label_en: 'Credit Hours' },
    { value: '24/7', label_ar: 'دعم متواصل', label_en: 'Support' },
  ];

  const benefits = [
    { ar: 'تسجيل المقررات بسهولة', en: 'Easy course registration' },
    { ar: 'متابعة المعدل التراكمي', en: 'Track your GPA' },
    { ar: 'عرض الجدول الدراسي', en: 'View class schedule' },
    { ar: 'طباعة السجل الأكاديمي', en: 'Print academic transcript' },
    { ar: 'التواصل مع المرشد', en: 'Contact your advisor' },
    { ar: 'إشعارات فورية', en: 'Instant notifications' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900" />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              <GraduationCap className="w-6 h-6 text-secondary-400" />
              <span className="text-white font-medium">
                {language === 'ar' ? 'جامعة الملك خالد' : 'King Khalid University'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {language === 'ar' ? 'عن النظام' : 'About the System'}
            </h1>
            
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              {language === 'ar' 
                ? 'نظام تسجيل المقررات الإلكتروني هو منصة حديثة ومتكاملة تهدف إلى تسهيل عملية التسجيل الأكاديمي للطلاب وتوفير أدوات فعالة للمرشدين والمدراء'
                : 'The electronic course registration system is a modern, integrated platform that aims to facilitate the academic registration process for students and provide effective tools for advisors and administrators'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 -mt-20 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-center"
                >
                  <p className="text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                    {stat.value}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {language === 'ar' ? stat.label_ar : stat.label_en}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'ar' ? 'مميزات النظام' : 'System Features'}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'نظام متكامل يوفر جميع الأدوات اللازمة لإدارة رحلتك الأكاديمية'
                : 'An integrated system providing all tools needed to manage your academic journey'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-800 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {language === 'ar' ? feature.title_ar : feature.title_en}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'ar' ? feature.desc_ar : feature.desc_en}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {language === 'ar' ? 'ماذا يقدم لك النظام؟' : 'What does the system offer?'}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                {language === 'ar' 
                  ? 'نظام شامل يغطي جميع احتياجاتك الأكاديمية في مكان واحد'
                  : 'A comprehensive system covering all your academic needs in one place'}
              </p>

              <div className="grid grid-cols-1 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                  >
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {language === 'ar' ? benefit.ar : benefit.en}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary-800 to-primary-600 rounded-3xl p-8 text-white">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                  <Award className="w-10 h-10 text-secondary-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  {language === 'ar' ? 'مشروع تخرج متميز' : 'Distinguished Graduation Project'}
                </h3>
                <p className="text-white/80 mb-6">
                  {language === 'ar' 
                    ? 'تم تطوير هذا النظام كمشروع تخرج من قسم نظم المعلومات الإدارية بجامعة الملك خالد، بإشراف نخبة من الأساتذة المتميزين'
                    : 'This system was developed as a graduation project from the MIS Department at King Khalid University, supervised by distinguished faculty members'}
                </p>
                <Link
                  to="/team"
                  className="inline-flex items-center gap-2 bg-white text-primary-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  {language === 'ar' ? 'تعرف على الفريق' : 'Meet the Team'}
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {language === 'ar' ? 'جاهز للبدء؟' : 'Ready to Start?'}
            </h2>
            <p className="text-xl text-white/80 mb-10">
              {language === 'ar' 
                ? 'انضم إلينا الآن واستمتع بتجربة تسجيل سلسة وممتعة'
                : 'Join us now and enjoy a smooth and enjoyable registration experience'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-primary-900 px-10 py-4 rounded-xl font-bold hover:from-secondary-400 hover:to-secondary-500 transition-all shadow-lg"
              >
                {language === 'ar' ? 'إنشاء حساب جديد' : 'Create New Account'}
              </Link>
              <Link
                to="/contact"
                className="bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
