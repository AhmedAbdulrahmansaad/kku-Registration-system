import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Menu, X, Globe, Sun, Moon,
  User, ChevronDown
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { t, language, toggleLanguage, isRTL } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/team', label: language === 'ar' ? 'فريق العمل' : 'Team' },
    { path: '/contact', label: t('nav.contact') },
  ];

  const isActive = (path: string) => location.pathname === path;

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'student':
        return '/student/dashboard';
      case 'advisor':
        return '/advisor/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              scrolled 
                ? 'bg-primary-800 shadow-lg' 
                : 'bg-white/10 backdrop-blur-sm border border-white/20'
            }`}>
              <GraduationCap className={`w-7 h-7 transition-colors ${
                scrolled ? 'text-white' : 'text-secondary-400'
              }`} />
            </div>
            <div className="hidden sm:block">
              <h1 className={`font-bold text-lg transition-colors ${
                scrolled ? 'text-primary-800 dark:text-white' : 'text-white'
              }`}>
                {language === 'ar' ? 'نظام التسجيل' : 'Registration'}
              </h1>
              <p className={`text-xs transition-colors ${
                scrolled ? 'text-gray-500' : 'text-white/70'
              }`}>
                {language === 'ar' ? 'جامعة الملك خالد' : 'King Khalid University'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? scrolled
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'bg-white/20 text-white'
                    : scrolled
                    ? 'text-gray-600 hover:text-primary-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`p-2.5 rounded-xl transition-all duration-200 ${
                scrolled
                  ? 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  : 'text-white/80 hover:bg-white/10'
              }`}
              title={language === 'ar' ? 'English' : 'العربية'}
            >
              <Globe className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all duration-200 ${
                scrolled
                  ? 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary-800 to-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg"
                >
                  <User className="w-5 h-5" />
                  {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                      scrolled
                        ? 'text-primary-800 hover:bg-primary-50 dark:text-primary-400'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    {t('auth.login')}
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-primary-900 px-5 py-2.5 rounded-xl font-semibold hover:from-secondary-400 hover:to-secondary-500 transition-all shadow-lg"
                  >
                    {t('auth.signup')}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2.5 rounded-xl transition-all ${
                scrolled
                  ? 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                {user ? (
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center bg-gradient-to-r from-primary-800 to-primary-700 text-white px-5 py-3 rounded-xl font-semibold"
                  >
                    {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center px-5 py-3 rounded-xl font-medium text-primary-800 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/30"
                    >
                      {t('auth.login')}
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center bg-gradient-to-r from-secondary-500 to-secondary-600 text-primary-900 px-5 py-3 rounded-xl font-semibold"
                    >
                      {t('auth.signup')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
