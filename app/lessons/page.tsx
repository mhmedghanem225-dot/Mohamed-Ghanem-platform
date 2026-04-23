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

  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv";

  useEffect(() => {
    const savedSession = localStorage.getItem("ghanem_session");
    if (!savedSession) { router.replace("/"); return; }
    const fetchLessons = async () => {
      try {
        const res = await fetch(SHEET_CSV_URL);
        const data = await res.text();
        const rows = data.split("\n").map(row => row.split(","));
        setLessons(rows.slice(1).map(r => ({ grade: r[0]?.trim(), title: r[1]?.trim(), video: r[2]?.trim(), pdf: r[3]?.trim(), duration: r[4]?.trim() })).filter(i => i.grade === grade));
        setLoading(false);
      } catch (e) { setLoading(false); }
    };
    if (grade) fetchLessons();
  }, [grade, router]);

  return (
    <div className="min-h-screen bg-gray-50 pb-10" dir="rtl">
      {/* Header الموبايل الجذاب */}
      <div className="bg-blue-600 pt-10 pb-20 px-6 rounded-b-[3.5rem] shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-center relative z-10 mb-6">
          <button onClick={() => { localStorage.removeItem("ghanem_session"); router.replace("/"); }} className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold text-sm">🚪 خروج</button>
          <div className="w-12 h-12 bg-white rounded-full p-1 shadow-lg">
            <Image src="/logo.png" alt="Logo" width={48} height={48} className="rounded-full" />
          </div>
        </div>
        <div className="relative z-10 text-white">
          <h1 className="text-3xl font-black mb-2">{grade}</h1>
          <p className="opacity-80">جاهز لرحلة التعلم اليوم؟ 🚀</p>
        </div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-10">
        {loading ? (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl text-center font-bold text-blue-600 animate-pulse">جاري جلب دروسك الممتعة...</div>
        ) : lessons.length > 0 ? (
          <div className="space-y-4">
            {lessons.map((lesson, idx) => (
              <div key={idx} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between hover:scale-[1.02] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner">📺</div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{lesson.title}</h3>
                    <div className="flex gap-3 items-center">
                      <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">⏱️ {lesson.duration}</span>
                      {lesson.pdf && <a href={lesson.pdf} target="_blank" className="text-xs font-black text-green-600">📄 الملخص</a>}
                    </div>
                  </div>
                </div>
                <a href={lesson.video} target="_blank" className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-blue-200">▶️</a>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl text-center">
            <div className="text-6xl mb-4">😴</div>
            <p className="text-gray-400 font-bold">لا يوجد دروس لهذا الصف حالياً</p>
          </div>
        )}
      </div>
      
      <footer className="mt-10 text-center text-gray-300 text-xs font-bold">
        طُور بكل حب بواسطة مستر محمد غانم ❤️
      </footer>
    </div>
  );
}

export default function LessonsPage() { return <Suspense><LessonsContent /></Suspense>; }