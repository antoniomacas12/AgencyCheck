import type { Metadata } from "next";
import Link from "next/link";
import { AGENCIES_WITH_HOUSING } from "@/lib/agencyData";
import AgencyCard from "@/components/AgencyCard";
import { getJobCountForAgency } from "@/lib/jobData";

export const metadata: Metadata = {
  title: "Cum să citești un fluturaș de salariu olandez (Loonstrook) — Explicat 2026",
  description:
    "Fiecare linie din loonstrook-ul olandez explicată în română: brutoloon, loonheffing, heffingskorting, vakantiegeld, ET toeslag și mai mult. Cu exemple la WML (€14,71/oră).",
  alternates: {
    canonical: "https://agencycheck.io/ro/loonstrook-explicat",
    languages: { en: "https://agencycheck.io/how-to-read-dutch-payslip" },
  },
  openGraph: {
    title: "Fluturaș de salariu olandez — fiecare linie explicată 2026",
    description:
      "Confuz cu loonstrook-ul tău? Fiecare linie explicată cu cifre reale — brutoloon, nettoloon, vakantiegeld, ET toeslag, heffingskorting.",
  },
};

export const dynamic = "force-static";

// ─── Câmpurile loonstrook ─────────────────────────────────────────────────────
const LOONSTROOK_FIELDS = [
  {
    term: "Brutoloon",
    english: "Salariu brut",
    example: "+€588,40",
    positive: true,
    explain:
      "Câștigurile tale totale înainte de orice deduceri. La WML (€14,71/oră × 40 ore/săpt.) aceasta este €588,40/săpt. Acesta este numărul pe care agențiile îl promovează — nu ceea ce primești în cont.",
  },
  {
    term: "Vakantiegeld (8%)",
    english: "Indemnizație de concediu",
    example: "+€47,07",
    positive: true,
    explain:
      "8% din salariul brut prevăzut de lege, acumulat săptămânal și plătit o dată pe an (de obicei mai/iunie) sau lunar. Aceștia sunt BANII TĂI — agențiile sunt obligate să îi plătească conform legii olandeze (Burgerlijk Wetboek Art. 7:634).",
  },
  {
    term: "Loonheffing",
    english: "Impozit pe salariu (impozit pe venit + asigurări sociale)",
    example: "−€63,20",
    positive: false,
    explain:
      "Impozitul pe venit olandez combinat și prima de asigurare socială (volksverzekeringen: AOW, Anw, Wlz). Este reținut de angajatorul tău în fiecare perioadă. Pentru majoritatea lucrătorilor străini la WML, rata efectivă după heffingskorting este de aproximativ 10–15%, nu de 37%.",
  },
  {
    term: "Heffingskorting",
    english: "Credit fiscal",
    example: "+€38,50",
    positive: true,
    explain:
      "Un credit fiscal statutar care reduce loonheffing-ul tău. Există două: arbeidskorting (creditul fiscal pentru muncă, până la €5.158/an) și algemene heffingskorting (creditul fiscal general, până la €3.362/an). Dacă angajatorul aplică ambele, păstrezi semnificativ mai mult. Întreabă recrutorul să confirme că ambele sunt aplicate.",
  },
  {
    term: "WW-premie werknemer",
    english: "Prima de asigurare de șomaj (cota angajatului)",
    example: "−€7,06",
    positive: false,
    explain:
      "Contribuția ta de angajat la WW (Werkloosheidswet — asigurarea olandeză de șomaj). Rata pentru lucrătorii temporari prin agenție (uitzendbeding) este mai mare decât pentru lucrătorii permanenți. Este dedusă din brut înainte de calcularea nettoloon-ului.",
  },
  {
    term: "ET vergoeding / ET toeslag",
    english: "Rambursare costuri extrateritoriale",
    example: "+€80,00",
    positive: true,
    explain:
      "Beneficiul ET (Extraterritoriale kosten) este o rambursare scutită de impozit a 'costurilor extrateritoriale' — cheltuieli suplimentare pentru a locui în afara țării de origine. Poate valora €50–€150/săpt. NET și este disponibil doar lucrătorilor care locuiesc la mai mult de 150 km de granița olandeză. Nu toate agențiile îl aplică. Consultați ghidul nostru ET pentru detalii complete.",
  },
  {
    term: "Huisvesting / Woning",
    english: "Deducere cazare",
    example: "−€95,00",
    positive: false,
    explain:
      "Costul săptămânal al cazării furnizate de agenție, dedus direct din brut. Maximul legal SNF (Stichting Normering Flexwonen) pentru cazare certificată comună este €113,50/săpt. (2026). Această sumă trebuie să corespundă exact cu ce este scris în contractul tău — nici un cent mai mult.",
  },
  {
    term: "Zorgverzekering",
    english: "Prima de asigurare medicală",
    example: "−€35,00",
    positive: false,
    explain:
      "Asigurarea medicală olandeză (basisverzekering) este obligatorie pentru toți lucrătorii din Olanda. Multe agenții oferă o asigurare colectivă și deduc prima (de obicei €28–€40/săpt.) direct. Ar trebui să primești confirmarea acoperirii în primele două săptămâni. Păstrează acest document.",
  },
  {
    term: "Transport / Reiskosten",
    english: "Transport la locul de muncă",
    example: "−€25,00",
    positive: false,
    explain:
      "Costul autobuzului agenției sau transportului la șantier, dacă este perceput. Conform regulilor CAO, acesta trebuie să apară ca o linie separată — nu poate fi inclus în cazare. Intervalul tipic: €20–€35/săpt. Dacă contractul tău spune că transportul este inclus, această linie nu ar trebui să apară.",
  },
  {
    term: "Nettoloon",
    english: "Salariu net (suma primită în mână)",
    example: "€363,00",
    positive: true,
    explain:
      "Suma transferată în contul tău bancar. Aceasta este brutoloon minus toate deducerile (impozit, cazare, asigurare, transport) plus credite (heffingskorting, ET toeslag dacă este cazul). La WML fără beneficiul ET, neto tipic este €310–€370/săpt. Cu ET aplicat, poate fi €380–€450/săpt.",
  },
];

