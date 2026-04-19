import "./globals.css";

export const metadata = {
  title: "Mr. Mohamed Ghanem",
  description: "منصة تعليمية لطلاب مستر محمد غانم",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-50 antialiased">
        {children}
      </body>
    </html>
  );
}