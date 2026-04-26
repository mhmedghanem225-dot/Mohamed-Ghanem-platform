"use client";
import { useState } from "react";

export default function ParentPage() {
  const [input, setInput] = useState("");
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if(!input) return;
    setLoading(true);
    try {
      const res = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv&t=${Date.now()}`);
      const text = await res.text();
      const rows = text.split(/\r?\n/).map(row => row.split(","));
      
      // البحث في العمود رقم 6 (G) مع تنظيف المسافات وعلامات التنصيص
      const found = rows.find(r => 
        r[6] && r[6].replace(/"/g, "").trim().toLowerCase() === input.trim().toLowerCase()
      );

      if (found) {
        setReport({
          name: found[0].replace(/"/g, ""),
          quiz: found[4] || "0",
          lessons: found[5] || "0"
        });
      } else {
        alert("لم يتم العثory على هذا الإيميل في سجلاتنا");
      }
    } catch (e) { alert("حدث خطأ"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 text-right font-sans" dir="rtl">
      <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-xl font-black text-center mb-6">تقرير مستوى الطالب 📝</h2>
        <input 
          onChange={(e) => setInput(e.target.value)}
          placeholder="ادخل إيميل الطالب بدقة" 
          className="w-full p-4 rounded-xl border mb-4 text-center font-bold"
        />
        <button onClick={check} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">
          {loading ? "جاري البحث..." : "استلام التقرير"}
        </button>

        {report && (
          <div className="mt-6 p-6 bg-gray-50 rounded-2xl border border-dashed border-blue-200">
            <p className="text-center font-black text-blue-800 text-lg mb-4">{report.name}</p>
            <div className="flex justify-around">
              <div className="text-center">
                <p className="text-xs text-gray-400">الكويز</p>
                <p className="text-xl font-black text-green-600">{report.quiz}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">الدروس</p>
                <p className="text-xl font-black text-blue-600">{report.lessons}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}