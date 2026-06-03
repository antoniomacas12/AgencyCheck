import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemaMarkup";
import { AGENCIES_WITH_HOUSING } from "@/lib/agencyData";
import { VERIFIED_AGENCIES } from "@/data/agencies";

export const metadata: Metadata = {
  title: "Nettoloon Nederland 2026 — Hoeveel Verdien Je Écht als Uitzendkracht",
  description:
    "Hoeveel nettoloon krijg je als uitzendkracht in Nederland? WML €14,06/uur. Reëel overzicht na belasting, huisvesting, zorgverzekering en vervoer. Per functie: magazijn, productie, serre, reach truck.",
  alternates: {
    canonical: "https://agencycheck.io/nl/nettoloon-nederland",
    languages: {
      "en":        "https://agencycheck.io/real-salary-netherlands-agency-work",
      "nl":        "https://agencycheck.io/nl/nettoloon-nederland",
      "pl":        "https://agencycheck.io/pl/zarobki-holandia",
      "ro":        "https://agencycheck.io/ro/salariu-olanda",
      "x-default": "https://agencycheck.io/real-salary-netherlands-agency-work",
    },
  },
  openGraph: {
    title: "Nettoloon Nederland 2026 — Echt Verdienen als Uitzendkracht",
    description:
      "Bruto vs netto in Nederland. Wat blijft er over na huisvesting, belasting en vervoer? Bekijk het vóór vertrek.",
    locale: "nl_NL",
  },
};

export const dynamic = "force-static";

const BREAKDOWN_ROWS = [
  { label: "Bruto weekloon (WML €14,06 × 40u)",              amount: "+€562", color: "text-green-700",  bg: "bg-green-50"  },
  { label: "Loonheffing (~10% na heffingskorting)",          amount: "−€58",  color: "text-red-600",   bg: "bg-red-50"    },
  { label: "Huisvesting uitzendbureau (SNF-norm)",           amount: "−€95",  color: "text-red-600",   bg: "bg-red-50"    },
  { label: "Zorgverzekering",                                 amount: "−€35",  color: "text-red-600",   bg: "bg-red-50"    },
  { label: "Vervoer (bus uitzendbureau)",                    amount: "−€25",  color: "text-red-600",   bg: "bg-red-50"    },
  { label: "Administratiekosten",                            amount: "−€25",  color: "text-red-600",   bg: "bg-red-50"    },
  { label: "💶 Jouw nettoloon per week",                     amount: "€324",  color: "text-green-800", bg: "bg-green-100" },
];

const JOB_COMPARISON = [
  { job: "Magazijnmedewerker",      rate: "€14,06",         gross_weekly: "€562", net_weekly: "~€320–€345", housing: "Meestal beschikbaar" },
  { job: "Productiemedewerker",     rate: "€14,06–€15,50",  gross_weekly: "€562–€620", net_weekly: "~€330–€370", housing: "Meestal beschikbaar" },
  { job: "Serrewerker",             rate: "€14,06",         gross_weekly: "€562", net_weekly: "~€315–€340", housing: "Seizoensgebonden" },
  { job: "Reach truck chauffeur",   rate: "€15,50–€17,00",  gross_weekly: "€620–€680", net_weekly: "~€370–€415", housing: "Minder beschikbaar" },
  { job: "Heftruck operator",       rate: "€16,00–€18,00",  gross_weekly: "€640–€720", net_weekly: "~€380–€435", housing: "Zelden" },
];

const FAQS = [
  {
    q: "Wat is het minimumloon in Nederland in 2026?",
    a: "Het wettelijk minimumloon (WML) in 2026 is €14,06 bruto per uur bij 40 uur per week. Dat is €562 bruto per week. Na belasting en inhoudingen houd je ongeveer €320–€360 netto per week over.",
  },
  {
    q: "Mag een uitzendbureau huisvesting inhouden op mijn loon?",
    a: "Ja, maar alleen als dit in het contract staat en conform SNF-normen (Stichting Normering Flexwonen). Het maximum is circa €105–€115 per week afhankelijk van het niveau. Controleer het contract vóór ondertekening.",
  },
  {
    q: "Hoeveel hou ik per maand over bij uitzendwerk in Nederland?",
    a: "Bij WML en 40u/week: circa €1.290–€1.460 netto per maand na alle inhoudingen. Dit gaat uit van huisvesting ~€95, verzekering ~€35 en vervoer ~€25 per week. Zonder huisvesting via het uitzendbureau kun je circa €1.580–€1.720 netto per maand verdienen.",
  },
  {
    q: "Wat is loonheffing?",
    a: "Loonheffing is de Nederlandse loonbelasting die direct door de werkgever wordt ingehouden. Bij WML en met heffingskortingen bedraagt dit effectief 8–12% van het bruto loon. Je kunt teveel betaalde belasting terugkrijgen via de jaarlijkse aangifte inkomstenbelasting.",
  },
  {
    q: "Hoe controleer ik of mijn loon correct is?",
    a: "Vraag om een gedetailleerde loonstrook. Elke inhouding moet apart vermeld staan — geen vage 'administratiekosten'. Controleer via mijnloon.nl of neem contact op met de FNV (fnv.nl) als er iets niet klopt.",
  },
];

