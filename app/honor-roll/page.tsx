"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HonorRollPage() {
  const router = useRouter();
  const [stars, setStars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // تم تحديث الـ gid بالرقم الذي زودتني به لضمان ربط ورقة لوحة الشرف
  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?gid=1187405641&output=csv";

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const res = await fetch(SHEET_CSV_URL);
        const data = await res.text();
        const rows = data.split("\n").map(row => row.split(","));
        
        const formattedStars = rows.slice(1).map(r => ({
          name: r[0]?.replace(/"/g, '').trim(),
          grade: r[1]?.replace(/"/g, '').trim(),
          title: r[2]?.replace(/"/g, '').trim(),
          imageUrl: r[3]?.replace(/"/g, '').trim()
        })).filter(i => i.name && i.name.length > 1);

        setStars(formattedStars);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    };
    fetchStars();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20" dir="rtl">
      {/* هيدر ذهبي ملكي */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 pt-10 pb-20 px-6 rounded-b-[3.5rem] shadow-xl relative overflow-hidden text-right">
        <button 
          onClick={() => router.back()} 
          className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold text-sm mb-6 relative z-10 transition-all active:scale-95"
        >
          🔙 رجوع
        </button>
        <div className="relative z-10 text-white text-center">
             <h1 className="text-3xl font-black mb-2 tracking-tight">أبطال الأسبوع 👑</h1>
             <p className="opacity-90 font-medium text-sm">Ghanem Academy Stars</p>
        </div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-8 space-y-6">
        {loading ? (
          <div className="text-center py-10 font-bold text-orange-600 animate-pulse">جاري تحضير الأبطال... 🏆</div>
        ) : stars.length > 0 ? (
          stars.map((star, idx) => (
            <div key={idx} className="bg-white p-5 rounded-[2.5rem] shadow-md border border-orange-50 flex items-center gap-5 relative overflow-hidden transition-all hover:shadow-lg">
              
              {/* عرض الصورة */}
              <div className="w-20 h-20 rounded-full border-4 border-yellow-400 overflow-hidden flex-shrink-0 shadow-lg bg-gray-100 relative">
                {star.imageUrl && star.imageUrl.includes('http') ? (
                  <img 
                    src={star.imageUrl} 
                    alt={star.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl bg-orange-50">👤</div>
                )}
              </div>
              
              <div className="flex-1 text-right">
                <h3 className="font-black text-gray-800 text-lg leading-tight mb-1">{star.name}</h3>
                <p className="text-blue-600 text-xs font-bold mb-2">{star.grade}</p>
                <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-black inline-block border border-yellow-200">
                  {star.title}
                </div>
              </div>

              <div className="absolute left-2 -bottom-2 opacity-5 text-6xl font-black">🏆</div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 px-10">
            <p className="text-gray-400 font-bold text-sm leading-relaxed">
              تأكد من إضافة الأسماء في ورقة HonorRoll داخل جوجل شيت.
            </p>
          </div>
        )}
      </div>

      <footer className="mt-10 text-center text-gray-300 text-[10px] font-bold">Ghanem Academy • 2026</footer>
    </div>
  );
}