-- =====================================================
-- نظام تسجيل المقررات - جامعة الملك خالد
-- KKU Course Registration System - Database Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. Users Table (جدول المستخدمين)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'advisor', 'admin')),
    student_id TEXT, -- فقط للطلاب، NULL للمشرفين والإداريين
    major TEXT,
    level INTEGER CHECK (level >= 1 AND level <= 8),
    advisor_id UUID REFERENCES users(id),
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_advisor ON users(advisor_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =====================================================
-- 2. Courses Table (جدول المقررات)
-- =====================================================
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_code TEXT UNIQUE NOT NULL,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    credit_hours INTEGER NOT NULL CHECK (credit_hours >= 1 AND credit_hours <= 6),
    level INTEGER NOT NULL CHECK (level >= 1 AND level <= 8),
    major TEXT NOT NULL DEFAULT 'نظم المعلومات الإدارية',
    semester TEXT NOT NULL CHECK (semester IN ('fall', 'spring', 'summer')),
    prerequisites TEXT[] DEFAULT '{}',
    instructor_name TEXT,
    schedule JSONB, -- {days: ['sunday', 'tuesday'], start_time: '10:00', end_time: '11:30'}
    room_number TEXT,
    max_students INTEGER DEFAULT 30,
    enrolled_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(course_code);
CREATE INDEX IF NOT EXISTS idx_courses_semester ON courses(semester);

-- =====================================================
-- 3. Enrollments Table (جدول التسجيلات)
-- =====================================================
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    semester TEXT NOT NULL,
    year INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'current')),
    grade TEXT CHECK (grade IN ('A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F', NULL)),
    gpa_points DECIMAL(3, 2),
    approval_date TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, course_id, semester, year)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);

-- =====================================================
-- 4. Requests Table (جدول الطلبات)
-- =====================================================
CREATE TABLE IF NOT EXISTS requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    advisor_id UUID REFERENCES users(id),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    request_type TEXT NOT NULL CHECK (request_type IN ('enroll', 'drop', 'withdraw')),
    notes TEXT,
    advisor_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_requests_student ON requests(student_id);
CREATE INDEX IF NOT EXISTS idx_requests_advisor ON requests(advisor_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);

-- =====================================================
-- 5. Notifications Table (جدول الإشعارات)
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    message_ar TEXT NOT NULL,
    message_en TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

-- =====================================================
-- 6. System Settings Table (جدول إعدادات النظام)
-- =====================================================
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. Chat Messages Table (جدول رسائل المحادثة)
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user_id);

-- =====================================================
-- Functions and Triggers
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_updated_at
    BEFORE UPDATE ON requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
    BEFORE UPDATE ON system_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate GPA points based on grade
CREATE OR REPLACE FUNCTION calculate_gpa_points(grade TEXT)
RETURNS DECIMAL AS $$
BEGIN
    RETURN CASE grade
        WHEN 'A+' THEN 5.0
        WHEN 'A' THEN 4.75
        WHEN 'B+' THEN 4.5
        WHEN 'B' THEN 4.0
        WHEN 'C+' THEN 3.5
        WHEN 'C' THEN 3.0
        WHEN 'D+' THEN 2.5
        WHEN 'D' THEN 2.0
        WHEN 'F' THEN 0.0
        ELSE NULL
    END;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically set gpa_points when grade is set
CREATE OR REPLACE FUNCTION set_gpa_points()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.grade IS NOT NULL THEN
        NEW.gpa_points = calculate_gpa_points(NEW.grade);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_enrollment_gpa
    BEFORE INSERT OR UPDATE ON enrollments
    FOR EACH ROW
    EXECUTE FUNCTION set_gpa_points();

-- Function to update enrolled_count in courses
CREATE OR REPLACE FUNCTION update_enrolled_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status IN ('approved', 'current') THEN
        UPDATE courses SET enrolled_count = enrolled_count + 1 WHERE id = NEW.course_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status NOT IN ('approved', 'current') AND NEW.status IN ('approved', 'current') THEN
            UPDATE courses SET enrolled_count = enrolled_count + 1 WHERE id = NEW.course_id;
        ELSIF OLD.status IN ('approved', 'current') AND NEW.status NOT IN ('approved', 'current') THEN
            UPDATE courses SET enrolled_count = enrolled_count - 1 WHERE id = NEW.course_id;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.status IN ('approved', 'current') THEN
        UPDATE courses SET enrolled_count = enrolled_count - 1 WHERE id = OLD.course_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_course_enrolled_count
    AFTER INSERT OR UPDATE OR DELETE ON enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_enrolled_count();

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Advisors can view their students" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'advisor' 
            AND users.advisor_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can manage all users" ON users
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Allow insert for signup" ON users
    FOR INSERT WITH CHECK (true);

