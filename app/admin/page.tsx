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
    const myEmail = "mhmedghanem225@gmail.com"; // 👈 اكتب إيميلك هنا بالظبط

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
      const rows = data.split(/\r?\n/).filter(row => row.trim() !== "");
      
      // نبدأ من i=1 عشان نتخطى صف العناوين
      const parsedStudents = rows.slice(1).map(row => {
        const columns = row.split(",");
        return {
          name: columns[0] || "---",
          quizScore: columns[4] || "0",     // العمود E
          completedCount: columns[5] || "0", // العمود F
          email: columns[6] || "لا يوجد"    // العمود G
        };
      });

      setStudents(parsedStudents);
      setLoading(false);
    } catch (e) { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-black text-center my-8 text-blue-900">لوحة تحكم المستر 👨‍🏫</h1>
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
          <table className="w-full text-right">
            <thead className="bg-blue-600 text-white text-xs uppercase font-bold">
              <tr>
                <th className="p-5">اسم الطالب</th>
                <th className="p-5 text-center">الكويز (E)</th>
                <th className="p-5 text-center">الدروس (F)</th>
                <th className="p-5 text-center">الإيميل (G)</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i} className="border-t border-gray-50 hover:bg-blue-50 transition-colors">
                  <td className="p-5 font-bold text-gray-800">{s.name}</td>
                  <td className="p-5 text-center font-black text-green-600">{s.quizScore}%</td>
                  <td className="p-5 text-center font-bold text-blue-600">{s.completedCount}</td>
                  <td className="p-5 text-center text-[10px] text-gray-400 font-mono">{s.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}