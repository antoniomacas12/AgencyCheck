import type { Metadata } from "next";
import Link from "next/link";
import nDynamic from "next/dynamic";
import AgencyCard from "@/components/AgencyCard";
import WorkerHousingStrip from "@/components/WorkerHousingStrip";
import HomepageFAQ from "@/components/HomepageFAQ";
import ApplyBar from "@/components/ApplyBar";
import { AGENCIES, AGENCIES_WITH_HOUSING, AGENCY_MAP } from "@/lib/agencyData";
import { TOP_CITIES } from "@/lib/seoData";
import { getLatestReviews } from "@/lib/reviewData";
import { getPublishedReviewStats } from "@/lib/reviewStats";
import { JOB_TYPE_META, getJobCountForAgency } from "@/lib/jobData";
import { RANDSTAD_STATS } from "@/lib/randstadData";
import { TEMPO_TEAM_STATS } from "@/lib/tempoTeamData";
import type { SearchSuggestion } from "@/components/SmartSearch";
import SmartSearch from "@/components/SmartSearch";
import { organizationSchema, webSiteSchema, breadcrumbSchema, faqPageSchema } from "@/lib/schemaMarkup";
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

// ─── Worker testimonials (BG) ─────────────────────────────────────────────────
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
    quote: "Housing was €95 per week they say. But in contract was also €18 admin fee, €12 for bedding, €7 for cleaning. Every week new charge.",
    name: "Bogdan T.",
    from: "Румъния",
    job: "Производствена линия, Айндховен",
    flag: "🇷🇴",
    rating: 1,
  },
  {
    quote: "I work here 3 years already, with good agency now. My first agency was terrible. Use this site please. I wish someone tell me before.",
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

  const searchSuggestions: SearchSuggestion[] = [
    ...AGENCIES.map((a) => ({ type: "agency" as const, label: a.name, sublabel: a.city, href: `/agencies/${a.slug}` })),
    ...TOP_CITIES.map((c) => ({ type: "city" as const, label: c.name, sublabel: c.region, href: `/cities/${c.slug}` })),
    ...Object.entries(JOB_TYPE_META).map(([slug, meta]) => ({ type: "job" as const, label: meta.title, sublabel: "Тип работа", href: `/jobs/${slug}` })),
    { type: "job" as const, label: "Оферти Randstad",    sublabel: `${RANDSTAD_STATS.total} оферти`,  href: "/randstad-jobs" },
    { type: "job" as const, label: "Оферти Tempo-Team",  sublabel: `${TEMPO_TEAM_STATS.total} оферти`, href: "/tempo-team-jobs" },
  ];

  const orgSchema    = organizationSchema();
  const siteSchema   = webSiteSchema();
  const crumbSchema  = breadcrumbSchema([{ name: "Начало", url: "/bg" }]);
  const faqSchema    = faqPageSchema([
    { question: "Колко реално ще спечеля след удръжките в Нидерландия?", answer: "При минималната заплата (€14,71/ч, 40ч/седмица) брутото е €588/седмица. След нидерландски данъци, жилище от агенцията (~€95/седмица), транспорт и здравна застраховка, повечето работници задържат €300–€370/седмица — около 51–63% от брутото." },
    { question: "Законни ли са удръжките от заплатата от страна на агенцията в Нидерландия?", answer: "Да — но само в границите, определени от CAO ABU и NBBU. Агенциите могат да приспадат разходи за жилище, транспорт и здравна застраховка, но сумите трябва да са посочени в договора. Удръжки над договорените цени са незаконни. Нарушенията се докладват на Inspectie SZW." },
    { question: "Каква е минималната заплата в Нидерландия през 2026 г.?", answer: "Нидерландската законова минимална заплата (WML) е €14,71 на час през 2026 г. за работници на 21+ години. При 40 работни часа седмично това е около €2.545/месец брuto. Агенциите са законово задължени да плащат поне WML, независимо от националността." },
    { question: "Как да проверя дали нидерландска агенция за труд е легитимна?", answer: "Проверете регистрацията SNA или членството в ABU/NBBU и потвърдете номера KvK. В AgencyCheck профилите на агенциите показват статуса на верификация, оценките на работниците и жилищните условия. Предупредителни знаци: искане за депозит, липса на писмен договор, натиск за незабавно начало." },
    { question: "Колко струва жилището при работа през агенция в Нидерландия?", answer: "Жилището от агенцията обикновено струва €80–€113,50/седмица, приспаднати от брутната заплата. Максималното законово приспадане SNF за сертифицирани споделени стаи е €113,50/седмица (2024). Собственото жилище в Нидерландия струва €500–€900/месец в зависимост от града." },
    { question: "Какво да направя, ако агенцията не ми плаща правилно?", answer: "Поискайте пълен фиш за заплата (loonstrook) и сравнете всяка позиция с подписания договор. При несъответствия: свържете се писмено с агенцията, докладвайте на Inspectie SZW (inspectieszw.nl), свържете се с профсъюзите FNV или CNV, а за жилището — с SNF." },
  ]);

  return (
    <div className="min-h-screen bg-white">

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema)   }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema)  }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema)   }} />

      {/* ════════════════════════════════════════════════════════════
          §1  HERO
          ════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-hero-depth text-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "48px 48px" }}
          aria-hidden="true" />
        <div className="pointer-events-none absolute -top-32 left-1/4 w-[600px] h-[400px] rounded-full bg-blue-700/10 blur-3xl" aria-hidden="true" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-14 sm:pt-20 sm:pb-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3.5 py-1.5 text-[10px] font-bold tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  🇧🇬 Български · Без платени класации
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-[10px] font-bold tracking-widest uppercase text-blue-300">
                  🏗 Създадено за работници на агенции в Нидерландия
                </div>
              </div>

              <Link href="/apply/reachtruck"
                className="group mb-5 flex items-center gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/20 active:scale-[0.98] px-4 py-3 transition-all duration-150">
                <span className="relative flex-shrink-0">
                  <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-40" />
                  <span className="relative flex h-2.5 w-2.5 rounded-full bg-amber-400" />
                </span>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-0.5">Наемаме сега · Незабавно начало</div>
                  <div className="text-white font-semibold text-[13px] leading-tight">Водач на реачтрак — Валвайк&nbsp;·&nbsp;€16,50/ч&nbsp;·&nbsp;Само ЕС</div>
                </div>
                <span className="flex-shrink-0 text-[12px] font-bold text-amber-300 group-hover:text-amber-200 whitespace-nowrap">Кандидатствай →</span>
              </Link>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-black leading-[1.06] tracking-tight mb-4">
                {t("homepage.hero_gross")}{" "}
                <span className="text-emerald-400">€588/седмица.</span>
                <br />
                В действителност задържате{" "}
                <span className="text-red-400">€345.</span>
              </h1>

              <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6">
                {[
                  { value: `${totalReviews} отзива от работници`,   note: "38 проверени · 73 анонимни" },
                  { value: "42% дават оценка 1–2 звезди",            note: "публикувани без филтриране" },
                  { value: "€63/седм. реален данък",                  note: "източник: belastingdienst.nl 2026" },
                  { value: `${totalAgencies} агенции в базата`,       note: "от публични регистри" },
                ].map((s) => (
                  <div key={s.value} className="flex items-baseline gap-1.5">
                    <span className="text-[11px] font-black text-white">{s.value}</span>
                    <span className="text-[10px] text-gray-500">{s.note}</span>
                  </div>
                ))}
              </div>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
                Жилище, застраховка, транспорт и административни такси се приспадат, преди да получите заплатата.
                Разберете <strong className="text-white">реалния си нетен доход</strong>, сравнете агенциите
                и бъдете свързани с проверени оферти —{" "}
                <strong className="text-emerald-400">безплатно, без ангажименти</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <a href="#lead-form"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] transition-all px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/50">
                  Намери оферта — безплатно →
                </a>
                <a href="#calculator"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/6 hover:bg-white/12 active:scale-[0.98] transition-all px-8 py-4 text-base font-semibold text-gray-200">
                  🧮 Изчисли моята заплата
                </a>
              </div>

              <SmartSearch suggestions={searchSuggestions} size="large" placeholder="Търсете агенция, град или тип работа…" />
            </div>

            <div className="lg:flex lg:justify-end">
              <HomepageHeroCalculator />
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §2  TRUST EVIDENCE PANEL
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-surface-muted border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-7">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-0 sm:flex sm:items-start sm:justify-center sm:divide-x sm:divide-white/10 mb-5">
            {[
              { value: `${totalReviews}`, label: "ревюта от работници",          sub: "38 проверени · 73 докладвани · 42% дават 1–2 звезди", color: "text-emerald-400" },
              { value: "15",              label: "грешки в платежни ведомости",   sub: "проверени спрямо CAO ABU/NBBU и лимитите SNF",        color: "text-red-400" },
              { value: `${totalAgencies}`, label: "агенции в базата",             sub: "всяка проверена в регистрите KvK · ABU · SNA",         color: "text-amber-400" },
              { value: "€0",              label: "платено за по-добра позиция",   sub: "нито една агенция не е платила за по-добро място",    color: "text-blue-400" },
            ].map((stat) => (
              <div key={stat.label} className="sm:px-7 first:pl-0 last:pr-0">
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className={`text-2xl sm:text-3xl font-black tabular-nums ${stat.color}`}>{stat.value}</span>
                  <span className="text-xs font-bold text-gray-300">{stat.label}</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-snug max-w-[200px]">{stat.sub}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-4">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 shrink-0">Източници на данни:</span>
              {[
                { label: "Данъчно право НЛ",    cite: "belastingdienst.nl 2026",       href: "https://www.belastingdienst.nl/", color: "text-blue-400" },
                { label: "Лимити за жилище",     cite: "SNF Normering Flexwonen 2024",  href: "https://www.snf.nl/",             color: "text-emerald-400" },
                { label: "Норми CAO",             cite: "ABU/NBBU CAO 2023–2025",        href: "https://www.abu.nl/",             color: "text-amber-400" },
                { label: "Регистър агенции",      cite: "публичен регистър SNA",         href: "https://www.normeringarbeid.nl/", color: "text-purple-400" },
                { label: "Инспекция по труда",    cite: "Inspectie SZW",                 href: "https://www.inspectieszw.nl/",    color: "text-gray-400" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] hover:opacity-80 transition-opacity">
                  <span className="text-gray-500">{s.label}:</span>
                  <span className={`font-bold ${s.color}`}>{s.cite} ↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §3  MONEY-LOSS FRAMING
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">
          <div className="text-center mb-10">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-red-500">Скрити разходи при работа през агенция</p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-4">
              Повечето работници губят{" "}
              <span className="text-red-500">€300–€500 на месец</span>{" "}
              от скрити удръжки
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Тези удръжки често не се споменават преди подписването на договора — и много от тях са частично или напълно незаконни.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {HIDDEN_DEDUCTIONS.map((item) => (
              <div key={item.label} className="rounded-2xl border border-red-100 bg-red-50/30 p-5 hover:border-red-200 hover:bg-red-50/60 transition-colors">
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <h3 className="text-sm font-black text-gray-900 mb-1">{item.label}</h3>
                <p className="text-xs font-bold text-red-600 mb-2">{item.amount}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>

          {/* Salary comparison bar */}
          <div className="max-w-3xl mx-auto rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden">
            <div className="bg-gray-900 px-6 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Работник WML · €14,71/ч · 40ч/седм. · Жилище + транспорт от агенцията
              </p>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-gray-600">Какво рекламира агенцията (брутно)</span>
                  <span className="text-sm font-black text-gray-900">€588/седмица</span>
                </div>
                <div className="h-3 rounded-full bg-gray-200 w-full" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-gray-600">След нидерландски данъци (с heffingskorting облекчения)</span>
                  <span className="text-sm font-black text-gray-700">€525/седмица</span>
                </div>
                <div className="h-3 rounded-full bg-amber-300" style={{ width: "89%" }} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-red-700">Какво реално получавате</span>
                  <span className="text-sm font-black text-red-600">€345/седмица</span>
                </div>
                <div className="h-3 rounded-full bg-red-400" style={{ width: "59%" }} />
              </div>
            </div>
            <div className="px-6 pb-4 flex items-center justify-between">
              <p className="text-[11px] text-gray-400">
                Удръжки: €63 данък + €95 жилище + €35 застраховка + €25 транспорт + €25 адм. такси{" "}
                <Link href="/methodology" className="text-blue-600 underline">Пълна методология →</Link>
              </p>
              <a href="#lead-form"
                className="shrink-0 ml-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors px-5 py-2.5 text-xs font-black text-white active:scale-[0.98]">
                Намери по-добри оферти
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §4  WORKER TESTIMONIALS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">
          <div className="text-center mb-10">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">Реални работници. Реални думи.</p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Какво реално ни казаха работниците</h2>
            <p className="text-xs text-gray-400 font-semibold">Не маркетингови материали · Не PR на агенции · Реални доклади от реални работници</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 mb-8">
            {WORKER_TESTIMONIALS.map((tw) => (
              <div key={tw.name}
                className={`rounded-2xl border p-6 flex flex-col gap-4 ${tw.rating >= 4 ? "border-emerald-100 bg-emerald-50/30" : "border-red-100 bg-red-50/20"}`}>
                <StarRating value={tw.rating} />
                <blockquote className="text-sm text-gray-800 leading-relaxed font-medium italic flex-1">
                  &ldquo;{tw.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <span className="text-2xl">{tw.flag}</span>
                  <div>
                    <p className="text-xs font-black text-gray-900">{tw.name}</p>
                    <p className="text-[11px] text-gray-500">{tw.job}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link href="/reviews"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors px-7 py-3.5 text-sm font-bold text-gray-700 shadow-sm">
              📋 Прочети всички {totalReviews} отзива
            </Link>
            <Link href="/submit-review" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
              ✍️ Споделете своя опит →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §5  LEAD FORM
          ════════════════════════════════════════════════════════════ */}
      <section id="lead-form" className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1.5">Безплатно свързване — без такси, без ангажименти</p>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">Намерете проверена агенция, която показва реалните удръжки</h2>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-xl">
                <span className="font-semibold text-gray-700">Прозрачни удръжки</span> ·{" "}
                <span className="font-semibold text-gray-700">Проверено жилище</span> ·{" "}
                <span className="font-semibold text-gray-700">Реални отзиви от работници</span>{" "}
                — свързваме ви само с агенции, преминали нашата проверка.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              {["Без платени класации", "Съответствие с GDPR", "Безплатно свързване"].map((b) => (
                <span key={b} className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
                  <span className="text-emerald-500">✓</span> {b}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 sm:p-7 shadow-sm">
            <HomepageLeadForm />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §6  SALARY CALCULATOR
          ════════════════════════════════════════════════════════════ */}
      <section id="calculator" className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">
          <div className="text-center mb-9">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">Незабавен калкулатор на заплата — данъчни ставки 2026</p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3">Колко реално ще ви остане от заплатата?</h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Настройте според вашата оферта. Реални нидерландски данъци с всички облекчения heffingskorting.
              Всяка удръжка изчислена в реално време.
            </p>
          </div>
          <HomepageCalculator />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §7  METHODOLOGY TRUST BLOCK
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center mb-8">
            <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">Методология на изчисленията</p>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">Как изчисляваме реалната ви заплата</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-7">
            {[
              {
                icon: "📊",
                title: "Нидерландски данък върху доходите 2026",
                items: [
                  "Данъчни ставки loonheffing (2 нива)",
                  "Algemene heffingskorting — до €3.362/год. облекчение",
                  "Arbeidskorting — до €5.000/год. облекчение",
                  "Ефективна ставка = данък ÷ брuto (след всички облекчения)",
                ],
              },
              {
                icon: "🏠",
                title: "Логика на удръжките за жилище",
                items: [
                  "Жилище от агенцията: €80–€120/седм. (стандарт SNF)",
                  "Собствено жилище: €500–€900/мес. (регионална средна)",
                  "Законен лимит SNF: ~€113,50/седм. за споделени стаи",
                  "Източник: SNF Normering Flexwonen 2024",
                ],
              },
              {
                icon: "🚌",
                title: "Транспорт и застраховка",
                items: [
                  "Автобус на агенцията: средно €25/седм. (докладвано от работници)",
                  "Zorgverzekering: €152–€180/мес. (пазар 2026)",
                  "Eigen risico: средно €33/мес.",
                  "Адм. такси: €0–€20/седм. (посочени от агенциите)",
                ],
              },
            ].map((block) => (
              <div key={block.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <div className="text-2xl mb-3">{block.icon}</div>
                <h3 className="text-sm font-black text-gray-900 mb-3">{block.title}</h3>
                <ul className="space-y-1.5">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-600 leading-snug">
                      <span className="text-emerald-500 font-black mt-0.5 shrink-0">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 items-start">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">Ключови предположения</p>
              <ul className="space-y-2 text-xs text-gray-700">
                {[
                  "Основна заетост в Нидерландия (без прилагане на споразумения за избягване на двойно данъчно облагане)",
                  "48 работни седмици/год. (4 седмици отпуск включени)",
                  "8% vakantiegeld (отпускно) добавено към брутото съгл. BW чл. 7:634",
                  "Неженен работник — без партньорски облекчения или приспадания за грижи за деца",
                  "Стандартна здравна застраховка (без toeslagen помощи)",
                  "WML 2026: €14,71/ч · Актуализирано: януари 2026",
                ].map((a) => (
                  <li key={a} className="flex items-start gap-2">
                    <span className="text-blue-500 font-black shrink-0 mt-0.5">✓</span>{a}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[10px] text-gray-400 leading-relaxed border-t border-blue-100 pt-3">
                <strong className="text-gray-500">Правна забележка:</strong> Изчисленията са само за информационни цели и не представляват данъчен, правен или финансов съвет. Индивидуалните обстоятелства могат да варират. Консултирайте се с belastingadviseur за вашата конкретна ситуация.{" "}
                <Link href="/methodology" className="text-blue-600 underline hover:text-blue-800">Пълна методология →</Link>
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="bg-gray-900 px-5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Пример: Работник WML · €14,71/ч · 40ч/седм. · Реален данък 2026
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {SALARY_ROWS.map((row) => (
                  <div key={row.label}
                    className={`flex items-center justify-between px-5 py-3 ${row.bold ? "bg-gray-900" : "bg-white"}`}>
                    <span className={`text-sm ${row.bold ? "font-black text-white" : "text-gray-600"}`}>{row.label}</span>
                    <span className={`text-sm font-bold ${row.bold ? `text-lg font-black ${row.green ? "text-emerald-400" : "text-red-400"}` : row.green ? "text-emerald-600" : "text-red-500"}`}>
                      {row.amount}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                <p className="text-[10px] text-gray-400">
                  Данък −€63 (реален loonheffing 2026 след облекченията AHK+AK) + €95 жилище + €25 транспорт + €35 застраховка + €25 адм.{" "}
                  <Link href="/methodology" className="text-blue-600 underline">Пълна методология</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §8  SALARY PAIN → CTA
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-surface-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
            Вече знаете реалните числа
          </p>
          <h2 className="text-2xl sm:text-4xl font-black leading-tight mb-4">
            Искате <span className="text-emerald-400">по-добри условия</span> и
            повече пари всяка седмица?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Не всички агенции са еднакви. Някои имат по-ниски такси за жилище, по-бързи фишове и прозрачни договори. Проверяваме кои — и ви свързваме безплатно.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#lead-form"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/40 active:scale-[0.98]">
              Виж проверени оферти →
            </a>
            <Link href="/agencies-with-housing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/8 hover:bg-white/15 transition-colors px-8 py-4 text-base font-bold text-gray-300 active:scale-[0.98]">
              Всички {housingCount} агенции с жилище
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
            {["Без платени класации", "Агенциите не могат да купят по-добра оценка", "Оценките са изцяло от работниците", "Партньорският статус никога не влияе на резултатите"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <span className="text-emerald-500 font-black">✓</span>{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §8b  HOW AGENCYCHECK WORKS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="text-center mb-7">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
              Как работи AgencyCheck — и как печелим
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Честно за това как работи
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                icon: "📋",
                title: "Какво прави AgencyCheck",
                body: "Събираме отзиви от работници, анализираме фишове за заплата и публикуваме независими класации на нидерландски агенции за труд. Не набираме работници — помагаме ви да направите информиран избор.",
              },
              {
                icon: "💰",
                title: "Как печелим",
                body: "Ако използвате нашата услуга за свързване и бъдете успешно наети, агенцията ни плаща хонорар за намиране на кандидат. Тази такса идва от агенцията — никога от вас. Работниците винаги плащат нула.",
              },
              {
                icon: "⚖️",
                title: "Защо класациите остават честни",
                body: "Агенциите не могат да плащат за по-добро място в класацията, за премахване на отзиви или за влияние върху резултатите си. Плащащите агенции не получават никакво предимство при свързването. Само оценките на работниците определят позицията им.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-white border border-gray-100 p-5">
                <div className="text-2xl mb-3">{item.icon}</div>
                <p className="text-sm font-black text-gray-900 mb-2">{item.title}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50/40 px-5 py-4">
            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>Разкриване на конфликт на интереси:</strong> Партньорските агенции за свързване не получават по-високи оценки или предпочитано позициониране в резултатите от търсенето.
              Нашите класации се изчисляват изцяло от проверени доклади на работници. Можете{" "}
              <Link href="/methodology" className="underline hover:text-amber-700">да прочетете пълната ни методология</Link>{" "}
              и{" "}
              <Link href="/reviews" className="underline hover:text-amber-700">да разглеждате всички нефилтрирани отзиви</Link>{" "}
              — включително отрицателните — по всяко време.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §9  WORKER PROBLEMS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">
          <div className="text-center mb-10">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-red-500">Това, което никоя агенция няма да ви каже</p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-4">Типични проблеми, докладвани от работници</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
              Въз основа на {totalReviews}+ проверени доклада от работници. Знаенето ви защитава преди подписване.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {WORKER_PROBLEMS.map((p, i) => (
              <div key={p.title}
                className={`rounded-2xl border p-6 ${i === 0 ? "lg:col-span-1 border-red-100 bg-red-50/40" : "border-gray-100 bg-gray-50 hover:border-red-100 hover:bg-red-50/20 transition-colors"}`}>
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="text-base font-black text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{p.body}</p>
                <span className="inline-block text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-full px-3 py-1">⚠ {p.freq}</span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/reviews"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors px-7 py-3.5 text-sm font-bold text-gray-700 shadow-sm">
              📋 Прочети реалните преживявания на работниците →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §10  HOUSING PROOF
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">
          <div className="text-center mb-9">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">Реално жилище — не рекламни материали</p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3">Вижте къде реално ще живеете</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">Снимки и описания, изпратени от работници. Никакви стокови снимки. Никакъв PR от агенции.</p>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8">
            <WorkerHousingStrip />
          </div>
          <div className="mt-6 text-center">
            <Link href="/agencies-with-housing"
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100 transition-colors">
              Разгледайте всички {housingCount} агенции с жилище →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §11  VERIFIED AGENCY CARDS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">
          <div className="text-center mb-9">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">Проверени агенции</p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3">Прозрачни оферти — показан реален нетен доход</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
              Всяка карта показва прогнозния седмичен нетен доход след нидерландски данъци и удръжки.
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
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{meta?.sector ?? "Трудови услуги"}</span>
                        <h3 className="text-base font-black text-white leading-tight truncate">{meta?.jobTitle ?? "Склад / Производство"}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">📍 {agency.city}</p>
                      </div>
                      <span className="shrink-0 text-[9px] font-black uppercase tracking-wider text-blue-300 bg-blue-400/15 border border-blue-400/20 rounded-full px-2 py-1 whitespace-nowrap">🔍 Проверено</span>
                    </div>
                    <Link href={`/agencies/${agency.slug}`} className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors group-hover:underline">
                      {agency.name} →
                    </Link>
                  </div>
                  <div className="px-5 py-4 flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5 text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Часова ставка</p>
                        <p className="text-lg font-black text-gray-900">€{(meta?.hourlyRate ?? 14.71).toFixed(2)}</p>
                      </div>
                      <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2.5 text-center">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Прогн. нето/седм.</p>
                        <p className="text-lg font-black text-emerald-700">€{meta?.estNetWeekly ?? 316}</p>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs text-gray-500">
                      <div className="flex items-center justify-between">
                        <span>🏠 Цена жилище</span>
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
                      context={{ sourcePage: "/bg", sourceType: "agency_page", sourceLabel: `BG Homepage — ${agency.slug}`, defaultAccommodation: true }}
                      ctaText="Изпрати запитване" buttonOnly
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mb-7">
            {housingAgencies.map((agency) => (
              <AgencyCard key={agency.slug} agency={agency} jobCount={getJobCountForAgency(agency.slug)} locale="bg" />
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
                  Агенцията ви е платила по-малко?
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  Качете нидерландския си фиш за заплата (<em>loonstrook</em>) и ние ще проверим всяка позиция
                  спрямо официалните данъчни таблици 2026 и стандартите CAO ABU/NBBU.
                </p>
                <p className="text-gray-400 text-xs leading-relaxed mb-6">
                  Проверяваме: правилни данъчни ставки · приложени облекчения heffingskorting ·
                  лимити за удръжки за жилище SNF · надбавки за извънреден труд · изчисляване на vakantiegeld.
                </p>
                <Link href="/tools/payslip-checker"
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 transition-colors px-7 py-3.5 text-sm font-black text-white shadow-sm shadow-amber-900/40 active:scale-[0.98]">
                  📄 Качи фиш за заплата — провери сега
                </Link>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Какво проверяваме</p>
                <ul className="space-y-2.5">
                  {[
                    { ok: true,  label: "Правилни ставки loonheffing приложени" },
                    { ok: true,  label: "Изчислено облекчение heffingskorting" },
                    { ok: true,  label: "Удръжка за жилище ≤ законен максимум SNF" },
                    { ok: true,  label: "Надбавки за извънреден труд (100%, 125%, 150%)" },
                    { ok: true,  label: "Vakantiegeld ≥ 8% от брутната заплата" },
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
          SEO CONTENT + CITY GRID
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">Ръководство за работници</p>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-5 leading-tight">
                Всичко, което трябва да знаете преди работа в Нидерландия
              </h2>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>
                  Нидерландската минимална заплата (<em>Wettelijk Minimumloon</em>) е{" "}
                  <strong className="text-gray-900">€14,71/час през 2026 г.</strong> за работници
                  на 21+ години. При 40 часа седмично брутото е точно €588/седмица
                  (€14,71 × 40 часа). Но след нидерландски данък върху доходите, жилище от агенцията, здравна
                  застраховка и транспорт, повечето работници задържат между{" "}
                  <strong className="text-gray-900">€300–€370</strong> —
                  около 50–63% от брутото, в зависимост от агенцията.
                </p>
                <p>
                  Ключови правни защити, които трябва да познавате: <strong className="text-gray-900">ABU / NBBU CAO</strong>{" "}
                  регулира заплатите, надбавките за извънреден труд и платения отпуск.
                  <strong className="text-gray-900"> SNF</strong> (Stichting Normering Flexwonen) определя максималните законни
                  удръжки за жилище. <strong className="text-gray-900">Inspectie SZW</strong> прилага цялото трудово законодателство.
                  AgencyCheck проверява агенциите спрямо всички три.
                </p>
                <p>
                  Нашият{" "}
                  <Link href="/tools/real-income-calculator" className="text-blue-600 underline hover:text-blue-800">калкулатор на заплата</Link>{" "}
                  използва официалните данъчни таблици за 2026 и включва както облекчението <em>algemene heffingskorting</em>, така и{" "}
                  <em>arbeidskorting</em> — облекчения, които могат да спестят на нископлатените работници
                  €600–€700 на месец в данъци, за които много агенции не споменават.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Бърз достъп</p>
              {[
                { icon: "💶", href: "/tools/real-income-calculator",        title: "Пълен калкулатор на заплата",       desc: "Нетна заплата с всички данъчни облекчения за 2026" },
                { icon: "📄", href: "/tools/payslip-checker",               title: "Инструмент за проверка на фиш",     desc: "Качете loonstrook и проверете грешките" },
                { icon: "🏢", href: "/agencies",                            title: "Всички агенции в Нидерландия",      desc: `${totalAgencies} агенции класирани по оценки на работници` },
                { icon: "🏠", href: "/agencies-with-housing",               title: "Работа с жилище",                   desc: `${housingCount} проверени агенции с включено жилище` },
                { icon: "⭐", href: "/reviews",                             title: "Отзиви от работници",               desc: `${totalReviews}+ реални анонимни отзива` },
                { icon: "📋", href: "/work-in-netherlands-for-foreigners",  title: "Права и правно ръководство",        desc: "ABU CAO, WML, SNF — обяснени просто" },
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

          {/* City grid */}
          <div className="pt-8 border-t border-gray-100">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Разгледайте работни оферти по град</p>
            <div className="flex flex-wrap gap-2">
              {TOP_CITIES.slice(0, 18).map((c) => (
                <Link key={c.slug} href={`/jobs-in-${c.slug}`}
                  className="inline-flex items-center text-xs font-medium bg-white border border-gray-200 text-gray-700 rounded-full px-3 py-1.5 hover:border-blue-300 hover:text-blue-700 transition-colors">
                  💼 {c.name}
                </Link>
              ))}
              <Link href="/jobs-in-netherlands"
                className="inline-flex items-center text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700 rounded-full px-3 py-1.5 hover:bg-blue-100 transition-colors">
                🇳🇱 Всички градове →
              </Link>
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
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">ЧЗВ</p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Въпроси, които работниците реално задават</h2>
          </div>
          <HomepageFAQ />
          <div className="mt-8 text-center">
            <Link href="/work-in-netherlands-for-foreigners"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
              📖 Пълно ръководство: Работа в Нидерландия →
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
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-5">Разберете истината<br />преди да подпишете.</h2>
            <p className="text-blue-200 text-base sm:text-lg leading-relaxed mb-4 max-w-lg mx-auto">
              {totalAgencies} агенции. {totalReviews}+ отзива от работници. Реални разбивки на заплатите.
              Без платени класации. Създадено за работници — не за рекрутори.
            </p>
            <p className="text-xs text-blue-400 mb-9">
              ✓ Без платени класации &nbsp;·&nbsp; ✓ Агенциите не могат да купят по-добри оценки &nbsp;·&nbsp;
              ✓ Оценките са изцяло от работниците &nbsp;·&nbsp; ✓ Партньорският статус никога не влияе на резултатите
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <a href="#lead-form"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/40 active:scale-[0.98]">
                Намери оферта — безплатно →
              </a>
              <a href="#calculator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/8 hover:bg-white/15 transition-colors px-8 py-4 text-base font-bold text-gray-200 active:scale-[0.98]">
                🧮 Изчисли моята заплата
              </a>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-blue-400">
              <Link href="/agencies" className="hover:text-white transition-colors">Всички агенции</Link>
              <span className="text-blue-800">·</span>
              <Link href="/reviews" className="hover:text-white transition-colors">Отзиви от работници</Link>
              <span className="text-blue-800">·</span>
              <Link href="/agencies-with-housing" className="hover:text-white transition-colors">Работа с жилище</Link>
              <span className="text-blue-800">·</span>
              <Link href="/tools/real-income-calculator" className="hover:text-white transition-colors">Калкулатор на заплата</Link>
              <span className="text-blue-800">·</span>
              <Link href="/methodology" className="hover:text-white transition-colors">Методология</Link>
              <span className="text-blue-800">·</span>
              <Link href="/privacy" className="hover:text-white transition-colors">Поверителност</Link>
              <span className="text-blue-800">·</span>
              <Link href="/terms" className="hover:text-white transition-colors">Условия</Link>
            </nav>
          </div>
        </div>
      </section>

      <HomepageStickyBar />
    </div>
  );
}