export default function NettoloonNederland() {
  const crumbSchema = breadcrumbSchema([
    { name: "Home",              url: "/" },
    { name: "Nederlands",        url: "/nl" },
    { name: "Nettoloon Nederland", url: "/nl/nettoloon-nederland" },
  ]);
  const faqSchema = faqPageSchema(FAQS.map((f) => ({ question: f.q, answer: f.a })));

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <div className="bg-surface-hero text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-gray-500 mb-5 flex items-center gap-1.5 flex-wrap">
            <Link href="/nl" className="hover:text-gray-300">AgencyCheck NL</Link>
            <span>/</span>
            <span className="text-gray-400">Nettoloon Nederland</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            Hoeveel Verdien Je Écht<br className="hidden sm:block" /> in Nederland? — 2026
          </h1>
          <p className="text-gray-300 text-base leading-relaxed max-w-2xl mb-6">
            Vacatures adverteren €14,06–€17/uur. Maar dat is bruto, vóór alle inhoudingen.
            Hieronder vind je de reële verdeling — wat er daadwerkelijk op je rekening terechtkomt.
          </p>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-4 py-2 text-emerald-300 text-sm font-bold">
            💶 Reëel nettoloon: ~€320–€360/week bij WML
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-14">

        {/* Breakdown */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Loonsplitsing — Wat Blijft Over</h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Voorbeeld: magazijn of productie, 40 uur per week, huisvesting via uitzendbureau, WML 2026.
          </p>
          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            {BREAKDOWN_ROWS.map((row, i) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-5 py-3.5 ${
                  i < BREAKDOWN_ROWS.length - 1 ? "border-b border-gray-50" : `${row.bg} border-t border-green-200`
                } ${i === BREAKDOWN_ROWS.length - 1 ? "py-4" : ""}`}
              >
                <span className={`text-sm ${i === BREAKDOWN_ROWS.length - 1 ? "font-black text-gray-900" : "text-gray-700"}`}>
                  {row.label}
                </span>
                <span className={`text-sm font-black tabular-nums ${row.color}`}>
                  {row.amount}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            * Indicatieve bedragen voor 2026. Vervoer en administratie verschillen per uitzendbureau.
            SNF-huisvesting kan €88–€115 per week zijn afhankelijk van het niveau.
          </p>
        </section>

        {/* Zonder huisvesting */}
        <section className="rounded-2xl border border-blue-100 bg-blue-50/30 p-6">
          <h2 className="text-lg font-black text-gray-900 mb-3">En zonder huisvesting via het uitzendbureau?</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Heb je eigen woonruimte of huur je privé, dan stijgt je netto weekloon met ~€95 naar
            ongeveer <strong className="text-gray-900"> €415–€440/week</strong> (€1.660–€1.760 per maand).
            Privéwoonruimte in Nederland is moeilijk te vinden — zeker buiten grote steden —
            maar kan op de lange termijn voordeliger zijn.
          </p>
          <Link
            href="/nl/werk-met-huisvesting"
            className="text-sm font-bold text-blue-700 hover:text-blue-800"
          >
            Vergelijk uitzendbureaus met huisvesting →
          </Link>
        </section>

        {/* Per functie */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-5">Nettoloon per Functie</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Functie</th>
                  <th className="text-right px-4 py-3 font-semibold">Tarief/uur</th>
                  <th className="text-right px-4 py-3 font-semibold">Bruto/week</th>
                  <th className="text-right px-4 py-3 font-semibold">Netto/week</th>
                  <th className="text-right px-4 py-3 font-semibold">Huisvesting</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {JOB_COMPARISON.map((row) => (
                  <tr key={row.job} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{row.job}</td>
                    <td className="px-4 py-3 text-right text-gray-700 tabular-nums">{row.rate}</td>
                    <td className="px-4 py-3 text-right text-gray-700 tabular-nums">{row.gross_weekly}</td>
                    <td className="px-4 py-3 text-right font-bold text-green-700 tabular-nums">{row.net_weekly}</td>
                    <td className="px-4 py-3 text-right text-gray-500 text-xs">{row.housing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2.5">
            Nettobedragen gaan uit van huisvesting via uitzendbureau. Hogere tarieven (reach truck,
            heftruck) vereisen geldige certificaten.
          </p>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-4">Hoe Controleer Je of Je Loon Correct Is</h2>
          <div className="space-y-3">
            {[
              {
                step: "1",
                title: "Vraag om een loonstrook",
                text: "Elk uitzendbureau is verplicht een gedetailleerde loonstrook te verstrekken. Elke inhouding moet apart worden vermeld — geen vage 'overige kosten'.",
              },
              {
                step: "2",
                title: "Controleer het basistarief",
                text: "Je uurloon mag niet lager zijn dan WML: €14,06 bruto/uur (2026). Lager is illegaal.",
              },
              {
                step: "3",
                title: "Controleer de huisvestingsinhouding",
                text: "Het SNF-maximum voor huisvesting is circa €105–€115 per week. Inhoudt het bureau meer? Dan kun je een klacht indienen bij de SNCU.",
              },
              {
                step: "4",
                title: "Doe aangifte inkomstenbelasting",
                text: "Veel uitzendkrachten betalen te veel belasting. Na afloop van het belastingjaar kun je aangifte doen — je kunt honderden euro's terugkrijgen.",
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4 rounded-xl border border-gray-100 p-4">
                <div className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-black flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-0.5">{item.title}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bureaus vergelijken op loontransparantie ──────────────────── */}
        <section className="rounded-2xl border border-gray-100 bg-gray-50/40 p-5 sm:p-6">
          <h2 className="text-xl font-black text-gray-900 mb-2">
            Vergelijk Bureaus op Loontransparantie
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Het nettoloon dat je ontvangt hangt direct af van hoe transparant het bureau is over
            inhoudingen. AgencyCheck heeft {VERIFIED_AGENCIES.length} bureaus beoordeeld —
            bureaus met een hogere transparantiescore tonen alle inhoudingen vooraf en houden
            zich aantoonbaar aan de SNF-normen.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              ...AGENCIES_WITH_HOUSING.sort((a, b) => b.score - a.score).slice(0, 2),
              ...VERIFIED_AGENCIES
                .filter(a => a.accommodation === "not_provided")
                .sort((a, b) => b.transparencyScore - a.transparencyScore)
                .slice(0, 2),
            ].map((agency) => {
              const score = "score" in agency ? (agency as any).score : (agency as any).transparencyScore;
              const hasHousing = "accommodation" in agency &&
                ((agency as any).accommodation === "confirmed_with_deduction" ||
                 (agency as any).accommodation === "confirmed_no_deduction");
              return (
                <Link
                  key={agency.slug}
                  href={`/agencies/${agency.slug}`}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 hover:border-emerald-300 hover:shadow-sm transition-all"
                >
                  <div>
                    <p className="text-sm font-bold text-gray-900">{agency.name}</p>
                    <p className="text-xs text-gray-400">
                      {hasHousing ? "🏠 Met huisvesting" : "Zonder huisvesting"}
                    </p>
                  </div>
                  <span className={`text-xs font-black px-2 py-1 rounded-lg ${
                    score >= 80 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {score}/100
                  </span>
                </Link>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            <Link href="/agencies" className="underline hover:text-gray-600">
              Alle {VERIFIED_AGENCIES.length} geverifieerde bureaus vergelijken →
            </Link>
          </p>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-5">Veelgestelde Vragen over Loon in Nederland</h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="border border-gray-100 rounded-xl p-5">
                <p className="text-sm font-bold text-gray-900 mb-2">{faq.q}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Interne links */}
        <div className="border-t border-gray-100 pt-8 grid sm:grid-cols-3 gap-3">
          {[
            { href: "/nl/uitzendbureaus-nederland", label: "Uitzendbureaus vergelijken", icon: "🏢" },
            { href: "/nl/werk-met-huisvesting",     label: "Werk met huisvesting",       icon: "🏠" },
            { href: "/nl",                           label: "AgencyCheck NL",             icon: "🇳🇱" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50 hover:border-gray-300 hover:bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-all"
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
