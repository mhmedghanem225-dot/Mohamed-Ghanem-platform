"use client";
import { useState } from "react";

export default function HomePage() {
  const [user, setUser] = useState<string>(""); 
  const [nameInput, setNameInput] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [error, setError] = useState("");
  const [selectedStage, setSelectedStage] = useState<"primary" | "prep" | null>(null);

  const VALID_CODES = ["123456", "MG2026", "WINNER"];

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

  // 1. واجهة تسجيل الدخول (الشكل اللي إنت بتحبه)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4" dir="rtl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-blue-600 mb-2">Ghanem Academy</h1>
          <p className="text-gray-500 font-medium">Welcome to Ghanem Academy</p>
        </div>

        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border-t-8 border-blue-600">
          <h2 className="text-2xl font-bold text-center mb-6 text-black">تسجيل دخول الطلاب</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="text" 
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="اسم الطالب"
              className="w-full p-4 rounded-xl border border-gray-200 text-black outline-none focus:border-blue-500"
            />
            <input 
              type="text" 
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="كود الاشتراك"
              className="w-full p-4 rounded-xl border border-gray-200 text-center font-bold text-blue-600 outline-none"
            />
            {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition">دخول</button>
          </form>
        </div>
      </div>
    );
  }

  // 2. واجهة اختيار المراحل (منفصلة تماماً عن صفحة الدخول)
  return (
    <div className="min-h-screen bg-white p-8 text-center" dir="rtl">
      <h1 className="text-3xl font-bold mb-10 text-black">مرحباً بك يا {user} في أكاديمية غانم</h1>
      
      {!selectedStage ? (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <button onClick={() => setSelectedStage('primary')} className="p-12 bg-yellow-400 rounded-3xl shadow-lg hover:scale-105 transition">
            <div className="text-6xl mb-4">🎒</div>
            <h2 className="text-3xl font-bold text-yellow-900">المرحلة الابتدائية</h2>
          </button>
          <button onClick={() => setSelectedStage('prep')} className="p-12 bg-blue-600 rounded-3xl shadow-lg hover:scale-105 transition">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-3xl font-bold text-white">المرحلة الإعدادية</h2>
          </button>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          <button onClick={() => setSelectedStage(null)} className="mb-10 text-blue-600 font-bold hover:underline flex items-center gap-2 mx-auto">
            ⬅️ العودة للمراحل
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stagesData[selectedStage].map((grade) => (
              <button 
                key={grade.id} 
                onClick={() => window.location.href = `/lessons?grade=${encodeURIComponent(grade.name)}`}
                className="p-6 bg-gray-50 rounded-2xl shadow-sm border-2 border-transparent hover:border-blue-500 hover:bg-white transition flex items-center gap-4 text-right"
              >
                <span className="text-3xl">{grade.icon}</span>
                <span className="font-bold text-lg text-black">{grade.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}