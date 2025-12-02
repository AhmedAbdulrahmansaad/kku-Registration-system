# 🔧 إعداد Supabase - حل مشكلة "Email not confirmed"

## المشكلة

عند تسجيل الدخول، يظهر خطأ: **"Email not confirmed"**

## الحل

### الطريقة 1: تعطيل تأكيد البريد (للتطوير)

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك
3. **Authentication** → **Providers** → **Email**
4. **أوقف** "Confirm email" (Toggle OFF)
5. **Save**

### الطريقة 2: السماح بتسجيل الدخول بدون تأكيد (مطبّق في الكود)

تم إصلاح الكود للسماح بتسجيل الدخول حتى لو لم يؤكد البريد.

---

## 🔧 إصلاح أخطاء الاتصال

### 1. تحقق من RLS Policies

في Supabase Dashboard:

1. **Authentication** → **Policies**
2. تأكد من أن Policies موجودة لجدول `users`:
   ```sql
   -- Allow users to read their own data
   CREATE POLICY "Users can read own data" ON users
     FOR SELECT USING (auth.uid() = id);
   
   -- Allow users to update their own data
   CREATE POLICY "Users can update own data" ON users
     FOR UPDATE USING (auth.uid() = id);
   ```

### 2. تحقق من Environment Variables

في ملف `.env`:
```env
VITE_SUPABASE_URL=https://obffsqorwfudbnpxbecv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. تحقق من قاعدة البيانات

1. **SQL Editor** → **New Query**
2. شغّل `supabase/schema.sql`
3. تأكد من وجود الجداول:
   - `users`
   - `courses` (49 مقرر)
   - `enrollments`
   - `requests`
   - `notifications`
   - `system_settings`
   - `majors`

---

## ✅ التحقق من الإصلاحات

بعد الإصلاحات:

1. **أعد تحميل الصفحة** (Ctrl+F5)
2. **جرب تسجيل الدخول مرة أخرى**
3. **تحقق من Console** - يجب ألا تظهر أخطاء

---

## 🐛 إذا استمرت المشكلة

1. **افتح Console** (F12)
2. **تحقق من الأخطاء**
3. **تحقق من Network tab** - هل الطلبات تصل لـ Supabase؟
4. **راجع Supabase Logs** في Dashboard

---

**تم إصلاح المشاكل في الكود!** ✅

