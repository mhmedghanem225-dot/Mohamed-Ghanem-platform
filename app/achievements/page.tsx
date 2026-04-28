"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AchievementsPage() {
  const router = useRouter();
  const [points, setPoints] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [loading, setLoading] = useState(true);

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwr906VCVKPpbeyqwVOpEMrgltgLgzlQTu-wRakX_rBRj60Cuk8BjE4ahG-9ZLNKpg/exec";

  useEffect(() => {
    const fetchAchievements = async () => {
      const savedSession = localStorage.getItem("ghanem_session");
      if (!savedSession) { router.replace("/"); return; }
      
      const userData = JSON.parse(savedSession);
      const identifier = userData.name || userData.Name;

      try {
        setLoading(true);
        // جلب البيانات الطازجة من الشيت مباشرة (الاسم، النقاط، والدروس)
        const response = await fetch(`${SCRIPT_URL}?email=${encodeURIComponent(identifier)}&t=${Date.now()}`);
        const freshData = await response.json();

        if (freshData.status === "success" && freshData.user) {
          // تحديث النقاط من العمود H (index 7) والدروس من العمود F (index 5)
          setPoints(freshData.user.points || 0);
          setCompletedLessons(freshData.user.lessons || 0);
          
          // تحديث الجلسة المحلية لضمان استمرار المزامنة
          localStorage.setItem("ghanem_session", JSON.stringify(freshData.user));
        } else {
          setPoints(userData.points || 0);
        }
      } catch (e) {
        console.error("Error fetching achievements:", e);
        setPoints(userData.points || 0);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-right pb-32" dir="rtl">
      <div className="flex justify-between items-center mb-8">
         <button onClick={() => router.back()} className="text-blue-600 font-bold flex items-center gap-1 text-sm">
           🔙 عودة للدروس
         </button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-gray-900">إنجازاتك يا بطل 🏆</h1>
        <p className="text-gray-500 text-xs italic mt-1">!Your journey to excellence starts here</p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* كارت الرصيد الإجمالي */}
        <div className="bg-[#1D63ED] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden text-white flex flex-col items-center justify-center border-b-8 border-blue-800">
           <p className="text-sm font-bold opacity-80 mb-2">إجمالي رصيدك</p>
           <div className="relative">
              <span className="text-6xl font-black">{loading ? "..." : points}</span>
              <div className="absolute -top-4 -right-8 text-4xl opacity-20">🏆</div>
           </div>
           <div className="mt-4 bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-bold flex items-center gap-2">
             ✅ Completed Lessons: {completedLessons}
           </div>
        </div>

        {/* كارت الشهادة */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 text-center relative">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl">🎓</div>
          <h2 className="text-xl font-black text-gray-800 mb-1">Certificate of Excellence</h2>
          <p className="text-[10px] text-gray-400 font-medium mb-6 italic">.Congratulations! You can now download your official certificate</p>
          
          {points >= 500 ? (
            <button 
              onClick={() => router.push('/certificate-download')}
              className="w-full bg-green-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-green-200 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              🎉 استلم شهادتك الآن
            </button>
          ) : (
            <div className="w-full bg-gray-50 text-gray-400 py-4 rounded-2xl font-black border-2 border-dashed border-gray-200 flex items-center justify-center gap-2 text-sm">
              🔒 تحتاج {500 - points} نقطة لفتح الشهادة
            </div>
          )}
        </div>
      </div>
    </div>
  );
}