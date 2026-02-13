"use client";
import React, { useState, Suspense, useContext, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { UserContext } from "../layout"; 

interface Lesson {
  id: number;
  title: string;
  duration: string;
  videoUrl: string;
  grade: string;
  pdfUrl?: string; 
  quizUrl?: string;
}

function LessonContent() {
  const searchParams = useSearchParams();
  const gradeName = searchParams.get("grade") || "";
  const context = useContext(UserContext) as any;
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Lesson | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mg_lessons");
      if (saved) {
        try {
          const allData: Lesson[] = JSON.parse(saved);
          const filtered = allData.filter((l: Lesson) => l.grade === gradeName);
          setLessons(filtered);
          if (filtered.length > 0) setCurrentVideo(filtered[0]);
        } catch (error) { console.error(error); }
      }
    }
  }, [gradeName]);

  if (!context || !context.user) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-10 bg-white rounded-3xl shadow-xl text-center">
        <h2 className="text-2xl font-black text-blue-900 mb-4">🔐 منطقة الطلاب</h2>
        <Link href="/" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl">العودة للرئيسية</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8" dir="rtl">
      <div className="mb-8 flex justify-between items-center bg-blue-50 p-6 rounded-2xl border">
        <div className="text-right">
          <h1 className="text-2xl font-black text-blue-600">{gradeName}</h1>
          <p className="text-black font-bold">أهلاً {context.user}</p>
        </div>
        <Link href="/" className="text-blue-600 font-bold">تغيير الصف</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black">
            {currentVideo ? (
              <iframe className="w-full h-full" src={currentVideo.videoUrl} allowFullScreen title="video"></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">اختر محاضرة</div>
            )}
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            {currentVideo?.pdfUrl && (
              <a href={currentVideo.pdfUrl} target="_blank" rel="noreferrer" className="bg-green-600 text-white px-8 py-4 rounded-xl font-black">📥 الملزمة</a>
            )}
            {currentVideo?.quizUrl && (
              <a href={currentVideo.quizUrl} target="_blank" rel="noreferrer" className="bg-purple-600 text-white px-8 py-4 rounded-xl font-black">📝 الاختبار</a>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border h-fit">
          <div className="bg-blue-600 text-white p-4 font-black text-center">المحاضرات المتاحة</div>
          <div className="flex flex-col">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setCurrentVideo(lesson)}
                className={`p-5 text-right border-b last:border-0 ${currentVideo?.id === lesson.id ? "bg-blue-50 border-r-4 border-blue-600 font-bold" : "text-black"}`}
              >
                {lesson.title}
              </button>
            ))}
            {lessons.length === 0 && <p className="p-10 text-center text-gray-400 font-bold">قريباً..</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LessonPage() {
  return (
    <Suspense fallback={<div className="text-center p-20 font-bold">جاري التحميل...</div>}>
      <LessonContent />
    </Suspense>
  );
}