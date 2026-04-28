"use client";

import React, { useEffect, useState } from "react";

export default function ProfilePage() {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAndSyncProfile = async () => {
      try {
        const session = localStorage.getItem("ghanem_session");
        if (!session) {
          window.location.href = "/login";
          return;
        }

        const localUser = JSON.parse(session);
        const identifier = localUser.name || localUser.Name;

        // المزامنة الحية مع جوجل شيت
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyCKjdNlxqbK8GKv3kHIH_CHFVG7xqDbycz4uEWq8Ar/exec";
        const res = await fetch(`${SCRIPT_URL}?email=${encodeURIComponent(identifier)}`);
        const data = await res.json();

        if (data.status === "success") {
          // تحديث الذاكرة المحلية بالبيانات الجديدة من الشيت
          localStorage.setItem("ghanem_session", JSON.stringify(data.user));
          setStudent(data.user);
        } else {
          setStudent(localUser);
        }
      } catch (e) {
        console.error("Sync error:", e);
      } finally {
        setLoading(false);
      }
    };

    loadAndSyncProfile();
  }, []);

  if (loading) return <div className="text-center mt-10">جاري تحميل بياناتك الحقيقية...</div>;
  if (!student) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- ابدأ وضع تصميمك (UI) هنا كما هو بدون تغيير --- */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow rounded-2xl p-8 text-right border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900">{student.name || student.Name}</h1>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-sm text-blue-600">إجمالي النقاط</p>
              <p className="text-2xl font-bold text-blue-900">{student.points || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <p className="text-sm text-green-600">الدروس المكتملة</p>
              <p className="text-2xl font-bold text-green-900">{student.completedLessons || 0}</p>
            </div>
          </div>
        </div>
      </div>
      {/* --- نهاية التصميم --- */}
    </div>
  );
}