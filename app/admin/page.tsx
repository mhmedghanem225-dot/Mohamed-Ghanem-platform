"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedSession = localStorage.getItem("ghanem_session");
    if (!savedSession) { router.replace("/"); return; }
    const userData = JSON.parse(savedSession);
    
    // تم تثبيت إيميلك الشخصي هنا
    const myEmail = "mhmedghanem225@gmail.com"; 

    if (userData.email.trim().toLowerCase() !== myEmail.trim().toLowerCase()) { 
      router.replace("/profile"); 
      return; 
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const res = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv&t=${Date.now()}`);
      const data = await res.text();
      const rows = data.split(/\r?\n/).map(row => row.split(","));
      const headers = rows[0].map(h => h.replace(/"/g, "").trim());

      // البحث عن أرقام الأعمدة بناءً على العناوين في الشيت
      const quizIdx = headers.findIndex(h => h.includes("كويز") || h.includes("Quiz") || h.includes("E"));
      const lessonIdx = headers.findIndex(h => h.includes("دروس") || h.includes("Lesson") || h.includes("F"));
      const emailIdx = headers.findIndex(h => h.includes("إيميل") || h.includes("Email") || h.includes("G"));

      const parsed = rows.slice(1).filter(r => r[0]).map(r => ({
        name: r[0]?.replace(/"/g, "") || "---",
        quiz: r[quizIdx]?.replace(/"/g, "") || "0",
        lesson: r[lessonIdx]?.replace(/"/g, "") || "0",
        email: r[emailIdx]?.replace(/"/g, "") || "---"
      }));

      setStudents(parsed);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden border">
        <div className="bg-[#1D63ED] p-6 text-white text-center">
          <h1 className="text-xl font-black">لوحة المتابعة الشاملة 📈</h1>
          <p className="text-[10px] opacity-80 mt-1">مرحباً بك يا مستر محمد</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4">اسم الطالب</th>
                <th className="p-4 text-center">الكويز</th>
                <th className="p-4 text-center">الدروس</th>
                <th className="p-4 text-center">الإيميل</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i} className="border-b hover:bg-blue-50/50 transition-colors">
                  <td className="p-4 font-bold text-blue-900">{s.name}</td>
                  <td className="p-4 text-center font-black text-green-600">{s.quiz}%</td>
                  <td className="p-4 text-center font-bold text-indigo-600">{s.lesson}</td>
                  <td className="p-4 text-center text-[10px] text-gray-400 font-mono">{s.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}