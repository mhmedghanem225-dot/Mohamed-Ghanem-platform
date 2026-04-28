"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Student {
  name: string;
  points: number;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [leaders, setLeaders] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // الرابط الخاص بجلب كل البيانات من الشيت
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbznUqf35So7SKQ-ZLHWvuBV5q7zR1k9wHrtw58PTNlUvGSaqATyfAWPWvWVSjawBgRidw/exec";

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        setLoading(true);
        // نرسل طلب لجلب قائمة المتصدرين (تأكد أن السكريبت يدعم جلب الكل)
        const response = await fetch(`${SCRIPT_URL}?action=getLeaders&t=${Date.now()}`);
        const data = await response.json();

        if (data.status === "success") {
          // ترتيب الطلاب من الأعلى للأقل نقاطاً
          const sorted = data.users.sort((a: any, b: any) => b.points - a.points);
          setLeaders(sorted);
        }
      } catch (error) {
        console.error("Failed to fetch leaders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  // فصل الثلاثة الأوائل عن بقية القائمة
  const topThree = leaders.slice(0, 3);
  const others = leaders.slice(3);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-blue-600">جاري تحميل لوحة الأبطال... 🏆</div>;

  return (
    <div className="min-h-screen bg-[#F0F7FF] pb-24 text-right" dir="rtl">
      {/* Header */}
      <div className="bg-white p-6 rounded-b-[3rem] shadow-sm mb-8 text-center border-b-4 border-blue-100">
        <h1 className="text-3xl font-black text-gray-800 mb-1">لوحة الشرف 👑</h1>
        <p className="text-blue-500 font-bold text-sm italic">Top Students - Honor Roll</p>
      </div>

      {/* Podium Section (التصميم الجذاب القديم) */}
      <div className="flex justify-center items-end gap-2 mb-12 px-4 pt-10 h-64">
        {/* المركز الثاني */}
        {topThree[1] && (
          <div className="flex flex-col items-center group">
            <div className="text-xs font-black mb-2 text-gray-500 truncate w-20 text-center">{topThree[1].name}</div>
            <div className="w-20 bg-gradient-to-t from-gray-300 to-gray-100 h-32 rounded-t-2xl shadow-lg flex flex-col items-center justify-center border-x-2 border-t-2 border-white relative">
               <span className="text-4xl">🥈</span>
               <span className="font-black text-gray-700 mt-1">{topThree[1].points}</span>
            </div>
          </div>
        )}

        {/* المركز الأول - البطل */}
        {topThree[0] && (
          <div className="flex flex-col items-center -mt-10 group">
            <div className="bg-yellow-400 text-white text-[10px] px-2 py-0.5 rounded-full mb-1 animate-bounce font-bold">THE KING</div>
            <div className="text-sm font-black mb-2 text-blue-900 truncate w-24 text-center">{topThree[0].name}</div>
            <div className="w-28 bg-gradient-to-t from-yellow-400 to-yellow-200 h-44 rounded-t-3xl shadow-[0_10px_20px_rgba(255,193,7,0.3)] flex flex-col items-center justify-center border-x-4 border-t-4 border-white relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-white/20 -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
               <span className="text-6xl drop-shadow-md">🥇</span>
               <span className="font-black text-yellow-900 text-xl mt-2">{topThree[0].points}</span>
            </div>
          </div>
        )}

        {/* المركز الثالث */}
        {topThree[2] && (
          <div className="flex flex-col items-center group">
            <div className="text-xs font-black mb-2 text-gray-500 truncate w-20 text-center">{topThree[2].name}</div>
            <div className="w-20 bg-gradient-to-t from-orange-300 to-orange-100 h-24 rounded-t-2xl shadow-lg flex flex-col items-center justify-center border-x-2 border-t-2 border-white relative">
               <span className="text-4xl">🥉</span>
               <span className="font-black text-orange-900 mt-1">{topThree[2].points}</span>
            </div>
          </div>
        )}
      </div>

      {/* بقية القائمة */}
      <div className="max-w-md mx-auto px-6 space-y-3">
        {others.map((student, index) => (
          <div key={index} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-blue-50 transition-transform active:scale-95">
            <div className="flex items-center gap-4">
              <span className="bg-blue-50 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs">
                {index + 4}
              </span>
              <span className="font-bold text-gray-700">{student.name}</span>
            </div>
            <div className="bg-blue-600 text-white px-3 py-1 rounded-lg font-black text-xs">
              {student.points} pt
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}