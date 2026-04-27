// utils/sheets.ts

/**
 * دالة تحديث بيانات الطالب في شيت جوجل تلقائياً
 * @param type - نوع التحديث ("quiz" لإضافة نقاط أو "lesson" لزيادة عداد الدروس)
 * @param scoreValue - القيمة المراد إرسالها (اختياري)
 */
export const updateProgressOnSheet = async (type: string, scoreValue?: number) => {
  try {
    // 1. جلب بيانات الجلسة الحالية للطالب من ذاكرة المتصفح
    const savedSession = localStorage.getItem("ghanem_session");
    if (!savedSession) {
      console.warn("⚠️ No active session found to update sheet.");
      return;
    }
    
    const userData = JSON.parse(savedSession);
    // التأكد من جلب الإيميل بشكل صحيح (سواء كان الحرف الأول كبير أو صغير)
    const email = userData.email || userData.Email;

    if (!email) {
      console.error("❌ Email not found in session.");
      return;
    }

    // 2. الرابط الخاص بـ Google Apps Script (بصيغة الـ exec)
    // تأكد دائماً أن هذا الرابط هو الأحدث بعد كل عملة Deployment
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyi_yg955UO-_CxY_Ejn4CSZ3npl1O6EPTJL3wSdfOeUwN3bIrQ7v2uL81MdE8mhF1j/exec";

    // 3. تجهيز الرابط النهائي مع البيانات (استخدام GET لضمان الاستقرار)
    const finalUrl = `${SCRIPT_URL}?email=${encodeURIComponent(email)}&type=${type}&score=${scoreValue || 0}`;
    
    // 4. إرسال الطلب في الخفاء بدون تعطيل تجربة المستخدم
    await fetch(finalUrl, {
      method: "GET",
      mode: "no-cors", // لضمان العمل حتى مع قيود الحماية الخارجية
    });
    
    console.log(`✅ Progress synchronized for ${email}: ${type}`);
  } catch (e) {
    console.error("❌ Error synchronizing with Google Sheets:", e);
  }
};