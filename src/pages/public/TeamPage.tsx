import React from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, Code, Target, Shield, Palette,
  TestTube, Sparkles, ChevronDown
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const TeamPage: React.FC = () => {
  const { language } = useLanguage();

  const supervisor = {
    name_ar: 'د. محمد رشيد',
    name_en: 'Dr. Mohammed Rashid',
    title_ar: 'المشرف الأكاديمي',
    title_en: 'Academic Supervisor',
    department_ar: 'كلية إدارة الأعمال - قسم المعلوماتية الإدارية',
    department_en: 'College of Business - MIS Department',
  };

  const teamMembers = [
    {
      id: 1,
      name_ar: 'سراج',
      name_en: 'Siraj',
      initial: 'S',
      role_ar: 'قائد المشروع',
      role_en: 'Project Leader',
      color: 'from-amber-500 to-amber-600',
    },
    {
      id: 2,
      name_ar: 'سعيد',
      name_en: 'Saeed',
      initial: 'S',
      role_ar: 'محلل الأنظمة',
      role_en: 'System Analyst',
      color: 'from-amber-500 to-amber-600',
    },
    {
      id: 3,
      name_ar: 'زياد',
      name_en: 'Ziad',
      initial: 'Z',
      role_ar: 'مطور خلفية',
      role_en: 'Backend Developer',
      color: 'from-amber-500 to-amber-600',
    },
    {
      id: 4,
      name_ar: 'وليد',
      name_en: 'Waleed',
      initial: 'W',
      role_ar: 'مطور واجهة أمامية',
      role_en: 'Frontend Developer',
      color: 'from-amber-500 to-amber-600',
    },
    {
      id: 5,
      name_ar: 'أسامة',
      name_en: 'Osama',
      initial: 'O',
      role_ar: 'مصمم تجربة المستخدم',
      role_en: 'UX Designer',
      color: 'from-amber-500 to-amber-600',
    },
    {
      id: 6,
      name_ar: 'فارس',
      name_en: 'Faris',
      initial: 'F',
      role_ar: 'مختبر وموثق النظام',
      role_en: 'QA & Documentation',
      color: 'from-amber-500 to-amber-600',
    },
  ];

  const projectGoals = [
    {
      icon: Target,
      title_ar: 'إعادة تصميم نظام تسجيل المقررات بواجهة حديثة وسهلة الاستخدام',
      title_en: 'Redesign course registration system with modern, user-friendly interface',
    },
    {
      icon: Shield,
      title_ar: 'توفير نظام آمن وموثوق لحماية بيانات الطلاب',
      title_en: 'Provide secure and reliable system to protect student data',
    },
    {
      icon: Sparkles,
      title_ar: 'تحسين تجربة المستخدم وتسهيل عملية التسجيل',
      title_en: 'Improve user experience and simplify registration process',
    },
    {
      icon: Code,
      title_ar: 'تطبيق أفضل الممارسات في تطوير الأنظمة الحديثة',
      title_en: 'Apply best practices in modern system development',
    },
  ];

  const technologies = [
    { name: 'React', icon: '⚛️' },
    { name: 'TypeScript', icon: '📘' },
    { name: 'TailwindCSS', icon: '🎨' },
    { name: 'Supabase', icon: '⚡' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      {/* Hero Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/5 to-secondary-500/5" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* University & College Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
              {/* University */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl px-8 py-4 shadow-lg flex items-center gap-3">
                <div className="w-3 h-10 bg-secondary-500 rounded-full" />
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {language === 'ar' ? 'الجامعة' : 'University'}
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {language === 'ar' ? 'جامعة الملك خالد' : 'King Khalid University'}
                  </p>
                </div>
              </div>

              {/* College */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl px-8 py-4 shadow-lg flex items-center gap-3">
                <div className="w-3 h-10 bg-primary-600 rounded-full" />
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {language === 'ar' ? 'الكلية' : 'College'}
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {language === 'ar' ? 'كلية إدارة الأعمال' : 'College of Business'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              {/* Department */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl px-8 py-4 shadow-lg flex items-center gap-3">
                <div className="w-3 h-10 bg-blue-500 rounded-full" />
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {language === 'ar' ? 'القسم' : 'Department'}
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {language === 'ar' ? 'المعلوماتية الإدارية' : 'Management Information Systems'}
                  </p>
                </div>
              </div>

              {/* Year */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl px-8 py-4 shadow-lg flex items-center gap-3">
                <div className="w-3 h-10 bg-green-500 rounded-full" />
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {language === 'ar' ? 'سنة التخرج' : 'Graduation Year'}
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white">2025-2026</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Supervisor Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl max-w-md mx-auto mb-16"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-9 h-9 text-primary-900" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">supervisor</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {language === 'ar' ? supervisor.name_ar : supervisor.name_en}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {language === 'ar' ? supervisor.department_ar : supervisor.department_en}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">team</h2>
            <p className="text-gray-500 dark:text-gray-400">
              {language === 'ar' 
                ? 'فريق عمل متميز من طلاب نظم المعلومات' 
                : 'A distinguished team of MIS students'}
            </p>
          </motion.div>

          {/* Team Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
              >
                {/* Avatar */}
                <div className="relative mb-4">
                  <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${member.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-3xl font-bold text-white">{member.initial}</span>
                  </div>
                  {/* Decorative dots */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded-full opacity-50" />
                  <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-primary-200 dark:bg-primary-600 rounded-full opacity-50" />
                </div>

                {/* Name & Role */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {language === 'ar' ? member.name_ar : member.name_en}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {language === 'ar' ? member.role_ar : member.role_en}
                </p>

                {/* Role Icon */}
                <div className="mt-3 flex justify-center gap-2">
                  {member.role_ar.includes('قائد') && <Target className="w-4 h-4 text-secondary-500" />}
                  {member.role_ar.includes('محلل') && <Sparkles className="w-4 h-4 text-blue-500" />}
                  {member.role_ar.includes('خلفية') && <Code className="w-4 h-4 text-green-500" />}
                  {member.role_ar.includes('أمامية') && <Code className="w-4 h-4 text-purple-500" />}
                  {member.role_ar.includes('مصمم') && <Palette className="w-4 h-4 text-pink-500" />}
                  {member.role_ar.includes('مختبر') && <TestTube className="w-4 h-4 text-orange-500" />}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Goals Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 rounded-full px-4 py-2 mb-4">
              <Target className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {language === 'ar' ? 'أهداف المشروع' : 'Project Goals'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {language === 'ar' 
                ? 'الأهداف الرئيسية التي يسعى المشروع لتحقيقها' 
                : 'The main goals the project aims to achieve'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {projectGoals.map((goal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <goal.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {language === 'ar' ? goal.title_ar : goal.title_en}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {language === 'ar' ? 'التقنيات المستخدمة' : 'Technologies Used'}
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 px-8 py-4 rounded-2xl shadow-lg flex items-center gap-3"
              >
                <span className="text-2xl">{tech.icon}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Banner */}
      <section className="py-12 bg-gradient-to-r from-primary-900 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-secondary-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {language === 'ar' ? 'جامعة الملك خالد' : 'King Khalid University'}
            </h3>
            <p className="text-white/80">
              {language === 'ar' 
                ? 'كلية إدارة الأعمال - قسم المعلوماتية الإدارية' 
                : 'College of Business - MIS Department'}
            </p>
            <p className="text-white/60 mt-2">
              {language === 'ar' ? 'مشروع تخرج 2025-2026' : 'Graduation Project 2025-2026'}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TeamPage;
