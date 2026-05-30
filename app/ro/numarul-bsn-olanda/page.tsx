import type { Metadata } from "next";
import Link from "next/link";
import { AGENCIES_WITH_HOUSING } from "@/lib/agencyData";
import AgencyCard from "@/components/AgencyCard";
import { getJobCountForAgency } from "@/lib/jobData";

export const metadata: Metadata = {
  title: "Numărul BSN în Olanda — Ghid Complet pentru Lucrătorii de Agenție 2026",
  description:
    "Cum să obții numărul BSN în Olanda ca lucrător de agenție din UE. Înregistrare RNI, documente necesare (carte de identitate), termene și ce ar trebui să aranjeze agenția ta.",
  alternates: {
    canonical: "https://agencycheck.io/ro/numarul-bsn-olanda",
    languages: { en: "https://agencycheck.io/bsn-number-netherlands-guide" },
  },
  openGraph: {
    title: "Numărul BSN în Olanda — Ghid complet pentru lucrătorii de agenție 2026",
    description:
      "Pas cu pas: obține BSN-ul tău olandez ca lucrător de agenție din UE. Înregistrare RNI vs primărie, documente necesare, DigiD și ce se întâmplă fără BSN.",
  },
};

export const dynamic = "force-static";

const STEPS = [
  {
    step: "1",
    title: "Sosești în Olanda",
    body: "Ca cetățean UE/SEE ai dreptul să locuiești și să lucrezi în Olanda din prima zi — nu este necesar permis de muncă. Nu trebuie să te înregistrezi sau să aplici pentru nimic înainte de sosire. Agenția ta va avea deja confirmată data de start.",
    tip: null,
  },
  {
    step: "2",
    title: "Înregistrează-te la un birou RNI sau la primăria locală",
    body: "Trebuie să îți înregistrezi prezența în Olanda pentru a primi un BSN. Există două rute în funcție de dacă ai o adresă fixă sau cazare furnizată de agenție.",
    tip: "Înregistrarea RNI (Registratie Niet-Ingezetenen) este pentru lucrătorii fără adresă permanentă olandeză — de obicei cazare de agenție. Există 19 birouri RNI la municipalitățile mari, inclusiv Rotterdam, Amsterdam, Eindhoven, Den Haag, Venlo și Breda. Agenția ta ar trebui să îți spună care este cel mai apropiat și poate organiza transportul.",
  },
  {
    step: "3",
    title: "Aduce documentele corecte",
    body: "Indiferent dacă te înregistrezi la un birou RNI sau primărie, ai nevoie de: (1) Carte de identitate națională valabilă sau pașaport, (2) Dovada lucrului în Olanda — poate fi contractul de muncă de la agenție, (3) Dovada adresei — dacă folosești cazare de agenție, o scrisoare de la agenție care confirmă adresa de cazare este acceptată.",
    tip: "Unele municipalități cer și certificatul de naștere. Întreabă agenția în avans ce necesită biroul RNI local. Programarea poate fi rezervată de obicei online pe site-ul municipalității respective. Cartea ta de identitate (carte de identitate) trebuie să fie valabilă.",
  },
  {
    step: "4",
    title: "Primești BSN-ul tău",
    body: "La biroul RNI, BSN-ul este emis de obicei în aceeași zi. La o primărie, poate dura până la 5 zile lucrătoare. BSN-ul tău este un număr de 9 cifre. Notează-l și păstrează-l — vei avea nevoie de el pentru loonstrook, asigurare medicală, cont bancar și DigiD.",
    tip: "Agenția ta are nevoie de BSN-ul tău pentru a procesa corect salariul și loonheffing (impozitul pe salariu). Până când BSN-ul tău este înregistrat, angajatorul tău trebuie să aplice cea mai mare rată de impozit (noodloon — 'reținere de urgență'), ceea ce poate însemna semnificativ mai puțin în prima săptămână.",
  },
  {
    step: "5",
    title: "Aplică pentru DigiD (opțional, dar recomandat)",
    body: "DigiD este sistemul de identitate digitală al guvernului olandez — un login/parolă separat necesar pentru accesarea serviciilor guvernamentale online: declarații fiscale (Belastingdienst), alocație de sănătate (zorgtoeslag), alocație de locuință (huurtoeslag). Nu este același lucru cu BSN-ul tău, dar ai nevoie de BSN pentru a aplica pentru DigiD.",
    tip: "Aplicațiile DigiD se fac la digid.nl. Activarea durează 5–7 zile prin scrisoare la adresa înregistrată. Dacă mai târziu vrei să revendici toeslagen (alocații) care reduc costul vieții, DigiD este necesar.",
  },
];

