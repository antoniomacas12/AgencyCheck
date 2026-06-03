import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Werk met Huisvesting Nederland 2026 — Uitzendbureaus met Woning Inbegrepen",
  description:
    "Vind uitzendbureaus in Nederland die huisvesting aanbieden. SNF-gecertificeerde woningen, maximale inhoudingen, rechten als uitzendkracht. Magazijn, productie, serre en logistiek.",
  alternates: {
    canonical: "https://agencycheck.io/nl/werk-met-huisvesting",
    languages: {
      "en":        "https://agencycheck.io/jobs-with-accommodation",
      "nl":        "https://agencycheck.io/nl/werk-met-huisvesting",
      "pl":        "https://agencycheck.io/pl/praca-z-zakwaterowaniem",
      "ro":        "https://agencycheck.io/ro/locuri-de-munca-cu-cazare",
      "x-default": "https://agencycheck.io/jobs-with-accommodation",
    },
  },
  openGraph: {
    title: "Werk met Huisvesting Nederland — Uitzendbureaus 2026",
    description:
      "Uitzendbureaus die woonruimte regelen voor uitzendkrachten. SNF-normen, maximale inhoudingen en waar je op moet letten.",
    locale: "nl_NL",
  },
};

export const dynamic = "force-static";

const SNF_LEVELS = [
  {
    level: "SNF Basis",
    max: "€88–€95/week",
    desc: "Gedeelde slaapkamers (4–6 personen), gedeelde badkamer en keuken. Meest voorkomend bij kortlopende projecten en seizoenswerk.",
    icon: "🏠",
  },
  {
    level: "SNF Comfort",
    max: "€100–€113/week",
    desc: "Kleinere slaapkamers (2–4 personen) of eigen kamer, betere voorzieningen. Hogere inhouding maar meer privacy.",
    icon: "🏡",
  },
  {
    level: "Privéwoning / Eigen huur",
    max: "Geen inhouding",
    desc: "Je huurt zelf privé. Geen huisvestingsinhouding door het uitzendbureau — maar huisvesting is moeilijk te vinden en duur in NL.",
    icon: "🔑",
  },
];

const RIGHTS = [
  {
    title: "Maximale inhouding SNF 2026",
    body: "Het uitzendbureau mag maximaal €113,50 per week inhouden voor SNF-gecertificeerde huisvesting. Dit maximum geldt ongeacht of je volledig of deeltijd werkt die week.",
  },
  {
    title: "Huisvesting mag niet verplicht zijn",
    body: "Je mag nooit verplicht worden om huisvesting van het uitzendbureau te accepteren als voorwaarde voor de baan. Als je eigen woonruimte hebt, mag het bureau niets inhouden.",
  },
  {
    title: "SNF-certificering controleren",
    body: "Alle legale uitzendbureaus met huisvesting moeten SNF-gecertificeerd zijn. Controleer of het bureau op de SNF-lijst staat via snf.nl. Niet-gecertificeerde huisvesting is een waarschuwingssignaal.",
  },
  {
    title: "Inhouding stopt bij ontslag",
    body: "Als de arbeidsovereenkomst eindigt, stopt ook de huisvestingsinhouding. Je hebt het recht om minimaal de opzegtermijn in de woning te blijven (check je contract).",
  },
  {
    title: "Geen verborgen kosten",
    body: "Beddenlinnen, sleuteldeposito of schoonmaakkosten mogen niet extra worden doorberekend bovenop de weekinhouding, tenzij dit expliciet in het contract staat vermeld.",
  },
];

const FAQS = [
  {
    q: "Hoeveel mag een uitzendbureau inhouden voor huisvesting in Nederland?",
    a: "Het maximum is €113,50 per week (SNF-norm 2026) voor gecertificeerde huisvesting. Deze inhouding is alleen toegestaan als je daadwerkelijk in de huisvesting van het bureau woont en dit schriftelijk is vastgelegd. Meer inhouden is illegaal.",
  },
  {
    q: "Wat is SNF-certificering en waarom is het belangrijk?",
    a: "SNF (Stichting Normering Flexwonen) is de Nederlandse norm voor huisvesting van flexwerkers. Gecertificeerde woningen voldoen aan minimumeisen voor ruimte, hygiëne en veiligheid. Controleer altijd of je uitzendbureau op snf.nl staat vermeld. Niet-gecertificeerde huisvesting biedt je geen wettelijke bescherming.",
  },
  {
    q: "Kan ik verplicht worden om huisvesting van het bureau te nemen?",
    a: "Nee. Huisvesting mag nooit een verplichte voorwaarde zijn voor de baan. Je hebt het recht om eigen woonruimte te zoeken. In de praktijk is eigen woonruimte in Nederland erg moeilijk te vinden, maar je kunt nooit gedwongen worden.",
  },
  {
    q: "Wat is het verschil tussen SNF-basis en SNF-comfort?",
    a: "SNF-basis (€88–€95/week) biedt gedeelde slaapkamers met 4–6 personen en gedeelde voorzieningen. SNF-comfort (€100–€113/week) heeft kleinere slaapkamers of eigen kamer met betere badkamer- en keukenvoorzieningen. Beide zijn wettelijk gecertificeerd, maar het comfortniveau verschilt aanzienlijk.",
  },
  {
    q: "Wat gebeurt er met mijn huisvesting als ik ontslag neem of word ontslagen?",
    a: "De huisvestingsinhouding stopt zodra de arbeidsovereenkomst eindigt. Je hebt recht op een redelijke opzegtermijn in de woning — check je contract voor de exacte termijn. Zorg dat je een nieuw adres hebt geregeld vóór vertrek, want je BSN-registratie is gekoppeld aan het adres.",
  },
];