-- Policies for courses table
CREATE POLICY "Anyone can view courses" ON courses
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage courses" ON courses
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Policies for enrollments table
CREATE POLICY "Students can view their enrollments" ON enrollments
    FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can create enrollments" ON enrollments
    FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Advisors can view student enrollments" ON enrollments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'advisor'
            AND enrollments.student_id IN (
                SELECT id FROM users WHERE advisor_id = auth.uid()
            )
        )
    );

CREATE POLICY "Advisors can update enrollments" ON enrollments
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'advisor'
        )
    );

CREATE POLICY "Admins can manage all enrollments" ON enrollments
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Policies for requests table
CREATE POLICY "Students can view their requests" ON requests
    FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can create requests" ON requests
    FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Advisors can view assigned requests" ON requests
    FOR SELECT USING (advisor_id = auth.uid());

CREATE POLICY "Advisors can update requests" ON requests
    FOR UPDATE USING (advisor_id = auth.uid());

CREATE POLICY "Admins can manage all requests" ON requests
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Policies for notifications table
CREATE POLICY "Users can view their notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON notifications
    FOR INSERT WITH CHECK (true);

-- Policies for chat_messages table
CREATE POLICY "Users can view their chat messages" ON chat_messages
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create chat messages" ON chat_messages
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Policies for system_settings table
CREATE POLICY "Anyone can view settings" ON system_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings" ON system_settings
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- =====================================================
-- Insert Initial Data - Courses (49 مقرر)
-- =====================================================

-- المستوى الأول (Level 1)
INSERT INTO courses (course_code, name_ar, name_en, description_ar, description_en, credit_hours, level, semester, prerequisites, instructor_name, schedule, room_number, max_students) VALUES
('MIS101', 'مهارات الاتصال', 'Communication Skills', 'تطوير مهارات الاتصال الشفهي والكتابي في بيئة الأعمال', 'Developing oral and written communication skills in business environment', 3, 1, 'fall', '{}', 'د. أحمد محمد', '{"days": ["sunday", "tuesday"], "start_time": "08:00", "end_time": "09:30"}', 'A101', 35),
('MIS102', 'اللغة الإنجليزية I', 'English Language I', 'أساسيات اللغة الإنجليزية للأعمال', 'Fundamentals of Business English', 3, 1, 'fall', '{}', 'د. سارة علي', '{"days": ["monday", "wednesday"], "start_time": "08:00", "end_time": "09:30"}', 'A102', 35),
('MIS103', 'مقدمة في الحاسب', 'Introduction to Computing', 'مقدمة شاملة في علوم الحاسب وتطبيقاته', 'Comprehensive introduction to computer science and applications', 3, 1, 'fall', '{}', 'د. خالد العمري', '{"days": ["sunday", "tuesday"], "start_time": "10:00", "end_time": "11:30"}', 'Lab1', 30),
('MIS104', 'مبادئ المحاسبة', 'Principles of Accounting', 'المفاهيم الأساسية للمحاسبة المالية', 'Basic concepts of financial accounting', 3, 1, 'fall', '{}', 'د. فاطمة الزهراء', '{"days": ["monday", "wednesday"], "start_time": "10:00", "end_time": "11:30"}', 'A103', 35),
('MIS105', 'الرياضيات للإدارة', 'Mathematics for Management', 'تطبيقات الرياضيات في إدارة الأعمال', 'Mathematical applications in business management', 3, 1, 'fall', '{}', 'د. محمد السالم', '{"days": ["sunday", "thursday"], "start_time": "12:00", "end_time": "13:30"}', 'A104', 35),
('MIS106', 'مبادئ الإدارة', 'Principles of Management', 'المفاهيم الأساسية في الإدارة والتنظيم', 'Basic concepts in management and organization', 3, 1, 'fall', '{}', 'د. عبدالله الشمري', '{"days": ["tuesday", "thursday"], "start_time": "12:00", "end_time": "13:30"}', 'A105', 35),

