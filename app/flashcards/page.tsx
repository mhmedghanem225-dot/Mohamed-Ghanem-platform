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
  const [showWinModal, setShowWinModal] = useState(false);

  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv";

  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const res = await fetch(`${SHEET_CSV_URL}&t=${Date.now()}`);
        const text = await res.text();
        const rows = text.split(/\r?\n/);
        const lessonRow = rows.find(r => {
            const cols = r.split(",");
            return cols[0]?.trim() === grade && cols[1]?.trim() === lessonTitle;
        });
        if (lessonRow) {
          const cols = lessonRow.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          const words = cols[6]?.replace(/"/g, '').split(",").map(w => w.trim()).filter(w => w);
          const meanings = cols[7]?.replace(/"/g, '').split(",").map(m => m.trim()).filter(m => m);
          setCards(words.map((w, i) => ({ en: w, ar: meanings[i] || "بطل! 🌟" })));
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

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex === cards.length - 1) {
      // إضافة النقاط عند النهاية
      const currentPoints = parseInt(localStorage.getItem("ghanem_points") || "0");
      localStorage.setItem("ghanem_points", (currentPoints + 50).toString());
      setShowWinModal(true);
    } else {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setTimeout(() => setCurrentIndex(prev => prev - 1), 200);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-orange-600 animate-pulse">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#FDF8F3] flex flex-col items-center p-6" dir="rtl">
      <div className="w-full max-w-md flex justify-between items-center mb-8">
        <button onClick={() => router.back()} className="bg-white px-5 py-2 rounded-2xl shadow-sm font-bold text-orange-600 border border-orange-50 text-xs">🔙 رجوع</button>
        <span className="text-[10px] font-black bg-orange-100 px-4 py-2 rounded-2xl text-gray-700 truncate max-w-[150px]">{lessonTitle}</span>
      </div>

      <div className="w-full max-w-sm aspect-[3/4] perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          <div className="absolute w-full h-full backface-hidden bg-white rounded-[3.5rem] shadow-2xl border-b-[12px] border-orange-200 flex flex-col items-center justify-center p-10">
            <h1 className="text-4xl font-black text-gray-800 mb-8">{cards[currentIndex]?.en}</h1>
            <button onClick={(e) => { e.stopPropagation(); speak(cards[currentIndex]?.en); }} className="w-20 h-20 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center text-3xl shadow-inner active:scale-90 border-2 border-white">🔊</button>
            <p className="mt-12 text-gray-300 text-[10px] font-bold">المس الكارت للمعنى ✨</p>
          </div>
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-orange-400 to-orange-600 rounded-[3.5rem] shadow-2xl flex flex-col items-center justify-center p-10 text-center text-white">
            <h2 className="text-5xl font-black mb-8">{cards[currentIndex]?.ar}</h2>
          </div>
        </div>
      </div>

      <div className="mt-10 w-full max-w-sm flex gap-3">
        <button onClick={(e) => {e.stopPropagation(); handlePrev();}} disabled={currentIndex === 0} className={`flex-1 py-5 rounded-[2rem] font-black transition-all ${currentIndex === 0 ? 'bg-gray-100 text-gray-300' : 'bg-white text-gray-800 shadow-md active:scale-95'}`}>⬅️</button>
        <button onClick={(e) => {e.stopPropagation(); handleNext();}} className="flex-[3] bg-gray-900 text-white py-5 rounded-[2rem] font-black shadow-xl active:scale-95 transition-all text-lg">
          {currentIndex === cards.length - 1 ? 'إنهاء التحدي 🏁' : 'التالي ➡️'}
        </button>
      </div>

      {showWinModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[3rem] p-10 text-center shadow-2xl max-w-xs w-full animate-in zoom-in duration-300">
            <div className="text-7xl mb-4">🏆</div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">عاش يا بطل!</h2>
            <p className="text-gray-500 font-bold text-sm mb-8">حصلت على <span className="text-orange-600">50 نقطة</span> لمجهودك الرائع اليوم</p>
            <button onClick={() => router.back()} className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black shadow-lg active:scale-95 transition-all">استلام النقاط ✅</button>
          </div>
        </div>
      )}
      <style jsx>{`.perspective-1000 { perspective: 1000px; } .transform-style-3d { transform-style: preserve-3d; } .backface-hidden { backface-visibility: hidden; } .rotate-y-180 { transform: rotateY(180deg); }`}</style>
    </div>
  );
}
export default function FlashcardsPage() { return <Suspense fallback={null}><FlashcardsContent /></Suspense>; }