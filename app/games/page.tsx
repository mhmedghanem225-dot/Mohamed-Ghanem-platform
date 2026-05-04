"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// --- الواجهات (Interfaces) ---
interface Game {
  id: string;
  title: string;
  description: string;
  emoji: string;
  url: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: "Vocabulary" | "Grammar" | "Phonics" | "Spelling";
  provider: string;
  color: string; 
}

// --- بيانات الألعاب المطورة ---
const GAMES_DATA: Game[] = [
  {
    id: "1",
    title: "Monster Vocab",
    description: "أطعم الوحش بالكلمات الصحيحة وتعلم مفردات جديدة!",
    emoji: "👾",
    url: "https://www.gamestolearnenglish.com/monster-vocab/",
    level: "Beginner",
    category: "Vocabulary",
    provider: "GamesToLearnEnglish",
    color: "from-purple-500 to-indigo-600"
  },
  {
    id: "2",
    title: "Fast English",
    description: "تحدي السرعة! هل يمكنك مطابقة الصور مع الكلمات بسرعة؟",
    emoji: "⚡",
    url: "https://www.gamestolearnenglish.com/fast-english/",
    level: "Beginner",
    category: "Vocabulary",
    provider: "GamesToLearnEnglish",
    color: "from-amber-400 to-orange-500"
  },
  {
    id: "3",
    title: "Phonics Sounds",
    description: "استمع للأصوات وتعلم النطق الصحيح للحروف والكلمات.",
    emoji: "🔊",
    url: "https://phonicsandstuff.com/games",
    level: "Beginner",
    category: "Phonics",
    provider: "PhonicsAndStuff",
    color: "from-sky-400 to-blue-600"
  },
  {
    id: "4",
    title: "Grammar Bubbles",
    description: "فرقع الفقاعات لتكوين جمل صحيحة وقواعد سليمة.",
    emoji: "🫧",
    url: "https://www.gamestolearnenglish.com/bubbles/",
    level: "Intermediate",
    category: "Grammar",
    provider: "GamesToLearnEnglish",
    color: "from-emerald-400 to-teal-600"
  },
  {
    id: "5",
    title: "Spelling Bee",
    description: "كن ملك التهجئة! تحدى نفسك في كتابة الكلمات الصعبة.",
    emoji: "🐝",
    url: "https://www.gamestolearnenglish.com/spelling-bee/",
    level: "Advanced",
    category: "Spelling",
    provider: "GamesToLearnEnglish",
    color: "from-rose-400 to-red-600"
  },
  {
    id: "6",
    title: "English Hangman",
    description: "خمن الكلمة قبل أن ينتهي الوقت في هذه اللعبة الكلاسيكية.",
    emoji: "🕵️",
    url: "https://www.gamestolearnenglish.com/hangman/",
    level: "Intermediate",
    category: "Vocabulary",
    provider: "GamesToLearnEnglish",
    color: "from-cyan-400 to-blue-500"
  }
];

