"use client";
import { useState } from "react";

export default function AdminDashboard() {
  const [pass, setPass] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const login = () => {
    if (pass === "012017") {
      setIsAuth(true);
      fetchData();
    } else {
      alert("كلمة السر خطأ!");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv&t=${Date.now()}`);
      const data = await res.text();
      const rows = data.split(/\r?\n/).map(row => row.split(","));
      
      const parsed = rows.slice(1).filter(r => r[0] && r[0].length > 1).map(r => ({
        name: r[0]?.replace(/"/g, ""),
        grade: r[3]?.replace(/"/g, "") || "---",  // الصف الدراسي
        quiz: r[4]?.replace(/"/g, "") || "0",    // الكويز
        lessons: r[5]?.replace(/"/g, "") || "0" // الدروس
      }));
      setStudents(parsed);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]" dir="rtl">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 text-center max-w-sm w-full mx-4">
          <div className="text-4xl mb-4">👨‍🏫</div>
          <h2 className="text-2xl font-black text-gray-800 mb-6">دخول المستر</h2>
          <input type="password" onChange={(e)=>setPass(e.target.value)} className="w-full border-2 border-gray-100 p-4 rounded-2xl mb-4 text-center font-bold focus:border-blue-500 outline-none transition-all" placeholder="كلمة السر" />
          <button onClick={login} className="w-full bg-[#1D63ED] text-white py-4 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all">دخول النظام</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#F8FAFC] min-h-screen pb-20" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm mb-6 flex items-center justify-center gap-3 border border-gray-100">
          <span className="text-2xl">📊</span>
          <h1 className="text-xl font-black text-gray-800">لوحة متابعة الطلاب</h1>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#1D63ED] text-white font-black text-xs uppercase tracking-wider">
              <tr>
                <th className="p-5">الطالب</th>
                <th className="p-5 text-center">الصف</th>
                <th className="p-5 text-center">كويز</th>
                <th className="p-5 text-center">دروس</th>
              </tr>
            </thead>
            <tbody className="font-bold">
              {students.map((s, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors">
                  <td className="p-5 text-gray-800">{s.name}</td>
                  <td className="p-5 text-center text-gray-500 text-xs">{s.grade}</td>
                  <td className="p-5 text-center text-green-600 font-black">{s.quiz}%</td>
                  <td className="p-5 text-center text-blue-600">{s.lessons}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <div className="p-10 text-center animate-pulse text-blue-600 font-bold">جاري تحديث البيانات...</div>}
        </div>
      </div>
    </div>
  );
}