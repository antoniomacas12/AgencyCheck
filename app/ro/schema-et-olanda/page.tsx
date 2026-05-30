import type { Metadata } from "next";
import Link from "next/link";
import { AGENCIES_WITH_HOUSING } from "@/lib/agencyData";
import AgencyCard from "@/components/AgencyCard";
import { getJobCountForAgency } from "@/lib/jobData";

export const metadata: Metadata = {
  title: "Schema ET Olanda 2026 — Explicată pentru Lucrătorii de Agenție (Până la €150/săpt. Extra)",
  description:
    "Schema ET (costuri extrateritoriale) poate adăuga €50–€150/săpt. la venitul tău net în Olanda — scutit de impozit. Cine se califică, cât valorează și cum verifici dacă agenția ta o aplică.",
  alternates: {
    canonical: "https://agencycheck.io/ro/schema-et-olanda",
    languages: { en: "https://agencycheck.io/et-scheme-netherlands-explained" },
  },
  openGraph: {
    title: "Schema ET Olanda 2026 — Până la €150/săpt. extra net",
    description:
      "Majoritatea lucrătorilor de agenție din UE se califică pentru beneficiul ET dar nu știu asta. Explicăm cine se califică, cât plătește și cum îți verifici fluturașul.",
  },
};

export const dynamic = "force-static";

// ─── Tabel comparativ: cu vs fără ET ─────────────────────────────────────────
const COMPARISON = [
  { label: "Salariu brut săptămânal (WML 40h)",          without: "€588",  with_et: "€588",  note: null },
  { label: "Loonheffing (impozit pe venit după credite)", without: "−€63", with_et: "−€20",  note: "ET reduce baza impozabilă" },
  { label: "Prime WW/ZW",                                without: "−€18", with_et: "−€18",  note: null },
  { label: "Asigurare medicală",                         without: "−€35", with_et: "−€35",  note: null },
  { label: "Cazare agenție (standard SNF)",               without: "−€95", with_et: "−€95",  note: null },
  { label: "Transport la locul de muncă",                without: "−€25", with_et: "−€25",  note: null },
  { label: "ET vergoeding (rambursare scutită de impozit)", without: "€0", with_et: "+€84",  note: "Interval tipic €50–€150/săpt." },
  { label: "Nettoloon (suma primită în mână)",            without: "€352", with_et: "€479",  note: "Diferență +€127/săpt." },
];

// ─── Cine se califică ─────────────────────────────────────────────────────────
const QUALIFICATIONS = [
  {
    icon: "🌍",
    title: "Locuiești la mai mult de 150 km de granița olandeză",
    body: "Criteriul principal de calificare este că adresa ta permanentă de domiciliu se află la mai mult de 150 km de cel mai apropiat punct al graniței olandeze. Pentru majoritatea lucrătorilor din Europa de Est, aceasta este ușor îndeplinită: București este la 1.800 km distanță, Varșovia la 1.200 km, Sofia la 2.000 km. Lucrătorii din Belgia sau Germania aproape de graniță de obicei nu se califică.",
  },
  {
    icon: "⏱",
    title: "Ești în Olanda de mai puțin de 5 ani",
    body: "Beneficiul ET este conceput pentru lucrătorii care sunt temporar extrateritorial — departe de țara lor de origine. Se aplică pentru maximum 5 ani (60 de luni) de la data la care ai început prima dată să lucrezi în Olanda. După 5 ani, nu te mai califici chiar dacă mai locuiești în altă țară.",
  },
  {
    icon: "📋",
    title: "Contractul tău de muncă trebuie să includă o clauză ET",
    body: "Aranjamentul ET nu este automat — trebuie convenit în scris între tine și angajatorul tău. Pentru lucrătorii de agenție, asta înseamnă de obicei că clauza ET este inclusă în contractul standard de agenție (arbeidsovereenkomst). Întreabă recrutorul specific: 'Wordt de ET-vergoeding op mijn contract toegepast?' (Este ET vergoeding aplicat pe contractul meu?)",
  },
];

