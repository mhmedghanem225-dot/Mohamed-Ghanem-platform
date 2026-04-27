// utils/sheets.ts
export const updateProgressOnSheet = async (type: string, scoreValue?: number) => {
  try {
    const savedSession = localStorage.getItem("ghanem_session");
    if (!savedSession) return;
    
    const userData = JSON.parse(savedSession);
    const email = userData.email || userData.Email;

    if (!email) {
      alert("خطأ: الإيميل غير موجود في الجلسة، يرجى تسجيل الخروج والدخول ثانية");
      return;
    }

    // الرابط الأخير بتاعك
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzw6EqoZYLuMyJbKLUr3cr97E2CTsZ110OBMluwAk8qQ3KvTyw7nj83VyLVZUVRPCTNdQ/exec";

    const finalUrl = `${SCRIPT_URL}?email=${encodeURIComponent(email.trim())}&type=${type}&score=${scoreValue || 0}`;
    
    // تنبيه للتجربة (ممكن تمسحه بعد ما تتأكد)
    console.log("إرسال بيانات للطالب: " + email);

    await fetch(finalUrl, {
      method: "GET",
      mode: "no-cors",
    });
    
  } catch (e) {
    console.error("❌ Error:", e);
  }
};