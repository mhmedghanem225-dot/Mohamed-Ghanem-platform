"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";

function LessonsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const grade = searchParams.get("grade") || "";
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [points, setPoints] = useState(0);

  // دالة تحديد اللقب بناءً على النقاط
  const getRank = (pts: number) => {
    if (pts >= 1000) return { title: "أسطورة غانم 👑", color: "text-yellow-300" };
    if (pts >= 500) return { title: "النجم الذهبي 🥇", color: "text-orange-300" };
    if (pts >= 200) return { title: "المستكشف الذكي 🔍", color: "text-blue-200" };
    return { title: "بطل مبتدئ 🌟", color: "text-gray-300" };
  };

  useEffect(() => {
    const savedSession = localStorage.getItem("ghanem_session");
    if (!savedSession) { router.replace("/"); return; }
    const userData = JSON.parse(savedSession);
    setStudentName(userData.name);

    const savedPoints = localStorage.getItem("ghanem_points") || "0";
    setPoints(parseInt(savedPoints));

    const fetchLessons = async () => {
      try {
        const res = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv&t=${Date.now()}`);
        const data = await res.text();
        const rows = data.split("\n").map(row => row.split(","));
        const filtered = rows.slice(1)
          .map(r => ({ 
            grade: r[0]?.trim(), 
            title: r[1]?.trim(), 
            video: r[2]?.trim(), 
            pdf: r[3]?.trim(), 
            duration: r[4]?.trim(),
            keywords: r[6]?.trim() 
          }))
          .filter(i => i.grade === grade);
        setLessons(filtered);
        setLoading(false);
      } catch (e) { setLoading(false); }
    };
    if (grade) fetchLessons();
  }, [grade, router]);

  const rank = getRank(points);

  return (
    <div className="min-h-screen bg-gray-50 pb-32" dir="rtl">
      <div className="bg-[#1D63ED] pt-10 pb-20 px-6 rounded-b-[3.5rem] shadow-xl relative overflow-hidden text-right">
        <div className="flex justify-between items-center relative z-10 mb-6">
          <button onClick={() => { localStorage.removeItem("ghanem_session"); router.replace("/"); }} className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold text-sm">خروج 🚪</button>
          <div className="w-12 h-12 bg-white rounded-full p-1 shadow-lg border-2 border-blue-400 overflow-hidden">
            <Image src="/logo.png" alt="Logo" width={48} height={48} className="rounded-full object-contain" priority />
          </div>
        </div>
        
        <div className="relative z-10 text-white flex justify-between items-end">
          <div>
            <p className="text-blue-100 font-bold text-sm mb-1">أهلاً بك، {studentName} 👋</p>
            <h1 className="text-3xl font-black mb-1">{grade}</h1>
            <p className={`text-xs font-black mt-1 bg-white/10 w-fit px-3 py-1 rounded-full ${rank.color}`}>
              {rank.title}
            </p>
            <div className="flex gap-2 mt-4">
               <button onClick={() => router.push('/honor-roll')} className="bg-[#FFC107] text-[#5D4037] px-4 py-2 rounded-2xl font-black text-[10px] shadow-lg active:scale-95 transition-all">👑 لوحة الشرف</button>
               <button onClick={() => router.push('/achievements')} className="bg-white text-blue-600 px-4 py-2 rounded-2xl font-black text-[10px] shadow-lg active:scale-95 transition-all">🏆 إنجازاتي</button>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/30 text-center min-w-[85px] shadow-lg">
            <p className="text-[10px] font-bold text-blue-50 mb-1">نقاطي 🏆</p>
            <p className="text-2xl font-black text-[#FFEB3B] leading-none">{points}</p>
          </div>
        </div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-[-40px] relative z-20">
        {loading ? (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl text-center font-bold text-blue-600 animate-pulse text-sm">جاري جلب دروسك...</div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col gap-4 text-right">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl">📺</div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{lesson.title}</h3>
                      <span className="text-[10px] font-bold text-gray-400">⏱️ {lesson.duration}</span>
                    </div>
                  </div>
                  <a href={lesson.video} target="_blank" className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform">▶️</a>
                </div>
                <div className="flex gap-2 pt-2 border-t border-gray-50">
                  {lesson.keywords && (
                    <button 
                      onClick={() => router.push(`/flashcards?title=${encodeURIComponent(lesson.title)}&grade=${encodeURIComponent(grade)}`)}
                      className="flex-1 bg-[#FF6D00] text-white py-3 rounded-2xl text-center text-[11px] font-black shadow-md active:scale-95 transition-all"
                    >
                      🧠 تحدي الكلمات
                    </button>
                  )}
                  {lesson.pdf && (
                    <a href={lesson.pdf} target="_blank" className="flex-1 bg-[#E8F5E9] text-[#2E7D32] py-3 rounded-2xl text-center text-[11px] font-black border border-green-100 flex items-center justify-center active:scale-95">📄 ملخص الدرس</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- الـ Navigation Bar المضافة فقط --- */}
      <div className="fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-3 rounded-[2.5rem] shadow-2xl border border-gray-100 flex justify-around items-center z-50">
        <button 
          onClick={() => router.push('/achievements')} 
          className="flex flex-col items-center gap-1 p-2 active:scale-90 transition-all"
        >
          <span className="text-2xl">🎓</span>
          <span className="text-[10px] font-black text-gray-400">الشهادات</span>
        </button>

        <button className="flex flex-col items-center gap-1 p-2">
          <div className="bg-[#1D63ED] text-white w-14 h-14 flex items-center justify-center rounded-full shadow-lg -mt-10 border-4 border-gray-50">
            <span className="text-2xl">📖</span>
          </div>
          <span className="text-[10px] font-black text-[#1D63ED]">الدروس</span>
        </button>

        <button 
          onClick={() => router.push('/honor-roll')} 
          className="flex flex-col items-center gap-1 p-2 active:scale-90 transition-all"
        >
          <span className="text-2xl">👑</span>
          <span className="text-[10px] font-black text-gray-400">الأبطال</span>
        </button>
      </div>

      <footer className="mt-10 text-center text-gray-300 text-[10px] font-bold pb-10">Ghanem Academy • 2026</footer>
    </div>
  );
}

export default function LessonsPage() { return <Suspense fallback={null}><LessonsContent /></Suspense>; }