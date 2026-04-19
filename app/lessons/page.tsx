"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function LessonsContent() {
  const searchParams = useSearchParams();
  const grade = searchParams.get("grade") || "الصف الخامس الابتدائي";

  const lessons = [
    { id: 1, title: "ترحيب ومقدمة المنهج", duration: "10:00", type: "فيديو" },
    { id: 2, title: "الوحدة الأولى: الدرس الأول", duration: "15:00", type: "فيديو" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 text-right">
      <Link href="/" className="text-blue-600 font-bold mb-6 inline-block">⬅️ عودة للرئيسية</Link>
      <header className="bg-blue-600 text-white p-8 rounded-3xl mb-8 shadow-lg">
        <h1 className="text-3xl font-black mb-2">{grade}</h1>
        <p className="opacity-90">مرحباً بك في قائمة الدروس</p>
      </header>
      <div className="space-y-4">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
            <div className="flex items-center gap-4">
               <span className="text-2xl">{lesson.type === "فيديو" ? "📺" : "📝"}</span>
               <div>
                 <h3 className="font-bold text-gray-800">{lesson.title}</h3>
                 <span className="text-gray-400 text-sm">المدة: {lesson.duration}</span>
               </div>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold">بدء</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LessonsPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20 font-bold">جاري تحميل الدروس...</div>}>
      <LessonsContent />
    </Suspense>
  );
}