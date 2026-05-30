import type { Metadata } from "next";
import Link from "next/link";
import { AGENCIES_WITH_HOUSING } from "@/lib/agencyData";
import AgencyCard from "@/components/AgencyCard";
import { getJobCountForAgency } from "@/lib/jobData";

export const metadata: Metadata = {
  title: "Work in the Netherlands from Slovakia 2026 — Complete Guide for Slovak Workers",
  description:
    "Everything Slovak workers need to know: travel from Slovakia, BSN registration, ET benefit eligibility, housing, typical wages, and how to choose a verified agency in the Netherlands.",
  alternates: { canonical: "https://agencycheck.io/work-netherlands-from-slovakia" },
  openGraph: {
    title: "Work Netherlands from Slovakia — Wages, Housing & First Steps",
    description:
      "Slovak workers in the Netherlands: Bratislava is 1,300km from Amsterdam — you qualify for the ET benefit. Here is what that means for your net income.",
  },
};

export const dynamic = "force-static";

// ─── Key facts ────────────────────────────────────────────────────────────────
const KEY_FACTS = [
  {
    icon: "🇸🇰",
    title: "No work permit needed",
    body: "Slovakia is an EU member state. As a Slovak citizen you have the unconditional right to live and work in the Netherlands from day one. No visa, no work permit application, no sponsor required. Your Slovak ID card (občiansky preukaz) is sufficient.",
  },
  {
    icon: "📍",
    title: "Distance from Slovakia: 1,100–1,400km",
    body: "Bratislava to Amsterdam is approximately 1,280km. This means virtually all Slovak workers automatically qualify for the ET (Extraterritoriale kosten) benefit — a tax-free reimbursement worth €50–€150/week net on top of your wage. The qualifying threshold is 150km from the Dutch border.",
  },
  {
    icon: "🏠",
    title: "Housing is typically included",
    body: "Most agencies placing Slovak workers include SNF-certified accommodation in the work package. You do not need to find your own apartment. Cost is deducted from your gross wage at a maximum of €113.50/week (2026 SNF limit) — no upfront deposit.",
  },
  {
    icon: "📋",
    title: "Slovak-speaking recruiters available",
    body: "Several agencies in the Eindhoven, Venlo, and Tilburg regions have Slovak-speaking staff or work with Slovak sub-contractors. The Slovak community in Eindhoven and the Brabant region is established — Slovak churches, shops, and community groups are present.",
  },
];

// ─── Net pay example ─────────────────────────────────────────────────────────
const NET_COMPARISON = [
  {
    label: "Agency without ET",
    rows: [
      { item: "Gross weekly wage (WML, 40h)", amount: "+€547" },
      { item: "Loonheffing + premiums",        amount: "−€96"  },
      { item: "Housing (SNF standard)",         amount: "−€95"  },
      { item: "Transport",                      amount: "−€25"  },
      { item: "Health insurance",               amount: "−€40"  },
      { item: "ET vergoeding",                  amount: "€0"    },
    ],
    net: "≈ €291/wk",
    highlight: false,
  },
  {
    label: "Agency with ET (you qualify)",
    rows: [
      { item: "Gross weekly wage (WML, 40h)", amount: "+€547" },
      { item: "Loonheffing + premiums (reduced)", amount: "−€38" },
      { item: "Housing (SNF standard)",         amount: "−€95"  },
      { item: "Transport",                      amount: "−€25"  },
      { item: "Health insurance",               amount: "−€40"  },
      { item: "ET vergoeding (tax-free)",        amount: "+€84"  },
    ],
    net: "≈ €433/wk",
    highlight: true,
  },
];

// ─── Steps ────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    step: "1",
    title: "Choose a verified agency before you travel",
    body: "Do not travel without a confirmed contract. A verified agency should provide a signed arbeidsovereenkomst (employment contract) with your start date, hourly rate, housing address, and itemised deductions before you book travel. Agencies on AgencyCheck show this upfront.",
  },
  {
    step: "2",
    title: "Travel to the Netherlands",
    body: "The most common routes from Slovakia: bus (FlixBus / RegioJet, 14–18h, Vienna or Bratislava → Amsterdam / Rotterdam / Eindhoven), or train via Vienna–Frankfurt–Amsterdam (12–14h). Flying via Vienna or Bratislava is also an option for shorter distances. Your agency should confirm your housing address so you know where to go on arrival.",
  },
  {
    step: "3",
    title: "Register at an RNI desk and get your BSN",
    body: "Within your first week, your agency should take you to an RNI (Registratie Niet-Ingezetene) desk to register your details and receive your BSN (Burgerservicenummer) — your Dutch tax ID number. Without a BSN, your employer must apply the emergency tax rate (anoniementarief / noodloon), which withholds 40–52% of your gross pay. Getting your BSN quickly is essential.",
  },
  {
    step: "4",
    title: "Confirm your ET vergoeding is in your contract",
    body: "Since Bratislava is more than 1,280km from Amsterdam, you almost certainly qualify for the ET benefit. Ask your recruiter before signing: 'Je ET-vergoeding opgenomen in mijn contract?' (Is the ET benefit included in my contract?) If yes, your loonstrook will show a line 'ET vergoeding' or 'Onkostenvergoeding belastingvrij'. If no, consider comparing agencies — the difference can be €100–€150/week net.",
  },
  {
    step: "5",
    title: "Open a Dutch bank account (optional but useful)",
    body: "Your wage is typically paid to a Dutch or SEPA bank account. Many Slovak workers use their Slovak bank (Slovenská sporiteľňa, Tatra banka, VÚB) with a SEPA IBAN — this works fine for Dutch salary deposits. Alternatively, ING and ABN AMRO offer basic accounts to EU workers with a BSN.",
  },
];

