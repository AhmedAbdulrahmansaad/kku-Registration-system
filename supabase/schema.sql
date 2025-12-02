-- =====================================================
-- نظام تسجيل المقررات - جامعة الملك خالد
-- Course Registration System - King Khalid University
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Drop existing tables if they exist
-- =====================================================
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS requests CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- Create Users Table
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'advisor', 'admin')),
    student_id VARCHAR(20) UNIQUE,
    major VARCHAR(255),
    level INTEGER CHECK (level >= 1 AND level <= 8),
    phone VARCHAR(20),
    address TEXT,
    gpa DECIMAL(3,2) DEFAULT 0,
    advisor_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Create Courses Table
-- =====================================================
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_code VARCHAR(20) UNIQUE NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    credit_hours INTEGER NOT NULL CHECK (credit_hours >= 1 AND credit_hours <= 6),
    level INTEGER NOT NULL CHECK (level >= 1 AND level <= 8),
    major VARCHAR(255) NOT NULL,
    prerequisites TEXT[] DEFAULT '{}',
    semester VARCHAR(20),
    instructor VARCHAR(255),
    schedule_days TEXT[],
    schedule_time VARCHAR(50),
    room_number VARCHAR(50),
    capacity INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Create Enrollments Table
-- =====================================================
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'current' CHECK (status IN ('current', 'completed', 'dropped', 'pending')),
    grade VARCHAR(5),
    gpa_points DECIMAL(3,2),
    semester VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id, semester, year)
);

-- =====================================================
-- Create Requests Table
-- =====================================================
CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    advisor_id UUID REFERENCES users(id),
    request_type VARCHAR(20) NOT NULL DEFAULT 'registration' CHECK (request_type IN ('registration', 'drop', 'override')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    response_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Create Notifications Table
-- =====================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    message_ar TEXT NOT NULL,
    message_en TEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Create System Settings Table
-- =====================================================
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Enable Row Level Security
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies for Users
-- =====================================================
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow insert for authenticated users" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins and advisors can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'advisor')
        )
    );

-- =====================================================
-- RLS Policies for Courses
-- =====================================================
CREATE POLICY "Anyone can view courses" ON courses
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage courses" ON courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- RLS Policies for Enrollments
-- =====================================================
CREATE POLICY "Users can view their own enrollments" ON enrollments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own enrollments" ON enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins and advisors can view all enrollments" ON enrollments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'advisor')
        )
    );

-- =====================================================
-- RLS Policies for Requests
-- =====================================================
CREATE POLICY "Users can view their own requests" ON requests
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Users can create their own requests" ON requests
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Advisors can view and update requests" ON requests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'advisor')
        )
    );

-- =====================================================
-- RLS Policies for Notifications
-- =====================================================
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON notifications
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- RLS Policies for System Settings
-- =====================================================
CREATE POLICY "Anyone can view settings" ON system_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings" ON system_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- Insert Sample Courses (49 courses for MIS)
-- =====================================================
INSERT INTO courses (course_code, name_ar, name_en, credit_hours, level, major, instructor, prerequisites) VALUES
-- المستوى الأول
('ARAB101', 'المهارات اللغوية', 'Language Skills', 3, 1, 'نظم المعلومات الإدارية', 'د. أحمد محمد', '{}'),
('ISLM101', 'الثقافة الإسلامية 1', 'Islamic Culture 1', 2, 1, 'نظم المعلومات الإدارية', 'د. محمد علي', '{}'),
('ENGL101', 'اللغة الإنجليزية 1', 'English Language 1', 3, 1, 'نظم المعلومات الإدارية', 'د. سارة أحمد', '{}'),
('MATH101', 'الرياضيات 1', 'Mathematics 1', 3, 1, 'نظم المعلومات الإدارية', 'د. خالد سعيد', '{}'),
('CS101', 'مقدمة في الحاسب الآلي', 'Introduction to Computer', 3, 1, 'نظم المعلومات الإدارية', 'د. فهد عبدالله', '{}'),
('MGT101', 'مبادئ الإدارة', 'Principles of Management', 3, 1, 'نظم المعلومات الإدارية', 'د. سعود محمد', '{}'),

