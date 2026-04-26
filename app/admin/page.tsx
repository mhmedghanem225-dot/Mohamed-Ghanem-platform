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
    // ⚠️ ضع إيميلك هنا بالضبط كما تسجل به دخول
    if (userData.email !== "mhmedghanem225@gmail.com") { 
      router.replace("/profile"); 
      return; 
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const res = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv&t=${Date.now()}`);
      const data = await res.text();
      const rows = data.split(/\r?\n/).slice(1);
      
      const parsedStudents = rows.map(row => {
        const columns = row.split(",");
        return {
          name: columns[0],          // العمود A
          grade: columns[3],         // العمود D
          quizScore: columns[4] || "0",      // العمود E
          completedCount: columns[5] || "0",  // العمود F
          email: columns[6]          // العمود G (الإيميل للبحث)
        };
      }).filter(s => s.name);

      setStudents(parsedStudents);
      setLoading(false);
    } catch (e) { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#1D63ED] p-8 rounded-[2.5rem] mb-6 text-center shadow-lg">
          <h1 className="text-2xl font-black text-white">لوحة تحكم المستر 👨‍🏫</h1>
        </div>
        
        {loading ? (
          <div className="bg-white p-12 rounded-[2rem] text-center font-bold text-blue-600 animate-pulse shadow-sm border border-gray-100">جاري تحميل البيانات...</div>
        ) : (
          <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-gray-50 text-gray-400 text-[9px] uppercase font-black">
                  <tr>
                    <th className="p-5">الطالب</th>
                    <th className="p-5 text-center">الكويز (E)</th>
                    <th className="p-5 text-center">الدروس (F)</th>
                    <th className="p-5 text-center">الإيميل (G)</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {students.map((s, i) => (
                    <tr key={i} className="border-t border-gray-50 hover:bg-blue-50/30 transition-all">
                      <td className="p-5 font-black text-gray-800">{s.name}</td>
                      <td className="p-5 text-center font-black text-green-600">{s.quizScore}%</td>
                      <td className="p-5 text-center text-blue-600 font-bold">{s.completedCount}</td>
                      <td className="p-5 text-center text-[10px] text-gray-400">{s.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}