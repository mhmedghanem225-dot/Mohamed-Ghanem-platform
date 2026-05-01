"use client";

import React, { useState, useEffect, useRef } from "react";

// --- Types & Data ---
interface DialogueLine {
  speaker: "A" | "B";
  text: string;
}

const TOPICS = [
  { id: 1, title: "Daily Routine", icon: "⏰" },
  { id: 2, title: "At the Airport", icon: "✈️" },
  { id: 3, title: "At Work", icon: "💼" },
  { id: 4, title: "Ordering Food", icon: "🍕" },
  { id: 5, title: "At the Doctor", icon: "🩺" },
  { id: 6, title: "Meeting a Friend", icon: "🤝" },
  { id: 7, title: "Shopping", icon: "🛍️" },
  { id: 8, title: "At School", icon: "🏫" },
  { id: 9, title: "Traveling", icon: "🧳" },
  { id: 10, title: "Making Plans", icon: "📅" },
  { id: 11, title: "At the Park", icon: "🌳" },
  { id: 12, title: "Hobbies", icon: "🎨" },
  { id: 13, title: "At the Zoo", icon: "🦁" },
  { id: 14, title: "In the Library", icon: "📚" },
  { id: 15, title: "Birthday Party", icon: "🎂" },
  { id: 16, title: "Buying a Ticket", icon: "🎟️" },
  { id: 17, title: "Weather Talk", icon: "🌤️" },
];

