"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';

interface Lesson {
  id: number;
  title: string;
  videoUrl: string;
  pdfUrl: string;
  level: string;
}

interface NewLessonState {
  title: string;
  videoUrl: string;
  pdfUrl: string;
  level: string;
}

export default function AdminDashboard() {
  const [password, setPassword] = useState<string>("");
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [newLesson, setNewLesson] = useState<NewLessonState>({
    title: "", videoUrl: "", pdfUrl: "", level: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem('physics_lessons');
    if (saved) {
      try { setLessons(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const handleLogin = (): void => {
    if (password === "admin123") setIsAuthorized(true);
    else alert("كلمة السر خطأ!");
  };

  const addLesson = (): void => {
    if (!newLesson.title || !newLesson.level) {
      alert("برجاء إدخال البيانات");
      return;
    }
    const lessonToAdd: Lesson = { id: Date.now(), ...newLesson };
    const updated = [...lessons, lessonToAdd];
    setLessons(updated);
    localStorage.setItem('physics_lessons', JSON.stringify(updated));
    setNewLesson({ title: "", videoUrl: "", pdfUrl: "", level: "" });
  };

  const deleteLesson = (id: number): void => {
    const updated = lessons.filter((l) => l.id !== id);
    setLessons(updated);
    localStorage.setItem('physics_lessons', JSON.stringify(updated));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setNewLesson((prev) => ({
      ...prev,
      [name as keyof NewLessonState]: value
    }));
  };

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black" dir="rtl">
        <div className="p-8 border rounded-lg shadow-sm">
          <h1 className="text-xl font-bold mb-4 text-center">دخول الإدارة</h1>
          <input 
            type="password" 
            className="border p-2 rounded mb-4 w-full text-center" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button onClick={handleLogin} className="bg-blue-600 text-white p-2 rounded w-full font-bold">دخول</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8 text-black" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">لوحة التحكم 🎓</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-lg border mb-8">
          <input name="title" placeholder="عنوان الدرس" className="p-2 border rounded" value={newLesson.title} onChange={handleInputChange} />
          <select name="level" className="p-2 border rounded bg-white" value={newLesson.level} onChange={handleInputChange}>
            <option value="">اختر الصف</option>
            <optgroup label="ابتدائي">
                <option value="1-prim">الأول الابتدائي</option>
                <option value="2-prim">الثاني الابتدائي</option>
                <option value="3-prim">الثالث الابتدائي</option>
                <option value="4-prim">الرابع الابتدائي</option>
                <option value="5-prim">الخامس الابتدائي</option>
                <option value="6-prim">السادس الابتدائي</option>
            </optgroup>
            <optgroup label="إعدادي">
                <option value="1-prep">الأول الإعدادي</option>
                <option value="2-prep">الثاني الإعدادي</option>
                <option value="3-prep">الثالث الإعدادي</option>
            </optgroup>
          </select>
          <input name="videoUrl" placeholder="رابط الفيديو" className="p-2 border rounded" value={newLesson.videoUrl} onChange={handleInputChange} />
          <input name="pdfUrl" placeholder="رابط الملزمة" className="p-2 border rounded" value={newLesson.pdfUrl} onChange={handleInputChange} />
          <button onClick={addLesson} className="md:col-span-2 bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700">إضافة الدرس +</button>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold">الدروس المضافة:</h2>
          {lessons.map((lesson) => (
            <div key={lesson.id} className="flex justify-between p-4 border rounded bg-white shadow-sm">
              <div>
                <span className="font-bold">{lesson.title}</span>
                <span className="mr-4 text-sm text-blue-600">({lesson.level})</span>
              </div>
              <button onClick={() => deleteLesson(lesson.id)} className="text-red-500 font-bold">حذف</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}