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
        const res = await fetch(SHEET_CSV_URL + `&cache-bust=${Date.now()}`); // لجلب أحدث بيانات من الشيت فوراً
        const data = await res.text();
        const rows = data.split("\n").map(row => row.split(","));
        
        // بحث "مرن" يتجاهل المسافات الزائدة
        const lessonRow = rows.find(r => {
            const sheetGrade = r[0]?.replace(/"/g, '').trim();
            const sheetTitle = r[1]?.replace(/"/g, '').trim();
            return sheetTitle === lessonTitle && sheetGrade === grade;
        });

        if (lessonRow) {
          // استخراج الكلمات والمعاني من الأعمدة G و H (رقم 6 و 7)
          const wordsStr = lessonRow[6]?.replace(/"/g, '').trim() || "";
          const meaningsStr = lessonRow[7]?.replace(/"/g, '').trim() || "";
          
          if (wordsStr) {
            const wordsArray = wordsStr.split(",").map(w => w.trim());
            const meaningsArray = meaningsStr.split(",").map(m => m.trim());
            
            const combined = wordsArray.map((word, i) => ({
              en: word,
              ar: meaningsArray[i] || "بطل! 🌟"
            })).filter(c => c.en !== "");

            setCards(combined);
          }
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    };
    if (lessonTitle) fetchSheetData();
  }, [lessonTitle, grade]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 250);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-orange-600 animate-pulse">جاري سحب كلماتك من الشيت... ⏳</div>;
  
  if (cards.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center">
        <div className="text-5xl mb-4">🧐</div>
        <h2 className="font-black text-gray-800 mb-2">لم نجد كلمات لهذا الدرس</h2>
        <p className="text-gray-500 text-sm mb-6">تأكد من كتابة الكلمات في العمود G في الشيت</p>
        <button onClick={() => router.back()} className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold">رجوع للدروس</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDF8F3] flex flex-col items-center p-6" dir="rtl">
      <div className="w-full max-w-md flex justify-between items-center mb-8">
        <button onClick={() => router.back()} className="bg-white px-5 py-2 rounded-2xl shadow-sm font-bold text-orange-600 text-sm active:scale-90 border border-orange-50">🔙 رجوع</button>
        <h2 className="font-black text-gray-800 text-[10px] bg-orange-100 px-4 py-2 rounded-2xl">{lessonTitle}</h2>
      </div>

      <div className="w-full max-w-sm aspect-[3/4] perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          <div className="absolute w-full h-full backface-hidden bg-white rounded-[3.5rem] shadow-2xl border-b-[12px] border-orange-200 flex flex-col items-center justify-center p-10 text-center">
            <span className="text-orange-400 font-bold text-[10px] mb-6 tracking-widest uppercase">كيف تنطقها؟</span>
            <h1 className="text-4xl font-black text-gray-800 mb-8">{cards[currentIndex].en}</h1>
            <button onClick={(e) => { e.stopPropagation(); speak(cards[currentIndex].en); }} className="w-20 h-20 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center text-3xl shadow-inner active:scale-90 border-2 border-white">🔊</button>
            <p className="mt-12 text-gray-300 text-[10px] font-bold">المس الكارت للمعنى ✨</p>
          </div>

          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-orange-400 to-orange-600 rounded-[3.5rem] shadow-2xl flex flex-col items-center justify-center p-10 text-center text-white">
            <span className="text-orange-100 font-bold text-[10px] mb-6 tracking-widest uppercase">المعنى بالعربي</span>
            <h2 className="text-5xl font-black mb-8 drop-shadow-lg">{cards[currentIndex].ar}</h2>
            <div className="w-16 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="mt-10 w-full max-w-sm">
        <button onClick={(e) => { e.stopPropagation(); nextCard(); }} className="w-full bg-gray-900 text-white py-6 rounded-[2.5rem] font-black shadow-2xl active:scale-95 flex items-center justify-center gap-4 text-lg">الكلمة التالية ➡️</button>
      </div>
      <p className="mt-6 text-gray-400 font-bold text-xs">{currentIndex + 1} من {cards.length}</p>
      
      <style jsx>{`.perspective-1000 { perspective: 1000px; } .transform-style-3d { transform-style: preserve-3d; } .backface-hidden { backface-visibility: hidden; } .rotate-y-180 { transform: rotateY(180deg); }`}</style>
    </div>
  );
}

export default function FlashcardsPage() { return <Suspense fallback={null}><FlashcardsContent /></Suspense>; }