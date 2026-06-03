import type { Metadata } from "next";
import Link from "next/link";
import { VERIFIED_AGENCIES } from "@/data/agencies";

export const metadata: Metadata = {
  title: "Minimumloon Nederland 2026 — Uurloon, Weekbedrag & Aftrekposten",
  description:
    "Het Nederlandse wettelijk minimumloon (WML) in 2026: exact uurloon, weekloon, maandbedrag en wat uitzendbureaus mogen inhouden. Alles wat je moet weten als uitzendkracht.",
  alternates: {
    canonical: "https://agencycheck.io/nl/minimumloon-nederland-2026",
    languages: {
      "en":        "https://agencycheck.io/minimum-wage-netherlands-2026",
      "nl":        "https://agencycheck.io/nl/minimumloon-nederland-2026",
      "pl":        "https://agencycheck.io/pl/minimalna-placa-holandia-2026",
      "ro":        "https://agencycheck.io/ro/salariul-minim-olanda-2026",
      "x-default": "https://agencycheck.io/minimum-wage-netherlands-2026",
    },
  },
  openGraph: {
    title: "Minimumloon Nederland 2026 — Uurloon & Nettoloon na Inhoudingen",
    description:
      "WML 2026: €14,06/uur (40u/week). Wat houdt het uitzendbureau in? Hoeveel nettoloon krijg je écht? Inclusief huisvesting, belasting en vervoer.",
    locale: "nl_NL",
  },
};

export const dynamic = "force-static";

const WML_RATES = [
  { period: "Per uur (40u/week)",   gross: "€14,06",   note: "Geldt voor alle werknemers van 21 jaar en ouder, ongeacht nationaliteit" },
  { period: "Per uur (38u/week)",   gross: "€14,80",   note: "Als de cao een 38-urige werkweek hanteert" },
  { period: "Per uur (36u/week)",   gross: "€15,62",   note: "Afhankelijk van de cao van de sector" },
  { period: "Per week (40u)",       gross: "€562,40",  note: "Bruto, vóór loonheffing, premies en inhoudingen" },
  { period: "Per maand (40u)",      gross: "€2 437",   note: "52 weken × €562,40 ÷ 12" },
  { period: "Vakantiegeld (8%)",    gross: "+€195/mnd", note: "Opgebouwd per maand, uitbetaald in mei (ABU CAO) of ingebouwd in uurloon" },
];

const LEGAL_DEDUCTIONS = [
  {
    icon: "🏠",
    label: "Huisvesting (huisvesting)",
    max: "€113,50/week",
    rule: "Maximale SNF-norm 2026 — alleen als de huisvesting daadwerkelijk wordt aangeboden en SNF-gecertificeerd is. Mag niet meer zijn dan 25% van het bruto uurloon × gewerkte uren.",
    allowed: true,
  },
  {
    icon: "🚌",
    label: "Vervoer (vervoerskosten)",
    max: "Werkelijke kosten",
    rule: "Mag alleen worden ingehouden als het uitzendbureau het vervoer regelt. Moet apart vermeld staan op de loonstrook. Mag geen winstmarge bevatten op vervoer.",
    allowed: true,
  },
  {
    icon: "🏥",
    label: "Zorgverzekering",
    max: "~€170/mnd",
    rule: "Collectieve ziektekostenverzekering via het uitzendbureau is een legale inhouding, mits je hiermee akkoord bent gegaan. De basisverzekering is wettelijk verplicht zodra je in Nederland werkt.",
    allowed: true,
  },
  {
    icon: "❌",
    label: "Bemiddelings- of wervingskosten",
    max: "€0",
    rule: "Volledig verboden. Uitzendbureaus mogen geen kosten in rekening brengen voor het vinden van een baan (WAADI-wijziging 2024). Meld overtredingen bij de Inspectie SZW.",
    allowed: false,
  },
  {
    icon: "❌",
    label: "Werkkleding / uniform",
    max: "€0",
    rule: "Mag niet worden doorberekend als de kleding verplicht is voor de functie (veiligheidsvest, veiligheidsschoenen voor magazijn). Optionele merkkleding mag alleen met schriftelijke toestemming worden ingehouden.",
    allowed: false,
  },
  {
    icon: "❌",
    label: "Administratie- of registratiekosten",
    max: "€0",
    rule: "Kosten voor BSN-verificatie, DigiD of contractregistratie mogen nooit worden ingehouden. Verboden op grond van Art. 12 Wet minimumloon (WML).",
    allowed: false,
  },
];

