import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Send, Clock, 
  CheckCircle, MessageSquare, Facebook, Twitter, Linkedin
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Contact form data:', data);
    setSuccess(true);
    reset();
    setLoading(false);

    setTimeout(() => setSuccess(false), 5000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t('contact.address'),
      value: 'أبها، منطقة عسير، المملكة العربية السعودية',
    },
    {
      icon: Phone,
      title: t('contact.phone'),
      value: '+966 17 241 8888',
    },
    {
      icon: Mail,
      title: t('common.email'),
      value: 'mis@kku.edu.sa',
    },
    {
      icon: Clock,
      title: t('contact.workingHours'),
      value: 'الأحد - الخميس: 8:00 ص - 4:00 م',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-800 to-primary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('contact.title')}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              {t('contact.description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                أرسل رسالتك
              </h2>

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <p className="text-green-600 dark:text-green-400">{t('contact.sendSuccess')}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('contact.name')}
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: t('errors.required') })}
                    className="input-primary"
                    placeholder="أدخل اسمك"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('contact.email')}
                  </label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: t('errors.required'),
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: t('errors.invalidEmail'),
                      }
                    })}
                    className="input-primary"
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('contact.subject')}
                  </label>
                  <input
                    type="text"
                    {...register('subject', { required: t('errors.required') })}
                    className="input-primary"
                    placeholder="موضوع الرسالة"
                  />
                  {errors.subject && (
                    <p className="mt-2 text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('contact.message')}
                  </label>
                  <textarea
                    {...register('message', { required: t('errors.required') })}
                    rows={5}
                    className="input-primary resize-none"
                    placeholder="اكتب رسالتك هنا..."
                  />
                  {errors.message && (
                    <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>
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
                    <>
                      <Send className="w-5 h-5" />
                      {t('contact.send')}
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Info Cards */}
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex items-center gap-4"
                  >
                    <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                      <info.icon className="w-7 h-7 text-primary-800 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{info.title}</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=300&fit=crop"
                  alt="Map"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    جامعة الملك خالد
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    كلية إدارة الأعمال - قسم نظم المعلومات الإدارية
                  </p>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                  {t('contact.socialMedia')}
                </h3>
                <div className="flex gap-4">
                  <a
                    href="https://twitter.com/KikiNewsUniv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-100 dark:bg-gray-700 hover:bg-primary-800 hover:text-white rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Twitter className="w-6 h-6" />
                  </a>
                  <a
                    href="https://www.facebook.com/KKUofficial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-100 dark:bg-gray-700 hover:bg-primary-800 hover:text-white rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a
                    href="https://www.linkedin.com/school/king-khalid-university"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-100 dark:bg-gray-700 hover:bg-primary-800 hover:text-white rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              الأسئلة الشائعة
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: 'كيف يمكنني تسجيل المقررات؟',
                a: 'بعد تسجيل الدخول، اذهب إلى صفحة "المقررات المتاحة" واختر المقررات التي تريد تسجيلها، ثم أرسل الطلب للموافقة.',
              },
              {
                q: 'كيف يتم حساب المعدل التراكمي؟',
                a: 'يتم حساب المعدل بضرب نقاط كل مقرر في عدد ساعاته المعتمدة، ثم قسمة المجموع على إجمالي الساعات.',
              },
              {
                q: 'ماذا أفعل إذا نسيت كلمة المرور؟',
                a: 'اضغط على رابط "نسيت كلمة المرور" في صفحة تسجيل الدخول وأدخل بريدك الإلكتروني لاستلام رابط إعادة التعيين.',
              },
              {
                q: 'كيف يمكنني التواصل مع المشرف الأكاديمي؟',
                a: 'يمكنك إرسال ملاحظات مع طلب التسجيل، أو استخدام المساعد الذكي للحصول على إجابات فورية.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{faq.q}</h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

