import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Uitzendbureaus Nederland 2026 — Beoordeeld door Werknemers",
  description:
    "Vergelijk uitzendbureaus in Nederland op basis van echte werknemerservaringen. Loon, huisvesting, contract, communicatie. Welk uitzendbureau is het beste voor jou?",
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
    title: "Uitzendbureaus Nederland — Beoordeeld door Werknemers 2026",
    description:
      "Echte ervaringen van werknemers bij Nederlandse uitzendbureaus. Loon, huisvesting, contract en communicatie vergeleken.",
    locale: "nl_NL",
  },
};

export const dynamic = "force-static";

const WHAT_TO_CHECK = [
  {
    title: "Transparantie over inhoudingen",
    icon: "💶",
    body: "Een betrouwbaar bureau toont alle inhoudingen vóóraf schriftelijk: huisvesting (max €113,50/week), vervoer, zorgverzekering. Geen verrassingen op de loonstrook.",
  },
  {
    title: "SNF-gecertificeerde huisvesting",
    icon: "🏠",
    body: "Als het bureau huisvesting aanbiedt, moet het SNF-gecertificeerd zijn. Controleer via snf.nl. Niet-gecertificeerde huisvesting biedt geen wettelijke bescherming.",
  },
  {
    title: "ABU of NBBU lidmaatschap",
    icon: "📋",
    body: "Bureaus die zijn aangesloten bij de ABU (grote bureaus) of NBBU (kleine bureaus) zijn gebonden aan collectieve arbeidsovereenkomsten die je rechten beschermen.",
  },
  {
    title: "ET-regeling",
    icon: "💡",
    body: "Vraag of het bureau de ET-regeling toepast voor in aanmerking komende werknemers. Dit kan €50–€150/week belastingvrij extra opleveren. Niet alle bureaus passen het automatisch toe.",
  },
  {
    title: "Contractvorm en fases",
    icon: "📝",
    body: "Begrijp in welke fase je start (A of B) en wanneer je overgaat naar inlenersbeloning (gelijk loon als direct personeel, na 26 weken bij dezelfde opdrachtgever).",
  },
  {
    title: "Werknemerservaringen",
    icon: "⭐",
    body: "Zoek naar ervaringen van andere werknemers — specifiek over loonuitbetaling, huisvestingskwaliteit en communicatie. Positieve advertenties zeggen minder dan echte werknemerservaringen.",
  },
];

const FAQS = [
  {
    q: "Hoe kies ik het beste uitzendbureau in Nederland?",
    a: "Let op: (1) transparantie over inhoudingen vooraf, (2) SNF-gecertificeerde huisvesting als dit wordt aangeboden, (3) ABU of NBBU lidmaatschap, (4) of de ET-regeling wordt toegepast, (5) echte werknemerservaringen — niet alleen advertenties. Vergelijk altijd meerdere bureaus en lees de kleine lettertjes in het contract.",
  },
  {
    q: "Wat is het verschil tussen ABU en NBBU bureaus?",
    a: "De ABU (Algemene Bond Uitzendondernemingen) vertegenwoordigt grotere uitzendbureaus, de NBBU (Nederlandse Bond van Bemiddelings- en Uitzendondernemingen) kleinere bureaus. Beide hanteren een CAO die je rechten regelt: minimumloon, vakantiegeld, overurentoeslag en inlenersbeloning. In de praktijk zijn de verschillen klein voor de werknemer.",
  },
  {
    q: "Mag een uitzendbureau kosten in rekening brengen voor het vinden van een baan?",
    a: "Nee. Dit is volledig verboden op grond van de WAADI-wijziging 2024. Uitzendbureaus mogen geen bemiddelingskosten, wervingskosten of registratiekosten aan werknemers doorberekenen. Als een bureau dit toch vraagt, is dat illegaal — meld het bij de Inspectie SZW.",
  },
  {
    q: "Wat is inlenersbeloning?",
    a: "Inlenersbeloning (Art. 8 WAADI) geeft uitzendkrachten het recht op hetzelfde loon als direct medewerkers die hetzelfde werk doen bij dezelfde opdrachtgever, na 26 weken werken. Dit geldt voor het volledige beloningspakket inclusief toeslagen en bonussen, niet alleen het basistarief.",
  },
  {
    q: "Hoe controleer ik of een uitzendbureau legitiem is?",
    a: "Controleer: (1) inschrijving bij de Kamer van Koophandel (kvk.nl), (2) ABU of NBBU lidmaatschap, (3) SNA-certificering (Stichting Normering Arbeid) als keurmerk voor naleving van arbeidswetten, (4) SNF-certificering als huisvesting wordt aangeboden. Bureaus zonder deze certificeringen dragen een hoger risico.",
  },
];

