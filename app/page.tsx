"use client";
import { useState } from "react";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("الصف الخامس الابتدائي");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === "123456") {
      window.location.href = "/lessons?grade=" + encodeURIComponent(selectedGrade);
    } else {
      alert("عذراً، كود الاشتراك غير صحيح");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4 font-sans" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-blue-100">
        
        {/* الجزء الترحيبي الجديد */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-blue-600 mb-2 tracking-tight">
            Ghanem Academy
          </h1>
          <p className="text-gray-500 font-medium">Welcome to Ghanem Academy</p>
          <div className="h-1 w-20 bg-blue-600 mx-auto mt-4 rounded-full"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">اسم الطالب</label>
            <input
              type="text"
              required
              className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-right"
              placeholder="اكتب اسمك هنا"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">كود الاشتراك</label>
            <input
              type="password"
              required
              className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-center"
              placeholder="••••••"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">اختر المرحلة الدراسية</label>
            <select
              className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-right"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
            >
              <option>الصف الثاني الابتدائي</option>
              <option>الصف الثالث الابتدائي</option>
              <option>الصف الرابع الابتدائي</option>
              <option>الصف الخامس الابتدائي</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition hover:-translate-y-1 active:scale-95"
          >
            دخول للمنصة
          </button>
        </form>
        
        <p className="text-center text-gray-400 text-xs mt-8">
          جميع الحقوق محفوظة © مستر محمد غانم 2026
        </p>
      </div>
    </div>
  );
}