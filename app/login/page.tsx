"use client";

import { useState } from "react";
import { useUser } from "../context/UserContext"; // نستخدم الذاكرة هنا
import { useRouter } from "next/navigation"; // أداة للانتقال بين الصفحات

export default function LoginPage() {
  const [name, setName] = useState("");
  const { login } = useUser();
  const router = useRouter();

  const handleLogin = () => {
    if (name) {
      login(name); // حفظ الاسم في الذاكرة
      router.push("/"); // العودة للصفحة الرئيسية
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6">مرحباً بك في منصتنا</h1>
        <p className="text-gray-500 mb-6">يرجى إدخال اسمك للبدء</p>
        
        <input
          type="text"
          placeholder="ادخل اسمك هنا"
          className="w-full p-3 border rounded-xl mb-4 text-center outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setName(e.target.value)}
        />
        
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
        >
          دخول
        </button>
      </div>
    </div>
  );
}