const NET_EXAMPLE = [
  { label: "Bruto weekloon (40u @ WML)",                         amount: "+€562",  plus: true  },
  { label: "Loonheffing (inkomstenbelasting, met heffingskorting)", amount: "−€58",  plus: false },
  { label: "WW-premie (werkloosheidsverzekering)",                amount: "−€22",   plus: false },
  { label: "ZW/WIA-premies (ziekte/arbeidsongeschiktheid)",       amount: "−€14",   plus: false },
  { label: "Zorgverzekering",                                     amount: "−€40",   plus: false },
  { label: "Huisvesting (SNF-norm, indien van toepassing)",       amount: "−€95",   plus: false },
  { label: "Vervoer (indien geregeld door uitzendbureau)",        amount: "−€25",   plus: false },
  { label: "Nettoloon (op rekening)",                             amount: "≈ €308", plus: true  },
];

const FAQS = [
  {
    q: "Wat is het minimumloon in Nederland in 2026?",
    a: "Het wettelijk minimumloon (WML) in 2026 bedraagt €14,06 bruto per uur voor werknemers van 21 jaar en ouder bij een 40-urige werkweek. Dat is €562,40 bruto per week en circa €2.437 bruto per maand. De tarieven worden op 1 januari en 1 juli elk jaar aangepast op basis van de gemiddelde loonontwikkeling.",
  },
  {
    q: "Mag een uitzendbureau minder dan het minimumloon betalen door inhoudingen?",
    a: "Nee. Inhoudingen voor huisvesting en vervoer zijn aan strikte maxima gebonden en mogen het nettoloon nooit onder het wettelijk netto minimumloon brengen. De maximale SNF-inhouding voor huisvesting is €113,50 per week. Vermoed je dat je nettoloon na inhoudingen onder het wettelijk minimum ligt? Meld dit bij de Inspectie SZW of neem contact op met de FNV.",
  },
  {
    q: "Wat is vakantiegeld en is het inbegrepen in het minimumloon?",
    a: "Vakantiegeld is 8% van je bruto jaarloon en is wettelijk verplicht op grond van Art. 15 Wet minimumloon. Voor een fulltime werknemer op WML is dat circa €195 per maand, in mei uitbetaald (ABU CAO). Het is een aanvulling op je reguliere loon — het effectieve uurloon inclusief vakantiegeld bedraagt dus circa €15,18/uur.",
  },
  {
    q: "Geldt het minimumloon ook voor buitenlandse EU-werknemers?",
    a: "Ja. Het Nederlandse WML geldt voor alle werknemers in Nederland, ongeacht nationaliteit. Werknemers uit Polen, Roemenië, Bulgarije, Oekraïne en andere EU-landen die in Nederland werken, hebben recht op minimaal WML. Uitbetaling onder WML is illegaal en kan gemeld worden bij de Nederlandse Arbeidsinspectie (Inspectie SZW).",
  },
  {
    q: "Worden overuren meer betaald dan het minimumloon?",
    a: "Ja. Onder de ABU CAO wordt uren boven 40 per week (overwerktoeslag) betaald met een toeslag van 125% voor de eerste 8 extra uren en 150% daarboven. Je normale uurloon kan hoger liggen dan WML als je functie is ingedeeld in een hogere loonschaal — logistiek, voedingsproductie en metaal hebben eigen hogere CAO-tarieven.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Minimumloon Nederland 2026 — Uurloon, Weekbedrag & Aftrekposten",
      "description": "WML 2026: exacte tarieven, wettelijke inhoudingen, nettoloon voorbeeld en rechten van de werknemer.",
      "url": "https://agencycheck.io/nl/minimumloon-nederland-2026",
      "datePublished": "2026-01-01",
      "dateModified": "2026-05-01",
      "inLanguage": "nl",
      "author": { "@type": "Organization", "name": "AgencyCheck" },
      "publisher": { "@type": "Organization", "name": "AgencyCheck", "url": "https://agencycheck.io" },
    },
    {
      "@type": "FAQPage",
      "mainEntity": FAQS.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://agencycheck.io/nl" },
        { "@type": "ListItem", "position": 2, "name": "Minimumloon Nederland 2026" },
      ],
    },
  ],
};

