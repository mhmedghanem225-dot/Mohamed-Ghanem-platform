"use client";
import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [user, setUser] = useState<string>(""); 
  const [nameInput, setNameInput] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [error, setError] = useState("");
  const [selectedStage, setSelectedStage] = useState<"primary" | "prep" | null>(null);

  const VALID_CODES = ["MG2026", "WINNER", "PRO100"];

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
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-xl border-t-8 border-blue-600">
        <h2 className="text-2xl font-bold text-center mb-6 text-black">تسجيل دخول الطلاب</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="text" 
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="اسمك بالكامل"
            className="w-full p-4 rounded-xl border border-gray-200 text-black outline-none"
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
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-8 text-black">أهلاً بك يا {user}</h1>
      {!selectedStage ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button onClick={() => setSelectedStage('primary')} className="p-10 bg-yellow-400 rounded-3xl shadow-lg hover:scale-105 transition">
            <div className="text-6xl mb-4">🎒</div>
            <h2 className="text-2xl font-bold text-yellow-900">المرحلة الابتدائية</h2>
          </button>
          <button onClick={() => setSelectedStage('prep')} className="p-10 bg-blue-600 rounded-3xl shadow-lg hover:scale-105 transition">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-white">المرحلة الإعدادية</h2>
          </button>
        </div>
      ) : (
        <div>
          <button onClick={() => setSelectedStage(null)} className="mb-8 text-blue-600 font-bold hover:underline">⬅️ عودة للمراحل</button>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stagesData[selectedStage].map((grade) => (
              <Link key={grade.id} href={`/lessons?grade=${grade.name}`} className="p-6 bg-white rounded-2xl shadow border flex items-center gap-4 text-black hover:border-blue-500 transition">
                <span className="text-2xl">{grade.icon}</span>
                <span className="font-bold">{grade.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}