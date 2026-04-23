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
            flashcards: r[5]?.trim()
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
      {/* الهيدر الأزرق */}
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
          
          {/* زر لوحة الشرف الذهبي - تأكد من وجود هذا الجزء */}
          <button 
            onClick={() => router.push('/honor-roll')}
            className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-5 py-2 rounded-2xl font-black text-[11px] shadow-lg flex items-center gap-2 transition-all active:scale-95"
          >
            👑 لوحة أبطال الأسبوع
          </button>
        </div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6">
        {loading ? (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl text-center font-bold text-blue-600 animate-pulse text-sm">جاري جلب دروسك الممتعة...</div>
        ) : lessons.length > 0 ? (
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
                  <a href={lesson.video} target="_blank" className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-blue-100 flex-shrink-0">▶️</a>
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-50">
                  {lesson.flashcards && (
                    <a href={lesson.flashcards} target="_blank" className="flex-1 bg-orange-50 text-orange-600 py-3 rounded-xl text-center text-[10px] font-black border border-orange-100">
                      🃏 بطاقات الكلمات
                    </a>
                  )}
                  {lesson.pdf && (
                    <a href={lesson.pdf} target="_blank" className="flex-1 bg-green-50 text-green-600 py-3 rounded-xl text-center text-[10px] font-black border border-green-100">
                      📄 ملخص الدرس
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl text-center border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-bold italic text-sm">لا توجد دروس حالياً</p>
          </div>
        )}
      </div>

      {/* زر الواتساب */}
      <a 
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`أهلاً مستر محمد، أنا الطالب ${studentName} وعندي سؤال بخصوص ${grade}`)}`}
        target="_blank"
        className="fixed bottom-6 left-6 bg-[#25D366] text-white w-16 h-16 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] flex items-center justify-center text-3xl z-50 hover:scale-110 transition-transform active:scale-90 shadow-2xl"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
      </a>
      
      <footer className="mt-10 text-center text-gray-300 text-[10px] font-bold pb-10">Ghanem Academy • 2026</footer>
    </div>
  );
}

export default function LessonsPage() { return <Suspense fallback={null}><LessonsContent /></Suspense>; }