export default function MinimumloonNederland2026Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-gray-50">
        <header className="bg-gray-900 text-white">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-400">
            <Link href="/nl" className="hover:text-gray-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-200">Minimumloon 2026</span>
          </div>
          <div className="max-w-3xl mx-auto px-4 pb-10 pt-4">
            <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              🇳🇱 Nederlands arbeidsrecht — update 2026
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Minimumloon Nederland 2026
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
              Het wettelijk minimumloon (WML) bepaalt de wettelijke ondergrens voor alle werknemers
              in Nederland. Dit zijn de exacte bedragen voor 2026: wat uitzendbureaus mogen inhouden
              en wat je nettoloon werkelijk is.
            </p>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-10 space-y-14">

          {/* WML tabel */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">WML-tarieven 2026</h2>
            <p className="text-gray-600 text-sm mb-5">
              De onderstaande tarieven gelden voor werknemers van 21 jaar en ouder. Tarieven worden{" "}
              <strong>1 januari</strong> en <strong>1 juli</strong> bijgesteld.
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-700">Periode</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Bruto bedrag</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">Toelichting</th>
                  </tr>
                </thead>
                <tbody>
                  {WML_RATES.map((r, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3 font-medium text-gray-900">{r.period}</td>
                      <td className="px-4 py-3 font-bold text-emerald-700">{r.gross}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Bron: Rijksoverheid.nl — Wettelijk minimumloon per 1 januari 2026.
            </p>
          </section>

          {/* Nettoloon voorbeeld */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Wat komt er écht op je rekening</h2>
            <p className="text-gray-600 text-sm mb-5">
              Bruto is niet wat je ontvangt. Realistisch weekoverzicht voor een uitzendkracht op WML
              met huisvesting en vervoer via het uitzendbureau.
            </p>
            <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {NET_EXAMPLE.map((row, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center px-5 py-3 text-sm ${
                    i === NET_EXAMPLE.length - 1
                      ? "bg-emerald-50 border-t-2 border-emerald-200 font-bold"
                      : i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <span className={i === NET_EXAMPLE.length - 1 ? "text-gray-900 font-bold" : "text-gray-700"}>
                    {row.label}
                  </span>
                  <span className={`font-semibold tabular-nums ${row.plus ? "text-emerald-700" : "text-red-600"}`}>
                    {row.amount}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Schattingen op basis van tarieven 2026. Loonheffing berekend inclusief algemene
              heffingskorting en arbeidskorting. Werkelijke bedragen afhankelijk van gewerkte uren,
              contractfase en inhoudingsvoorwaarden.
            </p>
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
              <p className="font-semibold text-blue-800 mb-1">💡 ET-vergoeding kan €50–€150/week extra opleveren</p>
              <p className="text-blue-700">
                Woon je meer dan 150 km van de Nederlandse grens? Dan kom je mogelijk in aanmerking
                voor de ET-regeling (extraterritoriale kostenvergoeding) — een belastingvrije
                kostenvergoeding die je nettoloon aanzienlijk verhoogt.{" "}
                <Link href="/nl/et-regeling-nederland" className="underline font-semibold">
                  Lees onze ET-gids →
                </Link>
              </p>
            </div>
          </section>

          {/* Inhoudingen */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Wat mag en mag niet worden ingehouden</h2>
            <p className="text-gray-600 text-sm mb-5">
              De Wet minimumloon (Art. 12) en WAADI (wijziging 2024) stellen strikte regels aan
              inhoudingen op het loon van uitzendkrachten.
            </p>
            <div className="space-y-3">
              {LEGAL_DEDUCTIONS.map((d, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-4 text-sm flex gap-3 ${
                    d.allowed ? "bg-white border-gray-200" : "bg-red-50 border-red-200"
                  }`}
                >
                  <span className="text-2xl shrink-0">{d.icon}</span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{d.label}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        d.allowed ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                      }`}>
                        {d.allowed ? `Max: ${d.max}` : "VERBODEN"}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{d.rule}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ABU/NBBU CAO */}
          <section className="bg-gray-900 text-white rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-3">ABU en NBBU CAO — boven WML</h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              De meeste uitzendkrachten in Nederland vallen onder de{" "}
              <strong className="text-white">ABU CAO</strong> (grotere bureaus) of{" "}
              <strong className="text-white">NBBU CAO</strong> (kleinere bureaus).
              Beide cao&apos;s regelen loonregels boven het wettelijk WML:
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">→</span>
                <span>
                  <strong className="text-white">Fase A (week 1–26):</strong> Minimaal WML-niveau.
                  Na week 26 stap je over naar Fase B, met mogelijk hogere tarieven.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">→</span>
                <span>
                  <strong className="text-white">Inlenersbeloning:</strong> Na 26 weken bij dezelfde
                  opdrachtgever heb je recht op hetzelfde loon als direct medewerkers die hetzelfde
                  werk doen (Art. 8, WAADI). Dat betekent vaak een loonsverhoging.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">→</span>
                <span>
                  <strong className="text-white">Overwerktoeslag:</strong> Overuren (boven 40u/week)
                  worden betaald met 125% voor de eerste 8 extra uren, 150% daarboven (ABU CAO).
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">→</span>
                <span>
                  <strong className="text-white">Vakantiegeld:</strong> 8% vakantiebijslag —
                  wettelijk verplicht, moet als aparte post op elke loonstrook staan.
                </span>
              </li>
            </ul>
          </section>

          {/* Checklist */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Checklist: betaalt jouw uitzendbureau correct?</h2>
            <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
              {[
                "Je uurloon bedraagt minimaal €14,06 (40u/week) of €14,80 (38u/week)",
                "Vakantiegeld (8%) staat als aparte post op je loonstrook",
                "Loonheffing wordt berekend met je BSN — niet met het anoniementarief",
                "De huisvestingsinhouding is maximaal €113,50 per week (SNF-maximum)",
                "Alle inhoudingen zijn schriftelijk aan je meegedeeld vóór ondertekening",
                "Er worden geen 'bemiddelingskosten', 'wervingskosten' of 'administratiekosten' ingehouden",
                "Overuren staan vermeld als overwerk en worden betaald met 125% of meer",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 text-sm">
                  <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Begrijp je loonstrook niet?{" "}
              <Link href="/nl/loonstrook-uitgelegd" className="text-blue-600 underline font-medium">
                Bekijk onze complete loonstrook-uitleg →
              </Link>
            </p>
          </section>

          {/* CTA */}
          <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 md:p-8 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Vind een geverifieerd uitzendbureau</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Werk in Nederland voor volledig WML — met transparante inhoudingen
            </h2>
            <p className="text-gray-600 text-sm mb-5 max-w-lg mx-auto">
              Alle uitzendbureaus op AgencyCheck tonen hun inhoudingen vooraf.
              SNF-gecertificeerde huisvesting, geen bemiddelingskosten, contracten
              gecontroleerd vóór ondertekening. Gratis solliciteren via WhatsApp.
            </p>
            <Link
              href="/vacancies"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Bekijk vacatures bij geverifieerde uitzendbureaus →
            </Link>
          </section>

          {/* ── Bureaus op transparantie ───────────────────────────────────── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welke Uitzendbureaus Betalen Transparant?
            </h2>
            <p className="text-gray-600 text-sm mb-5">
              AgencyCheck heeft {VERIFIED_AGENCIES.length} uitzendbureaus onafhankelijk beoordeeld
              op loonopenbaarheid, SNF-certificering en naleving van de WML. Bureaus met een score
              boven 75 publiceren hun inhoudingen vooraf en staan onder ABU/NBBU toezicht.
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-700">Bureau</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Transparantiescore</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">Huisvesting</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">Stad</th>
                  </tr>
                </thead>
                <tbody>
                  {VERIFIED_AGENCIES
                    .sort((a, b) => b.transparencyScore - a.transparencyScore)
                    .slice(0, 8)
                    .map((agency, i) => (
                      <tr key={agency.slug} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-3">
                          <Link
                            href={`/agencies/${agency.slug}`}
                            className="font-medium text-gray-900 hover:text-emerald-700 hover:underline"
                          >
                            {agency.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                            agency.transparencyScore >= 80
                              ? "bg-emerald-100 text-emerald-800"
                              : agency.transparencyScore >= 65
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {agency.transparencyScore}/100
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell text-gray-600 text-xs">
                          {agency.accommodation === "confirmed_with_deduction" || agency.accommodation === "confirmed_no_deduction"
                            ? "✅ SNF-gecertificeerd"
                            : agency.accommodation === "not_provided"
                            ? "Geen huisvesting"
                            : "Onbekend"}
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell text-gray-500 text-xs">
                          {agency.city ?? "—"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Bron: AgencyCheck verificatie-onderzoek 2026 — gebaseerd op openbare data,
              werknemersmeldingen en officiële registraties. Scores worden periodiek bijgewerkt.
            </p>
            <div className="mt-3 text-center">
              <Link href="/agencies" className="text-sm font-bold text-emerald-700 hover:underline">
                Alle {VERIFIED_AGENCIES.length} geverifieerde bureaus bekijken →
              </Link>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Veelgestelde vragen</h2>
            <div className="space-y-5">
              {FAQS.map((f, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 mb-2 text-base">{f.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Gerelateerde gidsen */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-base font-bold text-gray-700 mb-4">Gerelateerde gidsen</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/nl/loonstrook-uitgelegd",     label: "Loonstrook uitgelegd — elke regel" },
                { href: "/nl/et-regeling-nederland",    label: "ET-regeling — tot €150/week extra netto" },
                { href: "/nl/bsn-nummer-nederland",     label: "BSN-nummer aanvragen in Nederland" },
                { href: "/vacancies",                   label: "Bekijk vacatures in Nederland" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 hover:border-emerald-400 hover:text-emerald-700 transition-colors"
                >
                  <span className="text-emerald-500">→</span>
                  {l.label}
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
