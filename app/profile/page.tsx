"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [points, setPoints] = useState(0);
  const [photo, setPhoto] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz9s8OAoeb8BWZe54jf5BGPvGXDcCtWbOZfsZ9DFCVEZH8fJTLe16UvAn7jBIAXn-mjSg/exec";

  useEffect(() => {
    const syncProfileData = async () => {
      const savedSession = localStorage.getItem("ghanem_session");
      if (!savedSession) { router.replace("/"); return; }
      const userData = JSON.parse(savedSession);
      setName(userData.name || userData.Name);
      setPhoto(userData.photo || "");

      try {
        const response = await fetch(`${SCRIPT_URL}?email=${encodeURIComponent(userData.name || userData.Name)}`);
        const freshData = await response.json();
        if (freshData.status === "success") {
          setPoints(freshData.user.points || 0);
          setPhoto(freshData.user.photo || "");
          localStorage.setItem("ghanem_session", JSON.stringify(freshData.user));
        }
      } catch (e) { console.error(e); }
    };
    syncProfileData();
  }, [router]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setIsUploading(true);
        try {
          const response = await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors", // لضمان تجاوز مشاكل الحماية مع جوجل
            body: JSON.stringify({
              action: "uploadPhoto",
              email: name,
              photoData: base64String
            }),
          });
          
          // في وضع no-cors لا يمكن قراءة الرد، لذا نحدث محلياً
          setPhoto(base64String);
          const savedSession = JSON.parse(localStorage.getItem("ghanem_session") || "{}");
          savedSession.photo = base64String;
          localStorage.setItem("ghanem_session", JSON.stringify(savedSession));
          alert("تم حفظ صورتك بنجاح! 🌟");
        } catch (err) {
          alert("حدث خطأ أثناء الرفع.");
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-right pb-32" dir="rtl">
      <h1 className="text-2xl font-black text-gray-900 mb-6 text-center">My Profile 👤</h1>
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 text-center mb-6">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="w-full h-full bg-blue-100 rounded-full overflow-hidden flex items-center justify-center text-3xl shadow-inner border-2 border-white">
              {photo ? <img src={photo} className="w-full h-full object-cover" /> : "👤"}
            </div>
            <label className="absolute bottom-0 right-0 bg-[#1D63ED] text-white w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-lg border-2 border-white active:scale-90 transition-all">
              <span className="text-sm">📸</span>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={isUploading} />
            </label>
            {isUploading && <div className="absolute inset-0 bg-white/50 rounded-full flex items-center justify-center text-[10px] font-bold">جاري الحفظ..</div>}
          </div>
          <h2 className="text-lg font-black text-gray-800">{name}</h2>
          <p className="text-blue-600 font-bold text-sm">Ghanem Academy Hero</p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 text-center">
            <p className="text-xl mb-1">🏆</p>
            <p className="text-lg font-black text-gray-800">{points}</p>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Total Points</p>
          </div>
          <button onClick={() => router.push('/achievements')} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 text-center active:scale-95 transition-all">
            <p className="text-xl mb-1">🎓</p>
            <p className="text-sm font-black text-gray-800">Certificates</p>
          </button>
        </div>
        <button onClick={() => { localStorage.clear(); router.replace("/"); }} className="w-full bg-red-50 text-red-500 py-4 rounded-2xl font-black shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 text-sm">Logout 🚪</button>
      </div>
      <div className="fixed bottom-5 left-10 right-10 bg-white/95 backdrop-blur-md p-2 rounded-[2rem] shadow-2xl border border-gray-100 flex justify-around items-center z-50">
        <button className="flex flex-col items-center gap-0.5 p-1"><div className="bg-[#1D63ED] text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg -mt-8 border-[3px] border-gray-50"><span className="text-xl">👤</span></div><span className="text-[9px] font-black text-[#1D63ED]">Profile</span></button>
        <button onClick={() => router.push('/lessons')} className="flex flex-col items-center gap-0.5 p-1 active:scale-75"><span className="text-xl opacity-60">📖</span><span className="text-[9px] font-black text-gray-400">Lessons</span></button>
        <button onClick={() => router.push('/leaderboard')} className="flex flex-col items-center gap-0.5 p-1 active:scale-75"><span className="text-xl opacity-60">👑</span><span className="text-[9px] font-black text-gray-400">Leaders</span></button>
      </div>
    </div>
  );
}