"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { updateProgressOnSheet } from "../../utils/sheets";

function LessonsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [grade, setGrade] = useState("");
  const [units, setUnits] = useState<{ [key: string]: any[] }>({});
  const [openUnits, setOpenUnits] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [points, setPoints] = useState(0);
  const [photo, setPhoto] = useState("");
  // الحالة الجديدة لتخزين الدروس المكتملة
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const initialized = useRef(false);

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzKI4vf-z-DPZ1kzu4Gw3_PZjQIGr_vINjlz6ZMIym-6ISxSIqJG54vJ-MJZpsNy86Uww/exec";

  const verifyUserStatus = useCallback(async () => {
    const savedSession = localStorage.getItem("ghanem_session");
    let deviceId = localStorage.getItem("ghanem_device_id");

    if (!savedSession) {
      router.replace("/");
      return false;
    }

    if (!deviceId) {
      deviceId = "dev_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("ghanem_device_id", deviceId);
    }

    const userData = JSON.parse(savedSession);
    const email = userData.name || userData.Name;

    try {
      const response = await fetch(
        `${SCRIPT_URL}?action=getUser&email=${encodeURIComponent(
          email
        )}&deviceId=${deviceId}`
      );
      const freshData = await response.json();

      if (
        freshData.status !== "success" ||
        freshData.message === "logged_elsewhere"
      ) {
        localStorage.removeItem("ghanem_session");
        localStorage.removeItem("last_grade");
        router.replace("/");
        return false;
      }

      setPoints(freshData.user.points || 0);
      setPhoto(freshData.user.photo || "");
      
      // جلب الدروس المكتملة من قاعدة البيانات (افترضنا وجود حقل completedLessons)
      if (freshData.user.completedLessons) {
          setCompletedLessons(freshData.user.completedLessons);
      }
      
      return true;
    } catch (e) {
      return true;
    }
  }, [router]);

  const fetchLessons = useCallback(async (targetGrade: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?output=csv&t=${Date.now()}`
      );
      const data = await res.text();
      const rows = data.split(/\r?\n/).filter((line) => line.trim() !== "");

      const filtered = rows
        .slice(1)
        .map((row) => {
          const r = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          const unitName =
            r[r.length - 1]?.replace(/"/g, "").trim() || "General Lessons";
          return {
            grade: r[0]?.trim(),
            title: r[1]?.trim(),
            video: r[2]?.trim(),
            pdf: r[3]?.trim(),
            duration: r[4]?.trim(),
            keywords: r[6]?.trim(),
            unit: unitName,
          };
        })
        .filter((i) => i.grade === targetGrade);

      const grouped = filtered.reduce((acc: any, item) => {
        if (!acc[item.unit]) acc[item.unit] = [];
        acc[item.unit].push(item);
        return acc;
      }, {});

      setUnits(grouped);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialized.current) return;

    const syncData = async () => {
      const isAuthorized = await verifyUserStatus();
      if (!isAuthorized) return;

      const savedSession = localStorage.getItem("ghanem_session");
      if (!savedSession) return;

      initialized.current = true;
      const userData = JSON.parse(savedSession);
      setStudentName(userData.name || userData.Name);

      const gradeFromURL = searchParams.get("grade");
      const lastSavedGrade = localStorage.getItem("last_grade");
      const currentGrade =
        gradeFromURL || lastSavedGrade || userData.grade || "";

      if (currentGrade) {
        setGrade(currentGrade);
        localStorage.setItem("last_grade", currentGrade);
        await fetchLessons(currentGrade);
      } else {
        setLoading(false);
      }
    };

    syncData();

    const securityInterval = setInterval(() => {
      verifyUserStatus();
    }, 120000);

    return () => clearInterval(securityInterval);
  }, [searchParams, fetchLessons, verifyUserStatus]);

  const toggleUnit = (unitName: string) => {
    setOpenUnits((prev) => ({ ...prev, [unitName]: !prev[unitName] }));
  };

  const handleWatchLesson = async (lessonTitle: string, videoUrl: string) => {
    const isStillValid = await verifyUserStatus();
    if (!isStillValid) return;

    // تحديث الحالة محلياً فوراً لتحسين الـ UX
    if (!completedLessons.includes(lessonTitle)) {
        setCompletedLessons(prev => [...prev, lessonTitle]);
    }

    await updateProgressOnSheet("lesson");
    window.open(videoUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-36" dir="rtl">
      {/* Top Section */}
      <div className="bg-[#1D63ED] pt-8 pb-14 px-4 sm:px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden text-right">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between gap-3 relative z-10 mb-6">
            <button
              onClick={() => router.push("/profile")}
              className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-lg border border-white/30 active:scale-90 transition-all overflow-hidden shrink-0"
            >
              {photo ? (
                <img src={photo} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                "👤"
              )}
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => router.push("/practice")}
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-2 rounded-2xl shadow-lg border border-white/30 active:scale-95 transition-all"
                style={{ animation: "pulse 2s infinite" }}
              >
                <span className="text-lg">🎙️</span>
                <span className="text-[11px] font-black text-blue-900 whitespace-nowrap">Speak Now</span>
              </button>

              <button
                onClick={() => router.push("/games")}
                className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/25 active:scale-95 transition-all"
              >
                <span className="text-lg">🎮</span>
                <span className="text-[11px] font-black text-white whitespace-nowrap">Games</span>
              </button>
            </div>

            <div className="w-11 h-11 bg-white rounded-full p-1 shadow-lg border-2 border-blue-400 overflow-hidden shrink-0">
              <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-full object-contain" priority />
            </div>
          </div>

          <div className="relative z-10 text-white flex justify-between items-end gap-3">
            <div className="text-right min-w-0">
              <p className="text-blue-100 font-bold text-xs mb-1 truncate">Welcome, {studentName} 👋</p>
              <h1 className="text-2xl sm:text-3xl font-black leading-tight">{grade}</h1>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-2 rounded-xl border border-white/30 text-center min-w-[72px] shrink-0">
              <p className="text-[9px] font-bold text-blue-50">Points</p>
              <p className="text-xl font-black text-[#FFEB3B]">{points}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 mt-[-28px] relative z-20">
        {loading ? (
          <div className="bg-white p-8 rounded-[2rem] shadow-xl text-center font-bold text-blue-600 animate-pulse text-sm">
            Loading curriculum...
          </div>
        ) : (
          <div className="space-y-3">
            {Object.keys(units).map((unitName) => {
              // حساب التقدم لكل وحدة
              const unitLessons = units[unitName];
              const completedCount = unitLessons.filter(l => completedLessons.includes(l.title)).length;
              const progressPercentage = Math.round((completedCount / unitLessons.length) * 100);

              return (
                <div key={unitName} className="bg-white rounded-[1.8rem] shadow-sm border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => toggleUnit(unitName)}
                    className="w-full p-4 sm:p-5 text-right bg-gray-50/70 active:bg-gray-100 transition-all"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-sm text-gray-400 transition-transform duration-300 ${openUnits[unitName] ? "rotate-180" : ""}`}>▼</span>
                      <span className="font-black text-gray-700 text-sm sm:text-[15px] flex-1 mx-3">{unitName}</span>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{progressPercentage}%</span>
                    </div>
                    {/* Progress Bar الاحترافي */}
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-500" 
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </button>

                  {openUnits[unitName] && (
                    <div className="p-3 space-y-3 bg-white border-t border-gray-50">
                      {unitLessons.map((lesson, idx) => {
                        const isCompleted = completedLessons.includes(lesson.title);
                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-[1.5rem] border transition-all ${isCompleted ? 'border-green-100 bg-green-50/30' : 'border-gray-50 bg-gray-50/40'} text-right`}
                          >
                            <div className="flex items-center justify-between mb-3 gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner shrink-0 ${isCompleted ? 'bg-green-100' : 'bg-blue-50'}`}>
                                  {isCompleted ? "✅" : "📺"}
                                </div>
                                <div className="text-right min-w-0">
                                  <h3 className={`font-bold text-xs sm:text-sm truncate ${isCompleted ? 'text-green-700' : 'text-gray-800'}`}>
                                    {lesson.title}
                                  </h3>
                                  <span className="text-[9px] font-bold text-gray-400">⏱️ {lesson.duration}</span>
                                </div>
                              </div>

                              <button
                                onClick={() => handleWatchLesson(lesson.title, lesson.video)}
                                className={`${isCompleted ? 'bg-green-500' : 'bg-blue-600'} text-white w-9 h-9 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform text-xs shrink-0`}
                              >
                                {isCompleted ? "✔" : "▶️"}
                              </button>
                            </div>

                            <div className="flex gap-2">
                              {lesson.keywords && (
                                <button
                                  onClick={() => router.push(`/flashcards?title=${encodeURIComponent(lesson.title)}&grade=${encodeURIComponent(grade)}`)}
                                  className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-[10px] font-black active:scale-95"
                                >
                                  🧠 Challenge
                                </button>
                              )}
                              {lesson.pdf && (
                                <a
                                  href={lesson.pdf}
                                  target="_blank"
                                  className="flex-1 bg-white text-green-600 py-2.5 rounded-xl text-[10px] font-black border border-green-100 text-center active:scale-95"
                                >
                                  📄 PDF
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Navigation - No changes here */}
      <div className="fixed bottom-3 left-3 right-3 sm:left-10 sm:right-10 bg-white/95 backdrop-blur-md p-2 rounded-[1.8rem] shadow-2xl border border-gray-100 z-50">
        <div className="grid grid-cols-4 items-center">
          <button onClick={() => router.push("/profile")} className="flex flex-col items-center gap-0.5 p-1 active:scale-75 transition-all">
            <span className="text-xl opacity-60">👤</span>
            <span className="text-[9px] font-black text-gray-400">Profile</span>
          </button>
          <button onClick={() => router.push("/games")} className="flex flex-col items-center gap-0.5 p-1 active:scale-75 transition-all">
            <span className="text-xl opacity-60">🎮</span>
            <span className="text-[9px] font-black text-gray-400">Games</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 p-1 relative">
            <div className="bg-[#1D63ED] text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg -mt-8 border-[3px] border-gray-50 transition-all">
              <span className="text-xl">📖</span>
            </div>
            <span className="text-[9px] font-black text-[#1D63ED]">Lessons</span>
          </button>
          <button onClick={() => router.push("/leaderboard")} className="flex flex-col items-center gap-0.5 p-1 active:scale-75 transition-all">
            <span className="text-xl opacity-60">👑</span>
            <span className="text-[9px] font-black text-gray-400">Leaders</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 235, 59, 0.4); }
          70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(255, 235, 59, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 235, 59, 0); }
        }
      `}</style>
    </div>
  );
}

export default function LessonsPage() {
  return (
    <Suspense fallback={null}>
      <LessonsContent />
    </Suspense>
  );
}