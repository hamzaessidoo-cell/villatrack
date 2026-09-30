# VillaTrack

لوحة تحكم عربية RTL لإدارة الفيلات والحجوزات اليومية، بتصميم فاخر وخلفية سحابية اختيارية عبر Supabase.

## المزايا

- لوحة مؤشرات للإيرادات، الإشغال، الحجوزات النشطة وعدد الفيلات.
- رسوم Chart.js للإيرادات وتوزيع المدفوعات.
- CRUD للفيلات مع فلترة حسب: متاحة، محجوزة، صيانة.
- إنشاء الحجوزات مع حساب الليالي والإجمالي تلقائياً.
- منع التضارب محلياً في JavaScript، وباستعلام Supabase، وقيد قاعدة بيانات PostgreSQL.
- إصدار فواتير PDF فاخرة عبر jsPDF.
- يعمل فوراً في **Demo Mode** عند غياب مفاتيح Supabase.

## التشغيل محلياً

```bash
cp .env.example .env
npm run build
python3 -m http.server 4173
```

افتح `http://localhost:4173`. لأن التطبيق يستخدم ES Modules، يجب تشغيله عبر HTTP وليس بفتح `index.html` مباشرة.

## إعداد Supabase

1. أنشئ مشروعاً في Supabase.
2. افتح SQL Editor وشغّل كامل ملف `schema.sql`.
3. انسخ Project URL و anon public key إلى متغيرات البيئة:

```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_ANON_KEY="your-anon-public-key"
npm run build
```

> ملف `schema.sql` يفعّل RLS. السياسات الموجودة مناسبة للديمو/البيئة الداخلية؛ قبل الإطلاق التجاري متعدد المستخدمين، اربطها بـ `auth.uid()` وأنشئ جدول ملكية/فريق.

## النشر على Netlify

- اربط مستودع GitHub بالموقع.
- Build command: `npm run build`
- Publish directory: `.`
- أضف `SUPABASE_URL` و `SUPABASE_ANON_KEY` في **Site configuration → Environment variables**.
- ملف `netlify.toml` يضبط الإعدادات وSPA redirect تلقائياً.

لا تضع مفاتيح حقيقية في GitHub. `SUPABASE_ANON_KEY` مفتاح عميل عام مخصص للواجهة، بينما مفاتيح service role لا يجب أن تصل إلى المتصفح مطلقاً.

## هيكل الملفات

- `index.html` — هيكل الصفحات والنماذج.
- `styles.css` — نظام التصميم الداكن المتجاوب.
- `app.js` — حالة التطبيق، الواجهات، الحجوزات والفواتير.
- `supabase.js` — Supabase JS Client وعمليات CRUD.
- `schema.sql` — الجداول وRLS وقاعدة منع تضارب الحجوزات.
- `scripts/inject-env.js` — يولّد `env.js` وقت البناء من متغيرات Netlify.
- `netlify.toml` — إعداد البناء والتوجيه.
