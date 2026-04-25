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

  const WHATSAPP_NUMBER = "201113613894"; 
  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv";

  useEffect(() => {
    const savedSession = localStorage.getItem("ghanem_session");
    if (!savedSession) { router.replace("/"); return; }
    const userData = JSON.parse(savedSession);
    setStudentName(userData.name);

    const fetchLessons = async () => {
      try {
        const res = await fetch(SHEET_CSV_URL);
        const data = await res.text();
        const rows = data.split("\n").map(row => row.split(","));
        const filtered = rows.slice(1)
          .map(r => ({ 
            grade: r[0]?.trim(), 
            title: r[1]?.trim(), 
            video: r[2]?.trim(), 
            pdf: r[3]?.trim(), 
            duration: r[4]?.trim(),
            flashcardsLink: r[5]?.trim(), // الرابط الخارجي القديم لو حبيت تسيبه
            keywords: r[6]?.trim(),      // العمود G الجديد
            meanings: r[7]?.trim()       // العمود H الجديد
          }))
          .filter(i => i.grade === grade);
        setLessons(filtered);
        setLoading(false);
      } catch (e) { setLoading(false); }
    };
    if (grade) fetchLessons();
  }, [grade, router]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24" dir="rtl">
      {/* الهيدر الأزرق الثابت */}
      <div className="bg-blue-600 pt-10 pb-20 px-6 rounded-b-[3.5rem] shadow-xl relative overflow-hidden text-right">
        <div className="flex justify-between items-center relative z-10 mb-6">
          <button onClick={() => { localStorage.removeItem("ghanem_session"); router.replace("/"); }} className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold text-sm">🚪 خروج</button>
          <div className="w-12 h-12 bg-white rounded-full p-1 shadow-lg border-2 border-blue-400 overflow-hidden">
            <Image src="/logo.png" alt="Logo" width={48} height={48} className="rounded-full object-contain" priority />
          </div>
        </div>
        <div className="relative z-10 text-white">
          <p className="text-blue-100 font-bold text-sm mb-1">أهلاً بك يا بطل، {studentName} 👋</p>
          <h1 className="text-3xl font-black mb-1">{grade}</h1>
          <button onClick={() => router.push('/honor-roll')} className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-5 py-2 rounded-2xl font-black text-[11px] shadow-lg flex items-center gap-2 transition-all active:scale-95">👑 لوحة أبطال الأسبوع</button>
        </div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6">
        {loading ? (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl text-center font-bold text-blue-600 animate-pulse text-sm">جاري جلب دروسك الممتعة...</div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson, idx) => (
              <div key={idx} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-4 text-right">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner">📺</div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{lesson.title}</h3>
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">⏱️ {lesson.duration}</span>
                    </div>
                  </div>
                  <a href={lesson.video} target="_blank" className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-blue-100 flex-shrink-0 transition-transform active:scale-90">▶️</a>
                </div>

                {/* أزرار الإضافات - تمت إضافة زر تحدي الكلمات */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50">
                  {lesson.keywords && (
                    <button 
                      onClick={() => router.push(`/flashcards?words=${lesson.keywords}&meanings=${lesson.meanings}&title=${lesson.title}`)}
                      className="flex-1 bg-orange-500 text-white py-3 rounded-xl text-center text-[10px] font-black shadow-sm active:scale-95 transition-all"
                    >
                      🧠 تحدي الكلمات
                    </button>
                  )}
                  {lesson.pdf && (
                    <a href={lesson.pdf} target="_blank" className="flex-1 bg-green-50 text-green-600 py-3 rounded-xl text-center text-[10px] font-black border border-green-100">📄 ملخص الدرس</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <footer className="mt-10 text-center text-gray-300 text-[10px] font-bold pb-10">Ghanem Academy • 2026</footer>
    </div>
  );
}

export default function LessonsPage() { return <Suspense fallback={null}><LessonsContent /></Suspense>; }