-- المستوى الثاني (Level 2)
('MIS201', 'اللغة الإنجليزية II', 'English Language II', 'اللغة الإنجليزية المتقدمة للأعمال', 'Advanced Business English', 3, 2, 'spring', ARRAY['MIS102'], 'د. سارة علي', '{"days": ["sunday", "tuesday"], "start_time": "08:00", "end_time": "09:30"}', 'A102', 35),
('MIS202', 'برمجة الحاسب', 'Computer Programming', 'أساسيات البرمجة وحل المشكلات', 'Programming fundamentals and problem solving', 3, 2, 'spring', ARRAY['MIS103'], 'د. خالد العمري', '{"days": ["monday", "wednesday"], "start_time": "10:00", "end_time": "11:30"}', 'Lab1', 30),
('MIS203', 'مبادئ الاقتصاد الجزئي', 'Microeconomics', 'نظريات الاقتصاد الجزئي وتطبيقاتها', 'Microeconomic theories and applications', 3, 2, 'spring', '{}', 'د. نورة الحربي', '{"days": ["sunday", "tuesday"], "start_time": "10:00", "end_time": "11:30"}', 'A106', 35),
('MIS204', 'مبادئ الإحصاء', 'Principles of Statistics', 'المفاهيم الأساسية في الإحصاء الوصفي والاستدلالي', 'Basic concepts in descriptive and inferential statistics', 3, 2, 'spring', ARRAY['MIS105'], 'د. محمد السالم', '{"days": ["monday", "wednesday"], "start_time": "12:00", "end_time": "13:30"}', 'A107', 35),
('MIS205', 'مبادئ التسويق', 'Principles of Marketing', 'أساسيات التسويق واستراتيجياته', 'Marketing fundamentals and strategies', 3, 2, 'spring', ARRAY['MIS106'], 'د. هند القحطاني', '{"days": ["tuesday", "thursday"], "start_time": "10:00", "end_time": "11:30"}', 'A108', 35),
('MIS206', 'السلوك التنظيمي', 'Organizational Behavior', 'دراسة السلوك الفردي والجماعي في المنظمات', 'Study of individual and group behavior in organizations', 3, 2, 'spring', ARRAY['MIS106'], 'د. عبدالله الشمري', '{"days": ["sunday", "thursday"], "start_time": "14:00", "end_time": "15:30"}', 'A109', 35),

-- المستوى الثالث (Level 3)
('MIS301', 'الثقافة الإسلامية', 'Islamic Culture', 'دراسة الثقافة الإسلامية وتطبيقاتها المعاصرة', 'Study of Islamic culture and contemporary applications', 2, 3, 'fall', '{}', 'د. عبدالرحمن الفقيه', '{"days": ["sunday"], "start_time": "08:00", "end_time": "09:30"}', 'A110', 40),
('MIS302', 'هياكل البيانات', 'Data Structures', 'دراسة هياكل البيانات المختلفة وتطبيقاتها', 'Study of various data structures and applications', 3, 3, 'fall', ARRAY['MIS202'], 'د. خالد العمري', '{"days": ["monday", "wednesday"], "start_time": "08:00", "end_time": "09:30"}', 'Lab2', 30),
('MIS303', 'قواعد البيانات', 'Database Systems', 'تصميم وإدارة قواعد البيانات العلائقية', 'Design and management of relational databases', 3, 3, 'fall', ARRAY['MIS202'], 'د. ياسر المالكي', '{"days": ["sunday", "tuesday"], "start_time": "10:00", "end_time": "11:30"}', 'Lab3', 30),
('MIS304', 'الإحصاء للأعمال', 'Business Statistics', 'تطبيقات الإحصاء في اتخاذ القرارات الإدارية', 'Statistical applications in managerial decision making', 3, 3, 'fall', ARRAY['MIS204'], 'د. محمد السالم', '{"days": ["tuesday", "thursday"], "start_time": "12:00", "end_time": "13:30"}', 'A111', 35),
('MIS305', 'إدارة الموارد البشرية', 'Human Resource Management', 'إدارة وتطوير الموارد البشرية في المنظمات', 'Managing and developing human resources in organizations', 3, 3, 'fall', ARRAY['MIS206'], 'د. منى العتيبي', '{"days": ["monday", "wednesday"], "start_time": "14:00", "end_time": "15:30"}', 'A112', 35),
('MIS306', 'نظم المعلومات الإدارية', 'Management Information Systems', 'مقدمة في نظم المعلومات ودورها في المنظمات', 'Introduction to information systems and their role in organizations', 3, 3, 'fall', ARRAY['MIS103', 'MIS106'], 'د. سلطان الدوسري', '{"days": ["sunday", "thursday"], "start_time": "10:00", "end_time": "11:30"}', 'A113', 35),