// ─── Cum să verifici fluturașul ───────────────────────────────────────────────
const PAYSLIP_CHECKS = [
  { label: "Caută 'ET vergoeding' sau 'ET toeslag'", detail: "Această linie ar trebui să afișeze o sumă pozitivă — rambursarea ta scutită de impozit pentru perioadă." },
  { label: "Caută 'Onkostenvergoeding'", detail: "Unele agenții folosesc acest termen general pentru rambursări de cheltuieli inclusiv costurile ET." },
  { label: "Verifică 'Belastingvrije vergoeding'", detail: "Rambursare scutită de impozit — altă etichetă comună pentru componenta ET." },
  { label: "Compară loonheffing-ul tău cu un coleg fără ET", detail: "Dacă schema ET este aplicată corect, loonheffing-ul tău ar trebui să fie vizibil mai mic pentru același salariu brut." },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Ce este schema ET în Olanda?",
    a: "Schema ET (Extraterritoriale kosten) permite angajatorilor olandezi să ramburseze lucrătorilor costurile suplimentare de a trăi și lucra în afara țării lor de origine — scutit de impozit. Se bazează pe Articolul 31a din Legea olandeză a Impozitului pe Salariu (Wet op de loonbelasting 1964). Beneficiul se plătește în plus față de salariul normal și reduce porțiunea din venit supusă loonheffing-ului olandez (impozit pe salariu). Pentru lucrătorii de agenție, asta poate însemna €50–€150/săpt. mai mult în mână comparativ cu lucrătorii la același salariu brut care nu au ET aplicat.",
  },
  {
    q: "Mă calific automat pentru schema ET ca lucrător din UE în Olanda?",
    a: "Nu automat. Te califici dacă: (1) domiciliul tău permanent este la mai mult de 150 km de granița olandeză, (2) ești în Olanda de mai puțin de 5 ani, și (3) contractul tău de muncă include o clauză ET. Regula 150 km elimină lucrătorii din Belgia și Germania care locuiesc aproape de granița olandeză. Toți lucrătorii din Europa de Est (Polonia, România, Bulgaria, Slovacia, Ungaria etc.) îndeplinesc cu ușurință cerința de distanță.",
  },
  {
    q: "Cât valorează schema ET pe săptămână?",
    a: "Beneficiul ET este calculat ca un procent din salariul tău brut — de obicei 30% din brutul impozabil pentru cei cu câștiguri mai mari în cadrul 'regulii 30%', dar pentru lucrătorii de agenție este calculat de obicei pe baza costurilor extrateritoriale reale. În practică, câștigul net săptămânal pentru un lucrător de agenție la WML (€14,71/oră, 40 ore/săpt.) este €50–€150/săpt. în funcție de modul în care agenția îl calculează. Exemplul de pe această pagină arată un câștig tipic de ~€127/săpt. net.",
  },
  {
    q: "Agenția mea spune că nu aplică ET. Pot trece la una care o face?",
    a: "Da. Nu toate agențiile aplică schema ET, chiar și când lucrătorii se califică. Unele agenții nu sunt familiare cu aceasta, altele aleg să nu o ofere. Dacă te califici și agenția ta actuală nu aplică ET, ești îndreptățit legal să negociezi sau să găsești o agenție care o face. Când compari agențiile pe AgencyCheck, poți verifica dacă ET vergoeding este menționat în termenii contractuali sau poți întreba direct la aplicare.",
  },
  {
    q: "Ce se întâmplă după 5 ani — pierd beneficiul ET?",
    a: "Da — după 60 de luni de muncă în Olanda, beneficiul ET expiră. Ceasul de 5 ani pornește de la prima ta zi de lucru în Olanda, nu de când ai aplicat prima dată pentru schema ET. Unii lucrători care vin în Olanda sezonier de ani de zile pot fi deja utilizat parțial sau complet cele 60 de luni fără să știe. Dacă lucrezi în Olanda de mult timp, roagă agenția sau un consilier fiscal olandez să verifice eligibilitatea ET rămasă.",
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
  headline: "Schema ET Olanda 2026 — Explicată pentru Lucrătorii de Agenție",
  description: "Explicație completă a beneficiului olandez ET (Extraterritoriale kosten) pentru lucrătorii de agenție din UE: cine se califică, cât valorează și cum îți verifici fluturașul.",
  author: { "@type": "Organization", name: "AgencyCheck" },
  publisher: { "@type": "Organization", name: "AgencyCheck", url: "https://agencycheck.io" },
  datePublished: "2026-01-01",
  dateModified: "2026-05-01",
  inLanguage: "ro",
  url: "https://agencycheck.io/ro/schema-et-olanda",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Acasă", item: "https://agencycheck.io/ro" },
    { "@type": "ListItem", position: 2, name: "Ghiduri", item: "https://agencycheck.io/guides" },
    { "@type": "ListItem", position: 3, name: "Schema ET Explicată", item: "https://agencycheck.io/ro/schema-et-olanda" },
  ],
};

