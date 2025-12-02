import { createClient } from '@supabase/supabase-js';

// اجلب المتغيرات من Vite (من Vercel)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// تحقق إذا كانت المتغيرات غير موجودة
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables!");
  console.error("VITE_SUPABASE_URL:", supabaseUrl);
  console.error("VITE_SUPABASE_ANON_KEY:", supabaseAnonKey);
}

// إنشاء العميل
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
