export const updateProgressOnSheet = async (type: string, scoreValue?: number) => {
  const session = localStorage.getItem("ghanem_session");
  if (!session) return;
  
  const user = JSON.parse(session);
  const identifier = user.name || user.Name;
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwr906VCVKPpbeyqwVOpEMrgltgLgzlQTu-wRakX_rBRj60Cuk8BjE4ahG-9ZLNKpg/exec";

  try {
    // 1. إرسال الطلب للشيت
    const finalScore = type === "quiz" ? 50 : (scoreValue || 0);
    const url = `${SCRIPT_URL}?email=${encodeURIComponent(identifier)}&type=${type}&score=${finalScore}`;
    
    const res = await fetch(url);
    const result = await res.json();
    
    // 2. التعديل الجوهري: تحديث بيانات المتصفح فوراً بالرد القادم من الشيت
    if (result.status === "success" && result.user) {
       // هنا بنحدث الـ localStorage بالنقاط الجديدة اللي السكريبت حسبها
       localStorage.setItem("ghanem_session", JSON.stringify(result.user));
       
       // إطلاق حدث (Event) لإخبار كل الصفحات (البروفايل والدروس) بأن البيانات تغيرت
       window.dispatchEvent(new Event("storage_updated"));
       
       console.log("Points updated in sheet and locally:", result.user.points);
    }
  } catch (e) {
    console.error("Sync Error:", e);
  }
};