export default function WerkMetHuisvestingPage() {
  const crumbSchema = breadcrumbSchema([
    { name: "Home",                 url: "/" },
    { name: "Nederlands",           url: "/nl" },
    { name: "Werk met huisvesting", url: "/nl/werk-met-huisvesting" },
  ]);
  const faqSchema = faqPageSchema(FAQS.map((f) => ({ question: f.q, answer: f.a })));

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="bg-surface-hero text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-gray-500 mb-5 flex items-center gap-1.5 flex-wrap">
            <Link href="/nl" className="hover:text-gray-300">AgencyCheck NL</Link>
            <span>/</span>
            <span className="text-gray-400">Werk met huisvesting</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            Werk met Huisvesting<br className="hidden sm:block" /> in Nederland 2026
          </h1>
          <p className="text-gray-300 text-base leading-relaxed max-w-2xl mb-6">
            Veel uitzendbureaus in Nederland bieden woonruimte aan als onderdeel van het pakket.
            Hier lees je wat SNF-certificering betekent, wat het bureau maximaal mag inhouden en
            waar je op moet letten vóór ondertekening.
          </p>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-4 py-2 text-emerald-300 text-sm font-bold">
            🏠 Maximum inhouding: €113,50/week (SNF 2026)
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-14">

        {/* SNF niveaus */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Types Huisvesting</h2>
          <p className="text-sm text-gray-500 mb-6">
            Er zijn twee SNF-niveaus plus de optie om privé te huren.
          </p>
          <div className="space-y-4">
            {SNF_LEVELS.map((s) => (
              <div key={s.level} className="rounded-2xl border border-gray-100 p-5 flex gap-4">
                <span className="text-3xl shrink-0">{s.icon}</span>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-black text-gray-900 text-base">{s.level}</span>
                    <span className="text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                      {s.max}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rechten */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-5">Jouw Rechten bij Huisvesting</h2>
          <div className="space-y-3">
            {RIGHTS.map((r, i) => (
              <div key={i} className="rounded-xl border border-gray-100 p-4 flex gap-3">
                <span className="text-emerald-500 font-black text-lg shrink-0">✓</span>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-1">{r.title}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{r.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Waarschuwingen */}
        <section className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">⚠️ Waarschuwingssignalen</h2>
          <div className="space-y-2">
            {[
              "Bureau vraagt je om huisvesting te accepteren als voorwaarde voor de baan",
              "Inhouding is hoger dan €113,50 per week",
              "Bureau staat niet op de SNF-gecertificeerde lijst (snf.nl)",
              "Geen schriftelijke huisvestingsovereenkomst",
              "Extra kosten voor beddenlinnen, sleutels of schoonmaak",
              "Huisvesting wordt doorbelast ook als je er geen gebruik van maakt",
            ].map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-red-800">
                <span className="text-red-500 font-bold shrink-0">✗</span>
                <span>{w}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 md:p-8 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Geverifieerde uitzendbureaus</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Vind uitzendbureaus met SNF-gecertificeerde huisvesting
          </h2>
          <p className="text-gray-600 text-sm mb-5 max-w-lg mx-auto">
            Alle uitzendbureaus op AgencyCheck zijn gecontroleerd op huisvestingsnormen,
            inhoudingstransparantie en werknemerservaringen.
          </p>
          <Link
            href="/best-agencies-with-housing-netherlands"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Bekijk uitzendbureaus met huisvesting →
          </Link>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-5">Veelgestelde Vragen</h2>
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
            { href: "/nl/nettoloon-nederland",       label: "Nettoloon berekenen",    icon: "💶" },
            { href: "/nl/minimumloon-nederland-2026", label: "Minimumloon 2026",       icon: "📋" },
            { href: "/nl",                            label: "AgencyCheck NL",         icon: "🇳🇱" },
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
