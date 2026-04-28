export const updateProgressOnSheet = async (type: string, scoreValue?: number) => {
  try {
    const savedSession = localStorage.getItem("ghanem_session");
    if (!savedSession) {
      localStorage.clear();
      return;
    }
    
    const userData = JSON.parse(savedSession);
    const identifier = userData.name || userData.Name;
    if (!identifier) return;

    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwr906VCVKPpbeyqwVOpEMrgltgLgzlQTu-wRakX_rBRj60Cuk8BjE4ahG-9ZLNKpg/exec";

    // 1. إرسال التحديث للشيت
    const updateUrl = `${SCRIPT_URL}?email=${encodeURIComponent(identifier.trim())}&type=${type}&score=${scoreValue || 0}`;
    await fetch(updateUrl, { method: "GET", mode: "no-cors" });

    // 2. جلب أحدث البيانات من الشيت فوراً (المزامنة)
    const response = await fetch(`${SCRIPT_URL}?email=${encodeURIComponent(identifier.trim())}`);
    const freshData = await response.json();

    if (freshData.status === "success") {
      // تحديث ذاكرة الجهاز بالبيانات الحقيقية القادمة من الشيت
      localStorage.setItem("ghanem_session", JSON.stringify(freshData.user));
      // إعادة تحميل بسيطة لتحديث الأرقام أمام الطالب
      window.location.reload();
    }

  } catch (e) {
    console.error("❌ Sync Error:", e);
  }
};