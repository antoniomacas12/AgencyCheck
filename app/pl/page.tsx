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
import {
  organizationSchema,
  webSiteSchema,
  breadcrumbSchema,
  faqPageSchema,
} from "@/lib/schemaMarkup";

const HomepageHeroCalculator = nDynamic(() => import("@/components/HomepageHeroCalculator"), { ssr: false });
const HomepageCalculator     = nDynamic(() => import("@/components/HomepageCalculator"),     { ssr: false });
const HomepageLeadForm       = nDynamic(() => import("@/components/HomepageLeadForm"),        { ssr: false });
const HomepageStickyBar      = nDynamic(() => import("@/components/HomepageStickyBar"),       { ssr: false });

export const metadata: Metadata = {
  title: "Agencja Pracy Holandia — Sprawdzone Opinie, Zarobki i Zakwaterowanie 2026",
  description:
    "Porównaj 150+ agencji pracy w Holandii. Realne zarobki netto po odliczeniu zakwaterowania, ubezpieczenia i transportu. Opinie pracowników, warunki mieszkaniowe i rankingi. Przed podpisaniem — sprawdź tutaj.",
  alternates: {
    canonical: "https://agencycheck.io/pl",
    languages: {
      "en":        "https://agencycheck.io/",
      "pl":        "https://agencycheck.io/pl",
      "ro":        "https://agencycheck.io/ro",
      "x-default": "https://agencycheck.io/",
    },
  },
  openGraph: {
    title: "Agencja Pracy Holandia — Opinie, Zarobki i Zakwaterowanie 2026",
    description:
      "Realne podziały wypłat, zdjęcia zakwaterowania i opinie pracowników dla 150+ agencji pracy w Holandii. Poznaj prawdę zanim podpiszesz.",
    locale: "pl_PL",
  },
};

export const dynamic = "force-dynamic";

// ─── Verified job meta ────────────────────────────────────────────────────────
const VERIFIED_JOB_META: Record<string, {
  jobTitle: string; hourlyRate: number; estNetWeekly: number;
  housingCost: number; responseTime: string; sector: string;
}> = {
  "otto-work-force": {
    jobTitle: "Pracownik magazynu", hourlyRate: 14.71, estNetWeekly: 316,
    housingCost: 95, responseTime: "< 4 godziny", sector: "Logistyka",
  },
  "covebo": {
    jobTitle: "Pracownik produkcji", hourlyRate: 15.50, estNetWeekly: 338,
    housingCost: 92, responseTime: "< 6 godzin", sector: "Produkcja żywności",
  },
  "foreignflex": {
    jobTitle: "Pracownik linii montażowej", hourlyRate: 14.71, estNetWeekly: 322,
    housingCost: 88, responseTime: "< 8 godzin", sector: "Produkcja",
  },
};

// ─── Salary breakdown rows (PL) ───────────────────────────────────────────────
const SALARY_ROWS = [
  { label: "Wynagrodzenie brutto (WML €14,71 × 40h)", amount: "+€588", green: true,  bold: false },
  { label: "Podatek i ZUS (loonheffing)",              amount: "−€63",  green: false, bold: false },
  { label: "Zakwaterowanie agencji (norma SNF)",       amount: "−€95",  green: false, bold: false },
  { label: "Ubezpieczenie zdrowotne",                  amount: "−€35",  green: false, bold: false },
  { label: "Transport (bus agencji)",                  amount: "−€25",  green: false, bold: false },
  { label: "Opłaty administracyjne",                   amount: "−€25",  green: false, bold: false },
  { label: "💶 Zostaje Ci",                           amount: "€345",  green: true,  bold: true  },
] as const;

// ─── Authentic worker testimonials ────────────────────────────────────────────
const WORKER_TESTIMONIALS = [
  {
    quote: "Agency told me salary is €550 per week. After they take room and transport I got only €310. Nobody explain this before I sign. I was shock.",
    name: "Mariusz K.",
    from: "Polska",
    job: "Pracownik magazynu, Rotterdam",
    flag: "🇵🇱",
    rating: 2,
  },
  {
    quote: "Housing was €95 per week they say. But in contract was also €18 admin fee, €12 for bedding, €7 for cleaning. Every week new charge. I never understand my loonstrook.",
    name: "Bogdan T.",
    from: "Rumunia",
    job: "Linia produkcyjna, Eindhoven",
    flag: "🇷🇴",
    rating: 1,
  },
  {
    quote: "I work here 3 years already, with good agency now. My first agency was terrible. Use this site please. Check the real reviews. I wish someone tell me before.",
    name: "Olena V.",
    from: "Ukraina",
    job: "Szklarnia, Westland",
    flag: "🇺🇦",
    rating: 5,
  },
];

