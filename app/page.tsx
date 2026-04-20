\"use client";
import { useState } from "react";
import Link from "next/link";

// تعريف أنواع البيانات
interface Grade { id: number; name: string; icon: string; }
interface Stages { primary: Grade[]; prep: Grade[]; }

export default function HomePage() {
  const [user, setUser] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [error, setError] = useState("");
  const [selectedStage, setSelectedStage] = useState<keyof Stages | null>(null);

  const VALID_CODES = ["MG2026", "WINNER", "PRO100"];

  const stagesData: Stages = {
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
      setError("كود الاشتراك غير صحيح.. اطلبه من مستر محمد");
      return;
    }
    setUser(nameInput);
    setError("");
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-[2.5rem] shadow-2xl border-t-8 border-blue-600">
        <h1 className="text-2xl font-black text-center text-gray-800 mb-6 text-black">تسجيل دخول الطلاب 👨‍🎓</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">اسمك بالكامل</label>
            <input 
              type="text" 
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="اكتب اسمك هنا"
              className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">كود الاشتراك</label>
            <input 
              type="text" 
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="مثال: MG2026"
              className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none text-center font-bold text-blue-600"
            />
          </div>
          {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-black text-lg hover:bg-blue-700 transition shadow-lg">
            دخول للمنصة
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-center">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-4 text-black">أهلاً بك يا <span className="text-blue-600">{user}</span></h1>
        <p className="text-xl text-gray-600">اختر مرحلتك الدراسية الآن</p>
      </header>

      {!selectedStage ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button onClick={() => setSelectedStage('primary')} className="p-10 bg-yellow-400 rounded-[3rem] shadow-2xl hover:scale-105 transition-all border-8 border-white">
            <div className="text-8xl mb-4">🎒</div>
            <h2 className="text-3xl font-black text-yellow-900">المرحلة الابتدائية</h2>
          </button>
          <button onClick={() => setSelectedStage('prep')} className="p-10 bg-blue-600 rounded-[3rem] shadow-2xl hover:scale-105 transition-all border-8 border-white">
            <div className="text-8xl mb-4">📝</div>
            <h2 className="text-3xl font-black text-white">المرحلة الإعدادية</h2>
          </button>
        </div>
      ) : (
        <div>
          <button onClick={() => setSelectedStage(null)} className="mb-8 text-blue-600 font-bold flex items-center gap-2 mx-auto hover:underline">
            ⬅️ العودة للاختيار الرئيسي
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stagesData[selectedStage].map((grade) => (
              <Link key={grade.id} href={`/lessons?grade=${grade.name}`} className="p-6 bg-white rounded-2xl shadow-md border-2 border-gray-100 hover:border-blue-500 hover:shadow-blue-100 transition-all flex items-center gap-4 text-right">
                <span className="text-3xl">{grade.icon}</span>
                <span className="text-xl font-bold text-gray-800">{grade.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}