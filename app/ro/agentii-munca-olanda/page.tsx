import type { Metadata } from "next";
import Link from "next/link";
import { HOUSING_AGENCIES } from "@/lib/agencyEnriched";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Agenții de Muncă Olanda 2026 — Recenzii, Clasament și Avertismente",
  description:
    "Recenzii verificate ale agențiilor de muncă din Olanda. OTTO Workforce, Covebo, Randstad, Tempo-Team și 150+ altele. Ce rămâne după deducerea cazării și taxelor? Citește înainte să semnezi contractul.",
  keywords: [
    "agentie de munca Olanda",
    "agentii de munca Olanda recenzii",
    "cea mai buna agentie de munca Olanda",
    "agentie de munca Olanda cazare",
    "agentie de munca legala Olanda",
    "agentii munca Olanda clasament",
  ],
  alternates: {
    canonical: "https://agencycheck.io/ro/agentii-munca-olanda",
    languages: {
      "en":        "https://agencycheck.io/agencies",
      "pl":        "https://agencycheck.io/pl/agencje-pracy-holandia",
      "ro":        "https://agencycheck.io/ro/agentii-munca-olanda",
      "x-default": "https://agencycheck.io/agencies",
    },
  },
  openGraph: {
    title: "Agenții de Muncă Olanda — Recenzii Verificate de Muncitori 2026",
    description:
      "Compară 150+ agenții de muncă din Olanda. Cine oferă cazare corectă? Cine reține prea mult? Recenzii reale, salarii reale, avertismente.",
    locale: "ro_RO",
  },
};

// ─── Top agencies for Romanian workers ────────────────────────────────────────

const TOP_AGENCIES = [
  {
    slug:        "otto-workforce",
    name:        "OTTO Workforce",
    verdict:     "Cea mai mare agenție pentru muncitori migranți din Olanda",
    housing:     "Da — OTTO Housing, deducere ~€95/săptămână",
    sector:      "Logistică, depozit, producție",
    cities:      "Venray, Zwolle, Rotterdam, Amsterdam, 's-Hertogenbosch",
    score:       72,
    pros:        ["Certificat ABU și SNF", "Rețea extinsă de cazare", "Transport bun inclus"],
    cons:        ["Complexe mari — puțină intimitate", "Listă de așteptare în sezon de vârf"],
    verdict_ro:  "Opțiune solidă pentru prima plecare. Mare, verificată, dar nu cea mai ieftină la deduceri.",
  },
  {
    slug:        "covebo",
    name:        "Covebo",
    verdict:     "Specializată în muncitori din Europa Centrală și de Est",
    housing:     "Da — Covebo Housing, deducere €100–€120/săptămână",
    sector:      "Producție alimentară, logistică, seră",
    cities:      "Venlo, Breda, Tilburg, Eindhoven",
    score:       68,
    pros:        ["Personal vorbitor de română", "Contracte clare cu defalcare a costurilor", "Certificat ABU"],
    cons:        ["Orare rotative în 3 schimburi", "Cazare la 30–40 min de fabrici"],
    verdict_ro:  "Bun pentru cei care vor comunicare în română. Verifică distanța de la cazare la locul de muncă.",
  },
  {
    slug:        "randstad",
    name:        "Randstad",
    verdict:     "Agenție multinațională — mai puțin orientată spre muncitori migranți",
    housing:     "Uneori — depinde de locație, deducere €80–€140/săptămână",
    sector:      "Logistică, administrație, producție",
    cities:      "Amsterdam, Rotterdam, Den Haag, Utrecht",
    score:       65,
    pros:        ["Reputație internațională solidă", "Procese de recrutare transparente", "Pontaj digital"],
    cons:        ["Mai puțin suport în limba română", "Condițiile de cazare variază mult"],
    verdict_ro:  "Decent, dar verifică termenii exacti de cazare înainte de plecare.",
  },
  {
    slug:        "tempo-team",
    name:        "Tempo-Team",
    verdict:     "Subsidiară Randstad cu accent pe logistică și producție",
    housing:     "Da — parteneri externi, deducere ~€110/săptămână",
    sector:      "Logistică, e-commerce, producție",
    cities:      "Tilburg, Waalwijk, Bergen op Zoom",
    score:       63,
    pros:        ["Contracte de munca flexibile", "Bun pentru depozite e-commerce"],
    cons:        ["Cazare externă — calitate variabilă", "Puțini angajați vorbitori de română"],
    verdict_ro:  "Ok pentru depozite mari. Cere fotografii ale cazării înainte să accepți.",
  },
  {
    slug:        "hobij",
    name:        "HOBIJ",
    verdict:     "Agenție mai mică — mai multă atenție individuală",
    housing:     "Da — proprie sau partener local, deducere €90–€115/săptămână",
    sector:      "Producție, ambalare, seră",
    cities:      "Venray, Horst, Venlo",
    score:       70,
    pros:        ["Grupuri mai mici — mai multă atenție", "Personal care vorbește română și poloneză", "Deduceri clare"],
    cons:        ["Rețea mai mică de locuri de muncă", "Sezonal pentru seră"],
    verdict_ro:  "Subestimat. Potrivit dacă vrei o agenție mai mică cu comunicare mai bună.",
  },
];

