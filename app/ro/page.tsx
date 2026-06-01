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
  title: "Agenție de Muncă Olanda — Recenzii, Salarii și Cazare Verificate 2026",
  description:
    "Compară 150+ agenții de muncă din Olanda. Salariu net real după deducerea cazării, asigurării și transportului. Recenzii de la lucrători, condiții de cazare și clasamente. Înainte să semnezi — verifică aici.",
  alternates: {
    canonical: "https://agencycheck.io/ro",
    languages: {
      "en":        "https://agencycheck.io/",
      "pl":        "https://agencycheck.io/pl",
      "ro":        "https://agencycheck.io/ro",
      "x-default": "https://agencycheck.io/",
    },
  },
  openGraph: {
    title: "Agenție de Muncă Olanda — Recenzii, Salarii și Cazare 2026",
    description:
      "Defalcări salariu real, poze cazare și recenzii de la lucrători pentru 150+ agenții de muncă din Olanda. Află adevărul înainte să semnezi.",
    locale: "ro_RO",
  },
};

export const dynamic = "force-dynamic";

// ─── Verified job meta ────────────────────────────────────────────────────────
const VERIFIED_JOB_META: Record<string, {
  jobTitle: string; hourlyRate: number; estNetWeekly: number;
  housingCost: number; responseTime: string; sector: string;
}> = {
  "otto-work-force": {
    jobTitle: "Lucrător depozit", hourlyRate: 14.71, estNetWeekly: 316,
    housingCost: 95, responseTime: "< 4 ore", sector: "Logistică",
  },
  "covebo": {
    jobTitle: "Lucrător producție", hourlyRate: 15.50, estNetWeekly: 338,
    housingCost: 92, responseTime: "< 6 ore", sector: "Producție alimentară",
  },
  "foreignflex": {
    jobTitle: "Lucrător linie asamblare", hourlyRate: 14.71, estNetWeekly: 322,
    housingCost: 88, responseTime: "< 8 ore", sector: "Producție",
  },
};

// ─── Salary breakdown rows (RO) ───────────────────────────────────────────────
const SALARY_ROWS = [
  { label: "Salariu brut (WML €14,71 × 40h)",     amount: "+€588", green: true,  bold: false },
  { label: "Taxe & contribuții sociale (loonheffing)", amount: "−€63",  green: false, bold: false },
  { label: "Cazare agenție (standard SNF)",        amount: "−€95",  green: false, bold: false },
  { label: "Asigurare de sănătate",                amount: "−€35",  green: false, bold: false },
  { label: "Transport (autobuz agenție)",           amount: "−€25",  green: false, bold: false },
  { label: "Taxe administrative",                  amount: "−€25",  green: false, bold: false },
  { label: "💶 Păstrezi",                         amount: "€345",  green: true,  bold: true  },
] as const;

// ─── Authentic worker testimonials ────────────────────────────────────────────
const WORKER_TESTIMONIALS = [
  {
    quote: "Agency told me salary is €550 per week. After they take room and transport I got only €310. Nobody explain this before I sign. I was shock.",
    name: "Mariusz K.",
    from: "Polonia",
    job: "Lucrător depozit, Rotterdam",
    flag: "🇵🇱",
    rating: 2,
  },
  {
    quote: "Housing was €95 per week they say. But in contract was also €18 admin fee, €12 for bedding, €7 for cleaning. Every week new charge. I never understand my loonstrook.",
    name: "Bogdan T.",
    from: "România",
    job: "Linie producție, Eindhoven",
    flag: "🇷🇴",
    rating: 1,
  },
  {
    quote: "I work here 3 years already, with good agency now. My first agency was terrible. Use this site please. Check the real reviews. I wish someone tell me before.",
    name: "Olena V.",
    from: "Ucraina",
    job: "Seră, Westland",
    flag: "🇺🇦",
    rating: 5,
  },
];

// ─── AgencyCheck benefits (RO) ───────────────────────────────────────────────
const AGENCYCHECK_BENEFITS = [
  { icon: "⚡", label: "Răspuns în aceeași zi", detail: "Aplică prin WhatsApp și primești răspuns de la un recrutor real în aceeași zi lucrătoare — ruta România–Olanda este una dintre cele mai frecventate căi de migrație a forței de muncă din UE. Poți începe în 7–14 zile de la primul contact. Nicio săptămână de așteptare, niciun bot automat." },
  { icon: "🏠", label: "Cazare certificată SNF", detail: "Agențiile de pe AgencyCheck oferă cazare ca parte din pachet. Certificarea SNF (verificabilă la snf.nl) garantează condiții decente: deducerea maximă legală este €113,50/săptămână (2026). Mulți români lucrează în serele din Westland — locul de muncă influențează și locația cazării, deci verifică distanța față de fabrică sau seră înainte de a semna." },
  { icon: "📋", label: "Contract transparent înainte de plecare", detail: "Înainte să semnezi, știi exact ce se deduce: cazare, transport (linie separată în contract: €20–€30/săpt.), asigurare. Ai nevoie de BSN (burgerservicenummer) în primele săptămâni — agența trebuie să te ajute să îl obții. Vakantiegeld (concediu plătit) reprezintă 8% din salariul brut și se plătește de două ori pe an — verifică să fie inclus în calcule." },
  { icon: "🆓", label: "Gratuit pentru lucrători — mereu", detail: "AgencyCheck este 100% gratuit pentru lucrători. Legea olandeză WAADI interzice explicit perceperea de taxe de plasament de la lucrători. Agențiile din baza noastră sunt înregistrate la KvK (Camera de Comerț olandeză) și afiliate ABU sau NBBU. Sindicatele CNV și FNV sunt disponibile și pentru lucrătorii români în caz de litigii." },
];

