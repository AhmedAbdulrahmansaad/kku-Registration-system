import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, X, Send, Bot, User, 
  Loader2, Minimize2, Maximize2
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        text: language === 'ar' 
          ? 'مرحباً! أنا المساعد الذكي لنظام تسجيل المقررات. كيف يمكنني مساعدتك اليوم؟\n\nيمكنني مساعدتك في:\n• معلومات عن المقررات\n• كيفية التسجيل\n• حساب المعدل التراكمي\n• الأسئلة الشائعة'
          : "Hello! I'm the smart assistant for the course registration system. How can I help you today?\n\nI can help you with:\n• Course information\n• Registration process\n• GPA calculation\n• FAQs",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, language]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Arabic responses
    if (language === 'ar') {
      if (lowerMessage.includes('تسجيل') || lowerMessage.includes('سجل')) {
        return 'لتسجيل المقررات:\n1. اذهب إلى صفحة "المقررات"\n2. اختر المقررات المناسبة لمستواك\n3. اضغط على "تسجيل"\n4. انتظر موافقة المرشد الأكاديمي\n\nتأكد من استيفاء المتطلبات السابقة قبل التسجيل.';
      }
      if (lowerMessage.includes('معدل') || lowerMessage.includes('gpa')) {
        return 'لحساب المعدل التراكمي:\n\nنظام الدرجات:\n• A+ = 5.0\n• A = 4.75\n• B+ = 4.5\n• B = 4.0\n• C+ = 3.5\n• C = 3.0\n• D+ = 2.5\n• D = 2.0\n• F = 0\n\nالمعدل = (مجموع النقاط × الساعات) ÷ إجمالي الساعات';
      }
      if (lowerMessage.includes('متطلب') || lowerMessage.includes('prerequisite')) {
        return 'المتطلبات السابقة هي مقررات يجب اجتيازها قبل التسجيل في مقرر معين.\n\nللتحقق من المتطلبات:\n1. افتح صفحة المقررات\n2. اضغط على المقرر لرؤية التفاصيل\n3. ستظهر المتطلبات السابقة إن وجدت';
      }
      if (lowerMessage.includes('مرشد') || lowerMessage.includes('advisor')) {
        return 'المرشد الأكاديمي مسؤول عن:\n• الموافقة على طلبات التسجيل\n• تقديم النصح الأكاديمي\n• متابعة تقدمك الدراسي\n\nيمكنك التواصل مع مرشدك من خلال النظام.';
      }
      if (lowerMessage.includes('جدول') || lowerMessage.includes('schedule')) {
        return 'لعرض جدولك الدراسي:\n1. اذهب إلى "الجدول" من القائمة الجانبية\n2. سيظهر جدولك الأسبوعي\n3. يمكنك طباعة الجدول أو تحميله';
      }
      return 'شكراً على سؤالك! للحصول على مساعدة أفضل، يمكنك:\n• السؤال عن تسجيل المقررات\n• الاستفسار عن المعدل التراكمي\n• معرفة المتطلبات السابقة\n• الاستفسار عن الجدول الدراسي\n\nأو تواصل مع الدعم الفني للمزيد من المساعدة.';
    }
    
    // English responses
    if (lowerMessage.includes('register') || lowerMessage.includes('registration')) {
      return 'To register for courses:\n1. Go to the "Courses" page\n2. Select courses appropriate for your level\n3. Click "Register"\n4. Wait for advisor approval\n\nMake sure to complete prerequisites before registering.';
    }
    if (lowerMessage.includes('gpa') || lowerMessage.includes('grade')) {
      return 'GPA Calculation:\n\nGrading System:\n• A+ = 5.0\n• A = 4.75\n• B+ = 4.5\n• B = 4.0\n• C+ = 3.5\n• C = 3.0\n• D+ = 2.5\n• D = 2.0\n• F = 0\n\nGPA = (Total Points × Credit Hours) ÷ Total Hours';
    }
    if (lowerMessage.includes('prerequisite') || lowerMessage.includes('requirement')) {
      return 'Prerequisites are courses that must be completed before registering for a specific course.\n\nTo check prerequisites:\n1. Open the Courses page\n2. Click on a course to see details\n3. Prerequisites will be displayed if any';
    }
    if (lowerMessage.includes('advisor')) {
      return 'The Academic Advisor is responsible for:\n• Approving registration requests\n• Providing academic advice\n• Monitoring your academic progress\n\nYou can contact your advisor through the system.';
    }
    if (lowerMessage.includes('schedule') || lowerMessage.includes('timetable')) {
      return 'To view your class schedule:\n1. Go to "Schedule" from the sidebar\n2. Your weekly schedule will be displayed\n3. You can print or download the schedule';
    }
    return 'Thanks for your question! For better assistance, you can ask about:\n• Course registration\n• GPA calculation\n• Prerequisites\n• Class schedule\n\nOr contact technical support for more help.';
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className={`fixed ${isRTL ? 'left-6' : 'right-6'} bottom-6 z-50 w-14 h-14 bg-gradient-to-r from-primary-800 to-primary-600 text-white rounded-full shadow-lg shadow-primary-800/30 flex items-center justify-center hover:shadow-xl transition-shadow`}
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : 500,
            }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed ${isRTL ? 'left-6' : 'right-6'} bottom-6 z-50 w-96 max-w-[calc(100vw-48px)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-800 to-primary-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">
                    {language === 'ar' ? 'المساعد الذكي' : 'Smart Assistant'}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {language === 'ar' ? 'متصل الآن' : 'Online now'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMinimized ? (
                    <Maximize2 className="w-5 h-5 text-white" />
                  ) : (
                    <Minimize2 className="w-5 h-5 text-white" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end gap-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          message.sender === 'user' 
                            ? 'bg-primary-100 dark:bg-primary-900/30' 
                            : 'bg-secondary-100 dark:bg-secondary-900/30'
                        }`}>
                          {message.sender === 'user' ? (
                            <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                          ) : (
                            <Bot className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                          )}
                        </div>
                        <div className={`px-4 py-3 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-primary-800 text-white rounded-br-none'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-none">
                        <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {language === 'ar' ? 'جاري الكتابة...' : 'Typing...'}
                        </span>
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
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder={language === 'ar' ? 'اكتب رسالتك...' : 'Type your message...'}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 outline-none transition-colors"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="w-12 h-12 bg-gradient-to-r from-primary-800 to-primary-600 text-white rounded-xl flex items-center justify-center hover:from-primary-700 hover:to-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
