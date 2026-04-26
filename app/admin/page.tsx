"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminDashboard() {
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminPass, setAdminPass] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  // نظام حماية بسيط للدخول
  const checkPass = () => {
    if (adminPass === "123456") { // يمكنك تغيير الباسورد هنا
      setIsAuthorized(true);
      fetchAdminData();
    } else {
      alert("كلمة المرور غير صحيحة يا مستر محمد");
    }
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv&t=${Date.now()}`);
      const data = await res.text();
      const rows = data.split(/\r?\n/).filter(l => l.trim() !== "").map(r => r.split(","));
      
      const studentList = rows.slice(1).map(r => ({
        name: r[5]?.trim(),
        email: r[4]?.trim(),
        points: r[8]?.trim() || "0",
        grade: r[0]?.trim()
      })).filter(s => s.name);

      setStudents(studentList);
      setLoading(false);
    } catch (e) { setLoading(false); }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#1D63ED] flex items-center justify-center p-6" dir="rtl">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md text-center">
          <Image src="/logo.png" alt="Logo" width={60} height={60} className="mx-auto mb-4" />
          <h1 className="text-xl font-black text-gray-800 mb-6">لوحة تحكم المستر</h1>
          <input 
            type="password" 
            placeholder="أدخل كلمة مرور الإدارة" 
            className="w-full p-4 rounded-2xl border-2 border-gray-100 mb-4 text-center focus:border-blue-500 outline-none transition-all"
            value={adminPass}
            onChange={(e) => setAdminPass(e.target.value)}
          />
          <button onClick={checkPass} className="w-full bg-[#1D63ED] text-white py-4 rounded-2xl font-black shadow-lg active:scale-95 transition-all">دخول النظام</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20" dir="rtl">
      {/* Header */}
      <div className="bg-[#1D63ED] pt-10 pb-20 px-6 rounded-b-[3.5rem] shadow-xl text-right">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-white">
          <div>
            <h1 className="text-2xl font-black italic">Ghanem Dashboard</h1>
            <p className="text-blue-100 text-xs font-bold mt-1">مرحباً مستر محمد | مراقبة أداء الطلاب</p>
          </div>
          <button onClick={() => router.push('/lessons')} className="bg-white/20 p-3 rounded-2xl border border-white/30 text-xs font-bold">العودة للموقع</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 mt-[-40px]">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">إجمالي الطلاب</p>
            <p className="text-3xl font-black text-[#1D63ED]">{students.length}</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">نقاط التحديات</p>
            <p className="text-3xl font-black text-green-500">10</p>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="font-black text-gray-800">قائمة الطلاب المسجلين</h2>
            <button onClick={fetchAdminData} className="text-[#1D63ED] text-xs font-bold">تحديث البيانات 🔄</button>
          </div>
          
          {loading ? (
            <div className="p-20 text-center font-bold text-blue-600 animate-pulse">جاري جلب بيانات الطلاب...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="p-4">الطالب</th>
                    <th className="p-4">المرحلة</th>
                    <th className="p-4">النقاط</th>
                    <th className="p-4">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {students.map((s, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-gray-800 text-sm">{s.name}</p>
                        <p className="text-[9px] text-gray-400">{s.email}</p>
                      </td>
                      <td className="p-4">
                        <span className="bg-blue-50 text-[#1D63ED] px-3 py-1 rounded-full text-[10px] font-black">{s.grade}</span>
                      </td>
                      <td className="p-4 font-black text-gray-700 text-sm">{s.points}</td>
                      <td className="p-4">
                         <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-bold text-gray-500">نشط</span>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}