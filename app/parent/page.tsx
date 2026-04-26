"use client";
import { useState } from "react";

export default function ParentPage() {
  const [studentName, setStudentName] = useState("");
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkProgress = async () => {
    if(!studentName) return;
    setLoading(true);
    try {
      const res = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv&t=${Date.now()}`);
      const data = await res.text();
      const rows = data.split(/\r?\n/).map(r => r.split(","));
      
      // البحث باسم الطالب (لأن الشيت لا يحتوي على إيميلات في الصورة)
      const student = rows.find(r => r[0]?.trim().toLowerCase() === studentName.toLowerCase());

      if (student) {
        setReport({
          name: student[0],
          grade: student[3],
          quizScore: student[4] || "0", // العمود E
          completedCount: student[5] || "0" // العمود F
        });
      } else {
        alert("لم يتم العثور على طالب بهذا الاسم");
        setReport(null);
      }
    } catch (e) { alert("حدث خطأ في الاتصال"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 text-right font-sans" dir="rtl">
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100">
          <h2 className="text-xl font-black text-gray-900 mb-2 text-center">متابعة مستوى ابني 📈</h2>
          <p className="text-[10px] text-gray-400 font-bold text-center mb-8 uppercase tracking-widest">Enter student name for report</p>
          
          <input 
            type="text" 
            placeholder="اكتب اسم الطالب بالكامل" 
            className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 mb-4 text-center outline-none focus:ring-2 focus:ring-blue-400 transition-all font-bold"
            onChange={(e) => setStudentName(e.target.value)}
          />
          
          <button 
            onClick={checkProgress} 
            className="w-full bg-[#1D63ED] text-white py-4 rounded-2xl font-black shadow-lg active:scale-95 transition-all"
          >
            {loading ? "جاري البحث..." : "عرض التقرير الآن"}
          </button>

          {report && (
            <div className="mt-10 space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-blue-50 p-6 rounded-3xl text-center border border-blue-100">
                <p className="text-lg font-black text-blue-900">{report.name}</p>
                <p className="text-[10px] font-bold text-blue-400 uppercase mt-1">{report.grade}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-5 rounded-3xl border border-green-100 text-center">
                  <p className="text-2xl mb-1">🎯</p>
                  <p className="text-lg font-black text-green-700">{report.quizScore}%</p>
                  <p className="text-[9px] font-bold text-green-400 uppercase">درجة الكويز</p>
                </div>
                <div className="bg-indigo-50 p-5 rounded-3xl border border-indigo-100 text-center">
                  <p className="text-2xl mb-1">📖</p>
                  <p className="text-lg font-black text-indigo-900">{report.completedCount}</p>
                  <p className="text-[9px] font-bold text-indigo-400 uppercase">دروس مكتملة</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}