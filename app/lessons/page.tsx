"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { updateProgressOnSheet } from "../../utils/sheets";

function LessonsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [grade, setGrade] = useState("");
  const [units, setUnits] = useState<{[key: string]: any[]}>({});
  const [openUnits, setOpenUnits] = useState<{[key: string]: boolean}>({});
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [points, setPoints] = useState(0);
  // --- لوجيك إضافي للصورة ---
  const [photo, setPhoto] = useState("");

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz9s8OAoeb8BWZe54jf5BGPvGXDcCtWbOZfsZ9DFCVEZH8fJTLe16UvAn7jBIAXn-mjSg/exec";

  useEffect(() => {
    const syncData = async () => {
      const savedSession = localStorage.getItem("ghanem_session");
      if (!savedSession) { router.replace("/"); return; }
      
      const userData = JSON.parse(savedSession);
      setStudentName(userData.name || userData.Name);
      // جلب الصورة من الـ session المحلي أولاً لضمان سرعة الظهور
      setPhoto(userData.photo || "");

      // جلب أحدث بيانات (نقاط + صورة) من الشيت
      try {
        const response = await fetch(`${SCRIPT_URL}?email=${encodeURIComponent(userData.name || userData.Name)}`);
        const freshData = await response.json();
        if (freshData.status === "success") {
          setPoints(freshData.user.points || 0);
          // تحديث الصورة من السيرفر في حال تغيرت
          setPhoto(freshData.user.photo || "");
          localStorage.setItem("ghanem_session", JSON.stringify(freshData.user));
        } else {
          setPoints(userData.points || 0);
        }
      } catch (e) {
        setPoints(userData.points || 0);
      }

      const gradeFromURL = searchParams.get("grade");
      const lastSavedGrade = localStorage.getItem("last_grade");
      const currentGrade = gradeFromURL || lastSavedGrade || "";
      
      if (currentGrade) {
        setGrade(currentGrade);
        localStorage.setItem("last_grade", currentGrade);
        fetchLessons(currentGrade);
      } else {
        setLoading(false);
      }
    };

    syncData();
  }, [searchParams, router]);

  const fetchLessons = async (targetGrade: string) => {
    try {
      setLoading(true);
      const res = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv&t=${Date.now()}`);
      const data = await res.text();
      const rows = data.split(/\r?\n/).filter(line => line.trim() !== "");
      
      const filtered = rows.slice(1).map(row => {
        const r = row.split(",");
        const unitName = r[r.length - 1]?.replace(/"/g, '').trim() || "General Lessons";
        return { 
          grade: r[0]?.trim(), 
          title: r[1]?.trim(), 
          video: r[2]?.trim(), 
          pdf: r[3]?.trim(), 
          duration: r[4]?.trim(),
          keywords: r[6]?.trim(),
          unit: unitName
        };
      }).filter(i => i.grade === targetGrade);

      const grouped = filtered.reduce((acc: any, item) => {
        if (!acc[item.unit]) acc[item.unit] = [];
        acc[item.unit].push(item);
        return acc;
      }, {});

      setUnits(grouped);
      setLoading(false);
    } catch (e) { setLoading(false); }
  };

  const toggleUnit = (unitName: string) => {
    setOpenUnits(prev => ({ ...prev, [unitName]: !prev[unitName] }));
  };

  const handleWatchLesson = async (videoUrl: string) => {
    await updateProgressOnSheet("lesson");
    window.open(videoUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32" dir="rtl">
      <div className="bg-[#1D63ED] pt-8 pb-16 px-6 rounded-b-[3rem] shadow-xl relative overflow-hidden text-right">
        <div className="flex justify-between items-center relative z-10 mb-4">
          {/* تعديل لوجيك عرض الصورة في زر البروفايل */}
          <button onClick={() => router.push('/profile')} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-lg border border-white/30 active:scale-90 transition-all overflow-hidden">
            {photo ? <img src={photo} className="w-full h-full object-cover" /> : "👤"}
          </button>
          <div className="w-10 h-10 bg-white rounded-full p-1 shadow-lg border-2 border-blue-400 overflow-hidden">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-full object-contain" priority />
          </div>
        </div>
        <div className="relative z-10 text-white flex justify-between items-end">
          <div className="text-right">
            <p className="text-blue-100 font-bold text-xs mb-1">Welcome, {studentName} 👋</p>
            <h1 className="text-2xl font-black">{grade}</h1>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-3 py-2 rounded-xl border border-white/30 text-center min-w-[70px]">
            <p className="text-[9px] font-bold text-blue-50">Points</p>
            <p className="text-xl font-black text-[#FFEB3B]">{points}</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-[-30px] relative z-20">
        {loading ? (
          <div className="bg-white p-8 rounded-[2rem] shadow-xl text-center font-bold text-blue-600 animate-pulse text-sm">Loading curriculum...</div>
        ) : (
          <div className="space-y-3">
            {Object.keys(units).map((unitName) => (
              <div key={unitName} className="bg-white rounded-[1.8rem] shadow-sm border border-gray-100 overflow-hidden">
                <button onClick={() => toggleUnit(unitName)} className="w-full p-5 flex justify-between items-center bg-gray-50/50 active:bg-gray-100 transition-all">
                  <span className={`text-sm text-gray-400 transition-transform duration-300 ${openUnits[unitName] ? 'rotate-180' : ''}`}>▼</span>
                  <span className="font-black text-gray-700 text-sm">{unitName}</span>
                </button>
                {openUnits[unitName] && (
                  <div className="p-3 space-y-3 bg-white border-t border-gray-50">
                    {units[unitName].map((lesson, idx) => (
                      <div key={idx} className="p-4 rounded-[1.5rem] border border-gray-50 bg-gray-50/30 text-right">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl shadow-inner">📺</div>
                            <div className="text-right">
                              <h3 className="font-bold text-gray-800 text-xs">{lesson.title}</h3>
                              <span className="text-[9px] font-bold text-gray-400">⏱️ {lesson.duration}</span>
                            </div>
                          </div>
                          <button onClick={() => handleWatchLesson(lesson.video)} className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform text-xs">▶️</button>
                        </div>
                        <div className="flex gap-2">
                          {lesson.keywords && (
                            <button onClick={() => router.push(`/flashcards?title=${encodeURIComponent(lesson.title)}&grade=${encodeURIComponent(grade)}`)} className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-[10px] font-black active:scale-95">🧠 Challenge</button>
                          )}
                          {lesson.pdf && (
                            <a href={lesson.pdf} target="_blank" className="flex-1 bg-white text-green-600 py-2 rounded-xl text-[10px] font-black border border-green-100 text-center active:scale-95">📄 PDF</a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-5 left-10 right-10 bg-white/95 backdrop-blur-md p-2 rounded-[2rem] shadow-2xl border border-gray-100 flex justify-around items-center z-50">
        <button onClick={() => router.push('/profile')} className="flex flex-col items-center gap-0.5 p-1 active:scale-75 transition-all">
          <span className="text-xl opacity-60">👤</span>
          <span className="text-[9px] font-black text-gray-400">Profile</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 p-1 relative">
          <div className="bg-[#1D63ED] text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg -mt-8 border-[3px] border-gray-50 transition-all">
            <span className="text-xl">📖</span>
          </div>
          <span className="text-[9px] font-black text-[#1D63ED]">Lessons</span>
        </button>
        <button onClick={() => router.push('/leaderboard')} className="flex flex-col items-center gap-0.5 p-1 active:scale-75 transition-all">
          <span className="text-xl opacity-60">👑</span>
          <span className="text-[9px] font-black text-gray-400">Leaders</span>
        </button>
      </div>
    </div>
  );
}

export default function LessonsPage() { return <Suspense fallback={null}><LessonsContent /></Suspense>; }