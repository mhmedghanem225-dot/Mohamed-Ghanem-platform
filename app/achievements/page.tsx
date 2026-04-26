"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AchievementsPage() {
  const router = useRouter();
  const [points, setPoints] = useState(0);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const savedPoints = localStorage.getItem("ghanem_points") || "0";
    const savedSession = localStorage.getItem("ghanem_session");
    const completed = JSON.parse(localStorage.getItem("ghanem_completed_tasks") || "[]");
    
    setPoints(parseInt(savedPoints));
    setCompletedCount(completed.length);
    if (savedSession) {
      const userData = JSON.parse(savedSession);
      setName(userData.name);
      // استخراج المرحلة الدراسية من الجلسة أو الرابط
      const params = new URLSearchParams(window.location.search);
      setGrade(params.get("grade") || "Our Student");
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FDF8F3] p-6 text-right font-sans" dir="rtl">
      {/* زر العودة للدروس */}
      <button 
        onClick={() => router.back()} 
        className="mb-8 bg-white px-5 py-2 rounded-2xl shadow-sm text-[#1D63ED] font-bold border border-blue-50 flex items-center gap-2 transition-all active:scale-95"
      >
        🔙 عودة للدروس
      </button>
      
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-2">إنجازاتك يا بطل 🏆</h1>
        <p className="text-gray-500 font-bold mb-8 italic text-sm">Your journey to excellence is verified here!</p>

        <div className="space-y-6">
          {/* كارت عرض النقاط الحالي */}
          <div className="bg-gradient-to-br from-[#1D63ED] to-[#0A41B0] p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden border-b-8 border-blue-900/30">
            <p className="text-blue-100 font-bold mb-1 text-sm">إجمالي رصيد النقاط</p>
            <p className="text-6xl font-black text-[#FFEB3B] drop-shadow-md">{points}</p>
            <div className="mt-6 flex items-center gap-2 bg-white/10 w-fit px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
              <span className="text-xs font-bold">الدروس المكتملة: {completedCount} ✅</span>
            </div>
            <div className="absolute -right-6 -bottom-6 text-[10rem] opacity-10 rotate-12">🏆</div>
          </div>

          {/* قسم استلام الشهادة */}
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 text-center relative">
            <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 border-2 border-yellow-100 shadow-inner">📜</div>
            <h3 className="text-xl font-black text-gray-800 mb-2">الشهادة الملكية</h3>
            <p className="text-gray-400 text-xs font-bold mb-6 leading-relaxed px-4">استلم شهادة التميز المعتمدة من مستر محمد غانم عند وصولك لـ 500 نقطة</p>
            
            {points >= 500 ? (
              <button 
                onClick={() => window.print()} 
                className="w-full bg-gradient-to-r from-[#FFC107] to-[#FFA000] text-white py-4 rounded-2xl font-black shadow-lg shadow-yellow-100 animate-pulse active:scale-95 transition-all"
              >
                تحميل الشهادة الذهبية 📄
              </button>
            ) : (
              <div className="w-full bg-gray-50 text-gray-400 py-4 rounded-2xl font-black border border-dashed border-gray-200">
                مغلق 🔒 (تحتاج {500 - points} نقطة إضافية)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- تصميم الشهادة المطبوعة (Matching image_b735ed.jpg) --- */}
      <div className="hidden print:block fixed inset-0 bg-[#FDF8F3] p-0 overflow-hidden font-serif" dir="ltr">
        {/* الخلفية الذهبية المنحنية (أعلى يمين) */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#C19E61] rounded-full opacity-90 blur-[2px]"></div>
        {/* الخلفية الذهبية المنحنية (أسفل يسار) */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-[#C19E61] rounded-full opacity-90 blur-[2px]"></div>
        
        {/* الإطار الداخلي الأنيق */}
        <div className="absolute inset-10 border-[3px] border-[#C19E61]/40 rounded-2xl bg-white shadow-2xl flex flex-col items-center justify-between p-12 z-10">
          
          {/* الشعار والوسام العلوي */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gradient-to-b from-[#C19E61] to-[#8E6F3E] rounded-full flex items-center justify-center shadow-xl border-4 border-white mb-2">
              <span className="text-white font-black text-3xl">G</span>
            </div>
            <p className="text-[#C19E61] font-bold tracking-[0.4em] text-xs">GHANEM ACADEMY</p>
          </div>

          {/* العنوان الرئيسي */}
          <div className="text-center">
            <h1 className="text-7xl font-black text-gray-900 tracking-[0.15em] mb-2">CERTIFICATE</h1>
            <h2 className="text-2xl font-light text-gray-400 tracking-[0.4em] uppercase">Of Excellence</h2>
          </div>

          {/* محتوى الشهادة */}
          <div className="text-center space-y-6">
            <p className="text-xl italic text-gray-500">This prestigious certificate is proudly presented to</p>
            <h3 className="text-6xl font-serif font-bold text-[#1a1a1a] border-b-4 border-[#C19E61]/30 inline-block px-10 pb-2">
              {name}
            </h3>
            <p className="max-w-2xl text-lg text-gray-600 leading-relaxed mx-auto pt-4">
              For achieving an outstanding performance and showing exceptional dedication in mastering the 
              <span className="font-bold text-gray-800 italic"> English Language Curriculum </span> 
              for <span className="font-bold text-[#C19E61]">{grade}</span>, with a total score of 
              <span className="font-bold text-gray-800"> {points} points</span>.
            </p>
          </div>

          {/* التواقيع والختم */}
          <div className="w-full flex justify-between items-end px-20 mt-10">
            <div className="text-center w-52">
              <div className="border-b-2 border-gray-200 mb-2 py-2">
                <span className="font-serif italic text-2xl text-gray-800">M. Ghanem</span>
              </div>
              <p className="text-xs font-bold text-[#C19E61] uppercase tracking-widest">Instructor Signature</p>
            </div>

            <div className="text-center w-52">
              <div className="border-b-2 border-gray-200 mb-2 py-2">
                <span className="font-bold text-gray-800">{new Date().toLocaleDateString()}</span>
              </div>
              <p className="text-xs font-bold text-[#C19E61] uppercase tracking-widest">Date of Issue</p>
            </div>
          </div>

          {/* تأثير مائي في الخلفية */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] -z-10 pointer-events-none">
            <span className="text-[15rem] font-black rotate-[-30deg]">GHANEM</span>
          </div>
        </div>
      </div>
    </div>
  );
}