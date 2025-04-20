async function register() {
    const username = document.getElementById("new-username").value;
    const password = document.getElementById("new-password").value;
    const messageElement = document.getElementById("register-message");

    if (!username || !password) {
        messageElement.textContent = "❌ يجب ملء جميع الحقول";
        messageElement.style.color = "red";
        return;
    }

    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        messageElement.textContent = data.message;

        if (data.message.includes("✅")) {
            messageElement.style.color = "green";

            // تشغيل المفرقعات عند نجاح التسجيل 🎉
            setTimeout(() => {
                confetti({
                    particleCount: 200,
                    spread: 150,
                    origin: { y: 0.6 }
                });
            }, 500);

            // الانتظار ثم التوجيه إلى صفحة تسجيل الدخول
            setTimeout(() => {
                if (data.redirect) {
                    window.location.href = data.redirect;
                }
            }, 2500);
        } else {
            messageElement.style.color = "red";
        }
    } catch (error) {
        console.error("❌ خطأ في إنشاء الحساب:", error);
        messageElement.textContent = "❌ حدث خطأ، حاول مرة أخرى";
        messageElement.style.color = "red";
    }
}

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const messageElement = document.getElementById("message");

    if (!username || !password) {
        messageElement.textContent = "❌ يجب ملء جميع الحقول";
        messageElement.style.color = "red";
        return;
    }

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        messageElement.textContent = data.message;

        if (data.message.includes("✅")) {
            messageElement.style.color = "green";

            // تشغيل المفرقعات عند تسجيل الدخول الناجح 🎉
            setTimeout(() => {
                confetti({
                    particleCount: 200,
                    spread: 150,
                    origin: { y: 0.6 }
                });
            }, 500);

            // الانتظار ثم التوجيه إلى الصفحة المطلوبة
            setTimeout(() => {
                if (data.redirect) {
                    window.location.href = data.redirect;
                }
            }, 2500);
        } else {
            messageElement.style.color = "red";
        }
    } catch (error) {
        console.error("❌ خطأ في تسجيل الدخول:", error);
        messageElement.textContent = "❌ حدث خطأ، حاول مرة أخرى";
        messageElement.style.color = "red";
    }
}
