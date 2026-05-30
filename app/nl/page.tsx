import type { Metadata } from "next";
import Link from "next/link";
import nDynamic from "next/dynamic";
import ApplyBar from "@/components/ApplyBar";
import { AGENCIES_WITH_HOUSING } from "@/lib/agencyData";
import { getPublishedReviewStats } from "@/lib/reviewStats";
import { VACANCIES } from "@/lib/vacanciesData";

const HomepageStickyBar = nDynamic(() => import("@/components/HomepageStickyBar"), { ssr: false });

const BASE = "https://agencycheck.io";

export const metadata: Metadata = {
  title: "Uitzendbureaus Nederland — Werknemersreviews, Salaris & Huisvesting 2026",
  description:
    "Vergelijk 150+ uitzendbureaus in Nederland. Reëel nettoloon na aftrek van huisvesting, belasting en transport. Reviews van werknemers, woonomstandigheden en ranglijsten. Controleer hier voordat je tekent.",
  alternates: {
    canonical: `${BASE}/nl`,
    languages: {
      "en":        `${BASE}/`,
      "nl":        `${BASE}/nl`,
      "pl":        `${BASE}/pl`,
      "ro":        `${BASE}/ro`,
      "x-default": `${BASE}/`,
    },
  },
  openGraph: {
    title: "Uitzendbureaus Nederland — Reviews, Salaris & Huisvesting 2026",
    description:
      "Reëele salarisopsplitsingen, woonfoto's en werknemersreviews voor 150+ uitzendbureaus in Nederland. Weet de waarheid voordat je tekent.",
    locale: "nl_NL",
    url: `${BASE}/nl`,
    type: "website",
  },
};

export const dynamic = "force-dynamic";

// ─── Salary breakdown rows ────────────────────────────────────────────────────
const SALARY_ROWS = [
  { label: "Bruto loon (WML €14,71 × 40u)",          amount: "+€588", green: true,  bold: false },
  { label: "Belasting & premies (loonheffing)",        amount: "−€63",  green: false, bold: false },
  { label: "Bureauhuisvesting (SNF-norm)",             amount: "−€95",  green: false, bold: false },
  { label: "Zorgverzekering",                          amount: "−€35",  green: false, bold: false },
  { label: "Transport (bureusbus)",                    amount: "−€25",  green: false, bold: false },
  { label: "Administratiekosten",                     amount: "−€25",  green: false, bold: false },
  { label: "💶 Jij houdt over",                       amount: "€345",  green: true,  bold: true  },
] as const;

// ─── AgencyCheck benefits ─────────────────────────────────────────────────────
const AGENCYCHECK_BENEFITS = [
  { icon: "⚡", label: "Zelfde dag reactie", detail: "Solliciteer via WhatsApp en ontvang nog dezelfde dag een reactie van een echte recruiter. Geen weken wachten." },
  { icon: "🏠", label: "Huisvesting inbegrepen", detail: "Alle bureaus op AgencyCheck bieden huisvesting als onderdeel van het pakket. Geen eigen woning zoeken nodig." },
  { icon: "📋", label: "Transparant contract", detail: "Voordat je tekent zie je precies wat er ingehouden wordt: huisvesting, transport, verzekering. Geen verrassingen na aankomst." },
  { icon: "🆓", label: "100% gratis voor werknemers", detail: "AgencyCheck is volledig gratis voor werknemers. Bureaus betalen voor toegang — jij betaalt nooit iets." },
];

