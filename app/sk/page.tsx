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
  title: "Agentúra práce Holandsko — Overené hodnotenia, zárobky a ubytovanie 2026",
  description:
    "Porovnajte 150+ agentúr práce v Holandsku. Reálny čistý príjem po odpočítaní ubytovanie, poistenia a dopravy. Hodnotenia pracovníkov, podmienky ubytovania a rebríčky. Pred podpisom — skontrolujte tu.",
  alternates: {
    canonical: "https://agencycheck.io/sk",
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
    title: "Agentúra práce Holandsko — Hodnotenia, zárobky a ubytovanie 2026",
    description: "Reálne výplatné pásky, fotky ubytovní a hodnotenia pracovníkov pre 150+ agentúr práce v Holandsku. Spoznajte pravdu skôr, ako podpíšete.",
    locale: "sk_SK",
  },
};

export const dynamic = "force-dynamic";

// ─── Verified job meta ────────────────────────────────────────────────────────
const VERIFIED_JOB_META: Record<string, {
  jobTitle: string; hourlyRate: number; estNetWeekly: number;
  housingCost: number; responseTime: string; sector: string;
}> = {
  "otto-work-force": { jobTitle: "Pracovník skladu",          hourlyRate: 14.71, estNetWeekly: 316, housingCost: 95, responseTime: "< 4 hodiny",  sector: "Logistika" },
  "covebo":          { jobTitle: "Pracovník výroby",           hourlyRate: 15.50, estNetWeekly: 338, housingCost: 92, responseTime: "< 6 hodín",   sector: "Výroba potravín" },
  "foreignflex":     { jobTitle: "Pracovník montážnej linky",  hourlyRate: 14.71, estNetWeekly: 322, housingCost: 88, responseTime: "< 8 hodín",   sector: "Výroba" },
};

// ─── Salary breakdown rows ────────────────────────────────────────────────────
const SALARY_ROWS = [
  { label: "Hrubá mzda (WML €14,71 × 40h)", amount: "+€588", green: true,  bold: false },
  { label: "Daň a odvody (loonheffing)",       amount: "−€63",  green: false, bold: false },
  { label: "Ubytovanie agentúry (norma SNF)",  amount: "−€95",  green: false, bold: false },
  { label: "Zdravotné poistenie",              amount: "−€35",  green: false, bold: false },
  { label: "Doprava (autobus agentúry)",       amount: "−€25",  green: false, bold: false },
  { label: "Administratívne poplatky",         amount: "−€25",  green: false, bold: false },
  { label: "💶 Zostáva vám",                  amount: "€345",  green: true,  bold: true  },
] as const;

// ─── Hidden deductions ────────────────────────────────────────────────────────
const HIDDEN_DEDUCTIONS = [
  { icon: "🚌", label: "Predražená doprava",              amount: "€40–€60/mes. navyše",    detail: "Autobus agentúry stojí €25–€30/týždeň — niektoré agentúry účtujú €40+. Niekedy aj keď dochádzate sami." },
  { icon: "🏠", label: "Nelegálne poplatky za ubytovanie", amount: "€50–€100/mes. ukradnuté", detail: "Maximálny poplatok SNF pre zdieľané izby je €113,50/týždeň. Mnohé agentúry účtujú €120–€140. Preplatok je nelegálny." },
  { icon: "⏱", label: "Nezaplatené nadčasy",              amount: "€80–€200/mes. stratené",  detail: "Odpracované hodiny sa neobjavujú na výplatnej páske. Príplatky za víkendy a nedele jednoducho miznú." },
  { icon: "📄", label: "Nejasné poplatky",                 amount: "€20–€80/mes. chýba",      detail: "Posteľná bielizeň, upratovanie, administratíva — poplatky pridané po podpise, ktoré neboli v kontraktu." },
];

// ─── Worker testimonials ──────────────────────────────────────────────────────
const WORKER_TESTIMONIALS = [
  { quote: "Agency told me salary is €550 per week. After they take room and transport I got only €310. Nobody explain this before I sign. I was shock.", name: "Mariusz K.", from: "Poľsko",   job: "Pracovník skladu, Rotterdam", flag: "🇵🇱", rating: 2 },
  { quote: "Housing was €95 per week they say. But in contract was also €18 admin fee, €12 for bedding, €7 for cleaning. Every week new charge.", name: "Bogdan T.",  from: "Rumunsko",  job: "Výrobná linka, Eindhoven",    flag: "🇷🇴", rating: 1 },
  { quote: "I work here 3 years already, with good agency now. My first agency was terrible. Use this site please. I wish someone tell me before.",    name: "Olena V.",   from: "Ukrajina",  job: "Skleník, Westland",           flag: "🇺🇦", rating: 5 },
];