export default function ConversationPractice() {
  const [step, setStep] = useState<"list" | "listen" | "role" | "practice" | "result">("list");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [dialogue, setDialogue] = useState<DialogueLine[]>([]);
  const [userRole, setUserRole] = useState<"A" | "B" | null>(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [isListening, setIsListening] = useState(false);
  const [isPlayingModel, setIsPlayingModel] = useState(false);
  const [fluencyScore, setFluencyScore] = useState(0);

  // --- 1. قاعدة بيانات المحادثات ---
  const generateConversation = (topic: string) => {
    const baseDialogues: Record<string, string[]> = {
      "Daily Routine": ["A: What time do you usually wake up?", "B: I wake up at 7 AM every day.", "A: That is early! Do you eat breakfast?", "B: Yes, I usually have eggs and toast.", "A: What do you do after?", "B: I go to work by bus."],
      "At the Airport": ["A: Hello, can I see your passport?", "B: Here it is, sir.", "A: Thank you. Do you have any luggage?", "B: Yes, this big suitcase.", "A: Please put it on the scale.", "B: Sure, is it too heavy?"],
      "At Work": ["A: Good morning, did you finish the report?", "B: Almost, I need one more hour.", "A: Great, we have a meeting at ten.", "B: I will be ready by then.", "A: Don't forget the charts.", "B: I have them saved on my laptop."],
      "Ordering Food": ["A: Are you ready to order?", "B: Yes, I would like a cheeseburger.", "A: Would you like fries with that?", "B: Yes, please, and a large soda.", "A: Anything else for you?", "B: No, that's all, thank you."],
      "At the Doctor": ["A: How can I help you today?", "B: I have a terrible headache.", "A: When did it start?", "B: It started yesterday morning.", "A: Do you have a fever too?", "B: No, just the headache."],
      "Meeting a Friend": ["A: Hey! Long time no see.", "B: I know! How have you been?", "A: I've been great, just busy with work.", "B: We should grab coffee sometime.", "A: That sounds perfect, how about Friday?", "B: Friday works for me!"],
      "Shopping": ["A: Can I help you find something?", "B: Yes, I'm looking for a blue shirt.", "A: We have these on sale today.", "B: Can I try this one on?", "A: Of course, the fitting rooms are there.", "B: Thank you, it fits perfectly."],
      "At School": ["A: Did you do the math homework?", "B: No, it was very difficult for me.", "A: I can help you during lunch.", "B: That would be so kind of you.", "A: Let's meet in the library.", "B: Okay, see you at twelve."],
      "Traveling": ["A: Where are you going for vacation?", "B: I'm flying to Paris next week.", "A: Wow! Are you going alone?", "B: No, I'm going with my sister.", "A: Have a wonderful trip!", "B: Thanks! I'll send you photos."],
      "Making Plans": ["A: Are you free this weekend?", "B: I'm free on Saturday afternoon.", "A: Do you want to watch a movie?", "B: Sure, what's playing at the cinema?", "A: A new action movie starts at 5 PM.", "B: Let's go! I love action movies."],
      "At the Park": ["A: It's a beautiful day to be outside.", "B: Yes, the sun is shining so bright.", "A: Look at those kids playing football.", "B: They look like they are having fun.", "A: Do you want to go for a walk?", "B: Yes, let's walk near the lake."],
      "Hobbies": ["A: What do you do in your free time?", "B: I really enjoy painting and reading.", "A: That's cool! What do you paint?", "B: Mostly landscapes and flowers.", "A: I would love to see them sometime.", "B: I'll show you my gallery next time."],
      "At the Zoo": ["A: Look at the tall giraffe!", "B: Wow! It is eating leaves.", "A: Do you want to see the lions?", "B: Yes, but I'm a little scared.", "A: Don't worry, they are behind bars.", "B: They are so big and powerful!"],
      "In the Library": ["A: Excuse me, where are the history books?", "B: They are in the back, next to the window.", "A: Can I borrow this book for a week?", "B: Yes, but you need a library card.", "A: Where can I get one?", "B: Just fill out this form here."],
      "Birthday Party": ["A: Happy Birthday! How old are you now?", "B: I'm ten years old today!", "A: Here is a little gift for you.", "B: Thank you! Can I open it now?", "A: Sure, I hope you like it.", "B: It's a new sketchbook! I love it!"],
      "Buying a Ticket": ["A: One ticket to the museum, please.", "B: That will be five dollars.", "A: Do you have a student discount?", "B: Yes, then it is only three dollars.", "A: Great, here is my student ID.", "B: Thank you, enjoy your visit."],
      "Weather Talk": ["A: Is it going to rain today?", "B: The news says it will be cloudy.", "A: I hope it stays dry for the match.", "B: Me too, I don't like the rain.", "A: Should I bring my umbrella?", "B: It's better to be safe than sorry."],
    };

    const lines = baseDialogues[topic] || baseDialogues["Daily Routine"];
    setDialogue(lines.map(line => ({
      speaker: line.startsWith("A:") ? "A" : "B",
      text: line.split(": ")[1]
    })));
  };

  // --- 2. محرك النطق (TTS) ---
  const playAudio = (text: string, speaker: "A" | "B") => {
    return new Promise((resolve) => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      
      if (speaker === "A") {
        utterance.voice = voices.find(v => v.name.includes("Male") || v.name.includes("David")) || null;
        utterance.pitch = 0.85;
      } else {
        utterance.voice = voices.find(v => v.name.includes("Female") || v.name.includes("Zira") || v.name.includes("Google US English")) || null;
        utterance.pitch = 1.15;
      }
      
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      utterance.onend = () => setTimeout(resolve, 600);
      window.speechSynthesis.speak(utterance);
    });
  };

  // --- 3. تشغيل النموذج بالكامل ---
  const playFullModel = async () => {
    setIsPlayingModel(true);
    for (let i = 0; i < dialogue.length; i++) {
      setCurrentLineIndex(i);
      await playAudio(dialogue[i].text, dialogue[i].speaker);
    }
    setIsPlayingModel(false);
    setCurrentLineIndex(-1);
  };

  // --- 4. التعرف على الصوت (STT) ---
  const startListening = () => {
    return new Promise((resolve) => {
      const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!Recognition) {
        alert("Speech recognition is not supported in this browser.");
        resolve(true);
        return;
      }
      const rec = new Recognition();
      rec.lang = "en-US";
      rec.onstart = () => setIsListening(true);
      rec.onresult = () => setFluencyScore(prev => Math.min(prev + 6, 100));
      rec.onend = () => {
        setIsListening(false);
        resolve(true);
      };
      rec.start();
    });
  };

  // --- 5. حلقة الممارسة ---
  const runPracticeLoop = async (index: number) => {
    if (index >= dialogue.length) {
      setStep("result");
      return;
    }
    setCurrentLineIndex(index);
    const line = dialogue[index];
    if (line.speaker === userRole) {
      await startListening();
      setTimeout(() => runPracticeLoop(index + 1), 400);
    } else {
      await playAudio(line.text, line.speaker);
      runPracticeLoop(index + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-slate-900 font-sans pb-10 overflow-x-hidden" dir="ltr">
      {/* Header - Optimized for Mobile height */}
      <header className="bg-[#1E293B] text-white p-6 md:p-12 shadow-xl text-center rounded-b-[2.5rem] md:rounded-b-[5rem] border-b-4 md:border-b-8 border-blue-500">
        <h1 className="text-2xl md:text-5xl font-black tracking-tight">GHANEM ACADEMY</h1>
        <p className="mt-1 text-blue-300 text-sm md:text-xl font-light">The Future of English Learning</p>
      </header>

      <main className="max-w-4xl mx-auto mt-6 md:mt-12 px-4 md:px-6">
        
        {/* Step 1: Topics List - Grid optimized for mobile */}
        {step === "list" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {TOPICS.map((t) => (
              <button 
                key={t.id} 
                onClick={() => { setSelectedTopic(t.title); generateConversation(t.title); setStep("listen"); }}
                className="bg-white p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-md hover:shadow-xl transition-all border-b-2 md:border-b-4 border-slate-200 active:scale-95 text-center"
              >
                <span className="text-3xl md:text-5xl block mb-2 md:mb-4">{t.icon}</span>
                <span className="font-bold text-slate-700 text-sm md:text-lg">{t.title}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Listening Phase */}
        {step === "listen" && (
          <div className="bg-white rounded-3xl md:rounded-[3rem] p-5 md:p-10 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 md:mb-10">
              <h2 className="text-xl md:text-3xl font-black text-slate-800 text-center md:text-left">Topic: {selectedTopic}</h2>
              <button 
                onClick={playFullModel}
                disabled={isPlayingModel}
                className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${isPlayingModel ? "bg-slate-100 text-slate-400" : "bg-blue-600 text-white shadow-lg"}`}
              >
                {isPlayingModel ? "🔊 Playing..." : "▶️ Play All"}
              </button>
            </div>

            <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
              {dialogue.map((line, i) => (
                <div key={i} className={`flex ${line.speaker === "A" ? "justify-start" : "justify-end"}`}>
                  <div className={`relative max-w-[90%] md:max-w-[80%] p-4 md:p-6 rounded-2xl md:rounded-[2rem] transition-all duration-300 ${i === currentLineIndex ? "ring-2 md:ring-4 ring-blue-400 scale-[1.02]" : "opacity-80"} ${line.speaker === "A" ? "bg-blue-50 text-blue-900 rounded-tl-none" : "bg-emerald-50 text-emerald-900 rounded-tr-none"}`}>
                    <p className="text-[9px] font-black uppercase opacity-40 mb-1">{line.speaker === "A" ? "Male Voice" : "Female Voice"}</p>
                    <p className="text-base md:text-xl font-medium leading-tight">{line.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => { setStep("role"); setCurrentLineIndex(-1); window.speechSynthesis.cancel(); }}
              className="w-full bg-slate-900 text-white py-4 md:py-6 rounded-2xl md:rounded-[2rem] font-black text-lg md:text-2xl shadow-xl hover:bg-black transition-all"
            >
              I'm Ready! 🎤
            </button>
          </div>
        )}

        {/* Step 3: Pick Role - Optimized for thumb tapping */}
        {step === "role" && (
          <div className="text-center py-6">
            <h2 className="text-2xl md:text-4xl font-black text-slate-800 mb-8 italic">Choose character:</h2>
            <div className="flex flex-row gap-4 md:gap-10 justify-center">
              <button 
                onClick={() => { setUserRole("A"); setStep("practice"); }}
                className="flex-1 max-w-[160px] md:w-56 h-48 md:h-64 bg-white rounded-3xl md:rounded-[3rem] border-2 md:border-4 border-blue-400 shadow-xl flex flex-col items-center justify-center gap-2 md:gap-4 active:bg-blue-50"
              >
                <span className="text-5xl md:text-8xl">👨</span>
                <span className="font-black text-blue-700 text-sm md:text-xl tracking-tighter md:tracking-widest">SPEAKER A</span>
              </button>
              <button 
                onClick={() => { setUserRole("B"); setStep("practice"); }}
                className="flex-1 max-w-[160px] md:w-56 h-48 md:h-64 bg-white rounded-3xl md:rounded-[3rem] border-2 md:border-4 border-emerald-400 shadow-xl flex flex-col items-center justify-center gap-2 md:gap-4 active:bg-emerald-50"
              >
                <span className="text-5xl md:text-8xl">👩</span>
                <span className="font-black text-emerald-700 text-sm md:text-xl tracking-tighter md:tracking-widest">SPEAKER B</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Practice Phase */}
        {step === "practice" && (
          <div className="space-y-4 md:space-y-8">
            {currentLineIndex === -1 && (
              <div className="bg-white p-8 md:p-12 rounded-3xl md:rounded-[4rem] text-center shadow-xl border-2 md:border-4 border-dashed border-blue-200">
                <p className="text-lg md:text-2xl font-bold text-slate-600 mb-6 md:mb-8">Ready to start?</p>
                <button 
                  onClick={() => runPracticeLoop(0)}
                  className="bg-blue-600 text-white px-10 md:px-20 py-4 md:py-5 rounded-full font-black text-xl md:text-2xl shadow-xl active:scale-95"
                >
                  START NOW
                </button>
              </div>
            )}

            <div className="space-y-4">
              {dialogue.map((line, i) => {
                if (i > currentLineIndex && currentLineIndex !== -1) return null;
                const isActive = i === currentLineIndex;
                const isUser = line.speaker === userRole;

                return (
                  <div 
                    key={i} 
                    className={`p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] transition-all duration-500 shadow-md ${
                      isActive ? "bg-white ring-2 md:ring-4 ring-blue-500 scale-[1.02]" : "bg-slate-100 opacity-40 scale-[0.98]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${isUser ? "bg-emerald-500 animate-pulse" : "bg-blue-500"}`}></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {isUser ? "Your Turn" : "AI Partner"}
                      </span>
                    </div>
                    <p className="text-lg md:text-2xl font-bold text-slate-800 leading-snug">{line.text}</p>
                    {isActive && isListening && (
                      <div className="mt-3 text-emerald-600 font-black text-xs md:text-sm italic flex items-center gap-2">
                         <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        RECORDING... SPEAK NOW!
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Result Page - Compact for mobile */}
        {step === "result" && (
          <div className="bg-white rounded-3xl md:rounded-[4rem] p-8 md:p-16 shadow-xl text-center border-t-4 md:border-t-8 border-orange-400">
            <div className="text-6xl md:text-9xl mb-4 md:mb-8">🏆</div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-2">Brilliant!</h2>
            <p className="text-slate-500 text-sm md:text-xl mb-8 md:mb-12">You've mastered "{selectedTopic}"</p>
            
            <div className="flex gap-4 justify-center mb-8 md:mb-12">
              <div className="bg-orange-50 px-6 py-4 md:px-10 md:py-8 rounded-2xl md:rounded-[3rem] border-2 border-orange-100">
                <p className="text-orange-600 font-black text-[10px] uppercase mb-1">Fluency</p>
                <p className="text-2xl md:text-5xl font-black text-orange-700">{fluencyScore}%</p>
              </div>
              <div className="bg-blue-50 px-6 py-4 md:px-10 md:py-8 rounded-2xl md:rounded-[3rem] border-2 border-blue-100">
                <p className="text-blue-600 font-black text-[10px] uppercase mb-1">Reward</p>
                <p className="text-2xl md:text-5xl font-black text-blue-700">+{fluencyScore * 10}</p>
              </div>
            </div>

            <button 
              onClick={() => window.location.reload()} 
              className="w-full bg-slate-900 text-white py-4 md:py-6 rounded-2xl md:rounded-[2rem] font-black text-lg md:text-2xl shadow-lg active:bg-black"
            >
              Try Another Topic
            </button>
          </div>
        )}
      </main>

      <footer className="text-center mt-6 px-4">
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Ghanem Academy © All Rights Reserved</p>
      </footer>
    </div>
  );
}