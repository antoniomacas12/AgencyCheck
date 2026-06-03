import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemaMarkup";
import { AGENCIES_WITH_HOUSING, type AgencyCardData } from "@/lib/agencyData";

export const metadata: Metadata = {
  title: "BSN-nummer Nederland 2026 — Aanvragen als EU-uitzendkracht",
  description:
    "Hoe vraag je een BSN-nummer aan in Nederland als uitzendkracht uit de EU? RNI-registratie, benodigde documenten, doorlooptijd en wat je bureau moet regelen. Inclusief lijst van RNI-loketten.",
  alternates: {
    canonical: "https://agencycheck.io/nl/bsn-nummer-nederland",
    languages: {
      "en":        "https://agencycheck.io/bsn-number-netherlands-guide",
      "nl":        "https://agencycheck.io/nl/bsn-nummer-nederland",
      "pl":        "https://agencycheck.io/pl/numer-bsn-holandia",
      "ro":        "https://agencycheck.io/ro/numarul-bsn-olanda",
      "x-default": "https://agencycheck.io/bsn-number-netherlands-guide",
    },
  },
  openGraph: {
    title: "BSN-nummer Aanvragen Nederland — Complete Gids 2026",
    description:
      "Stap voor stap: je BSN-nummer aanvragen als EU-uitzendkracht. RNI vs gemeente, benodigde documenten, DigiD en wat er gebeurt zonder BSN.",
    locale: "nl_NL",
  },
};

export const dynamic = "force-static";

const STEPS = [
  {
    step: "1",
    title: "Kom naar Nederland",
    body: "Als EU/EER-burger heb je het recht om in Nederland te wonen en te werken vanaf de eerste dag — zonder werkvergunning. Je hoeft je niet te registreren of een aanvraag in te dienen vóór aankomst. Je uitzendbureau heeft al een bevestigde startdatum voor je.",
    tip: null,
  },
  {
    step: "2",
    title: "Registreer je bij een RNI-loket of gemeente",
    body: "Je moet je verblijf in Nederland registreren om een BSN te ontvangen. Er zijn twee routes afhankelijk van of je een vast woonadres hebt of bureau-huisvesting.",
    tip: "RNI-registratie (Registratie Niet-Ingezetenen) is bedoeld voor werknemers zonder vast adres in Nederland — typisch bureau-huisvesting. Er zijn 19 RNI-loketten in grote gemeenten, waaronder Rotterdam, Amsterdam, Eindhoven, Den Haag, Venlo en Breda. Je bureau moet aangeven welk loket het dichtst bij is en kan vervoer regelen.",
  },
  {
    step: "3",
    title: "Neem de juiste documenten mee",
    body: "Ongeacht of je je registreert bij een RNI-loket of gemeente, heb je nodig: (1) geldig identiteitsbewijs of paspoort, (2) bewijs van werk in Nederland — een arbeidsovereenkomst met het uitzendbureau, (3) adresbewijs — een bureau-huisvestingsbrief met volledig adres is geaccepteerd.",
    tip: "Sommige gemeenten vragen ook een geboorteakte. Vraag het bureau van tevoren wat het lokale RNI-loket vereist. Afspraken zijn doorgaans online te maken. Het identiteitsbewijs moet geldig zijn.",
  },
  {
    step: "4",
    title: "Ontvang je BSN",
    body: "Bij een RNI-loket krijg je het BSN doorgaans dezelfde dag. Bij de gemeente kan het tot 5 werkdagen duren. Je BSN is een 9-cijferig nummer. Bewaar het goed — je hebt het nodig voor loonstrook, zorgverzekering, bankrekening en DigiD.",
    tip: "Je bureau heeft je BSN nodig om loon en loonheffing correct te verwerken. Zolang je BSN niet is geregistreerd, moet de werkgever het hoogste belastingtarief toepassen (noodloon / anoniementarief), wat in de eerste week tot een aanzienlijk lagere uitbetaling leidt.",
  },
  {
    step: "5",
    title: "Vraag DigiD aan (optioneel maar aanbevolen)",
    body: "DigiD is het Nederlandse digitale identiteitssysteem — een aparte inlog voor overheidsdiensten: belastingaangifte (Belastingdienst), zorgtoeslag, huurtoeslag. Het is niet hetzelfde als je BSN, maar je hebt je BSN nodig om DigiD aan te vragen.",
    tip: "Aanvragen via digid.nl. Activering duurt 5–7 dagen per brief op je geregistreerde adres. Als je later toeslagen wilt aanvragen die je woonlasten verlagen, is DigiD vereist.",
  },
];

