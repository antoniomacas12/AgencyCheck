import type { Metadata } from "next";
import Link from "next/link";
import { HOUSING_AGENCIES, ALL_AGENCIES } from "@/lib/agencyEnriched";

export const metadata: Metadata = {
  title: "Work in Netherlands for Foreigners — Complete Guide 2026 | AgencyCheck",
  description:
    "Complete guide to working in the Netherlands as a foreign worker. How to get a job, what documents you need, salary, housing, rights and top agencies hiring EU workers in 2026.",
  alternates: { canonical: "https://agencycheck.io/work-in-netherlands-for-foreigners" },
  openGraph: {
    title: "Work in Netherlands for Foreigners 2026 — AgencyCheck",
    description:
      "Everything you need to know about working in the Netherlands as a foreigner. Jobs, salary, housing, rights, BSN, taxes.",
  },
};

export default function WorkNetherlandsForeignersPage() {
  const housingCount = HOUSING_AGENCIES.length;
  const agencyCount  = ALL_AGENCIES.length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Work in Netherlands for Foreigners</span>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-1 font-medium">
            🇳🇱 Updated for 2026
          </span>
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2.5 py-1 font-medium">
            💼 {agencyCount} agencies listed
          </span>
          <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2.5 py-1 font-medium">
            🏠 {housingCount} with housing
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
          How to Work in the Netherlands as a Foreign Worker — 2026 Guide
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed">
          The Netherlands is one of Europe&apos;s most attractive countries for foreign workers,
          with a strong minimum wage, organised employment agencies, and high demand for
          warehouse, logistics, and production workers. This guide covers everything you
          need to start working legally in the Netherlands.
        </p>
      </div>

      {/* ── Table of contents ──────────────────────────────────────────────── */}
      <nav className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 text-sm">
        <p className="font-semibold text-gray-800 mb-2">Contents</p>
        <ol className="space-y-1 list-decimal list-inside text-gray-600">
          <li><a href="#eu-citizens" className="hover:text-brand-600">Can EU citizens work in the Netherlands?</a></li>
          <li><a href="#documents" className="hover:text-brand-600">What documents do you need?</a></li>
          <li><a href="#bsn" className="hover:text-brand-600">Getting your BSN number</a></li>
          <li><a href="#agencies" className="hover:text-brand-600">How employment agencies work</a></li>
          <li><a href="#salary" className="hover:text-brand-600">Salary and minimum wage 2026</a></li>
          <li><a href="#housing" className="hover:text-brand-600">Housing through your employer</a></li>
          <li><a href="#taxes" className="hover:text-brand-600">Taxes and 30% ruling</a></li>
          <li><a href="#rights" className="hover:text-brand-600">Your rights as a worker</a></li>
          <li><a href="#top-agencies" className="hover:text-brand-600">Top agencies hiring foreigners</a></li>
        </ol>
      </nav>

      {/* ── Section 1: EU Citizens ─────────────────────────────────────────── */}
      <section id="eu-citizens" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">1. Can EU citizens work in the Netherlands?</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          <strong>Yes — no work permit required.</strong> Citizens of all EU and EEA countries
          (plus Switzerland) have the right to work in the Netherlands without applying for
          a separate work permit (tewerkstellingsvergunning, or TWV).
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          If you are from outside the EU (e.g. Ukraine, India, Philippines), your employer
          must apply for a TWV on your behalf. Most employment agencies that place non-EU workers
          will handle this process.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
          <p className="font-semibold text-green-800">✅ EU/EEA countries that can work freely:</p>
          <p className="text-green-700 text-xs mt-1">
            Austria, Belgium, Bulgaria, Croatia, Cyprus, Czech Republic, Denmark, Estonia,
            Finland, France, Germany, Greece, Hungary, Ireland, Italy, Latvia, Lithuania,
            Luxembourg, Malta, Netherlands, Poland, Portugal, Romania, Slovakia, Slovenia,
            Spain, Sweden — plus Norway, Iceland, Liechtenstein, Switzerland.
          </p>
        </div>
      </section>

      {/* ── Section 2: Documents ──────────────────────────────────────────── */}
      <section id="documents" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">2. What documents do you need?</h2>
        <div className="space-y-2 text-sm">
          {[
            { doc: "Valid passport or EU ID card", required: true, note: "Must be valid for the duration of your contract" },
            { doc: "BSN (Burgerservicenummer)", required: true, note: "Dutch citizen service number — get this first (see below)" },
            { doc: "Dutch bank account (IBAN)", required: true, note: "Most employers require NL IBAN for salary payments" },
            { doc: "DigiD (digital ID)", required: false, note: "Optional but needed for government services, healthcare" },
            { doc: "A1 / E101 certificate", required: false, note: "If you're posted from your home country (detachering)" },
          ].map((item) => (
            <div key={item.doc} className="flex gap-3 p-3 bg-white border border-gray-100 rounded-lg">
              <span className={`text-sm font-semibold shrink-0 ${item.required ? "text-red-600" : "text-gray-400"}`}>
                {item.required ? "REQUIRED" : "OPTIONAL"}
              </span>
              <div>
                <p className="font-medium text-gray-800">{item.doc}</p>
                <p className="text-xs text-gray-500">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 3: BSN ────────────────────────────────────────────────── */}
      <section id="bsn" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">3. Getting your BSN number</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          The BSN (Burgerservicenummer) is your Dutch tax/social security number. You need it
          to work legally, open a bank account, and access healthcare. Without it, your employer
          cannot process your salary correctly.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <p className="font-semibold text-blue-800 mb-2">How to get a BSN:</p>
          <ol className="space-y-1 list-decimal list-inside text-blue-700 text-xs">
            <li>Register at your local municipality (gemeente) — bring your passport</li>
            <li>If you don&apos;t have a permanent address yet, register at a &apos;non-resident&apos; desk (RNI)</li>
            <li>RNI desks are available in 19 major cities including Amsterdam, Rotterdam, Eindhoven</li>
            <li>You will receive your BSN within 1–5 working days</li>
          </ol>
          <p className="text-xs text-blue-600 mt-2">
            Many employment agencies can help you arrange BSN registration as part of onboarding.
          </p>
        </div>
      </section>

      {/* ── Section 4: Agencies ───────────────────────────────────────────── */}
      <section id="agencies" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">4. How Dutch employment agencies work</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          In the Netherlands, employment agencies (uitzendbureaus) are the main route
          to logistics and production jobs for foreign workers. They act as your legal employer
          and are responsible for your salary, housing, and contract.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 text-sm mb-3">
          {[
            { label: "ABU", desc: "Main certification body. Agencies with ABU certificate follow strict wage and housing standards." },
            { label: "NBBU", desc: "Alternative certification. Also well-regulated. Most legitimate agencies have ABU or NBBU." },
            { label: "SNA", desc: "NEN-4400 certified — signals proper payroll and tax compliance." },
            { label: "Fase A/B/C", desc: "Your contract phase. Fase A (first 78 weeks) = most flexible for agency. Fase B/C = more security." },
          ].map((item) => (
            <div key={item.label} className="border border-gray-200 rounded-lg p-3">
              <p className="font-bold text-brand-700">{item.label}</p>
              <p className="text-xs text-gray-600 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
          <strong>Warning:</strong> Avoid agencies that ask you to pay a fee, that offer cash-in-hand work,
          or that can&apos;t show you an ABU/NBBU certificate. These are signs of illegal labour practices.
        </div>
      </section>

      {/* ── Section 5: Salary ─────────────────────────────────────────────── */}
      <section id="salary" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">5. Salary and minimum wage 2026</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-gray-700">Job type</th>
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-gray-700">Hourly rate</th>
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-gray-700">Monthly (40h/wk)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: "Minimum wage (legal floor)", rate: "€14.71", monthly: "~€2,424" },
                { type: "Order picker / warehouse", rate: "€14–€16", monthly: "~€2,400–€2,770" },
                { type: "Production worker", rate: "€14–€17", monthly: "~€2,400–€2,940" },
                { type: "Forklift driver (no certificate)", rate: "€14–€16", monthly: "~€2,400–€2,770" },
                { type: "Forklift driver (VCA/VHT cert)", rate: "€16–€22", monthly: "~€2,770–€3,800" },
                { type: "Reach truck operator", rate: "€16–€20", monthly: "~€2,770–€3,460" },
              ].map((row) => (
                <tr key={row.type} className="border-b border-gray-100">
                  <td className="p-2 border border-gray-200 text-xs text-gray-700">{row.type}</td>
                  <td className="p-2 border border-gray-200 text-xs font-semibold text-green-700">{row.rate}</td>
                  <td className="p-2 border border-gray-200 text-xs text-gray-600">{row.monthly}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">Rates are indicative for 2026. Actual pay depends on agency, sector CAO, and experience.</p>
        <div className="mt-3">
          <Link href="/real-salary-netherlands-after-rent" className="text-xs text-brand-600 hover:underline font-medium">
            → See real take-home salary after housing and tax deductions
          </Link>
        </div>
      </section>

      {/* ── Section 6: Housing ────────────────────────────────────────────── */}
      <section id="housing" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">6. Housing through your employer</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          Many Dutch agencies offer housing (woonruimte) as part of the job package —
          especially for foreign workers who are relocating. This is common at agencies like
          Otto Workforce, Covebo, and GI Group.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm mb-3">
          <p className="font-semibold text-amber-800 mb-2">⚠️ Housing deduction rules (SNF standard):</p>
          <ul className="text-amber-700 text-xs space-y-1 list-disc list-inside">
            <li>Maximum rent deduction is 25% of gross wage (SNF-certified agencies)</li>
            <li>Typical cost: €80–€130/week (shared room), €150–€200/week (own room)</li>
            <li>You have the right to move out at any time — housing cannot be tied to your job</li>
            <li>Accommodation must meet SNF or AKF quality standards</li>
          </ul>
        </div>
        <Link href="/agencies-with-housing" className="text-xs text-brand-600 hover:underline font-medium">
          → See all {housingCount} agencies that offer housing in the Netherlands
        </Link>
      </section>

      {/* ── Section 7: Taxes ──────────────────────────────────────────────── */}
      <section id="taxes" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">7. Taxes and the 30% ruling</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          All workers in the Netherlands pay income tax (loonheffing). Your employer deducts
          this from your gross salary each month.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div className="border border-gray-200 rounded-lg p-3">
            <p className="font-semibold text-gray-800">Tax rates 2026</p>
            <ul className="text-xs text-gray-600 mt-1 space-y-0.5">
              <li>Up to €38,441 → 36.97% (incl. social security)</li>
              <li>Above €38,441 → 49.50%</li>
              <li>Holiday allowance (vakantiegeld) = 8% of gross salary/year</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-3">
            <p className="font-semibold text-gray-800">30% Ruling</p>
            <p className="text-xs text-gray-600 mt-1">
              If you&apos;re recruited from abroad for a specialised role earning over ~€46,000/yr,
              you may qualify for the 30% tax facility. Not applicable to most flex/logistics workers.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 8: Rights ─────────────────────────────────────────────── */}
      <section id="rights" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">8. Your rights as a foreign worker</h2>
        <div className="space-y-3 text-sm">
          {[
            { title: "Equal pay", desc: "You must earn the same as Dutch colleagues doing the same work. Discrimination based on nationality is illegal." },
            { title: "Written contract", desc: "You are entitled to a written employment contract in a language you understand before you start working." },
            { title: "Safe housing", desc: "If the agency provides housing, it must meet safety and quality standards. You can report violations to the SZW Inspectorate." },
            { title: "Healthcare", desc: "All workers in NL must take out basic health insurance (zorgverzekering). Agencies often arrange this. Cost ~€160/month." },
            { title: "Report violations", desc: "If your rights are violated, contact the Inspectorate SZW (inspectorateszw.nl) or FNV trade union for free help." },
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <span className="text-green-600 font-bold text-sm mt-0.5 shrink-0">✓</span>
              <div>
                <p className="font-semibold text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 9: Top agencies ───────────────────────────────────────── */}
      <section id="top-agencies" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">9. Top agencies hiring foreign workers</h2>
        <div className="space-y-2">
          {[
            { name: "Tempo-Team",     slug: "tempo-team-amsterdam-uitzendbureau", jobs: "135+", housing: false, note: "Randstad subsidiary, very large job board across NL" },
            { name: "Otto Workforce", slug: "otto-workforce",                      jobs: "32+",  housing: true,  note: "Specialist in EU workers, always includes housing" },
            { name: "Covebo",         slug: "covebo",                              jobs: "42+",  housing: true,  note: "Strong logistics focus, housing widely available" },
            { name: "GI Group",       slug: "gi-group-temp",                       jobs: "28+",  housing: false, note: "Italian multinational, large presence in NL" },
            { name: "Randstad",       slug: "randstad-nederland",                  jobs: "28+",  housing: false, note: "World's largest staffing company" },
            { name: "Manpower",       slug: "manpower",                            jobs: "42+",  housing: false, note: "ManpowerGroup, global reach" },
          ].map((agency) => (
            <Link key={agency.slug} href={`/agencies/${agency.slug}`} className="block group">
              <div className="card p-3 hover:shadow-sm hover:border-brand-100 transition-all group-hover:-translate-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm text-gray-900 group-hover:text-brand-600">{agency.name}</p>
                    <p className="text-xs text-gray-500">{agency.note}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {agency.housing && (
                      <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full font-medium">🏠</span>
                    )}
                    <span className="text-xs font-semibold text-brand-700">{agency.jobs}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Quick links ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { href: "/jobs-in-netherlands",                   label: "💼 Browse all jobs" },
          { href: "/agencies-with-housing",                 label: "🏠 Housing agencies" },
          { href: "/real-salary-netherlands-after-rent",    label: "💰 Salary calculator" },
          { href: "/compare",                               label: "⚖️ Compare agencies" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex items-center text-xs font-medium bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-3 py-1.5 hover:bg-brand-100 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center">
        Information is for guidance only. Laws and rates change — always verify with official Dutch government sources.
      </p>
    </div>
  );
}
