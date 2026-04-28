"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [points, setPoints] = useState(0);

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwr906VCVKPpbeyqwVOpEMrgltgLgzlQTu-wRakX_rBRj60Cuk8BjE4ahG-9ZLNKpg/exec";

  useEffect(() => {
    const syncProfileData = async () => {
      const savedSession = localStorage.getItem("ghanem_session");
      if (!savedSession) { router.replace("/"); return; }
      
      const userData = JSON.parse(savedSession);
      setName(userData.name || userData.Name);

      try {
        const response = await fetch(`${SCRIPT_URL}?email=${encodeURIComponent(userData.name || userData.Name)}`);
        const freshData = await response.json();

        if (freshData.status === "success") {
          setPoints(freshData.user.points || 0);
          localStorage.setItem("ghanem_session", JSON.stringify(freshData.user));
        } else {
          setPoints(userData.points || 0);
        }
      } catch (e) {
        setPoints(userData.points || 0);
      }
    };

    syncProfileData();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-right pb-32" dir="rtl">
      <h1 className="text-2xl font-black text-gray-900 mb-6 text-center">My Profile 👤</h1>
      
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 text-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl shadow-inner">👤</div>
          <h2 className="text-lg font-black text-gray-800">{name}</h2>
          <p className="text-blue-600 font-bold text-sm">Ghanem Academy Hero</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 text-center">
            <p className="text-xl mb-1">🏆</p>
            <p className="text-lg font-black text-gray-800">{points}</p>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Total Points</p>
          </div>
          <button onClick={() => router.push('/achievements')} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 text-center active:scale-95 transition-all">
            <p className="text-xl mb-1">🎓</p>
            <p className="text-sm font-black text-gray-800">Certificates</p>
          </button>
        </div>

        <button 
          onClick={() => { localStorage.clear(); router.replace("/"); }}
          className="w-full bg-red-50 text-red-500 py-4 rounded-2xl font-black shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
        >
          Logout 🚪
        </button>
      </div>

      <div className="fixed bottom-5 left-10 right-10 bg-white/95 backdrop-blur-md p-2 rounded-[2rem] shadow-2xl border border-gray-100 flex justify-around items-center z-50">
        <button className="flex flex-col items-center gap-0.5 p-1">
          <div className="bg-[#1D63ED] text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg -mt-8 border-[3px] border-gray-50 transition-all">
            <span className="text-xl">👤</span>
          </div>
          <span className="text-[9px] font-black text-[#1D63ED]">Profile</span>
        </button>
        <button onClick={() => router.push('/lessons')} className="flex flex-col items-center gap-0.5 p-1 active:scale-75 transition-all">
          <span className="text-xl opacity-60">📖</span>
          <span className="text-[9px] font-black text-gray-400">Lessons</span>
        </button>
        <button onClick={() => router.push('/leaderboard')} className="flex flex-col items-center gap-0.5 p-1 active:scale-75 transition-all">
          <span className="text-xl opacity-60">👑</span>
          <span className="text-[9px] font-black text-gray-400">Leaders</span>
        </button>
      </div>
    </div>
  );
}