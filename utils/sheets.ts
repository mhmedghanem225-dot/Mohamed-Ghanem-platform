// utils/sheets.ts
export const updateProgressOnSheet = async (type: string, scoreValue?: number) => {
  try {
    const savedSession = localStorage.getItem("ghanem_session");
    if (!savedSession) return;
    
    const userData = JSON.parse(savedSession);
    const identifier = userData.name || userData.Name;

    if (!identifier) return;

    // 1. تحديث النقاط محلياً فوراً (عشان تظهر في الـ UI للطالب الحالي)
    if (type === "quiz") {
      userData.points = (userData.points || 0) + 50;
    } else if (type === "lesson") {
      userData.completedLessons = (userData.completedLessons || 0) + 1;
    }
    // حفظ البيانات المحدثة في المتصفح فوراً
    localStorage.setItem("ghanem_session", JSON.stringify(userData));

    // 2. إرسال التحديث لشيت جوجل (الربط الخارجي)
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzBC2RkIlu-z3tH1SpmKsVr1Ndi1jl8HEjjODeWXX-Zl_f68v84udG8pdQhb1S2W-p21w/exec";
    const finalUrl = `${SCRIPT_URL}?email=${encodeURIComponent(identifier.trim())}&type=${type}&score=${scoreValue || 0}`;
    
    await fetch(finalUrl, {
      method: "GET",
      mode: "no-cors",
    });

    // عمل تحديث بسيط للصفحة (اختياري) لضمان ظهور الأرقام الجديدة في الـ UI
    // window.location.reload(); 
    
  } catch (e) {
    console.error("❌ Error sync:", e);
  }
};