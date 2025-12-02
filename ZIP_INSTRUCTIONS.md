# 📦 تعليمات ضغط المشروع | Project Zipping Instructions

## 🎯 الطريقة السريعة (Windows)

### الخطوة 1: افتح مجلد المشروع

```
C:\Users\SurfaceBook\Downloads\مجلد جديد (3)\kku-course-registration
```

### الخطوة 2: حدد جميع الملفات

1. اضغط `Ctrl + A` لتحديد جميع الملفات
2. اضغط `Ctrl` و **ألغِ تحديد** مجلد `node_modules` (لا تضغطه!)

### الخطوة 3: اضغط الملفات

1. **كليك يمين** على الملفات المحددة
2. اختر **Send to** → **Compressed (zipped) folder**
3. سيتم إنشاء ملف `kku-course-registration.zip`

### الخطوة 4: غيّر الاسم (اختياري)

غيّر اسم الملف إلى:
```
kku-course-registration-complete.zip
```

---

## 📋 الملفات التي يجب تضمينها

### ✅ يجب تضمينها:

```
✅ src/                    (جميع ملفات الكود)
✅ public/                 (الملفات العامة)
✅ supabase/              (قاعدة البيانات)
✅ *.md                   (جميع ملفات التوثيق)
✅ package.json
✅ package-lock.json
✅ vite.config.ts
✅ tsconfig.json
✅ tailwind.config.js
✅ postcss.config.js
✅ index.html
```

### ❌ لا تضمّن:

```
❌ node_modules/          (كبير جداً - سيتم تثبيته بـ npm install)
❌ .env                   (معلومات حساسة)
❌ .git/                  (إذا كان موجوداً)
```

---

## 🔧 طريقة بديلة (PowerShell)

افتح PowerShell في مجلد المشروع وشغّل:

```powershell
# انتقل للمجلد
cd "C:\Users\SurfaceBook\Downloads\مجلد جديد (3)\kku-course-registration"

# اضغط الملفات (بدون node_modules)
Get-ChildItem -Exclude "node_modules",".git",".env" | Compress-Archive -DestinationPath "../kku-course-registration-complete.zip" -Force
```

---

## 📊 حجم الملف المتوقع

- **بدون node_modules:** ~2-5 MB ✅
- **مع node_modules:** ~200+ MB ❌ (لا تضغطه!)

---

## ✅ التحقق من الملف المضغوط

بعد الضغط، افتح الملف المضغوط وتأكد من وجود:

- ✅ مجلد `src/` كامل
- ✅ مجلد `supabase/` مع `schema.sql`
- ✅ جميع ملفات `.md`
- ✅ `package.json`
- ✅ جميع ملفات الإعداد

---

## 🚀 استخدام الملف المضغوط

### عند فك الضغط في مكان جديد:

1. **فك الضغط** في مجلد جديد
2. **افتح Terminal** في المجلد
3. **شغّل:**
   ```bash
   npm install
   ```
4. **أنشئ ملف `.env`:**
   ```env
   VITE_SUPABASE_URL=https://obffsqorwfudbnpxbecv.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iZmZzcW9yd2Z1ZGJucHhiZWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NDU0MTYsImV4cCI6MjA4MDIyMTQxNn0.7vMQ2tiK0hZEejHCV4HOcWGfgTQIa_gqxwSXO_2UgWk
   ```
5. **شغّل:**
   ```bash
   npm run dev
   ```

---

## 📝 ملاحظات مهمة

1. **لا تضغط `node_modules`** - كبير جداً وسيتم تثبيته تلقائياً
2. **لا تضغط `.env`** - يحتوي على معلومات حساسة
3. **تأكد من وجود `schema.sql`** في الملف المضغوط
4. **تأكد من وجود جميع ملفات `.md`** (التوثيق)

---

## ✅ الخلاصة

**المشروع موجود في:**
```
C:\Users\SurfaceBook\Downloads\مجلد جديد (3)\kku-course-registration
```

**اضغطه يدوياً أو استخدم PowerShell كما هو موضح أعلاه!** 📦

---

**تم! المشروع جاهز للضغط** ✅

