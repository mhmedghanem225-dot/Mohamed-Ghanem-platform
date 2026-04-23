"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image"; // استيراد مكون الصورة من Next.js

export default function HonorRollPage() {
  const router = useRouter();
  const [stars, setStars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- إعدادات جوجل شيت (تأكد من وضع رابط الشيت الخاص بك هنا) ---
  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv";

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const res = await fetch(SHEET_CSV_URL);
        const data = await res.text();
        const rows = data.split("\n").map(row => row.split(","));
        
        // قراءة البيانات وتضمين رابط الصورة من العمود الرابع (الـ index رقم 3)
        const formattedStars = rows.slice(1).map(r => ({
          name: r[0]?.trim(),
          grade: r[1]?.trim(),
          title: r[2]?.trim(),
          imageUrl: r[3]?.trim() // رابط الصورة من العمود D
        })).filter(i => i.name); // تجاهل الصفوف الفارغة

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
      <div className="bg-gradient-to-r from-yellow-500 to-amber-600 pt-10 pb-20 px-6 rounded-b-[3.5rem] shadow-xl relative overflow-hidden text-right">
        <button 
          onClick={() => router.back()} 
          className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold text-sm mb-6 relative z-10 transition-all active:scale-90"
        >
          🔙 رجوع
        </button>
        
        <div className="relative z-10 text-white">
          <h1 className="text-3xl font-black mb-2">لوحة الشرف 👑</h1>
          <p className="opacity-90 font-medium text-sm">أبطال Ghanem Academy المتميزين</p>
        </div>
        
        {/* تأثيرات جمالية */}
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
      </div>

      {/* عرض الأبطال بتنسيق الكروت */}
      <div className="max-w-md mx-auto px-4 mt-6 space-y-4">
        {loading ? (
          <div className="text-center py-10 font-bold text-yellow-600 animate-pulse">جاري البحث عن الأبطال... 🏆</div>
        ) : stars.length > 0 ? (
          stars.map((star, idx) => (
            <div key={idx} className="bg-white p-5 rounded-[2.5rem] shadow-sm border-2 border-yellow-100 flex items-center gap-5 relative overflow-hidden transition-transform hover:scale-[1.02]">
              
              {/* --- جزء الصورة المعدل --- */}
              <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center shadow-inner border-2 border-white overflow-hidden flex-shrink-0">
                {star.imageUrl ? (
                  // إذا وجد رابط صورة، قم بعرضها
                  <Image 
                    src={star.imageUrl} 
                    alt={star.name} 
                    width={80} 
                    height={80} 
                    className="w-full h-full object-cover"
                    unoptimized // يسمح بتحميل الصور من روابط خارجية
                  />
                ) : (
                  // إذا لم يوجد رابط، اعرض الرمز الافتراضي
                  <div className="text-4xl">👤</div>
                )}
              </div>
              
              <div className="flex-1 text-right">
                <h3 className="font-bold text-gray-800 text-lg leading-tight">{star.name}</h3>
                <p className="text-yellow-600 text-xs font-bold mt-1">{star.grade}</p>
                <div className="mt-2 inline-block bg-yellow-50 text-yellow-700 px-3 py-1 rounded-lg text-[10px] font-black border border-yellow-100">
                  {star.title}
                </div>
              </div>
              {/* أيقونة كأس شفافة في الخلفية */}
              <div className="absolute left-4 bottom-2 opacity-5 text-5xl font-black">🏆</div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-white rounded-[2rem] border-2 border-dashed border-gray-200 px-6">
            <p className="text-gray-400 font-bold text-sm italic">لوحة الشرف جاهزة لاستقبال أول بطل.. ضف أسماء وصور في الشيت!</p>
          </div>
        )}
      </div>

      <footer className="mt-10 text-center text-gray-300 text-[10px] font-bold">
        تُوجوا بالتميز في Ghanem Academy ✨
      </footer>
    </div>
  );
}