"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LessonsPage() {
  const router = useRouter();
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const savedPoints = localStorage.getItem("ghanem_points") || "0";
    setPoints(parseInt(savedPoints));
  }, []);

  // بيانات تجريبية للوحة الشرف (سيتم ربطها لاحقاً)
  const topStudents = [
    { name: "أحمد علي", points: 1250, rank: 1, icon: "👑" },
    { name: "سارة محمود", points: 1100, rank: 2, icon: "🥈" },
    { name: "ياسين محمد", points: 950, rank: 3, icon: "🥉" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 pb-20 text-right" dir="rtl">
      {/* هيدر الصفحة والترحيب (محتواك الأصلي يظل هنا) */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">مرحباً بك في دروسك 📚</h1>
        <p className="text-gray-500 text-sm font-bold">مستعد لرحلة تعلم جديدة؟</p>
      </div>

      {/* --- قسم لوحة الشرف الجديد بداخل صفحة الدروس --- */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🏆</span> لوحة أبطال غانم
          </h2>
          <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-bold">Top 3</span>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {topStudents.map((student, index) => (
            <div 
              key={index} 
              className={`relative p-4 rounded-[2rem] text-center shadow-sm border ${
                index === 0 ? 'bg-gradient-to-b from-yellow-50 to-white border-yellow-200' : 'bg-white border-gray-100'
              }`}
            >
              <div className="text-2xl mb-1">{student.icon}</div>
              <p className="text-[10px] font-black text-gray-800 truncate mb-1">{student.name}</p>
              <p className="text-xs font-black text-blue-600">{student.points} <span className="text-[8px]">pt</span></p>
              {index === 0 && (
                <div className="absolute -top-2 -right-1 bg-yellow-400 text-white text-[8px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                  الأول
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* --- قسم الدروس (محتواك الأصلي يظل كما هو أدناه) --- */}
      <div className="grid grid-cols-1 gap-4">
        {/* هنا تضع كروت الدروس الخاصة بك */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
           <h3 className="font-black text-gray-800">الدرس الأول: Phonics Basics</h3>
           <p className="text-gray-400 text-sm mt-1">ابدأ رحلتك في نطق الحروف بشكل صحيح</p>
           <button className="mt-4 w-full bg-blue-600 text-white py-3 rounded-2xl font-bold active:scale-95 transition-all">ابدأ الآن 🚀</button>
        </div>
      </div>

      {/* شريط التنقل السفلي (اختياري للوصول السريع للشهادة) */}
      <div className="fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-md p-4 rounded-[2rem] shadow-2xl border border-white/20 flex justify-around items-center z-50">
        <button onClick={() => router.push('/achievements')} className="flex flex-col items-center gap-1">
          <span className="text-xl">🎓</span>
          <span className="text-[10px] font-bold text-gray-500">شهاداتي</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <span className="text-2xl bg-blue-600 text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg -mt-8 border-4 border-white">📖</span>
          <span className="text-[10px] font-bold text-blue-600">دروسي</span>
        </button>
        <button onClick={() => router.push('/leaderboard')} className="flex flex-col items-center gap-1">
          <span className="text-xl">🏆</span>
          <span className="text-[10px] font-bold text-gray-500">الأبطال</span>
        </button>
      </div>
    </div>
  );
}