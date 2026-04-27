"use client";
import { useState } from "react";

export default function ParentPage() {
  const [email, setEmail] = useState("");
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?gid=643200738&single=true&output=csv&t=${Date.now()}`;

  const check = async () => {
    if(!email) return;
    setLoading(true);
    try {
      const res = await fetch(SHEET_CSV_URL);
      const data = await res.text();
      const rows = data.split(/\r?\n/).map(row => row.split(","));
      
      const found = rows.find(r => 
        r[6] && r[6].replace(/"/g, "").trim().toLowerCase() === email.trim().toLowerCase()
      );

      if (found) {
        setReport({
          name: found[0].replace(/"/g, ""),
          grade: found[3].replace(/"/g, ""),
          quiz: found[4]?.replace(/"/g, "") || "0",
          lessons: found[5]?.replace(/"/g, "") || "0"
        });
      } else {
        alert("لم يتم العثور على الإيميل في صفحة الطلاب.");
      }
    } catch (e) { alert("خطأ في الاتصال"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 flex items-center justify-center font-sans" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 shadow-2xl border border-gray-50">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">📝</div>
          <h2 className="text-xl font-black text-gray-800">تقرير مستوى الطالب</h2>
        </div>
        <input onChange={(e)=>setEmail(e.target.value)} placeholder="ادخل إيميل الطالب" className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 mb-4 text-center font-bold outline-none transition-all" />
        <button onClick={check} className="w-full bg-[#1D63ED] text-white py-4 rounded-2xl font-black shadow-lg">
          {loading ? "جاري البحث..." : "استلام التقرير"}
        </button>
        {report && (
          <div className="mt-8 p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100 animate-in fade-in zoom-in duration-300">
            <p className="text-center font-black text-blue-900 text-lg mb-2">{report.name}</p>
            <p className="text-center text-[10px] text-blue-400 font-bold mb-6">{report.grade}</p>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <p className="text-[9px] text-gray-400 font-black mb-1 text-center">الكويز</p>
                <p className="text-xl font-black text-green-600">{report.quiz}%</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <p className="text-[9px] text-gray-400 font-black mb-1 text-center">الدروس</p>
                <p className="text-xl font-black text-blue-600">{report.lessons}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}