export default async function NlHomepage() {
  const stats   = await getPublishedReviewStats();
  const housingCount = AGENCIES_WITH_HOUSING.length;

  const orgSchema = {
    "@context": "https://schema.org",
    "@type":    "Organization",
    name:       "AgencyCheck",
    url:        BASE,
    description: "Onafhankelijk transparantieplatform voor werknemers bij uitzendbureaus in Nederland",
    sameAs: [`${BASE}/nl`],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type":    "WebSite",
    name:       "AgencyCheck",
    url:        `${BASE}/nl`,
    inLanguage: "nl",
    description: "Vergelijk uitzendbureaus in Nederland — reëele salarissen, reviews en huisvesting.",
    potentialAction: {
      "@type":       "SearchAction",
      target:        `${BASE}/nl/vacatures?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",      item: `${BASE}/nl` },
      { "@type": "ListItem", position: 2, name: "Vacatures", item: `${BASE}/nl/vacatures` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type":    "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name:    "Hoeveel houd ik netto over als werknemer via een uitzendbureau in Nederland?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Na aftrek van huisvesting (€95–€170/week), belasting, transport en verzekering houd je gemiddeld €243–€345 per week netto over van een brutoloon van €588 (WML 2026, 40 uur). Exacte bedragen verschillen per bureau.",
        },
      },
      {
        "@type": "Question",
        name:    "Mag een uitzendbureau huisvestingskosten inhouden op mijn loon?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja, maar de SNF-norm stelt een maximum van €103/week (2026). Sommige bureaus rekenen meer via 'bijkomende kosten'. Controleer altijd je loonstrook en vergelijk bureaus op AgencyCheck.",
        },
      },
      {
        "@type": "Question",
        name:    "Heb ik een BSN-nummer nodig om bij een uitzendbureau te werken?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja, een BSN-nummer is verplicht voor loonbelasting en sociale premies in Nederland. Je kunt een BSN aanvragen bij de gemeente na aankomst. Sommige bureaus helpen hierbij.",
        },
      },
      {
        "@type": "Question",
        name:    "Welke uitzendbureaus in Nederland bieden huisvesting aan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `AgencyCheck vermeldt ${housingCount}+ uitzendbureaus in Nederland die huisvesting aanbieden. Vergelijk kosten, reviews en voorwaarden op de vacaturespagina.`,
        },
      },
      {
        "@type": "Question",
        name:    "Heb ik EU-burgerschap nodig om via AgencyCheck werk te vinden?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja, de meeste vacatures op AgencyCheck zijn beschikbaar voor EU-burgers. Dit is vereist vanwege arbeidsregelgeving voor uitzendbureaus in Nederland.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <HomepageStickyBar />

      {/* ════════════════════════════════════════════════════════════
          §1  HERO
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

          {/* Badge */}
          <div className="mb-5 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-4 py-1.5 text-xs font-bold text-green-700">
              🇳🇱 Nederland · {housingCount} bureaus met huisvesting · Geen bureau-sponsoring
            </span>
          </div>

          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 leading-tight mb-4">
              Je denkt dat je{" "}
              <span className="text-gray-400 line-through decoration-red-400">€600/week</span>{" "}
              verdient.
              <br />
              <span className="text-emerald-600">Je houdt eigenlijk €243 over.</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6">
              Bureauhuisvesting is niet gratis — het wordt ingehouden op je salaris.
              Voeg belasting, transport en verzekering toe. De meeste werknemers komen
              dat pas na aankomst te weten.{" "}
              <strong className="text-gray-900">Zie het echte bedrag eerst.</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/nl/vacatures"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] px-6 py-3.5 text-sm font-black text-white transition-all shadow-sm"
              >
                🔥 Bekijk actuele vacatures ({VACANCIES.length})
              </Link>
              <Link
                href="/tools/real-income-calculator"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] px-6 py-3.5 text-sm font-black text-white transition-all shadow-sm"
              >
                💶 Bereken jouw echt inkomen
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            {[
              { n: "150+",                          l: "bureaus geverifieerd" },
              { n: String(stats.total ?? "500+"),   l: "werknemersreviews"   },
              { n: String(housingCount),            l: "met huisvesting"     },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-gray-50 border border-gray-100 py-4 text-center">
                <p className="text-xl font-black text-emerald-600">{s.n}</p>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §2  SALARY REALITY
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">

          <div className="text-center mb-10">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
              Voordelen van AgencyCheck — Nederland 2026
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
              Begin je werk in Nederland <em>goed voorbereid</em>
            </h2>
            <p className="text-sm text-gray-500 max-w-xl mx-auto">
              AgencyCheck koppelt werknemers aan geverifieerde bureaus met transparante voorwaarden
            </p>
          </div>

          <div className="max-w-lg mx-auto rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm mb-10">
            <div className="bg-gray-900 px-6 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Werknemer WML · €14,71/u · 40u/week · huisvesting + transport
              </p>
            </div>
            <div className="p-6 space-y-2.5">
              {SALARY_ROWS.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3">
                  <span className={`text-sm ${row.bold ? "font-black text-gray-900" : "font-medium text-gray-600"}`}>
                    {row.label}
                  </span>
                  <span className={`shrink-0 text-sm font-black ${row.green ? "text-emerald-600" : "text-red-500"}`}>
                    {row.amount}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-6 pb-5 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-gray-400">
                  Inhoudingen: belasting + huisvesting + verzekering + transport + admin.{" "}
                  <Link href="/methodology" className="text-blue-600 underline">Volledige methode →</Link>
                </p>
                <Link
                  href="/tools/real-income-calculator"
                  className="shrink-0 ml-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors px-4 py-2 text-xs font-black text-white active:scale-[0.98]"
                >
                  Bereken de jouwe
                </Link>
              </div>
            </div>
          </div>

          {/* AgencyCheck benefits grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AGENCYCHECK_BENEFITS.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5 hover:border-emerald-200 hover:bg-emerald-50/60 transition-colors"
              >
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <h3 className="text-sm font-black text-gray-900 mb-1">{item.label}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §3  HOW IT WORKS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Hoe het werkt</h2>
            <p className="text-sm text-gray-500">Onafhankelijk · Niet gelieerd aan enig bureau · Gratis</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: "📊",
                title: "Zie de echte cijfers",
                desc: "Bruto loon versus wat je echt overhoudt na aftrek van huisvesting, belasting en transport.",
              },
              {
                icon: "⭐",
                title: "Alleen werknemersreviews",
                desc: "Anonieme reviews van mensen die er daadwerkelijk hebben gewerkt. Geen bureaumarketing.",
              },
              {
                icon: "📸",
                title: "Woonfoto's",
                desc: "Echte foto's ingezonden door werknemers die in bureauhuisvesting hebben gewoond.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors">
                <span className="text-3xl mb-3 block">{item.icon}</span>
                <h3 className="font-black text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §4  VACANCIES CTA
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0B1F14]">
        <div className="max-w-2xl mx-auto px-4 py-14 text-center">
          <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400 mb-2">
            Actuele openstaande functies
          </p>
          <h2 className="text-3xl font-extrabold text-white mb-3">
            {VACANCIES.length} vacatures beschikbaar
          </h2>
          <p className="text-gray-400 text-[14px] mb-6">
            Alleen EU-burgers · Direct beschikbaar · Nederland & Griekenland
          </p>
          <Link
            href="/nl/vacatures"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-white font-black text-[15px] px-8 py-4 rounded-2xl transition-all shadow-lg"
          >
            🔥 Bekijk alle vacatures →
          </Link>
          <p className="text-gray-600 text-[11px] mt-4">
            🇪🇺 EU-burgerschap vereist · 🌐 Engels vereist · ⚡ Direct beschikbaar
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §5  QUICK LINKS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-lg font-black text-gray-900 mb-5 text-center">Snelle links voor werknemers</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { href: "/nl/vacatures",                  icon: "🔥", label: "Actuele vacatures"         },
              { href: "/tools/real-income-calculator",  icon: "🧮", label: "Inkomenscalculator"        },
              { href: "/agencies-with-housing",         icon: "🏠", label: "Werk met huisvesting"      },
              { href: "/agencies",                      icon: "🏢", label: "Alle bureaus"               },
              { href: "/reviews",                       icon: "⭐", label: "Werknemersreviews"          },
              { href: "/tools",                         icon: "🔧", label: "Alle werknemerstools"       },
              { href: "/tools/payslip-checker",         icon: "📄", label: "Loonstrook controleren"    },
              { href: "/about",                         icon: "ℹ️", label: "Over AgencyCheck"           },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-emerald-50 hover:border-emerald-200 px-3.5 py-3 text-sm font-semibold text-gray-700 hover:text-emerald-700 transition-colors"
              >
                <span>{item.icon}</span>
                <span className="leading-tight">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §6  ABOUT
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 text-center">
          <div className="flex flex-wrap gap-2 justify-center mb-5">
            {["📊 Gebaseerd op echte werknemersgegevens", "🚫 Geen bureaureclame", "👷 Gerapporteerd door werknemers", "✅ Onafhankelijk platform"].map((b) => (
              <span key={b} className="inline-flex items-center rounded-full bg-white border border-gray-200 px-3 py-1 text-xs font-bold text-gray-600 shadow-sm">{b}</span>
            ))}
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-3">Over AgencyCheck</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            AgencyCheck is een onafhankelijk transparantieplatform voor werknemers. Wij helpen werknemers in Nederland
            hun rechten te begrijpen, bureaus te vergelijken en weloverwogen beslissingen te nemen voordat ze beginnen
            met werken.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            Onze bureaugegevens zijn afkomstig uit het officiële ledenregister van de ABU (uitzendbureau-federatie).
            Huisvestings-, transport- en salarisgegevens worden aangevuld met door werknemers gerapporteerde ervaringen.
          </p>
          <p className="text-[11px] text-gray-400">
            Wij rekenen bureaus niets voor vermeldingen. We zijn niet gelieerd aan enig uitzendbureau.
          </p>
        </div>
      </section>

      {/* Lead form strip */}
      <ApplyBar
        context={{
          sourcePage:           "/nl",
          sourceType:           "general_apply",
          sourceLabel:          "NL Homepage footer CTA",
          defaultAccommodation: true,
        }}
        headline="Op zoek naar werk in Nederland?"
        subline="Deel je gegevens — bureaus nemen contact op als er een match is"
        ctaText="Vind mij een baan"
        showInline
      />
    </>
  );
}
