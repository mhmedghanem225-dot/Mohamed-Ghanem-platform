"use client"; // ضروري لأننا سنستخدم بيانات المستخدم المتغيرة

import { useUser } from "../context/UserContext"; // استدعاء الذاكرة التي أنشأتها
import Link from "next/link";

export default function Navbar() {//
  const { user, logout } = useUser(); // أخذ اسم المستخدم ووظيفة الخروج من الذاكرة

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-8 flex justify-between items-center">
      {/* شعار المنصة */}
      <Link href="/" className="text-2xl font-bold text-blue-600">
        أكاديميتي
      </Link>

      {/* جهة اليسار: التحكم في المستخدم */}
      <div className="flex items-center gap-4">
        {user ? (
          // ما يظهر إذا كان المستخدم مسجل دخوله
          <>
            <span className="text-gray-700">أهلاً، <span className="font-bold">{user}</span></span>
            <button 
              onClick={logout}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
            >
              خروج
            </button>
          </>
        ) : (
          // ما يظهر إذا كان المستخدم ضيفاً
          <Link 
            href="/login" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            تسجيل الدخول
          </Link>
        )}
      </div>
    </nav>
  );
}