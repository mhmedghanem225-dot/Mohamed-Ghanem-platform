"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Student {
  name: string;
  points: number;
}

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // استبدل هذا الرابط بالرابط الجديد بعد الـ Deployment
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzOkcgyRQLMOwrOnwJjW95nXwkqG1vt4VO6od0iABbcPhRyaOmrzgV5zCU9MesiQikwgw/exec";

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${SCRIPT_URL}?action=getLeaders&t=${Date.now()}`);
        const data = await response.json();

        if (data.status === "success" && data.users) {
          // ترتيب الطلاب تنازلياً حسب النقاط
          const sorted = data.users.sort((a: any, b: any) => b.points - a.points);
          setLeaders(sorted);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  const topThree = leaders.slice(0, 3);
  const others = leaders.slice(3);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-blue-600">جاري تحميل الأبطال... 🏆</div>;

  return (
    <div className="min-h-screen bg-[#F0F7FF] pb-24 text-right px-4" dir="rtl">
      <div className="bg-white p-6 rounded-b-[3rem] shadow-sm mb-12 text-center border-b-4 border-blue-100 -mx-4">
        <h1 className="text-3xl font-black text-gray-800 mb-1">لوحة الشرف 👑</h1>
        <p className="text-blue-500 font-bold text-sm italic">Top Students - Honor Roll</p>
      </div>

      {/* المنصة (Podium) */}
      <div className="flex justify-center items-end gap-3 mb-16 h-64 max-w-sm mx-auto">
        {/* المركز الثاني */}
        {topThree[1] && (
          <div className="flex flex-col items-center flex-1">
            <div className="text-[10px] font-black mb-2 text-gray-600 truncate w-full text-center">{topThree[1].name}</div>
            <div className="w-full bg-gradient-to-t from-gray-300 to-gray-50 h-32 rounded-t-2xl shadow-lg border-x-2 border-t-2 border-white flex flex-col items-center justify-center">
              <span className="text-3xl">🥈</span>
              <span className="font-black text-gray-700">{topThree[1].points}</span>
            </div>
          </div>
        )}

        {/* المركز الأول */}
        {topThree[0] && (
          <div className="flex flex-col items-center flex-1 -mt-10">
            <div className="bg-yellow-400 text-white text-[8px] px-2 py-0.5 rounded-full mb-1 animate-bounce font-bold uppercase">King</div>
            <div className="text-xs font-black mb-2 text-blue-900 truncate w-full text-center">{topThree[0].name}</div>
            <div className="w-full bg-gradient-to-t from-yellow-400 to-yellow-100 h-44 rounded-t-3xl shadow-xl border-x-4 border-t-4 border-white flex flex-col items-center justify-center">
              <span className="text-5xl drop-shadow-md">🥇</span>
              <span className="font-black text-yellow-900 text-xl">{topThree[0].points}</span>
            </div>
          </div>
        )}

        {/* المركز الثالث */}
        {topThree[2] && (
          <div className="flex flex-col items-center flex-1">
            <div className="text-[10px] font-black mb-2 text-gray-600 truncate w-full text-center">{topThree[2].name}</div>
            <div className="w-full bg-gradient-to-t from-orange-300 to-orange-50 h-24 rounded-t-2xl shadow-lg border-x-2 border-t-2 border-white flex flex-col items-center justify-center">
              <span className="text-3xl">🥉</span>
              <span className="font-black text-orange-900">{topThree[2].points}</span>
            </div>
          </div>
        )}
      </div>

      {/* باقي الطلاب */}
      <div className="max-w-md mx-auto space-y-3">
        {others.map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-blue-50">
            <div className="flex items-center gap-4">
              <span className="bg-blue-50 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs">{i + 4}</span>
              <span className="font-bold text-gray-700 text-sm">{s.name}</span>
            </div>
            <div className="bg-blue-600 text-white px-3 py-1 rounded-lg font-black text-xs">{s.points} pt</div>
          </div>
        ))}
      </div>
    </div>
  );
}