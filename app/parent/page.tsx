"use client";

import { useMemo, useState } from "react";

type Report = {
  name: string;
  grade: string;
  quiz: number;
  lessons: number;
  examGrade: number | null;
};

export default function ParentDashboard() {
  const [email, setEmail] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "not_found" | "error">("idle");

  // رقم الواتساب الخاص بك للتواصل
  const ACADEMY_PHONE = "01095565328";

  const SHEET_CSV_URL = useMemo(
    () =>
      `https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ZJwP0z4SVM4XfAPevqPqsSvbSBRy18i_rbgfVNGYVHBZj10aHtdHqhMj8kKKkI0WHwWLDLFxXniO/pub?gid=643200738&single=true&output=csv&t=${Date.now()}`,
    []
  );

  const clean = (val?: string) => parseInt(val?.replace(/[^\d]/g, "") || "0", 10) || 0;

  const parseCSV = (csv: string) => {
    const rows = csv
      .trim()
      .split(/\r?\n/)
      .filter(Boolean)
      .map((row) => row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));
    return rows;
  };

  const getPerformanceLabel = (quiz: number) => {
    if (quiz >= 90) return "ممتاز جدًا";
    if (quiz >= 80) return "ممتاز";
    if (quiz >= 65) return "جيد جدًا";
    if (quiz >= 50) return "جيد";
    return "بحاجة إلى دعم";
  };

  const getBadge = (quiz: number) => {
    if (quiz >= 90) return "🏆";
    if (quiz >= 80) return "🥇";
    if (quiz >= 65) return "🥈";
    return "🎯";
  };

  const checkStatus = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;

    setLoading(true);
    setStatus("idle");
    setReport(null);

    try {
      const res = await fetch(SHEET_CSV_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch sheet");

      const data = await res.text();
      const rows = parseCSV(data);

      // البحث بالإيميل في العمود 7 (Index 6)
      const found = rows.find(
        (r) => r[6]?.replace(/"/g, "").trim().toLowerCase() === normalizedEmail
      );

      if (found) {
        setReport({
          name: found[0]?.replace(/"/g, "") || "الطالب",
          grade: found[3]?.replace(/"/g, "") || "غير محدد",
          quiz: clean(found[4]), // درجة المنصة التلقائية
          lessons: clean(found[5]), // الدروس المكتملة
          examGrade: found[9] ? clean(found[9]) : null, // درجة الامتحان اليدوية (العمود J)
        });
      } else {
        setStatus("not_found");
      }
    } catch (e) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const shareToWhatsApp = () => {
    if (!report) return;

    const text = `أهلاً مستر غانم، حابب أستفسر عن مستوى ابني ${report.name}. شفت التقرير على المنصة (الامتحان: ${
      report.examGrade ?? "قريباً"
    } - الكويزات: ${report.quiz}%).`;
    window.open(
      `https://wa.me/${ACADEMY_PHONE}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const overallScore = useMemo(() => {
    if (!report) return 0;
    const exam = report.examGrade ?? report.quiz;
    return Math.round((report.quiz * 0.55 + report.lessons * 8 * 0.15 + exam * 0.3) || 0);
  }, [report]);

  const strengthLevel = useMemo(() => {
    if (overallScore >= 90) return "متميز جدًا";
    if (overallScore >= 80) return "قوي جدًا";
    if (overallScore >= 65) return "جيد جدًا";
    if (overallScore >= 50) return "جيد";
    return "يحتاج متابعة";
  }, [overallScore]);

  return (
    <div dir="rtl" className="min-h-screen bg-[radial-gradient(circle_at_top,_#eff6ff_0%,_#f8fafc_35%,_#ffffff_100%)] font-sans text-right pb-16">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0F4CFF] via-[#1D63ED] to-[#0B2D8F] rounded-b-[3rem] shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-10 right-10 h-40 w-40 rounded-full bg-white/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl"></div>
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 py-14 sm:py-16">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-3xl border border-white/20 bg-white/10 px-5 py-3 text-3xl shadow-lg backdrop-blur-md">
              👨‍👩‍👧‍👦
            </div>
            <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-white/90 backdrop-blur-md">
              Parent Smart Portal
            </div>
          </div>

          <h1 className="text-center text-3xl font-black tracking-tight text-white sm:text-5xl">
            بوابة متابعة ولي الأمر
          </h1>
          <p className="mt-4 max-w-2xl text-center text-sm font-medium leading-7 text-blue-100 sm:text-base">
            تقرير واضح، سريع، ومصمم ليمنحك صورة دقيقة عن مستوى الطالب، تقدمه في
            الدروس، وأداءه في الكويزات والاختبارات.
          </p>

          <div className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            <HeroStat label="مستوى الشفافية" value="عالي" />
            <HeroStat label="تحديث البيانات" value="مباشر" />
            <HeroStat label="التواصل" value="واتساب" />
          </div>
        </div>
      </div>

      <div className="-mt-10 mx-auto max-w-6xl px-5 sm:px-6">
        {/* Search Card */}
        <div className="mx-auto max-w-2xl rounded-[2.25rem] border border-white bg-white p-6 shadow-[0_24px_70px_rgba(15,76,255,0.12)] sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                ابحث عن تقرير الطالب
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                أدخل البريد الإلكتروني المسجل في المنصة.
              </p>
            </div>
            <div className="hidden rounded-2xl bg-blue-50 px-4 py-3 text-2xl sm:block">
              📊
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setStatus("idle");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") checkStatus();
                }}
                placeholder="أدخل إيميل الطالب"
                className="w-full rounded-[1.5rem] border-2 border-slate-100 bg-slate-50 px-5 py-4 text-center text-base font-bold text-slate-900 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <button
              onClick={checkStatus}
              disabled={loading || !email.trim()}
              className="group flex w-full items-center justify-center gap-3 rounded-[1.5rem] bg-gradient-to-r from-[#1D63ED] to-[#0F4CFF] px-6 py-4 text-lg font-black text-white shadow-lg shadow-blue-200 transition-all hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                  جاري جلب التقرير...
                </>
              ) : (
                <>
                  عرض تقرير الطالب
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </>
              )}
            </button>

            {status === "not_found" && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                عفواً، الإيميل غير مسجل لدينا.
              </div>
            )}

            {status === "error" && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                حدث خطأ أثناء الاتصال بالبيانات. حاول مرة أخرى.
              </div>
            )}
          </div>
        </div>

        {/* Report */}
        {loading && <LoadingSkeleton />}

        {report && !loading && (
          <div className="mt-8 grid gap-6">
            {/* Top Summary */}
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="overflow-hidden rounded-[2.25rem] bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)] sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-blue-100 to-indigo-100 text-4xl shadow-inner">
                      {getBadge(report.quiz)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-400">
                        بطاقة الطالب
                      </p>
                      <h3 className="mt-1 text-2xl font-black text-slate-900">
                        {report.name}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        {report.grade}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] bg-slate-50 px-5 py-4 text-center">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                      التقييم العام
                    </p>
                    <p className="mt-2 text-4xl font-black text-slate-900">
                      {overallScore}
                      <span className="text-lg text-slate-400">/100</span>
                    </p>
                    <p className="mt-2 text-sm font-bold text-blue-600">
                      {strengthLevel}
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <MetricCard
                    title="تقييم الكويزات"
                    value={`${report.quiz}%`}
                    note="المنصة التلقائية"
                    gradient="from-sky-500 to-blue-600"
                  />
                  <MetricCard
                    title="الدروس المكتملة"
                    value={`${report.lessons}`}
                    note="متابعة الحضور"
                    gradient="from-indigo-500 to-violet-600"
                  />
                  <MetricCard
                    title="درجة الامتحان"
                    value={report.examGrade !== null ? `${report.examGrade}/100` : "قريباً"}
                    note="تقييم يدوي"
                    gradient="from-emerald-500 to-green-600"
                  />
                </div>
              </div>

              {/* Insights Panel */}
              <div className="overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-[0_18px_55px_rgba(15,23,42,0.14)] sm:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-white/50">
                      نظرة سريعة
                    </p>
                    <h3 className="mt-2 text-2xl font-black">مؤشرات الأداء</h3>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3 text-2xl">
                    ✨
                  </div>
                </div>

                <div className="mt-8 space-y-5">
                  <InsightRow
                    label="سرعة الاستيعاب"
                    value={Math.min(report.quiz + 10, 100)}
                  />
                  <InsightRow label="دقة حل المهام" value={report.quiz} />
                  <InsightRow
                    label="الاستمرارية"
                    value={Math.min(report.lessons * 8, 100)}
                  />
                </div>

                <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                  <p className="text-sm font-bold text-white/70">ملاحظات سريعة</p>
                  <p className="mt-2 text-sm leading-7 text-white/90">
                    يظهر التقرير مستوى الطالب الحالي بشكل واضح، مع إمكانية متابعة
                    التقدم الأكاديمي والتواصل المباشر عند الحاجة.
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed exam card */}
            {report.examGrade !== null && (
              <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-700 p-6 text-white shadow-[0_25px_70px_rgba(79,70,229,0.28)] sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-white/60">
                      آخر اختبار
                    </p>
                    <h3 className="mt-2 text-2xl font-black">درجة الامتحان اليدوية</h3>
                    <p className="mt-3 text-sm leading-7 text-white/85">
                      هذه الدرجة تم إدخالها يدويًا لتعكس أداء الطالب في آخر
                      اختبار.
                    </p>
                  </div>

                  <div className="rounded-[2rem] bg-white/12 px-6 py-5 text-center backdrop-blur-md">
                    <p className="text-5xl font-black">
                      {report.examGrade}
                      <span className="text-xl opacity-70">/100</span>
                    </p>
                    <p className="mt-2 text-sm font-bold text-white/80">
                      تم رصدها بواسطة مستر غانم
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* WhatsApp CTA */}
            <button
              onClick={shareToWhatsApp}
              className="group flex w-full items-center justify-between gap-5 rounded-[2.25rem] bg-gradient-to-r from-[#25D366] to-[#19B85A] p-6 text-white shadow-[0_20px_50px_rgba(37,211,102,0.25)] transition-all hover:scale-[1.01] sm:p-7"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-[1.5rem] bg-white/15 p-4 text-2xl transition-transform group-hover:rotate-12">
                  💬
                </div>
                <div className="text-right">
                  <h4 className="text-lg font-black sm:text-xl">
                    استشارة مباشرة عبر واتساب
                  </h4>
                  <p className="mt-1 text-xs font-bold text-green-50/90 sm:text-sm">
                    تواصل سريع مع مستر غانم لمناقشة مستوى الطالب
                  </p>
                </div>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-lg font-black">
                ←
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.75rem] border border-white/15 bg-white/10 px-5 py-4 text-center text-white shadow-lg backdrop-blur-md">
      <p className="text-xs font-bold text-blue-100/80">{label}</p>
      <p className="mt-2 text-lg font-black sm:text-xl">{value}</p>
    </div>
  );
}

function MetricCard({
  title,
  value,
  note,
  gradient,
}: {
  title: string;
  value: string;
  note: string;
  gradient: string;
}) {
  return (
    <div className="rounded-[1.75rem] bg-slate-50 p-5 shadow-sm border border-slate-100">
      <div className={`inline-flex rounded-2xl bg-gradient-to-r ${gradient} px-3 py-2 text-white shadow-md`}>
        <span className="text-xs font-black uppercase tracking-wider">{note}</span>
      </div>
      <p className="mt-4 text-sm font-bold text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function InsightRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-bold text-white/80">{label}</span>
        <span className="text-sm font-black text-white">{value}%</span>
      </div>
      <div className="h-3 rounded-full bg-white/10 p-1">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-white transition-all duration-1000 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="mt-8 space-y-6 animate-pulse">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2.25rem] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-[2rem] bg-slate-200" />
            <div className="space-y-3">
              <div className="h-4 w-24 rounded bg-slate-200" />
              <div className="h-6 w-48 rounded bg-slate-200" />
              <div className="h-4 w-32 rounded bg-slate-200" />
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="h-32 rounded-[1.75rem] bg-slate-100" />
            <div className="h-32 rounded-[1.75rem] bg-slate-100" />
            <div className="h-32 rounded-[1.75rem] bg-slate-100" />
          </div>
        </div>
        <div className="rounded-[2.25rem] bg-slate-900 p-6 sm:p-8">
          <div className="h-5 w-24 rounded bg-white/10" />
          <div className="mt-4 h-7 w-44 rounded bg-white/10" />
          <div className="mt-8 space-y-5">
            <div className="h-4 rounded bg-white/10" />
            <div className="h-4 rounded bg-white/10" />
            <div className="h-4 rounded bg-white/10" />
          </div>
        </div>
      </div>
      <div className="h-32 rounded-[2.25rem] bg-gradient-to-r from-violet-200 to-indigo-200" />
      <div className="h-20 rounded-[2.25rem] bg-green-100" />
    </div>
  );
}