-- المستوى الرابع (Level 4)
('MIS401', 'تحليل وتصميم النظم', 'Systems Analysis and Design', 'منهجيات تحليل وتصميم نظم المعلومات', 'Methodologies for analyzing and designing information systems', 3, 4, 'spring', ARRAY['MIS306'], 'د. سلطان الدوسري', '{"days": ["sunday", "tuesday"], "start_time": "08:00", "end_time": "09:30"}', 'A114', 35),
('MIS402', 'شبكات الحاسب', 'Computer Networks', 'أساسيات شبكات الحاسب والاتصالات', 'Fundamentals of computer networks and communications', 3, 4, 'spring', ARRAY['MIS103'], 'د. فهد الغامدي', '{"days": ["monday", "wednesday"], "start_time": "10:00", "end_time": "11:30"}', 'Lab4', 30),
('MIS403', 'الإدارة المالية', 'Financial Management', 'إدارة الموارد المالية واتخاذ القرارات المالية', 'Managing financial resources and financial decision making', 3, 4, 'spring', ARRAY['MIS104'], 'د. فاطمة الزهراء', '{"days": ["sunday", "tuesday"], "start_time": "12:00", "end_time": "13:30"}', 'A115', 35),
('MIS404', 'إدارة العمليات', 'Operations Management', 'إدارة العمليات الإنتاجية والخدمية', 'Managing production and service operations', 3, 4, 'spring', ARRAY['MIS304'], 'د. ناصر الزهراني', '{"days": ["tuesday", "thursday"], "start_time": "10:00", "end_time": "11:30"}', 'A116', 35),
('MIS405', 'بحوث العمليات', 'Operations Research', 'تطبيق الأساليب الكمية في اتخاذ القرارات', 'Applying quantitative methods in decision making', 3, 4, 'spring', ARRAY['MIS304'], 'د. محمد السالم', '{"days": ["monday", "wednesday"], "start_time": "14:00", "end_time": "15:30"}', 'A117', 35),
('MIS406', 'القانون التجاري', 'Business Law', 'الإطار القانوني للأعمال التجارية', 'Legal framework for commercial business', 2, 4, 'spring', '{}', 'د. سعد المطيري', '{"days": ["thursday"], "start_time": "08:00", "end_time": "09:30"}', 'A118', 40),

-- المستوى الخامس (Level 5)
('MIS501', 'تطبيقات الإنترنت', 'Internet Applications', 'تطوير تطبيقات الويب وخدمات الإنترنت', 'Developing web applications and internet services', 3, 5, 'fall', ARRAY['MIS402'], 'د. فهد الغامدي', '{"days": ["sunday", "tuesday"], "start_time": "08:00", "end_time": "09:30"}', 'Lab5', 30),
('MIS502', 'إدارة قواعد البيانات', 'Database Management', 'إدارة وتحسين أداء قواعد البيانات', 'Managing and optimizing database performance', 3, 5, 'fall', ARRAY['MIS303'], 'د. ياسر المالكي', '{"days": ["monday", "wednesday"], "start_time": "10:00", "end_time": "11:30"}', 'Lab3', 30),
('MIS503', 'الذكاء الاصطناعي للأعمال', 'AI for Business', 'تطبيقات الذكاء الاصطناعي في بيئة الأعمال', 'AI applications in business environment', 3, 5, 'fall', ARRAY['MIS302'], 'د. خالد العمري', '{"days": ["sunday", "thursday"], "start_time": "12:00", "end_time": "13:30"}', 'Lab2', 30),
('MIS504', 'التجارة الإلكترونية', 'E-Commerce', 'استراتيجيات ونماذج التجارة الإلكترونية', 'E-commerce strategies and models', 3, 5, 'fall', ARRAY['MIS205', 'MIS501'], 'د. هند القحطاني', '{"days": ["tuesday", "thursday"], "start_time": "10:00", "end_time": "11:30"}', 'A119', 35),
('MIS505', 'أمن المعلومات', 'Information Security', 'حماية نظم المعلومات والبيانات', 'Protecting information systems and data', 3, 5, 'fall', ARRAY['MIS402'], 'د. عمر الحازمي', '{"days": ["monday", "wednesday"], "start_time": "14:00", "end_time": "15:30"}', 'A120', 35),
('MIS506', 'إدارة المشاريع', 'Project Management', 'تخطيط وتنفيذ ومراقبة المشاريع', 'Planning, executing, and monitoring projects', 3, 5, 'fall', ARRAY['MIS401'], 'د. سلطان الدوسري', '{"days": ["sunday", "tuesday"], "start_time": "14:00", "end_time": "15:30"}', 'A121', 35),

