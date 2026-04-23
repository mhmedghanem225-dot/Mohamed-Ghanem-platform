"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

function LessonsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const grade = searchParams.get("grade") || "";
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv";

  useEffect(() => {
    // التأكد من أن الطالب مسجل دخول، وإلا يرجعه للرئيسية
    const savedSession = localStorage.getItem("ghanem_session");
    if (!savedSession) {
      router.replace("/");
      return;
    }

    async function fetchLessons() {
      try {
        const response = await fetch(SHEET_CSV_URL);
        const data = await response.text();
        const rows = data.split("\n").map(row => row.split(","));
        
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
        setLoading(false);
      }
    }
    if (grade) fetchLessons();
  }, [grade, router]);

  // وظيفة تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("ghanem_session"); // نمسح بيانات الطالب الحالية فقط
    // ملاحظة: لا نمسح ghanem_device_id عشان يفضل الجهاز ده "معروف" للمنصة
    router.replace("/");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-right" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={handleLogout}
          className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-sm border border-red-100 hover:bg-red-600 hover:text-white transition-all"
        >
          🚪 تسجيل خروج
        </button>
        <p className="text-gray-400 text-xs italic">Ghanem Academy</p>
      </div>
      
      <header className="bg-blue-600 text-white p-8 rounded-3xl mb-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2">{grade}</h1>
          <p className="opacity-90 font-medium">قائمة المحتوى التعليمي</p>
        </div>
        {/* لمسة جمالية خلفية */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500 rounded-full opacity-20"></div>
      </header>

      {loading ? (
        <div className="text-center py-10 font-bold text-blue-600 animate-pulse">جاري جلب الدروس...</div>
      ) : lessons.length > 0 ? (
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-50 flex justify-between items-center hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-full text-2xl">📺</div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{lesson.title}</h3>
                  <div className="flex gap-4 text-sm mt-1 text-gray-500">
                    <span>⏱️ {lesson.duration}</span>
                    {lesson.pdf && lesson.pdf !== "" && (
                      <a href={lesson.pdf} target="_blank" className="text-green-600 font-bold hover:underline">📄 ملخص الدرس</a>
                    )}
                  </div>
                </div>
              </div>
              <a 
                href={lesson.video} 
                target="_blank" 
                className="bg-blue-600 text-white px-8 py-2 rounded-full font-bold hover:bg-blue-700 shadow-lg transition-all"
              >
                بدء
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-bold text-xl">لا توجد دروس حالياً لهذا الصف</p>
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