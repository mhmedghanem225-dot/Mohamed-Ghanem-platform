"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LessonsPage() {
  const router = useRouter();
  const [points, setPoints] = useState(0);
  const [name, setName] = useState("");

  useEffect(() => {
    const savedPoints = localStorage.getItem("ghanem_points") || "0";
    const savedSession = localStorage.getItem("ghanem_session");
    setPoints(parseInt(savedPoints));
    if (savedSession) setName(JSON.parse(savedSession).name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ghanem_session");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 text-right pb-32" dir="rtl">
      {/* الرأس: اسم الطالب وزر تسجيل الخروج (كما هو في تصميمك الأصلي) */}
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={handleLogout}
          className="bg-red-50 text-red-500 p-3 rounded-2xl font-bold text-sm active:scale-95 transition-all"
        >
          تسجيل خروج 🚪
        </button>
        <div className="text-right">
          <h1 className="text-2xl font-black text-gray-900">أهلاً يا {name} 👋</h1>
          <p className="text-gray-500 font-bold text-sm">مستعد لدرس جديد اليوم؟</p>
        </div>
      </div>

      {/* كارت النقاط (كما هو) */}
      <div className="bg-gradient-to-br from-[#1D63ED] to-blue-800 p-6 rounded-[2.5rem] text-white shadow-xl mb-8 relative overflow-hidden">
        <p className="text-blue-100 font-bold mb-1">رصيدك الحالي</p>
        <p className="text-4xl font-black text-[#FFEB3B]">{points} نقطة</p>
        <div className="absolute -right-4 -bottom-4 text-8xl opacity-10">⭐</div>
      </div>

      {/* قسم الدروس (محتواك الأصلي يظل هنا بالكامل دون أي حذف) */}
      <div className="grid grid-cols-1 gap-4">
        <h2 className="text-xl font-black text-gray-800 mb-2">دروس المنهج 📖</h2>
        
        {/* مثال لكارت الدرس كما في تصميمك - كرر هذه الكروت لكل دروسك */}
        <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex justify-between items-center">
          <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center text-xl">🅰️</div>
          <div className="flex-1 mr-4">
            <h3 className="font-black text-gray-800 text-sm">Unit 1: Lesson 1</h3>
            <p className="text-gray-400 text-xs font-bold">Phonics & Vocabulary</p>
          </div>
          <button className="bg-[#1D63ED] text-white px-4 py-2 rounded-xl font-bold text-xs">ابدأ</button>
        </div>
        {/* ... باقي دروسك تظل هنا كما هي ... */}
      </div>

      {/* --- الشريط السفلي الجديد للتنقل (بدون تعديل المحتوى أعلاه) --- */}
      <div className="fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-3 rounded-[2.5rem] shadow-2xl border border-gray-100 flex justify-around items-center z-50">
        <button 
          onClick={() => router.push('/achievements')} 
          className="flex flex-col items-center gap-1 p-2 active:scale-90 transition-all"
        >
          <span className="text-2xl">🎓</span>
          <span className="text-[10px] font-black text-gray-500">الشهادات</span>
        </button>

        <button 
          className="flex flex-col items-center gap-1 p-2"
        >
          <div className="bg-[#1D63ED] text-white w-14 h-14 flex items-center justify-center rounded-full shadow-lg -mt-10 border-4 border-[#F8FAFC]">
            <span className="text-2xl">📖</span>
          </div>
          <span className="text-[10px] font-black text-[#1D63ED]">الدروس</span>
        </button>

        <button 
          onClick={() => router.push('/leaderboard')} 
          className="flex flex-col items-center gap-1 p-2 active:scale-90 transition-all"
        >
          <span className="text-2xl">🏆</span>
          <span className="text-[10px] font-black text-gray-500">الأبطال</span>
        </button>
      </div>
    </div>
  );
}