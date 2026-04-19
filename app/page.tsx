"use client";
import { useState } from "react";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("الصف الخامس الابتدائي");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === "123456") {
      window.location.href = `/lessons?grade=${encodeURIComponent(grade)}`;
    } else {
      alert("كود الاشتراك غير صحيح");
    }
  };

  return (
    <div style={{ padding: "50px", textAlign: "center", fontFamily: "Arial" }} dir="rtl">
      <h1>Welcome to Ghanem Academy</h1>
      <form onSubmit={handleSubmit} style={{ display: "inline-block", textAlign: "right", border: "1px solid #ccc", padding: "20px", borderRadius: "10px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>اسم الطالب:</label><br />
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>كود الاشتراك:</label><br />
          <input type="password" value={code} onChange={(e) => setCode(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>المرحلة الدراسية:</label><br />
          <select value={grade} onChange={(e) => setGrade(e.target.value)} style={{ width: "100%", padding: "8px" }}>
            <option>الصف الأول الابتدائي</option>
            <option>الصف الثاني الابتدائي</option>
            <option>الصف الثالث الابتدائي</option>
            <option>الصف الرابع الابتدائي</option>
            <option>الصف الخامس الابتدائي</option>
            <option>الصف السادس الابتدائي</option>
            <option>الصف الأول الإعدادي</option>
            <option>الصف الثاني الإعدادي</option>
            <option>الصف الثالث الإعدادي</option>
          </select>
        </div>
        <button type="submit" style={{ width: "100%", padding: "10px", background: "blue", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          دخول
        </button>
      </form>
    </div>
  );
}