const DOCUMENTS = [
  { doc: "Geldig identiteitsbewijs of paspoort",    note: "Moet actueel zijn — verlopen bewijs wordt geweigerd" },
  { doc: "Arbeidsovereenkomst met uitzendbureau",   note: "Bevestigt dat je in Nederland werkt" },
  { doc: "Adresbewijs in Nederland",                note: "Een bureaubrief met volledig woonadres is geaccepteerd" },
  { doc: "Geboorteakte (sommige gemeenten)",        note: "Vraag het specifieke RNI-loket van tevoren" },
];

const RNI_DESKS = [
  "Amsterdam", "Rotterdam", "Den Haag", "Utrecht", "Eindhoven",
  "Tilburg", "Groningen", "Almere", "Breda", "Nijmegen",
  "Enschede", "Arnhem", "Haarlem", "Haarlemmermeer", "Zaanstad",
  "Venlo", "Maastricht", "Dordrecht", "Zwolle",
];

const FAQS = [
  {
    q: "Hoe lang duurt het om een BSN te krijgen in Nederland?",
    a: "Bij een RNI-loket krijg je het BSN doorgaans dezelfde dag. Bij de gemeente kan het tot 5 werkdagen duren. De meeste uitzendbureaus regelen de RNI-afspraak binnen de eerste 3–5 werkdagen na aankomst. Zonder BSN past de werkgever het hoogste belastingtarief toe (noodloon), wat direct invloed heeft op je eerste loonstrook.",
  },
  {
    q: "Kan ik in Nederland werken zonder BSN?",
    a: "Je kunt beginnen met werken, maar de werkgever moet het noodtarief toepassen (noodloon/anoniementarief) totdat je BSN is verwerkt. Dat betekent een aanzienlijk lagere uitbetaling — soms 40–50% ingehouden in plaats van de normale 10–15%. Na registratie en doorgave van je BSN wordt het correcte tarief toegepast. Te veel betaalde belasting uit de eerste periode wordt doorgaans verrekend in de jaarlijkse aangifte.",
  },
  {
    q: "Welke documenten heb ik nodig voor RNI-registratie?",
    a: "Je hebt nodig: (1) geldig identiteitsbewijs of paspoort, (2) arbeidsovereenkomst met het uitzendbureau als bewijs van werk, (3) adresbewijs — een bureaubrief met volledig adres. Sommige loketten vragen ook een geboorteakte. Vraag je bureau van tevoren wat het specifieke loket vereist.",
  },
  {
    q: "Moet mijn uitzendbureau helpen bij het aanvragen van een BSN?",
    a: "Ja. Een betrouwbaar uitzendbureau regelt de RNI-afspraak voor je, organiseert vervoer naar het loket en helpt met de benodigde documenten. Als een bureau zegt dat je dit zelf moet regelen zonder enige ondersteuning, is dat een waarschuwingssignaal.",
  },
  {
    q: "Wat is het verschil tussen BSN en DigiD?",
    a: "Je BSN (Burgerservicenummer) is een uniek 9-cijferig identificatienummer voor alle overheidsdiensten. DigiD is een aparte inlog (gebruikersnaam + wachtwoord) om online in te loggen bij overheidsdiensten. Je hebt je BSN nodig om DigiD aan te vragen, maar het zijn twee verschillende dingen.",
  },
];

