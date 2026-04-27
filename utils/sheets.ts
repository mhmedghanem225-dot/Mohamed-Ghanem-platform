export const updateProgressOnSheet = async (type: string, scoreValue?: number) => {
  try {
    const savedSession = localStorage.getItem("ghanem_session");
    if (!savedSession) return;
    
    const userData = JSON.parse(savedSession);
    const email = userData.email || userData.Email;

    // ارفع الرابط الجديد بتاعك هنا
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyHpRdV6YeRwHDnxINobHsyINVQnxml2LGgeiT2tGAHGzVcR09ztofUaQ_rAf_nFOCuBg/exec";

    const finalUrl = `${SCRIPT_URL}?email=${encodeURIComponent(email)}&type=${type}&score=${scoreValue || 0}`;
    
    await fetch(finalUrl, {
      method: "GET",
      mode: "no-cors",
    });
    
    console.log("✅ Data sent to Mr. Ghanem's Sheet for:", email);
  } catch (e) {
    console.error("❌ Error:", e);
  }
};