// ─── Abrevieri comune ─────────────────────────────────────────────────────────
const ABBREVIATIONS = [
  { abbr: "WML",  full: "Wettelijk Minimumloon",             eng: "Salariul minim legal (€14,71/oră în 2026)" },
  { abbr: "CAO",  full: "Collectieve Arbeidsovereenkomst",    eng: "Contract colectiv de muncă (stabilește drepturile tale)" },
  { abbr: "ABU",  full: "Alg. Bond Uitzendondernemingen",     eng: "Principala asociație din industria muncii temporare" },
  { abbr: "SNF",  full: "St. Normering Flexwonen",           eng: "Organism independent de inspecție a locuințelor" },
  { abbr: "BSN",  full: "Burgerservicenummer",               eng: "Numărul tău olandez de serviciu cetățenesc (cod fiscal)" },
  { abbr: "ET",   full: "Extraterritoriale kosten",          eng: "Costuri extrateritoriale — beneficiu scutit de impozit" },
  { abbr: "VGU",  full: "Vakantiegeld uitbetaling",          eng: "Plata indemnizației de concediu" },
  { abbr: "AOW",  full: "Algemene Ouderdomswet",             eng: "Contribuție la pensia de stat olandeză" },
  { abbr: "WW",   full: "Werkloosheidswet",                  eng: "Prima de asigurare de șomaj" },
  { abbr: "Wlz",  full: "Wet langdurige zorg",              eng: "Asigurare pentru îngrijire pe termen lung" },
  { abbr: "BWA",  full: "Bijzondere beloningen werknemer",   eng: "Beneficii speciale pentru angajați (de ex. bonus de sfârșit de an)" },
];

