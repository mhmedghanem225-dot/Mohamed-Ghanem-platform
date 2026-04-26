"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const savedSession = localStorage.getItem("ghanem_session");
    if (!savedSession) { router.replace("/"); return; }
    const userData = JSON.parse(savedSession);
    setName(userData.name);
    setPoints(parseInt(localStorage.getItem("ghanem_points") || "0"));
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-right pb-32" dir="rtl">
      <h1 className="text-2xl font-black text-gray-900 mb-8">ملفي الشخصي 👤</h1>
      
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 text-center mb-6">
        <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-inner">
          👤
        </div>
        <h2 className="text-xl font-black text-gray-800">{name}</h2>
        <p className="text-blue-600 font-bold">بطل أكاديمية غانم</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 text-center">
          <p className="text-2xl mb-1">🏆</p>
          <p className="text-xl font-black text-gray-800">{points}</p>
          <p className="text-[10px] text-gray-400 font-bold">نقاطي</p>
        </div>
        <button onClick={() => router.push('/achievements')} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 text-center active:scale-95 transition-all">
          <p className="text-2xl mb-1">🎓</p>
          <p className="text-sm font-black text-gray-800">الشهادات</p>
        </button>
      </div>

      <button 
        onClick={() => { localStorage.removeItem("ghanem_session"); router.replace("/"); }}
        className="w-full bg-red-50 text-red-500 py-4 rounded-2xl font-black shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        تسجيل خروج 🚪
      </button>

      {/* الـ Navigation Bar الثابت (سنضعه في كل الصفحات) */}
      <div className="fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-3 rounded-[2.5rem] shadow-2xl border border-gray-100 flex justify-around items-center z-50">
        <button onClick={() => router.push('/achievements')} className="flex flex-col items-center gap-1 p-2 active:scale-75 transition-all">
          <span className="text-2xl opacity-50">🎓</span>
          <span className="text-[10px] font-black text-gray-400">الشهادات</span>
        </button>
        <button onClick={() => router.back()} className="flex flex-col items-center gap-1 p-2 active:scale-75 transition-all">
          <span className="text-2xl opacity-50">📖</span>
          <span className="text-[10px] font-black text-gray-400">الدروس</span>
        </button>
        <button onClick={() => router.push('/leaderboard')} className="flex flex-col items-center gap-1 p-2 active:scale-75 transition-all">
          <span className="text-2xl opacity-50">👑</span>
          <span className="text-[10px] font-black text-gray-400">الأبطال</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2">
           <div className="bg-[#1D63ED] text-white w-14 h-14 flex items-center justify-center rounded-full shadow-lg -mt-10 border-4 border-gray-50">
            <span className="text-2xl">👤</span>
          </div>
          <span className="text-[10px] font-black text-[#1D63ED]">ملفي</span>
        </button>
      </div>
    </div>
  );
}