-- المستوى السادس (Level 6)
('MIS601', 'تطوير تطبيقات الويب', 'Web Application Development', 'تطوير تطبيقات ويب متقدمة', 'Advanced web application development', 3, 6, 'spring', ARRAY['MIS501'], 'د. فهد الغامدي', '{"days": ["sunday", "tuesday"], "start_time": "08:00", "end_time": "09:30"}', 'Lab5', 30),
('MIS602', 'تحليل البيانات', 'Data Analytics', 'تحليل البيانات الضخمة واستخراج المعرفة', 'Big data analysis and knowledge extraction', 3, 6, 'spring', ARRAY['MIS304', 'MIS502'], 'د. ياسر المالكي', '{"days": ["monday", "wednesday"], "start_time": "10:00", "end_time": "11:30"}', 'Lab6', 30),
('MIS603', 'إدارة علاقات العملاء', 'CRM Systems', 'نظم إدارة علاقات العملاء وتطبيقاتها', 'Customer relationship management systems and applications', 3, 6, 'spring', ARRAY['MIS205', 'MIS306'], 'د. هند القحطاني', '{"days": ["sunday", "thursday"], "start_time": "12:00", "end_time": "13:30"}', 'A122', 35),
('MIS604', 'نظم دعم القرار', 'Decision Support Systems', 'بناء نظم دعم القرار التنفيذية', 'Building executive decision support systems', 3, 6, 'spring', ARRAY['MIS405', 'MIS503'], 'د. سلطان الدوسري', '{"days": ["tuesday", "thursday"], "start_time": "10:00", "end_time": "11:30"}', 'A123', 35),
('MIS605', 'نظم تخطيط موارد المؤسسة', 'ERP Systems', 'تخطيط وتنفيذ نظم ERP', 'Planning and implementing ERP systems', 3, 6, 'spring', ARRAY['MIS401', 'MIS403'], 'د. ناصر الزهراني', '{"days": ["monday", "wednesday"], "start_time": "14:00", "end_time": "15:30"}', 'A124', 35),
('MIS606', 'ريادة الأعمال', 'Entrepreneurship', 'أساسيات ريادة الأعمال والابتكار', 'Fundamentals of entrepreneurship and innovation', 2, 6, 'spring', ARRAY['MIS205'], 'د. منى العتيبي', '{"days": ["thursday"], "start_time": "08:00", "end_time": "09:30"}', 'A125', 40),

-- المستوى السابع (Level 7)
('MIS701', 'إدارة المعرفة', 'Knowledge Management', 'إدارة المعرفة التنظيمية ورأس المال الفكري', 'Managing organizational knowledge and intellectual capital', 3, 7, 'fall', ARRAY['MIS306'], 'د. عبدالله الشمري', '{"days": ["sunday", "tuesday"], "start_time": "08:00", "end_time": "09:30"}', 'A126', 35),
('MIS702', 'حوكمة تقنية المعلومات', 'IT Governance', 'حوكمة وإدارة تقنية المعلومات', 'IT governance and management', 3, 7, 'fall', ARRAY['MIS506'], 'د. سلطان الدوسري', '{"days": ["monday", "wednesday"], "start_time": "10:00", "end_time": "11:30"}', 'A127', 35),
('MIS703', 'ذكاء الأعمال', 'Business Intelligence', 'تطبيقات ذكاء الأعمال والتحليلات', 'Business intelligence and analytics applications', 3, 7, 'fall', ARRAY['MIS602'], 'د. ياسر المالكي', '{"days": ["sunday", "thursday"], "start_time": "12:00", "end_time": "13:30"}', 'Lab6', 30),
('MIS704', 'استراتيجية نظم المعلومات', 'IS Strategy', 'التخطيط الاستراتيجي لنظم المعلومات', 'Strategic planning for information systems', 3, 7, 'fall', ARRAY['MIS702'], 'د. عبدالله الشمري', '{"days": ["tuesday", "thursday"], "start_time": "10:00", "end_time": "11:30"}', 'A128', 35),
('MIS705', 'إدارة التغيير التنظيمي', 'Change Management', 'إدارة التغيير في المنظمات', 'Managing organizational change', 3, 7, 'fall', ARRAY['MIS206'], 'د. منى العتيبي', '{"days": ["monday", "wednesday"], "start_time": "14:00", "end_time": "15:30"}', 'A129', 35),
('MIS706', 'أخلاقيات المعلوماتية', 'IT Ethics', 'القضايا الأخلاقية في تقنية المعلومات', 'Ethical issues in information technology', 2, 7, 'fall', '{}', 'د. عبدالرحمن الفقيه', '{"days": ["thursday"], "start_time": "14:00", "end_time": "15:30"}', 'A130', 40),