// ─── Agency offers (RO) ──────────────────────────────────────────────────────
const AGENCY_OFFERS = [
  { icon: "📄", title: "Contract scris înainte de plecare", body: "O agenție bună oferă întotdeauna contract scris în avans, înainte să pășești în avion. Contractul trebuie să specifice: tariful orar (minim WML €14,71/oră), costul cazării (max. €113,50/săpt. conform SNF), data de start și faza CAO în care ești încadrat (Faza A — primele 78 de săptămâni). Absența unui contract scris înainte de plecare este un semnal de alarmă serios." },
  { icon: "🏠", title: "Cazare certificată SNF — verificabilă", body: "Cele mai bune agenții dețin certificarea SNF (Stichting Normering Flexwonen), verificabilă public pe snf.nl — standardul olandez independent pentru calitatea locuințelor lucrătorilor. Mulți români sunt plasați în serele din Westland sau în producția alimentară; verifica distanța de la cazare la locul de muncă și dacă transportul este inclus sau facturat separat (max. €20–€30/săpt.)." },
  { icon: "⏱", title: "Ore suplimentare plătite conform CAO", body: "Conform ABU/NBBU CAO, orele suplimentare (overwerktoeslag) sunt remunerate la 125% în zilele lucrătoare și 150% duminica și de sărbători. Agențiile bune aplică asta automat și afișează clar pe loonstrook (fluturașul de salariu). Vakantiegeld (indemnizație de concediu) reprezintă 8% din salariul brut și este plătit de două ori pe an — verifică dacă apare pe fluturiș." },
  { icon: "🚌", title: "Transport și BSN — pași concreți", body: "Cele mai multe agenții organizează transport la locul de muncă — costul tipic este €20–€30/săptămână și trebuie să apară ca linie separată pe loonstrook, nu ascuns în alte taxe. În primele săptămâni ai nevoie de BSN (burgerservicenummer) pentru impozitare — agența trebuie să te ajute să programezi o întâlnire la primărie (gemeente). Fără BSN nu poți fi plătit legal." },
  { icon: "💬", title: "Sprijin în română și drepturi sindicale", body: "Agențiile bune au angajați care vorbesc română și explică clar fiecare deducere de pe fluturiș. Ca cetățean UE în Olanda ai aceleași drepturi ca un lucrător olandez: salariu minim garantat (WML), protecție prin CAO și acces la sindicatele FNV și CNV care oferă consiliere și în limba română. Orice problemă cu plata poate fi sesizată la Inspectie SZW." },
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

export default async function RoHomePage() {
  const totalAgencies = AGENCIES.length;
  const housingCount  = AGENCIES_WITH_HOUSING.length;
  const reviewStats   = await getPublishedReviewStats();
  const totalReviews  = reviewStats.total || 111;

  const housingAgencies = AGENCIES_WITH_HOUSING.slice(0, 3);

  const searchSuggestions: SearchSuggestion[] = [
    ...AGENCIES.map((a) => ({ type: "agency" as const, label: a.name, sublabel: a.city, href: `/agencies/${a.slug}` })),
    ...TOP_CITIES.map((c) => ({ type: "city" as const, label: c.name, sublabel: c.region, href: `/cities/${c.slug}` })),
    ...Object.entries(JOB_TYPE_META).map(([slug, meta]) => ({ type: "job" as const, label: meta.title, sublabel: "Tip job", href: `/jobs/${slug}` })),
    { type: "job" as const, label: "Joburi Randstad",    sublabel: `${RANDSTAD_STATS.total} locuri`,  href: "/randstad-jobs" },
    { type: "job" as const, label: "Joburi Tempo-Team",  sublabel: `${TEMPO_TEAM_STATS.total} locuri`, href: "/tempo-team-jobs" },
  ];

  const latestReviews = getLatestReviews(3).map((r, i) => ({
    review: {
      id:                    `hp-ro-${i}`,
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
  const crumbSchema = breadcrumbSchema([{ name: "Acasă", url: "/ro" }]);
  const homepageFaqs = faqPageSchema([
    {
      question: "Cât păstrez din salariu după chirie și deduceri în Olanda?",
      answer:   `La salariul minim legal (€14,71/oră, 40h/săptămână), salariul brut săptămânal este €588. După impozitul pe venit olandez (cu credite heffingskorting), cazare agenție (~€95/săpt.), transport și asigurare de sănătate, majoritatea lucrătorilor păstrează €300–€370/săptămână — aproximativ 51–63% din brut.`,
    },
    {
      question: "Sunt legale deducerile din salariu ale agenției în Olanda?",
      answer:   "Da — dar numai în limitele stricte stabilite de CAO ABU și NBBU. Agențiile pot deduce cazarea, transportul și asigurarea de sănătate, dar sumele trebuie specificate în contractul tău. Deducerile pentru servicii nerecepționate sau peste prețurile contractate sunt ilegale. Raportează încălcările la Inspectie SZW.",
    },
    {
      question: "Care este salariul minim în Olanda în 2026?",
      answer:   "Salariul minim legal olandez (WML) este €14,71 pe oră în 2026 pentru lucrătorii de 21+. La 40 de ore/săptămână aceasta înseamnă aproximativ €2.545/lună brut. Agențiile sunt obligate legal să plătească cel puțin WML indiferent de naționalitate.",
    },
    {
      question: "Cum verific dacă o agenție de muncă olandeză este legitimă?",
      answer:   "Verifică înregistrarea SNA (Stichting Normering Arbeid) sau apartenența la ABU/NBBU și verifică înregistrarea KvK (Camera de Comerț). Pe AgencyCheck, profilurile agențiilor arată statutul de verificare, recenziile lucrătorilor și condițiile de cazare. Semnale de alarmă: solicitarea unui avans, lipsa unui contract scris și presiunea de a începe imediat.",
    },
    {
      question: "Care sunt costurile medii de cazare când lucrezi printr-o agenție olandeză?",
      answer:   "Cazarea agenției costă de obicei €80–€113,50/săptămână deduși din salariul brut. Deducerea legală maximă SNF pentru cazare partajată certificată este €113,50/săptămână (2024). Cazarea proprie în Olanda variază între €500–€900/lună în funcție de oraș.",
    },
    {
      question: "Ce fac dacă agenția mea nu mă plătește corect?",
      answer:   "Solicită un fluturiș de salariu detaliat (loonstrook) și compară fiecare linie cu contractul tău semnat. Dacă există discrepanțe: contactează agenția în scris, raportează la Inspectie SZW (inspectieszw.nl), contactează sindicatele FNV sau CNV și pentru probleme de cazare contactează SNF.",
    },
  ]);

  return (
    <div className="min-h-screen bg-surface-base" style={{ overflowX: "clip" }}>

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
                  🇳🇱 Olanda · Zero clasamente plătite
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-[10px] font-bold tracking-widest uppercase text-blue-300">
                  🏗 Construit pentru lucrătorii agenților din Olanda
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-black leading-[1.06] tracking-tight mb-4">
                Crezi că câștigi{" "}
                <span className="text-emerald-400">€588/săptămână.</span>
                <br />
                De fapt păstrezi{" "}
                <span className="text-red-400">€345.</span>
              </h1>

              <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6">
                {[
                  { value: `${totalReviews} rapoarte lucrători`, note: "38 verificate · 73 anonime" },
                  { value: "42% acordă 1–2 stele", note: "publicate nefiltrate" },
                  { value: "€63/săpt. taxă reală", note: "sursă: belastingdienst.nl 2026" },
                  { value: `${totalAgencies} agenții în profil`, note: "din registre publice" },
                ].map((s) => (
                  <div key={s.value} className="flex items-baseline gap-1.5">
                    <span className="text-[11px] font-black text-white">{s.value}</span>
                    <span className="text-[10px] text-gray-500">{s.note}</span>
                  </div>
                ))}
              </div>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
                Cazarea, asigurarea, transportul și taxele administrative sunt deduse înainte să atingi banii.
                Vezi <strong className="text-white">salariul net real</strong>, compară agențiile
                și fii potrivit cu oferte verificate —{" "}
                <strong className="text-emerald-400">gratuit, fără obligații</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <a href="#lead-form"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] transition-all px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/50">
                  Găsește potrivire — gratuit →
                </a>
                <a href="#calculator"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.07]/6 hover:bg-white/12 active:scale-[0.98] transition-all px-8 py-4 text-base font-semibold text-gray-200">
                  🧮 Calculează salariul meu
                </a>
              </div>

              <SmartSearch suggestions={searchSuggestions} size="large" placeholder="Caută agenții, orașe sau tipuri de joburi…" />
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
                label: "rapoarte lucrători",
                sub: "38 verificate · 73 raportate · 42% acordă 1–2 stele",
                color: "text-emerald-400",
              },
              {
                value: "15",
                label: "erori fluturași salariu",
                sub: "verificate față de CAO ABU/NBBU și limitele SNF",
                color: "text-red-400",
              },
              {
                value: `${totalAgencies}`,
                label: "agenții în baza de date",
                sub: "fiecare verificată în registrele KvK · ABU · SNA",
                color: "text-amber-400",
              },
              {
                value: "€0",
                label: "plătit pentru poziție mai bună",
                sub: "nicio agenție nu a plătit pentru a apărea · zero clasamente plătite",
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
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 shrink-0">Surse date:</span>
              {[
                { label: "Legislație fiscală NL",   cite: "belastingdienst.nl 2026",      href: "https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/", color: "text-blue-400" },
                { label: "Limite cazare",           cite: "SNF Normering Flexwonen 2024", href: "https://www.snf.nl/normering/",                                         color: "text-emerald-400" },
                { label: "Standarde CAO",           cite: "ABU/NBBU CAO 2023–2025",       href: "https://www.abu.nl/abu-cao/",                                          color: "text-amber-400" },
                { label: "Registru agenții",        cite: "registru public SNA",          href: "https://www.normeringarbeid.nl/register/",                             color: "text-purple-400" },
                { label: "Inspecția muncii",        cite: "Inspectie SZW",                href: "https://www.inspectieszw.nl/",                                         color: "text-gray-400" },
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
          §3  AGENCYCHECK BENEFITS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0a111e] border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">

          <div className="text-center mb-10">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
              De ce să începi prin AgencyCheck
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">
              Începe lucrul în Olanda{" "}
              <span className="text-emerald-500">sigur și informat</span>
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              AgencyCheck conectează lucrătorii cu agenții verificate care oferă condiții transparente și pachete corecte.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {AGENCYCHECK_BENEFITS.map((item) => (
              <div key={item.label}
                className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5 hover:border-emerald-200 hover:bg-emerald-50/60 transition-colors">
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <h3 className="text-sm font-black text-white mb-1">{item.label}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>

          {/* Comparison bar */}
          <div className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-white/[0.06] overflow-hidden">
            <div className="bg-gray-900 px-6 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Lucrător WML · €14,71/h · 40h/săptămână · Cazare + transport agenție
              </p>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-gray-300">Ce promovează agenția (brut)</span>
                  <span className="text-sm font-black text-white">€588/săptămână</span>
                </div>
                <div className="h-3 rounded-full bg-white/15 w-full" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-gray-300">După taxa olandeză (cu credite heffingskorting)</span>
                  <span className="text-sm font-black text-gray-200">€525/săptămână</span>
                </div>
                <div className="h-3 rounded-full bg-amber-300" style={{ width: "89%" }} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-red-700">Ce primești efectiv în mână</span>
                  <span className="text-sm font-black text-red-600">€345/săptămână</span>
                </div>
                <div className="h-3 rounded-full bg-red-400" style={{ width: "59%" }} />
              </div>
            </div>
            <div className="px-6 pb-4 flex items-center justify-between">
              <p className="text-[11px] text-gray-400">
                Deduceri: €63 taxe + €95 cazare + €35 asigurare + €25 transport + €25 taxe adm.{" "}
                <Link href="/methodology" className="text-blue-600 underline">Vezi metodologia completă →</Link>
              </p>
              <a href="#lead-form"
                className="shrink-0 ml-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors px-5 py-2.5 text-xs font-black text-white active:scale-[0.98]">
                Găsește oferte mai bune
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §4  WORKER TESTIMONIALS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0d1728] border-b border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">

          <div className="text-center mb-10">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
              Lucrători reali. Cuvinte reale.
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
              Ce ne-au spus cu adevărat lucrătorii
            </h2>
            <p className="text-xs text-gray-400 font-semibold">
              Nu materiale de marketing · Nu PR agenție · Trimiteri reale de la lucrători reali
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
                <blockquote className="text-sm text-gray-100 leading-relaxed font-medium italic flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                  <span className="text-2xl">{t.flag}</span>
                  <div>
                    <p className="text-xs font-black text-white">{t.name}</p>
                    <p className="text-[11px] text-gray-500">{t.job}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link href="/reviews"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.07]/10 hover:bg-white/5 transition-colors px-7 py-3.5 text-sm font-bold text-gray-200 shadow-none">
              📋 Citește toate cele {totalReviews} recenzii
            </Link>
            <Link href="/submit-review"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
              ✍️ Împărtășește experiența ta →
            </Link>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §5  LEAD FORM
          ════════════════════════════════════════════════════════════ */}
      <section id="lead-form" className="bg-[#0a111e] border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1.5">
                Serviciu de potrivire gratuit — fără taxe, fără obligații
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Găsește o agenție verificată care arată deducerile reale
              </h2>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-xl">
                <span className="font-semibold text-gray-200">Deduceri transparente</span> ·{" "}
                <span className="font-semibold text-gray-200">Cazare verificată</span> ·{" "}
                <span className="font-semibold text-gray-200">Recenzii reale de lucrători</span>{" "}
                — Te potrivim doar cu agenții care trec verificările noastre.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              {["Zero clasamente plătite", "Conform GDPR", "Potrivire gratuită"].map((b) => (
                <span key={b} className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
                  <span className="text-emerald-500">✓</span> {b}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-7 shadow-none">
            <HomepageLeadForm />
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §6  SALARY CALCULATOR
          ════════════════════════════════════════════════════════════ */}
      <section id="calculator" className="bg-[#0d1728] border-b border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">

          <div className="text-center mb-9">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
              Calculator salariu instant — cotele de impozit olandeze 2026
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-3">
              Cât vei păstra de fapt?
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Ajustează pentru oferta ta specifică. Taxe olandeze reale cu toate creditele heffingskorting.
              Fiecare deducere calculată în timp real.
            </p>
          </div>

          <HomepageCalculator />

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §7  METHODOLOGY TRUST BLOCK
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0a111e] border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

          <div className="text-center mb-8">
            <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">Metodologia de calcul</p>
            <h2 className="text-xl sm:text-2xl font-black text-white">Cum calculăm salariul tău real</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-7">
            {[
              {
                icon: "📊",
                title: "Impozit pe venit olandez 2026",
                items: [
                  "Tranșe loonheffing (2 niveluri)",
                  "Algemene heffingskorting — până la €3.362/an credit",
                  "Arbeidskorting — până la €5.000/an credit",
                  "Rata efectivă = impozit ÷ brut (după toate creditele)",
                ],
              },
              {
                icon: "🏠",
                title: "Logica deducerilor pentru cazare",
                items: [
                  "Cazare agenție: €80–€120/săpt. (standard SNF)",
                  "Cazare proprie: €500–€900/lună (medie regională)",
                  "Limita legală SNF: ~€113,50/săpt. pentru camere partajate",
                  "Sursă: SNF Normering Flexwonen 2024",
                ],
              },
              {
                icon: "🚌",
                title: "Transport și asigurare",
                items: [
                  "Autobuz agenție: medie €25/săpt. (raportat de lucrători)",
                  "Zorgverzekering: €152–€180/lună (piața 2026)",
                  "Eigen risico propriu distribuit: €33/lună medie",
                  "Taxe admin: €0–€20/săpt. (raportat de agenții)",
                ],
              },
            ].map((block) => (
              <div key={block.title} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                <div className="text-2xl mb-3">{block.icon}</div>
                <h3 className="text-sm font-black text-white mb-3">{block.title}</h3>
                <ul className="space-y-1.5">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-300 leading-snug">
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
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">Ipoteze cheie</p>
              <ul className="space-y-2 text-xs text-gray-200">
                {[
                  "Angajare principală în Olanda (fără aplicarea convențiilor de dublă impunere)",
                  "48 săptămâni de lucru/an (4 săptămâni de concediu incluse)",
                  "8% vakantiegeld (indemnizație de concediu) adăugat la brut conform BW Art. 7:634",
                  "Lucrător singur — fără alocație pentru partener sau deduceri pentru îngrijirea copilului",
                  "Asigurare de sănătate standard (fără asistență socială / toeslagen)",
                  "WML 2026: €14,71/oră · Actualizat: ianuarie 2026",
                ].map((a) => (
                  <li key={a} className="flex items-start gap-2">
                    <span className="text-blue-500 font-black shrink-0 mt-0.5">✓</span>{a}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[10px] text-gray-400 leading-relaxed border-t border-blue-100 pt-3">
                <strong className="text-gray-500">Disclaimer legal:</strong> Aceste calcule sunt doar în scopuri informative și nu constituie consultanță fiscală, juridică sau financiară. Circumstanțele individuale pot varia. Consultați un belastingadviseur pentru situația dvs. specifică.{" "}
                <Link href="/methodology" className="text-blue-600 underline hover:text-blue-800">Metodologie completă →</Link>
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 overflow-hidden shadow-none">
              <div className="bg-gray-900 px-5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Exemplu: Lucrător WML · €14,71/h · 40h/săpt. · Taxă reală 2026
                </p>
              </div>
              <div className="divide-y divide-white/10">
                {SALARY_ROWS.map((row) => (
                  <div key={row.label}
                    className={`flex items-center justify-between px-5 py-3 ${row.bold ? "bg-gray-900" : "bg-white/10"}`}>
                    <span className={`text-sm ${row.bold ? "font-black text-white" : "text-gray-300"}`}>{row.label}</span>
                    <span className={`text-sm font-bold ${row.bold ? `text-lg font-black ${row.green ? "text-emerald-400" : "text-red-400"}` : row.green ? "text-emerald-600" : "text-red-500"}`}>
                      {row.amount}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-white/[0.06] px-5 py-3 border-t border-white/10">
                <p className="text-[10px] text-gray-400">
                  Taxă −€63 (loonheffing real 2026 după creditele AHK+AK) + €95 cazare + €25 transport + €35 asigurare + €25 adm.{" "}
                  <Link href="/methodology" className="text-blue-600 underline">Metodologie completă</Link>
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
            Acum cunoști cifrele reale
          </p>
          <h2 className="text-2xl sm:text-4xl font-black leading-tight mb-4">
            Vrei <span className="text-emerald-400">condiții mai bune</span> și
            mai mulți bani în fiecare săptămână?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Nu toate agențiile sunt egale. Unele au taxe de cazare mai mici, fluturași de salariu mai rapizi și contracte transparente. Verificăm care — și te potrivim gratuit.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#lead-form"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/40 active:scale-[0.98]">
              Vezi oferte verificate →
            </a>
            <Link href="/best-agencies-with-housing-netherlands"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.07]/8 hover:bg-white/15 transition-colors px-8 py-4 text-base font-bold text-gray-300 active:scale-[0.98]">
              Toate {housingCount} agenții cu cazare
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
            {["Zero clasamente plătite", "Agențiile nu pot cumpăra note mai bune", "Notele sunt complet date de lucrători", "Statutul de partener nu afectează niciodată scorurile"].map((t) => (
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
      <section className="bg-[#0d1728] border-b border-white/[0.07]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">

          <div className="text-center mb-7">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
              Cum funcționează AgencyCheck — și cum câștigăm bani
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Sinceri despre cum funcționează
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                icon: "📋",
                title: "Ce face AgencyCheck",
                body: "Colectăm recenzii de la lucrători, analizăm fluturașii de salariu și publicăm clasamente independente ale agențiilor de muncă olandeze. Nu recrutăm lucrători — te ajutăm să faci o alegere informată.",
              },
              {
                icon: "💰",
                title: "Cum câștigăm bani",
                body: "Dacă folosești serviciul nostru de potrivire și ești plasat cu succes, agenția ne plătește un onorariu de finder's fee. Această taxă vine de la agenție — niciodată de la tine. Lucrătorii nu plătesc nimic, niciodată.",
              },
              {
                icon: "⚖️",
                title: "De ce clasamentele rămân corecte",
                body: "Agențiile nu pot plăti pentru un loc mai bun în clasament, pentru a elimina recenzii sau pentru a-și influența scorurile. Agențiile plătitoare nu obțin niciun avantaj de plasare. Doar notele lucrătorilor le determină poziția.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-white/[0.06]/[0.06] border border-white/10 p-5">
                <div className="text-2xl mb-3">{item.icon}</div>
                <p className="text-sm font-black text-white mb-2">{item.title}</p>
                <p className="text-xs text-gray-300 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50/40 px-5 py-4">
            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>Divulgarea conflictului de interese:</strong> Agențiile partenere pentru potrivire nu primesc note mai mari sau plasament preferențial în căutare.
              Clasamentele noastre sunt calculate pur din trimiteri verificate ale lucrătorilor. Poți{" "}
              <Link href="/methodology" className="underline hover:text-amber-700">citi metodologia noastră completă</Link>{" "}
              și{" "}
              <Link href="/reviews" className="underline hover:text-amber-700">naviga prin toate recenziile nefiltrate</Link>{" "}
              — inclusiv cele negative — în orice moment.
            </p>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §9  AGENCY OFFERS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0a111e] border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">

          <div className="text-center mb-10">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">Ce oferă cele mai bune agenții</p>
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">Ce includ ofertele celor mai bune agenții</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
              Bazat pe {totalReviews}+ rapoarte verificate de lucrători. Știi ce să cauți când alegi o agenție.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {AGENCY_OFFERS.map((p, i) => (
              <div key={p.title}
                className={`rounded-2xl border p-6 ${i === 0 ? "lg:col-span-1 border-emerald-100 bg-emerald-50/40" : "border-white/10 bg-white/[0.06] hover:border-emerald-100 hover:bg-emerald-50/20 transition-colors"}`}>
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="text-base font-black text-white mb-2">{p.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/reviews"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.07]/10 hover:bg-white/5 transition-colors px-7 py-3.5 text-sm font-bold text-gray-200 shadow-none">
              📋 Citește experiențele reale ale lucrătorilor →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §10  HOUSING PROOF
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0d1728] border-b border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">
          <div className="text-center mb-9">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">Cazare reală — nu broșuri</p>
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-3">Vezi unde vei locui de fapt</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Poze și descrieri trimise de lucrători. Nicio imagine de stoc. Niciun PR de agenție.
            </p>
          </div>
          <div className="rounded-2xl bg-white/[0.06]/[0.06] border border-white/10 shadow-none p-6 sm:p-8">
            <WorkerHousingStrip />
          </div>
          <div className="mt-6 text-center">
            <Link href="/best-agencies-with-housing-netherlands"
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100 transition-colors">
              Navighează toate {housingCount} agenții cu cazare →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §11  VERIFIED AGENCY CARDS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0a111e] border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">

          <div className="text-center mb-9">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
              Agenții verificate prin cercetare
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-3">
              Oferte transparente — venitul net real afișat
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed mb-4">
              Fiecare card arată venitul net săptămânal estimat după taxa olandeză și deduceri.
              Fără cifre brute umflate.
            </p>
            <div className="inline-flex flex-wrap items-center justify-center gap-3 text-[10px] font-semibold border border-white/10 bg-white/[0.06] rounded-xl px-4 py-2.5">
              <span className="text-gray-400 font-black uppercase tracking-wider">Ce înseamnă insignele:</span>
              <span className="inline-flex items-center gap-1 text-gray-500 bg-white/[0.06] border border-white/15 rounded-full px-2.5 py-1">
                <span className="text-gray-400">👤</span> Raportat de lucrător — recenzii doar de la lucrători
              </span>
              <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1">
                <span className="text-blue-400">🔍</span> Verificat prin cercetare — confirmat KvK + revizuire echipă
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
                <span className="text-emerald-500">✓</span> Înregistrat SNA — certificat de Stichting Normering Arbeid
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mb-10">
            {housingAgencies.slice(0, 3).map((agency) => {
              const meta = VERIFIED_JOB_META[agency.slug];
              return (
                <div key={agency.slug}
                  className="rounded-2xl bg-white/[0.06]/[0.06] border border-white/10 shadow-none hover:bg-white/[0.10] hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col group">

                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-5 py-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                          {meta?.sector ?? "Servicii de muncă"}
                        </span>
                        <h3 className="text-base font-black text-white leading-tight truncate">
                          {meta?.jobTitle ?? "Depozit / Producție"}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">📍 {agency.city}</p>
                      </div>
                      <span className="shrink-0 text-[9px] font-black uppercase tracking-wider text-blue-300 bg-blue-400/15 border border-blue-400/20 rounded-full px-2 py-1 whitespace-nowrap">
                        🔍 Verificat cercetare
                      </span>
                    </div>
                    <Link href={`/agencies/${agency.slug}`}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors group-hover:underline">
                      {agency.name} →
                    </Link>
                  </div>

                  <div className="px-5 py-4 flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-white/[0.06]/[0.06] border border-white/10 px-3 py-2.5 text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Tarif orar</p>
                        <p className="text-lg font-black text-white">
                          €{(meta?.hourlyRate ?? 14.71).toFixed(2)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2.5 text-center">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Est. net/săpt.</p>
                        <p className="text-lg font-black text-emerald-700">
                          €{meta?.estNetWeekly ?? 316}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs text-gray-500">
                      <div className="flex items-center justify-between">
                        <span>🏠 Cost cazare</span>
                        <span className="font-bold text-gray-200">€{meta?.housingCost ?? 95}/săpt.</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>⭐ Nota lucrătorilor</span>
                        <StarRating value={agency.avgSalaryRating ?? 3.5} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>⚡ Timp răspuns</span>
                        <span className="font-bold text-gray-200">{meta?.responseTime ?? "< 24 ore"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-4 border-t border-white/10 bg-white/5">
                    <ApplyBar
                      context={{
                        sourcePage:           "/ro",
                        sourceType:           "agency_page",
                        sourceLabel:          `RO Homepage agency card — ${agency.slug}`,
                        defaultAccommodation: true,
                      }}
                      ctaText="Solicită Contact"
                      buttonOnly
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mb-7">
            {housingAgencies.map((agency) => (
              <AgencyCard key={agency.slug} agency={agency} jobCount={getJobCountForAgency(agency.slug)} locale="ro" />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link href="/best-agencies-with-housing-netherlands"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors px-8 py-4 text-sm font-black text-white shadow-none">
              🏢 Toate {housingCount} agenții cu cazare
            </Link>
            <Link href="/agencies" className="text-sm text-gray-500 hover:text-white font-medium transition-colors">
              Toate {totalAgencies} agențiile →
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
                  ⚡ Instrument gratuit
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-4">
                  Te-a plătit mai puțin agenția?
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  Încarcă fluturașul tău de salariu olandez (<em>loonstrook</em>) și verificăm fiecare linie
                  față de tabelele fiscale oficiale 2026 și standardele CAO ABU/NBBU.
                </p>
                <p className="text-gray-400 text-xs leading-relaxed mb-6">
                  Verificăm: tranșe corecte de impozit · credite heffingskorting aplicate ·
                  limite deducere cazare SNF · prime ore suplimentare · calcul vakantiegeld.
                </p>
                <Link href="/tools/payslip-checker"
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 transition-colors px-7 py-3.5 text-sm font-black text-white shadow-none shadow-amber-900/40 active:scale-[0.98]">
                  📄 Încarcă Fluturașul — Verifică Acum
                </Link>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Ce verificăm</p>
                <ul className="space-y-2.5">
                  {[
                    { ok: true,  label: "Tranșe corecte loonheffing aplicate" },
                    { ok: true,  label: "Credit heffingskorting calculat" },
                    { ok: true,  label: "Deducere cazare ≤ maxim legal SNF" },
                    { ok: true,  label: "Prime ore suplimentare (100%, 125%, 150%)" },
                    { ok: true,  label: "Vakantiegeld ≥ 8% din salariul brut" },
                    { ok: false, label: "Deduceri false sau taxe inexplicabile" },
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
      <section className="bg-[#0a111e] border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">

            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">Ghid pentru lucrători</p>
              <h2 className="text-xl sm:text-2xl font-black text-white mb-5 leading-tight">
                Tot ce trebuie să știi înainte de a lucra în Olanda
              </h2>
              <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
                <p>
                  Salariul minim olandez (<em>Wettelijk Minimumloon</em>) este{" "}
                  <strong className="text-white">€14,71/oră în 2026</strong> pentru lucrătorii
                  de 21+. La 40 de ore pe săptămână aceasta dă un brut de exact €588/săptămână
                  (€14,71 × 40 ore). Dar după impozitul pe venit olandez, cazarea agenției, asigurarea
                  de sănătate și transport, majoritatea lucrătorilor păstrează între{" "}
                  <strong className="text-white">€300–€370</strong> —
                  aproximativ 50–63% din brut, în funcție de agenție.
                </p>
                <p>
                  Protecțiile legale cheie de știut: <strong className="text-white">ABU / NBBU CAO</strong>{" "}
                  reglementează scalele salariale, primele de ore suplimentare și concediul plătit.
                  <strong className="text-white"> SNF</strong> (Stichting Normering Flexwonen) stabilește deducerile
                  maxime legale pentru cazare. <strong className="text-white">Inspectie SZW</strong> aplică toată legea muncii.
                  AgencyCheck verifică agențiile față de toate trei.
                </p>
                <p>
                  {" "}
                  <Link href="/tools/real-income-calculator" className="text-blue-600 underline hover:text-blue-800">Calculatorul nostru de salariu</Link>{" "}
                  folosește tabelele fiscale oficiale 2026 și include atât creditul <em>algemene heffingskorting</em>, cât și{" "}
                  <em>arbeidskorting</em> — credite care pot economisi lucrătorilor cu salariu mic
                  €600–€700 pe lună în taxe pe care multe agenții nu le menționează.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Acces rapid</p>
              {[
                { icon: "💶", href: "/tools/real-income-calculator",        title: "Calculator salariu complet",         desc: "Salariu net cu toate creditele fiscale 2026 incluse" },
                { icon: "📄", href: "/tools/payslip-checker",               title: "Instrument verificare fluturiș",      desc: "Încarcă loonstrook-ul și verifică erorile" },
                { icon: "🏢", href: "/agencies",                            title: "Toate agențiile din Olanda",          desc: `${totalAgencies} agenții clasate după notele lucrătorilor` },
                { icon: "🏠", href: "/best-agencies-with-housing-netherlands",               title: "Joburi cu cazare",                    desc: `${housingCount} agenții verificate cu cazare inclusă` },
                { icon: "⭐", href: "/reviews",                             title: "Recenzii lucrători",                  desc: `${totalReviews}+ recenzii anonime reale` },
                { icon: "📋", href: "/work-in-netherlands-for-foreigners",  title: "Drepturi și ghid legal",              desc: "ABU CAO, WML, SNF — explicate simplu" },
              ].map((item) => (
                <Link key={item.href} href={item.href}
                  className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.06] hover:bg-blue-50 hover:border-blue-100 transition-colors p-4 group">
                  <span className="text-xl mt-0.5">{item.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{item.title}</p>
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
          <div className="pt-8 border-t border-white/10">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Navighează joburi după oraș</p>
            <div className="flex flex-wrap gap-2">
              {TOP_CITIES.slice(0, 18).map((c) => (
                <Link key={c.slug} href={`/jobs-in-${c.slug}`}
                  className="inline-flex items-center text-xs font-medium bg-white/[0.07]/[0.06] border border-white/15 text-gray-200 rounded-full px-3 py-1.5 hover:border-blue-300 hover:text-blue-700 transition-colors">
                  💼 {c.name}
                </Link>
              ))}
              <Link href="/jobs-in-netherlands"
                className="inline-flex items-center text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700 rounded-full px-3 py-1.5 hover:bg-blue-100 transition-colors">
                🇳🇱 Toate orașele →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#0d1728] border-b border-white/[0.05]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center mb-10">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">FAQ</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Întrebările pe care lucrătorii le pun de fapt</h2>
          </div>
          <HomepageFAQ />
          <div className="mt-8 text-center">
            <Link href="/work-in-netherlands-for-foreigners"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
              📖 Ghid complet: Lucrul în Olanda →
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
              Cunoaște adevărul<br />înainte să semnezi.
            </h2>
            <p className="text-blue-200 text-base sm:text-lg leading-relaxed mb-4 max-w-lg mx-auto">
              {totalAgencies} agenții. {totalReviews}+ recenzii de lucrători. Defalcări salariu real.
              Zero clasamente plătite. Construit pentru lucrători — nu recrutori.
            </p>
            <p className="text-xs text-blue-400 mb-9">
              ✓ Zero clasamente plătite &nbsp;·&nbsp; ✓ Agențiile nu pot cumpăra note mai bune &nbsp;·&nbsp;
              ✓ Notele sunt complet date de lucrători &nbsp;·&nbsp; ✓ Statutul de partener nu afectează niciodată scorurile
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <a href="#lead-form"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/40 active:scale-[0.98]">
                Găsește potrivire — gratuit →
              </a>
              <a href="#calculator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.07]/8 hover:bg-white/15 transition-colors px-8 py-4 text-base font-bold text-gray-200 active:scale-[0.98]">
                🧮 Calculează salariul meu
              </a>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-blue-400">
              <Link href="/agencies"                     className="hover:text-white transition-colors">Toate agențiile</Link>
              <span className="text-blue-800">·</span>
              <Link href="/reviews"                      className="hover:text-white transition-colors">Recenzii lucrători</Link>
              <span className="text-blue-800">·</span>
              <Link href="/best-agencies-with-housing-netherlands"        className="hover:text-white transition-colors">Joburi cu cazare</Link>
              <span className="text-blue-800">·</span>
              <Link href="/tools/real-income-calculator" className="hover:text-white transition-colors">Calculator salariu</Link>
              <span className="text-blue-800">·</span>
              <Link href="/methodology"                  className="hover:text-white transition-colors">Metodologie</Link>
              <span className="text-blue-800">·</span>
              <Link href="/privacy"                      className="hover:text-white transition-colors">Confidențialitate</Link>
              <span className="text-blue-800">·</span>
              <Link href="/terms"                        className="hover:text-white transition-colors">Termeni</Link>
            </nav>
          </div>
        </div>
      </section>

      {/* Sticky bar */}
      <HomepageStickyBar />

    </div>
  );
}
