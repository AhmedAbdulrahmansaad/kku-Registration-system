# دليل الإعداد الكامل | Complete Setup Guide

## 📋 المتطلبات | Requirements

- Node.js 18+ 
- npm أو yarn
- حساب Supabase
- حساب Vercel (للنشر)

---

## 🚀 خطوات الإعداد | Setup Steps

### 1️⃣ تثبيت المكتبات | Install Dependencies

```bash
cd kku-course-registration
npm install
```

### 2️⃣ إعداد ملف البيئة | Environment Setup

أنشئ ملف `.env` في المجلد الرئيسي:

```env
VITE_SUPABASE_URL=https://obffsqorwfudbnpxbecv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iZmZzcW9yd2Z1ZGJucHhiZWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NDU0MTYsImV4cCI6MjA4MDIyMTQxNn0.7vMQ2tiK0hZEejHCV4HOcWGfgTQIa_gqxwSXO_2UgWk
```

### 3️⃣ إعداد قاعدة البيانات | Database Setup

#### في Supabase Dashboard:

1. **اذهب إلى** [Supabase Dashboard](https://supabase.com/dashboard)
2. **اختر مشروعك**
3. **SQL Editor** → **New Query**
4. **انسخ محتوى** `supabase/schema.sql`
5. **الصق والضغط** **Run**

✅ هذا سيُنشئ:
- جدول `users`
- جدول `courses` (49 مقرر)
- جدول `enrollments`
- جدول `requests`
- جدول `notifications`
- جدول `system_settings`
- سياسات الأمان (RLS)

### 4️⃣ إعداد المصادقة | Authentication Setup

في Supabase Dashboard:

1. **Authentication** → **Providers** → **Email**
2. **أوقف** "Confirm email" (للتجربة السريعة)
   - أو اتركه مفعّل وأضف رابط Vercel في **URL Configuration**

### 5️⃣ تشغيل المشروع محلياً | Run Locally

```bash
npm run dev
```

افتح: `http://localhost:5173`

---

## 🌐 النشر على Vercel | Deploy to Vercel

### 1. رفع المشروع على GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/kku-registration.git
git push -u origin main
```

### 2. ربط Vercel

1. اذهب إلى [Vercel](https://vercel.com)
2. **New Project** → اختر المستودع
3. **Environment Variables** → أضف:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. **Deploy**

---

## 🧪 اختبار النظام | Testing

### إنشاء حساب تجريبي:

1. اذهب إلى `/signup`
2. اختر الدور (طالب/مرشد/مدير)
3. املأ البيانات
4. بعد التسجيل سيتم توجيهك تلقائياً للوحة التحكم

### الحسابات الموجودة:

إذا كان لديك حسابات في قاعدة البيانات، يمكنك تسجيل الدخول مباشرة.

---

## 🔧 استكشاف الأخطاء | Troubleshooting

### المشكلة: لا يتم تسجيل الدخول بعد إنشاء الحساب

**الحل:**
1. تأكد من أن جدول `users` موجود
2. تحقق من أن RLS policies مفعّلة
3. افتح Console في المتصفح وراجع الأخطاء

### المشكلة: الصفحات لا تظهر

**الحل:**
1. تأكد من أن `App.tsx` يحتوي على جميع Routes
2. تحقق من أن `DashboardLayout` يعمل بشكل صحيح
3. تأكد من أن `ProtectedRoute` يتحقق من الدور

### المشكلة: قاعدة البيانات فارغة

**الحل:**
1. شغّل `schema.sql` مرة أخرى
2. تحقق من أن 49 مقرر موجودة في جدول `courses`

---

## 📁 هيكل المشروع | Project Structure

```
kku-course-registration/
├── src/
│   ├── components/      # المكونات المشتركة
│   ├── contexts/         # Context Providers
│   ├── pages/           # الصفحات
│   ├── lib/             # مكتبات (Supabase)
│   ├── types/           # TypeScript Types
│   └── i18n/            # الترجمات
├── supabase/
│   └── schema.sql       # قاعدة البيانات
└── public/              # الملفات العامة
```

---

## ✅ قائمة التحقق | Checklist

- [ ] تم تثبيت المكتبات (`npm install`)
- [ ] تم إنشاء ملف `.env`
- [ ] تم تشغيل `schema.sql` في Supabase
- [ ] تم تعطيل تأكيد البريد (اختياري)
- [ ] المشروع يعمل محلياً (`npm run dev`)
- [ ] يمكن إنشاء حساب جديد
- [ ] يمكن تسجيل الدخول
- [ ] يتم التوجيه للوحة التحكم الصحيحة
- [ ] جميع الصفحات تعمل

---

## 🆘 الدعم | Support

إذا واجهت أي مشكلة:
1. راجع Console في المتصفح
2. راجع Network tab
3. تحقق من Supabase Logs
4. راجع هذا الدليل مرة أخرى

---

**تم التطوير بواسطة فريق MIS - جامعة الملك خالد 2025**