export default function UitzendbureausNederlandPage() {
  const crumbSchema = breadcrumbSchema([
    { name: "Home",                    url: "/" },
    { name: "Nederlands",              url: "/nl" },
    { name: "Uitzendbureaus Nederland", url: "/nl/uitzendbureaus-nederland" },
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
            <span className="text-gray-400">Uitzendbureaus Nederland</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            Uitzendbureaus Nederland<br className="hidden sm:block" /> — Beoordeeld door Werknemers
          </h1>
          <p className="text-gray-300 text-base leading-relaxed max-w-2xl mb-6">
            AgencyCheck verzamelt echte ervaringen van uitzendkrachten in Nederland.
            Vergelijk bureaus op loon, huisvesting, contractvorm en communicatie — vóórdat je tekent.
          </p>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-4 py-2 text-emerald-300 text-sm font-bold">
            ⭐ Gebaseerd op echte werknemerservaringen
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-14">

        {/* Direct naar agenturen */}
        <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
          <h2 className="text-xl font-black text-gray-900 mb-3">Bekijk alle beoordeelde uitzendbureaus</h2>
          <p className="text-gray-600 text-sm mb-4">
            Meer dan 150 uitzendbureaus in Nederland beoordeeld op transparantie, huisvesting en werknemerservaringen.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/agencies"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              Alle uitzendbureaus →
            </Link>
            <Link
              href="/best-agencies-with-housing-netherlands"
              className="inline-block bg-white hover:bg-gray-50 text-gray-800 font-bold px-5 py-2.5 rounded-xl border border-gray-200 transition-colors text-sm"
            >
              Bureaus met huisvesting →
            </Link>
          </div>
        </section>

        {/* Wat te controleren */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Waarop Let je bij een Uitzendbureau?</h2>
          <p className="text-sm text-gray-500 mb-6">
            Dit zijn de zes belangrijkste punten om te controleren vóór je tekent.
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

        {/* Rode vlaggen */}
        <section className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">⚠️ Waarschuwingssignalen</h2>
          <div className="space-y-2">
            {[
              "Bureau vraagt kosten voor bemiddeling, werving of registratie",
              "Huisvesting is verplicht als voorwaarde voor de baan",
              "Geen schriftelijk overzicht van inhoudingen voor ondertekening",
              "Huisvesting niet SNF-gecertificeerd",
              "Bureau niet ingeschreven bij ABU, NBBU of SNA",
              "Uurloon onder het wettelijk minimumloon (€14,06 bruto bij 40u/week)",
              "Geen BSN-registratiehulp aangeboden",
            ].map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-red-800">
                <span className="text-red-500 font-bold shrink-0">✗</span>
                <span>{w}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Veelbekende bureaus */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-4">Bekende Uitzendbureaus in Nederland</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { name: "Otto Workforce",   href: "/otto-workforce-review",  note: "Groot, internationaal, veel huisvesting" },
              { name: "Covebo",           href: "/covebo-review",          note: "Focus op productie en logistiek" },
              { name: "Randstad",         href: "/randstad-review",        note: "Grootste bureau van Nederland" },
              { name: "Tempo-Team",       href: "/tempo-team-review",      note: "Breed, ook voor starters" },
            ].map((b) => (
              <Link
                key={b.name}
                href={b.href}
                className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50/30 p-4 transition-all"
              >
                <span className="text-emerald-500 font-black mt-0.5">→</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">{b.name}</p>
                  <p className="text-xs text-gray-500">{b.note}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
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
            { href: "/nl/minimumloon-nederland-2026", label: "Minimumloon 2026",       icon: "📋" },
            { href: "/nl/werk-met-huisvesting",       label: "Werk met huisvesting",   icon: "🏠" },
            { href: "/nl/nettoloon-nederland",         label: "Nettoloon berekenen",    icon: "💶" },
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
