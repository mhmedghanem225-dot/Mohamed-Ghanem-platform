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
      console.log("Access Denied for:", userData.email);
      router.replace("/profile"); 
      return; 
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const res = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv&t=${Date.now()}`);
      const data = await res.text();
      const rows = data.split(/\r?\n/).filter(row => row.trim() !== "");
      
      const parsedStudents = rows.slice(1).map(row => {
        const columns = row.split(",");
        return {
          name: columns[0] || "بدون اسم",
          quizScore: columns[4] || "0",     // عمود E
          completedCount: columns[5] || "0", // عمود F
          email: columns[6] || "لا يوجد"    // عمود G
        };
      });

      setStudents(parsedStudents);
      setLoading(false);
    } catch (e) { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <h1 className="text-2xl font-black text-center mb-6 text-blue-900">لوحة تحكم المستر 👨‍🏫</h1>
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4">الطالب</th>
              <th className="p-4">الكويز (E)</th>
              <th className="p-4">الدروس (F)</th>
              <th className="p-4">الإيميل (G)</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={i} className="border-b">
                <td className="p-4 font-bold">{s.name}</td>
                <td className="p-4 text-green-600 font-bold">{s.quizScore}%</td>
                <td className="p-4 text-blue-600">{s.completedCount}</td>
                <td className="p-4 text-gray-400 text-xs">{s.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}