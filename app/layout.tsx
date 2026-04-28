"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// استيراد أي مكونات أخرى تحتاجها (Navbar, Footer, إلخ)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // مراقبة الجلسة عند تحميل الصفحة
  useEffect(() => {
    const savedSession = localStorage.getItem("ghanem_session");
    if (savedSession) {
      setUser(JSON.parse(savedSession));
    }
  }, []);

  /**
   * دالة تسجيل الخروج - الحل الجذري لتداخل البيانات
   * تقوم بمسح كل الذاكرة لضمان دخول الطالب التالي بصفحة بيضاء تماماً
   */
  const handleLogout = () => {
    // 1. مسح كل البيانات المخزنة (النقاط، الاسم، الإيميل القديم)
    localStorage.clear();
    
    // 2. تحديث الحالة المحلية
    setUser(null);
    
    // 3. توجيه المستخدم لصفحة تسجيل الدخول
    router.push("/login");
    
    // 4. إعادة تحميل بسيطة للتأكد من تنظيف الـ Cache
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <html lang="en">
      <body>
        {/* مثال لكيفية استخدام الدالة في الـ Navbar الخاص بك */}
        {/* يمكنك البحث عن زر Logout في ملفك واستبداله بـ onClick={handleLogout} */}
        
        <main>{children}</main>

        {/* ملاحظة: تأكد من ربط زر الخروج بهذه الدالة handleLogout */}
      </body>
    </html>
  );
}