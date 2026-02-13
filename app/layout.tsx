"use client";
import { useState, createContext } from "react";
import "./globals.css";

// تصدير الذاكرة من هنا مباشرة لضمان رؤيتها
export const UserContext = createContext<any>(null);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<string | null>(null);

  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>Mr. Mohamed Ghanem | منصة اللغة الإنجليزية</title>
      </head>
      <body className="bg-gray-50 antialiased">
        <UserContext.Provider value={{ user, setUser }}>
          <div className="min-h-screen bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
            <nav className="bg-white shadow-sm p-4 flex justify-between items-center px-8 border-b border-gray-100">
              <div className="font-black text-blue-600 text-xl">
                Mr. Mohamed Ghanem
              </div>
              {user && (
                <div className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm font-bold border border-blue-100">
                  الطالب: {user}
                </div>
              )}
            </nav>
            <main>{children}</main>
            <footer className="py-8 text-center text-gray-400 text-sm">
              © 2026 جميع الحقوق محفوظة لـ Mr. Mohamed Ghanem
            </footer>
          </div>
        </UserContext.Provider>
      </body>
    </html>
  );
}