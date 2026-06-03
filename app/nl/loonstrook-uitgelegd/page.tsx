import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Loonstrook Uitgelegd 2026 — Elke Regel op Je Salarisstrook Begrijpen",
  description:
    "Begrijp elke regel op je Nederlandse loonstrook: brutoloon, loonheffing, heffingskorting, vakantiegeld, ET-toeslag en meer. Met voorbeeldbedragen bij WML (€14,06/uur).",
  alternates: {
    canonical: "https://agencycheck.io/nl/loonstrook-uitgelegd",
    languages: {
      "en":        "https://agencycheck.io/how-to-read-dutch-payslip",
      "nl":        "https://agencycheck.io/nl/loonstrook-uitgelegd",
      "pl":        "https://agencycheck.io/pl/loonstrook-wyjasniony",
      "ro":        "https://agencycheck.io/ro/loonstrook-explicat",
      "x-default": "https://agencycheck.io/how-to-read-dutch-payslip",
    },
  },
  openGraph: {
    title: "Nederlandse Loonstrook Uitgelegd — Elke Regel 2026",
    description:
      "Snap je loonstrook niet? Elke regel uitgelegd met echte bedragen — brutoloon, nettoloon, vakantiegeld, ET-toeslag, heffingskorting.",
    locale: "nl_NL",
  },
};

export const dynamic = "force-static";

const LOONSTROOK_FIELDS = [
  {
    term: "Brutoloon",
    label: "Bruto uurloon × gewerkte uren",
    example: "+€562,40",
    positive: true,
    explain:
      "Je totale verdiensten vóór inhoudingen. Bij WML (€14,06/uur × 40u/week) is dit €562,40 per week. Dit is het bedrag dat uitzendbureaus adverteren — niet wat je werkelijk op je rekening krijgt.",
  },
  {
    term: "Vakantiegeld (8%)",
    label: "Vakantiebijslag",
    example: "+€44,99",
    positive: true,
    explain:
      "Verplichte 8% vakantiebijslag, wekelijks opgebouwd en jaarlijks (of maandelijks) uitbetaald. Dit is jóúw geld — uitzendbureaus zijn wettelijk verplicht het uit te betalen (Burgerlijk Wetboek Art. 7:634).",
  },
  {
    term: "Loonheffing",
    label: "Inkomstenbelasting + volksverzekeringen",
    example: "−€58,20",
    positive: false,
    explain:
      "De gecombineerde Nederlandse loonbelasting en premie volksverzekeringen (AOW, Anw, Wlz). Wordt elke loonperiode door de werkgever ingehouden. Voor buitenlandse werknemers bij WML is het effectieve tarief na heffingskortingen circa 10–15% — niet de 37% die je soms hoort.",
  },
  {
    term: "Heffingskorting",
    label: "Belastingkorting",
    example: "+€38,50",
    positive: true,
    explain:
      "Wettelijke belastingkorting die de loonheffing vermindert. Er zijn twee: arbeidskorting (korting op werken, max €5.158/jaar) en algemene heffingskorting (max €3.362/jaar). Pas als beide worden toegepast, houd je aanzienlijk meer over. Vraag je recruiter of beide worden verrekend.",
  },
  {
    term: "WW-premie werknemer",
    label: "Werkloosheidsverzekeringspremie",
    example: "−€22,00",
    positive: false,
    explain:
      "Jouw bijdrage aan de werkloosheidsverzekering (WW). Als je werkloos raakt na minimaal 26 weken werken in de laatste 36 weken, heb je recht op een WW-uitkering.",
  },
  {
    term: "ZW/WIA-premie",
    label: "Ziekte- en arbeidsongeschiktheidspremie",
    example: "−€14,00",
    positive: false,
    explain:
      "Premie voor de Ziektewet (ZW) en WIA (arbeidsongeschiktheid). Dekt doorbetaling bij ziekte na je eerste jaar. Als uitzendkracht in Fase A ben je gedekt via het uitzendbureau.",
  },
  {
    term: "Huisvestingsinhouding",
    label: "Kosten woonruimte uitzendbureau",
    example: "−€95,00",
    positive: false,
    explain:
      "Alleen toegestaan als je in de door het bureau aangeboden woonruimte woont en dit schriftelijk is overeengekomen. Maximum €113,50/week (SNF-norm 2026). Als je geen gebruik maakt van bureauhuisvesting, mag dit niet worden ingehouden.",
  },
  {
    term: "ET-toeslag",
    label: "Extraterritoriale kostenvergoeding",
    example: "+€50–€150",
    positive: true,
    explain:
      "Belastingvrije vergoeding voor werknemers die meer dan 150 km van de Nederlandse grens wonen. Dekt kosten voor dubbele huishouding, reizen naar huis en hogere levenskosten. Niet alle bureaus passen het automatisch toe — vraag ernaar.",
  },
  {
    term: "Nettoloon",
    label: "Wat op je rekening komt",
    example: "≈ €308",
    positive: true,
    explain:
      "Het bedrag dat je bankrekening bereikt nadat alle belastingen, premies en inhoudingen zijn verwerkt. Dit is wat je écht overhoudt. Bij WML met alle standaardinhoudingen is dit circa €308–€345 per week.",
  },
];

