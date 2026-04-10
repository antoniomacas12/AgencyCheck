import type { Metadata } from "next";
import Link from "next/link";
import nDynamic from "next/dynamic";
import AgencyCard from "@/components/AgencyCard";
import WorkerHousingStrip from "@/components/WorkerHousingStrip";
import HomepageFAQ from "@/components/HomepageFAQ";
import ApplyBar from "@/components/ApplyBar";
import { AGENCIES, AGENCIES_WITH_HOUSING } from "@/lib/agencyData";
import { getPublishedReviewStats } from "@/lib/reviewStats";
import { getT } from "@/lib/i18n";

const HomepageHeroCalculator = nDynamic(() => import("@/components/HomepageHeroCalculator"), { ssr: false });
const HomepageCalculator     = nDynamic(() => import("@/components/HomepageCalculator"),     { ssr: false });
const HomepageLeadForm       = nDynamic(() => import("@/components/HomepageLeadForm"),       { ssr: false });
const HomepageStickyBar      = nDynamic(() => import("@/components/HomepageStickyBar"),      { ssr: false });

export const metadata: Metadata = {
  title: "Агенция за труд Нидерландия — Проверени отзиви, заплати и жилище 2026",
  description:
    "Сравнете 150+ агенции за труд в Нидерландия. Реална нетна заплата след приспадане на жилище, застраховка и транспорт. Отзиви от работници, жилищни условия и класации. Преди подписване — проверете тук.",
  alternates: {
    canonical: "https://agencycheck.io/bg",
    languages: {
      "en":        "https://agencycheck.io/",
      "pl":        "https://agencycheck.io/pl",
      "ro":        "https://agencycheck.io/ro",
      "pt":        "https://agencycheck.io/pt",
      "sk":        "https://agencycheck.io/sk",
      "bg":        "https://agencycheck.io/bg",
      "x-default": "https://agencycheck.io/",
    },
  },
  openGraph: {
    title: "Агенция за труд Нидерландия — Отзиви, заплати и жилище 2026",
    description:
      "Реални разбивки на заплатите, снимки на жилища и отзиви от работници за 150+ агенции за труд в Нидерландия. Разберете истината, преди да подпишете.",
    locale: "bg_BG",
  },
};

export const dynamic = "force-dynamic";

// ─── Verified job meta (BG) ───────────────────────────────────────────────────
const VERIFIED_JOB_META: Record<string, {
  jobTitle: string; hourlyRate: number; estNetWeekly: number;
  housingCost: number; responseTime: string; sector: string;
}> = {
  "otto-work-force": {
    jobTitle: "Складов работник", hourlyRate: 14.71, estNetWeekly: 316,
    housingCost: 95, responseTime: "< 4 часа", sector: "Логистика",
  },
  "covebo": {
    jobTitle: "Производствен работник", hourlyRate: 15.50, estNetWeekly: 338,
    housingCost: 92, responseTime: "< 6 часа", sector: "Хранително-вкусова промишленост",
  },
  "foreignflex": {
    jobTitle: "Работник на монтажна линия", hourlyRate: 14.71, estNetWeekly: 322,
    housingCost: 88, responseTime: "< 8 часа", sector: "Производство",
  },
};

// ─── Salary breakdown rows (BG) ───────────────────────────────────────────────
const SALARY_ROWS = [
  { label: "Брутна заплата (WML €14,71 × 40ч)", amount: "+€588", green: true,  bold: false },
  { label: "Данъци и осигуровки (loonheffing)",  amount: "−€63",  green: false, bold: false },
  { label: "Жилище от агенцията (норма SNF)",    amount: "−€95",  green: false, bold: false },
  { label: "Здравна застраховка",                amount: "−€35",  green: false, bold: false },
  { label: "Транспорт (автобус на агенцията)",   amount: "−€25",  green: false, bold: false },
  { label: "Административни такси",              amount: "−€25",  green: false, bold: false },
  { label: "💶 Задържате",                      amount: "€345",  green: true,  bold: true  },
] as const;

