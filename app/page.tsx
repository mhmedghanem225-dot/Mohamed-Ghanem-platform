"use client";
import { useState } from "react";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code === "123456") {
      // هنا بنحدد إنه يدخل "تلقائياً" على منهج الصف الخامس الابتدائي
      const targetGrade = encodeURIComponent("الصف الخامس الابتدائي");
      window.location.assign("/lessons?grade=" + targetGrade);
    } else {
      alert("عذراً، كود الاشتراك غير صحيح");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-blue-50 text-center">
        
        {/* الواجهة الجديدة المحترفة */}
        <h1 className="text-4xl font-black text-blue-600 mb-2 tracking-tighter">Ghanem Academy</h1>
        <p className="text-gray-400 mb-10 font-medium tracking-wide text-sm">Welcome to Ghanem Academy</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="text-right">
            <label className="block text-xs font-bold text-gray-400 mr-2 mb-2">اسم الطالب</label>
            <input
              type="text"
              required
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 text-right transition-all"
              placeholder="اكتب اسمك هنا"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="text-right">
            <label className="block text-xs font-bold text-gray-400 mr-2 mb-2">كود الاشتراك</label>
            <input
              type="password"
              required
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest transition-all"
              placeholder="••••••"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all transform active:scale-95"
          >
            دخول للمنصة
          </button>
        </form>
        
        <div className="mt-10 pt-6 border-t border-gray-50">
          <p className="text-gray-300 text-[10px] uppercase tracking-widest">
            © Mr. Mohamed Ghanem 2026
          </p>
        </div>
      </div>
    </div>
  );
}