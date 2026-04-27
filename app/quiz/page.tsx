"use client";
import { useState } from "react";
// استدعاء الدالة من ملف الـ utils الذي أنشأناه
import { updateProgressOnSheet } from "../../utils/sheets";

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // قائمة الأسئلة - ضع أسئلتك هنا
  const questions = [
    {
      text: "What is the capital of Egypt?",
      options: [
        { text: "Cairo", isCorrect: true },
        { text: "Alex", isCorrect: false },
        { text: "Giza", isCorrect: false },
        { text: "Suez", isCorrect: false },
      ],
    },
  ];

  const handleAnswer = (isCorrect: boolean) => {
    const nextScore = isCorrect ? score + 1 : score;
    const nextQuestion = currentQuestion + 1;

    if (nextQuestion < questions.length) {
      setScore(nextScore);
      setCurrentQuestion(nextQuestion);
    } else {
      const finalPercentage = Math.round((nextScore / questions.length) * 100);
      setScore(finalPercentage);
      setShowResult(true);
      
      // السطر السحري: يرسل النتيجة للشيت في الخلفية بدون أي تعقيد هنا
      updateProgressOnSheet("quiz", finalPercentage);
    }
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6" dir="rtl">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl text-center max-w-sm w-full border border-blue-50">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">ممتاز يا بطل!</h2>
          <p className="text-gray-500 mb-6">لقد أتممت الكويز بنجاح</p>
          <div className="bg-blue-50 p-6 rounded-3xl mb-6">
            <p className="text-[10px] text-blue-400 font-bold uppercase mb-1 text-center">درجتك النهائية</p>
            <p className="text-4xl font-black text-blue-600">{score}%</p>
          </div>
          <button 
            onClick={() => window.location.href = "/profile"} 
            className="w-full bg-[#1D63ED] text-white py-4 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all"
          >
            العودة للملف الشخصي
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 font-sans" dir="rtl">
      <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase">
            السؤال {currentQuestion + 1}
          </span>
          <span className="text-gray-300 text-[10px] font-black uppercase">
             متبقي {questions.length - currentQuestion}
          </span>
        </div>
        
        <h2 className="text-xl font-black text-gray-800 mb-8 leading-relaxed text-right">
          {questions[currentQuestion].text}
        </h2>
        
        <div className="space-y-3">
          {questions[currentQuestion].options.map((opt, i) => (
            <button 
              key={i} 
              onClick={() => handleAnswer(opt.isCorrect)} 
              className="w-full p-4 rounded-2xl border-2 border-gray-50 hover:border-blue-500 hover:bg-blue-50 transition-all text-right font-bold text-gray-600 active:scale-95"
            >
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}