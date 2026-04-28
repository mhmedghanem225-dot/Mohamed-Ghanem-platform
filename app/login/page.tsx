"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. مسح شامل للذاكرة فور فتح الصفحة لضمان عدم وجود بيانات قديمة "عالقة"
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      // مسح الـ Cookies أيضاً لزيادة التأمين
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyCKjdNlxqbK8GKv3kHIH_CHFVG7xqDbycz4uEWq8Ar/exec";
      
      // جلب البيانات من الشيت مباشرة
      const response = await fetch(`${SCRIPT_URL}?email=${encodeURIComponent(email.trim())}`);
      const data = await response.json();

      if (data.status === "success") {
        // 2. التأكيد على مسح الذاكرة مرة أخرى قبل تسجيل بيانات المستخدم الجديد
        localStorage.clear();
        
        // 3. حفظ بيانات المستخدم الجديد (النقاط القادمة من الشيت حالياً)
        localStorage.setItem("ghanem_session", JSON.stringify(data.user));
        
        // 4. التوجه للوحة التحكم مع إجبار الصفحة على التحديث
        window.location.href = "/dashboard";
      } else {
        setError("عذراً، هذا البريد غير مسجل أو البيانات غير صحيحة.");
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال، يرجى التحقق من الإنترنت والمحاولة مرة أخرى.");
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
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="ادخل بياناتك هنا..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded-lg text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
          >
            {loading ? "جاري التحقق من البيانات..." : "دخول الآن"}
          </button>
        </form>
      </div>
    </div>
  );
}