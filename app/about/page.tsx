import type { Metadata } from "next";
import Link from "next/link";
import { AGENCIES, AGENCIES_WITH_HOUSING } from "@/lib/agencyData";
import { REVIEW_SEED_DATA } from "@/lib/reviewData";
import { LEGAL } from "@/lib/legalConfig";

export const metadata: Metadata = {
  title: "About AgencyCheck — Who We Are and Why We Built This",
  description:
    "AgencyCheck is an independent platform that publishes real take-home salary data, worker reviews, and housing conditions for employment agencies in the Netherlands. Built by someone who has seen workers get exploited firsthand.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const totalAgencies = AGENCIES.length;
  const housingAgencies = AGENCIES_WITH_HOUSING.length;
  const totalReviews = REVIEW_SEED_DATA.length;

  return (
    <div className="min-h-screen bg-white">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="bg-gray-950 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-18">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[10px] font-bold tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Independent · No paid rankings · Netherlands
          </div>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            Who runs AgencyCheck — and why it exists
          </h1>
          <p className="text-gray-300 text-base leading-relaxed max-w-2xl">
            This is not a VC-funded startup. It is not a recruiter. It is not a job board.
            AgencyCheck was built by one person, after watching workers arrive in the Netherlands
            thinking they&apos;d earn €550–€600 a week — and take home €280.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-14">

        {/* ── Founder story ──────────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">The founder</p>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-5">Why this was built</h2>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl px-6 py-5 mb-6">
            <p className="text-sm text-blue-900 leading-relaxed italic">
              &ldquo;I have worked alongside agency workers in the Netherlands. I have watched people arrive with high
              expectations, sign contracts they didn&apos;t understand, live in overcrowded rooms, and receive payslips
              with deductions that were never explained. Most of them didn&apos;t know what they were legally entitled to.
              Most of them didn&apos;t know they could report illegal deductions. AgencyCheck exists to change that.&rdquo;
            </p>
            <p className="text-xs text-blue-600 font-bold mt-3">
              — {/* TODO: Add your name here in legalConfig.ts → LEGAL.legalName */}
              Founder, AgencyCheck
              {LEGAL.legalName !== "AgencyCheck" ? ` · ${LEGAL.legalName}` : ""}
            </p>
          </div>

          <div className="prose prose-gray prose-sm max-w-none text-gray-600 leading-relaxed space-y-4">
            <p>
              The problem is structural. Workers from Poland, Romania, Ukraine and elsewhere arrive in the Netherlands
              knowing they need income — not knowing Dutch law, not knowing their rights, and not knowing which of the
              15,000+ registered agencies will treat them fairly. Agencies know this information asymmetry exists and
              some exploit it.
            </p>
            <p>
              AgencyCheck attacks the information asymmetry directly. We publish what agencies charge for housing
              (and whether it&apos;s legal under SNF standards). We publish real take-home salary breakdowns using
              official 2026 Dutch tax tables. We collect worker reviews and publish them unfiltered — including
              negative ones. We analyse payslips. We build tools that workers can use for free to check if they are
              being paid correctly.
            </p>
            <p>
              No agency has paid us to appear on this site. No agency can pay to have a review removed. No agency
              can pay to rank higher. The data is the data.
            </p>
          </div>
        </section>

        {/* ── What we've built ───────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">What exists today</p>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-5">The platform in numbers</h2>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              { value: `${totalAgencies}+`,  label: "Agencies researched",     detail: "Each individually checked: website, contact, sector, KvK." },
              { value: `${totalReviews}+`,   label: "Worker reports",           detail: "Submitted anonymously. Published unfiltered, including negative." },
              { value: `${housingAgencies}`, label: "Agencies with housing data", detail: "Housing cost, SNF compliance status, and worker ratings." },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <p className="text-3xl font-black text-gray-900 mb-1">{s.value}</p>
                <p className="text-sm font-bold text-gray-700 mb-2">{s.label}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{s.detail}</p>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                icon: "💶",
                title: "Salary calculator",
                body: "Uses official 2026 Dutch loonheffing brackets + both heffingskorting credits. Workers at WML who pay ~10% effective tax, not the 27% that many agencies imply.",
              },
              {
                icon: "📄",
                title: "Payslip checker",
                body: "Upload a loonstrook and verify every line against ABU/NBBU CAO standards, SNF housing limits, and official tax tables.",
              },
              {
                icon: "⭐",
                title: "Worker reviews",
                body: "Structured reviews covering salary, housing, management, and contract clarity. No company can edit or remove a review submitted about them.",
              },
              {
                icon: "🏠",
                title: "Housing data",
                body: "SNF legal maximum is €113.50/wk for shared accommodation. We flag any agency charging above that and show the difference.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5">
                <div className="text-2xl shrink-0">{item.icon}</div>
                <div>
                  <p className="text-sm font-black text-gray-900 mb-1.5">{item.title}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── How we collect data ─────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Data sources</p>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-5">Where the data comes from</h2>

          <div className="space-y-4">
            {[
              {
                icon: "🔍",
                title: "Agency research (our own)",
                status: "Research-verified",
                statusColor: "text-blue-700 bg-blue-50 border-blue-100",
                body: "Each agency profile was built from: official agency website, KvK registration, ABU/NBBU register, LinkedIn, and sector directories. We record what we can verify and clearly flag what we cannot.",
              },
              {
                icon: "👷",
                title: "Worker-submitted reviews",
                status: "Worker-reported",
                statusColor: "text-gray-700 bg-gray-100 border-gray-200",
                body: "Reviews are submitted anonymously by workers who have worked at the agency. We do NOT independently verify individual reviews — we publish them as reported and flag unverified status. Volume and consistency of reports increases credibility.",
              },
              {
                icon: "📋",
                title: "ABU / NBBU / SNA registers",
                status: "Public register",
                statusColor: "text-emerald-700 bg-emerald-50 border-emerald-100",
                body: "We cross-reference agencies against the official ABU, NBBU, and SNA public registers. SNA (Stichting Normering Arbeid) certification requires regular audits — it is the strongest independent quality mark for Dutch temp agencies.",
              },
              {
                icon: "💻",
                title: "Dutch tax authority (Belastingdienst)",
                status: "Official source",
                statusColor: "text-emerald-700 bg-emerald-50 border-emerald-100",
                body: "All salary calculations use the official 2026 loonheffing brackets, AHK (Algemene Heffingskorting) and AK (Arbeidskorting) tables published by belastingdienst.nl. Our methodology page details every constant used.",
              },
              {
                icon: "🏠",
                title: "SNF housing standards",
                status: "Official source",
                statusColor: "text-emerald-700 bg-emerald-50 border-emerald-100",
                body: "Housing deduction limits are sourced from SNF (Stichting Normering Flexwonen) 2024 Normering. The €113.50/week legal maximum for shared rooms is published by SNF and enforceable by law.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 rounded-xl border border-gray-100 p-5">
                <div className="text-xl shrink-0 mt-0.5">{item.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="text-sm font-black text-gray-900">{item.title}</p>
                    <span className={`text-[10px] font-bold border rounded-full px-2 py-0.5 ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── How we make money ────────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-3">Business model</p>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">How AgencyCheck makes money</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            Being honest about this is not optional — it is the only way to maintain trust.
          </p>

          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-900 px-6 py-4">
              <p className="text-xs font-bold text-gray-300">
                Monetization model — last updated: March 2026
              </p>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                {
                  q: "Do agencies pay to appear on the site?",
                  a: "No. Every agency in our database was added from public research, not because they paid us. There is no listing fee.",
                },
                {
                  q: "Can agencies pay to rank higher?",
                  a: "No. Rankings are calculated entirely from worker-submitted data. An agency with 1 star cannot pay to become 5 stars. Money does not touch the algorithm.",
                },
                {
                  q: "Can agencies pay to remove reviews?",
                  a: "No. Reviews are published as submitted. Agencies can flag a review for factual errors, but they cannot delete or suppress worker reports.",
                },
                {
                  q: "How do you make money then?",
                  a: "When a worker uses our matching service and is successfully placed with an agency, that agency pays us a finder's fee. This is a standard industry practice. The fee is paid by the agency — workers always use AgencyCheck for free.",
                },
                {
                  q: "Does the matching service affect ratings or rankings?",
                  a: "No. We match workers with agencies that have good ratings. Agencies do not become matching partners because of payment — they become partners because they have solid worker reviews and transparent contracts.",
                },
              ].map((item) => (
                <div key={item.q} className="px-6 py-4">
                  <p className="text-sm font-bold text-gray-900 mb-1">{item.q}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── What we are not ─────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4">What AgencyCheck is not</h2>
          <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-6 space-y-3">
            {[
              { bold: "Not a recruiter.",    text: "We do not hire you, represent you, or act as intermediary between you and an employer." },
              { bold: "Not a job board.",    text: "We do not post job listings. We publish information about agencies so you can approach them yourself — or use our matching service if you prefer." },
              { bold: "Not legal advice.",   text: "Nothing on this site constitutes legal advice. For employment disputes contact FNV, CNV, or the Inspectie SZW." },
              { bold: "Not guaranteed.",     text: "Worker reviews are community-submitted. We cannot verify every report. High volume of consistent reviews increases reliability, but we flag unverified status on every review." },
              { bold: "Not affiliated.",     text: "No agency has paid to appear here. No agency can pay to influence content. We have no ownership or financial relationship with any agency we cover." },
            ].map((item) => (
              <p key={item.bold} className="text-sm text-amber-900 leading-relaxed">
                <strong>{item.bold}</strong> {item.text}
              </p>
            ))}
          </div>
        </section>

        {/* ── Contact ─────────────────────────────────────────────────────── */}
        <section className="border-t border-gray-100 pt-10">
          <h2 className="text-xl font-black text-gray-900 mb-4">Contact</h2>
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {[
              { label: "General questions",  email: "hello@agencycheck.nl",    detail: "Response within 2 working days." },
              { label: "Privacy / GDPR",     email: "privacy@agencycheck.nl",  detail: "Data requests handled within 30 days per GDPR Art. 12." },
              { label: "Agency data errors", email: "agencies@agencycheck.nl", detail: "Factual corrections and update requests." },
              { label: "Legal enquiries",    email: "legal@agencycheck.nl",    detail: "Legal notices and formal correspondence." },
            ].map((c) => (
              <div key={c.label} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">{c.label}</p>
                <a href={`mailto:${c.email}`} className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                  {c.email}
                </a>
                <p className="text-[11px] text-gray-400 mt-1">{c.detail}</p>
              </div>
            ))}
          </div>

          {LEGAL.address.street && (
            <p className="text-xs text-gray-500">
              Registered address: {LEGAL.address.street}, {LEGAL.address.postcode} {LEGAL.address.city}, {LEGAL.address.country}.
              {LEGAL.kvkNumber ? ` KvK: ${LEGAL.kvkNumber}.` : ""}
            </p>
          )}
        </section>

        {/* ── Quick links ─────────────────────────────────────────────────── */}
        <section className="border-t border-gray-100 pt-8">
          <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Explore</p>
          <div className="flex flex-wrap gap-2">
            {[
              { href: "/agencies",              label: `Browse ${totalAgencies}+ agencies →` },
              { href: "/agencies-with-housing", label: `${housingAgencies} agencies with housing →` },
              { href: "/tools/real-income-calculator", label: "Salary calculator →" },
              { href: "/reviews",               label: "Worker reviews →" },
              { href: "/methodology",           label: "Methodology →" },
              { href: "/contact",               label: "Contact →" },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className="text-xs font-semibold text-blue-600 border border-blue-200 bg-blue-50 rounded-full px-3 py-1.5 hover:bg-blue-100 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
