import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardCheck, Search, Filter, ChevronDown, Clock,
  CheckCircle, XCircle, User, BookOpen, MessageSquare, X
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';
import { Request } from '../../types';

const AdvisorRequestsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*, course:courses(*), student:users!requests_student_id_fkey(*)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request: Request) => {
    setActionLoading(true);
    try {
      // Update request status
      await supabase
        .from('requests')
        .update({ status: 'approved', response_date: new Date().toISOString() })
        .eq('id', request.id);

      // Create enrollment
      await supabase.from('enrollments').insert({
        user_id: request.student_id,
        course_id: request.course_id,
        status: 'current',
        semester: 'spring',
        year: 2024,
      });

      // Create notification
      await supabase.from('notifications').insert({
        user_id: request.student_id,
        title_ar: 'تمت الموافقة على طلب التسجيل',
        title_en: 'Registration Request Approved',
        message_ar: `تمت الموافقة على تسجيلك في مقرر ${request.course?.name_ar}`,
        message_en: `Your registration for ${request.course?.name_en} has been approved`,
        type: 'success',
      });

      fetchRequests();
    } catch (error) {
      console.error('Error approving request:', error);
    } finally {
      setActionLoading(false);
      setSelectedRequest(null);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectionReason.trim()) return;
    
    setActionLoading(true);
    try {
      await supabase
        .from('requests')
        .update({ 
          status: 'rejected', 
          response_date: new Date().toISOString(),
          rejection_reason: rejectionReason 
        })
        .eq('id', selectedRequest.id);

      // Create notification
      await supabase.from('notifications').insert({
        user_id: selectedRequest.student_id,
        title_ar: 'تم رفض طلب التسجيل',
        title_en: 'Registration Request Rejected',
        message_ar: `تم رفض تسجيلك في مقرر ${selectedRequest.course?.name_ar}. السبب: ${rejectionReason}`,
        message_en: `Your registration for ${selectedRequest.course?.name_en} has been rejected. Reason: ${rejectionReason}`,
        type: 'error',
      });

      fetchRequests();
      setShowRejectModal(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting request:', error);
    } finally {
      setActionLoading(false);
      setSelectedRequest(null);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.student?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.course?.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.course?.name_en.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
      case 'approved':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('nav.requests')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {requests.filter(r => r.status === 'pending').length} {language === 'ar' ? 'طلب معلق' : 'pending requests'}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'ar' ? 'البحث...' : 'Search...'}
            className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 outline-none"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-48 px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 outline-none appearance-none"
          >
            <option value="all">{t('common.all')}</option>
            <option value="pending">{t('common.pending')}</option>
            <option value="approved">{t('common.approved')}</option>
            <option value="rejected">{t('common.rejected')}</option>
          </select>
          <ChevronDown className="absolute top-1/2 -translate-y-1/2 left-4 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
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
                  {/* Student Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                      <User className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {request.student?.full_name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {request.student?.student_id} • {language === 'ar' ? `المستوى ${request.student?.level}` : `Level ${request.student?.level}`}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(request.status)}`}>
                    {getStatusIcon(request.status)}
                    {t(`common.${request.status}`)}
                  </span>
                </div>

                {/* Course Info */}
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {language === 'ar' ? request.course?.name_ar : request.course?.name_en}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {request.course?.course_code} • {request.course?.credit_hours} {t('courses.creditHours')}
                      </p>
                    </div>
                  </div>
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

                {/* Actions */}
                {request.status === 'pending' && (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleApprove(request)}
                      disabled={actionLoading}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-xl font-semibold hover:from-green-500 hover:to-green-400 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {t('requests.approve')}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowRejectModal(true);
                      }}
                      disabled={actionLoading}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-red-500 hover:to-red-400 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      <XCircle className="w-5 h-5" />
                      {t('requests.reject')}
                    </button>
                  </div>
                )}

                {/* Date */}
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  {language === 'ar' ? 'تاريخ الطلب: ' : 'Request Date: '}
                  {new Date(request.created_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {language === 'ar' ? 'سبب الرفض' : 'Rejection Reason'}
                </h3>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                    setSelectedRequest(null);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder={language === 'ar' ? 'اكتب سبب الرفض...' : 'Enter rejection reason...'}
                className="w-full h-32 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-red-500 outline-none resize-none"
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                    setSelectedRequest(null);
                  }}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason.trim() || actionLoading}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-red-500 hover:to-red-400 transition-all disabled:opacity-70"
                >
                  {actionLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
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
