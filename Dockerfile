# استخدم صورة node الرسمية
FROM node:18

# تعيين مجلد العمل داخل الحاوية
WORKDIR /app

# نسخ الملفات المهمة أولاً لتثبيت التبعيات
COPY package*.json ./

# تثبيت التبعيات
RUN npm install

# نسخ باقي الملفات
COPY . .

# كشف المنفذ (Railway أو أي مزود يستمع عليه)
EXPOSE 3000

# أمر التشغيل
CMD ["npm", "start"]
