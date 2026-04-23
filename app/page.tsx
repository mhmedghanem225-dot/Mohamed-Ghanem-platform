"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function HomePage() {
  const [nameInput, setNameInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const STUDENTS_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?gid=643200738&single=true&output=csv";

  useEffect(() => {
    const savedSession = localStorage.getItem("ghanem_session");
    if (savedSession) {
      const user = JSON.parse(savedSession);
      window.location.href = `/lessons?grade=${encodeURIComponent(user.grade)}`;
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("جاري التحقق من الاشتراك...");
    try {
      const response = await fetch(STUDENTS_SHEET_URL);
      const csvData = await response.text();
      const rows = csvData.split("\n").slice(1);
      const students = rows.map(row => {
        const columns = row.split(",");
        return {
          name: columns[0]?.trim(),
          pass: columns[1]?.trim(),
          expiry: columns[2]?.trim(),
          grade: columns[3]?.trim(),
          savedDeviceId: columns[4]?.trim()
        };
      });
      const foundStudent = students.find(s => s.name === nameInput && s.pass === passInput);
      if (!foundStudent) { setError("اسم الطالب أو كلمة المرور غير صحيحة"); return; }
      if (new Date(foundStudent.expiry) < new Date()) { setError("انتهى اشتراكك.. تواصل مع مستر محمد"); return; }
      localStorage.setItem("ghanem_session", JSON.stringify(foundStudent));
      window.location.href = `/lessons?grade=${encodeURIComponent(foundStudent.grade)}`;
    } catch (err) { setError("تأكد من اتصالك بالإنترنت"); }
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm bg-white/80 backdrop-blur-md rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 border border-white/20 text-center">
        <div className="relative w-32 h-32 mx-auto mb-6 bg-white rounded-full p-1 shadow-inner border-4 border-dashed border-blue-100">
          <Image src="/logo.png" alt="Logo" fill className="rounded-full object-contain p-2" priority />
        </div>
        
        <h1 className="text-3xl font-black text-blue-900 mb-2">Ghanem Academy</h1>
        <p className="text-blue-500 font-bold mb-8">تعلم الإنجليزية بذكاء ✨</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <input 
              type="text" placeholder="اسمك بالكامل"
              className="w-full p-4 pr-12 rounded-2xl bg-blue-50/50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none text-black transition-all"
              value={nameInput} onChange={(e) => setNameInput(e.target.value)}
            />
            <span className="absolute right-4 top-4">👤</span>
          </div>
          <div className="relative">
            <input 
              type="password" placeholder="كلمة المرور"
              className="w-full p-4 pr-12 rounded-2xl bg-blue-50/50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none text-black transition-all"
              value={passInput} onChange={(e) => setPassInput(e.target.value)}
            />
            <span className="absolute right-4 top-4">🔒</span>
          </div>

          {error && <div className="p-3 rounded-xl bg-red-50 text-red-500 text-sm font-bold">{error}</div>}

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-2xl font-black text-xl shadow-lg shadow-blue-200 transition-all active:scale-95">
            دخول للمنصة
          </button>
        </form>

        <p className="mt-8 text-gray-400 text-xs font-medium">جميع الحقوق محفوظة © مستر محمد غانم</p>
      </div>
    </div>
  );
}