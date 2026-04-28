"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- التعديل الأمني لضمان عدم تداخل البيانات ---
  useEffect(() => {
    // بمجرد فتح صفحة الدخول، يتم مسح أي جلسة قديمة فوراً
    localStorage.clear();
  }, []);
  // ---------------------------------------------

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // رابط الـ Google Script الخاص بك لجلب بيانات الطلاب
      const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyCKjdNlxqbK8GKv3kHIH_CHFVG7xqDbycz4uEWq8Ar/exec";
      
      const response = await fetch(`${SCRIPT_URL}?email=${encodeURIComponent(email.trim())}`);
      const data = await response.json();

      if (data.status === "success") {
        // حفظ بيانات الطالب الجديد في الذاكرة
        localStorage.setItem("ghanem_session", JSON.stringify(data.user));
        
        // التوجه للوحة التحكم
        router.push("/dashboard");
      } else {
        setError("عذراً، هذا البريد غير مسجل لدينا أو تأكد من الكتابة بشكل صحيح.");
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">مرحباً بك في منصة مستر غانم</h2>
          <p className="mt-2 text-sm text-gray-600">سجل دخولك لمتابعة دروسك ونقاطك</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              البريد الإلكتروني أو الاسم المسجل
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="ادخل بريدك هنا..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "جاري التحقق..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}