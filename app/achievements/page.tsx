"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AchievementsPage() {
  const router = useRouter();
  const [points, setPoints] = useState(0);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState(""); // إضافة حالة للصف الدراسي
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // الرابط الخاص بك للمزامنة
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbznUqf35So7SKQ-ZLHWvuBV5q7zR1k9wHrtw58PTNlUvGSaqATyfAWPWvWVSjawBgRidw/exec";

  useEffect(() => {
    const fetchData = async () => {
      const savedSession = localStorage.getItem("ghanem_session");
      if (!savedSession) {
        router.replace("/");
        return;
      }

      const userData = JSON.parse(savedSession);
      const identifier = userData.name || userData.Name;
      setName(identifier);
      setGrade(userData.grade || ""); // جلب الصف الدراسي من الجلسة

      try {
        setLoading(true);
        // جلب البيانات الطازجة من الشيت مباشرة لحل مشكلة الصفر
        const response = await fetch(`${SCRIPT_URL}?email=${encodeURIComponent(identifier)}&t=${Date.now()}`);
        const freshData = await response.json();

        if (freshData.status === "success" && freshData.user) {
          setPoints(freshData.user.points || 0);
          setCompletedCount(freshData.user.lessons || 0);
          setGrade(freshData.user.grade || userData.grade); // تحديث الصف الدراسي من الشيت
          
          // تحديث الجلسة المحلية بالبيانات الجديدة
          localStorage.setItem("ghanem_session", JSON.stringify(freshData.user));
        } else {
          // في حال فشل الاتصال نعتمد على المخزن مؤقتاً
          setPoints(parseInt(localStorage.getItem("ghanem_points") || "0"));
          const completed = JSON.parse(localStorage.getItem("ghanem_completed_tasks") || "[]");
          setCompletedCount(completed.length);
        }
      } catch (e) {
        console.error("Error sync:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const getEnglishRank = (pts: number) => {
    if (pts >= 1000) return "Ghanem's Legend 👑";
    if (pts >= 500) return "Golden Star Scholar 🥇";
    if (pts >= 200) return "Smart Explorer 🔍";
    return "Junior Hero 🌟";
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 text-right" dir="rtl">
      <button onClick={() => router.back()} className="mb-8 text-blue-600 font-bold flex items-center gap-2 transition-all active:scale-95">🔙 عودة للدروس</button>
      
      <h1 className="text-3xl font-black text-gray-900 mb-2">إنجازاتك يا بطل 🏆</h1>
      <p className="text-gray-500 font-bold mb-8 italic text-sm">Your journey to excellence starts here!</p>

      <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
        <div className="bg-gradient-to-br from-[#1D63ED] to-blue-800 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
          <p className="text-blue-100 font-bold mb-1">إجمالي رصيدك</p>
          <p className="text-5xl font-black text-[#FFEB3B]">{loading ? "..." : points}</p>
          <p className="mt-4 text-sm font-bold bg-white/10 w-fit px-3 py-1 rounded-lg">Completed Lessons: {completedCount} ✅</p>
          <div className="absolute -right-4 -bottom-4 text-9xl opacity-10">🏆</div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
          <div className="text-5xl mb-4 text-blue-600">🎓</div>
          <h3 className="text-xl font-black text-gray-800 mb-2 font-english">Certificate of Excellence</h3>
          <p className="text-gray-400 text-[11px] font-bold mb-6 italic leading-relaxed">
            Congratulations! You can now download your official certificate.
          </p>
          
          {points >= 500 ? (
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleDownload} 
                className="w-full bg-[#FFC107] text-[#5D4037] py-4 rounded-2xl font-black shadow-lg animate-bounce active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                📥 تحميل الشهادة (PDF)
              </button>
              <p className="text-[10px] text-gray-400 font-bold">نصيحة: اختر "Save as PDF" عند الفتح</p>
            </div>
          ) : (
            <div className="w-full bg-gray-100 text-gray-400 py-4 rounded-2xl font-black border border-dashed text-sm">
              تحتاج {500 - points} نقطة لفتح الشهادة 🔒
            </div>
          )}
        </div>
      </div>

      {/* --- تصميم الشهادة المطبوعة مع إضافة الصف الدراسي --- */}
      <div className="hidden print:block fixed inset-0 bg-[#FDF8F3] p-12 border-[15px] border-[#C19E61] text-center font-serif" dir="ltr">
        <div className="border-4 border-[#C19E61]/40 h-full w-full p-8 flex flex-col justify-between items-center relative bg-white/50 backdrop-blur-sm">
          
          <div className="text-[#C19E61]">
            <h1 className="text-6xl font-serif font-black tracking-widest mb-4">CERTIFICATE</h1>
            <h2 className="text-2xl tracking-[0.3em] font-light text-gray-500">OF EXCELLENCE</h2>
          </div>

          <div className="my-6">
            <p className="text-xl italic text-gray-600 mb-2">This is to certify that the student</p>
            <p className="text-5xl font-black text-gray-900 border-b-4 border-[#C19E61] px-10 inline-block pb-2">
              {name}
            </p>
            {/* إضافة الصف الدراسي هنا */}
            <p className="text-xl font-bold text-blue-800 mt-4 tracking-widest">
              {grade ? `Grade: ${grade}` : ""}
            </p>
          </div>

          <div className="mb-6">
            <p className="text-lg text-gray-500 mb-2 leading-relaxed px-10">Has successfully demonstrated outstanding performance in English studies and is hereby awarded the title of</p>
            <p className="text-3xl font-black text-[#C19E61] uppercase tracking-wider">
               {getEnglishRank(points)}
            </p>
          </div>

          <div className="w-full flex justify-between items-end px-12 mt-6">
            <div className="text-center border-t-2 border-gray-300 pt-2 w-48">
              <p className="text-xs text-gray-400 italic">Date of Issue</p>
              <p className="font-bold text-gray-800">{new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-[#FDF8F3] rounded-full flex items-center justify-center border-2 border-[#C19E61] mb-2 shadow-sm">
                 <span className="text-[#C19E61] font-black text-[10px] text-center leading-tight tracking-tighter">GHANEM<br/>ACADEMY</span>
              </div>
              <p className="text-[10px] uppercase font-bold text-[#C19E61] tracking-widest">Verified</p>
            </div>

            <div className="text-center border-t-2 border-gray-300 pt-2 w-48">
              <p className="text-xs text-gray-400 italic">Instructor</p>
              <p className="font-black text-lg text-gray-900">Mr. Mohamed Ghanem</p>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] -z-10">
            <h1 className="text-[15rem] font-black rotate-45 text-[#C19E61]">ENGLISH</h1>
          </div>
        </div>
      </div>
    </div>
  );
}