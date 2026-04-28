"use client";

import React, { useEffect, useState } from "react";

export default function LessonsPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const syncLessonsData = async () => {
      const session = localStorage.getItem("ghanem_session");
      if (!session) return;
      
      const localData = JSON.parse(session);
      setUser(localData); // عرض البيانات القديمة مؤقتاً لسرعة التحميل

      try {
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyCKjdNlxqbK8GKv3kHIH_CHFVG7xqDbycz4uEWq8Ar/exec";
        const response = await fetch(`${SCRIPT_URL}?email=${encodeURIComponent(localData.name || localData.Name)}`);
        const freshData = await response.json();

        if (freshData.status === "success") {
          localStorage.setItem("ghanem_session", JSON.stringify(freshData.user));
          setUser(freshData.user); // تحديث الواجهة بالنقاط الحقيقية من الشيت
        }
      } catch (err) {
        console.error("Lessons sync error:", err);
      }
    };

    syncLessonsData();
  }, []);

  return (
    <main className="bg-white min-h-screen">
      {/* --- ضع كود عرض الدروس الخاص بك هنا --- */}
      {/* تأكد من استخدام {user?.points} لعرض النقاط */}
      <div className="p-4 border-b flex justify-between items-center">
         <span className="font-bold">مرحباً: {user?.name || user?.Name}</span>
         <span className="bg-yellow-400 px-3 py-1 rounded-full text-sm">
           نقاطك: {user?.points || 0}
         </span>
      </div>
      
      <div className="grid gap-6 p-6">
         {/* قائمة الدروس الخاصة بك */}
      </div>
      {/* --- نهاية التصميم --- */}
    </main>
  );
}