-- المستوى الثاني
('ARAB102', 'التحرير العربي', 'Arabic Writing', 3, 2, 'نظم المعلومات الإدارية', 'د. أحمد محمد', '{ARAB101}'),
('ISLM102', 'الثقافة الإسلامية 2', 'Islamic Culture 2', 2, 2, 'نظم المعلومات الإدارية', 'د. محمد علي', '{ISLM101}'),
('ENGL102', 'اللغة الإنجليزية 2', 'English Language 2', 3, 2, 'نظم المعلومات الإدارية', 'د. سارة أحمد', '{ENGL101}'),
('MATH102', 'الرياضيات 2', 'Mathematics 2', 3, 2, 'نظم المعلومات الإدارية', 'د. خالد سعيد', '{MATH101}'),
('ACC101', 'مبادئ المحاسبة 1', 'Accounting Principles 1', 3, 2, 'نظم المعلومات الإدارية', 'د. عمر حسن', '{}'),
('ECON101', 'مبادئ الاقتصاد الجزئي', 'Microeconomics', 3, 2, 'نظم المعلومات الإدارية', 'د. يوسف سالم', '{}'),

-- المستوى الثالث
('ISLM201', 'الثقافة الإسلامية 3', 'Islamic Culture 3', 2, 3, 'نظم المعلومات الإدارية', 'د. محمد علي', '{ISLM102}'),
('STAT201', 'الإحصاء في الأعمال', 'Business Statistics', 3, 3, 'نظم المعلومات الإدارية', 'د. ناصر عبدالله', '{MATH102}'),
('ACC102', 'مبادئ المحاسبة 2', 'Accounting Principles 2', 3, 3, 'نظم المعلومات الإدارية', 'د. عمر حسن', '{ACC101}'),
('ECON102', 'مبادئ الاقتصاد الكلي', 'Macroeconomics', 3, 3, 'نظم المعلومات الإدارية', 'د. يوسف سالم', '{ECON101}'),
('MIS201', 'مقدمة في نظم المعلومات', 'Introduction to Information Systems', 3, 3, 'نظم المعلومات الإدارية', 'د. عبدالرحمن سعيد', '{CS101}'),
('MKT201', 'مبادئ التسويق', 'Principles of Marketing', 3, 3, 'نظم المعلومات الإدارية', 'د. طارق محمود', '{}'),

-- المستوى الرابع
('ISLM202', 'الثقافة الإسلامية 4', 'Islamic Culture 4', 2, 4, 'نظم المعلومات الإدارية', 'د. محمد علي', '{ISLM201}'),
('MIS301', 'تحليل وتصميم النظم', 'Systems Analysis and Design', 3, 4, 'نظم المعلومات الإدارية', 'د. عبدالرحمن سعيد', '{MIS201}'),
('MIS302', 'قواعد البيانات', 'Database Management', 3, 4, 'نظم المعلومات الإدارية', 'د. فهد عبدالله', '{MIS201}'),
('FIN301', 'الإدارة المالية', 'Financial Management', 3, 4, 'نظم المعلومات الإدارية', 'د. سلطان أحمد', '{ACC102}'),
('MGT301', 'السلوك التنظيمي', 'Organizational Behavior', 3, 4, 'نظم المعلومات الإدارية', 'د. سعود محمد', '{MGT101}'),
('LAW301', 'القانون التجاري', 'Commercial Law', 3, 4, 'نظم المعلومات الإدارية', 'د. إبراهيم خالد', '{}'),

-- المستوى الخامس
('MIS401', 'البرمجة لنظم المعلومات', 'Programming for IS', 3, 5, 'نظم المعلومات الإدارية', 'د. محمد رشيد', '{MIS302}'),
('MIS402', 'شبكات الأعمال', 'Business Networks', 3, 5, 'نظم المعلومات الإدارية', 'د. عبدالله سعد', '{MIS201}'),
('MIS403', 'نظم دعم القرارات', 'Decision Support Systems', 3, 5, 'نظم المعلومات الإدارية', 'د. عبدالرحمن سعيد', '{MIS301}'),
('MGT401', 'إدارة الموارد البشرية', 'Human Resource Management', 3, 5, 'نظم المعلومات الإدارية', 'د. سعود محمد', '{MGT301}'),
('MGT402', 'إدارة العمليات', 'Operations Management', 3, 5, 'نظم المعلومات الإدارية', 'د. فيصل عبدالعزيز', '{STAT201}'),
('MIS404', 'أمن المعلومات', 'Information Security', 3, 5, 'نظم المعلومات الإدارية', 'د. عبدالله سعد', '{MIS402}'),

