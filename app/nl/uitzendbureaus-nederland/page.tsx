import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemaMarkup";
import { AGENCIES_WITH_HOUSING, type AgencyCardData } from "@/lib/agencyData";
import { VERIFIED_AGENCIES } from "@/data/agencies";

export const metadata: Metadata = {
  title: "Uitzendbureaus Nederland 2026 — Beoordeeld & Geverifieerd door Werknemers",
  description:
    "Vergelijk 127 uitzendbureaus in Nederland op transparantiescore, SNF-gecertificeerde huisvesting en werknemerservaringen. Onafhankelijke verificatie. Geen advertenties. Directe sollicitatie via WhatsApp.",
  alternates: {
    canonical: "https://agencycheck.io/nl/uitzendbureaus-nederland",
    languages: {
      "en":        "https://agencycheck.io/agencies",
      "nl":        "https://agencycheck.io/nl/uitzendbureaus-nederland",
      "pl":        "https://agencycheck.io/pl/agencje-pracy-holandia",
      "ro":        "https://agencycheck.io/ro/agentii-munca-olanda",
      "x-default": "https://agencycheck.io/agencies",
    },
  },
  openGraph: {
    title: "Uitzendbureaus Nederland — Geverifieerd door AgencyCheck 2026",
    description:
      "127 uitzendbureaus onafhankelijk beoordeeld. Transparantiescore, SNF-huisvesting, werknemerservaringen. Geen betaalde vermeldingen.",
    locale: "nl_NL",
  },
};

export const dynamic = "force-static";

// ─── Dutch job focus labels ────────────────────────────────────────────────────
const JOB_FOCUS_NL: Record<string, string> = {
  "warehouse-worker":      "Magazijn",
  "order-picker":          "Order picker",
  "forklift-driver":       "Heftruck",
  "production-worker":     "Productie",
  "logistics-operator":    "Logistiek",
  "office-admin":          "Administratie",
  "technical-worker":      "Technisch",
  "customer-service":      "Klantenservice",
  "greenhouse-worker":     "Serre",
  "truck-driver":          "Chauffeur",
  "general-temporary-roles": "Algemeen",
  "industrial-production-worker": "Industriële productie",
};

function jobFocusToNL(focuses: string[]): string {
  return focuses
    .slice(0, 3)
    .map((f) => JOB_FOCUS_NL[f] ?? f)
    .join(", ");
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (score >= 65) return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-red-700 bg-red-50 border-red-200";
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Hoog";
  if (score >= 65) return "Gemiddeld";
  return "Laag";
}

// Top housing agencies sorted by transparency score
const TOP_HOUSING = AGENCIES_WITH_HOUSING
  .sort((a, b) => b.score - a.score)
  .slice(0, 12);

// Top non-housing agencies sorted by score
const TOP_GENERAL = VERIFIED_AGENCIES
  .filter((a) => a.accommodation === "not_provided" || a.accommodation === "unknown")
  .sort((a, b) => b.transparencyScore - a.transparencyScore)
  .slice(0, 6);

const totalAgencies = VERIFIED_AGENCIES.length;
const housingCount  = AGENCIES_WITH_HOUSING.length;

const WHAT_TO_CHECK = [
  {
    title: "Transparantiescore",
    icon: "📊",
    body: "AgencyCheck beoordeelt elk bureau op 5 factoren: loonopenbaarheid, SNF-certificering, ABU/NBBU-lidmaatschap, klachtenregistratie en werknemerservaringen. Score van 0–100. Boven 75 = betrouwbaar.",
  },
  {
    title: "SNF-gecertificeerde huisvesting",
    icon: "🏠",
    body: "SNF (Stichting Normering Flexwonen) is de Nederlandse norm voor flexwerkers-huisvesting. Gecertificeerde bureaus voldoen aan minimumeisen voor ruimte, hygiëne en veiligheid. Maximum inhouding €113,50/week.",
  },
  {
    title: "ABU of NBBU lidmaatschap",
    icon: "📋",
    body: "Bureaus met ABU of NBBU keurmerk zijn gebonden aan cao's die jouw rechten regelen: minimumloon, vakantiegeld, overurentoeslag en inlenersbeloning na 26 weken.",
  },
  {
    title: "ET-regeling",
    icon: "💡",
    body: "Vraag of het bureau de ET-regeling toepast voor werknemers die > 150 km van de grens wonen. Dit kan €50–€150/week belastingvrij extra opleveren. Niet alle bureaus doen dit automatisch.",
  },
];

