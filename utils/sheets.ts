// utils/sheets.ts
export const updateProgressOnSheet = async (type: string, scoreValue?: number) => {
  try {
    const savedSession = localStorage.getItem("ghanem_session");
    if (!savedSession) return;
    
    const userData = JSON.parse(savedSession);
    const email = userData.email || userData.Email; // للتأكد من قراءة الإيميل سواء كابيتال أو سمول

    // الرابط بتاعك (تأكد إنه اللي آخره exec)
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyEJWA_7g10lALXELQwD4zV217ozzNY-2EG34BVsEYoAM_Q4JCQcVuB8XwzEz8sSHBUXw/exec";

    const finalUrl = `${SCRIPT_URL}?email=${encodeURIComponent(email)}&type=${type}&score=${scoreValue || 0}`;
    
    await fetch(finalUrl, {
      method: "GET",
      mode: "no-cors",
    });
    
    console.log("✅ Sent to Sheet for:", email);
  } catch (e) {
    console.error("❌ Error:", e);
  }
};