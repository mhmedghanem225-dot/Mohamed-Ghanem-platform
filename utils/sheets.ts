export const updateProgressOnSheet = async (type: string, scoreValue?: number) => {
  const session = localStorage.getItem("ghanem_session");
  if (!session) return;
  const user = JSON.parse(session);
  const identifier = user.name || user.Name;

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzyZM6WCUve8LEkZuYwab6GBGHi129VkcT9vXyzIhGu-mFDuMBwHAwFygd-BFZcTQipcg/exec";

  try {
    const finalScore = type === "quiz" ? 50 : (scoreValue || 0);
    // encodeURIComponent ضرورية جداً للأسماء التي بها مسافات
    const url = `${SCRIPT_URL}?email=${encodeURIComponent(identifier)}&type=${type}&score=${finalScore}`;
    
    const res = await fetch(url);
    const result = await res.json();
    
    if (result.status === "success" && result.user) {
       // تحديث ذاكرة المتصفح بالبيانات القادمة من الشيت فوراً
       localStorage.setItem("ghanem_session", JSON.stringify(result.user));
       // تنبيه الصفحات بوجود تحديث
       window.dispatchEvent(new Event("storage")); 
    }
  } catch (e) {
    console.error("Sync Error:", e);
  }
};