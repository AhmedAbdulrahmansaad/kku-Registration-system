import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardCheck, Clock, CheckCircle, XCircle, 
  BookOpen, Calendar, MessageSquare 
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { getRequests } from '../../lib/supabase';
import { Request } from '../../types';

const RequestsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const data = await getRequests(user.id);
        setRequests(data || []);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5" />;
      case 'rejected':
        return <XCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
      case 'approved':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('nav.requests')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {language === 'ar' ? 'متابعة طلبات التسجيل' : 'Track your registration requests'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <ClipboardCheck className="w-10 h-10 text-primary-600 mb-3" />
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          <p className="text-gray-500 dark:text-gray-400">{language === 'ar' ? 'إجمالي الطلبات' : 'Total Requests'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <Clock className="w-10 h-10 text-yellow-600 mb-3" />
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
          <p className="text-gray-500 dark:text-gray-400">{t('common.pending')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <CheckCircle className="w-10 h-10 text-green-600 mb-3" />
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.approved}</p>
          <p className="text-gray-500 dark:text-gray-400">{t('common.approved')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <XCircle className="w-10 h-10 text-red-600 mb-3" />
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.rejected}</p>
          <p className="text-gray-500 dark:text-gray-400">{t('common.rejected')}</p>
        </motion.div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              filter === status
                ? 'bg-primary-800 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {status === 'all' ? t('common.all') : t(`common.${status}`)}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
          <ClipboardCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{t('common.noData')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Course Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {language === 'ar' ? request.course?.name_ar : request.course?.name_en}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {request.course?.course_code} • {request.course?.credit_hours} {t('courses.creditHours')}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    {t(`common.${request.status}`)}
                  </span>
                </div>

                {/* Rejection Reason */}
                {request.status === 'rejected' && request.rejection_reason && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-800 dark:text-red-400">
                          {language === 'ar' ? 'سبب الرفض' : 'Rejection Reason'}
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-300">{request.rejection_reason}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dates */}
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {language === 'ar' ? 'تاريخ الطلب: ' : 'Request Date: '}
                      {new Date(request.created_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                    </span>
                  </div>
                  {request.response_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {language === 'ar' ? 'تاريخ الرد: ' : 'Response Date: '}
                        {new Date(request.response_date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsPage;
