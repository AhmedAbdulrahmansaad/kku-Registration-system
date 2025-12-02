import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const signUp = async (email: string, password: string, userData: {
  full_name: string;
  role: 'student' | 'advisor' | 'admin';
  student_id?: string;
  major?: string;
  level?: number;
}) => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) throw authError

  if (authData.user) {
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        full_name: userData.full_name,
        role: userData.role,
        student_id: userData.student_id || null,
        major: userData.major || null,
        level: userData.level || null,
      })

    if (profileError) throw profileError
  }

  return authData
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return profile
}

// Course helpers
export const getCourses = async (level?: number) => {
  let query = supabase.from('courses').select('*')
  
  if (level) {
    query = query.lte('level', level)
  }
  
  const { data, error } = await query.order('level').order('course_code')
  if (error) throw error
  return data
}

export const getCourseById = async (id: string) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

// Enrollment helpers
export const getEnrollments = async (studentId: string, status?: string) => {
  let query = supabase
    .from('enrollments')
    .select(`
      *,
      course:courses(*)
    `)
    .eq('student_id', studentId)
  
  if (status) {
    query = query.eq('status', status)
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const createEnrollment = async (enrollment: {
  student_id: string;
  course_id: string;
  semester: string;
  year: number;
}) => {
  const { data, error } = await supabase
    .from('enrollments')
    .insert({
      ...enrollment,
      status: 'pending',
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Request helpers
export const getRequests = async (advisorId?: string, studentId?: string) => {
  let query = supabase
    .from('requests')
    .select(`
      *,
      course:courses(*),
      student:users!requests_student_id_fkey(*)
    `)
  
  if (advisorId) {
    query = query.eq('advisor_id', advisorId)
  }
  
  if (studentId) {
    query = query.eq('student_id', studentId)
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const createRequest = async (request: {
  student_id: string;
  course_id: string;
  advisor_id: string;
  request_type: 'enroll' | 'drop' | 'withdraw';
  notes?: string;
}) => {
  const { data, error } = await supabase
    .from('requests')
    .insert({
      ...request,
      status: 'pending',
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateRequestStatus = async (
  requestId: string,
  status: 'approved' | 'rejected',
  advisorNotes?: string
) => {
  const { data, error } = await supabase
    .from('requests')
    .update({
      status,
      advisor_notes: advisorNotes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', requestId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Notification helpers
export const getNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const markNotificationAsRead = async (notificationId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
  
  if (error) throw error
}

export const createNotification = async (notification: {
  user_id: string;
  title_ar: string;
  title_en: string;
  message_ar: string;
  message_en: string;
  type: 'info' | 'success' | 'warning' | 'error';
}) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      ...notification,
      is_read: false,
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Student helpers for advisors
export const getStudentsByAdvisor = async (advisorId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('advisor_id', advisorId)
    .eq('role', 'student')
    .order('full_name')
  
  if (error) throw error
  return data
}

// Admin helpers
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const updateCourse = async (courseId: string, updates: Partial<{
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  credit_hours: number;
  instructor_name: string;
  room_number: string;
  max_students: number;
  schedule: object;
}>) => {
  const { data, error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', courseId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const deleteCourse = async (courseId: string) => {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', courseId)
  
  if (error) throw error
}

// GPA Calculation
export const calculateGPA = async (studentId: string) => {
  const { data: enrollments, error } = await supabase
    .from('enrollments')
    .select(`
      grade,
      gpa_points,
      course:courses(credit_hours)
    `)
    .eq('student_id', studentId)
    .eq('status', 'completed')
    .not('grade', 'is', null)

  if (error) throw error

  if (!enrollments || enrollments.length === 0) {
    return { gpa: 0, totalCredits: 0, completedCredits: 0 }
  }

  let totalPoints = 0
  let totalCredits = 0

  enrollments.forEach((enrollment: { gpa_points: number | null; course: { credit_hours: number } | null }) => {
    if (enrollment.gpa_points !== null && enrollment.course) {
      const credits = enrollment.course.credit_hours
      totalPoints += enrollment.gpa_points * credits
      totalCredits += credits
    }
  })

  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0

  return {
    gpa: Math.round(gpa * 100) / 100,
    totalCredits,
    completedCredits: totalCredits,
  }
}