// ─── Popular cities ────────────────────────────────────────────────────────────
const POPULAR_CITIES = [
  { city: "Eindhoven",       reason: "Largest Slovak community in NL. Logistics, warehouse, and light manufacturing." },
  { city: "Tilburg",         reason: "Large logistics hub (DHL, PostNL). Established Eastern European community." },
  { city: "Venlo",           reason: "Border logistics hub close to Germany. Many distribution centres." },
  { city: "Den Bosch",       reason: "Food production and logistics. Close to Eindhoven." },
  { city: "Westland",        reason: "Greenhouse horticulture capital — if you want greenhouse work." },
  { city: "Rotterdam area",  reason: "Port logistics, manufacturing, food processing. Large agencies operating here." },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Can Slovak citizens work in the Netherlands without a work permit?",
    a: "Yes. Slovakia is a full EU member state and Slovak citizens have the unconditional right to work in the Netherlands under EU freedom of movement (Vrij verkeer van werknemers). You do not need a work permit, visa, or employment sponsor. Your Slovak občiansky preukaz (ID card) or passport is the only document required. There is no quota, no registration fee, and no minimum income requirement to start.",
  },
  {
    q: "How much do Slovak workers earn in the Netherlands?",
    a: "Most Slovak workers start at the Dutch statutory minimum wage (WML) — €13.68/hour gross (40h/wk) in 2026, or approximately €547/week gross. After deductions for housing, tax, and insurance, a realistic take-home is €280–€300/week without ET, or €400–€450/week with the ET (Extraterritoriale kosten) benefit. Since Bratislava is ~1,280km from Amsterdam, virtually all Slovak workers qualify for ET — but not all agencies apply it.",
  },
  {
    q: "What is the Slovak community like in the Netherlands?",
    a: "The Slovak community in the Netherlands is most concentrated in and around Eindhoven, Tilburg, and Den Bosch in the North Brabant province. You will find Slovak Catholic churches, Slovak Facebook groups (e.g. 'Slováci v Holandsku'), Slovak grocery items in Polish/Eastern European shops, and Slovak-speaking recruiters at several agencies. Eindhoven in particular has a long-standing Slovak worker presence going back to the early 2000s.",
  },
  {
    q: "Does the ET benefit apply to Slovak workers?",
    a: "Almost certainly yes. The main qualifying criterion for the ET (Extraterritoriale kosten) benefit is that your permanent home address is more than 150km from the nearest point of the Dutch border. Bratislava is approximately 1,280km from Amsterdam and over 900km from the nearest Dutch border point. You must have been in the Netherlands for fewer than 5 years (60 months), and the ET clause must be included in your employment contract. The benefit is worth typically €50–€150/week net. See our dedicated ET guide for the full calculation.",
  },
  {
    q: "How long does it take to get a BSN in the Netherlands?",
    a: "At an RNI (Registratie Niet-Ingezetene) desk, your BSN is typically issued on the same day as your appointment. Most agencies in high-volume areas arrange the RNI appointment within your first 3–5 working days. Slovakia has an RNI-recognized registration path — bring your Slovak ID card or passport, employment contract, and proof of Dutch address. Without a BSN, your employer must withhold tax at the emergency rate (anoniementarief), which can mean only 50–60% of gross reaching your account in the first week.",
  },
];

// ─── JSON-LD ─────────────────────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Work in the Netherlands from Slovakia 2026 — Complete Guide for Slovak Workers",
      "description": "Travel, BSN registration, ET benefit, housing, wages and agencies for Slovak workers in the Netherlands.",
      "url": "https://agencycheck.io/work-netherlands-from-slovakia",
      "datePublished": "2026-01-01",
      "dateModified": "2026-05-01",
      "author": { "@type": "Organization", "name": "AgencyCheck" },
      "publisher": { "@type": "Organization", "name": "AgencyCheck", "url": "https://agencycheck.io" },
      "inLanguage": "en",
      "about": { "@type": "Place", "name": "Netherlands" },
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
        { "@type": "ListItem", "position": 1, "name": "Home",   "item": "https://agencycheck.io" },
        { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://agencycheck.io/guides" },
        { "@type": "ListItem", "position": 3, "name": "Work Netherlands from Slovakia" },
      ],
    },
  ],
};

