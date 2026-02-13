import "./globals.css";

export const metadata = {
title: "Mr. Mohamed Ghanem",
description: "منصة تعليمية",
};

export default function RootLayout({ children }: { children: any }) {
return (
<html lang="ar" dir="rtl">
<body className="bg-gray-50">
<div className="min-h-screen">
<nav className="bg-white shadow-sm p-4 flex justify-between items-center px-8">
<div className="font-bold text-blue-600 text-xl">
Mr. Mohamed Ghanem
</div>
</nav>
<main>{children}</main>
<footer className="py-8 text-center text-gray-400 text-sm">
© 2026 جميع الحقوق محفوظة
</footer>
</div>
</body>
</html>
);
}