"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";

function LessonsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [grade, setGrade] = useState("");
  const [units, setUnits] = useState<{[key: string]: any[]}>({});
  const [openUnits, setOpenUnits] = useState<{[key: string]: boolean}>({});
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    const savedSession = localStorage.getItem("ghanem_session");
    if (!savedSession) { router.replace("/"); return; }
    
    const userData = JSON.parse(savedSession);
    setStudentData(userData);
    
    // جلب الدروس المكتملة من المتصفح
    const savedProgress = localStorage.getItem(`progress_${userData.email}`);
    if (savedProgress) setCompletedLessons(JSON.parse(savedProgress));

    const gradeFromURL = searchParams.get("grade");
    const currentGrade = gradeFromURL || localStorage.getItem("last_grade") || "";
    
    if (currentGrade) {
      setGrade(currentGrade);
      localStorage.setItem("last_grade", currentGrade);
      fetchLessons(currentGrade, userData.email);
    }
  }, [searchParams, router]);

  const fetchLessons = async (targetGrade: string, email: string) => {
    try {
      setLoading(true);
      const res = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv&t=${Date.now()}`);
      const data = await res.text();
      const rows = data.split(/\r?\n/).filter(l => l.trim() !== "").map(r => r.split(","));
      
      // تحديث نقاط الطالب الحالي حصراً من الشيت لمنع التداخل
      const currentUserRow = rows.find(r => r[4]?.trim().toLowerCase() === email.toLowerCase());
      if (currentUserRow) {
        const freshPoints = currentUserRow[8]?.trim() || "0";
        setStudentData((prev: any) => ({ ...prev, points: freshPoints }));
      }

      const filtered = rows.slice(1).map(r => ({
        grade: r[0]?.trim(),
        title: r[1]?.trim(),
        video: r[2]?.trim(),
        pdf: r[3]?.trim(),
        duration: r[4]?.trim(),
        keywords: r[6]?.trim(),
        unit: r[r.length - 1]?.replace(/"/g, '').trim() || "General"
      })).filter(i => i.grade === targetGrade);

      const grouped = filtered.reduce((acc: any, item) => {
        if (!acc[item.unit]) acc[item.unit] = [];
        acc[item.unit].push(item);
        return acc;
      }, {});

      setUnits(grouped);
      setLoading(false);
    } catch (e) { setLoading(false); }
  };

  const markAsDone = (lessonTitle: string) => {
    if (!completedLessons.includes(lessonTitle)) {
      const newProgress = [...completedLessons, lessonTitle];
      setCompletedLessons(newProgress);
      localStorage.setItem(`progress_${studentData.email}`, JSON.stringify(newProgress));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32" dir="rtl">
      {/* Header */}
      <div className="bg-[#1D63ED] pt-8 pb-16 px-6 rounded-b-[3rem] shadow-xl relative text-right">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => router.push('/profile')} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">👤</button>
          <div className="w-10 h-10 bg-white rounded-full p-1 overflow-hidden">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
          </div>
        </div>
        <div className="flex justify-between items-end text-white">
          <div>
            <p className="text-blue-100 font-bold text-xs mb-1">مرحباً، {studentData?.name} 👋</p>
            <h1 className="text-2xl font-black">{grade}</h1>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-3 py-2 rounded-xl border border-white/30 text-center">
            <p className="text-[9px] font-bold text-blue-50">النقاط</p>
            <p className="text-xl font-black text-[#FFEB3B]">{studentData?.points || 0}</p>
          </div>
        </div>
      </div>

      {/* Units */}
      <div className="max-w-md mx-auto px-4 mt-[-30px] relative z-20 space-y-3">
        {loading ? (
          <div className="bg-white p-8 rounded-[2rem] text-center font-bold text-blue-600 animate-pulse">جاري تحميل المنهج...</div>
        ) : (
          Object.keys(units).map((unitName) => (
            <div key={unitName} className="bg-white rounded-[1.8rem] shadow-sm border border-gray-100 overflow-hidden">
              <button onClick={() => setOpenUnits(p => ({...p, [unitName]: !p[unitName]}))} className="w-full p-5 flex justify-between items-center bg-gray-50/50">
                <span className={`text-sm transition-transform ${openUnits[unitName] ? 'rotate-180' : ''}`}>▼</span>
                <span className="font-black text-gray-700 text-sm">{unitName}</span>
              </button>
              
              {openUnits[unitName] && (
                <div className="p-3 space-y-3 bg-white border-t border-gray-50">
                  {units[unitName].map((lesson, idx) => (
                    <div key={idx} className="p-4 rounded-[1.5rem] border border-gray-50 bg-gray-50/30 relative overflow-hidden">
                      {completedLessons.includes(lesson.title) && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-[8px] px-2 py-0.5 rounded-full font-bold">DONE ✅</div>
                      )}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 text-right">
                          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl">📺</div>
                          <div>
                            <h3 className="font-bold text-gray-800 text-xs">{lesson.title}</h3>
                            <span className="text-[9px] font-bold text-gray-400">⏱️ {lesson.duration}</span>
                          </div>
                        </div>
                        <a href={lesson.video} onClick={() => markAsDone(lesson.title)} target="_blank" className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md text-xs">▶️</a>
                      </div>
                      <div className="flex gap-2">
                        {lesson.keywords && (
                          <button onClick={() => router.push(`/flashcards?title=${encodeURIComponent(lesson.title)}`)} className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-[10px] font-black">🧠 تحدي الكلمات</button>
                        )}
                        {lesson.pdf && (
                          <a href={lesson.pdf} onClick={() => markAsDone(lesson.title)} target="_blank" className="flex-1 bg-white text-green-600 py-2 rounded-xl text-[10px] font-black border border-green-100 text-center">📄 ملزمة PDF</a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Navigation Bar */}
      <div className="fixed bottom-5 left-10 right-10 bg-white/95 backdrop-blur-md p-2 rounded-[2rem] shadow-2xl border border-gray-100 flex justify-around items-center z-50">
        <button onClick={() => router.push('/profile')} className="flex flex-col items-center gap-0.5 p-1"><span className="text-xl opacity-60">👤</span><span className="text-[9px] font-black text-gray-400">Profile</span></button>
        <button className="flex flex-col items-center gap-0.5 p-1 relative">
          <div className="bg-[#1D63ED] text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg -mt-8 border-[3px] border-gray-50">📖</div>
          <span className="text-[9px] font-black text-[#1D63ED]">Lessons</span>
        </button>
        <button onClick={() => router.push('/leaderboard')} className="flex flex-col items-center gap-0.5 p-1"><span className="text-xl opacity-60">👑</span><span className="text-[9px] font-black text-gray-400">Leaders</span></button>
      </div>
    </div>
  );
}
export default function LessonsPage() { return <Suspense fallback={null}><LessonsContent /></Suspense>; }