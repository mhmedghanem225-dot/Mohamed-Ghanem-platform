"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lessonTitle = decodeURIComponent(searchParams.get("title") || "").trim();
  const grade = decodeURIComponent(searchParams.get("grade") || "").trim();

  const [questions, setQuestions] = useState<{en: string, ar: string, options: string[]}[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);

  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv";

  useEffect(() => {
    const fetchAndGenerateQuiz = async () => {
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
          
          const allData = words.map((w, i) => ({ en: w, ar: meanings[i] }));
          
          // توليد 10 أسئلة (أو أقل لو الدرس كلماته قليلة)
          const quizData = allData.slice(0, 10).map((item) => {
            const others = allData.filter(d => d.ar !== item.ar).map(d => d.ar);
            const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 3);
            const options = [item.ar, ...shuffledOthers].sort(() => 0.5 - Math.random());
            return { en: item.en, ar: item.ar, options };
          });

          setQuestions(quizData);
        }
        setLoading(false);
      } catch (e) { setLoading(false); }
    };
    fetchAndGenerateQuiz();
  }, [lessonTitle, grade]);

  const handleAnswer = (selected: string) => {
    const isCorrect = selected === questions[currentQ].ar;
    if (isCorrect) setScore(s => s + 1);

    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
    } else {
      // نهاية الاختبار
      if (score + (isCorrect ? 1 : 0) === questions.length) {
        // فاز بالنقاط كاملة (لو حل كله صح)
        const completed = JSON.parse(localStorage.getItem("ghanem_completed_tasks") || "[]");
        if (!completed.includes(lessonTitle)) {
          const currentPoints = parseInt(localStorage.getItem("ghanem_points") || "0");
          localStorage.setItem("ghanem_points", (currentPoints + 50).toString());
          completed.push(lessonTitle);
          localStorage.setItem("ghanem_completed_tasks", JSON.stringify(completed));
        }
      }
      setShowResult(true);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-blue-600 animate-bounce">يتم تجهيز الاختبار يا بطل... ✍️</div>;

  if (showResult) {
    const isPerfect = score === questions.length;
    return (
      <div className="min-h-screen bg-[#F0F7FF] flex flex-col items-center justify-center p-6 text-center" dir="rtl">
        <div className="bg-white rounded-[3rem] p-10 shadow-2xl w-full max-w-sm">
          <div className="text-7xl mb-6">{isPerfect ? "👑" : "💪"}</div>
          <h2 className="text-3xl font-black text-gray-800 mb-2">{isPerfect ? "عبقري!" : "حاول مرة أخرى"}</h2>
          <p className="text-gray-500 font-bold mb-6">لقد أجبت على {score} من أصل {questions.length}</p>
          {isPerfect ? (
            <p className="text-green-600 font-black mb-8">مبروك! حصلت على 50 نقطة 💰</p>
          ) : (
            <p className="text-orange-500 font-black mb-8">يجب حل جميع الأسئلة صحيحة للحصول على النقاف</p>
          )}
          <button onClick={() => router.back()} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg active:scale-95 transition-all">العودة للدروس</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col items-center p-6" dir="rtl">
      <div className="w-full max-w-md flex justify-between items-center mb-12">
        <span className="bg-white px-4 py-2 rounded-2xl shadow-sm text-blue-600 font-black text-xs">سؤال {currentQ + 1} من {questions.length}</span>
        <div className="h-2 flex-1 mx-4 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}></div>
        </div>
      </div>

      <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-xl border-b-[10px] border-blue-100 text-center mb-10">
        <p className="text-gray-400 font-bold text-xs mb-4 uppercase tracking-widest">ما معنى كلمة؟</p>
        <h2 className="text-4xl font-black text-gray-800 mb-2">{questions[currentQ]?.en}</h2>
      </div>

      <div className="w-full max-w-sm grid grid-cols-1 gap-3">
        {questions[currentQ]?.options.map((opt, i) => (
          <button 
            key={i} 
            onClick={() => handleAnswer(opt)}
            className="bg-white hover:bg-blue-50 border-2 border-transparent hover:border-blue-200 p-5 rounded-2xl font-black text-gray-700 shadow-sm transition-all active:scale-95 text-right flex justify-between items-center group"
          >
            <span className="text-blue-100 group-hover:text-blue-500 transition-colors">●</span>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function QuizPage() { return <Suspense fallback={null}><QuizContent /></Suspense>; }