import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "ET-regeling Nederland 2026 — Belastingvrije Vergoeding voor Uitzendkrachten",
  description:
    "Wat is de ET-regeling (extraterritoriale kostenvergoeding) en wie heeft er recht op? Tot €150/week belastingvrij extra nettoloon. Hoe werkt het en vraagt je bureau het automatisch aan?",
  alternates: {
    canonical: "https://agencycheck.io/nl/et-regeling-nederland",
    languages: {
      "en":        "https://agencycheck.io/et-scheme-netherlands-explained",
      "nl":        "https://agencycheck.io/nl/et-regeling-nederland",
      "pl":        "https://agencycheck.io/pl/system-et-holandia",
      "ro":        "https://agencycheck.io/ro/schema-et-olanda",
      "x-default": "https://agencycheck.io/et-scheme-netherlands-explained",
    },
  },
  openGraph: {
    title: "ET-regeling Nederland 2026 — Tot €150/week Belastingvrij Extra",
    description:
      "De ET-regeling vergoedt extra kosten voor buitenlandse werknemers in Nederland belastingvrij. Wie komt in aanmerking? Hoeveel? Vraagt je bureau het automatisch aan?",
    locale: "nl_NL",
  },
};

export const dynamic = "force-static";

const ET_COMPONENTS = [
  {
    title: "Dubbele huishouding",
    amount: "~€50–€80/week",
    desc: "Kosten voor het aanhouden van twee huishoudens: een thuis en een in Nederland. Geldt voor werknemers die regelmatig naar huis reizen.",
    icon: "🏠",
  },
  {
    title: "Reiskosten naar huis",
    amount: "~€30–€60/week",
    desc: "Kosten voor periodieke reizen naar het land van herkomst (vliegtuig, bus, trein). Wordt berekend op basis van werkelijke kosten of een vast bedrag.",
    icon: "✈️",
  },
  {
    title: "Hogere kosten levensonderhoud",
    amount: "~€20–€40/week",
    desc: "Vergoeding voor hogere kosten van levensonderhoud in Nederland vergeleken met het land van herkomst.",
    icon: "🛒",
  },
];

const ELIGIBILITY = [
  { item: "Je woont meer dan 150 km van de Nederlandse grens", ok: true },
  { item: "Je hebt een arbeidsovereenkomst met een Nederlands uitzendbureau of werkgever", ok: true },
  { item: "Je bent ingezetene van een EU/EER-land of Zwitserland", ok: true },
  { item: "Je verblijf in Nederland is tijdelijk van aard", ok: true },
  { item: "Je woont in België of Duitsland (grensgebied < 150 km)", ok: false },
  { item: "Je bent al meer dan 5 jaar woonachtig in Nederland", ok: false },
];

const FAQS = [
  {
    q: "Wat is de ET-regeling precies?",
    a: "De ET-regeling (extraterritoriale kostenvergoeding) is een Nederlandse belastingregeling waarmee werkgevers bepaalde extra kosten van buitenlandse werknemers belastingvrij kunnen vergoeden. Deze kosten omvatten dubbele huishouding, reiskosten naar huis en hogere kosten van levensonderhoud. De vergoeding is vrijgesteld van loonbelasting, waardoor je nettoloon stijgt zonder extra bruto kosten voor de werkgever.",
  },
  {
    q: "Wie heeft recht op de ET-regeling?",
    a: "Werknemers die meer dan 150 km van de Nederlandse grens wonen en tijdelijk in Nederland werken. Dit geldt voor de meeste werknemers uit Polen, Roemenië, Bulgarije, Oekraïne, Slowakije en andere Oost-Europese EU-landen. Belgische en Duitse grensbewoners (< 150 km) komen doorgaans niet in aanmerking.",
  },
  {
    q: "Hoeveel is de ET-vergoeding per week?",
    a: "Het bedrag varieert per bureau en situatie, maar ligt gemiddeld tussen €50 en €150 per week belastingvrij. De exacte hoogte hangt af van de daadwerkelijke extra kosten (reisafstand, huisvestingssituatie) en de afspraken met het uitzendbureau. Vraag altijd om een schriftelijk overzicht van de ET-vergoeding in je arbeidsovereenkomst.",
  },
  {
    q: "Vraagt mijn uitzendbureau de ET-regeling automatisch voor me aan?",
    a: "Niet altijd. Sommige bureaus passen de ET-regeling automatisch toe voor in aanmerking komende werknemers, anderen doen het alleen op verzoek, en een deel past het helemaal niet toe. Vraag expliciet naar de ET-vergoeding vóór ondertekening van het contract. Als je er recht op hebt maar het bureau het niet aanbiedt, kun je vragen om uitleg of een ander bureau overwegen.",
  },
  {
    q: "Staat de ET-vergoeding altijd op mijn loonstrook?",
    a: "Ja. De ET-vergoeding moet apart vermeld staan op de loonstrook als 'ET-toeslag' of 'extraterritoriale kostenvergoeding'. Het bedrag verschijnt bij de bruto-onkostenvergoedingen en wordt niet belast. Als je denkt dat je er recht op hebt maar het niet op je loonstrook staat, neem dan contact op met je bureau.",
  },
];