const FAQS = [
  {
    q: "Waarom is mijn nettoloon zo veel lager dan mijn brutoloon?",
    a: "Het brutoloon is het totaal vóór belastingen en inhoudingen. Van dat bedrag gaat loonheffing (~10–15%), huisvesting (~€95/week), zorgverzekering (~€35/week) en vervoer (~€25/week) af. Daardoor houd je bij WML van €562 bruto circa €308–€345 netto per week over.",
  },
  {
    q: "Wat zijn heffingskortingen en waarom zijn ze belangrijk?",
    a: "Heffingskortingen zijn wettelijke belastingkortingen die je loonheffing verlagen. De twee voornaamste zijn de arbeidskorting (max €5.158/jaar) en de algemene heffingskorting (max €3.362/jaar). Als het bureau beide toepast, houd je significant meer nettoloon over. Controleer je loonstrook op de post 'heffingskorting'.",
  },
  {
    q: "Wat is het verschil tussen loonheffing en inkomstenbelasting?",
    a: "Loonheffing is de voorheffing die elke loonperiode door de werkgever wordt ingehouden. Inkomstenbelasting is de definitieve belasting die je via de jaarlijkse aangifte afrekent. Als je meer loonheffing hebt betaald dan je daadwerkelijk verschuldigd bent (wat bij uitzendkrachten vaak het geval is), krijg je het verschil terug na aangifte.",
  },
  {
    q: "Moet vakantiegeld apart op mijn loonstrook staan?",
    a: "Ja. Vakantiegeld (8%) moet altijd als aparte post 'vakantiegeld opbouw' op de loonstrook staan. Als het er niet op staat, of als het bureau zegt dat het 'in het uurloon zit', is dat een waarschuwingssignaal. Vraag om een schriftelijke bevestiging van hoe het vakantiegeld wordt opgebouwd en uitbetaald.",
  },
  {
    q: "Wat is de ET-toeslag en wie heeft er recht op?",
    a: "De ET-toeslag (extraterritoriale kostenvergoeding) is een belastingvrije vergoeding voor werknemers die meer dan 150 km van de Nederlandse grens wonen. Voor werknemers uit België, Duitsland en andere buurlanden met een korte afstand geldt een andere regeling. De toeslag dekt kosten voor dubbele huishouding en reiskosten naar huis. Niet alle bureaus passen het automatisch toe.",
  },
];

export default function LoonstrookUitgelegd() {
  const crumbSchema = breadcrumbSchema([
    { name: "Home",                url: "/" },
    { name: "Nederlands",          url: "/nl" },
    { name: "Loonstrook uitgelegd", url: "/nl/loonstrook-uitgelegd" },
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
            <span className="text-gray-400">Loonstrook uitgelegd</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            Nederlandse Loonstrook<br className="hidden sm:block" /> Uitgelegd — 2026
          </h1>
          <p className="text-gray-300 text-base leading-relaxed max-w-2xl mb-6">
            Elke regel op je loonstrook uitgelegd met echte bedragen bij WML (€14,06/uur).
            Begrijp wat je verdient, wat wordt ingehouden en hoe je controleert of het klopt.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">

        {/* Velden */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-6">Elke Regel op Je Loonstrook</h2>
          <div className="space-y-4">
            {LOONSTROOK_FIELDS.map((f) => (
              <div
                key={f.term}
                className={`rounded-2xl border p-5 ${
                  f.positive ? "border-gray-100 bg-white" : "border-gray-100 bg-gray-50/40"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-black text-gray-900 text-base">{f.term}</span>
                    <span className="text-xs text-gray-500 ml-2">{f.label}</span>
                  </div>
                  <span className={`text-sm font-black tabular-nums shrink-0 ${f.positive ? "text-emerald-700" : "text-red-600"}`}>
                    {f.example}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{f.explain}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Checklist */}
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">📋 Controleer je loonstrook</h2>
          <div className="space-y-2">
            {[
              "Brutoloon is minimaal €14,06/uur (40u/week) of €14,80/uur (38u/week)",
              "Vakantiegeld (8%) staat als aparte post vermeld",
              "Loonheffing is berekend met jouw BSN — niet het anoniementarief",
              "Heffingskorting wordt toegepast (arbeidskorting + algemene heffingskorting)",
              "Huisvestingsinhouding is maximaal €113,50/week",
              "Er worden geen onverklaarbare kostenposten ingehouden",
              "Overuren staan als 'overwerk' vermeld met toeslag van 125% of meer",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-amber-900">
                <span className="text-amber-600 font-bold shrink-0">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-5">Veelgestelde Vragen over de Loonstrook</h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="border border-gray-100 rounded-xl p-5">
                <p className="text-sm font-bold text-gray-900 mb-2">{faq.q}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Nog steeds vragen over je loonstrook?</h2>
          <p className="text-gray-600 text-sm mb-4">
            Gebruik onze Loonstrook Checker om je specifieke loonstrook te analyseren.
          </p>
          <Link
            href="/tools/payslip-checker"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Gebruik de Loonstrook Checker →
          </Link>
        </section>

        <div className="border-t border-gray-100 pt-8 grid sm:grid-cols-3 gap-3">
          {[
            { href: "/nl/minimumloon-nederland-2026", label: "Minimumloon 2026",        icon: "📋" },
            { href: "/nl/et-regeling-nederland",      label: "ET-regeling uitgelegd",   icon: "💡" },
            { href: "/nl/nettoloon-nederland",         label: "Nettoloon berekenen",     icon: "💶" },
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