// ─── Worker problems ──────────────────────────────────────────────────────────
const WORKER_PROBLEMS = [
  { icon: "💸", title: "Skryté zrážky z výplaty",     freq: "68% pracovníkov", body: "Ubytovanie, poistenie, doprava a administratívne poplatky odpočítané priamo z brutto — často bez vysvetlenia na výplatnej páske." },
  { icon: "⏱", title: "Nezaplatené nadčasy",          freq: "41% pracovníkov", body: "Odpracované hodiny sa neobjavujú na výplate. Celé víkendy a príplatky za nedele jednoducho miznú." },
  { icon: "🏠", title: "Preplnené ubytovanie",        freq: "34% pracovníkov", body: "4 osoby v izbe určenej pre 2. Platenie €95+/týždeň za takéto podmienky porušuje normy ubytovania SNF." },
  { icon: "🌡", title: "Pleseň a nedostatok kúrenia", freq: "22% pracovníkov", body: "Holandské právo garantuje obývateľné podmienky. Správy o plesnivosti, pokazenom kúrení a vlhkosti sú bežné." },
  { icon: "🚌", title: "Podvody s dopravou",          freq: "29% pracovníkov", body: "Účtovaných €25–€40/týždeň za autobusy nespoľahlivé alebo preplnené. Niektoré agentúry účtujú aj keď dochádzate samostatne." },
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

export default async function SkHomePage() {
  const t             = await getT("sk");
  const totalAgencies = AGENCIES.length;
  const housingCount  = AGENCIES_WITH_HOUSING.length;
  const reviewStats   = await getPublishedReviewStats();
  const totalReviews  = reviewStats.total || 111;

  const housingAgencies = AGENCIES_WITH_HOUSING.slice(0, 3);

  const searchSuggestions: SearchSuggestion[] = [
    ...AGENCIES.map((a) => ({ type: "agency" as const, label: a.name, sublabel: a.city, href: `/agencies/${a.slug}` })),
    ...TOP_CITIES.map((c) => ({ type: "city" as const, label: c.name, sublabel: c.region, href: `/cities/${c.slug}` })),
    ...Object.entries(JOB_TYPE_META).map(([slug, meta]) => ({ type: "job" as const, label: meta.title, sublabel: "Typ práce", href: `/jobs/${slug}` })),
    { type: "job" as const, label: "Ponuky Randstad",    sublabel: `${RANDSTAD_STATS.total} ponúk`,  href: "/randstad-jobs" },
    { type: "job" as const, label: "Ponuky Tempo-Team",  sublabel: `${TEMPO_TEAM_STATS.total} ponúk`, href: "/tempo-team-jobs" },
  ];

  const orgSchema    = organizationSchema();
  const siteSchema   = webSiteSchema();
  const crumbSchema  = breadcrumbSchema([{ name: "Domov", url: "/sk" }]);
  const faqSchema    = faqPageSchema([
    { question: "Koľko skutočne zarobím po odpočítaní nákladov v Holandsku?", answer: "Pri minimálnej mzde (€14,71/h, 40h/týždeň) je hrubá mzda €588/týždeň. Po holandskej dani, ubytovaní agentúry (~€95/týždeň), doprave a zdravotnom poistení si väčšina pracovníkov ponechá €300–€370/týždeň — asi 51–63% hrubej mzdy." },
    { question: "Sú zrážky z výplaty agentúrou legálne v Holandsku?", answer: "Áno — ale len v hraniciach určených CAO ABU a NBBU. Agentúry môžu odpočítavať náklady na ubytovanie, dopravu a zdravotné poistenie, ale sumy musia byť uvedené v zmluve. Zrážky nad dohodnuté ceny sú nelegálne. Porušenia nahláste Inspectie SZW." },
    { question: "Aká je minimálna mzda v Holandsku v roku 2026?", answer: "Holandská zákonná minimálna mzda (WML) je €14,71 za hodinu v roku 2026 pre pracovníkov vo veku 21+. Pri 40 hodinách týždenne to je asi €2.545/mesiac brutto. Agentúry sú zo zákona povinné platiť aspoň WML bez ohľadu na národnosť." },
    { question: "Ako overiť, či je holandská agentúra práce legitímna?", answer: "Skontrolujte registráciu SNA alebo príslušnosť k ABU/NBBU a overte číslo KvK. Na AgencyCheck profily agentúr zobrazujú stav overenia, hodnotenia pracovníkov a podmienky ubytovania. Varovné signály: žiadosť o zálohu, žiadna písomná zmluva, tlak na okamžitý nástup." },
    { question: "Koľko stojí ubytovanie pri práci cez agentúru v Holandsku?", answer: "Ubytovanie agentúry zvyčajne stojí €80–€113,50/týždeň odpočítané z hrubej mzdy. Maximálne zákonné odpočítanie SNF pre certifikované zdieľané izby je €113,50/týždeň (2024). Vlastné ubytovanie v Holandsku stojí €500–€900/mesiac podľa mesta." },
    { question: "Čo robiť, ak mi agentúra neplatí správne?", answer: "Požiadajte o úplnú výplatnú pásku (loonstrook) a porovnajte každú položku s podpísanou zmluvou. Pri nezrovnalostiach: kontaktujte agentúru písomne, nahláste to Inspectie SZW (inspectieszw.nl), obráťte sa na odbory FNV alebo CNV, pri ubytovaní — na SNF." },
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
                  🇸🇰 Slovenčina · Žiadne platené rebríčky
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-[10px] font-bold tracking-widest uppercase text-blue-300">
                  🏗 Vytvorené pre pracovníkov agentúr v Holandsku
                </div>
              </div>

              <Link href="/apply/reachtruck"
                className="group mb-5 flex items-center gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/20 active:scale-[0.98] px-4 py-3 transition-all duration-150">
                <span className="relative flex-shrink-0">
                  <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-40" />
                  <span className="relative flex h-2.5 w-2.5 rounded-full bg-amber-400" />
                </span>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-0.5">Teraz prijímame · Nástup ihneď</div>
                  <div className="text-white font-semibold text-[13px] leading-tight">Reachtruckový vodič — Waalwijk&nbsp;·&nbsp;€16,50/hod&nbsp;·&nbsp;Len EÚ</div>
                </div>
                <span className="flex-shrink-0 text-[12px] font-bold text-amber-300 group-hover:text-amber-200 whitespace-nowrap">Prihlásiť sa →</span>
              </Link>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-black leading-[1.06] tracking-tight mb-4">
                {t("homepage.hero_gross")}{" "}
                <span className="text-emerald-400">€588/týždeň.</span>
                <br />
                V skutočnosti si necháte{" "}
                <span className="text-red-400">€345.</span>
              </h1>

              <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6">
                {[
                  { value: `${totalReviews} hodnotení pracovníkov`,   note: "38 overených · 73 anonymných" },
                  { value: "42% hodnotí 1–2 hviezdy",                  note: "publikované bez filtrovania" },
                  { value: "€63/týž. reálna daň",                      note: "zdroj: belastingdienst.nl 2026" },
                  { value: `${totalAgencies} agentúr v databáze`,      note: "z verejných registrov" },
                ].map((s) => (
                  <div key={s.value} className="flex items-baseline gap-1.5">
                    <span className="text-[11px] font-black text-white">{s.value}</span>
                    <span className="text-[10px] text-gray-500">{s.note}</span>
                  </div>
                ))}
              </div>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
                Ubytovanie, poistenie, doprava a administratívne poplatky sú odpočítané predtým, ako dostanete výplatu.
                Zistite svoje <strong className="text-white">reálne čisté zárobky</strong>, porovnajte agentúry
                a buďte spárovaní s overenými ponukami —{" "}
                <strong className="text-emerald-400">bezplatne, bez záväzkov</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <a href="#lead-form"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] transition-all px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/50">
                  Nájsť ponuku — bezplatne →
                </a>
                <a href="#calculator"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/6 hover:bg-white/12 active:scale-[0.98] transition-all px-8 py-4 text-base font-semibold text-gray-200">
                  🧮 Vypočítať moju výplatu
                </a>
              </div>

              <SmartSearch suggestions={searchSuggestions} size="large" placeholder="Hľadajte agentúru, mesto alebo typ práce…" />
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
              { value: `${totalReviews}`, label: "hodnotení pracovníkov",       sub: "38 overených · 73 hlásených · 42% hodnotí 1–2 hviezdy", color: "text-emerald-400" },
              { value: "15",              label: "chýb vo výplatných páskach",   sub: "overené podľa CAO ABU/NBBU a limitov SNF",              color: "text-red-400" },
              { value: `${totalAgencies}`, label: "agentúr v databáze",          sub: "každá overená v registroch KvK · ABU · SNA",            color: "text-amber-400" },
              { value: "€0",              label: "zaplatené za lepšie miesto",   sub: "žiadna agentúra nezaplatila za lepšiu pozíciu",          color: "text-blue-400" },
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
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 shrink-0">Zdroje dát:</span>
              {[
                { label: "Daňové právo NL",    cite: "belastingdienst.nl 2026",       href: "https://www.belastingdienst.nl/", color: "text-blue-400" },
                { label: "Limity ubytovania",   cite: "SNF Normering Flexwonen 2024",  href: "https://www.snf.nl/",             color: "text-emerald-400" },
                { label: "Normy CAO",           cite: "ABU/NBBU CAO 2023–2025",        href: "https://www.abu.nl/",             color: "text-amber-400" },
                { label: "Register agentúr",    cite: "verejný register SNA",          href: "https://www.normeringarbeid.nl/", color: "text-purple-400" },
                { label: "Inšpekcia práce",     cite: "Inspectie SZW",                 href: "https://www.inspectieszw.nl/",    color: "text-gray-400" },
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
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-red-500">Skryté náklady práce cez agentúry</p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-4">
              Väčšina pracovníkov stráca{" "}
              <span className="text-red-500">€300–€500 mesačne</span>{" "}
              na skrytých zrážkach
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Tieto zrážky sa často nespomínajú pred podpisom zmluvy — a mnohé z nich sú čiastočne alebo úplne nelegálne.
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
                Pracovník WML · €14,71/h · 40h/týždeň · Ubytovanie + doprava agentúry
              </p>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-gray-600">Čo agentúra inzeruje (brutto)</span>
                  <span className="text-sm font-black text-gray-900">€588/týždeň</span>
                </div>
                <div className="h-3 rounded-full bg-gray-200 w-full" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-gray-600">Po holandskej dani (s heffingskorting úľavami)</span>
                  <span className="text-sm font-black text-gray-700">€525/týždeň</span>
                </div>
                <div className="h-3 rounded-full bg-amber-300" style={{ width: "89%" }} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-red-700">Čo skutočne dostanete</span>
                  <span className="text-sm font-black text-red-600">€345/týždeň</span>
                </div>
                <div className="h-3 rounded-full bg-red-400" style={{ width: "59%" }} />
              </div>
            </div>
            <div className="px-6 pb-4 flex items-center justify-between">
              <p className="text-[11px] text-gray-400">
                Zrážky: €63 daň + €95 ubytovanie + €35 poistenie + €25 doprava + €25 adm. popl.{" "}
                <Link href="/methodology" className="text-blue-600 underline">Plná metodológia →</Link>
              </p>
              <a href="#lead-form"
                className="shrink-0 ml-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors px-5 py-2.5 text-xs font-black text-white active:scale-[0.98]">
                Nájsť lepšie ponuky
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
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">Skutoční pracovníci. Skutočné slová.</p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Čo nám pracovníci skutočne povedali</h2>
            <p className="text-xs text-gray-400 font-semibold">Nie marketingové materiály · Nie PR agentúry · Skutočné hlásenia od skutočných pracovníkov</p>
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
              📋 Čítajte všetky {totalReviews} hodnotení
            </Link>
            <Link href="/submit-review" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
              ✍️ Podeľte sa o svoju skúsenosť →
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
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1.5">Bezplatné párovanie — bez poplatkov, bez záväzkov</p>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">Nájdite overenú agentúru, ktorá ukazuje reálne zrážky</h2>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-xl">
                <span className="font-semibold text-gray-700">Transparentné zrážky</span> ·{" "}
                <span className="font-semibold text-gray-700">Overené ubytovanie</span> ·{" "}
                <span className="font-semibold text-gray-700">Skutočné hodnotenia pracovníkov</span>{" "}
                — párujeme vás len s agentúrami, ktoré prešli naším overením.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              {["Žiadne platené rebríčky", "Súlad s GDPR", "Bezplatné párovanie"].map((b) => (
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
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">Okamžitý kalkulátor mzdy — daňové sadzby 2026</p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3">Koľko vám skutočne zostane z výplaty?</h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Prispôsobte podľa svojej ponuky. Reálne holandské dane so všetkými úľavami heffingskorting.
              Každá zrážka vypočítaná naživo.
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
            <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">Metodológia výpočtov</p>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">Ako vypočítavame váš reálny príjem</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-7">
            {[
              {
                icon: "📊",
                title: "Holandská daň z príjmu 2026",
                items: [
                  "Pásma loonheffing (2 úrovne)",
                  "Algemene heffingskorting — až €3.362/rok úľavy",
                  "Arbeidskorting — až €5.000/rok úľavy",
                  "Efektívna sadzba = daň ÷ brutto (po všetkých úľavách)",
                ],
              },
              {
                icon: "🏠",
                title: "Logika zrážok za ubytovanie",
                items: [
                  "Ubytovanie agentúry: €80–€120/týž. (norma SNF)",
                  "Vlastné ubytovanie: €500–€900/mes. (regionálny priemer)",
                  "Zákonný limit SNF: ~€113,50/týž. pre zdieľané izby",
                  "Zdroj: SNF Normering Flexwonen 2024",
                ],
              },
              {
                icon: "🚌",
                title: "Doprava a poistenie",
                items: [
                  "Autobus agentúry: priem. €25/týž. (hlásenia pracovníkov)",
                  "Zorgverzekering: €152–€180/mes. (trh 2026)",
                  "Vlastný eigen risico: priem. €33/mes.",
                  "Adm. poplatky: €0–€20/týž. (uvádzané agentúrami)",
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
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">Kľúčové predpoklady</p>
              <ul className="space-y-2 text-xs text-gray-700">
                {[
                  "Hlavné zamestnanie v Holandsku (bez aplikácie zmlúv o zamedzení dvojitého zdanenia)",
                  "48 pracovných týždňov/rok (4 týždne dovolenky zahrnuté)",
                  "8% vakantiegeld (príplatok za dovolenku) pridaný k brutto podľa BW Art. 7:634",
                  "Slobodný pracovník — bez partnerských úľav ani odpočtov za starostlivosť o deti",
                  "Štandardné zdravotné poistenie (bez dávok toeslagen)",
                  "WML 2026: €14,71/hod · Aktualizácia: január 2026",
                ].map((a) => (
                  <li key={a} className="flex items-start gap-2">
                    <span className="text-blue-500 font-black shrink-0 mt-0.5">✓</span>{a}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[10px] text-gray-400 leading-relaxed border-t border-blue-100 pt-3">
                <strong className="text-gray-500">Právne upozornenie:</strong> Výpočty slúžia len na informačné účely a nepredstavujú daňové, právne ani finančné poradenstvo. Individuálne okolnosti sa môžu líšiť. Poraďte sa s belastingadviseur pre vašu konkrétnu situáciu.{" "}
                <Link href="/methodology" className="text-blue-600 underline hover:text-blue-800">Plná metodológia →</Link>
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="bg-gray-900 px-5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Príklad: Pracovník WML · €14,71/h · 40h/týž. · Reálna daň 2026
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
                  Daň −€63 (reálny loonheffing 2026 po úľavách AHK+AK) + €95 ubytovanie + €25 doprava + €35 poistenie + €25 adm.{" "}
                  <Link href="/methodology" className="text-blue-600 underline">Plná metodológia</Link>
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
            Teraz poznáte reálne čísla
          </p>
          <h2 className="text-2xl sm:text-4xl font-black leading-tight mb-4">
            Chcete <span className="text-emerald-400">lepšie podmienky</span> a
            viac peňazí každý týždeň?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Nie všetky agentúry sú rovnaké. Niektoré majú nižšie poplatky za ubytovanie, rýchlejšie výplatné pásky a transparentné zmluvy. Overujeme, ktoré — a párujeme vás bezplatne.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#lead-form"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/40 active:scale-[0.98]">
              Pozrieť overené ponuky →
            </a>
            <Link href="/agencies-with-housing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/8 hover:bg-white/15 transition-colors px-8 py-4 text-base font-bold text-gray-300 active:scale-[0.98]">
              Všetky {housingCount} agentúry s ubytovaním
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
            {["Žiadne platené rebríčky", "Agentúry nemôžu kúpiť lepšie hodnotenie", "Hodnotenia sú výhradne od pracovníkov", "Status partnera nikdy neovplyvňuje výsledky"].map((t) => (
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
              Ako funguje AgencyCheck — a ako zarabiame
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Úprimne o tom, ako to funguje
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                icon: "📋",
                title: "Čo robí AgencyCheck",
                body: "Zbierame hodnotenia pracovníkov, analyzujeme výplatné pásky a publikujeme nezávislé rebríčky holandských agentúr práce. Nerekrutujeme pracovníkov — pomáhame vám urobiť informované rozhodnutie.",
              },
              {
                icon: "💰",
                title: "Ako zarabiame",
                body: "Ak využijete našu párovačku a budete úspešne umiestnený, agentúra nám zaplatí honorár za nájdenie kandidáta. Tento poplatok platí agentúra — nikdy vy. Pracovníci vždy platia nulu.",
              },
              {
                icon: "⚖️",
                title: "Prečo rebríčky zostávajú férové",
                body: "Agentúry nemôžu platiť za lepšie miesto v rebríčku, odstraňovanie hodnotení ani ovplyvňovanie svojich skóre. Platené agentúry nezískavajú žiadnu výhodu pri párovaní. Len hodnotenia pracovníkov určujú ich pozíciu.",
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
              <strong>Zverejnenie konfliktu záujmov:</strong> Partnerské agentúry v párovacej službe nezískavajú vyššie hodnotenia ani prednostné umiestnenie vo výsledkoch vyhľadávania.
              Naše rebríčky sú vypočítané výhradne zo zverifikovaných hlásení pracovníkov. Môžete{" "}
              <Link href="/methodology" className="underline hover:text-amber-700">prečítať našu plnú metodológiu</Link>{" "}
              a{" "}
              <Link href="/reviews" className="underline hover:text-amber-700">prehliadať všetky nefiltrované hodnotenia</Link>{" "}
              — vrátane negatívnych — kedykoľvek.
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
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-red-500">Čo vám žiadna agentúra nepovie</p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-4">Typické problémy hlásené pracovníkmi</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
              Na základe {totalReviews}+ overených správ pracovníkov. Vedieť to vás chráni pred podpisom.
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
              📋 Čítajte skutočné skúsenosti pracovníkov →
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
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">Skutočné ubytovanie — nie prospekty</p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3">Pozrite sa, kde skutočne budete bývať</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">Fotky a popisy odoslané pracovníkmi. Žiadne stockové fotografie. Žiadny PR agentúr.</p>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8">
            <WorkerHousingStrip />
          </div>
          <div className="mt-6 text-center">
            <Link href="/agencies-with-housing"
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100 transition-colors">
              Prehľadajte všetky {housingCount} agentúr s ubytovaním →
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
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">Overené agentúry</p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3">Transparentné ponuky — zobrazený reálny čistý príjem</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
              Každá karta zobrazuje odhadovaný týždenný čistý príjem po holandskej dani a zrážkach.
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
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{meta?.sector ?? "Pracovné služby"}</span>
                        <h3 className="text-base font-black text-white leading-tight truncate">{meta?.jobTitle ?? "Sklad / Výroba"}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">📍 {agency.city}</p>
                      </div>
                      <span className="shrink-0 text-[9px] font-black uppercase tracking-wider text-blue-300 bg-blue-400/15 border border-blue-400/20 rounded-full px-2 py-1 whitespace-nowrap">🔍 Overené</span>
                    </div>
                    <Link href={`/agencies/${agency.slug}`} className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors group-hover:underline">
                      {agency.name} →
                    </Link>
                  </div>
                  <div className="px-5 py-4 flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5 text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Hodinová sadzba</p>
                        <p className="text-lg font-black text-gray-900">€{(meta?.hourlyRate ?? 14.71).toFixed(2)}</p>
                      </div>
                      <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2.5 text-center">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Odhad čistý/týž.</p>
                        <p className="text-lg font-black text-emerald-700">€{meta?.estNetWeekly ?? 316}</p>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs text-gray-500">
                      <div className="flex items-center justify-between">
                        <span>🏠 Cena ubytovania</span>
                        <span className="font-bold text-gray-700">€{meta?.housingCost ?? 95}/týž.</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>⭐ Hodnotenie pracovníkov</span>
                        <StarRating value={agency.avgSalaryRating ?? 3.5} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>⚡ Čas odozvy</span>
                        <span className="font-bold text-gray-700">{meta?.responseTime ?? "< 24 hodín"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
                    <ApplyBar
                      context={{ sourcePage: "/sk", sourceType: "agency_page", sourceLabel: `SK Homepage — ${agency.slug}`, defaultAccommodation: true }}
                      ctaText="Odoslať dopyt" buttonOnly
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mb-7">
            {housingAgencies.map((agency) => (
              <AgencyCard key={agency.slug} agency={agency} jobCount={getJobCountForAgency(agency.slug)} locale="sk" />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link href="/agencies-with-housing"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors px-8 py-4 text-sm font-black text-white shadow-sm">
              🏢 Všetky {housingCount} agentúry s ubytovaním
            </Link>
            <Link href="/agencies" className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
              Všetky {totalAgencies} agentúry →
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
                  ⚡ Bezplatný nástroj
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-4">
                  Agentúra vám zaplatila menej?
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  Nahrajte svoju holandskú výplatnú pásku (<em>loonstrook</em>) a my overíme každú položku
                  voči oficiálnym daňovým tabuľkám 2026 a normám CAO ABU/NBBU.
                </p>
                <p className="text-gray-400 text-xs leading-relaxed mb-6">
                  Overujeme: správne daňové pásma · uplatné úľavy heffingskorting ·
                  limity zrážok za ubytovanie SNF · príplatky za nadčasy · výpočet vakantiegeld.
                </p>
                <Link href="/tools/payslip-checker"
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 transition-colors px-7 py-3.5 text-sm font-black text-white shadow-sm shadow-amber-900/40 active:scale-[0.98]">
                  📄 Nahrať výplatnú pásku — skontrolovať teraz
                </Link>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Čo overujeme</p>
                <ul className="space-y-2.5">
                  {[
                    { ok: true,  label: "Správne pásma loonheffing uplatnené" },
                    { ok: true,  label: "Vypočítaná úľava heffingskorting" },
                    { ok: true,  label: "Zrážka za ubytovanie ≤ zákonné maximum SNF" },
                    { ok: true,  label: "Príplatky za nadčasy (100%, 125%, 150%)" },
                    { ok: true,  label: "Vakantiegeld ≥ 8% hrubej mzdy" },
                    { ok: false, label: "Falošné zrážky alebo nevysvetlené poplatky" },
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
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">Sprievodca pre pracovníkov</p>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-5 leading-tight">
                Všetko, čo potrebujete vedieť pred prácou v Holandsku
              </h2>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>
                  Holandská minimálna mzda (<em>Wettelijk Minimumloon</em>) je{" "}
                  <strong className="text-gray-900">€14,71/hodinu v roku 2026</strong> pre pracovníkov
                  vo veku 21+. Pri 40 hodinách týždenne to je hrubá mzda presne €588/týždeň
                  (€14,71 × 40 hodín). No po holandskej dani z príjmu, ubytovaní agentúry, zdravotnom
                  poistení a doprave si väčšina pracovníkov ponechá medzi{" "}
                  <strong className="text-gray-900">€300–€370</strong> —
                  asi 50–63% brutto, v závislosti od agentúry.
                </p>
                <p>
                  Kľúčové právne ochrany, ktoré treba poznať: <strong className="text-gray-900">ABU / NBBU CAO</strong>{" "}
                  upravuje mzdové tarify, príplatky za nadčasy a platené voľno.
                  <strong className="text-gray-900"> SNF</strong> (Stichting Normering Flexwonen) určuje maximálne zákonné
                  zrážky za ubytovanie. <strong className="text-gray-900">Inspectie SZW</strong> vymáha celé pracovné právo.
                  AgencyCheck overuje agentúry voči všetkým trom.
                </p>
                <p>
                  Náš{" "}
                  <Link href="/tools/real-income-calculator" className="text-blue-600 underline hover:text-blue-800">kalkulátor mzdy</Link>{" "}
                  používa oficiálne daňové tabuľky 2026 a zahŕňa ako úľavu <em>algemene heffingskorting</em>, tak aj{" "}
                  <em>arbeidskorting</em> — úľavy, ktoré môžu ušetriť nízkopríjmovým pracovníkom
                  €600–€700 mesačne na daniach, o ktorých mnohé agentúry nehovoria.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Rýchly prístup</p>
              {[
                { icon: "💶", href: "/tools/real-income-calculator",        title: "Plný kalkulátor mzdy",            desc: "Čistá mzda so všetkými daňovými úľavami 2026" },
                { icon: "📄", href: "/tools/payslip-checker",               title: "Nástroj na overenie výplatnice",  desc: "Nahrajte loonstrook a skontrolujte chyby" },
                { icon: "🏢", href: "/agencies",                            title: "Všetky agentúry v Holandsku",     desc: `${totalAgencies} agentúr zoradených podľa hodnotení pracovníkov` },
                { icon: "🏠", href: "/agencies-with-housing",               title: "Práca s ubytovaním",              desc: `${housingCount} overených agentúr s ubytovaním` },
                { icon: "⭐", href: "/reviews",                             title: "Hodnotenia pracovníkov",          desc: `${totalReviews}+ skutočných anonymných hodnotení` },
                { icon: "📋", href: "/work-in-netherlands-for-foreigners",  title: "Práva a právny sprievodca",       desc: "ABU CAO, WML, SNF — vysvetlené jednoducho" },
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
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Prehľadávajte pracovné ponuky podľa mesta</p>
            <div className="flex flex-wrap gap-2">
              {TOP_CITIES.slice(0, 18).map((c) => (
                <Link key={c.slug} href={`/jobs-in-${c.slug}`}
                  className="inline-flex items-center text-xs font-medium bg-white border border-gray-200 text-gray-700 rounded-full px-3 py-1.5 hover:border-blue-300 hover:text-blue-700 transition-colors">
                  💼 {c.name}
                </Link>
              ))}
              <Link href="/jobs-in-netherlands"
                className="inline-flex items-center text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700 rounded-full px-3 py-1.5 hover:bg-blue-100 transition-colors">
                🇳🇱 Všetky mestá →
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
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">FAQ</p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Otázky, ktoré pracovníci skutočne kladú</h2>
          </div>
          <HomepageFAQ />
          <div className="mt-8 text-center">
            <Link href="/work-in-netherlands-for-foreigners"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
              📖 Kompletný sprievodca: Práca v Holandsku →
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
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-5">Spoznajte pravdu<br />pred podpisom.</h2>
            <p className="text-blue-200 text-base sm:text-lg leading-relaxed mb-4 max-w-lg mx-auto">
              {totalAgencies} agentúr. {totalReviews}+ hodnotení pracovníkov. Reálne rozdelenie výplat.
              Zero platených rebríčkov. Vytvorené pre pracovníkov — nie recruitérov.
            </p>
            <p className="text-xs text-blue-400 mb-9">
              ✓ Žiadne platené rebríčky &nbsp;·&nbsp; ✓ Agentúry nemôžu kúpiť lepšie hodnotenia &nbsp;·&nbsp;
              ✓ Hodnotenia sú výhradne od pracovníkov &nbsp;·&nbsp; ✓ Status partnera nikdy neovplyvňuje výsledky
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <a href="#lead-form"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/40 active:scale-[0.98]">
                Nájsť ponuku — zadarmo →
              </a>
              <a href="#calculator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/8 hover:bg-white/15 transition-colors px-8 py-4 text-base font-bold text-gray-200 active:scale-[0.98]">
                🧮 Vypočítať moju výplatu
              </a>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-blue-400">
              <Link href="/agencies" className="hover:text-white transition-colors">Všetky agentúry</Link>
              <span className="text-blue-800">·</span>
              <Link href="/reviews" className="hover:text-white transition-colors">Hodnotenia pracovníkov</Link>
              <span className="text-blue-800">·</span>
              <Link href="/agencies-with-housing" className="hover:text-white transition-colors">Práca s ubytovaním</Link>
              <span className="text-blue-800">·</span>
              <Link href="/tools/real-income-calculator" className="hover:text-white transition-colors">Kalkulátor mzdy</Link>
              <span className="text-blue-800">·</span>
              <Link href="/methodology" className="hover:text-white transition-colors">Metodológia</Link>
              <span className="text-blue-800">·</span>
              <Link href="/privacy" className="hover:text-white transition-colors">Súkromie</Link>
              <span className="text-blue-800">·</span>
              <Link href="/terms" className="hover:text-white transition-colors">Podmienky</Link>
            </nav>
          </div>
        </div>
      </section>

      <HomepageStickyBar />
    </div>
  );
}
