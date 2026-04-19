"use client";
import { useState } from "react";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === "123456") {
      // هنا بنخليه يدخل "تلقائياً" على المنهج المبرمج في صفحة الدروس
      window.location.assign("/lessons");
    } else {
      alert("كود الاشتراك غير صحيح");
    }
  };

  return (
    <div style={{ 
      padding: "50px", 
      textAlign: "center", 
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f9fafb",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }} dir="rtl">
      
      <h1 style={{ color: "#2563eb", marginBottom: "5px" }}>Ghanem Academy</h1>
      <p style={{ color: "#6b7280", marginBottom: "30px" }}>Welcome to Ghanem Academy</p>
      
      <form onSubmit={handleSubmit} style={{ 
        display: "inline-block", 
        textAlign: "right", 
        border: "1px solid #e5e7eb", 
        padding: "30px", 
        borderRadius: "15px",
        backgroundColor: "#ffffff",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#374151" }}>اسم الطالب:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", boxSizing: "border-box" }} 
            placeholder="اكتب اسمك هنا"
          />
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#374151" }}>كود الاشتراك:</label>
          <input 
            type="password" 
            value={code} 
            onChange={(e) => setCode(e.target.value)} 
            required 
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", boxSizing: "border-box", textAlign: "center" }} 
            placeholder="••••••"
          />
        </div>

        <button 
          type="submit" 
          style={{ 
            width: "100%", 
            padding: "14px", 
            background: "#2563eb", 
            color: "white", 
            border: "none", 
            borderRadius: "8px", 
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px"
          }}
        >
          دخول للمنصة
        </button>
      </form>
      
      <p style={{ marginTop: "40px", color: "#9ca3af", fontSize: "12px" }}>
        جميع الحقوق محفوظة © مستر محمد غانم 2026
      </p>
    </div>
  );
}