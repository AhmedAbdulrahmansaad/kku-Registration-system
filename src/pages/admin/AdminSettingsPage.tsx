import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Save, Calendar, Clock, Users, 
  BookOpen, Bell, Shield, CheckCircle, AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

interface SystemSettings {
  registration_open: boolean;
  current_semester: string;
  current_year: number;
  max_credits_per_semester: number;
  min_credits_per_semester: number;
  late_registration_open: boolean;
  drop_deadline: string;
  withdraw_deadline: string;
}

const AdminSettingsPage: React.FC = () => {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<SystemSettings>({
    registration_open: true,
    current_semester: 'spring',
    current_year: 2024,
    max_credits_per_semester: 21,
    min_credits_per_semester: 12,
    late_registration_open: false,
    drop_deadline: '2024-03-15',
    withdraw_deadline: '2024-04-30',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const settingsObj: Partial<SystemSettings> = {};
        data.forEach((item: { setting_key: string; setting_value: unknown }) => {
          const key = item.setting_key as keyof SystemSettings;
          settingsObj[key] = typeof item.setting_value === 'string' 
            ? JSON.parse(item.setting_value) 
            : item.setting_value;
        });
        setSettings(prev => ({ ...prev, ...settingsObj }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        setting_key: key,
        setting_value: JSON.stringify(value),
        updated_at: new Date().toISOString(),
      }));

      for (const update of updates) {
        await supabase
          .from('system_settings')
          .upsert(update, { onConflict: 'setting_key' });
      }

      setMessage({ 
        type: 'success', 
        text: language === 'ar' ? 'تم حفظ الإعدادات بنجاح' : 'Settings saved successfully' 
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ 
        type: 'error', 
        text: language === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Error saving settings' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary-600" />
            {language === 'ar' ? 'إعدادات النظام' : 'System Settings'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {language === 'ar' ? 'إدارة إعدادات نظام التسجيل' : 'Manage registration system settings'}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-primary-800 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg flex items-center gap-2 disabled:opacity-70"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {language === 'ar' ? 'حفظ الإعدادات' : 'Save Settings'}
        </button>
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

      {/* Registration Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-600" />
          {language === 'ar' ? 'إعدادات التسجيل' : 'Registration Settings'}
        </h2>

        <div className="space-y-6">
          {/* Registration Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {language === 'ar' ? 'حالة التسجيل' : 'Registration Status'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {language === 'ar' ? 'السماح للطلاب بتسجيل المقررات' : 'Allow students to register courses'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.registration_open}
                onChange={(e) => setSettings(prev => ({ ...prev, registration_open: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-300 peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Late Registration */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {language === 'ar' ? 'التسجيل المتأخر' : 'Late Registration'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {language === 'ar' ? 'السماح بالتسجيل المتأخر' : 'Allow late registration'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.late_registration_open}
                onChange={(e) => setSettings(prev => ({ ...prev, late_registration_open: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-300 peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Semester & Year */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'ar' ? 'الفصل الدراسي' : 'Semester'}
              </label>
              <select
                value={settings.current_semester}
                onChange={(e) => setSettings(prev => ({ ...prev, current_semester: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 outline-none"
              >
                <option value="fall">{language === 'ar' ? 'الفصل الأول' : 'Fall'}</option>
                <option value="spring">{language === 'ar' ? 'الفصل الثاني' : 'Spring'}</option>
                <option value="summer">{language === 'ar' ? 'الفصل الصيفي' : 'Summer'}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'ar' ? 'السنة' : 'Year'}
              </label>
              <input
                type="number"
                value={settings.current_year}
                onChange={(e) => setSettings(prev => ({ ...prev, current_year: Number(e.target.value) }))}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 outline-none"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Credit Hours Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary-600" />
          {language === 'ar' ? 'حدود الساعات' : 'Credit Limits'}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'ar' ? 'الحد الأدنى للساعات' : 'Minimum Credits'}
            </label>
            <input
              type="number"
              value={settings.min_credits_per_semester}
              onChange={(e) => setSettings(prev => ({ ...prev, min_credits_per_semester: Number(e.target.value) }))}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'ar' ? 'الحد الأقصى للساعات' : 'Maximum Credits'}
            </label>
            <input
              type="number"
              value={settings.max_credits_per_semester}
              onChange={(e) => setSettings(prev => ({ ...prev, max_credits_per_semester: Number(e.target.value) }))}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 outline-none"
            />
          </div>
        </div>
      </motion.div>

      {/* Deadlines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-600" />
          {language === 'ar' ? 'المواعيد النهائية' : 'Deadlines'}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'ar' ? 'آخر موعد للحذف' : 'Drop Deadline'}
            </label>
            <input
              type="date"
              value={settings.drop_deadline}
              onChange={(e) => setSettings(prev => ({ ...prev, drop_deadline: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'ar' ? 'آخر موعد للانسحاب' : 'Withdraw Deadline'}
            </label>
            <input
              type="date"
              value={settings.withdraw_deadline}
              onChange={(e) => setSettings(prev => ({ ...prev, withdraw_deadline: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 outline-none"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSettingsPage;


