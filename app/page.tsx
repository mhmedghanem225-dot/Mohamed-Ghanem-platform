"use client";
import { useState } from "react";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("الصف الخامس الابتدائي");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // الكود هيدخل الطالب للمرحلة اللي اختارها من القائمة
    if (code === "123456") {
      window.location.assign("/lessons?grade=" + encodeURIComponent(selectedGrade));
    } else {
      alert("عذراً، كود الاشتراك غير صحيح");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
        
        {/* جملة الترحيب اللي طلبتها */}
        <h1 className="text-3xl font-black text-blue-600 mb-2">Ghanem Academy</h1>
        <p className="text-gray-500 mb-8 font-medium">Welcome to Ghanem Academy</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="text-right">
            <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">اسم الطالب</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 text-right"
              placeholder="اكتب اسمك هنا"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="text-right">
            <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">كود الاشتراك</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 text-center"
              placeholder="••••••"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div className="text-right">
            <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">اختر المرحلة الدراسية</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-white text-right"
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-4"
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