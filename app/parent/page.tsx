"use client";
import { useState } from "react";

export default function ParentPage() {
  const [emailInput, setEmailInput] = useState("");
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if(!emailInput) return;
    setLoading(true);
    try {
      const res = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv&t=${Date.now()}`);
      const data = await res.text();
      const rows = data.split(/\r?\n/).map(row => row.split(","));
      const headers = rows[0].map(h => h.replace(/"/g, "").trim());
      
      const emailIdx = headers.findIndex(h => h.includes("إيميل") || h.includes("Email") || h.includes("G"));
      const quizIdx = headers.findIndex(h => h.includes("كويز") || h.includes("Quiz"));
      const lessonIdx = headers.findIndex(h => h.includes("دروس") || h.includes("Lesson"));

      const found = rows.find(r => r[emailIdx]?.replace(/"/g, "").trim().toLowerCase() === emailInput.trim().toLowerCase());

      if (found) {
        setReport({
          name: found[0].replace(/"/g, ""),
          quiz: found[quizIdx]?.replace(/"/g, "") || "0",
          lessons: found[lessonIdx]?.replace(/"/g, "") || "0"
        });
      } else { alert("الإيميل غير مسجل في عمود الإيميلات"); }
    } catch (e) { alert("حدث خطأ في الاتصال"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 flex items-center justify-center font-sans" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 shadow-2xl">
        <h2 className="text-xl font-black text-center text-gray-800 mb-6">تقرير مستوى الطالب 📝</h2>
        <input 
          onChange={(e) => setEmailInput(e.target.value)}
          placeholder="ادخل إيميل الطالب (مثل: ah@440)" 
          className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 mb-4 text-center font-bold outline-none focus:border-blue-500"
        />
        <button onClick={check} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black transition-transform active:scale-95 shadow-lg">
          {loading ? "جاري البحث..." : "استلام التقرير"}
        </button>

        {report && (
          <div className="mt-8 p-6 bg-blue-50 rounded-3xl border border-blue-100 animate-in fade-in zoom-in duration-300">
            <p className="text-center font-black text-blue-900 text-lg mb-4">{report.name}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl text-center shadow-sm">
                <p className="text-[10px] text-gray-400 font-bold uppercase">درجة الكويز</p>
                <p className="text-xl font-black text-green-600">{report.quiz}%</p>
              </div>
              <div className="bg-white p-4 rounded-2xl text-center shadow-sm">
                <p className="text-[10px] text-gray-400 font-bold uppercase">الدروس</p>
                <p className="text-xl font-black text-blue-600">{report.lessons}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}