export default function EtRegelingNederlandPage() {
  const crumbSchema = breadcrumbSchema([
    { name: "Home",            url: "/" },
    { name: "Nederlands",      url: "/nl" },
    { name: "ET-regeling Nederland", url: "/nl/et-regeling-nederland" },
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
            <span className="text-gray-400">ET-regeling Nederland</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            ET-regeling Nederland 2026<br className="hidden sm:block" /> — Tot €150/week Extra Netto
          </h1>
          <p className="text-gray-300 text-base leading-relaxed max-w-2xl mb-6">
            De ET-regeling (extraterritoriale kostenvergoeding) vergoedt extra kosten voor
            buitenlandse werknemers in Nederland belastingvrij. Veel bureaus passen het niet
            automatisch toe — weet of jij er recht op hebt.
          </p>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-4 py-2 text-emerald-300 text-sm font-bold">
            💡 Belastingvrij: telt niet mee als belastbaar inkomen
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-14">

        {/* Componenten */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Wat wordt vergoed?</h2>
          <p className="text-sm text-gray-500 mb-6">
            De ET-vergoeding bestaat uit drie componenten, die samen de extra kosten van werken
            ver van huis dekken.
          </p>
          <div className="space-y-4">
            {ET_COMPONENTS.map((c) => (
              <div key={c.title} className="rounded-2xl border border-gray-100 p-5 flex gap-4">
                <span className="text-3xl shrink-0">{c.icon}</span>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-black text-gray-900">{c.title}</span>
                    <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {c.amount}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Wie komt in aanmerking */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-5">Wie Komt in Aanmerking?</h2>
          <div className="space-y-2">
            {ELIGIBILITY.map((e, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 rounded-xl p-3.5 text-sm ${
                  e.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"
                }`}
              >
                <span className={`font-black shrink-0 ${e.ok ? "text-emerald-600" : "text-red-500"}`}>
                  {e.ok ? "✓" : "✗"}
                </span>
                <span>{e.item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Hoe werkt het */}
        <section className="bg-gray-900 text-white rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-4">Hoe Werkt de ET-regeling in de Praktijk?</h2>
          <div className="space-y-4 text-sm text-gray-300">
            <div className="flex gap-3">
              <span className="text-emerald-400 font-black shrink-0">1.</span>
              <p>
                <strong className="text-white">Bureau beoordeelt je situatie</strong> — het bureau
                bepaalt of je in aanmerking komt op basis van je woonadres en reisafstand.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-emerald-400 font-black shrink-0">2.</span>
              <p>
                <strong className="text-white">Vergoeding in de arbeidsovereenkomst</strong> — het
                ET-bedrag wordt schriftelijk vastgelegd als onderdeel van je beloningspakket.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-emerald-400 font-black shrink-0">3.</span>
              <p>
                <strong className="text-white">Wekelijkse uitbetaling belastingvrij</strong> — de
                ET-toeslag staat als aparte post op je loonstrook, vrijgesteld van loonheffing.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-emerald-400 font-black shrink-0">4.</span>
              <p>
                <strong className="text-white">Maximale termijn: 5 jaar</strong> — na 5 jaar
                woonachtig te zijn in Nederland vervalt het recht op de ET-regeling.
              </p>
            </div>
          </div>
          <div className="mt-5 bg-amber-900/30 border border-amber-700/30 rounded-xl p-4 text-sm text-amber-200">
            <strong>Vraag ernaar vóór je tekent.</strong> Niet alle bureaus passen de ET-regeling
            automatisch toe. Als je er recht op hebt maar het bureau het niet noemt, vraag dan
            expliciet om de ET-toeslag of overweeg een ander bureau.
          </div>
        </section>

        {/* Rekenvoorbeeld */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-4">Rekenvoorbeeld: Met vs Zonder ET</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Post</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">Zonder ET</th>
                  <th className="text-right px-4 py-3 font-semibold text-emerald-700">Met ET</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { label: "Bruto weekloon (WML, 40u)", zonder: "€562", met: "€562" },
                  { label: "Loonheffing (na heffingskorting)", zonder: "−€58", met: "−€58" },
                  { label: "Inhoudingen (huisvesting, etc.)", zonder: "−€155", met: "−€155" },
                  { label: "ET-toeslag (belastingvrij)", zonder: "€0", met: "+€100" },
                  { label: "Nettoloon per week", zonder: "€349", met: "€449", highlight: true },
                ].map((r, i) => (
                  <tr key={i} className={r.highlight ? "bg-emerald-50 font-bold" : "hover:bg-gray-50/50"}>
                    <td className="px-4 py-3 text-gray-900">{r.label}</td>
                    <td className="px-4 py-3 text-right text-gray-600 tabular-nums">{r.zonder}</td>
                    <td className={`px-4 py-3 text-right tabular-nums ${r.highlight ? "text-emerald-700 font-black" : "text-gray-600"}`}>{r.met}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Indicatieve bedragen. Het werkelijke ET-bedrag hangt af van de situatie en het bureau.
          </p>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-5">Veelgestelde Vragen over de ET-regeling</h2>
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
            { href: "/nl/loonstrook-uitgelegd",       label: "Loonstrook uitgelegd",  icon: "📄" },
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
