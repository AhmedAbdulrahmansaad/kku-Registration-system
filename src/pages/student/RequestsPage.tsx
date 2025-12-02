import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Clock, CheckCircle, XCircle, Filter, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { getRequests } from '../../lib/supabase';
import { Request } from '../../types';

const RequestsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const requestsData = await getRequests(undefined, user.id);
        setRequests(requestsData || []);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const filteredRequests = requests.filter(request => 
    statusFilter === 'all' || request.status === statusFilter
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
      default:
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
    }
  };

  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case 'enroll':
        return { text: t('requests.enroll'), color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' };
      case 'drop':
        return { text: t('requests.drop'), color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' };
      case 'withdraw':
        return { text: t('requests.withdraw'), color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' };
      default:
        return { text: type, color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('requests.myRequests')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {language === 'ar' ? 'متابعة حالة طلباتك' : 'Track your requests status'}
          </p>
        </div>
        
        {/* Filter */}
        <div className="relative">
          <Filter className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-primary pr-12 appearance-none min-w-[180px]"
          >
            <option value="all">{t('common.all')}</option>
            <option value="pending">{t('requests.pending')}</option>
            <option value="approved">{t('requests.approved')}</option>
            <option value="rejected">{t('requests.rejected')}</option>
          </select>
          <ChevronDown className="absolute top-1/2 -translate-y-1/2 left-4 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-xl p-4 text-center"
        >
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {requests.filter(r => r.status === 'pending').length}
          </p>
          <p className="text-sm text-yellow-600 dark:text-yellow-400">{t('requests.pending')}</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-xl p-4 text-center"
        >
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {requests.filter(r => r.status === 'approved').length}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">{t('requests.approved')}</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-xl p-4 text-center"
        >
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {requests.filter(r => r.status === 'rejected').length}
          </p>
          <p className="text-sm text-red-600 dark:text-red-400">{t('requests.rejected')}</p>
        </motion.div>
      </div>

      {/* Requests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
      >
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">{t('requests.noRequests')}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredRequests.map((request, index) => {
              const typeLabel = getRequestTypeLabel(request.request_type);
              
              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatusBadge(request.status)}`}>
                      {getStatusIcon(request.status)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            {language === 'ar' ? request.course?.name_ar : request.course?.name_en}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {request.course?.course_code} • {request.course?.credit_hours} {t('courses.creditHours')}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(request.status)}`}>
                            {t(`requests.${request.status}`)}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs ${typeLabel.color}`}>
                            {typeLabel.text}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>
                          {t('common.date')}: {new Date(request.created_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        </span>
                        {request.notes && (
                          <span>
                            {t('requests.studentNotes')}: {request.notes}
                          </span>
                        )}
                      </div>
                      
                      {request.status === 'rejected' && request.advisor_notes && (
                        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900">
                          <p className="text-sm text-red-600 dark:text-red-400">
                            <span className="font-semibold">{t('requests.reason')}: </span>
                            {request.advisor_notes}
                          </p>
                        </div>
                      )}
                      
                      {request.status === 'approved' && (
                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900">
                          <p className="text-sm text-green-600 dark:text-green-400">
                            {t('notifications.requestApproved')}
                            {request.advisor_notes && `: ${request.advisor_notes}`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RequestsPage;

