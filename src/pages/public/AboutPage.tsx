import React from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, Target, Users, Award, 
  Code, Database, Palette, Shield, CheckCircle
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  const objectives = [
    { icon: Users, text: t('about.objective1') },
    { icon: Target, text: t('about.objective2') },
    { icon: Award, text: t('about.objective3') },
    { icon: Shield, text: t('about.objective4') },
  ];

  const technologies = [
    { name: 'React', description: 'Frontend Framework', icon: Code },
    { name: 'TypeScript', description: 'Type Safety', icon: Code },
    { name: 'TailwindCSS', description: 'Styling', icon: Palette },
    { name: 'Supabase', description: 'Backend & Database', icon: Database },
    { name: 'Framer Motion', description: 'Animations', icon: Palette },
    { name: 'OpenAI', description: 'Smart Assistant', icon: Target },
  ];

  const teamInfo = {
    university: t('about.university'),
    college: t('about.college'),
    department: t('about.department'),
    major: t('about.major'),
    supervisor: 'د. محمد رشيد',
    projectType: t('about.projectType'),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-800 to-primary-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('about.title')}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              {t('about.description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* University Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop"
                alt="University"
                className="rounded-2xl shadow-xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                معلومات المشروع
              </h2>
              
              <div className="space-y-4">
                {Object.entries(teamInfo).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-primary-800 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {key === 'university' && 'الجامعة'}
                        {key === 'college' && 'الكلية'}
                        {key === 'department' && 'القسم'}
                        {key === 'major' && 'التخصص'}
                        {key === 'supervisor' && t('about.supervisor')}
                        {key === 'projectType' && 'نوع المشروع'}
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('about.objectives')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              الأهداف الرئيسية التي يسعى النظام لتحقيقها
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {objectives.map((objective, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl text-center"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <objective.icon className="w-8 h-8 text-primary-800 dark:text-primary-400" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {objective.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('about.technologies')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              أحدث التقنيات المستخدمة في بناء النظام
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex items-center gap-4"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-xl flex items-center justify-center">
                  <tech.icon className="w-7 h-7 text-primary-800 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {tech.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {tech.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Highlights */}
      <section className="py-20 bg-gradient-to-br from-primary-800 to-primary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              مميزات النظام
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'تسجيل المقررات بسهولة',
              'حساب المعدل التراكمي تلقائياً',
              'نظام إشعارات متكامل',
              'مساعد ذكي بالذكاء الاصطناعي',
              'دعم العربية والإنجليزية',
              'وضع ليلي ونهاري',
              'تصميم متجاوب',
              'جدول دراسي تفاعلي',
              'نظام طلبات وموافقات',
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <CheckCircle className="w-6 h-6 text-secondary-400" />
                <span className="text-white font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

