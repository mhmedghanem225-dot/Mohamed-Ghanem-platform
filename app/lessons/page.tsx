"use client";
import { useState } from "react";
import { updateProgressOnSheet } from "@/utils/sheets";

export default function LessonsPage() {
  const [selectedLesson, setSelectedLesson] = useState(null);

  const openLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    // تحديث الشيت بزيادة عدد الدروس المكتملة
    updateProgressOnSheet("lesson");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 pb-24" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-2">
          <span className="text-3xl">📚</span> دروس المنهج
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessonsList.map((lesson) => (
            <div key={lesson.id} onClick={() => openLesson(lesson)} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-xl">📺</div>
                <div>
                  <h3 className="font-black text-gray-800">{lesson.title}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{lesson.duration}</p>
                </div>
              </div>
              <div className="text-blue-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const lessonsList = [
  { id: "1", title: "Lesson 1: Phonics", duration: "10 MIN" },
  { id: "2", title: "Lesson 2: Connect Plus", duration: "15 MIN" },
];