-- المستوى الثامن (Level 8)
('MIS801', 'مشروع التخرج 1', 'Graduation Project I', 'المرحلة الأولى من مشروع التخرج', 'First phase of graduation project', 3, 8, 'spring', ARRAY['MIS401', 'MIS502'], 'د. سلطان الدوسري', '{"days": ["sunday"], "start_time": "10:00", "end_time": "12:00"}', 'A131', 20),
('MIS802', 'مشروع التخرج 2', 'Graduation Project II', 'المرحلة الثانية من مشروع التخرج', 'Second phase of graduation project', 3, 8, 'spring', ARRAY['MIS801'], 'د. سلطان الدوسري', '{"days": ["tuesday"], "start_time": "10:00", "end_time": "12:00"}', 'A131', 20),
('MIS803', 'إدارة الابتكار', 'Innovation Management', 'إدارة الابتكار والإبداع في المنظمات', 'Managing innovation and creativity in organizations', 3, 8, 'spring', ARRAY['MIS606'], 'د. منى العتيبي', '{"days": ["monday", "wednesday"], "start_time": "08:00", "end_time": "09:30"}', 'A132', 35),
('MIS804', 'حلقة بحث', 'Research Seminar', 'منهجية البحث العلمي في نظم المعلومات', 'Research methodology in information systems', 2, 8, 'spring', '{}', 'د. عبدالله الشمري', '{"days": ["thursday"], "start_time": "10:00", "end_time": "11:30"}', 'A133', 30),
('MIS805', 'التدريب الميداني', 'Internship', 'التدريب العملي في بيئة العمل', 'Practical training in work environment', 3, 8, 'summer', ARRAY['MIS802'], 'د. سلطان الدوسري', '{"days": ["sunday", "monday", "tuesday", "wednesday", "thursday"], "start_time": "08:00", "end_time": "14:00"}', 'External', 30),
('MIS806', 'الحوسبة السحابية', 'Cloud Computing', 'خدمات ونماذج الحوسبة السحابية', 'Cloud computing services and models', 3, 8, 'spring', ARRAY['MIS402', 'MIS505'], 'د. فهد الغامدي', '{"days": ["sunday", "tuesday"], "start_time": "14:00", "end_time": "15:30"}', 'Lab4', 30),
('MIS807', 'إدارة سلسلة الإمداد', 'Supply Chain Management', 'إدارة سلسلة التوريد والإمداد', 'Managing supply chain and logistics', 3, 8, 'spring', ARRAY['MIS404', 'MIS605'], 'د. ناصر الزهراني', '{"days": ["tuesday", "thursday"], "start_time": "14:00", "end_time": "15:30"}', 'A134', 35);

-- =====================================================
-- Insert System Settings
-- =====================================================
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('registration_open', 'true', 'Is course registration currently open'),
('current_semester', '"spring"', 'Current semester'),
('current_year', '2024', 'Current academic year'),
('max_credits_per_semester', '21', 'Maximum credit hours per semester'),
('min_credits_per_semester', '12', 'Minimum credit hours per semester'),
('late_registration_open', 'false', 'Is late registration allowed'),
('drop_deadline', '"2024-03-15"', 'Last date to drop courses'),
('withdraw_deadline', '"2024-04-30"', 'Last date to withdraw from courses');

-- =====================================================
-- End of Schema
-- =====================================================