const DOCUMENTS = [
  { doc: "Carte de identitate națională valabilă sau pașaport", note: "Trebuie să fie în termen — cartea de identitate expirată este respinsă" },
  { doc: "Contract de muncă de la agenție", note: "Arată că lucrezi în Olanda" },
  { doc: "Dovada adresei în Olanda", note: "Scrisoarea agenției de cazare cu adresa completă este acceptată" },
  { doc: "Certificat de naștere (unele municipalități)", note: "Verifică cu biroul tău specific RNI în avans" },
];

const RNI_DESKS = [
  "Amsterdam", "Rotterdam", "Den Haag", "Utrecht", "Eindhoven",
  "Tilburg", "Groningen", "Almere", "Breda", "Nijmegen",
  "Enschede", "Arnhem", "Haarlem", "Haarlemmermeer", "Zaanstad",
  "Venlo", "Maastricht", "Dordrecht", "Zwolle",
];

const FAQS = [
  {
    q: "Cât durează să obții un număr BSN în Olanda?",
    a: "La un birou RNI, BSN-ul este de obicei emis în aceeași zi cu programarea. La o primărie (pentru cei cu adresă fixă), poate dura până la 5 zile lucrătoare. Majoritatea agențiilor aranjează programarea RNI în primele 3–5 zile lucrătoare de la sosire. Fără BSN, angajatorul trebuie să aplice cea mai mare rată de reținere fiscală (noodloon), ceea ce afectează direct primul tău fluturaș.",
  },
  {
    q: "Pot lucra în Olanda fără BSN?",
    a: "Poți să începi să lucrezi, dar angajatorul trebuie să aplice rata de reținere fiscală de urgență (noodloon/anoniementarief) până la procesarea BSN-ului tău. Asta înseamnă mult mai puțin în acea perioadă — uneori 40–50% reținut în loc de normalul 10–15%. Odată ce BSN-ul tău este înregistrat și trimis angajatorului, se aplică rata corectă. Excesul reținut în prima perioadă este de obicei corectat în declarația fiscală anuală.",
  },
  {
    q: "Care este diferența dintre BSN și DigiD?",
    a: "BSN-ul tău (Burgerservicenummer) este un număr permanent de 9 cifre care te identifică în sistemele guvernamentale și fiscale olandeze — apare pe fluturașul tău și este folosit de angajatorul tău pentru a raporta venitul la Belastingdienst (autoritatea fiscală). DigiD este un sistem separat de nume de utilizator și parolă pentru conectarea pe site-urile guvernamentale. Ai nevoie de BSN pentru a crea un DigiD, dar sunt lucruri diferite. Ai întotdeauna BSN-ul odată atribuit; DigiD este un login pe care îl aplici separat.",
  },
  {
    q: "Are nevoie angajatorul meu (agenția) de BSN-ul meu?",
    a: "Da — BSN-ul tău este necesar legal pentru ca angajatorul să proceseze corect salariul. Conform legii olandeze, angajatorii trebuie să înregistreze BSN-ul fiecărui angajat (Wet op de loonbelasting Art. 28). Fără el, se aplică noodtarief (rata de urgență) și se reține mai mult impozit. Dă BSN-ul tău recrutorului agenției cât mai curând după primire — în aceeași zi dacă este posibil.",
  },
  {
    q: "Pot deschide un cont bancar olandez fără BSN?",
    a: "Majoritatea băncilor olandeze (ING, Rabobank, ABN AMRO) necesită un BSN pentru a deschide un cont. Unele bănci precum Bunq sau Revolut permit deschiderea unui cont fără BSN olandez, folosind un document de identitate UE (de ex. cartea de identitate română). Cu toate acestea, pentru a primi salariul de la un angajator olandez, un cont bancar olandez este foarte recomandat. A avea un IBAN olandez evită și taxele de transfer SEPA pe care unele agenții le percep pentru plăți în conturi străine.",
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
  headline: "Numărul BSN în Olanda — Ghid Complet pentru Lucrătorii de Agenție 2026",
  description: "Ghid pas cu pas pentru obținerea numărului BSN olandez ca lucrător de agenție din UE, inclusiv înregistrarea RNI, documentele necesare și ce ar trebui să aranjeze agenția ta.",
  author: { "@type": "Organization", name: "AgencyCheck" },
  publisher: { "@type": "Organization", name: "AgencyCheck", url: "https://agencycheck.io" },
  datePublished: "2026-01-01",
  dateModified: "2026-05-01",
  inLanguage: "ro",
  url: "https://agencycheck.io/ro/numarul-bsn-olanda",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Acasă", item: "https://agencycheck.io/ro" },
    { "@type": "ListItem", position: 2, name: "Ghiduri", item: "https://agencycheck.io/guides" },
    { "@type": "ListItem", position: 3, name: "Numărul BSN Olanda", item: "https://agencycheck.io/ro/numarul-bsn-olanda" },
  ],
};