export default function GamesPage() {
  const [activeLevel, setActiveLevel] = useState<string>("Beginner");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openGame = (game: Game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F0F7FF] font-sans antialiased pb-32" dir="rtl">
      
      {/* Header - تحديث تنسيق العنوان كما طلبت */}
      <div className="bg-[#1D63ED] pt-10 pb-20 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 text-6xl rotate-12">🎮</div>
            <div className="absolute bottom-10 right-10 text-6xl -rotate-12">⭐</div>
            <div className="absolute top-1/2 left-1/2 text-6xl opacity-20">🚀</div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          {/* العنوان الجديد المنسق */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-xl mb-1">
              GHANEM ACADEMY
            </h1>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl md:text-3xl font-bold text-blue-200 uppercase tracking-[0.3em]">
                Games
              </span>
              <span className="text-3xl animate-pulse">🎮</span>
            </div>
          </div>

          <p className="text-blue-100 font-bold text-sm mb-8 opacity-90">تعلم الإنجليزية والعب في نفس الوقت!</p>

          {/* نختار المستويات */}
          <div className="flex bg-white/20 backdrop-blur-md p-1.5 rounded-2xl border border-white/30 max-w-sm mx-auto overflow-x-auto no-scrollbar">
            {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setActiveLevel(lvl)}
                className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-black transition-all duration-300 whitespace-nowrap ${
                  activeLevel === lvl
                    ? "bg-white text-blue-600 shadow-lg scale-105"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {lvl === "Beginner" ? "مبتدئ 🌱" : lvl === "Intermediate" ? "متوسط ⚡" : "متقدم 🏆"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي - Grid الألعاب */}
      <main className="max-w-5xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES_DATA.filter((g) => g.level === activeLevel).map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-blue-50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className={`h-24 bg-gradient-to-br ${game.color} p-6 relative`}>
                <div className="absolute -bottom-6 right-6 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform">
                  {game.emoji}
                </div>
                <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
                  {game.category}
                </span>
              </div>

              <div className="p-8 pt-10">
                <h3 className="text-xl font-black mb-3 text-slate-800 text-right">{game.title}</h3>
                <p className="text-slate-500 text-xs font-bold leading-relaxed mb-8 text-right min-h-[40px]">
                  {game.description}
                </p>
                
                <button
                  onClick={() => openGame(game)}
                  className={`w-full py-4 bg-gradient-to-r ${game.color} text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all`}
                >
                  <span>العب الآن</span>
                  <span className="text-xl">🚀</span>
                </button>
                
                <div className="mt-4 flex items-center justify-center gap-1 opacity-30">
                    <span className="text-[9px] font-bold uppercase tracking-tighter">Powered by {game.provider}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* حالة عدم وجود ألعاب */}
        {GAMES_DATA.filter((g) => g.level === activeLevel).length === 0 && (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-[3rem] border-4 border-dashed border-blue-100">
            <span className="text-6xl block mb-4 animate-bounce">⏳</span>
            <h3 className="text-xl font-black text-blue-300">ألعاب جديدة قادمة قريباً لهذا المستوى!</h3>
          </div>
        )}
      </main>

      {/* نافذة اللعبة المنبثقة */}
      {isModalOpen && selectedGame && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-slate-900 animate-in zoom-in duration-300">
          <div className="h-16 flex justify-between items-center px-4 bg-white/10 backdrop-blur-md border-b border-white/10">
            <button
              onClick={closeModal}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-black text-xs transition-colors flex items-center gap-2 shadow-lg"
            >
              <span>✕</span>
              <span>خروج</span>
            </button>

            <div className="flex items-center gap-3">
              <h4 className="text-white font-black text-sm">{selectedGame.title}</h4>
              <span className="text-xl bg-white/20 w-10 h-10 flex items-center justify-center rounded-full">{selectedGame.emoji}</span>
            </div>
          </div>

          <div className="flex-grow bg-white overflow-hidden relative">
            <iframe
              src={selectedGame.url}
              className="absolute inset-0 w-full h-full border-none"
              allowFullScreen
              allow="autoplay; fullscreen"
              title={selectedGame.title}
            />
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="fixed bottom-3 left-3 right-3 sm:left-10 sm:right-10 bg-white/95 backdrop-blur-md p-2 rounded-[1.8rem] shadow-2xl border border-gray-100 z-50">
        <div className="grid grid-cols-4 items-center">
          <button onClick={() => window.location.href='/profile'} className="flex flex-col items-center gap-0.5 p-1 opacity-60">
            <span className="text-xl">👤</span>
            <span className="text-[9px] font-black text-gray-400">Profile</span>
          </button>

          <button className="flex flex-col items-center gap-0.5 p-1 relative">
            <div className="bg-[#1D63ED] text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg -mt-8 border-[3px] border-gray-50 transition-all scale-110">
              <span className="text-xl">🎮</span>
            </div>
            <span className="text-[9px] font-black text-[#1D63ED]">Games</span>
          </button>

          <button onClick={() => window.location.href='/lessons'} className="flex flex-col items-center gap-0.5 p-1 opacity-60">
            <span className="text-xl">📖</span>
            <span className="text-[9px] font-black text-gray-400">Lessons</span>
          </button>

          <button onClick={() => window.location.href='/leaderboard'} className="flex flex-col items-center gap-0.5 p-1 opacity-60">
            <span className="text-xl">👑</span>
            <span className="text-[9px] font-black text-gray-400">Leaders</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}