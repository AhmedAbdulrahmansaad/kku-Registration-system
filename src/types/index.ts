export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'advisor' | 'admin';
  student_id?: string;
  major?: string;
  level?: number;
  phone?: string;
  address?: string;
  gpa?: number;
  advisor_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface Course {
  id: string;
  course_code: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  credit_hours: number;
  level: number;
  major: string;
  prerequisites?: string[];
  semester?: string;
  instructor?: string;
  schedule_days?: string[];
  schedule_time?: string;
  room_number?: string;
  capacity?: number;
  created_at: string;
  updated_at?: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: 'current' | 'completed' | 'dropped' | 'pending';
  grade?: string;
  gpa_points?: number;
  semester: string;
  year: number;
  created_at: string;
  updated_at?: string;
  course?: Course;
  user?: User;
}

export interface Request {
  id: string;
  student_id: string;
  course_id: string;
  advisor_id?: string;
  request_type: 'registration' | 'drop' | 'override';
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  response_date?: string;
  created_at: string;
  updated_at?: string;
  course?: Course;
  student?: User;
  advisor?: User;
}

export interface Notification {
  id: string;
  user_id: string;
  title_ar: string;
  title_en: string;
  message_ar: string;
  message_en: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

export interface SystemSettings {
  setting_key: string;
  setting_value: unknown;
  updated_at: string;
}
