// utils/sheets.ts
export const updateProgressOnSheet = async (type: string, scoreValue?: number) => {
  try {
    const savedSession = localStorage.getItem("ghanem_session");
    if (!savedSession) return;
    
    const userData = JSON.parse(savedSession);
    // سحب الاسم كما هو موجود في الصورة (name)
    const identifier = userData.name || userData.Name;

    if (!identifier) return;

    // ضع رابط الـ exec الجديد هنا
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzBC2RkIlu-z3tH1SpmKsVr1Ndi1jl8HEjjODeWXX-Zl_f68v84udG8pdQhb1S2W-p21w/exec";

    const finalUrl = `${SCRIPT_URL}?email=${encodeURIComponent(identifier.trim())}&type=${type}&score=${scoreValue || 0}`;
    
    await fetch(finalUrl, {
      method: "GET",
      mode: "no-cors",
    });
    
    console.log("✅ Update sent for:", identifier);
  } catch (e) {
    console.error("❌ Error:", e);
  }
};