export default async function NmarulBsnOlanda() {
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
            <span className="text-gray-400">Numărul BSN Olanda</span>
          </nav>
          <p className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-3">Ghid administrativ 2026</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-5">
            Numărul BSN în Olanda —<br className="hidden sm:block" />
            <span className="text-emerald-400">Ghid Complet pentru Lucrătorii de Agenție din UE</span>
          </h1>
          <p className="text-base text-gray-300 leading-relaxed mb-6">
            <strong className="text-white">BSN-ul (Burgerservicenummer)</strong> tău este numărul tău de identificare fiscală olandez.
            Ai nevoie de el pentru a-ți primi salariul corect, a deschide un cont bancar, a accesa asistența medicală și a depune o declarație fiscală.
            Ca cetățean UE/SEE ai dreptul să lucrezi în Olanda din prima zi — obținerea BSN-ului este primul pas administrativ după sosire.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            {["În aceeași zi la biroul RNI", "19 locații RNI în toată NL", "Necesar pentru salarizare corectă", "Gratuit de obținut"].map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 font-semibold text-gray-300">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ce este BSN ──────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4">Ce este BSN și de ce ai nevoie de el?</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            <strong>Burgerservicenummer (BSN)</strong> este un număr permanent de 9 cifre atribuit fiecărei persoane
            înregistrate în Olanda. Este echivalentul unui număr de securitate socială sau CNP.
            Odată atribuit, BSN-ul tău nu se schimbă niciodată — chiar dacă pleci și te întorci ani mai târziu.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Angajatorul tău este obligat legal să înregistreze BSN-ul tău la autoritatea fiscală olandeză (Belastingdienst)
            în prima perioadă de plată. Fără el, trebuie să aplice <strong>anoniementarief</strong>
            — rata de reținere anonimă — ceea ce înseamnă semnificativ mai mult impozit reținut din primul salariu.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mt-5">
            {[
              { icon: "💶", label: "Fluturaș și salarizare", desc: "Angajatorul tău raportează impozitul folosind BSN — necesar prin Wet op de loonbelasting" },
              { icon: "🏥", label: "Asigurare medicală", desc: "BSN-ul tău este necesar pentru înregistrarea la zorgverzekering olandeză (asigurare medicală obligatorie)" },
              { icon: "🏦", label: "Cont bancar", desc: "Băncile olandeze (ING, Rabobank, ABN AMRO) necesită BSN-ul pentru a deschide un cont" },
              { icon: "📋", label: "Declarație fiscală și alocații", desc: "Necesar pentru a depune declarație fiscală și a revendica zorgtoeslag sau huurtoeslag" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-black text-gray-900">{item.label}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pas cu pas ────────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-8">Pas cu pas: cum să obții BSN-ul</h2>
          <div className="space-y-6">
            {STEPS.map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="shrink-0 w-9 h-9 rounded-full bg-gray-900 text-white text-sm font-black flex items-center justify-center mt-0.5">{s.step}</div>
                <div className="flex-1">
                  <h3 className="text-base font-black text-gray-900 mb-1.5">{s.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{s.body}</p>
                  {s.tip && (
                    <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-800 leading-relaxed">
                      <strong>Notă:</strong> {s.tip}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Documente ─────────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6">Documente necesare pentru înregistrarea BSN</h2>
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {DOCUMENTS.map((d) => (
                <div key={d.doc} className="flex items-start gap-4 px-5 py-4 bg-white">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center mt-0.5">✓</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{d.doc}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{d.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Lista birourilor RNI ──────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">Birouri RNI — 19 locații în toată Olanda</h2>
          <p className="text-sm text-gray-500 mb-5">
            Dacă ești în cazare de agenție fără adresă permanentă, te înregistrezi la unul din cele 19 birouri RNI.
            Programările pot fi de obicei rezervate online în 1–3 zile.
          </p>
          <div className="flex flex-wrap gap-2">
            {RNI_DESKS.map((city) => (
              <span key={city} className="text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 bg-white">{city}</span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Rezervă programările pe site-ul oficial al municipalității celei mai apropiate. Agenția ta ar trebui să furnizeze adresa celui mai apropiat birou RNI.
          </p>
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
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Găsește de lucru prin AgencyCheck</p>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Agenții care te ajută cu înregistrarea BSN</h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              Agențiile bune te ghidează prin procesul BSN în primele 3 zile de la sosire.
              Răsfoiește agențiile verificate pe AgencyCheck — aplicare gratuită prin WhatsApp.
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
              { href: "/ro/loonstrook-explicat",          label: "Cum să citești fluturașul de salariu olandez" },
              { href: "/ro/schema-et-olanda",              label: "Schema ET — până la €150/săpt. extra net" },
              { href: "/after-you-apply",                  label: "Ce se întâmplă după ce aplici" },
              { href: "/what-is-order-picking",            label: "Order picking — salariu și condiții" },
              { href: "/tools/real-salary-calculator",     label: "Calculator salariu net Olanda" },
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