const RED_FLAGS = [
  {
    icon: "🚩",
    title: "Îți cer bani înainte de angajare",
    desc: "Agențiile legitime nu cer taxe de procesare sau 'depozit' înainte de angajare. Plata merge direct la tine.",
  },
  {
    icon: "🚩",
    title: "Contractul de cazare nu e separat",
    desc: "Ar trebui să primești două documente distincte: contract de muncă și contract de cazare cu costuri clar specificate.",
  },
  {
    icon: "🚩",
    title: "Nu au certificat ABU sau SNA",
    desc: "Toate agențiile legitime din Olanda trebuie să fie certificate. Verifică pe abu.nl sau sna.nl înainte să accepti.",
  },
  {
    icon: "🚩",
    title: "Nu îți arată calculul salarial net",
    desc: "Dacă agenția nu poate/nu vrea să-ți arate salariul net real după deduceri, e semnal de alarmă.",
  },
];

const FAQS = [
  {
    q: "Care este cea mai bună agenție de muncă din Olanda pentru români?",
    a: "Nu există o singură 'cea mai bună' agenție. OTTO Workforce și Covebo au cei mai mulți muncitori români și procese documentate. Cel mai important este să compari salariul net real după deducerea cazării, nu salariul brut afișat.",
  },
  {
    q: "Agențiile de muncă din Olanda sunt legale?",
    a: "Agențiile certificate ABU sau SNA sunt legale și verificate regulat. Verifică întotdeauna certificarea pe abu.nl sau sna.nl înainte să semnezi orice contract.",
  },
  {
    q: "Cât deduce agenția pentru cazare?",
    a: "Deducerile tipice sunt €90–€170/săptămână, în funcție de agenție și tip de cazare. Această sumă se scade direct din salariul brut. La €15/oră și 40h/săptămână, rămâi cu aproximativ €280–€380 net/săptămână după toate costurile.",
  },
  {
    q: "Pot lucra în Olanda fără cazare prin agenție?",
    a: "Da. Mulți muncitori preferă să găsească cazare proprie și sunt angajați direct sau prin agenție fără pachet de cazare. Salariul net este mai mare, dar trebuie să-ți organizezi singur locuința.",
  },
  {
    q: "Care agenții din Olanda au personal vorbitor de română?",
    a: "Covebo și HOBIJ au în mod constant personal care vorbește română. OTTO Workforce are uneori coordonatori români la complexele mari. Verifică cu agenția înainte de plecare.",
  },
  {
    q: "Cum verific o agenție de muncă înainte să plec?",
    a: "Verifică certificarea ABU/SNA, cere un contract de muncă și unul de cazare separat cu toate costurile detaliate, caută recenzii de la muncitori anteriori pe AgencyCheck.io și calculează salariul net real cu calculatorul nostru înainte să decizi.",
  },
];

export default function RoAgentiiMuncaOlandaPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Pagina principală", url: "https://agencycheck.io/ro" },
    { name: "Agenții muncă Olanda", url: "https://agencycheck.io/ro/agentii-munca-olanda" },
  ]);
  const faq = faqPageSchema(FAQS.map((f) => ({ question: f.q, answer: f.a })));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
          <Link href="/ro" className="hover:text-brand-600">Pagina principală</Link>
          <span>›</span>
          <span className="text-gray-800 font-medium">Agenții muncă Olanda</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-800 rounded-full px-2.5 py-1">
              🏢 {HOUSING_AGENCIES.length}+ agenții
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 rounded-full px-2.5 py-1">
              🇳🇱 Olanda
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 rounded-full px-2.5 py-1">
              🚫 Nu publicitate de agenție
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-3">
            Agenții de muncă Olanda — recenzii și clasament 2026
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
            Recenzii bazate pe experiența reală a muncitorilor. Comparam <strong>salariul net real</strong> după
            deducerea cazării, transportului și taxelor — nu salariul brut de pe reclamă.
            Nicio agenție nu plătește pentru poziționare pe acest site.
          </p>
        </div>

        {/* Warning strip */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-2">⚠️ Înainte să alegi o agenție</p>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-bold text-gray-900 mb-0.5">Salariul brut ≠ salariul net</p>
              <p className="text-gray-600 text-xs">La €15/oră brut, rămâi cu ~€6,50–€8/oră net după toate deducerile.</p>
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-0.5">Cazarea se plătește din salariu</p>
              <p className="text-gray-600 text-xs">€90–€170/săptămână deduși direct. Nu este inclusă gratuit.</p>
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-0.5">Verifică certificarea</p>
              <p className="text-gray-600 text-xs">Cere numărul ABU sau SNA înainte să semnezi orice document.</p>
            </div>
          </div>
          <Link
            href="/tools/real-income-calculator"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 border border-amber-300 rounded-full px-3 py-1.5 hover:bg-amber-100 transition-colors"
          >
            🧮 Calculează salariul real →
          </Link>
        </div>

        {/* Top agencies */}
        <section className="mb-12">
          <h2 className="text-xl font-black text-gray-900 mb-2">Top 5 agenții pentru muncitori români</h2>
          <p className="text-sm text-gray-500 mb-6">Bazat pe recenzii de la muncitori, transparență costuri și certificare oficială.</p>

          <div className="space-y-6">
            {TOP_AGENCIES.map((agency, i) => (
              <div key={agency.slug} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-gray-300">#{i + 1}</span>
                    <div>
                      <Link
                        href={`/agencies/${agency.slug}`}
                        className="font-black text-gray-900 hover:text-brand-600 text-base"
                      >
                        {agency.name}
                      </Link>
                      <p className="text-xs text-gray-500">{agency.verdict}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div
                      className={`text-sm font-black px-3 py-1 rounded-full ${
                        agency.score >= 70
                          ? "bg-green-100 text-green-800"
                          : agency.score >= 60
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {agency.score}/100
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 text-xs mb-4">
                  <div className="bg-gray-50 rounded-xl px-3 py-2">
                    <p className="text-gray-400 font-medium mb-0.5">Cazare</p>
                    <p className="text-gray-800 font-semibold">{agency.housing}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl px-3 py-2">
                    <p className="text-gray-400 font-medium mb-0.5">Sector</p>
                    <p className="text-gray-800 font-semibold">{agency.sector}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl px-3 py-2">
                    <p className="text-gray-400 font-medium mb-0.5">Orașe</p>
                    <p className="text-gray-800 font-semibold">{agency.cities}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-xs mb-4">
                  <div>
                    <p className="font-bold text-green-700 mb-1">✓ Avantaje</p>
                    <ul className="space-y-0.5">
                      {agency.pros.map((p) => (
                        <li key={p} className="text-gray-600">• {p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-bold text-red-600 mb-1">✗ Dezavantaje</p>
                    <ul className="space-y-0.5">
                      {agency.cons.map((c) => (
                        <li key={c} className="text-gray-600">• {c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 text-xs">
                  <span className="font-bold text-blue-700">Concluzie: </span>
                  <span className="text-gray-700">{agency.verdict_ro}</span>
                </div>

                <div className="mt-3">
                  <Link
                    href={`/agencies/${agency.slug}`}
                    className="text-xs font-bold text-brand-600 hover:underline"
                  >
                    Recenzii complete {agency.name} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Red flags */}
        <section className="mb-12">
          <h2 className="text-xl font-black text-gray-900 mb-2">Semne de alarmă — cum recunoști o agenție dubioasă</h2>
          <p className="text-sm text-gray-500 mb-5">Dacă observi vreunul din semnalele de mai jos, nu semna nimic.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {RED_FLAGS.map((flag) => (
              <div key={flag.title} className="bg-red-50 border border-red-100 rounded-2xl p-4">
                <p className="font-black text-gray-900 mb-1">{flag.icon} {flag.title}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{flag.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Internal links */}
        <section className="mb-12">
          <h2 className="text-xl font-black text-gray-900 mb-4">Informații utile</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              href="/ro/salariu-olanda"
              className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow group"
            >
              <p className="text-2xl mb-2">💶</p>
              <p className="font-black text-gray-900 group-hover:text-brand-600 mb-1">Salariu net Olanda 2026</p>
              <p className="text-xs text-gray-500">Calcul complet: salariu minim, deduceri, ce rămâne în mână</p>
            </Link>
            <Link
              href="/ro/locuri-de-munca-cu-cazare"
              className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow group"
            >
              <p className="text-2xl mb-2">🏠</p>
              <p className="font-black text-gray-900 group-hover:text-brand-600 mb-1">Locuri de muncă cu cazare</p>
              <p className="text-xs text-gray-500">Agenții care includ cazare și costul real pe săptămână</p>
            </Link>
            <Link
              href="/tools/real-income-calculator"
              className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow group"
            >
              <p className="text-2xl mb-2">🧮</p>
              <p className="font-black text-gray-900 group-hover:text-brand-600 mb-1">Calculator salariu net</p>
              <p className="text-xs text-gray-500">Introdu oferta ta și calculează exact ce primești</p>
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-xl font-black text-gray-900 mb-5">Întrebări frecvente despre agențiile din Olanda</h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="bg-white border border-gray-200 rounded-2xl p-5">
                <p className="font-black text-gray-900 mb-2">{faq.q}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-surface-muted rounded-2xl px-6 py-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-black text-base mb-1">Caută agenția ta înainte să pleci</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Recenzii de la muncitori reali, poze cazare, calculator salariu net — toate gratuit.
            </p>
          </div>
          <Link
            href="/ro"
            className="shrink-0 bg-brand-600 hover:bg-brand-500 text-white font-black text-sm px-5 py-3 rounded-xl transition-colors whitespace-nowrap"
          >
            🔍 Caută agenții →
          </Link>
        </div>

      </div>
    </>
  );
}