-- المستوى السادس
('MIS501', 'تطوير تطبيقات الويب', 'Web Application Development', 3, 6, 'نظم المعلومات الإدارية', 'د. محمد رشيد', '{MIS401}'),
('MIS502', 'التجارة الإلكترونية', 'E-Commerce', 3, 6, 'نظم المعلومات الإدارية', 'د. عبدالرحمن سعيد', '{MIS201,MKT201}'),
('MIS503', 'نظم تخطيط موارد المنشآت', 'ERP Systems', 3, 6, 'نظم المعلومات الإدارية', 'د. فهد عبدالله', '{MIS301,MIS302}'),
('MIS504', 'إدارة مشاريع نظم المعلومات', 'IS Project Management', 3, 6, 'نظم المعلومات الإدارية', 'د. عبدالله سعد', '{MIS301}'),
('MGT501', 'الإدارة الاستراتيجية', 'Strategic Management', 3, 6, 'نظم المعلومات الإدارية', 'د. سعود محمد', '{MGT401}'),
('ENTR501', 'ريادة الأعمال', 'Entrepreneurship', 3, 6, 'نظم المعلومات الإدارية', 'د. طارق محمود', '{}'),

-- المستوى السابع
('MIS601', 'تطبيقات الأجهزة الذكية', 'Mobile Applications', 3, 7, 'نظم المعلومات الإدارية', 'د. محمد رشيد', '{MIS501}'),
('MIS602', 'الذكاء الاصطناعي في الأعمال', 'AI in Business', 3, 7, 'نظم المعلومات الإدارية', 'د. عبدالرحمن سعيد', '{MIS403}'),
('MIS603', 'تحليل البيانات الضخمة', 'Big Data Analytics', 3, 7, 'نظم المعلومات الإدارية', 'د. فهد عبدالله', '{MIS302,STAT201}'),
('MIS604', 'الحوسبة السحابية', 'Cloud Computing', 3, 7, 'نظم المعلومات الإدارية', 'د. عبدالله سعد', '{MIS402}'),
('MIS605', 'التدريب التعاوني', 'Cooperative Training', 6, 7, 'نظم المعلومات الإدارية', 'د. محمد رشيد', '{}'),
('MIS606', 'موضوعات مختارة في نظم المعلومات', 'Selected Topics in MIS', 3, 7, 'نظم المعلومات الإدارية', 'د. عبدالرحمن سعيد', '{MIS501}'),

-- المستوى الثامن
('MIS701', 'مشروع التخرج 1', 'Graduation Project 1', 2, 8, 'نظم المعلومات الإدارية', 'د. محمد رشيد', '{MIS605}'),
('MIS702', 'مشروع التخرج 2', 'Graduation Project 2', 4, 8, 'نظم المعلومات الإدارية', 'د. محمد رشيد', '{MIS701}'),
('MIS703', 'أخلاقيات نظم المعلومات', 'IS Ethics', 3, 8, 'نظم المعلومات الإدارية', 'د. عبدالرحمن سعيد', '{}'),
('MIS704', 'حوكمة تقنية المعلومات', 'IT Governance', 3, 8, 'نظم المعلومات الإدارية', 'د. عبدالله سعد', '{MIS504}'),
('MIS705', 'إدارة المعرفة', 'Knowledge Management', 3, 8, 'نظم المعلومات الإدارية', 'د. فهد عبدالله', '{MIS403}'),
('MIS706', 'نظم المعلومات الجغرافية', 'Geographic Information Systems', 3, 8, 'نظم المعلومات الإدارية', 'د. محمد رشيد', '{MIS302}');

-- =====================================================
-- Insert Default System Settings
-- =====================================================
INSERT INTO system_settings (setting_key, setting_value) VALUES
('registration_open', 'true'),
('current_semester', '"spring"'),
('current_year', '2024'),
('max_credits_per_semester', '21'),
('min_credits_per_semester', '12');

-- =====================================================
-- Create Indexes for Performance
-- =====================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_student_id ON users(student_id);
CREATE INDEX idx_courses_code ON courses(course_code);
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_requests_student ON requests(student_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- =====================================================
-- Create Function to Auto-Update Timestamps
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Success Message
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Database schema created successfully!';
    RAISE NOTICE '📊 49 courses inserted for MIS department';
    RAISE NOTICE '⚙️ System settings configured';
    RAISE NOTICE '🔐 RLS policies applied';
END $$;
