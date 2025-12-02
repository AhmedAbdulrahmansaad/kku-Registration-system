// Supabase Edge Function for AI Chat
// Deploy: supabase functions deploy chat

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, language, context } = await req.json()
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    
    if (!OPENAI_API_KEY) {
      // Return fallback response if no API key
      return new Response(
        JSON.stringify({ 
          reply: getLocalResponse(message, language) 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const systemPrompt = language === 'ar' 
      ? `أنت مساعد ذكي لنظام تسجيل المقررات في جامعة الملك خالد. ساعد الطلاب في:
        - تسجيل المقررات والمتطلبات السابقة
        - حساب المعدل التراكمي
        - شرح نظام التسجيل
        - معلومات عن المقررات
        أجب بإيجاز ووضوح باللغة العربية.
        المستخدم الحالي: ${context?.userName || 'طالب'}
        الدور: ${context?.userRole || 'student'}`
      : `You are an AI assistant for the course registration system at King Khalid University. Help students with:
        - Course registration and prerequisites
        - GPA calculation
        - Registration system explanation
        - Course information
        Answer briefly and clearly in English.
        Current user: ${context?.userName || 'Student'}
        Role: ${context?.userRole || 'student'}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || getLocalResponse(message, language)

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function getLocalResponse(query: string, language: string): string {
  const lowerQuery = query.toLowerCase()
  
  if (language === 'ar') {
    if (lowerQuery.includes('تسجيل') || lowerQuery.includes('مقرر')) {
      return 'لتسجيل المقررات، اذهب إلى صفحة "المقررات المتاحة" واختر المقررات التي تريد تسجيلها. تأكد من استيفاء المتطلبات السابقة.'
    }
    if (lowerQuery.includes('معدل') || lowerQuery.includes('gpa')) {
      return 'يتم حساب المعدل التراكمي بضرب نقاط كل مقرر في عدد ساعاته، ثم قسمة المجموع على إجمالي الساعات. نظام الدرجات: A+ = 5.0, A = 4.75...'
    }
    return 'أنا المساعد الذكي لنظام تسجيل المقررات. كيف يمكنني مساعدتك؟'
  }
  
  if (lowerQuery.includes('register') || lowerQuery.includes('course')) {
    return 'To register for courses, go to the "Available Courses" page and select the courses you want. Make sure you meet the prerequisites.'
  }
  if (lowerQuery.includes('gpa') || lowerQuery.includes('grade')) {
    return 'GPA is calculated by multiplying each course\'s grade points by its credit hours, then dividing by total credits. Grading: A+ = 5.0, A = 4.75...'
  }
  
  return 'I\'m the smart assistant for the course registration system. How can I help you?'
}