// ─── Listă de verificare ──────────────────────────────────────────────────────
const CHECKLIST = [
  { check: "Brutoloon corespunde ratei tale orare din contract × orele lucrate în această perioadă" },
  { check: "Vakantiegeld (indemnizație de concediu) de exact 8% este afișat — nu 0% sau lipsă" },
  { check: "Heffingskorting este aplicat — atât arbeidskorting, cât și algemene heffingskorting" },
  { check: "Deducerea pentru huisvesting corespunde exact cu ce spune contractul tău — nici un cent mai mult" },
  { check: "Transportul apare ca propria linie dacă este perceput — nu ascuns în cazare" },
  { check: "ET vergoeding apare dacă locuiești la >150 km de granița olandeză" },
  { check: "Nettoloon corespunde transferului bancar primit" },
  { check: "Ai primit acest fluturaș în termen de 5 zile de la data plății" },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Care este diferența dintre brutoloon și nettoloon?",
    a: "Brutoloon este salariul tău brut — totalul câștigat înainte de orice deduceri. Nettoloon este plata ta efectivă după deducerea impozitului pe venit olandez (loonheffing), primelor de asigurare socială, cazării, transportului și asigurării medicale. La WML (€14,71/oră, 40 ore/săpt.), brutoloon este €588/săpt., iar nettoloon tipic este €310–€370/săpt. fără schema ET.",
  },
  {
    q: "Ce este vakantiegeld și când îl primesc?",
    a: "Vakantiegeld (indemnizație de concediu) este un 8% obligatoriu din salariul brut, cerut de legea olandeză (BW Art. 7:634). Majoritatea agențiilor îl acumulează în fiecare perioadă de plată și îl plătesc o dată pe an, de obicei în mai sau iunie. Unele agenții îl plătesc lunar. În orice caz, cei 8% trebuie să apară pe fiecare fluturaș. Dacă lipsesc, solicită o explicație în scris.",
  },
  {
    q: "De ce loonheffing-ul meu este mult mai mic decât rata de impozit pe venit de 37%?",
    a: "Rata olandeză de impozit pe venit de 37% se aplică venitului anual peste un prag. La WML pentru o săptămână de 40 ore (aproximativ €30.600/an brut), ești în tranșa inferioară. Pe lângă aceasta, heffingskorting (credite fiscale — arbeidskorting plus algemene heffingskorting) poate reduce rata efectivă la 10–15%. Dacă te califici și pentru beneficiul ET, impozitul efectiv poate scădea sub 5% pentru porțiunea rambursată.",
  },
  {
    q: "Poate agenția mea să deducă mai mult decât este în contractul meu?",
    a: "Nu. Conform legii olandeze și CAO ABU/NBBU, deducerile pot fi făcute doar pentru servicii explicit enumerate și evaluate în contractul semnat. Deducerile suplimentare pentru lenjerie, curățenie sau administrare care nu au fost specificate înainte de semnare nu sunt permise. Dacă vezi deduceri neașteptate, solicită o explicație scrisă și, dacă este necesar, contactează Inspectie SZW (inspectieszw.nl) sau FNV.",
  },
  {
    q: "Fluturașul meu arată zero ET vergoeding — pierd bani?",
    a: "Posibil. Beneficiul ET (Extraterritoriale kosten) se aplică lucrătorilor care locuiesc la mai mult de 150 km de granița olandeză și care au stat în Olanda mai puțin de 5 ani. Dacă îndeplinești aceste criterii și fluturașul tău nu arată ET vergoeding, întreabă direct recrutorul agenției. Nu toate agențiile îl aplică, chiar și când lucrătorii se califică. Trecerea la o agenție care îl aplică poate crește venitul tău net cu €50–€150/săpt.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Cum să citești un fluturaș de salariu olandez (Loonstrook) — Explicat 2026",
  description: "Explicație completă a fiecărui câmp de pe fluturașul de salariu al unui lucrător de agenție olandez, cu exemple la WML (€14,71/oră).",
  author: { "@type": "Organization", name: "AgencyCheck" },
  publisher: { "@type": "Organization", name: "AgencyCheck", url: "https://agencycheck.io" },
  datePublished: "2026-01-01",
  dateModified: "2026-05-01",
  inLanguage: "ro",
  url: "https://agencycheck.io/ro/loonstrook-explicat",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Acasă", item: "https://agencycheck.io/ro" },
    { "@type": "ListItem", position: 2, name: "Ghiduri", item: "https://agencycheck.io/guides" },
    { "@type": "ListItem", position: 3, name: "Loonstrook explicat", item: "https://agencycheck.io/ro/loonstrook-explicat" },
  ],
};

