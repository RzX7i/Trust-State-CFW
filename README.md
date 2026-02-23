#Trust State - موقع اختبارات الإداريين

موقع اختبارات للإداريين في سيرفر FiveMTrust State مع نظام CFW

## المميزات

- ✅ نظام اختبارات متكامل (20 سؤال)
- ✅ تصحيح تلقائي للإجابات
- ✅ ربط مع Discord لإعطاء الرتب تلقائياً
- ✅ تصميم عصري وجذاب مع اللوقو
- ✅ دعم كامل للغة العربية

## كيفية الاستخدام

### 1. رفع المشروع على Replit

1. اذهب إلى [Replit](https://replit.com)
2. أنشئ حساب جديد أو سجل دخول
3. اضغط على "Create" ← "Import from GitHub"
4. ارفع الملفات مباشرة أو استخدم Git

### 2. إعداد Discord Bot

1. اذهب إلى [Discord Developer Portal](https://discord.com/developers/applications)
2. أنشئ تطبيق جديد
3. اذهب إلى "Bot" ← "Add Bot"
4. انسخ التوكن وضعه في ملف `.env`
5. فعل هذه الصلاحيات:
   - Send Messages
   - Manage Roles
   - Read Message History

### 3. إعداد متغيرات البيئة

أنشئ ملف `.env` وأضف:

```env
DISCORD_BOT_TOKEN=your_bot_token
DISCORD_GUILD_ID=your_server_id
ADMIN_ROLE_ID=role_id_to_give
```

### 4. تشغيل الموقع

```bash
npm install
npm run build
npm start
```

## الأسئلة

الاختبار يحتوي على 20 سؤال في 5 أقسام:
1. قوانين السيرفر (5 أسئلة)
2. نظام CFW (5 أسئلة)
3. Roleplay (5 أسئلة)
4. واجبات الإداري (5 أسئلة)

نسبة النجاح: 75%

## التقنيات المستخدمة

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Lucide Icons

## الدعم

للدعم والاستفسارات، تواصل معنا على Discord.

---

© 2025Trust State. جميع الحقوق محفوظة.
