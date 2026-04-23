"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function HonorRollPage() {
  const router = useRouter();
  const [stars, setStars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // رابط الشيت مع رقم الـ gid الصحيح لورقة HonorRoll
  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?gid=1187405641&output=csv";

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const res = await fetch(SHEET_CSV_URL);
        const data = await res.text();
        // تقسيم الأسطر مع معالجة الفواصل بشكل أدق
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
      {/* هيدر ذهبي */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 pt-10 pb-20 px-6 rounded-b-[3.5rem] shadow-xl relative overflow-hidden text-right">
        <button onClick={() => router.back()} className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold text-sm mb-6 relative z-10 transition-all active:scale-95">🔙 رجوع</button>
        <div className="relative z-10 text-white">
          <div className="flex items-center gap-3 mb-2">
             <span className="text-4xl">👑</span>
             <h1 className="text-3xl font-black">لوحة الشرف</h1>
          </div>
          <p className="opacity-90 font-medium text-sm mr-12">أبطال Ghanem Academy المتميزين</p>
        </div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* قائمة الأبطال بتنسيق منظم */}
      <div className="max-w-md mx-auto px-4 mt-8 space-y-6">
        {loading ? (
          <div className="text-center py-10 font-bold text-orange-600 animate-pulse">جاري البحث عن الأبطال... 🏆</div>
        ) : stars.length > 0 ? (
          stars.map((star, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[2.5rem] shadow-md border border-orange-50 flex items-center gap-6 relative overflow-hidden transition-all hover:shadow-xl">
              
              {/* الصورة الدائرية */}
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center shadow-inner border-4 border-white overflow-hidden flex-shrink-0 relative z-10">
                {star.imageUrl && star.imageUrl.startsWith('http') ? (
                  <Image src={star.imageUrl} alt={star.name} width={80} height={80} className="w-full h-full object-cover" unoptimized />
                ) : (
                  <span className="text-4xl opacity-50">👤</span>
                )}
              </div>
              
              {/* النصوص المنسقة */}
              <div className="flex-1 text-right relative z-10">
                <h3 className="font-black text-gray-800 text-xl mb-1">{star.name}</h3>
                <p className="text-blue-600 text-xs font-bold mb-2">{star.grade}</p>
                <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[10px] font-black inline-block border border-orange-200">
                  {star.title}
                </div>
              </div>

              {/* كأس خلفية خفيفة */}
              <div className="absolute left-2 -bottom-2 opacity-10 text-7xl font-black grayscale">🏆</div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 px-10">
            <p className="text-gray-400 font-bold text-sm leading-relaxed">تأكد من كتابة الأسماء في صفحة HonorRoll داخل ملف جوجل شيت</p>
          </div>
        )}
      </div>

      <footer className="mt-10 text-center text-gray-300 text-[10px] font-bold">Ghanem Academy • 2026</footer>
    </div>
  );
}