export default async function LoonstrookExplicat() {
  const featuredAgencies = AGENCIES_WITH_HOUSING.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-gray-950 text-white border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-14 pb-12">
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <Link href="/ro" className="hover:text-gray-300 transition-colors">Acasă</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-gray-300 transition-colors">Ghiduri</Link>
            <span>/</span>
            <span className="text-gray-400">Loonstrook explicat</span>
          </nav>
          <p className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-3">Ghid salarial 2026</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-5">
            Cum să citești un fluturaș de salariu olandez<br className="hidden sm:block" />
            <span className="text-emerald-400"> (Loonstrook)</span> — fiecare linie explicată
          </h1>
          <p className="text-base text-gray-300 leading-relaxed mb-6">
            Fiecare lucrător de agenție din Olanda primește un <strong className="text-white">loonstrook</strong> (fluturaș de salariu) săptămânal sau lunar.
            Majoritatea lucrătorilor înțeleg doar prima și ultima linie — brut și net. Cele 8–12 linii dintre ele
            determină dacă ești plătit corect. Acest ghid explică fiecare linie.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            {[
              "WML 2026: €14,71/oră",
              "Vakantiegeld: 8% obligatoriu",
              "SNF max cazare: €113,50/săpt.",
              "Beneficiu ET: până la €150/săpt.",
            ].map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 font-semibold text-gray-300">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Exemplu loonstrook ───────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
            Exemplu: lucrător WML, 40 ore/săptămână
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Bazat pe salariul minim legal olandez (WML) de €14,71/oră în 2026. Numerele variază ușor în funcție de agenție și de durata perioadei.
          </p>

          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-900 px-5 py-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Loonstrook — Exemplu săptămânal · WML €14,71/oră · 40 ore · Cazare și transport agenție incluse
              </p>
            </div>
            <div className="divide-y divide-gray-100">
              {LOONSTROOK_FIELDS.map((f) => (
                <div key={f.term} className={`px-5 py-4 ${f.term === "Nettoloon" ? "bg-emerald-50" : ""}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-gray-900">{f.term}</span>
                        <span className="text-[10px] font-semibold text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">{f.english}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{f.explain}</p>
                    </div>
                    <span className={`shrink-0 text-sm font-black tabular-nums ${f.positive ? "text-emerald-600" : "text-red-500"} ${f.term === "Nettoloon" ? "text-emerald-700 text-base" : ""}`}>
                      {f.example}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
              <p className="text-[11px] text-gray-400">
                * ET vergoeding afișat se aplică dacă locuiești la mai mult de 150 km de granița olandeză și ești în Olanda de mai puțin de 5 ani.{" "}
                <Link href="/ro/schema-et-olanda" className="text-blue-600 underline">Vezi ghidul complet ET →</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tabel abrevieri ──────────────────────────────────────────── */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Abrevieri comune pe fluturașele olandeze</h2>
          <p className="text-sm text-gray-500 mb-6">
            Fluturașele olandeze folosesc multe abrevieri. Acestea sunt cele pe care le vei vedea cel mai des.
          </p>
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {ABBREVIATIONS.map((a) => (
                <div key={a.abbr} className="grid grid-cols-[60px_1fr_1fr] gap-3 px-5 py-3 items-start">
                  <span className="text-sm font-black text-gray-900 font-mono">{a.abbr}</span>
                  <span className="text-xs text-gray-700">{a.full}</span>
                  <span className="text-xs text-gray-500">{a.eng}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Listă de verificare ───────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Verificare în 8 puncte — fă asta în fiecare perioadă de plată</h2>
          <p className="text-sm text-gray-500 mb-6">
            Durează 5 minute. Detectează erorile înainte să se acumuleze. Angajatorul tău este obligat legal să îți dea un fluturaș — dacă nu primești, solicită în scris.
          </p>
          <ul className="space-y-3">
            {CHECKLIST.map((item, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3.5">
                <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black flex items-center justify-center mt-0.5">{i + 1}</span>
                <span className="text-sm text-gray-700 leading-snug">{item.check}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
            <p className="text-sm text-blue-800 leading-relaxed">
              <strong>Ai găsit o neconcordanță?</strong> Mai întâi, solicită recrutorului agenției o explicație scrisă.
              Dacă nu se rezolvă, contactează <strong>Inspectie SZW</strong> la{" "}
              <a href="https://www.inspectieszw.nl" target="_blank" rel="noopener noreferrer" className="underline">inspectieszw.nl</a>{" "}
              sau <strong>FNV</strong> (principalul sindicat olandez, gratuit pentru lucrători) la{" "}
              <a href="https://www.fnv.nl" target="_blank" rel="noopener noreferrer" className="underline">fnv.nl</a>.
            </p>
          </div>
        </div>
      </section>

      {/* ── ET callout ───────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-6">
            <div className="inline-flex items-center gap-1.5 bg-amber-100 border border-amber-200 rounded-full px-3 py-1 text-[11px] font-black text-amber-800 uppercase tracking-wide mb-4">
              Majoritatea lucrătorilor ratează asta
            </div>
            <h2 className="text-lg font-black text-gray-900 mb-2">
              Este &ldquo;ET vergoeding&rdquo; pe fluturașul tău? Dacă nu, poți pierde €50–€150/săpt.
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Schema ET (Extraterritoriale kosten) este o rambursare legală scutită de impozit disponibilă lucrătorilor
              care locuiesc la mai mult de 150 km de granița olandeză. Poate adăuga €50–€150/săpt. la venitul tău net
              acoperind o parte din costurile suplimentare ale muncii în străinătate. Nu este automată — agenția
              trebuie să o aplice. Multe nu o fac.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/ro/schema-et-olanda"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 transition-colors px-5 py-2.5 text-sm font-black text-white active:scale-[0.98]">
                Citește ghidul complet ET →
              </Link>
              <Link href="/tools/real-salary-calculator"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 transition-colors px-5 py-2.5 text-sm font-bold text-amber-800">
                Calculează venitul tău net real →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-8">Întrebări frecvente</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white px-5 py-5">
                <h3 className="text-sm font-black text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Agency CTA ───────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="text-center mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Aplică prin AgencyCheck</p>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Găsește o agenție cu contracte transparente</h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              Fiecare agenție de pe AgencyCheck afișează estimările săptămânale nete, costurile de cazare și termenii contractuali din start.
              Aplicare gratuită prin WhatsApp — răspuns în aceeași zi.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {featuredAgencies.map((agency) => (
              <AgencyCard
                key={agency.slug}
                agency={agency}
                jobCount={getJobCountForAgency(agency.slug)}
              />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/vacancies"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors px-6 py-3 text-sm font-bold text-gray-700">
              Răsfoiește toate locurile de muncă →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Ghiduri conexe ───────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <h2 className="text-base font-black text-gray-900 mb-4">Ghiduri conexe</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: "/ro/schema-et-olanda",       label: "Schema ET Olanda — ghid complet" },
              { href: "/ro/numarul-bsn-olanda",      label: "Cum să obții numărul tău BSN" },
              { href: "/after-you-apply",             label: "Ce se întâmplă după ce aplici" },
              { href: "/what-is-order-picking",       label: "Order picking — salariu și condiții" },
              { href: "/tools/real-salary-calculator", label: "Calculator salariu net (venit real)" },
              { href: "/methodology",                 label: "Cum verifică AgencyCheck agențiile" },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors px-4 py-3 text-sm font-semibold text-gray-700">
                <span className="text-gray-400">→</span> {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
