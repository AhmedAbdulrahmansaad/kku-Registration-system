import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { ChatMessage } from '../../types';

const ChatBot: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: t('chatbot.welcome'),
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call OpenAI API through Supabase Edge Function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            message: input,
            language,
            context: {
              userRole: user?.role,
              userName: user?.full_name,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || getLocalResponse(input),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Fallback to local responses if API fails
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getLocalResponse(input),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocalResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Arabic responses
    if (language === 'ar') {
      if (lowerQuery.includes('تسجيل') || lowerQuery.includes('مقرر')) {
        return 'لتسجيل المقررات، اذهب إلى صفحة "المقررات المتاحة" واختر المقررات التي تريد تسجيلها. تأكد من استيفاء المتطلبات السابقة وعدم وجود تعارض في الجدول.';
      }
      if (lowerQuery.includes('معدل') || lowerQuery.includes('gpa')) {
        return 'يتم حساب المعدل التراكمي بضرب نقاط كل مقرر في عدد ساعاته، ثم قسمة المجموع على إجمالي الساعات. نظام الدرجات: A+ = 5.0, A = 4.75, B+ = 4.5, B = 4.0, C+ = 3.5, C = 3.0, D+ = 2.5, D = 2.0, F = 0';
      }
      if (lowerQuery.includes('متطلب') || lowerQuery.includes('سابق')) {
        return 'المتطلبات السابقة هي المقررات التي يجب إنهاؤها بنجاح قبل التسجيل في مقرر معين. يمكنك معرفة المتطلبات السابقة لكل مقرر من صفحة تفاصيل المقرر.';
      }
      if (lowerQuery.includes('حذف') || lowerQuery.includes('انسحاب')) {
        return 'يمكنك حذف المقرر خلال فترة الحذف والإضافة دون أي أثر على السجل الأكاديمي. أما الانسحاب فيكون بعد انتهاء فترة الحذف ويظهر في السجل برمز W.';
      }
      if (lowerQuery.includes('جدول') || lowerQuery.includes('محاضرات')) {
        return 'يمكنك الاطلاع على جدولك الأسبوعي من صفحة "الجدول الأسبوعي" في لوحة التحكم. يعرض الجدول جميع المقررات المسجلة مع أوقاتها وقاعاتها.';
      }
      return 'شكراً لتواصلك! أنا المساعد الذكي لنظام تسجيل المقررات. يمكنني مساعدتك في:\n- تسجيل المقررات\n- حساب المعدل التراكمي\n- شرح المتطلبات السابقة\n- معلومات عن الجدول الدراسي\n\nكيف يمكنني مساعدتك؟';
    }
    
    // English responses
    if (lowerQuery.includes('register') || lowerQuery.includes('course')) {
      return 'To register for courses, go to the "Available Courses" page and select the courses you want to enroll in. Make sure you meet the prerequisites and there are no schedule conflicts.';
    }
    if (lowerQuery.includes('gpa') || lowerQuery.includes('grade')) {
      return 'GPA is calculated by multiplying each course\'s grade points by its credit hours, then dividing the sum by total credits. Grading scale: A+ = 5.0, A = 4.75, B+ = 4.5, B = 4.0, C+ = 3.5, C = 3.0, D+ = 2.5, D = 2.0, F = 0';
    }
    if (lowerQuery.includes('prerequisite')) {
      return 'Prerequisites are courses that must be completed successfully before registering for a specific course. You can find prerequisites for each course on the course details page.';
    }
    if (lowerQuery.includes('drop') || lowerQuery.includes('withdraw')) {
      return 'You can drop a course during the add/drop period without any impact on your academic record. Withdrawal after this period will show as W on your transcript.';
    }
    if (lowerQuery.includes('schedule') || lowerQuery.includes('class')) {
      return 'You can view your weekly schedule from the "Weekly Schedule" page in your dashboard. It shows all registered courses with their times and rooms.';
    }
    
    return 'Thank you for reaching out! I\'m the smart assistant for the course registration system. I can help you with:\n- Course registration\n- GPA calculation\n- Prerequisites explanation\n- Schedule information\n\nHow can I assist you?';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} w-14 h-14 bg-primary-800 text-white rounded-full shadow-lg shadow-primary-800/30 flex items-center justify-center z-40 hover:bg-primary-700 transition-colors ${isOpen ? 'hidden' : ''}`}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} w-[380px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden`}
          >
            {/* Header */}
            <div className="bg-primary-800 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{t('chatbot.title')}</h3>
                  <p className="text-xs text-white/70">متصل الآن</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-secondary-500 text-primary-900' 
                      : 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-primary-800 text-white rounded-tr-none'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-white/60' : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-800 dark:text-primary-400" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl rounded-tl-none">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary-800 dark:text-primary-400" />
                      <span className="text-sm text-gray-500">{t('chatbot.thinking')}</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('chatbot.placeholder')}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 bg-primary-800 text-white rounded-xl flex items-center justify-center hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;

