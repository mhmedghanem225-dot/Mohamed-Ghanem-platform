// utils/sheets.ts
export const updateProgressOnSheet = async (type: string, scoreValue?: number) => {
  try {
    const savedSession = localStorage.getItem("ghanem_session");
    if (!savedSession) return;
    const { email } = JSON.parse(savedSession);

    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby4T14R9hasDj3DA7gnPU7InZTlqUfLkZlPdlRH8GbCXhv9WNIQQ9DwiSVbyvLqf8QViQ/exec";

    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, type, score: scoreValue || 0 }),
    });
  } catch (e) { console.error(e); }
};