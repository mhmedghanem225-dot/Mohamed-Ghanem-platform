"use client";

import React, { useEffect, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // تنظيف شامل بمجرد تحميل الصفحة
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
      // مسح الكوكيز لضمان عدم استرجاع أي جلسة قديمة
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyCKjdNlxqbK8GKv3kHIH_CHFVG7xqDbycz4uEWq8Ar/exec";
      const response = await fetch(`${SCRIPT_URL}?email=${encodeURIComponent(email.trim())}`);
      const data = await response.json();

      if (data.status === "success") {
        // مسح أخير قبل تخزين البيانات الجديدة
        localStorage.clear();
        localStorage.setItem("ghanem_session", JSON.stringify(data.user));
        
        // السر هنا: استخدام window.location.replace بدلاً من router.push
        // ده بيخلي المتصفح يرمي الصفحة القديمة ببياناتها ويفتح صفحة جديدة تماماً ببيانات الطالب الجديد
        window.location.replace("/dashboard");
      } else {
        setError("عذراً، هذا البريد غير مسجل أو البيانات غير صحيحة.");
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">منصة مستر محمد غانم</h2>
          <p className="mt-2 text-sm text-gray-600">سجل دخولك الآن للبدء</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني أو الاسم
            </label>
            <input
              type="text"
              required
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="ادخل بياناتك هنا..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded-lg text-center">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            {loading ? "جاري التحقق..." : "دخول الآن"}
          </button>
        </form>
      </div>
    </div>
  );
}