// ─── Hidden deductions (BG) ───────────────────────────────────────────────────
const HIDDEN_DEDUCTIONS = [
  {
    icon: "🚌",
    label: "Надплатен транспорт",
    amount: "€40–€60/мес. допълнително",
    detail: "Автобусът на агенцията струва €25–€30/седмица — но някои агенции начисляват €40+. Понякога таксите се начисляват дори когато пътувате сами.",
  },
  {
    icon: "🏠",
    label: "Незаконни такси за жилище",
    amount: "€50–€100/мес. откраднати",
    detail: "Максималната такса SNF за сертифицирани споделени стаи е €113,50/седмица. Много агенции начисляват €120–€140. Надплащането е просто незаконно.",
  },
  {
    icon: "⏱",
    label: "Незаплатени извънредни часове",
    amount: "€80–€200/мес. изгубени",
    detail: "Отработените часове не се появяват на фиша. Надбавките за уикенди и неделя просто изчезват.",
  },
  {
    icon: "📄",
    label: "Неясни удръжки",
    amount: "€20–€80/мес. липсват",
    detail: "Спално бельо, почистване, администрация — такси добавени след подписването на договора, отсъстващи в оригиналния контракт.",
  },
];

// ─── Worker testimonials ──────────────────────────────────────────────────────
const WORKER_TESTIMONIALS = [
  {
    quote: "Agency told me salary is €550 per week. After they take room and transport I got only €310. Nobody explain this before I sign. I was shock.",
    name: "Mariusz K.",
    from: "Полша",
    job: "Складов работник, Ротердам",
    flag: "🇵🇱",
    rating: 2,
  },
  {
    quote: "Housing was €95 per week they say. But in contract was also €18 admin fee, €12 for bedding, €7 for cleaning. Every week new charge. I never understand my loonstrook.",
    name: "Bogdan T.",
    from: "Румъния",
    job: "Производствена линия, Айндховен",
    flag: "🇷🇴",
    rating: 1,
  },
  {
    quote: "I work here 3 years already, with good agency now. My first agency was terrible. Use this site please. Check the real reviews. I wish someone tell me before.",
    name: "Olena V.",
    from: "Украйна",
    job: "Оранжерия, Уестланд",
    flag: "🇺🇦",
    rating: 5,
  },
];

// ─── Worker problems (BG) ─────────────────────────────────────────────────────
const WORKER_PROBLEMS = [
  { icon: "💸", title: "Скрити удръжки от заплатата",    freq: "68% от работниците",
    body: "Жилище, застраховка, транспорт и административни такси, приспаднати директно от брутото — често без обяснение във фиша." },
  { icon: "⏱", title: "Незаплатени извънредни часове",   freq: "41% от работниците",
    body: "Отработените часове не се появяват на фиша. Цели уикенди и неделни надбавки просто изчезват." },
  { icon: "🏠", title: "Пренаселено жилище",              freq: "34% от работниците",
    body: "4 души в стая за 2. Плащане на €95+/седмица за такива условия нарушава жилищните норми SNF." },
  { icon: "🌡", title: "Мухъл и липса на отопление",     freq: "22% от работниците",
    body: "Нидерландското право гарантира годни за обитаване условия. Въпреки това докладите за мухъл, развалено отопление и влага са чести." },
  { icon: "🚌", title: "Транспортни измами",              freq: "29% от работниците",
    body: "Начисляват €25–€40/седмица за автобуси, ненадеждни или препълнени. Някои агенции начисляват такса дори когато пътувате сами." },
];

