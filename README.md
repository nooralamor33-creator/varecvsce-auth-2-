# Varecvsce Auth System

نظام تسجيل دخول وإنشاء حسابات — React + Vite + TypeScript + Tailwind CSS

## التثبيت والتشغيل

```bash
npm install
npm run dev
```

## البناء للإنتاج

```bash
npm run build
```

الناتج سيكون في مجلد `dist/` — ارفعه على Render كـ Static Site.

## النشر على Render

1. ارفع المشروع على GitHub
2. اذهب إلى [render.com](https://render.com) وأنشئ **Static Site** جديد
3. اربطه بـ repository
4. اضبط الإعدادات:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
5. انقر Deploy

## الحسابات التجريبية

| البريد الإلكتروني | كلمة المرور | الدور |
|---|---|---|
| admin@varecvsce.com | admin123 | مدير |
| user@varecvsce.com | user123 | مستخدم |

## الميزات

- تسجيل دخول بالبريد الإلكتروني وكلمة المرور
- إنشاء حسابات جديدة مع التحقق من البيانات
- مؤشر قوة كلمة المرور
- حفظ الجلسة في LocalStorage (تبقى بعد إغلاق المتصفح)
- لوحة تحكم للمستخدم مع إمكانية تعديل الملف الشخصي
- تصميم RTL عربي كامل
- جاهز للنشر على Render بدون أي إعدادات إضافية
