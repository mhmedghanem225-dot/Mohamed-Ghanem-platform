"use client";
import { useState } from "react";

export default function AdminDashboard() {
  const [pass, setPass] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const login = async () => {
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
      // الرابط ده بيسحب أول ورقة ظاهرة في الشيت (Sheet1)
      const res = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv&t=${Date.now()}`);
      const data = await res.text();
      const rows = data.split(/\r?\n/).map(row => row.split(","));
      
      const parsed = rows.slice(1).filter(r => r[0]).map(r => ({
        name: r[0]?.replace(/"/g, ""),
        quiz: r[4]?.replace(/"/g, "") || "0", // العمود E
        lessons: r[5]?.replace(/"/g, "") || "0", // العمود F
        email: r[6]?.replace(/"/g, "") || "---" // العمود G
      }));
      setStudents(parsed);
    } catch (e) { alert("حدث خطأ في جلب البيانات"); }
    setLoading(false);
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100" dir="rtl">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center">
          <h2 className="mb-4 font-black">دخول المستر 👨‍🏫</h2>
          <input type="password" onChange={(e)=>setPass(e.target.value)} className="border p-3 rounded-xl mb-4 block w-full text-center" placeholder="كلمة السر" />
          <button onClick={login} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold w-full">دخول</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen" dir="rtl">
      <h1 className="text-center font-black text-xl mb-6">لوحة متابعة الطلاب 📊</h1>
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4">الطالب</th>
              <th className="p-4 text-center">كويز</th>
              <th className="p-4 text-center">دروس</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={i} className="border-b">
                <td className="p-4 font-bold">{s.name}</td>
                <td className="p-4 text-center text-green-600">{s.quiz}%</td>
                <td className="p-4 text-center text-blue-600">{s.lessons}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}