import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, Clock, CheckCircle, XCircle, Filter, 
  ChevronDown, User, BookOpen, AlertCircle, X 
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { getRequests, updateRequestStatus, createNotification } from '../../lib/supabase';
import { Request } from '../../types';

const AdvisorRequestsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    if (!user) return;
    
    try {
      const requestsData = await getRequests(user.id);
      setRequests(requestsData || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedRequest || !actionType) return;
    
    if (actionType === 'reject' && !rejectReason.trim()) {
      setMessage({ type: 'error', text: t('requests.rejectReasonRequired') });
      return;
    }

    setProcessing(true);
    try {
      await updateRequestStatus(
        selectedRequest.id,
        actionType === 'approve' ? 'approved' : 'rejected',
        actionType === 'reject' ? rejectReason : undefined
      );

      // Send notification to student
      await createNotification({
        user_id: selectedRequest.student_id,
        title_ar: actionType === 'approve' ? 'تمت الموافقة على طلبك' : 'تم رفض طلبك',
        title_en: actionType === 'approve' ? 'Your request has been approved' : 'Your request has been rejected',
        message_ar: actionType === 'approve' 
          ? `تمت الموافقة على طلب تسجيل ${selectedRequest.course?.name_ar}`
          : `تم رفض طلب تسجيل ${selectedRequest.course?.name_ar}. السبب: ${rejectReason}`,
        message_en: actionType === 'approve'
          ? `Your enrollment request for ${selectedRequest.course?.name_en} has been approved`
          : `Your enrollment request for ${selectedRequest.course?.name_en} has been rejected. Reason: ${rejectReason}`,
        type: actionType === 'approve' ? 'success' : 'error',
      });

      setMessage({ 
        type: 'success', 
        text: actionType === 'approve' ? t('requests.approveSuccess') : t('requests.rejectSuccess') 
      });
      
      setSelectedRequest(null);
      setActionType(null);
      setRejectReason('');
      fetchRequests();
    } catch (error) {
      console.error('Error updating request:', error);
      setMessage({ type: 'error', text: t('common.error') });
    } finally {
      setProcessing(false);
    }
  };

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
            {t('requests.pendingRequests')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {language === 'ar' ? 'إدارة طلبات الطلاب' : 'Manage student requests'}
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
            <option value="pending">{t('requests.pending')}</option>
            <option value="all">{t('common.all')}</option>
            <option value="approved">{t('requests.approved')}</option>
            <option value="rejected">{t('requests.rejected')}</option>
          </select>
          <ChevronDown className="absolute top-1/2 -translate-y-1/2 left-4 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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
            <button onClick={() => setMessage(null)} className="mr-auto">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Requests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
      >
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">{t('requests.noRequests')}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredRequests.map((request, index) => (
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
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div>
                        {/* Student Info */}
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-bold text-gray-900 dark:text-white">
                            {request.student?.full_name}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ({request.student?.student_id})
                          </span>
                        </div>
                        
                        {/* Course Info */}
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {request.course?.course_code} - {language === 'ar' ? request.course?.name_ar : request.course?.name_en}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ({request.course?.credit_hours} {t('courses.creditHours')})
                          </span>
                        </div>
                        
                        {/* Request Type */}
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          request.request_type === 'enroll'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : request.request_type === 'drop'
                            ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                            : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                        }`}>
                          {t(`requests.${request.request_type}`)}
                        </span>
                        
                        {/* Notes */}
                        {request.notes && (
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-medium">{t('requests.studentNotes')}:</span> {request.notes}
                          </p>
                        )}
                        
                        {/* Date */}
                        <p className="mt-2 text-xs text-gray-400">
                          {new Date(request.created_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(request.status)}`}>
                          {t(`requests.${request.status}`)}
                        </span>
                        
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setActionType('approve');
                              }}
                              className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
                            >
                              {t('requests.approve')}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setActionType('reject');
                              }}
                              className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
                            >
                              {t('requests.reject')}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Rejection Reason */}
                    {request.status === 'rejected' && request.advisor_notes && (
                      <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900">
                        <p className="text-sm text-red-600 dark:text-red-400">
                          <span className="font-semibold">{t('requests.reason')}: </span>
                          {request.advisor_notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Action Modal */}
      <AnimatePresence>
        {selectedRequest && actionType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setSelectedRequest(null);
              setActionType(null);
              setRejectReason('');
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {actionType === 'approve' ? t('requests.approve') : t('requests.reject')}
              </h3>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedRequest.student?.full_name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedRequest.course?.course_code} - {language === 'ar' ? selectedRequest.course?.name_ar : selectedRequest.course?.name_en}
                </p>
              </div>

              {actionType === 'reject' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('requests.reason')} *
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                    className="input-primary resize-none"
                    placeholder="أدخل سبب الرفض..."
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedRequest(null);
                    setActionType(null);
                    setRejectReason('');
                  }}
                  className="flex-1 btn-outline"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleAction}
                  disabled={processing}
                  className={`flex-1 ${
                    actionType === 'approve'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white px-6 py-3 rounded-xl font-semibold transition-colors`}
                >
                  {processing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                  ) : actionType === 'approve' ? (
                    t('requests.approve')
                  ) : (
                    t('requests.reject')
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvisorRequestsPage;

