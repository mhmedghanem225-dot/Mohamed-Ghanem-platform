"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function FlashcardsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // استخدام decodeURIComponent لفهم العربي والرموز
  const wordsRaw = decodeURIComponent(searchParams.get("words") || "");
  const meaningsRaw = decodeURIComponent(searchParams.get("meanings") || "");
  const lessonTitle = decodeURIComponent(searchParams.get("title") || "تحدي الكلمات");
  
  const [cards, setCards] = useState<{en: string, ar: string}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (wordsRaw) {
      // تقسيم الكلمات والمعاني مع تنظيف أي مسافات زائدة
      const w = wordsRaw.split(",").map(item => item.trim()).filter(item => item !== "");
      const m = meaningsRaw.split(",").map(item => item.trim()).filter(item => item !== "");
      
      const combined = w.map((word, i) => ({
        en: word,
        ar: m[i] || "ممتاز! ✨" // لو مفيش ترجمة يظهر كلمة تشجيعية
      }));
      setCards(combined);
    }
  }, [wordsRaw, meaningsRaw]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const nextCard = () => {
    setIsFlipped(false);
    // تأخير بسيط عشان الكارت يرجع لوضعه قبل ما الكلمة تتغير
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 200);
  };

  if (cards.length === 0) return <div className="text-center mt-20 font-bold text-orange-600 animate-bounce">جاري تحضير البطاقات... 🃏</div>;

  return (
    <div className="min-h-screen bg-[#FDF8F3] flex flex-col items-center p-6" dir="rtl">
      {/* الهيدر */}
      <div className="w-full max-w-md flex justify-between items-center mb-8">
        <button onClick={() => router.back()} className="bg-white px-5 py-2 rounded-2xl shadow-sm font-bold text-orange-600 text-sm active:scale-90 transition-all border border-orange-50">🔙 رجوع</button>
        <h2 className="font-black text-gray-800 text-sm bg-orange-100 px-4 py-2 rounded-2xl">{lessonTitle}</h2>
      </div>

      {/* الكارت */}
      <div className="w-full max-w-sm aspect-[3/4] perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* الوجه الإنجليزي */}
          <div className="absolute w-full h-full backface-hidden bg-white rounded-[3.5rem] shadow-2xl shadow-orange-100 border-b-[12px] border-orange-200 flex flex-col items-center justify-center p-10 text-center">
            <span className="text-orange-400 font-bold text-[10px] mb-6 tracking-[0.2em] uppercase">ENGLISH WORD</span>
            <h1 className="text-5xl font-black text-gray-800 mb-8">{cards[currentIndex].en}</h1>
            <button 
              onClick={(e) => { e.stopPropagation(); speak(cards[currentIndex].en); }}
              className="w-20 h-20 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center text-3xl shadow-inner active:scale-90 transition-all border-2 border-white"
            >
              🔊
            </button>
            <p className="mt-12 text-gray-300 text-[10px] font-bold animate-pulse">المس الكارت لمعرفة المعنى ✨</p>
          </div>

          {/* الوجه العربي */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-orange-400 to-orange-600 rounded-[3.5rem] shadow-2xl flex flex-col items-center justify-center p-10 text-center text-white">
            <span className="text-orange-100 font-bold text-[10px] mb-6 tracking-widest">المعنى بالعربي</span>
            <h2 className="text-6xl font-black mb-8 drop-shadow-lg">{cards[currentIndex].ar}</h2>
            <div className="w-16 h-1.5 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* الزر السفلي */}
      <div className="mt-10 w-full max-w-sm">
        <button 
          onClick={(e) => { e.stopPropagation(); nextCard(); }}
          className="w-full bg-gray-900 text-white py-6 rounded-[2.5rem] font-black shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 text-lg"
        >
          الكلمة التالية ➡️
        </button>
      </div>

      <p className="mt-6 text-gray-400 font-bold text-xs">بطاقة {currentIndex + 1} من {cards.length}</p>

      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}

export default function FlashcardsPage() { return <Suspense fallback={null}><FlashcardsContent /></Suspense>; }