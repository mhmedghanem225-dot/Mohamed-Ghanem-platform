"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv&t=${Date.now()}`);
        const data = await res.text();
        const rows = data.split("\n").map(row => row.split(","));
        
        const leaderData = rows.slice(1)
          .map(r => ({ name: r[5]?.trim(), points: parseInt(r[7]?.trim() || "0") }))
          .filter(s => s.name)
          .sort((a, b) => b.points - a.points)
          .slice(0, 10);

        setStudents(leaderData);
        setLoading(false);
      } catch (e) { setLoading(false); }
    };
    fetchLeaders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-right pb-32" dir="rtl">
      <h1 className="text-2xl font-black text-gray-900 mb-6 text-center">Honor Roll 👑</h1>
      
      <div className="max-w-md mx-auto space-y-3">
        {loading ? (
          <div className="text-center font-bold text-blue-600 animate-pulse py-10">Loading Leaders...</div>
        ) : (
          students.map((student, idx) => (
            <div key={idx} className={`bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border ${idx === 0 ? 'border-yellow-300 ring-2 ring-yellow-100' : 'border-gray-100'}`}>
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${idx === 0 ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {idx + 1}
                </span>
                <span className="font-bold text-gray-800">{student.name}</span>
              </div>
              <span className="font-black text-blue-600">{student.points} pt</span>
            </div>
          ))
        )}
      </div>

      {/* Unified Compact Navigation Bar */}
      <div className="fixed bottom-5 left-10 right-10 bg-white/95 backdrop-blur-md p-2 rounded-[2rem] shadow-2xl border border-gray-100 flex justify-around items-center z-50">
        <button onClick={() => router.push('/profile')} className="flex flex-col items-center gap-0.5 p-1 active:scale-75 transition-all">
          <span className="text-xl opacity-60">👤</span>
          <span className="text-[9px] font-black text-gray-400">Profile</span>
        </button>

        <button onClick={() => router.push('/lessons')} className="flex flex-col items-center gap-0.5 p-1 active:scale-75 transition-all">
          <span className="text-xl opacity-60">📖</span>
          <span className="text-[9px] font-black text-gray-400">Lessons</span>
        </button>

        <button className="flex flex-col items-center gap-0.5 p-1">
          <div className="bg-[#1D63ED] text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg -mt-8 border-[3px] border-gray-50 transition-all">
            <span className="text-xl">👑</span>
          </div>
          <span className="text-[9px] font-black text-[#1D63ED]">Leaders</span>
        </button>
      </div>
    </div>
  );
}