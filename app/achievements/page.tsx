"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AchievementsPage() {
  const router = useRouter();
  const [points, setPoints] = useState(0);
  const [name, setName] = useState("");
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const savedPoints = localStorage.getItem("ghanem_points") || "0";
    const savedSession = localStorage.getItem("ghanem_session");
    const completed = JSON.parse(localStorage.getItem("ghanem_completed_tasks") || "[]");
    
    setPoints(parseInt(savedPoints));
    setCompletedCount(completed.length);
    if (savedSession) setName(JSON.parse(savedSession).name);
  }, []);

  // دالة لتحديد اللقب بالإنجليزية للشهادة (كما كانت في كودك)
  const getEnglishRank = (pts: number) => {
    if (pts >= 1000) return "Ghanem's Legend 👑";
    if (pts >= 500) return "Golden Star Scholar 🥇";
    if (pts >= 200) return "Smart Explorer 🔍";
    return "Junior Hero 🌟";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 text-right" dir="rtl">
      {/* زر العودة */}
      <button onClick={() => router.back()} className="mb-8 text-blue-600 font-bold flex items-center gap-2 transition-all active:scale-95">🔙 عودة للدروس</button>
      
      <h1 className="text-3xl font-black text-gray-900 mb-2">إنجازاتك يا بطل 🏆</h1>
      <p className="text-gray-500 font-bold mb-8 italic">Your journey to excellence starts here!</p>

      <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
        {/* كارت النقاط */}
        <div className="bg-gradient-to-br from-[#1D63ED] to-blue-800 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
          <p className="text-blue-100 font-bold mb-1">إجمالي رصيدك</p>
          <p className="text-5xl font-black text-[#FFEB3B]">{points}</p>
          <p className="mt-4 text-sm font-bold bg-white/10 w-fit px-3 py-1 rounded-lg">Completed Lessons: {completedCount} ✅</p>
          <div className="absolute -right-4 -bottom-4 text-9xl opacity-10">🏆</div>
        </div>

        {/* قسم الشهادة */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
          <div className="text-5xl mb-4 text-blue-600">🎓</div>
          <h3 className="text-xl font-black text-gray-800 mb-2 font-english">Certificate of Excellence</h3>
          <p className="text-gray-400 text-[11px] font-bold mb-6 italic leading-relaxed">
            Congratulations! You can now download your official certificate.
          </p>
          
          {points >= 500 ? (
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.print()} 
                className="w-full bg-[#FFC107] text-[#5D4037] py-4 rounded-2xl font-black shadow-lg animate-bounce active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                📥 تحميل الشهادة (PDF)
              </button>
              <p className="text-[10px] text-gray-400 font-bold">نصيحة: اختر "Save as PDF" عند الفتح</p>
            </div>
          ) : (
            <div className="w-full bg-gray-100 text-gray-400 py-4 rounded-2xl font-black border border-dashed">
              تحتاج {500 - points} نقطة لفتح الشهادة 🔒
            </div>
          )}
        </div>
      </div>

      {/* --- تصميم الشهادة المطبوعة (الإطار والخلفية فقط هم من تم تعديلهم) --- */}
      <div className="hidden print:block fixed inset-0 bg-[#FDF8F3] p-0 overflow-hidden font-serif" dir="ltr">
        
        {/* الفريم الذهبي المتموج الجديد */}
        <div className="absolute -top-10 -right-10 w-[45%] h-[35%] bg-gradient-to-bl from-[#C19E61] to-[#E5D5B8] opacity-90 rounded-b-full shadow-2xl"></div>
        <div className="absolute -bottom-16 -left-10 w-[40%] h-[30%] bg-gradient-to-tr from-[#C19E61] to-[#E5D5B8] opacity-90 rounded-t-full shadow-2xl"></div>

        {/* المحتوى الأصلي للشهادة داخل الإطار */}
        <div className="absolute inset-10 border-[15px] border-[#1D63ED] bg-white flex flex-col justify-between items-center p-12 z-10">
          <div className="border-4 border-[#FFC107] h-full w-full p-8 flex flex-col justify-between items-center relative">
            
            <div className="text-[#1D63ED]">
              <h1 className="text-6xl font-serif font-black tracking-widest mb-4">CERTIFICATE</h1>
              <h2 className="text-2xl tracking-[0.3em] font-light">OF EXCELLENCE</h2>
            </div>

            <div className="my-10">
              <p className="text-xl italic text-gray-600 mb-4">This is to certify that the student</p>
              <p className="text-5xl font-black text-gray-900 border-b-4 border-[#FFC107] px-10 inline-block pb-2">
                {name}
              </p>
            </div>

            <div className="mb-10 text-center">
              <p className="text-xl text-gray-600 mb-2">Has successfully demonstrated outstanding performance and is hereby awarded the title of</p>
              <p className="text-3xl font-black text-[#1D63ED] uppercase tracking-wider">
                 {getEnglishRank(points)}
              </p>
            </div>

            <div className="w-full flex justify-between items-end px-12 mt-10">
              <div className="text-center border-t-2 border-gray-300 pt-2 w-48">
                <p className="text-xs text-gray-400">Date</p>
                <p className="font-bold">{new Date().toLocaleDateString()}</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center border-2 border-blue-600 mb-2">
                   <span className="text-blue-600 font-black text-xs text-center leading-tight">GHANEM<br/>ACADEMY</span>
                </div>
                <p className="text-xs italic text-gray-400 font-bold tracking-tighter">Verified Achievement</p>
              </div>

              <div className="text-center border-t-2 border-gray-300 pt-2 w-48">
                <p className="text-xs text-gray-400">Instructor</p>
                <p className="font-black text-lg">Mr. Mohamed Ghanem</p>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] -z-10">
              <h1 className="text-[15rem] font-black rotate-45">ENGLISH</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}