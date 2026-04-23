"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HonorRollPage() {
  const router = useRouter();
  const [stars, setStars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // نفس رابط الشيت بتاعك (تأكد أنه نفس الرابط المستخدم في الدروس)
  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?gid=1384724522&output=csv"; 
  // ملاحظة: الـ gid ده لازم يكون الخاص بورقة HonorRoll (هقولك تجيبه ازاي)

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const res = await fetch(SHEET_CSV_URL);
        const data = await res.text();
        const rows = data.split("\n").map(row => row.split(","));
        // قراءة البيانات من الشيت
        const formattedStars = rows.slice(1).map(r => ({
          name: r[0]?.trim(),
          grade: r[1]?.trim(),
          title: r[2]?.trim()
        })).filter(i => i.name); // تجاهل الصفوف الفاضية

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
      <div className="bg-gradient-to-r from-yellow-500 to-amber-600 pt-10 pb-20 px-6 rounded-b-[3.5rem] shadow-xl relative overflow-hidden text-right">
        <button onClick={() => router.back()} className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold text-sm mb-6 relative z-10 transition-all">🔙 رجوع</button>
        <div className="relative z-10 text-white">
          <h1 className="text-3xl font-black mb-2">لوحة الشرف 👑</h1>
          <p className="opacity-90 font-medium text-sm">أبطال Ghanem Academy المتميزين</p>
        </div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6 space-y-4">
        {loading ? (
          <div className="text-center py-10 font-bold text-yellow-600 animate-pulse">جاري البحث عن الأبطال... 🏆</div>
        ) : stars.length > 0 ? (
          stars.map((star, idx) => (
            <div key={idx} className="bg-white p-5 rounded-[2.5rem] shadow-sm border-2 border-yellow-100 flex items-center gap-5 relative overflow-hidden transition-all hover:scale-[1.02]">
              <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center text-4xl shadow-inner border-2 border-white">👤</div>
              <div className="flex-1 text-right">
                <h3 className="font-bold text-gray-800 text-lg leading-tight">{star.name}</h3>
                <p className="text-yellow-600 text-xs font-bold mt-1">{star.grade}</p>
                <div className="mt-2 inline-block bg-yellow-50 text-yellow-700 px-3 py-1 rounded-lg text-[10px] font-black border border-yellow-100">{star.title}</div>
              </div>
              <div className="absolute left-4 bottom-2 opacity-5 text-5xl font-black">🏆</div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-white rounded-[2rem] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold text-sm italic">لوحة الشرف جاهزة لاستقبال أول بطل.. ضف أسماء في الشيت!</p>
          </div>
        )}
      </div>
      <footer className="mt-10 text-center text-gray-300 text-[10px] font-bold">Ghanem Academy ✨</footer>
    </div>
  );
}