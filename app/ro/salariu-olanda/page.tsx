import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Salariu Net Olanda 2026 — Cât Câștigă un Muncitor după Toate Deducerile",
  description:
    "Cât câștigi net în Olanda în 2026? Salariu minim €14,71/oră, după impozit, cazare și transport — rămân ~€280–€380/săptămână. Calculator complet cu cifre reale.",
  keywords: [
    "salariu minim Olanda 2026",
    "salariu net Olanda",
    "cat se castiga in Olanda",
    "salariu Olanda dupa impozitare",
    "venit net Olanda muncitor roman",
    "salariu Olanda depozit productie",
  ],
  alternates: {
    canonical: "https://agencycheck.io/ro/salariu-olanda",
    languages: {
      "en":        "https://agencycheck.io/salary-netherlands",
      "pl":        "https://agencycheck.io/pl/zarobki-holandia",
      "ro":        "https://agencycheck.io/ro/salariu-olanda",
      "x-default": "https://agencycheck.io/salary-netherlands",
    },
  },
  openGraph: {
    title: "Salariu Net Olanda 2026 — Cifre Reale după Cazare și Taxe",
    description:
      "Salariu minim Olanda 2026: €14,71/oră brut. Dar cât rămâne net după impozit, cazare și transport? Calculul complet pentru muncitorii migranți.",
    locale: "ro_RO",
  },
};

// ─── Salary data ──────────────────────────────────────────────────────────────

const WML_ROWS = [
  { label: "Salariu brut (40h × €14,71)",         value: "€ 588",  note: "" },
  { label: "Impozit pe venit + contribuții sociale", value: "− €148", note: "~25% efectiv pt. muncitori temporari" },
  { label: "Salariu net înainte de deduceri",      value: "€ 440",  note: "" },
  { label: "Cazare agenție (medie)",               value: "− €120", note: "€95–€170/săptămână" },
  { label: "Transport la/de la muncă",             value: "− €15",  note: "dacă nu e inclus" },
  { label: "Asigurare de sănătate (opțional)",     value: "− €10",  note: "~€40/lună" },
  { label: "Rămâne în mână (net real)",            value: "≈ €295", note: "estimare orientativă", highlight: true },
];

const JOB_TABLE = [
  { role: "Culegător comenzi (depozit)",   wage: "€14,71",  net: "€270–€330", note: "Fără experiență necesară" },
  { role: "Muncitor producție / ambalare", wage: "€14,71–€15,50", net: "€280–€360", note: "Rotații 3 schimburi" },
  { role: "Muncitor seră",                 wage: "€14,71",  net: "€250–€310", note: "Sezon mart.–oct." },
  { role: "Șofer stivuitor",               wage: "€15,50–€17,00", net: "€330–€420", note: "Necesită permis valabil" },
  { role: "Reach truck / VNA",             wage: "€16,00–€18,50", net: "€360–€460", note: "Experiență necesară" },
  { role: "Mecanic / tehnician CNC",       wage: "€17,00–€22,00", net: "€420–€560", note: "Calificare necesară" },
];

const WITHOUT_HOUSING = [
  { item: "Chirie cameră (partajată)",   cost: "€350–€500/lună",  note: "Zona rurală/industrială" },
  { item: "Chirie apartament (propriu)", cost: "€750–€1.100/lună", note: "Orașe mari" },
  { item: "Transport propriu (bicicletă)", cost: "€5–€15/lună",    note: "Cel mai ieftin" },
  { item: "Transport (mașină + benzină)", cost: "€150–€250/lună",  note: "Depinde de distanță" },
];

const PAYSLIP_STEPS = [
  {
    step: "1",
    title: "Verifică salariul brut",
    desc: "Caută 'bruto loon' sau 'uurloon bruto'. La salariul minim 2026 trebuie să fie €14,71/oră.",
  },
  {
    step: "2",
    title: "Găsește deducerile",
    desc: "'Loonheffing' = impozit pe venit. 'Zorgverzekering' = asigurare sănătate. 'Huisvesting' = cazare. Adună-le pe toate.",
  },
  {
    step: "3",
    title: "Calculează salariul net real",
    desc: "Brut − toate deducerile = net real. Compară cu ce ți s-a promis la recrutare.",
  },
  {
    step: "4",
    title: "Verifică orele lucrate",
    desc: "'Gewerkte uren' = ore lucrate. Înmulțit cu tariful orar trebuie să corespundă cu brutto-ul de pe fluturașul de salariu.",
  },
];

