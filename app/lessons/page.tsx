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

  return (
    <div className="min-h-screen bg-gray-50 pb-28" dir="rtl">
      {/* Header */}
      <div className="bg-[#1D63ED] pt-8 pb-16 px-6 rounded-b-[3rem] shadow-xl relative overflow-hidden text-right">
        <div className="flex justify-between items-center relative z-10 mb-4">
          <button onClick={() => router.push('/profile')} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-lg border border-white/30 active:scale-90 transition-all">👤</button>
          <div className="w-10 h-10 bg-white rounded-full p-1 shadow-lg border-2 border-blue-400 overflow-hidden">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-full object-contain" priority />
          </div>
        </div>
        <div className="relative z-10 text-white flex justify-between items-end">
          <div>
            <p className="text-blue-100 font-bold text-xs mb-1">Welcome, {studentName} 👋</p>
            <h1 className="text-2xl font-black">{grade}</h1>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-3 py-2 rounded-xl border border-white/30 text-center min-w-[70px]">
            <p className="text-[9px] font-bold text-blue-50">Points</p>
            <p className="text-xl font-black text-[#FFEB3B]">{points}</p>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="max-w-md mx-auto px-4 mt-[-30px] relative z-20">
        {loading ? (
          <div className="bg-white p-8 rounded-[2rem] shadow-xl text-center font-bold text-blue-600 animate-pulse text-sm">Loading lessons...</div>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson, idx) => (
              <div key={idx} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-3 text-right">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">📺</div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-base leading-tight mb-0.5">{lesson.title}</h3>
                      <span className="text-[9px] font-bold text-gray-400">⏱️ {lesson.duration}</span>
                    </div>
                  </div>
                  <a href={lesson.video} target="_blank" className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform text-sm">▶️</a>
                </div>
                <div className="flex gap-2 pt-2 border-t border-gray-50">
                  {lesson.keywords && (
                    <button onClick={() => router.push(`/flashcards?title=${encodeURIComponent(lesson.title)}&grade=${encodeURIComponent(grade)}`)} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-center text-[10px] font-black active:scale-95 transition-all">🧠 Challenge</button>
                  )}
                  {lesson.pdf && (
                    <a href={lesson.pdf} target="_blank" className="flex-1 bg-[#E8F5E9] text-[#2E7D32] py-2.5 rounded-xl text-center text-[10px] font-black border border-green-100 flex items-center justify-center active:scale-95">📄 Summary</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Bar (Reduced Size & Unified) */}
      <div className="fixed bottom-5 left-10 right-10 bg-white/95 backdrop-blur-md p-2 rounded-[2rem] shadow-2xl border border-gray-100 flex justify-around items-center z-50">
        {/* Profile on Right */}
        <button onClick={() => router.push('/profile')} className="flex flex-col items-center gap-0.5 p-1 active:scale-75 transition-all">
          <span className="text-xl opacity-60">👤</span>
          <span className="text-[9px] font-black text-gray-400">Profile</span>
        </button>

        {/* Lessons in Center (Highlighted) */}
        <button className="flex flex-col items-center gap-0.5 p-1 relative">
          <div className="bg-[#1D63ED] text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg -mt-8 border-[3px] border-gray-50 transition-all">
            <span className="text-xl">📖</span>
          </div>
          <span className="text-[9px] font-black text-[#1D63ED]">Lessons</span>
        </button>

        {/* Leaders on Left */}
        <button onClick={() => router.push('/leaderboard')} className="flex flex-col items-center gap-0.5 p-1 active:scale-75 transition-all">
          <span className="text-xl opacity-60">👑</span>
          <span className="text-[9px] font-black text-gray-400">Leaders</span>
        </button>
      </div>

      <footer className="mt-8 text-center text-gray-300 text-[9px] font-bold pb-4">Ghanem Academy • 2026</footer>
    </div>
  );
}
export default function LessonsPage() { return <Suspense fallback={null}><LessonsContent /></Suspense>; }