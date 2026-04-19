"use client";
import { useState } from "react";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // التأكد من الكود ونقله لصفحة الدروس مباشرة
    if (code === "123456") {
      window.location.assign("/lessons");
    } else {
      alert("عذراً، كود الاشتراك غير صحيح");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
        
        <h1 className="text-3xl font-black text-blue-600 mb-2">Ghanem Academy</h1>
        <p className="text-gray-500 mb-8 font-medium">Welcome to Ghanem Academy</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 text-right"
            placeholder="اسم الطالب"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="password"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 text-center"
            placeholder="كود الاشتراك"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md"
          >
            دخول للمنصة
          </button>
        </form>
        
        <p className="text-gray-400 text-xs mt-8">
          جميع الحقوق محفوظة © مستر محمد غانم 2026
        </p>
      </div>
    </div>
  );
}