function StarRating({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} viewBox="0 0 20 20" fill="currentColor"
          className={`w-3.5 h-3.5 ${s <= Math.round(value) ? "text-amber-400" : "text-gray-200"}`}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

export default async function BgHomePage() {
  const t             = await getT("bg");
  const totalAgencies = AGENCIES.length;
  const housingCount  = AGENCIES_WITH_HOUSING.length;
  const reviewStats   = await getPublishedReviewStats();
  const totalReviews  = reviewStats.total || 111;

  const housingAgencies = AGENCIES_WITH_HOUSING.slice(0, 3);
  const topAgencies     = AGENCIES_WITH_HOUSING.slice(0, 6);

  return (
    <div className="min-h-screen bg-white">

      {/* ════════════════════════════════════════════════════════════
          §1  HERO
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto text-center">

            {/* Live job alert */}
            <Link href="/apply/reachtruck"
              className="group mb-6 inline-flex items-center gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/20 active:scale-[0.98] px-4 py-3 transition-all duration-150">
              <span className="relative flex-shrink-0">
                <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-40" />
                <span className="relative flex h-2.5 w-2.5 rounded-full bg-amber-400" />
              </span>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-0.5">
                  Наемаме сега · Незабавно начало
                </div>
                <div className="text-white font-semibold text-[13px] leading-tight">
                  Водач на реачтрак — Валвайк&nbsp;&nbsp;·&nbsp;&nbsp;€16,50/ч&nbsp;&nbsp;·&nbsp;&nbsp;Само ЕС
                </div>
              </div>
              <span className="flex-shrink-0 text-[12px] font-bold text-amber-300 group-hover:text-amber-200 whitespace-nowrap">
                Кандидатствай →
              </span>
            </Link>

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium mb-6">
              🇧🇬 Български · {totalAgencies} агенции · {housingCount} с жилище · Без спонсорство
            </div>
            <h1 className="text-3xl sm:text-5xl font-black leading-tight mb-4">
              {t("homepage.hero_gross")}
              <br />
              <span className="text-emerald-400">{t("homepage.hero_net")}</span>
            </h1>
            <p className="text-brand-200 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              {t("homepage.hero_sub")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <Link href="/jobs-with-accommodation"
                className="px-7 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-black text-sm transition shadow-lg shadow-emerald-900/40 active:scale-[0.98]">
                {t("homepage.cta_housing")}
              </Link>
              <a href="#calculator"
                className="px-7 py-3.5 bg-white/10 border border-white/20 hover:bg-white/15 text-white rounded-xl font-bold text-sm transition active:scale-[0.98]">
                {t("homepage.cta_salary")}
              </a>
            </div>

            {/* Mini trust strip */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-brand-300">
              {[
                `${totalAgencies}+ агенции оценени`,
                `${totalReviews}+ отзива от работници`,
                `${housingCount} проверени жилища`,
                "Без платени класации",
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-black">✓</span>{item}
                </span>
              ))}
            </div>
          </div>

          {/* Hero calculator */}
          <div id="calculator" className="mt-10 max-w-2xl mx-auto">
            <HomepageHeroCalculator />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §2  REALITY CHECK — salary breakdown
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-amber-50 border-y border-amber-200 px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-black uppercase tracking-wider text-amber-600 mb-3">
            {t("homepage.reality_label")}
          </p>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">{t("homepage.reality_headline")}</h2>
          <p className="text-sm text-gray-600 mb-6 max-w-xl">{t("homepage.reality_sub")}</p>

          <div className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-sm max-w-lg">
            {SALARY_ROWS.map((row, i) => (
              <div key={i}
                className={`flex items-center justify-between px-5 py-3.5 text-sm border-b border-gray-100 last:border-0 ${row.bold ? "bg-green-50" : ""}`}>
                <span className={row.bold ? "font-black text-gray-900" : "text-gray-700"}>{row.label}</span>
                <span className={`font-black tabular-nums ${row.green ? "text-green-700" : "text-red-600"}`}>
                  {row.amount}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 text-sm text-gray-500 max-w-lg">
            <p>* Илюстративна оценка при минимална заплата (WML) 40 часа. Реалната нетна заплата зависи от агенцията, вида работа и личните обстоятелства.</p>
          </div>

          <div className="mt-4">
            <Link href="/tools/real-income-calculator"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-900">
              🧮 {t("homepage.reality_cta")}
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §3  HIDDEN DEDUCTIONS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
          <div className="text-center mb-9">
            <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">
              Как агенциите намаляват заплатата ви
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
              4 начина, по които агенциите намаляват заплащането ви
            </h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
              Въз основа на {totalReviews}+ верифицирани доклади от работници. Знаенето ви защитава преди подписване.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {HIDDEN_DEDUCTIONS.map((item) => (
              <div key={item.label}
                className="rounded-2xl border border-red-100 bg-red-50/30 p-6 hover:border-red-200 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs font-black text-red-600 bg-red-50 border border-red-100 rounded-full px-3 py-1 whitespace-nowrap">
                    {item.amount}
                  </span>
                </div>
                <h3 className="text-sm font-black text-gray-900 mb-2">{item.label}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/tools/payslip-checker"
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 transition-colors px-7 py-3.5 text-sm font-black text-white shadow-sm active:scale-[0.98]">
              📄 Проверете своя фиш за заплата →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §4  WORKER TESTIMONIALS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-surface-hero text-white border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center mb-9">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Гласове на работниците</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Какво казват работниците след първото плащане
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {WORKER_TESTIMONIALS.map((t_item) => (
              <div key={t_item.name}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col">
                <StarRating value={t_item.rating} />
                <blockquote className="mt-4 text-sm text-gray-300 leading-relaxed flex-1">
                  &ldquo;{t_item.quote}&rdquo;
                </blockquote>
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-3">
                  <span className="text-xl">{t_item.flag}</span>
                  <div>
                    <p className="text-xs font-black text-white">{t_item.name}</p>
                    <p className="text-[11px] text-gray-400">{t_item.from} · {t_item.job}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-7 text-center">
            <Link href="/reviews"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-300 hover:text-white transition-colors">
              ⭐ Прочетете всички отзиви от работници →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §5  LEAD FORM
          ════════════════════════════════════════════════════════════ */}
      <section id="lead-form" className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Безплатно свързване</p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
              Намерете своята проверена агенция
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Свързваме ви безплатно. Агенциите плащат на нас — никога на вас.
            </p>
          </div>
          <ApplyBar
            context={{ sourcePage: "/bg", sourceType: "general_apply" }}
            showInline
            inlineLabel={t("apply_bar.headline")}
          />
          <HomepageLeadForm />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §6  SALARY CALCULATOR
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">
              Безплатен калкулатор
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
              Изчислете реалния си нетен доход
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Официални данъчни таблици 2026 · Удръжки ABU CAO · Лимити за жилище SNF
            </p>
          </div>
          <HomepageCalculator />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §7  TRUST / HOW IT WORKS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="text-center mb-7">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
              Как работи AgencyCheck
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              {t("homepage.section_trust")}
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 mb-6">
            {[
              { icon: "💰", title: t("homepage.trust_1_title"), desc: t("homepage.trust_1_desc") },
              { icon: "⭐", title: t("homepage.trust_2_title"), desc: t("homepage.trust_2_desc") },
              { icon: "📸", title: t("homepage.trust_3_title"), desc: t("homepage.trust_3_desc") },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-white border border-gray-100 p-5 text-center shadow-sm">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-black text-gray-900 mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50/40 px-5 py-4">
            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>Прозрачност:</strong> Партньорските агенции в услугата за свързване не получават по-високи оценки или предпочитано позициониране в резултатите от търсене.
              Нашите класации се изчисляват изключително въз основа на верифицирани доклади от работници. Можете да{" "}
              <Link href="/methodology" className="underline hover:text-amber-700">прочетете нашата методология</Link>{" "}
              и{" "}
              <Link href="/reviews" className="underline hover:text-amber-700">да разглеждате всички нефилтрирани отзиви</Link>{" "}
              — включително отрицателните — по всяко време.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §8  STATS STRIP
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-brand-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-black">{totalAgencies}+</p>
              <p className="text-xs text-brand-300 mt-1">{t("homepage.stats_agencies")}</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black">{totalReviews}+</p>
              <p className="text-xs text-brand-300 mt-1">{t("homepage.stats_reviews")}</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black">{housingCount}</p>
              <p className="text-xs text-brand-300 mt-1">{t("homepage.stats_housing")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §9  WORKER PROBLEMS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center mb-10">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-red-500">
              {t("homepage.common_issues_title")}
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-4">
              {t("homepage.common_issues_subtitle")}
            </h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
              Въз основа на {totalReviews}+ верифицирани доклади от работници. Знаенето ви защитава преди подписване.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {WORKER_PROBLEMS.map((p, i) => (
              <div key={p.title}
                className={`rounded-2xl border p-6 ${i === 0 ? "border-red-100 bg-red-50/40" : "border-gray-100 bg-gray-50 hover:border-red-100 hover:bg-red-50/20 transition-colors"}`}>
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="text-base font-black text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{p.body}</p>
                <span className="inline-block text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-full px-3 py-1">
                  ⚠ {p.freq}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/reviews"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors px-7 py-3.5 text-sm font-bold text-gray-700 shadow-sm">
              📋 Прочетете реалния опит на работниците →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §10  HOUSING PROOF
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center mb-9">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
              Реално жилище — не проспекти
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
              Вижте къде наистина ще живеете
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Снимки и описания, изпратени от работници. Без стокови снимки. Без PR на агенциите.
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8">
            <WorkerHousingStrip />
          </div>
          <div className="mt-6 text-center">
            <Link href="/agencies-with-housing"
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100 transition-colors">
              Прегледайте всички {housingCount} агенции с жилище →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §11  VERIFIED AGENCY CARDS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center mb-9">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
              Проверени агенции
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
              Прозрачни оферти — показан реален нетен доход
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
              Всяка карта показва прогнозния седмичен нетен доход след нидерландски данъци и удръжки.
              Без завишени брутни числа.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mb-10">
            {housingAgencies.map((agency) => {
              const meta = VERIFIED_JOB_META[agency.slug];
              return (
                <div key={agency.slug}
                  className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col group">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-5 py-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                          {meta?.sector ?? "Трудови услуги"}
                        </span>
                        <h3 className="text-base font-black text-white leading-tight truncate">
                          {meta?.jobTitle ?? "Склад / Производство"}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">📍 {agency.city}</p>
                      </div>
                      <span className="shrink-0 text-[9px] font-black uppercase tracking-wider text-blue-300 bg-blue-400/15 border border-blue-400/20 rounded-full px-2 py-1 whitespace-nowrap">
                        🔍 Проверено
                      </span>
                    </div>
                    <Link href={`/agencies/${agency.slug}`}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors group-hover:underline">
                      {agency.name} →
                    </Link>
                  </div>
                  <div className="px-5 py-4 flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5 text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Часова ставка</p>
                        <p className="text-lg font-black text-gray-900">
                          €{(meta?.hourlyRate ?? 14.71).toFixed(2)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2.5 text-center">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Прибл. нетно/седм.</p>
                        <p className="text-lg font-black text-emerald-700">
                          €{meta?.estNetWeekly ?? 316}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs text-gray-500">
                      <div className="flex items-center justify-between">
                        <span>🏠 Цена на жилище</span>
                        <span className="font-bold text-gray-700">€{meta?.housingCost ?? 95}/седм.</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>⭐ Оценка от работници</span>
                        <StarRating value={agency.avgSalaryRating ?? 3.5} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>⚡ Време за отговор</span>
                        <span className="font-bold text-gray-700">{meta?.responseTime ?? "< 24 часа"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
                    <ApplyBar
                      context={{
                        sourcePage:           "/bg",
                        sourceType:           "agency_page",
                        sourceLabel:          `BG Homepage agency card — ${agency.slug}`,
                        defaultAccommodation: true,
                      }}
                      ctaText="Изпратете запитване"
                      buttonOnly
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* All housing agencies grid */}
          <div className="grid gap-4 sm:grid-cols-3 mb-7">
            {topAgencies.map((agency) => (
              <AgencyCard key={agency.slug} agency={agency} locale="bg" />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link href="/agencies-with-housing"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors px-8 py-4 text-sm font-black text-white shadow-sm">
              🏢 Всички {housingCount} агенции с жилище
            </Link>
            <Link href="/agencies" className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
              Всички {totalAgencies} агенции →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §12  PAYSLIP TOOL CTA
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950 text-white border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/15 border border-amber-400/20 rounded-full px-3 py-1 mb-5">
                  ⚡ Безплатен инструмент
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-4">
                  Платила ли ви е агенцията по-малко?
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  Качете нидерландския си фиш за заплата (<em>loonstrook</em>) и ние ще проверим всяка позиция
                  спрямо официалните данъчни таблици за 2026 и нормите CAO ABU/NBBU.
                </p>
                <p className="text-gray-400 text-xs leading-relaxed mb-6">
                  Проверяваме: правилни данъчни прагове · приложени облекчения heffingskorting ·
                  лимити за удръжки за жилище SNF · извънредни бонуси · изчисление на vakantiegeld.
                </p>
                <Link href="/tools/payslip-checker"
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 transition-colors px-7 py-3.5 text-sm font-black text-white shadow-sm active:scale-[0.98]">
                  📄 Качете фиш за заплата — проверете сега
                </Link>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Какво проверяваме</p>
                <ul className="space-y-2.5">
                  {[
                    { ok: true,  label: "Правилни прагове на loonheffing приложени" },
                    { ok: true,  label: "Изчислено облекчение heffingskorting" },
                    { ok: true,  label: "Удръжка за жилище ≤ максимум SNF" },
                    { ok: true,  label: "Бонуси за извънреден труд (100%, 125%, 150%)" },
                    { ok: true,  label: "Vakantiegeld ≥ 8% от брутното заплащане" },
                    { ok: false, label: "Фалшиви удръжки или необяснени такси" },
                  ].map((item) => (
                    <li key={item.label} className="flex items-center gap-3 text-sm">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${item.ok ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                        {item.ok ? "✓" : "✗"}
                      </span>
                      <span className="text-gray-300">{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SEO CONTENT + QUICK LINKS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">Наръчник за работниците</p>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-5 leading-tight">
                Всичко, което трябва да знаете преди работа в Нидерландия
              </h2>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>
                  Нидерландската минимална заплата (<em>Wettelijk Minimumloon</em>) е{" "}
                  <strong className="text-gray-900">€14,71/час през 2026</strong> за работници
                  на 21+ години. При 40 часа седмично това е брутно точно €588/седмица.
                  Но след нидерландски данък върху доходите, наем от агенцията, здравна застраховка
                  и транспорт повечето работници запазват между{" "}
                  <strong className="text-gray-900">€300–€370</strong> —
                  около 50–63% от брутото, в зависимост от агенцията.
                </p>
                <p>
                  Ключови правни защити, които трябва да знаете: <strong className="text-gray-900">ABU / NBBU CAO</strong>{" "}
                  регулира ставките на заплащане, бонусите за извънреден труд и ваканционното заплащане.
                  <strong className="text-gray-900"> SNF</strong> (Stichting Normering Flexwonen) определя максималните законни
                  удръжки за жилище. <strong className="text-gray-900">Inspectie SZW</strong> прилага цялото трудово право.
                  AgencyCheck проверява агенциите спрямо и трите.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Бърз достъп</p>
              {[
                { icon: "💶", href: "/tools/real-income-calculator",       title: "Калкулатор на нетна заплата",     desc: "Заплата след удръжки с всички данъчни облекчения 2026" },
                { icon: "📄", href: "/tools/payslip-checker",              title: "Проверка на фиш за заплата",      desc: "Качете loonstrook и проверете грешките" },
                { icon: "🏢", href: "/agencies",                           title: "Всички агенции в Нидерландия",    desc: `${totalAgencies} агенции класирани по отзиви от работници` },
                { icon: "🏠", href: "/agencies-with-housing",              title: "Работа с жилище",                  desc: `${housingCount} проверени агенции с жилище` },
                { icon: "⭐", href: "/reviews",                            title: "Отзиви от работници",              desc: `${totalReviews}+ реални анонимни отзива` },
                { icon: "📋", href: "/work-in-netherlands-for-foreigners", title: "Права и правен наръчник",          desc: "ABU CAO, WML, SNF — обяснено просто" },
              ].map((item) => (
                <Link key={item.href} href={item.href}
                  className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-100 transition-colors p-4 group">
                  <span className="text-xl mt-0.5">{item.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-snug truncate">{item.desc}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors ml-auto mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FAQ
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center mb-10">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">FAQ</p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              Въпроси, които работниците наистина задават
            </h2>
          </div>
          <HomepageFAQ />
          <div className="mt-8 text-center">
            <Link href="/work-in-netherlands-for-foreigners"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
              📖 Пълен наръчник: Работа в Нидерландия →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FINAL CTA
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-blue-900 via-blue-950 to-gray-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-18 sm:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-5">
              Разберете истината<br />преди да подпишете.
            </h2>
            <p className="text-blue-200 text-base sm:text-lg leading-relaxed mb-4 max-w-lg mx-auto">
              {totalAgencies} агенции. {totalReviews}+ отзива от работници. Реални разбивки на заплатите.
              Без платени класации. Създадено за работниците — не за рекрутерите.
            </p>
            <p className="text-xs text-blue-400 mb-9">
              ✓ Без платени класации &nbsp;·&nbsp; ✓ Агенциите не могат да купят по-добри оценки &nbsp;·&nbsp;
              ✓ Оценките са изцяло от работници &nbsp;·&nbsp; ✓ Партньорският статус никога не влияе на резултатите
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <a href="#lead-form"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/40 active:scale-[0.98]">
                Намерете оферта — безплатно →
              </a>
              <a href="#calculator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/8 hover:bg-white/15 transition-colors px-8 py-4 text-base font-bold text-gray-200 active:scale-[0.98]">
                🧮 Изчислете заплатата ми
              </a>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-blue-400">
              <Link href="/agencies"                     className="hover:text-white transition-colors">Всички агенции</Link>
              <span className="text-blue-800">·</span>
              <Link href="/reviews"                      className="hover:text-white transition-colors">Отзиви от работници</Link>
              <span className="text-blue-800">·</span>
              <Link href="/agencies-with-housing"        className="hover:text-white transition-colors">Работа с жилище</Link>
              <span className="text-blue-800">·</span>
              <Link href="/tools/real-income-calculator" className="hover:text-white transition-colors">Калкулатор на заплата</Link>
              <span className="text-blue-800">·</span>
              <Link href="/methodology"                  className="hover:text-white transition-colors">Методология</Link>
              <span className="text-blue-800">·</span>
              <Link href="/privacy"                      className="hover:text-white transition-colors">Поверителност</Link>
            </nav>
          </div>
        </div>
      </section>

      <HomepageStickyBar />
    </div>
  );
}