export default function WorkNetherlandsFromSlovakiaPage() {
  const agencies = AGENCIES_WITH_HOUSING.slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* ── Header ── */}
        <header className="bg-gray-900 text-white">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-gray-300 transition-colors">Guides</Link>
            <span>/</span>
            <span className="text-gray-200">Work from Slovakia</span>
          </div>
          <div className="max-w-3xl mx-auto px-4 pb-10 pt-4">
            <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              🇸🇰 → 🇳🇱 Slovak workers in the Netherlands
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Work in the Netherlands from Slovakia
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
              Slovak citizens have the same right to work in the Netherlands as Dutch citizens —
              no permit, no visa, no waiting list. Here is a complete guide: what to check before
              you travel, how much you will earn, why the ET benefit matters, and how to find a
              legitimate agency.
            </p>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-10 space-y-14">

          {/* ── Key facts ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-5">4 things to know before you go</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {KEY_FACTS.map((f, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 text-sm">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── ET net pay comparison ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Why the ET benefit matters for Slovaks</h2>
            <p className="text-gray-600 text-sm mb-5">
              Bratislava is ~1,280km from Amsterdam. That means you qualify for the ET
              (Extraterritoriale kosten) benefit — but only if your agency includes it in your
              contract. Here is the difference:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {NET_COMPARISON.map((col) => (
                <div
                  key={col.label}
                  className={`rounded-xl border p-5 text-sm ${
                    col.highlight
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <h3 className={`font-bold mb-3 ${col.highlight ? "text-emerald-800" : "text-gray-700"}`}>
                    {col.label}
                  </h3>
                  <div className="space-y-1.5 mb-3">
                    {col.rows.map((r, i) => (
                      <div key={i} className="flex justify-between gap-2">
                        <span className="text-gray-600">{r.item}</span>
                        <span className={`font-semibold tabular-nums ${r.amount.startsWith("+") ? "text-emerald-700" : r.amount.startsWith("−") ? "text-red-600" : "text-gray-500"}`}>
                          {r.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className={`border-t pt-2 font-bold text-lg ${col.highlight ? "text-emerald-700 border-emerald-200" : "text-gray-700 border-gray-200"}`}>
                    Net: {col.net}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Estimates based on WML 40h/wk, standard SNF housing, and 2026 tax rates. Actual amounts
              vary by contract phase and individual tax situation.{" "}
              <Link href="/et-scheme-netherlands-explained" className="text-blue-600 underline">
                Full ET guide →
              </Link>
            </p>
          </section>

          {/* ── Step by step ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Step by step: from Slovakia to your first payslip</h2>
            <div className="space-y-4">
              {STEPS.map((s) => (
                <div key={s.step} className="flex gap-4 bg-white border border-gray-200 rounded-xl p-5 text-sm">
                  <div className="w-8 h-8 rounded-full bg-gray-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Popular cities ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Where Slovak workers typically work</h2>
            <p className="text-gray-600 text-sm mb-4">
              Most Slovak workers are placed in North Brabant and Limburg — closer to Belgium and
              Germany, with strong logistics sectors and established Eastern European communities.
            </p>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {POPULAR_CITIES.map((c, i) => (
                <div key={i} className={`flex gap-4 px-5 py-3 text-sm items-start ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <span className="font-semibold text-gray-900 w-32 shrink-0">{c.city}</span>
                  <span className="text-gray-600">{c.reason}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Agency CTA ── */}
          <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 md:p-8 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">For Slovak workers</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Find a verified agency hiring from Slovakia right now
            </h2>
            <p className="text-gray-600 text-sm mb-5 max-w-lg mx-auto">
              All agencies on AgencyCheck show their deductions before you apply — housing cost,
              transport, and whether the ET benefit is included. Free to apply via WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/vacancies"
                className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                Browse vacancies →
              </Link>
              <Link
                href="/sk"
                className="inline-block bg-white border border-gray-300 hover:border-emerald-400 text-gray-800 font-bold px-6 py-3 rounded-xl transition-colors"
              >
                Slovenská verzia →
              </Link>
            </div>
          </section>

          {/* ── Agencies ── */}
          {agencies.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Agencies hiring Slovak workers</h2>
              <div className="grid gap-4">
                {agencies.map((a) => (
                  <AgencyCard key={a.slug} agency={a} jobCount={getJobCountForAgency(a.slug)} />
                ))}
              </div>
            </section>
          )}

          {/* ── FAQ ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently asked questions</h2>
            <div className="space-y-5">
              {FAQS.map((f, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 mb-2 text-base">{f.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Related ── */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-base font-bold text-gray-700 mb-4">Related guides</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/et-scheme-netherlands-explained",  label: "ET scheme — earn up to €150/wk extra" },
                { href: "/bsn-number-netherlands-guide",     label: "BSN number — how to get it fast" },
                { href: "/how-to-read-dutch-payslip",        label: "How to read your Dutch payslip" },
                { href: "/minimum-wage-netherlands-2026",    label: "Minimum wage Netherlands 2026" },
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