const FAQS = [
  {
    q: "Care este salariul minim în Olanda în 2026?",
    a: "Salariul minim în Olanda în 2026 este €14,71/oră brut (pentru vârsta 21+). La 40 de ore pe săptămână, înseamnă €588 brut. După impozite și deduceri, rămâi cu aproximativ €280–€380 net pe săptămână, în funcție de costuri.",
  },
  {
    q: "Cât rămâne net după deducerea cazării în Olanda?",
    a: "La salariul minim (€14,71/oră, 40h/săptămână), după impozit (~€148), cazare (~€120) și transport (~€15), rămân aproximativ €280–€320 net pe săptămână. Suma variază în funcție de agenție și condițiile contractuale.",
  },
  {
    q: "Cât se câștigă în Olanda la depozit sau producție?",
    a: "Majoritatea locurilor de muncă de bază (depozit, producție, ambalare) pornesc de la salariul minim €14,71/oră. Cu experiență sau calificări (stivuitorist, mecanic) poți ajunge la €17–€22/oră. Net, diferența este semnificativă.",
  },
  {
    q: "Trebuie să plătesc impozit în Olanda dacă sunt din România?",
    a: "Da. Dacă lucrezi în Olanda, impozitul se plătește în Olanda indiferent de cetățenie. Ca muncitor temporar prin agenție, impozitul este reținut automat din salariu. Poți aplica pentru 'loonheffingskorting' (reducere fiscală) dacă lucrezi exclusiv în Olanda.",
  },
  {
    q: "Este mai avantajos să-ți găsești singur cazare în loc de cazare prin agenție?",
    a: "Depinde. Cazarea prin agenție costă €90–€170/săptămână și include transport. Chiria proprie în zona industrială costă €350–€500/lună dar ai mai multă libertate. Dacă câștigul brut e similar, cazarea proprie e mai ieftină pe termen lung.",
  },
  {
    q: "Cum citesc fluturașul de salariu olandez?",
    a: "Elementele cheie: 'bruto loon' = salariu brut, 'loonheffing' = impozit, 'netto loon' = salariu net, 'huisvesting' = deducere cazare, 'gewerkte uren' = ore lucrate. Dacă ceva nu se potrivește cu contractul, cere explicații în scris de la agenție.",
  },
];

