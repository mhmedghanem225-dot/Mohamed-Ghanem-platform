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
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv";

  useEffect(() => {
    // التحقق هل الدرس ده خلص قبل كدة؟
    const completedLessons = JSON.parse(localStorage.getItem("ghanem_completed_tasks") || "[]");
    if (completedLessons.includes(lessonTitle)) {
      setAlreadyCompleted(true);
    }

    const fetchSheetData = async () => {
      try {
        const res = await fetch(`${SHEET_CSV_URL}&t=${Date.now()}`);
        const data = await res.text();
        const rows = data.split(/\r?\n/);
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
      // إذا لم يكن الدرس قد اكتمل من قبل، أضف النقاط
      if (!alreadyCompleted) {
        const currentPoints = parseInt(localStorage.getItem("ghanem_points") || "0");
        localStorage.setItem("ghanem_points", (currentPoints + 50).toString());
        
        // سجل اسم الدرس في قائمة الدروس المكتملة
        const completedLessons = JSON.parse(localStorage.getItem("ghanem_completed_tasks") || "[]");
        completedLessons.push(lessonTitle);
        localStorage.setItem("ghanem_completed_tasks", JSON.stringify(completedLessons));
      }
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

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-orange-600 animate-pulse">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-[#FDF8F3] flex flex-col items-center p-6" dir="rtl">
      <div className="w-full max-w-md flex justify-between items-center mb-8">
        <button onClick={() => router.back()} className="bg-white px-5 py-2 rounded-2xl shadow-sm font-bold text-orange-600 border border-orange-50 text-sm active:scale-90 transition-all">🔙 رجوع</button>
        <h2 className="font-black text-gray-800 text-[10px] bg-orange-100 px-4 py-2 rounded-2xl truncate max-w-[150px]">{lessonTitle}</h2>
      </div>

      <div className="w-full max-w-sm aspect-[3/4] perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          <div className="absolute w-full h-full backface-hidden bg-white rounded-[3.5rem] shadow-2xl border-b-[12px] border-orange-200 flex flex-col items-center justify-center p-10 text-center">
            <span className="text-orange-400 font-bold text-[10px] mb-6 tracking-widest uppercase">كيف تنطقها؟</span>
            <h1 className="text-4xl font-black text-gray-800 mb-8">{cards[currentIndex]?.en}</h1>
            <button onClick={(e) => { e.stopPropagation(); speak(cards[currentIndex]?.en); }} className="w-20 h-20 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center text-3xl shadow-inner active:scale-90 border-2 border-white">🔊</button>
            <p className="mt-12 text-gray-300 text-[10px] font-bold">المس الكارت للمعنى ✨</p>
          </div>
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-orange-400 to-orange-600 rounded-[3.5rem] shadow-2xl flex flex-col items-center justify-center p-10 text-center text-white">
            <span className="text-orange-100 font-bold text-[10px] mb-6 tracking-widest uppercase">المعنى بالعربي</span>
            <h2 className="text-5xl font-black mb-8 drop-shadow-lg">{cards[currentIndex]?.ar}</h2>
            <div className="w-16 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="mt-10 w-full max-w-sm flex gap-4">
        <button 
          onClick={(e) => {e.stopPropagation(); handlePrev();}} 
          disabled={currentIndex === 0} 
          className={`flex-1 py-5 rounded-[2.5rem] font-black shadow-md transition-all flex items-center justify-center ${currentIndex === 0 ? 'bg-gray-50 text-gray-200' : 'bg-white text-gray-800 active:scale-95'}`}
        >
          ⬅️ السابق
        </button>
        <button 
          onClick={(e) => {e.stopPropagation(); handleNext();}} 
          className="flex-[2] bg-gray-900 text-white py-5 rounded-[2.5rem] font-black shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 text-lg"
        >
          {currentIndex === cards.length - 1 ? 'إنهاء واستلام 🏆' : 'التالي ➡️'}
        </button>
      </div>

      <p className="mt-6 text-gray-400 font-bold text-xs">بطاقة {currentIndex + 1} من {cards.length}</p>

      {showWinModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[3rem] p-10 text-center shadow-2xl max-w-xs w-full animate-in zoom-in duration-300">
            <div className="text-7xl mb-4 animate-bounce">🏆</div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">عاش يا بطل!</h2>
            <p className="text-gray-500 font-bold text-sm mb-8">
              {alreadyCompleted 
                ? "لقد راجعت هذا الدرس بنجاح، استمر في التألق! ✨" 
                : "لقد حصلت على 50 نقطة إضافية في رصيدك! 💰"}
            </p>
            <button onClick={() => router.back()} className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-orange-100 active:scale-95 transition-all">تم ✅</button>
          </div>
        </div>
      )}
      <style jsx>{`.perspective-1000 { perspective: 1000px; } .transform-style-3d { transform-style: preserve-3d; } .backface-hidden { backface-visibility: hidden; } .rotate-y-180 { transform: rotateY(180deg); }`}</style>
    </div>
  );
}
export default function FlashcardsPage() { return <Suspense fallback={null}><FlashcardsContent /></Suspense>; }