export default async function SchemaEtOlanda() {
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
            <Link href="/ro" className="hover:text-gray-300">Acasă</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-gray-300">Ghiduri</Link>
            <span>/</span>
            <span className="text-gray-400">Schema ET Explicată</span>
          </nav>
          <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3">Ghid beneficiu fiscal 2026</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-5">
            Schema ET Olanda —<br className="hidden sm:block" />
            <span className="text-amber-400">Până la €150/săpt. extra, scutit de impozit</span>
          </h1>
          <p className="text-base text-gray-300 leading-relaxed mb-6">
            Schema <strong className="text-white">ET (Extraterritoriale kosten)</strong> este un beneficiu fiscal legal olandez
            pentru care se califică majoritatea lucrătorilor de agenție din UE — dar majoritatea nu au auzit niciodată de el.
            Dacă agenția ta îl aplică corect, salariul tău net poate crește cu <strong className="text-white">€50–€150 în fiecare săptămână</strong>,
            fără să câștigi un singur euro mai mult în brut. Acest ghid explică totul.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            {["Bazat pe Art. 31a Wet LB 1964", "Se califică dacă >150km de granița NL", "Valabil 5 ani (60 luni)", "Verifică: 'ET vergoeding' pe fluturaș"].map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 font-semibold text-gray-300">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tabel comparativ ─────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
            Cifrele — lucrător WML, 40h/săpt.
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Același salariu brut. Aceeași cazare de agenție. Același job. Singura diferență este dacă schema ET este aplicată.
          </p>
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-900 px-5 py-3 gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Linie</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Fără ET</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 text-right">Cu ET</span>
            </div>
            <div className="divide-y divide-gray-100">
              {COMPARISON.map((row) => (
                <div key={row.label} className={`grid grid-cols-3 gap-4 px-5 py-3 items-center ${row.label.startsWith("Nettoloon") ? "bg-amber-50 font-black" : ""}`}>
                  <div>
                    <span className="text-sm text-gray-700">{row.label}</span>
                    {row.note && <p className="text-[10px] text-gray-400 mt-0.5">{row.note}</p>}
                  </div>
                  <span className="text-sm text-right font-mono text-gray-600">{row.without}</span>
                  <span className={`text-sm text-right font-mono font-bold ${row.label.startsWith("ET") ? "text-amber-600" : row.label.startsWith("Nettoloon") ? "text-emerald-700 text-base" : "text-gray-600"}`}>
                    {row.with_et}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Exemplu bazat pe WML 2026 (€14,71/oră × 40h/săpt. = €588 brut). ET vergoeding calculat la rata tipică de agenție.
            Sumele reale variază în funcție de agenție și circumstanțele individuale.
          </p>
        </div>
      </section>

      {/* ── Cine se califică ──────────────────────────────────────────── */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Cine se califică pentru schema ET?</h2>
          <p className="text-sm text-gray-500 mb-8">Toate cele trei condiții trebuie îndeplinite simultan.</p>
          <div className="space-y-5">
            {QUALIFICATIONS.map((q, i) => (
              <div key={i} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5">
                <span className="text-3xl shrink-0">{q.icon}</span>
                <div>
                  <h3 className="text-base font-black text-gray-900 mb-1.5">{q.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{q.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <p className="text-sm text-emerald-800 leading-relaxed">
              <strong>Verificare rapidă:</strong> Ești din România, Polonia, Bulgaria, Slovacia, Ungaria, Ucraina sau altă țară la mai mult de 150 km de Olanda?
              Ești în Olanda de mai puțin de 5 ani?
              Dacă ambele sunt da — probabil te califici. Întreabă recrutorul agenției dacă contractul tău include ET vergoeding.
            </p>
          </div>
        </div>
      </section>

      {/* ── Cum să verifici fluturașul ────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Cum să verifici fluturașul tău pentru ET</h2>
          <p className="text-sm text-gray-500 mb-6">
            Diferite agenții folosesc etichete diferite. Caută oricare din acestea pe <strong>loonstrook</strong>-ul tău:
          </p>
          <div className="space-y-3">
            {PAYSLIP_CHECKS.map((c, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white px-4 py-4">
                <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-black flex items-center justify-center mt-0.5">{i + 1}</span>
                <div>
                  <p className="text-sm font-bold text-gray-900 font-mono">{c.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Niciuna din acestea nu apare pe fluturașul tău?</strong> Întreabă recrutorul direct:
              <em className="text-gray-600"> &ldquo;Wordt de ET-vergoeding op mijn loonstrook toegepast en zo niet, waarom niet?&rdquo;</em>
              (Este ET vergoeding aplicat pe fluturașul meu și dacă nu — de ce nu?)
            </p>
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
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Găsește agenții care aplică schema ET</h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              Când aplici prin AgencyCheck, poți întreba recrutorul direct despre ET vergoeding înainte de semnare.
              Aplicare gratuită — răspuns WhatsApp în aceeași zi.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {featuredAgencies.map((agency) => (
              <AgencyCard key={agency.slug} agency={agency} jobCount={getJobCountForAgency(agency.slug)} />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/vacancies" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors px-6 py-3 text-sm font-bold text-gray-700">
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
              { href: "/ro/loonstrook-explicat",           label: "Cum să citești fluturașul de salariu olandez" },
              { href: "/ro/numarul-bsn-olanda",             label: "Cum să obții numărul tău BSN" },
              { href: "/after-you-apply",                   label: "Ce se întâmplă după ce aplici" },
              { href: "/tools/real-salary-calculator",      label: "Calculator salariu net Olanda" },
              { href: "/what-is-order-picking",             label: "Order picking — salariu și condiții" },
              { href: "/work-in-netherlands-for-foreigners", label: "Ghid complet pentru lucrătorii străini" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors px-4 py-3 text-sm font-semibold text-gray-700">
                <span className="text-gray-400">→</span> {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
