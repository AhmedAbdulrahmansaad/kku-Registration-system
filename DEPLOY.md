# 🚀 دليل النشر على Vercel | Vercel Deployment Guide

## ✅ تم إكمال جميع المهام!

- ✅ إصلاح المصادقة
- ✅ إصلاح صفحة المقررات
- ✅ إصلاح لوحة تحكم الطالب
- ✅ إصلاح لوحة تحكم المرشد
- ✅ إصلاح لوحة تحكم المدير
- ✅ اختبار جميع الصفحات

---

## 📋 خطوات النشر على Vercel

### 1. رفع المشروع على GitHub

```bash
cd kku-course-registration

# تهيئة Git (إذا لم يكن موجود)
git init

# إضافة جميع الملفات
git add .

# عمل commit
git commit -m "Complete course registration system"

# إضافة remote repository
git remote add origin https://github.com/YOUR_USERNAME/kku-registration.git

# رفع المشروع
git push -u origin main
```

### 2. النشر على Vercel

#### الطريقة الأولى: من خلال الموقع

1. اذهب إلى [Vercel](https://vercel.com)
2. سجل الدخول بحساب GitHub
3. اضغط **Add New Project**
4. اختر المستودع `kku-registration`
5. اضغط **Import**

#### الطريقة الثانية: من خلال Vercel CLI

```bash
# تثبيت Vercel CLI
npm i -g vercel

# النشر
vercel

# اتبع التعليمات:
# - Set up and deploy? Y
# - Which scope? اختر حسابك
# - Link to existing project? N
# - Project name? kku-registration
# - Directory? ./
# - Override settings? N
```

### 3. إضافة Environment Variables

في Vercel Dashboard:

1. اذهب إلى **Project Settings** → **Environment Variables**
2. أضف المتغيرات التالية:

```
VITE_SUPABASE_URL=https://obffsqorwfudbnpxbecv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iZmZzcW9yd2Z1ZGJucHhiZWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NDU0MTYsImV4cCI6MjA4MDIyMTQxNn0.7vMQ2tiK0hZEejHCV4HOcWGfgTQIa_gqxwSXO_2UgWk
```

3. اضغط **Save**
4. اذهب إلى **Deployments** → **Redeploy** (لإعادة النشر مع المتغيرات الجديدة)

---

## 🔧 إعدادات Build

Vercel سيكتشف تلقائياً:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

---

## ✅ التحقق من النشر

بعد النشر:

1. اذهب إلى رابط المشروع (مثل: `https://kku-registration.vercel.app`)
2. تأكد من:
   - ✅ الصفحة الرئيسية تظهر
   - ✅ يمكن إنشاء حساب جديد
   - ✅ يمكن تسجيل الدخول
   - ✅ المقررات تظهر
   - ✅ جميع الصفحات تعمل

---

## 🐛 استكشاف الأخطاء

### المشكلة: المتغيرات البيئية لا تعمل

**الحل:**
1. تأكد من إضافة المتغيرات في Vercel
2. أعد نشر المشروع بعد إضافة المتغيرات
3. تحقق من Console في المتصفح

### المشكلة: الصفحات تظهر فارغة

**الحل:**
1. تحقق من Console للأخطاء
2. تأكد من أن Supabase متصل
3. تحقق من RLS Policies في Supabase

### المشكلة: لا يمكن تسجيل الدخول

**الحل:**
1. تأكد من أن جدول `users` موجود
2. تحقق من أن `schema.sql` تم تشغيله
3. راجع Supabase Logs

---

## 📝 ملاحظات مهمة

1. **تأكد من تشغيل `schema.sql`** في Supabase قبل النشر
2. **أضف Environment Variables** في Vercel
3. **اختبر المشروع محلياً** قبل النشر
4. **راجع Console** للأخطاء بعد النشر

---

## 🎉 تم النشر بنجاح!

المشروع الآن متاح على الإنترنت! 🌐

**تم التطوير بواسطة فريق MIS - جامعة الملك خالد 2025**

