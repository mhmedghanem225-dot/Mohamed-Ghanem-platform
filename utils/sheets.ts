// utils/sheets.ts
export const updateProgressOnSheet = async (type: string, scoreValue?: number) => {
  try {
    const savedSession = localStorage.getItem("ghanem_session");
    if (!savedSession) return;
    
    const { email } = JSON.parse(savedSession);

    // الرابط الخاص بك الذي أرسلته
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyEJWA_7g10lALXELQwD4zV217ozzNY-2EG34BVsEYoAM_Q4JCQcVuB8XwzEz8sSHBUXw/exec";

    // إرسال البيانات في الرابط لضمان التحديث التلقائي
    await fetch(`${SCRIPT_URL}?email=${encodeURIComponent(email)}&type=${type}&score=${scoreValue || 0}`, {
      method: "GET",
      mode: "no-cors",
    });
    
    console.log("✅ Data sent to Mr. Ghanem's Sheet!");
  } catch (e) {
    console.error("❌ Error updating sheet:", e);
  }
};