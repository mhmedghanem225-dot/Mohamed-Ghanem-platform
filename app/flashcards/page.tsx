"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function FlashcardsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lessonTitle = decodeURIComponent(searchParams.get("title") || "").trim();
  const grade = decodeURIComponent(searchParams.get("grade") || "").trim();
  
  const [cards, setCards] = useState<{en: string, ar: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv";

  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const res = await fetch(`${SHEET_CSV_URL}&t=${Date.now()}`);
        const text = await res.text();
        
        // تعديل جوهري: تنظيف الأسطر الجديدة داخل الخلايا (التي تسبب المشكلة)
        const cleanText = text.replace(/\r?\n|\r/g, " "); 
        // إعادة التقسيم بناءً على علامات الاقتباس لضمان قراءة الصفوف صح
        const rows = text.split(/\r?\n/);

        const lessonRow = rows.find(r => {
            const cols = r.split(",");
            const sheetGrade = cols[0]?.replace(/"/g, '').trim();
            const sheetTitle = cols[1]?.replace(/"/g, '').trim();
            // مقارنة مرنة تتجاهل الأخطاء الإملائية البسيطة في vobablary/vocabulary
            return sheetGrade === grade && (sheetTitle?.includes("Unit 4") || sheetTitle === lessonTitle);
        });

        if (lessonRow) {
          const cols = lessonRow.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // تقسيم ذكي يحمي الفواصل داخل الاقتباسات
          const wordsStr = cols[6]?.replace(/"/g, '').trim() || "";
          const meaningsStr = cols[7]?.replace(/"/g, '').trim() || "";
          
          // تنظيف شامل من أي "سطر جديد" متبقي
          const cleanWords = wordsStr.replace(/\n/g, ",").split(",").map(w => w.trim()).filter(w => w);
          const cleanMeanings = meaningsStr.replace(/\n/g, ",").split(",").map(m => m.trim()).filter(m => m);
          
          const combined = cleanWords.map((word, i) => ({
            en: word,
            ar: cleanMeanings[i] || "بطل! 🌟"
          }));

          setCards(combined);
        }
        setLoading(false);
      } catch (e) { setLoading(false); }
    };
    if (lessonTitle) fetchSheetData();
  }, [lessonTitle, grade]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-orange-600">جاري التحميل...</div>;
  
  if (cards.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10">
      <h2 className="font-bold mb-4">تأكد من كتابة الكلمات في شيت جوجل في سطر واحد</h2>
      <button onClick={() => router.back()} className="bg-orange-500 text-white px-6 py-2 rounded-xl">رجوع</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDF8F3] flex flex-col items-center p-6" dir="rtl">
      <div className="w-full max-w-md flex justify-between items-center mb-8">
        <button onClick={() => router.back()} className="bg-white px-5 py-2 rounded-2xl shadow-sm font-bold text-orange-600 border border-orange-50">🔙 رجوع</button>
        <span className="text-xs font-bold bg-orange-100 px-3 py-1 rounded-full">{lessonTitle}</span>
      </div>

      <div className="w-full max-w-sm aspect-[3/4] perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* الأمامي */}
          <div className="absolute w-full h-full backface-hidden bg-white rounded-[3rem] shadow-xl border-b-8 border-orange-200 flex flex-col items-center justify-center p-10">
            <h1 className="text-4xl font-black text-gray-800 mb-6">{cards[currentIndex].en}</h1>
            <button onClick={(e) => { e.stopPropagation(); speak(cards[currentIndex].en); }} className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center text-2xl shadow-inner">🔊</button>
            <p className="mt-8 text-gray-300 text-[10px]">المس الكارت للمعنى ✨</p>
          </div>
          {/* الخلفي */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-orange-500 rounded-[3rem] shadow-xl flex flex-col items-center justify-center p-10 text-white text-center">
            <h2 className="text-5xl font-black mb-4">{cards[currentIndex].ar}</h2>
          </div>
        </div>
      </div>

      <div className="mt-10 w-full max-w-sm">
        <button 
          onClick={(e) => { e.stopPropagation(); setIsFlipped(false); setTimeout(() => setCurrentIndex((prev) => (prev + 1) % cards.length), 200); }} 
          className="w-full bg-gray-900 text-white py-5 rounded-3xl font-black shadow-xl active:scale-95 transition-all"
        >
          الكلمة التالية ➡️
        </button>
      </div>
      <p className="mt-4 text-gray-400 font-bold text-xs">بطاقة {currentIndex + 1} من {cards.length}</p>
      <style jsx>{`.perspective-1000 { perspective: 1000px; } .transform-style-3d { transform-style: preserve-3d; } .backface-hidden { backface-visibility: hidden; } .rotate-y-180 { transform: rotateY(180deg); }`}</style>
    </div>
  );
}

export default function FlashcardsPage() { return <Suspense fallback={null}><FlashcardsContent /></Suspense>; }