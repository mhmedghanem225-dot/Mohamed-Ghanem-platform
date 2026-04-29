"use client";
import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz9s8OAoeb8BWZe54jf5BGPvGXDcCtWbOZfsZ9DFCVEZH8fJTLe16UvAn7jBIAXn-mjSg/exec";

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await fetch(`${SCRIPT_URL}?action=getLeaders&t=${Date.now()}`);
        const data = await response.json();
        if (data.status === "success") {
          setLeaders(data.users.sort((a: any, b: any) => b.points - a.points));
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchLeaders();
  }, []);

  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const topThree = leaders.slice(0, 3);
  const others = leaders.slice(3);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-blue-600 animate-pulse">جاري تجهيز الأبطال... 🏆</div>;

  return (
    <div className="min-h-screen bg-[#F0F7FF] pb-24 text-right px-4" dir="rtl">
      <div className="bg-white p-6 rounded-b-[3rem] shadow-sm mb-12 text-center border-b-4 border-blue-100 -mx-4">
        <h1 className="text-3xl font-black text-gray-800">أبطال غانم أكاديمي 👑</h1>
      </div>

      <div className="flex justify-center items-end gap-3 mb-16 h-72 max-w-sm mx-auto">
        {/* المركز الثاني */}
        {topThree[1] && (
          <div className="flex flex-col items-center flex-1">
            <img src={topThree[1].photo || defaultAvatar} className="w-14 h-14 rounded-full border-4 border-gray-300 shadow-md mb-2 object-cover" />
            <div className="text-[10px] font-black mb-1 text-gray-600 truncate w-full text-center">{topThree[1].name}</div>
            <div className="w-full bg-gradient-to-t from-gray-300 to-gray-50 h-28 rounded-t-2xl shadow-lg flex flex-col items-center justify-center">
              <span className="text-2xl">🥈</span>
              <span className="font-black text-gray-700">{topThree[1].points}</span>
            </div>
          </div>
        )}

        {/* المركز الأول */}
        {topThree[0] && (
          <div className="flex flex-col items-center flex-1 -mt-14">
            <div className="relative">
              <img src={topThree[0].photo || defaultAvatar} className="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-xl mb-2 object-cover" />
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl animate-bounce">👑</span>
            </div>
            <div className="text-xs font-black mb-1 text-blue-900 truncate w-full text-center">{topThree[0].name}</div>
            <div className="w-full bg-gradient-to-t from-yellow-400 to-yellow-100 h-40 rounded-t-3xl shadow-xl flex flex-col items-center justify-center border-x-2 border-white">
              <span className="text-4xl">🥇</span>
              <span className="font-black text-yellow-900 text-xl">{topThree[0].points}</span>
            </div>
          </div>
        )}

        {/* المركز الثالث */}
        {topThree[2] && (
          <div className="flex flex-col items-center flex-1">
            <img src={topThree[2].photo || defaultAvatar} className="w-14 h-14 rounded-full border-4 border-orange-400 shadow-md mb-2 object-cover" />
            <div className="text-[10px] font-black mb-1 text-gray-600 truncate w-full text-center">{topThree[2].name}</div>
            <div className="w-full bg-gradient-to-t from-orange-300 to-orange-50 h-20 rounded-t-2xl shadow-lg flex flex-col items-center justify-center">
              <span className="text-2xl">🥉</span>
              <span className="font-black text-orange-900">{topThree[2].points}</span>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-md mx-auto space-y-3">
        {others.map((s, i) => (
          <div key={i} className="bg-white p-3 rounded-2xl flex items-center justify-between shadow-sm border border-blue-50">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 font-black text-xs w-5">{i + 4}</span>
              <img src={s.photo || defaultAvatar} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
              <span className="font-bold text-gray-700 text-sm">{s.name}</span>
            </div>
            <div className="text-blue-600 font-black text-xs">{s.points} pts</div>
          </div>
        ))}
      </div>
    </div>
  );
}