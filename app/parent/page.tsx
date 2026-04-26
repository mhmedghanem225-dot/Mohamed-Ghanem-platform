"use client";
import { useState } from "react";

export default function ParentPage() {
  const [email, setEmail] = useState("");
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if(!email) return;
    setLoading(true);
    try {
      const res = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv&t=${Date.now()}`);
      const data = await res.text();
      const rows = data.split(/\r?\n/).map(row => row.split(","));
      
      // البحث في العمود G (رقم 6) مع تنظيف البيانات تماماً
      const found = rows.find(r => 
        r[6] && r[6].replace(/"/g, "").trim().toLowerCase() === email.trim().toLowerCase()
      );

      if (found) {
        setReport({
          name: found[0].replace(/"/g, ""),
          quiz: found[4]?.replace(/"/g, "") || "0",
          lessons: found[5]?.replace(/"/g, "") || "0"
        });
      } else {
        alert("لم يتم العثور على الإيميل. تأكد من وجوده في العمود G في الشيت.");
      }
    } catch (e) { alert("خطأ في الاتصال"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 flex items-center justify-center" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 shadow-xl">
        <h2 className="text-xl font-black text-center mb-6">متابعة الطالب 📝</h2>
        <input onChange={(e)=>setEmail(e.target.value)} placeholder="ادخل إيميل الطالب" className="w-full p-4 rounded-2xl bg-gray-50 border mb-4 text-center font-bold" />
        <button onClick={check} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black transition-transform active:scale-95">
          {loading ? "جاري البحث..." : "استلام التقرير"}
        </button>

        {report && (
          <div className="mt-8 p-6 bg-blue-50 rounded-3xl border border-blue-100 text-center animate-in fade-in zoom-in">
            <p className="font-black text-blue-900 text-lg mb-4">{report.name}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl">
                <p className="text-[10px] text-gray-400 font-bold uppercase">درجة الكويز</p>
                <p className="text-xl font-black text-green-600">{report.quiz}%</p>
              </div>
              <div className="bg-white p-4 rounded-2xl">
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