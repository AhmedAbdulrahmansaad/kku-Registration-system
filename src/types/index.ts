// User Types
export type UserRole = 'student' | 'advisor' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  student_id: string | null;
  major: string | null;
  level: number | null;
  advisor_id: string | null;
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

// Course Types
export type Semester = 'fall' | 'spring' | 'summer';

export interface Schedule {
  days: string[];
  start_time: string;
  end_time: string;
}

export interface Course {
  id: string;
  course_code: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  credit_hours: number;
  level: number;
  major: string;
  semester: Semester;
  prerequisites: string[];
  instructor_name: string;
  schedule: Schedule;
  room_number: string;
  max_students: number;
  enrolled_count: number;
  created_at: string;
}

// Enrollment Types
export type EnrollmentStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'current';
export type GradeType = 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D+' | 'D' | 'F' | null;

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  semester: string;
  year: number;
  status: EnrollmentStatus;
  grade: GradeType;
  gpa_points: number | null;
  approval_date: string | null;
  rejection_reason: string | null;
  created_at: string;
  course?: Course;
  student?: User;
}

// Request Types
export type RequestType = 'enroll' | 'drop' | 'withdraw';
export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface Request {
  id: string;
  student_id: string;
  course_id: string;
  advisor_id: string;
  status: RequestStatus;
  request_type: RequestType;
  notes: string | null;
  advisor_notes: string | null;
  created_at: string;
  updated_at: string;
  course?: Course;
  student?: User;
}

// Notification Types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  user_id: string;
  title_ar: string;
  title_en: string;
  message_ar: string;
  message_en: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}

// GPA Calculation
export const GRADE_POINTS: Record<string, number> = {
  'A+': 5.0,
  'A': 4.75,
  'B+': 4.5,
  'B': 4.0,
  'C+': 3.5,
  'C': 3.0,
  'D+': 2.5,
  'D': 2.0,
  'F': 0.0,
};

// Stats Types
export interface DashboardStats {
  totalStudents?: number;
  totalCourses?: number;
  pendingRequests?: number;
  approvedRequests?: number;
  currentGPA?: number;
  completedCredits?: number;
  currentCredits?: number;
  totalCredits?: number;
}

// Chat Message Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

