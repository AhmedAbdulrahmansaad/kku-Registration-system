import { createClient } from '@supabase/supabase-js';
import { Course, Enrollment, Request, Notification } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Courses
export const getCourses = async (): Promise<Course[]> => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('level', { ascending: true })
    .order('course_code', { ascending: true });
  
  if (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
  return data || [];
};

export const getCourseById = async (id: string): Promise<Course | null> => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching course:', error);
    return null;
  }
  return data;
};

export const createCourse = async (course: Partial<Course>): Promise<Course | null> => {
  const { data, error } = await supabase
    .from('courses')
    .insert(course)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating course:', error);
    throw error;
  }
  return data;
};

export const updateCourse = async (id: string, course: Partial<Course>): Promise<Course | null> => {
  const { data, error } = await supabase
    .from('courses')
    .update(course)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating course:', error);
    throw error;
  }
  return data;
};

export const deleteCourse = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
  return true;
};

// Enrollments
export const getEnrollments = async (userId: string): Promise<Enrollment[]> => {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*, course:courses(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching enrollments:', error);
    return [];
  }
  return data || [];
};

export const createEnrollment = async (enrollment: Partial<Enrollment>): Promise<Enrollment | null> => {
  const { data, error } = await supabase
    .from('enrollments')
    .insert(enrollment)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating enrollment:', error);
    throw error;
  }
  return data;
};

// Requests
export const getRequests = async (userId?: string): Promise<Request[]> => {
  let query = supabase
    .from('requests')
    .select('*, course:courses(*), student:users!requests_student_id_fkey(*)')
    .order('created_at', { ascending: false });
  
  if (userId) {
    query = query.eq('student_id', userId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching requests:', error);
    return [];
  }
  return data || [];
};

export const createRequest = async (request: Partial<Request>): Promise<Request | null> => {
  const { data, error } = await supabase
    .from('requests')
    .insert(request)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating request:', error);
    throw error;
  }
  return data;
};

export const updateRequest = async (id: string, request: Partial<Request>): Promise<Request | null> => {
  const { data, error } = await supabase
    .from('requests')
    .update(request)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating request:', error);
    throw error;
  }
  return data;
};

// Notifications
export const getNotifications = async (userId: string): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
  return data || [];
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id);
  
  if (error) {
    console.error('Error marking notification as read:', error);
  }
};

// GPA Calculation
export const calculateGPA = async (userId: string): Promise<{ gpa: number; completedCredits: number; totalCredits: number }> => {
  const { data: enrollments, error } = await supabase
    .from('enrollments')
    .select('*, course:courses(*)')
    .eq('user_id', userId)
    .eq('status', 'completed');
  
  if (error || !enrollments) {
    return { gpa: 0, completedCredits: 0, totalCredits: 140 };
  }

  let totalPoints = 0;
  let totalCredits = 0;

  enrollments.forEach((enrollment: Enrollment) => {
    if (enrollment.grade && enrollment.course) {
      const gradePoints = getGradePoints(enrollment.grade);
      const credits = enrollment.course.credit_hours;
      totalPoints += gradePoints * credits;
      totalCredits += credits;
    }
  });

  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
  
  return {
    gpa,
    completedCredits: totalCredits,
    totalCredits: 140,
  };
};

const getGradePoints = (grade: string): number => {
  const gradeMap: { [key: string]: number } = {
    'A+': 5.0,
    'A': 4.75,
    'B+': 4.5,
    'B': 4.0,
    'C+': 3.5,
    'C': 3.0,
    'D+': 2.5,
    'D': 2.0,
    'F': 0,
  };
  return gradeMap[grade] || 0;
};

export default supabase;
