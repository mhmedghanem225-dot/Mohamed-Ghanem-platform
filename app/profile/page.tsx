"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const savedSession = localStorage.getItem("ghanem_session");
    if (!savedSession) { router.replace("/"); return; }
    
    const userData = JSON.parse(savedSession);
    setUser(userData);

    // جلب النقاط المحدثة من الشيت بالإيميل
    const fetchFreshPoints = async () => {
      try {
        const res = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv&t=${Date.now()}`);
        const data = await res.text();
        const rows = data.split(/\r?\n/).map(r => r.split(","));
        
        const currentUser = rows.find(r => r[4]?.trim().toLowerCase() === userData.email.toLowerCase());
        if (currentUser) {
          setPoints(parseInt(currentUser[8]?.trim() || "0"));
        }
      } catch (e) { console.error("Error fetching points"); }
    };

    fetchFreshPoints();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("ghanem_session");
    router.replace("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 pb-32" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-[#1D63ED] p-10 text-center relative">
          <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 border-4 border-white/20 p-1">
             <div className="w-full h-full bg-blue-50 rounded-full flex items-center justify-center text-4xl">👤</div>
          </div>
          <h2 className="text-white text-xl font-black">{user.name}</h2>
          <p className="text-blue-100 text-xs font-bold">{user.email}</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center p-6 bg-blue-50 rounded-[2rem] border border-blue-100 shadow-inner">
            <span className="font-black text-blue-900">Total Points</span>
            <span className="text-3xl font-black text-[#1D63ED]">{points} <span className="text-sm">pt</span></span>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black border border-red-100 active:scale-95 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="fixed bottom-5 left-10 right-10 bg-white/95 backdrop-blur-md p-2 rounded-[2rem] shadow-2xl border border-gray-100 flex justify-around items-center z-50">
        <button className="flex flex-col items-center gap-0.5 p-1 relative">
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