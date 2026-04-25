"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function FlashcardsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const wordsRaw = searchParams.get("words") || "";
  const meaningsRaw = searchParams.get("meanings") || "";
  const lessonTitle = searchParams.get("title") || "تحدي الكلمات";
  
  const [cards, setCards] = useState<{en: string, ar: string}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (wordsRaw) {
      const w = wordsRaw.split(",");
      const m = meaningsRaw.split(",");
      const combined = w.map((word, i) => ({
        en: word.trim(),
        ar: m[i]?.trim() || "احسنت!" // لو مفيش ترجمة يظهر كلمة تشجيعية
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
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  if (cards.length === 0) return <div className="text-center mt-20 font-bold">جاري تحميل الكلمات...</div>;

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center p-6" dir="rtl">
      <div className="w-full max-w-md flex justify-between items-center mb-10">
        <button onClick={() => router.back()} className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm font-bold text-orange-600 active:scale-95">🔙 رجوع</button>
        <h2 className="font-black text-gray-800 text-sm">{lessonTitle}</h2>
      </div>

      <div className="w-full max-w-sm aspect-[3/4] perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* الوجه الأمامي (انجليزي) */}
          <div className="absolute w-full h-full backface-hidden bg-white rounded-[3rem] shadow-xl border-b-8 border-orange-200 flex flex-col items-center justify-center p-10 text-center">
            <span className="text-orange-400 font-bold text-[10px] mb-4 tracking-widest uppercase">ENGLISH WORD</span>
            <h1 className="text-4xl font-black text-gray-800 mb-6">{cards[currentIndex].en}</h1>
            <button 
              onClick={(e) => { e.stopPropagation(); speak(cards[currentIndex].en); }}
              className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl shadow-inner active:scale-90 transition-transform"
            >
              🔊
            </button>
            <p className="mt-10 text-gray-300 text-[10px] font-bold">المس الكارت لمعرفة المعنى ✨</p>
          </div>

          {/* الوجه الخلفي (عربي) */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-orange-500 rounded-[3rem] shadow-xl flex flex-col items-center justify-center p-10 text-center text-white">
            <span className="text-orange-200 font-bold text-[10px] mb-4 tracking-widest">المعنى بالعربي</span>
            <h2 className="text-5xl font-black mb-6">{cards[currentIndex].ar}</h2>
            <div className="w-12 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="mt-12 w-full max-w-sm">
        <button onClick={nextCard} className="w-full bg-gray-900 text-white py-5 rounded-3xl font-black shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
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