export default function BsnNummerNederland() {
  const crumbSchema = breadcrumbSchema([
    { name: "Home",              url: "/" },
    { name: "Nederlands",        url: "/nl" },
    { name: "BSN-nummer Nederland", url: "/nl/bsn-nummer-nederland" },
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
            <span className="text-gray-400">BSN-nummer Nederland</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            BSN-nummer Aanvragen<br className="hidden sm:block" /> in Nederland — 2026
          </h1>
          <p className="text-gray-300 text-base leading-relaxed max-w-2xl mb-6">
            Als EU-uitzendkracht in Nederland heb je een BSN-nummer nodig voor loon, belasting
            en verzekering. Dit is de stap-voor-stap gids — van aankomst tot registratie.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-14">

        {/* Stappen */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-6">Stap voor Stap naar je BSN</h2>
          <div className="space-y-5">
            {STEPS.map((s) => (
              <div key={s.step} className="rounded-2xl border border-gray-100 p-5 flex gap-4">
                <div className="w-9 h-9 rounded-full bg-gray-900 text-white text-sm font-black flex items-center justify-center shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-base mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
                  {s.tip && (
                    <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-800 leading-relaxed">
                      💡 {s.tip}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Documenten */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-4">Benodigde Documenten</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Document</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Toelichting</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {DOCUMENTS.map((d, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-900">{d.doc}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{d.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* RNI loketten */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-3">RNI-loketten in Nederland</h2>
          <p className="text-sm text-gray-500 mb-4">
            Er zijn 19 officiële RNI-loketten. Je kunt ook terecht bij je gemeente als je een vast adres hebt.
          </p>
          <div className="flex flex-wrap gap-2">
            {RNI_DESKS.map((city) => (
              <span key={city} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-medium">
                {city}
              </span>
            ))}
          </div>
        </section>

        {/* Waarschuwing noodtarief */}
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h2 className="text-lg font-black text-gray-900 mb-2">⚠️ Zonder BSN: noodtarief van toepassing</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Zolang je bureau je BSN niet heeft, wordt het <strong>anoniementarief (noodloon)</strong> toegepast —
            tot 52% inhouding in plaats van ~10–15%. Dit leidt tot een aanzienlijk lagere eerste uitbetaling.
            Na doorgave van je BSN wordt het correcte tarief toegepast en wordt de overpayment verrekend in
            de jaarlijkse aangifte. Zorg dus dat je zo snel mogelijk je BSN aanvraagt.
          </p>
        </section>

        {/* ── Bureaus die BSN-registratie regelen ──────────────────────── */}
        <section className="rounded-2xl border border-blue-100 bg-blue-50/30 p-5">
          <h2 className="text-lg font-black text-gray-900 mb-2">
            Welk Bureau Regelt BSN-registratie voor Jou?
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Betrouwbare bureaus regelen de RNI-afspraak binnen 3–5 werkdagen na aankomst.
            Bureaus met een hogere transparantiescore op AgencyCheck bieden doorgaans
            betere onboardingondersteuning — inclusief BSN, zorgverzekering en DigiD.
          </p>
          <div className="space-y-2">
            {AGENCIES_WITH_HOUSING
              .sort((a, b) => b.score - a.score)
              .slice(0, 5)
              .map((agency) => (
                <div key={agency.slug} className="flex items-center justify-between rounded-lg bg-white border border-blue-100 px-3 py-2.5">
                  <Link
                    href={`/agencies/${agency.slug}`}
                    className="text-sm font-semibold text-gray-900 hover:text-blue-700 hover:underline"
                  >
                    {agency.name}
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 hidden sm:inline">
                      {agency.city}
                    </span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                      agency.score >= 80 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {agency.score}/100
                    </span>
                  </div>
                </div>
              ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            <Link href="/agencies" className="underline">Alle geverifieerde bureaus →</Link>
          </p>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-5">Veelgestelde Vragen over BSN</h2>
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
            { href: "/nl/loonstrook-uitgelegd",      label: "Loonstrook begrijpen",  icon: "📄" },
            { href: "/nl/minimumloon-nederland-2026", label: "Minimumloon 2026",      icon: "📋" },
            { href: "/nl/et-regeling-nederland",      label: "ET-regeling",           icon: "💡" },
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