const FAQS = [
  {
    q: "Hoe kies ik het beste uitzendbureau in Nederland?",
    a: "Let op transparantiescore (boven 75 is betrouwbaar), SNF-gecertificeerde huisvesting als je dat nodig hebt, ABU/NBBU-lidmaatschap, en of de ET-regeling wordt toegepast. Lees echte werknemerservaringen — niet alleen de advertenties van het bureau zelf.",
  },
  {
    q: "Wat is het verschil tussen ABU en NBBU bureaus?",
    a: "De ABU vertegenwoordigt grotere uitzendbureaus (Otto Workforce, Randstad, Tempo-Team), de NBBU kleinere. Beide hanteren een cao die je rechten regelt: minimumloon, vakantiegeld, overurentoeslag en inlenersbeloning. Praktisch gezien zijn de verschillen voor de werknemer klein.",
  },
  {
    q: "Welke uitzendbureaus bieden SNF-gecertificeerde huisvesting?",
    a: `AgencyCheck heeft ${housingCount} uitzendbureaus geverifieerd die huisvesting aanbieden voor werknemers. De meest bekende zijn Otto Workforce, Covebo, en Transflex. Controleer altijd of het bureau daadwerkelijk op de SNF-gecertificeerde lijst staat via snf.nl voordat je tekent.`,
  },
  {
    q: "Mag een uitzendbureau kosten in rekening brengen voor bemiddeling?",
    a: "Nee. Dit is volledig verboden op grond van de WAADI-wijziging 2024. Uitzendbureaus mogen geen bemiddelings-, wervings- of registratiekosten aan werknemers doorberekenen. Als een bureau dit toch vraagt, is dat illegaal — meld het bij de Inspectie SZW.",
  },
  {
    q: "Hoe controleer ik of een uitzendbureau legitiem is?",
    a: "Controleer: (1) inschrijving Kamer van Koophandel (kvk.nl), (2) ABU of NBBU lidmaatschap, (3) SNA-certificering (Stichting Normering Arbeid), (4) SNF-certificering als huisvesting wordt aangeboden. Bureaus zonder deze certificeringen dragen een hoger risico.",
  },
];

