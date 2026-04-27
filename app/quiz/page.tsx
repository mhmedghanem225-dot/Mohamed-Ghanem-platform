"use client";
import { useState } from "react";

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // 1. دالة الإرسال المدمجة (بدون ملفات خارجية)
  const updateSheet = async (finalScore: number) => {
    try {
      const savedSession = localStorage.getItem("ghanem_session");
      if (!savedSession) return;
      const { email } = JSON.parse(savedSession);

      const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby4T14R9hasDj3DA7gnPU7InZTlqUfLkZlPdlRH8GbCXhv9WNIQQ9DwiSVbyvLqf8QViQ/exec";

      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          type: "quiz",
          score: finalScore
        }),
      });
    } catch (e) { console.error(e); }
  };

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
      
      // استدعاء دالة التحديث المدمجة
      updateSheet(finalPercentage);
    }
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6" dir="rtl">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl text-center max-w-sm w-full">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">ممتاز!</h2>
          <div className="bg-blue-50 p-6 rounded-3xl mb-6">
            <p className="text-4xl font-black text-blue-600">{score}%</p>
          </div>
          <button onClick={() => window.location.href = "/profile"} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black">العودة للملف الشخصي</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 font-sans" dir="rtl">
      <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-[2rem] shadow-xl border">
        <h2 className="text-xl font-black mb-8 leading-relaxed">{questions[currentQuestion].text}</h2>
        <div className="space-y-3">
          {questions[currentQuestion].options.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(opt.isCorrect)} className="w-full p-4 rounded-2xl border-2 hover:border-blue-500 hover:bg-blue-50 transition-all text-right font-bold">
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}