// ─── Hidden deductions (PL) ───────────────────────────────────────────────────
const HIDDEN_DEDUCTIONS = [
  {
    icon: "🚌",
    label: "Przepłacony transport",
    amount: "€40–€60/mies. ekstra",
    detail: "Bus agencji kosztuje €25–€30/tydz. — ale niektóre agencje pobierają €40+. Zdarzają się opłaty nawet gdy dojeżdżasz samodzielnie.",
  },
  {
    icon: "🏠",
    label: "Nielegalne opłaty za mieszkanie",
    amount: "€50–€100/mies. skradzione",
    detail: "Maksymalna opłata SNF za certyfikowane pokoje wieloosobowe to €113,50/tydz. Wiele agencji pobiera €120–€140. Nadwyżka jest po prostu nielegalna.",
  },
  {
    icon: "⏱",
    label: "Nieopłacone nadgodziny",
    amount: "€80–€200/mies. stracone",
    detail: "Przepracowane godziny nie pojawiają się na odcinku płacowym. Premie za weekendy i niedziele po prostu znikają.",
  },
  {
    icon: "📄",
    label: "Niejasne potrącenia",
    amount: "€20–€80/mies. brakuje",
    detail: "Pościel, sprzątanie, administracja — opłaty dodawane po podpisaniu umowy, których nie było w kontrakcie.",
  },
];

