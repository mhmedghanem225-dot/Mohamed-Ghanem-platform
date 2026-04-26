"use client";
import { useState } from "react";

export default function ParentPage() {
  const [emailInput, setEmailInput] = useState("");
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkProgress = async () => {
    if(!emailInput) return;
    setLoading(true);
    try {
      const res = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv&t=${Date.now()}`);
      const data = await res.text();
      const rows = data.split(/\r?\n/).map(r => r.split(","));
      
      // البحث في العمود رقم 6 (الذي يمثل العمود G في الشيت)
      const student = rows.find(r => r[6] && r[6].trim().toLowerCase() === emailInput.trim().toLowerCase());

      if (student) {
        setReport({
          name: student[0],
          quizScore: student[4] || "0", // العمود E
          completedCount: student[5] || "0" // العمود F
        });
      } else {
        alert("لم يتم العثور على طالب بهذا الإيميل في العمود G. تأكد من كتابته بشكل صحيح.");
      }
    } catch (e) { alert("حدث خطأ في الاتصال بالسيرفر"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 text-right" dir="rtl">
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-gray-100">
          <h2 className="text-xl font-black text-gray-900 mb-6 text-center">متابعة الطالب 👨‍👩‍👦</h2>
          <input 
            type="text" 
            placeholder="ادخل إيميل الطالب (مثل: ah@440)" 
            className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 mb-4 text-center outline-none focus:ring-2 focus:ring-blue-500 font-bold"
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <button onClick={checkProgress} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg">
            {loading ? "جاري البحث..." : "عرض مستوى ابني"}
          </button>

          {report && (
            <div className="mt-8 space-y-4 animate-in fade-in duration-500">
              <div className="bg-blue-50 p-5 rounded-2xl text-center border border-blue-100">
                <p className="text-lg font-black text-blue-900">{report.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-green-50 p-4 rounded-2xl">
                  <p className="text-xl font-black text-green-700">{report.quizScore}%</p>
                  <p className="text-[10px] text-green-400 font-bold uppercase">الكويز</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-2xl">
                  <p className="text-xl font-black text-indigo-900">{report.completedCount}</p>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase">الدروس</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}