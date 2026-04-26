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
    const myEmail = "mhmedghanem225@gmail.com"; // 👈 اكتب إيميلك هنا بدقة

    if (userData.email.trim().toLowerCase() !== myEmail.trim().toLowerCase()) { 
      router.replace("/profile"); 
      return; 
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const sheetURL = `https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv&t=${Date.now()}`;
      const res = await fetch(sheetURL);
      const csvText = await res.text();
      
      // تقسيم الأسطر مع تنظيفها
      const rows = csvText.split(/\r?\n/).map(row => row.split(",")).filter(row => row.length > 1);
      
      // تخطي الصف الأول (العناوين) ومعالجة الباقي
      const dataRows = rows.slice(1).map(col => ({
        name: col[0]?.replace(/"/g, "").trim() || "---",
        quizScore: col[4]?.replace(/"/g, "").trim() || "0",     // E
        completedCount: col[5]?.replace(/"/g, "").trim() || "0", // F
        email: col[6]?.replace(/"/g, "").trim() || "لا يوجد"    // G
      }));

      setStudents(dataRows);
    } catch (e) {
      console.error("Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4" dir="rtl">
      <h1 className="text-xl font-black text-center mb-6 text-blue-800">لوحة المتابعة 📊</h1>
      {loading ? (
        <p className="text-center animate-pulse">جاري التحميل...</p>
      ) : (
        <div className="overflow-x-auto shadow-xl rounded-2xl border">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4">الطالب</th>
                <th className="p-4 text-center">كويز (E)</th>
                <th className="p-4 text-center">دروس (F)</th>
                <th className="p-4 text-center">إيميل (G)</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i} className="border-b hover:bg-blue-50">
                  <td className="p-4 font-bold">{s.name}</td>
                  <td className="p-4 text-center text-green-600 font-black">{s.quizScore}%</td>
                  <td className="p-4 text-center text-blue-600">{s.completedCount}</td>
                  <td className="p-4 text-center text-gray-400 text-[10px]">{s.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}