export default function RoSalariuOlandaPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Pagina principală", url: "https://agencycheck.io/ro" },
    { name: "Salariu Olanda 2026", url: "https://agencycheck.io/ro/salariu-olanda" },
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
          <span className="text-gray-800 font-medium">Salariu Olanda 2026</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-800 rounded-full px-2.5 py-1">
              💶 Date actualizate 2026
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 rounded-full px-2.5 py-1">
              🇳🇱 Olanda
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-3">
            Salariu net Olanda 2026 — cât rămâne după toate deducerile
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
            Salariul minim olandez în 2026 este <strong>€14,71/oră brut</strong>.
            Dar muncitorii migranți plătesc în plus cazare, transport și asigurare.
            Mai jos găsești calculul complet al <strong>salariului net real</strong>.
          </p>
        </div>

        {/* Key numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Salar minim/oră", value: "€14,71", note: "Brut, 2026" },
            { label: "Brut/săptămână", value: "€588", note: "40h × €14,71" },
            { label: "Net estimat",     value: "≈€295", note: "Cu cazare inclusă" },
            { label: "Net fără cazare", value: "≈€415", note: "Cazare proprie" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white border border-gray-200 rounded-2xl px-4 py-3 text-center">
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">{kpi.label}</p>
              <p className="text-xl font-black text-gray-900">{kpi.value}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{kpi.note}</p>
            </div>
          ))}
        </div>

        {/* Salary breakdown table */}
        <section className="mb-10">
          <h2 className="text-lg font-black text-gray-900 mb-1">Calculul salariului net — salariu minim 2026</h2>
          <p className="text-xs text-gray-500 mb-4">Exemplu: 40h/săptămână, cazare prin agenție, fără loonheffingskorting</p>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-black text-gray-700">Element</th>
                  <th className="text-right px-4 py-3 font-black text-gray-700">Sumă</th>
                  <th className="text-right px-4 py-3 font-black text-gray-700 hidden sm:table-cell">Detalii</th>
                </tr>
              </thead>
              <tbody>
                {WML_ROWS.map((row) => (
                  <tr
                    key={row.label}
                    className={`border-b border-gray-100 last:border-0 ${
                      row.highlight ? "bg-green-50" : ""
                    }`}
                  >
                    <td className={`px-4 py-3 ${row.highlight ? "font-black text-green-800" : "text-gray-700"}`}>
                      {row.label}
                    </td>
                    <td className={`px-4 py-3 text-right font-mono font-bold whitespace-nowrap ${
                      row.highlight ? "text-green-700 text-base" : "text-gray-900"
                    }`}>
                      {row.value}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-gray-400 hidden sm:table-cell">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">
            * Estimare orientativă. Suma reală depinde de contractul specific, numărul de ore și condițiile agentiei.
          </p>
          <Link
            href="/tools/real-income-calculator"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 border border-brand-200 rounded-full px-3 py-1.5 hover:bg-brand-50 transition-colors"
          >
            🧮 Calculează pentru oferta ta specifică →
          </Link>
        </section>

        {/* Job comparison table */}
        <section className="mb-10">
          <h2 className="text-lg font-black text-gray-900 mb-1">Salariu net după tipul de muncă</h2>
          <p className="text-xs text-gray-500 mb-4">Include deducerea cazării prin agenție (~€120/săptămână)</p>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-black text-gray-700">Tip de muncă</th>
                  <th className="text-right px-4 py-3 font-black text-gray-700">Brut/oră</th>
                  <th className="text-right px-4 py-3 font-black text-gray-700">Net/săptămână</th>
                  <th className="text-right px-4 py-3 font-black text-gray-700 hidden sm:table-cell">Observație</th>
                </tr>
              </thead>
              <tbody>
                {JOB_TABLE.map((row) => (
                  <tr key={row.role} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800 font-medium">{row.role}</td>
                    <td className="px-4 py-3 text-right font-mono text-gray-900 whitespace-nowrap">{row.wage}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-green-700 whitespace-nowrap">{row.net}</td>
                    <td className="px-4 py-3 text-right text-xs text-gray-400 hidden sm:table-cell">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Without housing */}
        <section className="mb-10">
          <h2 className="text-lg font-black text-gray-900 mb-2">Fără cazare prin agenție — costuri proprii</h2>
          <p className="text-sm text-gray-600 mb-4">
            Dacă îți găsești singur locuința, economisești la deducerile agentiei (~€120/săptămână)
            dar suporți costurile integral. Pe termen lung poate fi mai avantajos.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {WITHOUT_HOUSING.map((item) => (
              <div key={item.item} className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <p className="font-bold text-gray-900 text-sm mb-0.5">{item.item}</p>
                <p className="font-black text-brand-600">{item.cost}</p>
                <p className="text-xs text-gray-500">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Payslip checker */}
        <section className="mb-10">
          <h2 className="text-lg font-black text-gray-900 mb-2">Cum citești fluturașul de salariu olandez (loonstrook)</h2>
          <p className="text-sm text-gray-600 mb-5">
            Primești fluturașul în neerlandeză. Iată ce înseamnă termenii esențiali:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {PAYSLIP_STEPS.map((s) => (
              <div key={s.step} className="bg-white border border-gray-200 rounded-2xl p-4 flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-brand-600 text-white font-black text-sm flex items-center justify-center">
                  {s.step}
                </div>
                <div>
                  <p className="font-black text-gray-900 mb-1">{s.title}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick glossary */}
          <div className="mt-5 bg-gray-50 border border-gray-200 rounded-2xl p-4">
            <p className="text-xs font-black text-gray-700 mb-3 uppercase tracking-wide">Glosar fluturar salariu</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1.5 text-xs">
              {[
                ["Bruto loon",          "Salariu brut"],
                ["Netto loon",          "Salariu net"],
                ["Uurloon",             "Tarif orar"],
                ["Gewerkte uren",       "Ore lucrate"],
                ["Loonheffing",         "Impozit pe venit"],
                ["Zorgverzekering",     "Asigurare sănătate"],
                ["Huisvesting",         "Deducere cazare"],
                ["Reiskosten",          "Transport"],
                ["Vakantiegeld",        "Bani de vacanță (8%)"],
                ["Vakantiedagen",       "Zile de concediu"],
                ["Reservering",         "Rezervare (beneficii)"],
                ["Loonheffingskorting", "Reducere fiscală"],
              ].map(([nl, ro]) => (
                <div key={nl} className="flex gap-1.5">
                  <span className="font-mono text-gray-500 shrink-0">{nl}</span>
                  <span className="text-gray-400">→</span>
                  <span className="text-gray-700">{ro}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Internal links */}
        <section className="mb-10">
          <h2 className="text-lg font-black text-gray-900 mb-4">Mai mult despre munca în Olanda</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              href="/ro/agentii-munca-olanda"
              className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow group"
            >
              <p className="text-2xl mb-2">🏢</p>
              <p className="font-black text-gray-900 group-hover:text-brand-600 mb-1">Agenții muncă Olanda</p>
              <p className="text-xs text-gray-500">Recenzii și comparații top 5 agenții pentru muncitori români</p>
            </Link>
            <Link
              href="/ro/locuri-de-munca-cu-cazare"
              className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow group"
            >
              <p className="text-2xl mb-2">🏠</p>
              <p className="font-black text-gray-900 group-hover:text-brand-600 mb-1">Locuri de muncă cu cazare</p>
              <p className="text-xs text-gray-500">Costul real al cazării prin agenție pe tipuri de locuri de muncă</p>
            </Link>
            <Link
              href="/tools/real-income-calculator"
              className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow group"
            >
              <p className="text-2xl mb-2">🧮</p>
              <p className="font-black text-gray-900 group-hover:text-brand-600 mb-1">Calculator salariu net</p>
              <p className="text-xs text-gray-500">Calculează exact ce rămâne în mână pentru oferta ta</p>
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-5">Întrebări frecvente despre salariul din Olanda</h2>
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
        <div className="bg-gray-900 rounded-2xl px-6 py-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-black text-base mb-1">Verifică agenția înainte să pleci</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Recenzii reale de la muncitori, calculator salariu net, avertismente agenții — gratuit.
            </p>
          </div>
          <Link
            href="/ro"
            className="shrink-0 bg-brand-600 hover:bg-brand-500 text-white font-black text-sm px-5 py-3 rounded-xl transition-colors whitespace-nowrap"
          >
            🔍 Caută agenția ta →
          </Link>
        </div>

      </div>
    </>
  );
}