export default function UitzendbureausNederlandPage() {
  const crumbSchema = breadcrumbSchema([
    { name: "Home",                     url: "/" },
    { name: "Nederlands",               url: "/nl" },
    { name: "Uitzendbureaus Nederland", url: "/nl/uitzendbureaus-nederland" },
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
            <span className="text-gray-400">Uitzendbureaus Nederland</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            Uitzendbureaus Nederland<br className="hidden sm:block" /> — Onafhankelijk Geverifieerd
          </h1>
          <p className="text-gray-300 text-base leading-relaxed max-w-2xl mb-6">
            AgencyCheck heeft <strong className="text-white">{totalAgencies} uitzendbureaus</strong> onafhankelijk beoordeeld op
            loonopenbaarheid, SNF-huisvesting, ABU/NBBU-lidmaatschap en werknemerservaringen.
            Geen betaalde vermeldingen. Geen bureaumarketing. Alleen geverifieerde feiten.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-4 py-2 text-emerald-300 text-sm font-bold">
              ✅ {totalAgencies} bureaus geverifieerd
            </div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-xl px-4 py-2 text-blue-300 text-sm font-bold">
              🏠 {housingCount} met SNF-huisvesting
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-16">

        {/* ── Hoe we verifiëren ─────────────────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Hoe AgencyCheck Uitzendbureaus Beoordeelt</h2>
          <p className="text-sm text-gray-500 mb-6">
            Elke score is gebaseerd op openbare data, niet op betalingen van bureaus.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {WHAT_TO_CHECK.map((item) => (
              <div key={item.title} className="rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-black text-gray-900 text-sm">{item.title}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bureaus met SNF-huisvesting ───────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <h2 className="text-2xl font-black text-gray-900">
              Uitzendbureaus met SNF-huisvesting — Geverifieerd
            </h2>
            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full font-bold">
              {housingCount} bureaus
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Gesorteerd op transparantiescore. Alle bureaus hieronder zijn onafhankelijk geverifieerd
            op SNF-certificering en loonopenbaarheid door AgencyCheck.
          </p>

          <div className="space-y-3">
            {TOP_HOUSING.map((agency) => (
              <div
                key={agency.slug}
                className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 hover:border-emerald-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Link
                        href={`/agencies/${agency.slug}`}
                        className="font-black text-gray-900 text-base hover:text-emerald-700 transition-colors"
                      >
                        {agency.name}
                      </Link>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${scoreColor(agency.score)}`}>
                        {agency.score}/100 — {scoreLabel(agency.score)}
                      </span>
                      <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                        🏠 SNF-huisvesting
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      <strong>Functies:</strong>{" "}
                      {jobFocusToNL(agency.jobTitles ?? [])}
                      {agency.cities && agency.cities.length > 0 && (
                        <>
                          {" "}· <strong>Steden:</strong>{" "}
                          {agency.cities
                            .slice(0, 4)
                            .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
                            .join(", ")}
                          {agency.cities.length > 4 && ` +${agency.cities.length - 4}`}
                        </>
                      )}
                    </p>
                    {/* Transparantie score balk */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden max-w-[120px]">
                        <div
                          className={`h-full rounded-full ${agency.score >= 80 ? "bg-emerald-500" : agency.score >= 65 ? "bg-amber-400" : "bg-red-400"}`}
                          style={{ width: `${agency.score}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-gray-400">Transparantiescore</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/agencies/${agency.slug}`}
                      className="text-xs font-bold text-brand-600 hover:text-brand-800 hover:underline"
                    >
                      Reviews →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/best-agencies-with-housing-netherlands"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              Bekijk alle {housingCount} bureaus met huisvesting →
            </Link>
          </div>
        </section>

        {/* ── Bureaus zonder huisvesting ────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-2">Grote Bureaus Zonder Huisvesting</h2>
          <p className="text-sm text-gray-500 mb-5">
            Voor kandidaten met eigen woonruimte of die zelf huren. Hogere nettoloon
            maar huisvesting moet je zelf regelen.
          </p>
          <div className="space-y-3">
            {TOP_GENERAL.map((agency) => (
              <div
                key={agency.slug}
                className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 hover:border-gray-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Link
                        href={`/agencies/${agency.slug}`}
                        className="font-black text-gray-900 text-base hover:text-emerald-700 transition-colors"
                      >
                        {agency.name}
                      </Link>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${scoreColor(agency.transparencyScore)}`}>
                        {agency.transparencyScore}/100
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      <strong>Functies:</strong>{" "}
                      {agency.jobFocus.slice(0, 3).map((f) => JOB_FOCUS_NL[f] ?? f).join(", ")}
                      {" "}· <strong>Stad:</strong> {agency.city}
                    </p>
                  </div>
                  <Link
                    href={`/agencies/${agency.slug}`}
                    className="text-xs font-bold text-brand-600 hover:text-brand-800 hover:underline shrink-0"
                  >
                    Reviews →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/agencies"
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 hover:underline"
            >
              Alle {totalAgencies} geverifieerde bureaus bekijken →
            </Link>
          </div>
        </section>

        {/* ── Waarschuwingen ────────────────────────────────────────────────── */}
        <section className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">⚠️ Waarschuwingssignalen</h2>
          <div className="space-y-2">
            {[
              "Bureau vraagt kosten voor bemiddeling, werving of registratie — ILLEGAAL (WAADI 2024)",
              "Huisvesting is verplichte voorwaarde voor de baan — ILLEGAAL",
              "Inhouding boven €113,50/week voor huisvesting — BOVEN SNF-MAXIMUM",
              "Bureau staat niet op de SNF-gecertificeerde lijst (snf.nl)",
              "Geen schriftelijk overzicht van inhoudingen vóór ondertekening",
              "Uurloon onder €14,06 bruto (WML 2026) — ILLEGAAL",
            ].map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-red-800">
                <span className="text-red-500 font-bold shrink-0">✗</span>
                <span>{w}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Direct solliciteren ───────────────────────────────────────────── */}
        <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 md:p-8 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">
            Gratis solliciteren
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Klaar om te solliciteren?
          </h2>
          <p className="text-gray-600 text-sm mb-5 max-w-lg mx-auto">
            Bekijk alle openstaande vacatures bij geverifieerde bureaus. Directe sollicitatie
            via WhatsApp — geen CV-portaal, geen wachttijden. Respons dezelfde dag.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/vacancies"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Bekijk alle vacatures →
            </Link>
            <Link
              href="/best-agencies-with-housing-netherlands"
              className="inline-block bg-white hover:bg-gray-50 text-gray-800 font-bold px-6 py-3 rounded-xl border border-gray-200 transition-colors"
            >
              Bureaus met huisvesting →
            </Link>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-5">Veelgestelde Vragen over Uitzendbureaus</h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="border border-gray-100 rounded-xl p-5">
                <p className="text-sm font-bold text-gray-900 mb-2">{faq.q}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-gray-100 pt-8 grid sm:grid-cols-3 gap-3">
          {[
            { href: "/nl/minimumloon-nederland-2026", label: "Minimumloon 2026",      icon: "📋" },
            { href: "/nl/werk-met-huisvesting",       label: "Werk met huisvesting",  icon: "🏠" },
            { href: "/nl/nettoloon-nederland",         label: "Nettoloon berekenen",   icon: "💶" },
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
