"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HonorRollPage() {
  const router = useRouter();
  
  // بيانات تجريبية للأبطال - لاحقاً سنربطها بجوجل شيت
  const [stars, setStars] = useState([
    { name: "أحمد محمد", grade: "الصف الخامس", title: "بطل الأسبوع 🏆" },
    { name: "سارة محمود", grade: "الصف الرابع", title: "نجمة القواعد ⭐" },
    { name: "ياسين إبراهيم", grade: "الصف السادس", title: "ملك الفونيكس 🎙️" }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20" dir="rtl">
      {/* هيدر ذهبي ملكي - مع الحفاظ على نفس ستايل الهيدر الأزرق القديم */}
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

      {/* عرض الأبطال بتنسيق الكروت اللي بنحبه */}
      <div className="max-w-md mx-auto px-4 mt-6 space-y-4">
        {stars.map((star, idx) => (
          <div key={idx} className="bg-white p-5 rounded-[2.5rem] shadow-sm border-2 border-yellow-100 flex items-center gap-5 relative overflow-hidden transition-transform hover:scale-[1.02]">
            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center text-4xl shadow-inner border-2 border-white">
              👤
            </div>
            <div className="flex-1 text-right">
              <h3 className="font-bold text-gray-800 text-lg leading-tight">{star.name}</h3>
              <p className="text-yellow-600 text-xs font-bold mt-1">{star.grade}</p>
              <div className="mt-2 inline-block bg-yellow-50 text-yellow-700 px-3 py-1 rounded-lg text-[10px] font-black border border-yellow-100">
                {star.title}
              </div>
            </div>
            {/* أيقونة كأس شفافة في الخلفية لتعطي شكلاً جمالياً */}
            <div className="absolute left-4 bottom-2 opacity-5 text-5xl font-black">🏆</div>
          </div>
        ))}
      </div>

      <footer className="mt-10 text-center text-gray-300 text-[10px] font-bold">
        تُوجوا بالتميز في Ghanem Academy ✨
      </footer>
    </div>
  );
}