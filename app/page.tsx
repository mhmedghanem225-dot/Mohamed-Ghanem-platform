"use client";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [nameInput, setNameInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // الرابط الخاص بجدول بيانات الطلاب (CSV)
  const STUDENTS_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?gid=643200738&single=true&output=csv";

  useEffect(() => {
    // التحقق من وجود جلسة دخول سابقة
    const savedSession = localStorage.getItem("ghanem_session");
    if (savedSession) {
      const user = JSON.parse(savedSession);
      window.location.href = `/lessons?grade=${encodeURIComponent(user.grade)}`;
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("جاري التحقق من بيانات الاشتراك...");

    try {
      const response = await fetch(STUDENTS_SHEET_URL);
      const csvData = await response.text();
      const rows = csvData.split("\n").slice(1);
      
      const students = rows.map(row => {
        const columns = row.split(",");
        return {
          name: columns[0]?.trim(),
          pass: columns[1]?.trim(),
          expiry: columns[2]?.trim(),
          grade: columns[3]?.trim(),
          savedDeviceId: columns[4]?.trim() // بصمة الجهاز المسجلة في الشيت (العمود E)
        };
      });

      const foundStudent = students.find(s => s.name === nameInput && s.pass === passInput);

      if (!foundStudent) {
        setError("اسم الطالب أو كلمة المرور غير صحيحة");
        return;
      }

      // 1. التحقق من تاريخ صلاحية الاشتراك
      const today = new Date();
      const expiryDate = new Date(foundStudent.expiry);
      if (expiryDate < today) {
        setError("عفواً، انتهى اشتراكك. يرجى التواصل مع مستر محمد للتجديد.");
        return;
      }

      // 2. نظام بصمة الجهاز (Device ID) لمنع مشاركة الحساب
      let currentDeviceId = localStorage.getItem("ghanem_device_id");
      if (!currentDeviceId) {
        // توليد بصمة فريدة لهذا الجهاز إذا كان أول دخول له
        currentDeviceId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
        localStorage.setItem("ghanem_device_id", currentDeviceId);
      }

      // إذا كان هناك بصمة مسجلة في الشيت لهذا الطالب، يجب أن تطابق بصمة الجهاز الحالي
      if (foundStudent.savedDeviceId && foundStudent.savedDeviceId !== "" && foundStudent.savedDeviceId !== currentDeviceId) {
        setError("عفواً، هذا الحساب مرتبط بجهاز آخر. لا يمكنك الدخول من هذا الجهاز.");
        return;
      }

      // نجاح الدخول: حفظ الجلسة والانتقال لصفحة الدروس
      localStorage.setItem("ghanem_session", JSON.stringify(foundStudent));
      window.location.href = `/lessons?grade=${encodeURIComponent(foundStudent.grade)}`;

    } catch (err) {
      setError("حدث خطأ في الاتصال بالسيرفر. تأكد من جودة الإنترنت.");
    }
  };

  if (isLoading) return null;

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-[2.5rem] shadow-2xl border-t-8 border-blue-600" dir="rtl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-blue-600">Ghanem Academy</h1>
        <p className="text-gray-500 font-bold mt-2">تسجيل دخول الطلاب 🔐</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1 mr-2">اسم الطالب</label>
          <input 
            type="text" 
            placeholder="اكتب اسمك كما هو مسجل"
            className="w-full p-4 rounded-xl border-2 border-gray-100 outline-none focus:border-blue-500 text-black transition-all"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1 mr-2">كلمة المرور</label>
          <input 
            type="password" 
            placeholder="كلمة المرور الخاصة بك"
            className="w-full p-4 rounded-xl border-2 border-gray-100 outline-none focus:border-blue-500 text-black transition-all"
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm font-bold text-center border border-red-100">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white p-4 rounded-xl font-black text-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
        >
          دخول للمنصة
        </button>
      </form>
      
      <p className="text-center text-xs text-gray-400 mt-8">
        جميع الحقوق محفوظة © مستر محمد غانم 2026
      </p>
    </div>
  );
}