// ─── Worker problems (PL) ─────────────────────────────────────────────────────
const WORKER_PROBLEMS = [
  { icon: "💸", title: "Ukryte potrącenia z wypłaty", freq: "68% pracowników",
    body: "Zakwaterowanie, ubezpieczenie, transport i opłaty administracyjne odliczane bezpośrednio z brutto — często bez wyjaśnienia na odcinku płacowym." },
  { icon: "⏱", title: "Nieopłacone nadgodziny",       freq: "41% pracowników",
    body: "Przepracowane godziny nie widnieją na wypłacie. Całe weekendy i premie niedzielne po prostu znikają." },
  { icon: "🏠", title: "Przepełnione zakwaterowanie",  freq: "34% pracowników",
    body: "4 osoby w pokoju przeznaczonym dla 2. Płacenie €95+/tydz. za takie warunki narusza normy zakwaterowania SNF." },
  { icon: "🌡", title: "Pleśń i brak ogrzewania",     freq: "22% pracowników",
    body: "Holenderskie prawo gwarantuje nadające się do zamieszkania warunki. Jednak raporty o pleśni, zepsutym ogrzewaniu i wilgoci są powszechne." },
  { icon: "🚌", title: "Oszustwa transportowe",        freq: "29% pracowników",
    body: "Pobierane €25–€40/tydz. za busy, które są zawodne lub przepełnione. Niektóre agencje pobierają opłatę nawet gdy dojeżdżasz samemu." },
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

export default async function PlHomePage() {
  const totalAgencies = AGENCIES.length;
  const housingCount  = AGENCIES_WITH_HOUSING.length;
  const reviewStats   = await getPublishedReviewStats();
  const totalReviews  = reviewStats.total || 111;

  const housingAgencies = AGENCIES_WITH_HOUSING.slice(0, 3);

  const searchSuggestions: SearchSuggestion[] = [
    ...AGENCIES.map((a) => ({ type: "agency" as const, label: a.name, sublabel: a.city, href: `/agencies/${a.slug}` })),
    ...TOP_CITIES.map((c) => ({ type: "city" as const, label: c.name, sublabel: c.region, href: `/cities/${c.slug}` })),
    ...Object.entries(JOB_TYPE_META).map(([slug, meta]) => ({ type: "job" as const, label: meta.title, sublabel: "Typ pracy", href: `/jobs/${slug}` })),
    { type: "job" as const, label: "Oferty Randstad",    sublabel: `${RANDSTAD_STATS.total} ofert`,  href: "/randstad-jobs" },
    { type: "job" as const, label: "Oferty Tempo-Team",  sublabel: `${TEMPO_TEAM_STATS.total} ofert`, href: "/tempo-team-jobs" },
  ];

  const latestReviews = getLatestReviews(3).map((r, i) => ({
    review: {
      id:                    `hp-pl-${i}`,
      reviewType:            r.reviewType,
      title:                 r.title,
      overallRating:         r.overallRating,
      salaryRating:          r.salaryRating,
      housingRating:         r.housingRating ?? null,
      managementRating:      r.managementRating,
      contractClarityRating: r.contractClarityRating,
      issueTags:             r.issueTags,
      verificationStatus:    r.verificationStatus as "VERIFIED" | "WORKER_REPORTED" | "UNKNOWN",
      comment:               r.comment,
      jobTitle:              r.jobTitle ?? null,
      city:                  r.city ?? null,
      createdAt:             r.createdAt,
    },
    agencySlug: r.agencySlug,
    agencyName: AGENCY_MAP[r.agencySlug]?.name ?? r.agencySlug,
  }));

  // ── JSON-LD schemas ──────────────────────────────────────────────────────────
  const orgSchema   = organizationSchema();
  const siteSchema  = webSiteSchema();
  const crumbSchema = breadcrumbSchema([{ name: "Strona główna", url: "/pl" }]);
  const homepageFaqs = faqPageSchema([
    {
      question: "Ile realnie zostaje mi z wypłaty po odliczeniu czynszu i kosztów w Holandii?",
      answer:   `Przy płacy minimalnej (€14,71/h, 40h/tygodniowo) wynagrodzenie brutto to €588/tydzień. Po holenderskim podatku dochodowym (z ulgami heffingskorting), zakwaterowaniu agencji (~€95/tydz.), transporcie i ubezpieczeniu zdrowotnym większość pracowników zachowuje €300–€370/tydzień — ok. 51–63% brutto.`,
    },
    {
      question: "Czy potrącenia z wynagrodzenia przez agencję są legalne w Holandii?",
      answer:   "Tak — ale wyłącznie w granicach określonych przez CAO ABU i NBBU. Agencje mogą potrącać koszty zakwaterowania, transportu i ubezpieczenia zdrowotnego, ale kwoty muszą być wskazane w umowie. Potrącenia za nieotrzymane usługi lub powyżej umówionych cen są nielegalne. Naruszenia należy zgłaszać do Inspectie SZW.",
    },
    {
      question: "Jaka jest płaca minimalna w Holandii w 2026 roku?",
      answer:   "Holenderska ustawowa płaca minimalna (WML) wynosi €14,71 za godzinę w 2026 roku dla pracowników w wieku 21+. Przy 40 godzinach tygodniowo daje to ok. €2.545/miesiąc brutto. Agencje są prawnie zobowiązane do wypłacania co najmniej WML bez względu na narodowość.",
    },
    {
      question: "Jak sprawdzić, czy holenderska agencja pracy jest legalna?",
      answer:   "Sprawdź rejestrację SNA (Stichting Normering Arbeid) lub przynależność do ABU/NBBU i zweryfikuj numer KvK (Izba Handlowa). Na AgencyCheck profile agencji pokazują status weryfikacji, opinie pracowników i warunki mieszkaniowe. Sygnały alarmowe: żądanie zaliczki, brak pisemnej umowy, presja na natychmiastowy start.",
    },
    {
      question: "Ile kosztuje zakwaterowanie podczas pracy przez agencję w Holandii?",
      answer:   "Zakwaterowanie agencji kosztuje zazwyczaj €80–€113,50/tydzień potrącane z wynagrodzenia brutto. Maksymalne legalne potrącenie SNF za certyfikowane pokoje wieloosobowe wynosi €113,50/tydzień (2024). Własne zakwaterowanie w Holandii to €500–€900/miesiąc w zależności od miasta.",
    },
    {
      question: "Co zrobić jeśli agencja nie płaci mi poprawnie?",
      answer:   "Zażądaj pełnego odcinka płacowego (loonstrook) i porównaj każdą pozycję z podpisaną umową. Jeśli są rozbieżności: skontaktuj się z agencją na piśmie, zgłoś sprawę do Inspectie SZW (inspectieszw.nl), skontaktuj się ze związkami zawodowymi FNV lub CNV, a w kwestii zakwaterowania — z SNF.",
    },
  ]);

  return (
    <div className="min-h-screen bg-white">

      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema)     }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema)    }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFaqs)   }} />

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
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3.5 py-1.5 text-[10px] font-bold tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  🇳🇱 Holandia · Zero płatnych rankingów
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-[10px] font-bold tracking-widest uppercase text-blue-300">
                  🏗 Zbudowane dla pracowników agencyjnych w Holandii
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-black leading-[1.06] tracking-tight mb-4">
                Myślisz, że zarabiasz{" "}
                <span className="text-emerald-400">€588/tydzień.</span>
                <br />
                W kieszeni zostaje Ci{" "}
                <span className="text-red-400">€345.</span>
              </h1>

              <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6">
                {[
                  { value: `${totalReviews} raportów pracowników`, note: "38 zweryfikowanych · 73 anonimowych" },
                  { value: "42% ocenia 1–2 gwiazdki", note: "publikowane bez filtrowania" },
                  { value: "€63/tydz. realny podatek", note: "źródło: belastingdienst.nl 2026" },
                  { value: `${totalAgencies} agencji w profilu`, note: "z publicznych rejestrów" },
                ].map((s) => (
                  <div key={s.value} className="flex items-baseline gap-1.5">
                    <span className="text-[11px] font-black text-white">{s.value}</span>
                    <span className="text-[10px] text-gray-500">{s.note}</span>
                  </div>
                ))}
              </div>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
                Zakwaterowanie, ubezpieczenie, transport i opłaty administracyjne są potrącane zanim dostaniesz wypłatę.
                Sprawdź swoje <strong className="text-white">realne zarobki netto</strong>, porównaj agencje
                i zostań dopasowany do zweryfikowanych ofert —{" "}
                <strong className="text-emerald-400">bezpłatnie, bez zobowiązań</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <a href="#lead-form"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] transition-all px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/50">
                  Znajdź ofertę — bezpłatnie →
                </a>
                <a href="#calculator"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/6 hover:bg-white/12 active:scale-[0.98] transition-all px-8 py-4 text-base font-semibold text-gray-200">
                  🧮 Oblicz moją wypłatę
                </a>
              </div>

              <SmartSearch suggestions={searchSuggestions} size="large" placeholder="Szukaj agencji, miast lub stanowisk…" />
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
              {
                value: `${totalReviews}`,
                label: "raportów pracowników",
                sub: "38 zweryfikowanych · 73 zgłoszonych · 42% ocenia 1–2 gwiazdki",
                color: "text-emerald-400",
              },
              {
                value: "15",
                label: "błędów w odcinkach płacowych",
                sub: "zweryfikowane wg CAO ABU/NBBU i limitów SNF",
                color: "text-red-400",
              },
              {
                value: `${totalAgencies}`,
                label: "agencji w bazie",
                sub: "każda sprawdzona w rejestrach KvK · ABU · SNA",
                color: "text-amber-400",
              },
              {
                value: "€0",
                label: "zapłacone za wyższe miejsce",
                sub: "żadna agencja nie płaciła za lepszą pozycję · zero płatnych rankingów",
                color: "text-blue-400",
              },
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
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 shrink-0">Źródła danych:</span>
              {[
                { label: "Prawo podatkowe NL",    cite: "belastingdienst.nl 2026",      href: "https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/", color: "text-blue-400" },
                { label: "Limity zakwaterowania", cite: "SNF Normering Flexwonen 2024", href: "https://www.snf.nl/normering/",                                         color: "text-emerald-400" },
                { label: "Standardy CAO",         cite: "ABU/NBBU CAO 2023–2025",       href: "https://www.abu.nl/abu-cao/",                                          color: "text-amber-400" },
                { label: "Rejestr agencji",        cite: "publiczny rejestr SNA",        href: "https://www.normeringarbeid.nl/register/",                             color: "text-purple-400" },
                { label: "Inspekcja pracy",        cite: "Inspectie SZW",                href: "https://www.inspectieszw.nl/",                                         color: "text-gray-400" },
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
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-red-500">
              Ukryte koszty pracy przez agencje
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-4">
              Większość pracowników traci{" "}
              <span className="text-red-500">€300–€500 miesięcznie</span>{" "}
              na ukrytych potrąceniach
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Te potrącenia często nie są wspominane przed podpisaniem umowy — a wiele z nich jest
              częściowo lub całkowicie nielegalnych. Większość pracowników nigdy się o nich nie dowiaduje.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {HIDDEN_DEDUCTIONS.map((item) => (
              <div key={item.label}
                className="rounded-2xl border border-red-100 bg-red-50/30 p-5 hover:border-red-200 hover:bg-red-50/60 transition-colors">
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <h3 className="text-sm font-black text-gray-900 mb-1">{item.label}</h3>
                <p className="text-xs font-bold text-red-600 mb-2">{item.amount}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>

          {/* Comparison bar */}
          <div className="max-w-3xl mx-auto rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden">
            <div className="bg-gray-900 px-6 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Pracownik WML · €14,71/h · 40h/tydzień · Zakwaterowanie + transport agencji
              </p>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-gray-600">Co agencja reklamuje (brutto)</span>
                  <span className="text-sm font-black text-gray-900">€588/tydzień</span>
                </div>
                <div className="h-3 rounded-full bg-gray-200 w-full" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-gray-600">Po holenderskim podatku (z ulgami heffingskorting)</span>
                  <span className="text-sm font-black text-gray-700">€525/tydzień</span>
                </div>
                <div className="h-3 rounded-full bg-amber-300" style={{ width: "89%" }} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-red-700">Co faktycznie dostajesz do ręki</span>
                  <span className="text-sm font-black text-red-600">€345/tydzień</span>
                </div>
                <div className="h-3 rounded-full bg-red-400" style={{ width: "59%" }} />
              </div>
            </div>
            <div className="px-6 pb-4 flex items-center justify-between">
              <p className="text-[11px] text-gray-400">
                Potrącenia: €63 podatek + €95 zakwaterowanie + €35 ubezpieczenie + €25 transport + €25 opłaty adm.{" "}
                <Link href="/methodology" className="text-blue-600 underline">Pełna metodologia →</Link>
              </p>
              <a href="#lead-form"
                className="shrink-0 ml-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors px-5 py-2.5 text-xs font-black text-white active:scale-[0.98]">
                Znajdź lepsze oferty
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
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
              Prawdziwi pracownicy. Prawdziwe słowa.
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
              Co pracownicy nam naprawdę powiedzieli
            </h2>
            <p className="text-xs text-gray-400 font-semibold">
              Nie materiały marketingowe · Nie PR agencji · Prawdziwe zgłoszenia od prawdziwych pracowników
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mb-8">
            {WORKER_TESTIMONIALS.map((t) => (
              <div key={t.name}
                className={`rounded-2xl border p-6 flex flex-col gap-4 ${
                  t.rating >= 4
                    ? "border-emerald-100 bg-emerald-50/30"
                    : "border-red-100 bg-red-50/20"
                }`}>
                <StarRating value={t.rating} />
                <blockquote className="text-sm text-gray-800 leading-relaxed font-medium italic flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <span className="text-2xl">{t.flag}</span>
                  <div>
                    <p className="text-xs font-black text-gray-900">{t.name}</p>
                    <p className="text-[11px] text-gray-500">{t.job}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link href="/reviews"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors px-7 py-3.5 text-sm font-bold text-gray-700 shadow-sm">
              📋 Czytaj wszystkie {totalReviews} opinii
            </Link>
            <Link href="/submit-review"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
              ✍️ Podziel się swoim doświadczeniem →
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
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1.5">
                Bezpłatne dopasowanie — bez opłat, bez zobowiązań
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                Znajdź zweryfikowaną agencję, która pokazuje realne potrącenia
              </h2>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-xl">
                <span className="font-semibold text-gray-700">Przejrzyste potrącenia</span> ·{" "}
                <span className="font-semibold text-gray-700">Zweryfikowane zakwaterowanie</span> ·{" "}
                <span className="font-semibold text-gray-700">Prawdziwe opinie pracowników</span>{" "}
                — dopasowujemy Cię tylko z agencjami, które przeszły nasze weryfikacje.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              {["Zero płatnych rankingów", "Zgodność z RODO", "Bezpłatne dopasowanie"].map((b) => (
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
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
              Kalkulator wynagrodzeń — holenderskie stawki podatkowe 2026
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3">
              Ile naprawdę zostanie Ci z wypłaty?
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Dostosuj do swojej oferty. Realne holenderskie podatki z wszystkimi ulgami heffingskorting.
              Każde potrącenie wyliczane na żywo.
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
            <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">Metodologia obliczeń</p>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">Jak obliczamy Twoje realne wynagrodzenie</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-7">
            {[
              {
                icon: "📊",
                title: "Holenderski podatek dochodowy 2026",
                items: [
                  "Progi loonheffing (2 poziomy)",
                  "Algemene heffingskorting — do €3.362/rok ulgi",
                  "Arbeidskorting — do €5.000/rok ulgi",
                  "Efektywna stawka = podatek ÷ brutto (po wszystkich ulgach)",
                ],
              },
              {
                icon: "🏠",
                title: "Logika potrąceń za zakwaterowanie",
                items: [
                  "Zakwaterowanie agencji: €80–€120/tydz. (norma SNF)",
                  "Własne zakwaterowanie: €500–€900/mies. (średnia regionalna)",
                  "Limit prawny SNF: ~€113,50/tydz. za pokoje wieloosobowe",
                  "Źródło: SNF Normering Flexwonen 2024",
                ],
              },
              {
                icon: "🚌",
                title: "Transport i ubezpieczenie",
                items: [
                  "Bus agencji: śr. €25/tydz. (zgłoszenia pracowników)",
                  "Zorgverzekering: €152–€180/mies. (rynek 2026)",
                  "Własny eigen risico: śr. €33/mies.",
                  "Opłaty adm.: €0–€20/tydz. (podane przez agencje)",
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
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">Kluczowe założenia</p>
              <ul className="space-y-2 text-xs text-gray-700">
                {[
                  "Zatrudnienie główne w Holandii (bez stosowania umów o unikaniu podwójnego opodatkowania)",
                  "48 tygodni roboczych/rok (4 tygodnie urlopu wliczone)",
                  "8% vakantiegeld (dodatek urlopowy) doliczone do brutto zgodnie z BW Art. 7:634",
                  "Pracownik bez partnera — bez ulg partnerskich ani odliczeń za opiekę nad dziećmi",
                  "Standardowe ubezpieczenie zdrowotne (bez zasiłków toeslagen)",
                  "WML 2026: €14,71/godz. · Aktualizacja: styczeń 2026",
                ].map((a) => (
                  <li key={a} className="flex items-start gap-2">
                    <span className="text-blue-500 font-black shrink-0 mt-0.5">✓</span>{a}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[10px] text-gray-400 leading-relaxed border-t border-blue-100 pt-3">
                <strong className="text-gray-500">Zastrzeżenie prawne:</strong> Obliczenia mają wyłącznie charakter informacyjny i nie stanowią porady podatkowej, prawnej ani finansowej. Indywidualne okoliczności mogą się różnić. Skonsultuj się z belastingadviseur w sprawie swojej konkretnej sytuacji.{" "}
                <Link href="/methodology" className="text-blue-600 underline hover:text-blue-800">Pełna metodologia →</Link>
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="bg-gray-900 px-5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Przykład: Pracownik WML · €14,71/h · 40h/tydz. · Realny podatek 2026
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
                  Podatek −€63 (realny loonheffing 2026 po ulgach AHK+AK) + €95 zakwaterowanie + €25 transport + €35 ubezpieczenie + €25 adm.{" "}
                  <Link href="/methodology" className="text-blue-600 underline">Pełna metodologia</Link>
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
            Teraz znasz realne liczby
          </p>
          <h2 className="text-2xl sm:text-4xl font-black leading-tight mb-4">
            Chcesz <span className="text-emerald-400">lepszych warunków</span> i
            więcej pieniędzy każdego tygodnia?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Nie wszystkie agencje są takie same. Niektóre mają niższe opłaty za zakwaterowanie, szybsze odcinki płacowe i przejrzyste umowy. Sprawdzamy, które — i dopasowujemy Cię bezpłatnie.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#lead-form"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/40 active:scale-[0.98]">
              Zobacz zweryfikowane oferty →
            </a>
            <Link href="/agencies-with-housing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/8 hover:bg-white/15 transition-colors px-8 py-4 text-base font-bold text-gray-300 active:scale-[0.98]">
              Przeglądaj {housingCount} agencji z zakwaterowaniem
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
            {["Zero płatnych rankingów", "Agencje nie mogą kupić lepszych ocen", "Oceny są w pełni wystawiane przez pracowników", "Status partnera nigdy nie wpływa na wyniki"].map((t) => (
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
              Jak działa AgencyCheck — i jak zarabiamy
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Uczciwie o tym, jak to działa
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                icon: "📋",
                title: "Co robi AgencyCheck",
                body: "Zbieramy opinie pracowników, analizujemy odcinki płacowe i publikujemy niezależne rankingi holenderskich agencji pracy. Nie rekrutujemy pracowników — pomagamy Ci dokonać świadomego wyboru.",
              },
              {
                icon: "💰",
                title: "Jak zarabiamy",
                body: "Jeśli skorzystasz z naszej usługi dopasowania i zostaniesz zatrudniony, agencja płaci nam wynagrodzenie za znalezienie kandydata. Opłata pochodzi od agencji — nigdy od Ciebie. Pracownicy zawsze płacą zero.",
              },
              {
                icon: "⚖️",
                title: "Dlaczego rankingi pozostają uczciwe",
                body: "Agencje nie mogą płacić za wyższe miejsce w rankingu, usuwanie opinii ani wpływanie na swoje wyniki. Płacące agencje nie uzyskują przewagi w dopasowywaniu. Jedynie oceny pracowników determinują ich pozycję.",
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
              <strong>Ujawnienie konfliktu interesów:</strong> Agencje partnerskie w usłudze dopasowania nie otrzymują wyższych ocen ani preferencyjnego miejsca w wynikach wyszukiwania.
              Nasze rankingi są obliczane wyłącznie na podstawie zweryfikowanych zgłoszeń pracowników. Możesz{" "}
              <Link href="/methodology" className="underline hover:text-amber-700">przeczytać naszą pełną metodologię</Link>{" "}
              i{" "}
              <Link href="/reviews" className="underline hover:text-amber-700">przeglądać wszystkie niefiltrowane opinie</Link>{" "}
              — w tym negatywne — w dowolnym momencie.
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
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-red-500">Czego żadna agencja Ci nie powie</p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-4">Typowe problemy zgłaszane przez pracowników</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
              Na podstawie {totalReviews}+ zweryfikowanych raportów pracowników. Wiedza o tym chroni Cię przed podpisaniem.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {WORKER_PROBLEMS.map((p, i) => (
              <div key={p.title}
                className={`rounded-2xl border p-6 ${i === 0 ? "lg:col-span-1 border-red-100 bg-red-50/40" : "border-gray-100 bg-gray-50 hover:border-red-100 hover:bg-red-50/20 transition-colors"}`}>
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
              📋 Czytaj prawdziwe doświadczenia pracowników →
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
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">Prawdziwe zakwaterowanie — nie prospekty</p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3">Zobacz, gdzie naprawdę będziesz mieszkać</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Zdjęcia i opisy przesłane przez pracowników. Żadnych stockowych zdjęć. Żadnego PR agencji.
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8">
            <WorkerHousingStrip />
          </div>
          <div className="mt-6 text-center">
            <Link href="/agencies-with-housing"
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100 transition-colors">
              Przeglądaj wszystkie {housingCount} agencji z zakwaterowaniem →
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
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
              Agencje zweryfikowane badaniem
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3">
              Przejrzyste oferty — pokazany realny dochód netto
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed mb-4">
              Każda karta pokazuje szacunkowy tygodniowy dochód netto po holenderskim podatku i potrąceniach.
              Żadnych zawyżonych liczb brutto.
            </p>
            <div className="inline-flex flex-wrap items-center justify-center gap-3 text-[10px] font-semibold border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5">
              <span className="text-gray-400 font-black uppercase tracking-wider">Co oznaczają odznaki:</span>
              <span className="inline-flex items-center gap-1 text-gray-500 bg-white border border-gray-200 rounded-full px-2.5 py-1">
                <span className="text-gray-400">👤</span> Zgłoszone przez pracownika — tylko opinie pracowników
              </span>
              <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1">
                <span className="text-blue-400">🔍</span> Sprawdzone badaniem — potwierdzone KvK + przegląd zespołu
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
                <span className="text-emerald-500">✓</span> Zarejestrowane w SNA — certyfikowane przez Stichting Normering Arbeid
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mb-10">
            {housingAgencies.slice(0, 3).map((agency) => {
              const meta = VERIFIED_JOB_META[agency.slug];
              return (
                <div key={agency.slug}
                  className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col group">

                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-5 py-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                          {meta?.sector ?? "Usługi pracy"}
                        </span>
                        <h3 className="text-base font-black text-white leading-tight truncate">
                          {meta?.jobTitle ?? "Magazyn / Produkcja"}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">📍 {agency.city}</p>
                      </div>
                      <span className="shrink-0 text-[9px] font-black uppercase tracking-wider text-blue-300 bg-blue-400/15 border border-blue-400/20 rounded-full px-2 py-1 whitespace-nowrap">
                        🔍 Sprawdzone badaniem
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
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Stawka godzinowa</p>
                        <p className="text-lg font-black text-gray-900">
                          €{(meta?.hourlyRate ?? 14.71).toFixed(2)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2.5 text-center">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Szac. netto/tydz.</p>
                        <p className="text-lg font-black text-emerald-700">
                          €{meta?.estNetWeekly ?? 316}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs text-gray-500">
                      <div className="flex items-center justify-between">
                        <span>🏠 Koszt zakwaterowania</span>
                        <span className="font-bold text-gray-700">€{meta?.housingCost ?? 95}/tydz.</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>⭐ Ocena pracowników</span>
                        <StarRating value={agency.avgSalaryRating ?? 3.5} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>⚡ Czas odpowiedzi</span>
                        <span className="font-bold text-gray-700">{meta?.responseTime ?? "< 24 godziny"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
                    <ApplyBar
                      context={{
                        sourcePage:           "/pl",
                        sourceType:           "agency_page",
                        sourceLabel:          `PL Homepage agency card — ${agency.slug}`,
                        defaultAccommodation: true,
                      }}
                      ctaText="Złóż zapytanie"
                      buttonOnly
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mb-7">
            {housingAgencies.map((agency) => (
              <AgencyCard key={agency.slug} agency={agency} jobCount={getJobCountForAgency(agency.slug)} locale="pl" />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link href="/agencies-with-housing"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors px-8 py-4 text-sm font-black text-white shadow-sm">
              🏢 Wszystkie {housingCount} agencji z zakwaterowaniem
            </Link>
            <Link href="/agencies" className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
              Wszystkie {totalAgencies} agencji →
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
                  ⚡ Bezpłatne narzędzie
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-4">
                  Czy agencja niedopłaciła Ci?
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  Prześlij swój holenderski odcinek płacowy (<em>loonstrook</em>) a my zweryfikujemy każdą pozycję
                  względem oficjalnych tabel podatkowych 2026 i norm CAO ABU/NBBU.
                </p>
                <p className="text-gray-400 text-xs leading-relaxed mb-6">
                  Sprawdzamy: prawidłowe progi podatkowe · zastosowane ulgi heffingskorting ·
                  limity potrąceń za zakwaterowanie SNF · premie za nadgodziny · obliczenie vakantiegeld.
                </p>
                <Link href="/tools/payslip-checker"
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 transition-colors px-7 py-3.5 text-sm font-black text-white shadow-sm shadow-amber-900/40 active:scale-[0.98]">
                  📄 Prześlij odcinek płacowy — sprawdź teraz
                </Link>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Co weryfikujemy</p>
                <ul className="space-y-2.5">
                  {[
                    { ok: true,  label: "Prawidłowe progi loonheffing zastosowane" },
                    { ok: true,  label: "Obliczona ulga heffingskorting" },
                    { ok: true,  label: "Potrącenie za zakwaterowanie ≤ maksymalne SNF" },
                    { ok: true,  label: "Premie za nadgodziny (100%, 125%, 150%)" },
                    { ok: true,  label: "Vakantiegeld ≥ 8% wynagrodzenia brutto" },
                    { ok: false, label: "Fałszywe potrącenia lub niewyjaśnione opłaty" },
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
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">Poradnik dla pracowników</p>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-5 leading-tight">
                Wszystko, co musisz wiedzieć przed pracą w Holandii
              </h2>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>
                  Holenderska płaca minimalna (<em>Wettelijk Minimumloon</em>) wynosi{" "}
                  <strong className="text-gray-900">€14,71/godzinę w 2026 roku</strong> dla pracowników
                  w wieku 21+. Przy 40 godzinach tygodniowo daje to brutto dokładnie €588/tydzień
                  (€14,71 × 40 godzin). Ale po holenderskim podatku dochodowym, zakwaterowaniu agencji, ubezpieczeniu
                  zdrowotnym i transporcie większość pracowników zachowuje między{" "}
                  <strong className="text-gray-900">€300–€370</strong> —
                  ok. 50–63% brutto, w zależności od agencji.
                </p>
                <p>
                  Kluczowe zabezpieczenia prawne, które warto znać: <strong className="text-gray-900">ABU / NBBU CAO</strong>{" "}
                  reguluje stawki wynagrodzenia, premie za nadgodziny i wynagrodzenie urlopowe.
                  <strong className="text-gray-900"> SNF</strong> (Stichting Normering Flexwonen) określa maksymalne prawne
                  potrącenia za zakwaterowanie. <strong className="text-gray-900">Inspectie SZW</strong> egzekwuje całe prawo pracy.
                  AgencyCheck weryfikuje agencje względem wszystkich trzech.
                </p>
                <p>
                  Nasz{" "}
                  <Link href="/tools/real-income-calculator" className="text-blue-600 underline hover:text-blue-800">kalkulator wynagrodzeń</Link>{" "}
                  używa oficjalnych tabel podatkowych 2026 i uwzględnia zarówno ulgę <em>algemene heffingskorting</em>, jak i{" "}
                  <em>arbeidskorting</em> — ulgi, które mogą zaoszczędzić niskopłatnym pracownikom
                  €600–€700 miesięcznie w podatkach, o których wiele agencji nie wspomina.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Szybki dostęp</p>
              {[
                { icon: "💶", href: "/tools/real-income-calculator",        title: "Pełny kalkulator wynagrodzeń",        desc: "Wynagrodzenie netto ze wszystkimi ulgami podatkowymi 2026" },
                { icon: "📄", href: "/tools/payslip-checker",               title: "Narzędzie do weryfikacji odcinków",    desc: "Prześlij loonstrook i sprawdź błędy" },
                { icon: "🏢", href: "/agencies",                            title: "Wszystkie agencje w Holandii",         desc: `${totalAgencies} agencji sklasyfikowanych według ocen pracowników` },
                { icon: "🏠", href: "/agencies-with-housing",               title: "Praca z zakwaterowaniem",              desc: `${housingCount} zweryfikowanych agencji z zakwaterowaniem` },
                { icon: "⭐", href: "/reviews",                             title: "Opinie pracowników",                   desc: `${totalReviews}+ prawdziwych anonimowych opinii` },
                { icon: "📋", href: "/work-in-netherlands-for-foreigners",  title: "Prawa i poradnik prawny",              desc: "ABU CAO, WML, SNF — wytłumaczone prosto" },
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
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Przeglądaj oferty pracy według miasta</p>
            <div className="flex flex-wrap gap-2">
              {TOP_CITIES.slice(0, 18).map((c) => (
                <Link key={c.slug} href={`/jobs-in-${c.slug}`}
                  className="inline-flex items-center text-xs font-medium bg-white border border-gray-200 text-gray-700 rounded-full px-3 py-1.5 hover:border-blue-300 hover:text-blue-700 transition-colors">
                  💼 {c.name}
                </Link>
              ))}
              <Link href="/jobs-in-netherlands"
                className="inline-flex items-center text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700 rounded-full px-3 py-1.5 hover:bg-blue-100 transition-colors">
                🇳🇱 Wszystkie miasta →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center mb-10">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">FAQ</p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Pytania, które pracownicy naprawdę zadają</h2>
          </div>
          <HomepageFAQ />
          <div className="mt-8 text-center">
            <Link href="/work-in-netherlands-for-foreigners"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
              📖 Pełny poradnik: Praca w Holandii →
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
              Poznaj prawdę<br />zanim podpiszesz.
            </h2>
            <p className="text-blue-200 text-base sm:text-lg leading-relaxed mb-4 max-w-lg mx-auto">
              {totalAgencies} agencji. {totalReviews}+ opinii pracowników. Realne podziały wypłat.
              Zero płatnych rankingów. Zbudowane dla pracowników — nie rekruterów.
            </p>
            <p className="text-xs text-blue-400 mb-9">
              ✓ Zero płatnych rankingów &nbsp;·&nbsp; ✓ Agencje nie mogą kupić lepszych ocen &nbsp;·&nbsp;
              ✓ Oceny są w pełni wystawiane przez pracowników &nbsp;·&nbsp; ✓ Status partnera nigdy nie wpływa na wyniki
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <a href="#lead-form"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/40 active:scale-[0.98]">
                Znajdź ofertę — bezpłatnie →
              </a>
              <a href="#calculator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/8 hover:bg-white/15 transition-colors px-8 py-4 text-base font-bold text-gray-200 active:scale-[0.98]">
                🧮 Oblicz moją wypłatę
              </a>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-blue-400">
              <Link href="/agencies"                     className="hover:text-white transition-colors">Wszystkie agencje</Link>
              <span className="text-blue-800">·</span>
              <Link href="/reviews"                      className="hover:text-white transition-colors">Opinie pracowników</Link>
              <span className="text-blue-800">·</span>
              <Link href="/agencies-with-housing"        className="hover:text-white transition-colors">Praca z zakwaterowaniem</Link>
              <span className="text-blue-800">·</span>
              <Link href="/tools/real-income-calculator" className="hover:text-white transition-colors">Kalkulator wynagrodzeń</Link>
              <span className="text-blue-800">·</span>
              <Link href="/methodology"                  className="hover:text-white transition-colors">Metodologia</Link>
              <span className="text-blue-800">·</span>
              <Link href="/privacy"                      className="hover:text-white transition-colors">Prywatność</Link>
              <span className="text-blue-800">·</span>
              <Link href="/terms"                        className="hover:text-white transition-colors">Warunki</Link>
            </nav>
          </div>
        </div>
      </section>

      {/* Sticky bar */}
      <HomepageStickyBar />

    </div>
  );
}
