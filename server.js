const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // تحميل متغيرات البيئة من ملف .env

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // لعرض ملفات HTML و CSS و JS

// إعداد الاتصال بقاعدة البيانات باستخدام .env
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// التحقق من الاتصال بقاعدة البيانات
db.connect(err => {
    if (err) {
        console.error("❌ فشل الاتصال بقاعدة البيانات:", err);
        return;
    }
    console.log("✅ متصل بقاعدة البيانات بنجاح");
});

// 🔹 إرسال صفحة تسجيل الدخول
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔹 إرسال صفحة إنشاء الحساب
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "register.html"));
});

// 🔹 إنشاء مستخدم جديد
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "❌ يجب ملء جميع الحقول" });
    }

    db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
        if (err) return res.status(500).json({ message: "❌ خطأ في السيرفر" });

        if (results.length > 0) {
            return res.json({ message: "❌ اسم المستخدم مأخوذ بالفعل" });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ message: "❌ خطأ في التشفير" });

            db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
                if (err) return res.status(500).json({ message: "❌ خطأ في إنشاء المستخدم" });

                res.json({ message: "✅ تم إنشاء الحساب بنجاح!", redirect: "/" });
            });
        });
    });
});

// 🔹 تسجيل الدخول
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "❌ يجب ملء جميع الحقول" });
    }

    db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
        if (err) return res.status(500).json({ message: "❌ خطأ في السيرفر" });

        if (results.length > 0) {
            const user = results[0];

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) return res.status(500).json({ message: "❌ خطأ أثناء التحقق من كلمة المرور" });

                if (isMatch) {
                    res.json({ message: "✅ تسجيل دخول ناجح!", redirect: "/success.html" });
                } else {
                    res.json({ message: "❌ كلمة المرور غير صحيحة" });
                }
            });
        } else {
            res.json({ message: "❌ المستخدم غير موجود" });
        }
    });
});

// تشغيل الخادم
app.listen(3000, () => {
    console.log("🚀 الخادم يعمل على http://localhost:3000");
});
