import { createClient } from '@supabase/supabase-js';
import { Course, Enrollment, Request, Notification } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Test connection
supabase.from('users').select('count').limit(1).then(({ error }) => {
  if (error) {
    console.error('Supabase connection error:', error);
  } else {
    console.log('✅ Supabase connected successfully');
  }
});

// Courses
export const getCourses = async (): Promise<Course[]> => {
  try {
    console.log('Fetching courses from Supabase...');
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('level', { ascending: true })
      .order('course_code', { ascending: true });
    
    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
    
    console.log(`✅ Fetched ${data?.length || 0} courses`);
    return data || [];
  } catch (error) {
    console.error('Exception fetching courses:', error);
    return [];
  }
};

export const getCourseById = async (id: string): Promise<Course | null> => {
  try {
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
  } catch (error) {
    console.error('Exception fetching course:', error);
    return null;
  }
};

export const createCourse = async (course: Partial<Course>): Promise<Course | null> => {
  try {
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
  } catch (error) {
    console.error('Exception creating course:', error);
    throw error;
  }
};

export const updateCourse = async (id: string, course: Partial<Course>): Promise<Course | null> => {
  try {
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
  } catch (error) {
    console.error('Exception updating course:', error);
    throw error;
  }
};

export const deleteCourse = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
    return true;
  } catch (error) {
    console.error('Exception deleting course:', error);
    throw error;
  }
};

// Enrollments
export const getEnrollments = async (userId: string): Promise<Enrollment[]> => {
  try {
    console.log('Fetching enrollments for user:', userId);
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        course:courses(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching enrollments:', error);
      return [];
    }
    
    console.log(`✅ Fetched ${data?.length || 0} enrollments`);
    return data || [];
  } catch (error) {
    console.error('Exception fetching enrollments:', error);
    return [];
  }
};

export const createEnrollment = async (enrollment: Partial<Enrollment>): Promise<Enrollment | null> => {
  try {
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
  } catch (error) {
    console.error('Exception creating enrollment:', error);
    throw error;
  }
};

// Requests
export const getRequests = async (userId?: string): Promise<Request[]> => {
  try {
    console.log('Fetching requests...', userId ? `for user: ${userId}` : 'all');
    
    let query = supabase
      .from('requests')
      .select(`
        *,
        course:courses(*),
        student:users!requests_student_id_fkey(*)
      `)
      .order('created_at', { ascending: false });
    
    if (userId) {
      query = query.eq('student_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching requests:', error);
      // Try without foreign key if it fails
      const simpleQuery = userId 
        ? supabase.from('requests').select('*').eq('student_id', userId).order('created_at', { ascending: false })
        : supabase.from('requests').select('*').order('created_at', { ascending: false });
      
      const { data: simpleData, error: simpleError } = await simpleQuery;
      
      if (simpleError) {
        console.error('Error fetching requests (simple):', simpleError);
        return [];
      }
      
      // Fetch course and student data separately
      const requestsWithData = await Promise.all(
        (simpleData || []).map(async (req) => {
          const [courseRes, studentRes] = await Promise.all([
            supabase.from('courses').select('*').eq('id', req.course_id).single(),
            supabase.from('users').select('*').eq('id', req.student_id).single(),
          ]);
          
          return {
            ...req,
            course: courseRes.data || null,
            student: studentRes.data || null,
          };
        })
      );
      
      return requestsWithData as Request[];
    }
    
    console.log(`✅ Fetched ${data?.length || 0} requests`);
    return data || [];
  } catch (error) {
    console.error('Exception fetching requests:', error);
    return [];
  }
};

export const createRequest = async (request: Partial<Request>): Promise<Request | null> => {
  try {
    console.log('Creating request:', request);
    const { data, error } = await supabase
      .from('requests')
      .insert(request)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating request:', error);
      throw error;
    }
    
    console.log('✅ Request created:', data);
    return data;
  } catch (error) {
    console.error('Exception creating request:', error);
    throw error;
  }
};

export const updateRequest = async (id: string, request: Partial<Request>): Promise<Request | null> => {
  try {
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
  } catch (error) {
    console.error('Exception updating request:', error);
    throw error;
  }
};

// Notifications
export const getNotifications = async (userId: string): Promise<Notification[]> => {
  try {
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
  } catch (error) {
    console.error('Exception fetching notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
    
    if (error) {
      console.error('Error marking notification as read:', error);
    }
  } catch (error) {
    console.error('Exception marking notification as read:', error);
  }
};

// GPA Calculation
export const calculateGPA = async (userId: string): Promise<{ gpa: number; completedCredits: number; totalCredits: number }> => {
  try {
    const { data: enrollments, error } = await supabase
      .from('enrollments')
      .select('*, course:courses(*)')
      .eq('user_id', userId)
      .eq('status', 'completed');
    
    if (error || !enrollments) {
      console.log('No completed enrollments found, returning default GPA');
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
    
    console.log(`✅ GPA calculated: ${gpa.toFixed(2)}, Credits: ${totalCredits}`);
    
    return {
      gpa,
      completedCredits: totalCredits,
      totalCredits: 140,
    };
  } catch (error) {
    console.error('Exception calculating GPA:', error);
    return { gpa: 0, completedCredits: 0, totalCredits: 140 };
  }
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
