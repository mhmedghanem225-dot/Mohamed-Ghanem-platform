"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function FlashcardsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const wordsRaw = searchParams.get("words") || ""; // سيستقبل الكلمات من رابط الصفحة
  const lessonTitle = searchParams.get("title") || "تحدي الكلمات";
  
  const [words, setWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (wordsRaw) {
      setWords(wordsRaw.split(",").map(w => w.trim()));
    }
  }, [wordsRaw]);

  // دالة النطق الصوتي
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; // نطق أمريكي
    window.speechSynthesis.speak(utterance);
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 150);
  };

  if (words.length === 0) return <div className="text-center mt-20 font-bold">لا توجد كلمات لهذا الدرس بعد..</div>;

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center p-6" dir="rtl">
      {/* هيدر بسيط */}
      <div className="w-full max-w-md flex justify-between items-center mb-10">
        <button onClick={() => router.back()} className="bg-white px-4 py-2 rounded-xl shadow-sm font-bold text-orange-600">رجوع</button>
        <h2 className="font-black text-gray-800">{lessonTitle}</h2>
      </div>

      {/* الكارت التفاعلي */}
      <div 
        className="w-full max-w-sm aspect-[3/4] perspective-1000 group cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* الوجه الأمامي (الكلمة بالإنجليزية) */}
          <div className="absolute w-full h-full backface-hidden bg-white rounded-[3rem] shadow-2xl border-b-8 border-orange-200 flex flex-col items-center justify-center p-10 text-center">
            <span className="text-orange-500 font-bold text-sm mb-4 tracking-widest uppercase">كيف تنطقها؟</span>
            <h1 className="text-4xl font-black text-gray-800 mb-6">{words[currentIndex]}</h1>
            <button 
              onClick={(e) => { e.stopPropagation(); speak(words[currentIndex]); }}
              className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl animate-bounce"
            >
              🔊
            </button>
            <p className="mt-10 text-gray-300 text-xs font-medium">اضغط لقلب الكارت ومعرفة المعنى</p>
          </div>

          {/* الوجه الخلفي (المعنى - حالياً سنضع "ترجمة" كمثال) */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-orange-500 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-10 text-center text-white">
            <h2 className="text-3xl font-black mb-4">أحسنت!</h2>
            <p className="text-xl opacity-90">استمر في التدريب على نطق كلمة</p>
            <span className="text-4xl mt-4 font-serif italic">"{words[currentIndex]}"</span>
          </div>
        </div>
      </div>

      {/* أزرار التحكم */}
      <div className="mt-12 flex items-center gap-6">
        <button 
          onClick={nextCard}
          className="bg-gray-800 text-white px-10 py-4 rounded-2xl font-black shadow-xl active:scale-90 transition-all"
        >
          الكلمة التالية ➡️
        </button>
      </div>

      <p className="mt-6 text-gray-400 font-bold text-sm">{currentIndex + 1} من {words.length}</p>

      {/* تنسيقات الـ CSS للحركة */}
      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}

export default function FlashcardsPage() {
  return <Suspense fallback={null}><FlashcardsContent /></Suspense>;
}