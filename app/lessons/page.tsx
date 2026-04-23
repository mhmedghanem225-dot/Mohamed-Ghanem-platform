"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

function LessonsContent() {
  const searchParams = useSearchParams();
  const grade = searchParams.get("grade") || "";
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // الرابط الخاص بك بعد تحويله لصيغة CSV للقراءة البرمجية
  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv";

  useEffect(() => {
    async function fetchLessons() {
      try {
        const response = await fetch(SHEET_CSV_URL);
        const data = await response.text();
        
        // تحويل النص من CSV إلى مصفوفة بيانات
        const rows = data.split("\n").map(row => row.split(","));
        const headers = rows[0]; // الأعمدة: الصف، العنوان، الفيديو، الملخص، المدة
        
        const filteredLessons = rows.slice(1)
          .map(row => ({
            grade: row[0]?.trim(),
            title: row[1]?.trim(),
            video: row[2]?.trim(),
            pdf: row[3]?.trim(),
            duration: row[4]?.trim()
          }))
          .filter(item => item.grade === grade);

        setLessons(filteredLessons);
        setLoading(false);
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
        setLoading(false);
      }
    }
    if (grade) fetchLessons();
  }, [grade]);

  return (
    <div className="max-w-4xl mx-auto p-6 text-right" dir="rtl">
      <Link href="/" className="text-blue-600 font-bold mb-6 inline-block hover:underline">
        ⬅️ عودة للرئيسية
      </Link>
      
      <header className="bg-blue-600 text-white p-8 rounded-3xl mb-8 shadow-lg">
        <h1 className="text-3xl font-black mb-2">{grade}</h1>
        <p className="opacity-90">مرحباً بك في قائمة الدروس المحدثة</p>
      </header>

      {loading ? (
        <div className="text-center py-10 font-bold text-blue-600">جاري تحديث قائمة دروسك...</div>
      ) : lessons.length > 0 ? (
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-50 flex justify-between items-center hover:border-blue-200 transition-all">
              <div className="flex items-center gap-4">
                <span className="text-3xl">📺</span>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{lesson.title}</h3>
                  <div className="flex gap-4 text-sm mt-1">
                    <span className="text-gray-500">⏱️ {lesson.duration}</span>
                    {lesson.pdf && lesson.pdf !== "" && (
                      <a href={lesson.pdf} target="_blank" className="text-green-600 font-bold hover:underline">📄 تحميل الملخص</a>
                    )}
                  </div>
                </div>
              </div>
              <a 
                href={lesson.video} 
                target="_blank" 
                className="bg-blue-600 text-white px-8 py-2 rounded-full font-bold hover:bg-blue-700 shadow-md transition-all"
              >
                بدء
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed">
          <p className="text-gray-500 font-bold">لا توجد دروس مضافة لهذا الصف حالياً في الجدول.</p>
        </div>
      )}
    </div>
  );
}

export default function LessonsPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20 font-bold">جاري التحميل...</div>}>
      <LessonsContent />
    </Suspense>
  );
}