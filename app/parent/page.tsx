"use client";
import { useState } from "react";

export default function ParentPage() {
  const [email, setEmail] = useState("");
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkProgress = async () => {
    if(!email) return;
    setLoading(true);
    try {
      const res = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv&t=${Date.now()}`);
      const data = await res.text();
      const rows = data.split(/\r?\n/).map(r => r.split(","));
      
      // بنجرب نبحث في العمود رقم 6 (اللي هو G)
      const student = rows.find(r => r[6] && r[6].trim().toLowerCase() === email.trim().toLowerCase());

      if (student) {
        setReport({
          name: student[0],
          quizScore: student[4] || "0", // E
          completedCount: student[5] || "0" // F
        });
      } else {
        alert("لم يتم العثور على طالب بهذا الإيميل في العمود G");
      }
    } catch (e) { alert("خطأ في الاتصال"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-right" dir="rtl">
      <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-xl font-black text-center mb-6">متابعة الطالب 📈</h2>
        <input 
          type="email" 
          placeholder="إيميل الطالب المسجل" 
          className="w-full p-4 rounded-xl border mb-4 text-center"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={checkProgress} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">
          {loading ? "جاري البحث..." : "عرض التقرير"}
        </button>

        {report && (
          <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
            <p className="text-center font-black text-blue-900 mb-4">{report.name}</p>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <p className="text-xs text-gray-400">الكويز</p>
                <p className="font-bold text-green-600">{report.quizScore}%</p>
              </div>
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <p className="text-xs text-gray-400">الدروس</p>
                <p className="font-bold text-blue-600">{report.completedCount}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}