"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const router = useRouter();
  
  // بيانات تجريبية (سيتم استبدالها لاحقاً ببيانات حقيقية من السيرفر)
  const topStudents = [
    { id: 1, name: "أحمد علي", points: 1250, rank: 1 },
    { id: 2, name: "سارة محمود", points: 1100, rank: 2 },
    { id: 3, name: "ياسين محمد", points: 950, rank: 3 },
    { id: 4, name: "ليلى حسن", points: 800, rank: 4 },
    { id: 5, name: "عمر خالد", points: 750, rank: 5 },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 text-right font-sans" dir="rtl">
      {/* زر العودة */}
      <button 
        onClick={() => router.back()} 
        className="mb-8 bg-white px-5 py-2 rounded-2xl shadow-sm text-blue-600 font-bold flex items-center gap-2 active:scale-95 transition-all"
      >
        🔙 العودة للدروس
      </button>

      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-black text-gray-900 mb-2">لوحة الشرف 👑</h1>
        <p className="text-gray-500 font-bold mb-10 italic">The Hall of Fame: Only the best of the best!</p>

        {/* المراكز الثلاثة الأولى */}
        <div className="flex justify-center items-end gap-4 mb-12 h-64">
          {/* المركز الثاني */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl border-4 border-white shadow-lg mb-2">🥈</div>
            <div className="bg-white p-4 rounded-t-3xl w-24 h-32 shadow-sm border-t-4 border-gray-300 flex flex-col justify-center">
              <p className="font-bold text-xs truncate">{topStudents[1].name}</p>
              <p className="text-[#1D63ED] font-black">{topStudents[1].points}</p>
            </div>
          </div>

          {/* المركز الأول (الأطول والأفخم) */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-4xl border-4 border-white shadow-xl mb-2 animate-bounce">👑</div>
            <div className="bg-white p-4 rounded-t-3xl w-28 h-44 shadow-lg border-t-8 border-yellow-400 flex flex-col justify-center">
              <p className="font-black text-sm truncate">{topStudents[0].name}</p>
              <p className="text-[#1D63ED] font-black text-xl">{topStudents[0].points}</p>
            </div>
          </div>

          {/* المركز الثالث */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center text-2xl border-4 border-white shadow-lg mb-2">🥉</div>
            <div className="bg-white p-4 rounded-t-3xl w-24 h-28 shadow-sm border-t-4 border-orange-300 flex flex-col justify-center">
              <p className="font-bold text-xs truncate">{topStudents[2].name}</p>
              <p className="text-[#1D63ED] font-black">{topStudents[2].points}</p>
            </div>
          </div>
        </div>

        {/* باقي القائمة */}
        <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-gray-50">
          {topStudents.slice(3).map((student) => (
            <div 
              key={student.id} 
              className="flex justify-between items-center p-6 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="bg-gray-100 text-gray-500 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                  {student.rank}
                </span>
                <span className="font-bold text-gray-800">{student.name}</span>
              </div>
              <span className="font-black text-[#1D63ED]">{student.points} pt</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}