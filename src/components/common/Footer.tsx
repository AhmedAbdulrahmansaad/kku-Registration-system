import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, Mail, Phone, MapPin, 
  Facebook, Twitter, Instagram, Linkedin,
  Heart
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary-700 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-secondary-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  {language === 'ar' ? 'نظام التسجيل' : 'Registration'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {language === 'ar' ? 'جامعة الملك خالد' : 'King Khalid University'}
                </p>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              {language === 'ar' 
                ? 'نظام حديث ومتكامل لتسجيل المقررات الدراسية يهدف لتسهيل العملية التعليمية'
                : 'A modern and integrated course registration system aimed at facilitating the educational process'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-secondary-400 transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-secondary-400 transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-gray-400 hover:text-secondary-400 transition-colors">
                  {language === 'ar' ? 'فريق العمل' : 'Our Team'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-secondary-400 transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-lg mb-6">
              {language === 'ar' ? 'الخدمات' : 'Services'}
            </h4>
            <ul className="space-y-3">
              <li>
                <span className="text-gray-400">
                  {language === 'ar' ? 'تسجيل المقررات' : 'Course Registration'}
                </span>
              </li>
              <li>
                <span className="text-gray-400">
                  {language === 'ar' ? 'السجل الأكاديمي' : 'Academic Record'}
                </span>
              </li>
              <li>
                <span className="text-gray-400">
                  {language === 'ar' ? 'حساب المعدل' : 'GPA Calculator'}
                </span>
              </li>
              <li>
                <span className="text-gray-400">
                  {language === 'ar' ? 'الجدول الدراسي' : 'Class Schedule'}
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6">
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-secondary-400 flex-shrink-0" />
                <span>
                  {language === 'ar' 
                    ? 'أبها، المملكة العربية السعودية'
                    : 'Abha, Saudi Arabia'}
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-secondary-400 flex-shrink-0" />
                <span dir="ltr">+966 17 241 1111</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-secondary-400 flex-shrink-0" />
                <span>info@kku.edu.sa</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 hover:bg-primary-700 rounded-xl flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 hover:bg-primary-700 rounded-xl flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 hover:bg-primary-700 rounded-xl flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 hover:bg-primary-700 rounded-xl flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-right">
              © {new Date().getFullYear()} {language === 'ar' ? 'جامعة الملك خالد. جميع الحقوق محفوظة' : 'King Khalid University. All rights reserved'}
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              {language === 'ar' ? 'صُنع بـ' : 'Made with'}
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              {language === 'ar' ? 'بواسطة فريق MIS' : 'by MIS Team'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
