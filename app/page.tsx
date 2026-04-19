"use client";
import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [user, setUser] = useState<string>(""); 
  const [nameInput, setNameInput] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [error, setError] = useState("");
  const [selectedStage, setSelectedStage] = useState<"primary" | "prep" | null>(null);

  // الأكواد المسموح بها للدخول
  const VALID_CODES = ["123456", "MG2026", "WINNER", "PRO100"];

  const stagesData = {
    primary: [
      { id: 1, name: "الصف الأول الابتدائي", icon: "🌱" },
      { id: 2, name: "الصف الثاني الابتدائي", icon: "🎨" },
      { id: 3, name: "الصف الثالث الابتدائي", icon: "🚀" },
      { id: 4, name: "الصف الرابع الابتدائي", icon: "🔍" },
      { id: 5, name: "الصف الخامس الابتدائي", icon: "🧪" },
      { id: 6, name: "الصف السادس الابتدائي", icon: "🏆" },
    ],
    prep: [
      { id: 7, name: "الصف الأول الإعدادي", icon: "📚" },
      { id: 8, name: "الصف الثاني الإعدادي", icon: "💡" },
      { id: 9, name: "الصف الثالث الإعدادي", icon: "🎯" },
    ]
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.length < 3) {
      setError("يرجى كتابة اسمك بشكل صحيح");
      return;
    }
    if (!VALID_CODES.includes(codeInput.toUpperCase())) {
      setError("كود الاشتراك غير صحيح");
      return;
    }
    setUser(nameInput);
    setError("");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4" dir="rtl">
        {/* عنوان الأكاديمية والترحيب قبل الفورم */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-blue-600 mb-2">Ghanem Academy</h1>
          <p className="text-gray-500 font-medium tracking-wide">Welcome to Ghanem Academy</p>
        </div>

        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border-t-8 border-blue-600">
          <h2 className="text-2xl font-bold text-center mb-6 text-black">تسجيل دخول الطلاب</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2 mr-1">اسم الطالب</label>
              <input 
                type="text" 
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="اسمك بالكامل"
                className="w-full p-4 rounded-xl border border-gray-200 text-black outline-none focus:border-blue-500 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2 mr-1">كود الاشتراك</label>
              <input 
                type="text" 
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="أدخل الكود الخاص بك"
                className="w-full p-4 rounded-xl border border-gray-200 text-center font-bold text-blue-600 outline-none focus:border-blue-500 transition-all"
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center font-bold bg-red-50 py-2 rounded-lg">{error}</p>}
            
            <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition transform active:scale-95 shadow-lg shadow-blue-100">
              دخول للمنصة
            </button>
          </form>
        </div>
      </div>
    );
  }

  // الجزء الخاص باختيار المراحل (بيظهر بعد الدخول)
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-center" dir="rtl">
      <h1 className="text-3xl font-bold mb-2 text-black">أهلاً بك يا {user} 👋</h1>
      <p className="text-gray-500 mb-12">يرجى اختيار المرحلة الدراسية للبدء</p>

      {!selectedStage ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button onClick={() => setSelectedStage('primary')} className="p-10 bg-yellow-400 rounded-3xl shadow-lg hover:scale-105 transition-all text-right">
            <div className="text-6xl mb-4">🎒</div>
            <h2 className="text-2xl font-bold text-yellow-900">المرحلة الابتدائية</h2>
            <p className="text-yellow-800 opacity-80 text-sm mt-2">من الصف الأول حتى السادس</p>
          </button>
          
          <button onClick={() => setSelectedStage('prep')} className="p-10 bg-blue-600 rounded-3xl shadow-lg hover:scale-105 transition-all text-right">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-white">المرحلة الإعدادية</h2>
            <p className="text-blue-100 opacity-80 text-sm mt-2">من الصف الأول حتى الثالث</p>
          </button>
        </div>
      ) : (
        <div>
          <button onClick={() => setSelectedStage(null)} className="mb-8 flex items-center gap-2 text-blue-600 font-bold hover:underline mx-auto">
            <span>⬅️</span> عودة لاختيار المرحلة
          </button>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-right">
            {stagesData[selectedStage].map((grade) => (
              <Link key={grade.id} href={`/lessons?grade=${grade.name}`} className="p-6 bg-white rounded-2xl shadow border-2 border-transparent hover:border-blue-500 flex items-center gap-4 text-black transition-all group">
                <span className="text-3xl p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">{grade.icon}</span>
                <span className="font-bold text-lg">{grade.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}