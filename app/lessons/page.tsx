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
        const filtered = rows.slice(1)
          .map(r => ({ 
            grade: r[0]?.trim(), 
            title: r[1]?.trim(), 
            video: r[2]?.trim(), 
            pdf: r[3]?.trim(), 
            duration: r[4]?.trim() 
          }))
          .filter(i => i.grade === grade);
        
        setLessons(filtered);
        setLoading(false);
      } catch (e) { setLoading(false); }
    };
    if (grade) fetchLessons();
  }, [grade, router]);

  return (
    <div className="min-h-screen bg-gray-50 pb-10" dir="rtl">
      {/* الهيدر الأزرق الانسيابي */}
      <div className="bg-blue-600 pt-10 pb-20 px-6 rounded-b-[3.5rem] shadow-xl relative overflow-hidden text-right">
        <div className="flex justify-between items-center relative z-10 mb-6">
          <button 
            onClick={() => { localStorage.removeItem("ghanem_session"); router.replace("/"); }} 
            className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-white/30 transition-all"
          >
            🚪 خروج
          </button>
          <div className="w-12 h-12 bg-white rounded-full p-1 shadow-lg border-2 border-blue-400 overflow-hidden">
            <Image src="/logo.png" alt="Logo" width={48} height={48} className="rounded-full object-contain" priority />
          </div>
        </div>
        <div className="relative z-10 text-white">
          <h1 className="text-3xl font-black mb-2">{grade}</h1>
          <p className="opacity-80 font-medium">جاهز لرحلة التعلم اليوم؟ 🚀</p>
        </div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* منطقة الدروس - التعديل هنا: استخدام mt-6 بدلاً من -mt-10 لحل مشكلة الاختفاء */}
      <div className="max-w-md mx-auto px-4 mt-6">
        {loading ? (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl text-center font-bold text-blue-600 animate-pulse">
            جاري جلب دروسك الممتعة...
          </div>
        ) : lessons.length > 0 ? (
          <div className="space-y-4">
            {lessons.map((lesson, idx) => (
              <div key={idx} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between hover:scale-[1.02] transition-all text-right group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:bg-blue-100 transition-colors">
                    📺
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{lesson.title}</h3>
                    <div className="flex gap-3 items-center">
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">⏱️ {lesson.duration}</span>
                      {lesson.pdf && (
                        <a href={lesson.pdf} target="_blank" className="text-xs font-black text-green-600 border-b border-green-200 hover:text-green-700">
                          📄 الملخص
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <a 
                  href={lesson.video} 
                  target="_blank" 
                  className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-blue-100 flex-shrink-0 active:scale-90 transition-transform"
                >
                  ▶️
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl text-center border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-bold italic text-sm">لا توجد دروس مضافة لهذا الصف حالياً</p>
          </div>
        )}
      </div>
      
      <footer className="mt-10 text-center text-gray-300 text-[10px] font-bold">
        طُور بكل حب بواسطة مستر محمد غانم ❤️
      </footer>
    </div>
  );
}

export default function LessonsPage() { 
  return (
    <Suspense fallback={null}>
      <LessonsContent />
    </Suspense>
  ); 
}