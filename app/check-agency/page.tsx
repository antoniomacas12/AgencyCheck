import type { Metadata } from "next";
import Link from "next/link";
import { faqPageSchema, breadcrumbSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "How to Check if a Work Agency in the Netherlands is Legit (2026 Guide)",
  description:
    "Check if a job agency in the Netherlands is legit before you go. Learn how to verify housing, salary, contracts and avoid hidden costs.",
  alternates: { canonical: "https://agencycheck.io/check-agency" },
  openGraph: {
    title: "How to Check if a Work Agency in the Netherlands is Legit (2026 Guide)",
    description:
      "Check if a job agency in the Netherlands is legit before you go. Verify housing, salary, contracts and avoid hidden costs.",
    images: [{ url: "https://agencycheck.io/logo.png", width: 512, height: 512, alt: "AgencyCheck" }],
  },
};

const FAQ_ITEMS = [
  {
    question: "How do I check if an agency is legit in the Netherlands?",
    answer:
      "Search their name on kvk.nl — every real agency has a KvK registration number. If you can't find them, or the name is vague and doesn't match what they told you, stop. Also check if they're listed under ABU or NBBU at abu.nl.",
  },
  {
    question: "What is SNF housing certification?",
    answer:
      "SNF is the Dutch body that inspects housing provided by employment agencies. If an agency has SNF certification, their accommodation has passed safety and hygiene checks, and they can't charge more than €113.50/week for a shared room. Without it, you have no guarantee on what you're walking into.",
  },
  {
    question: "How much do workers really earn per week in the Netherlands?",
    answer:
      "At minimum wage (€14.71/hr, 40h/week), gross is €588. After Dutch tax, housing, health insurance, and transport deductions, most agency workers actually keep €300–€380/week. Some less. Always ask for a written salary breakdown before you agree to anything.",
  },
  {
    question: "What are hidden costs in agency jobs in the Netherlands?",
    answer:
      "Housing (€80–€115/week), health insurance (€30–€40/week), transport to the job (€20–€30/week), and sometimes admin or service fees. These are all taken from your gross salary. An agency that won't tell you exact amounts before you sign is a red flag.",
  },
];

export default function CheckAgencyPage() {
  const faqSchema   = faqPageSchema(FAQ_ITEMS);
  const breadcrumbs = breadcrumbSchema([
    { name: "Home",             url: "/" },
    { name: "Check an agency",  url: "/check-agency" },
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Check if a Work Agency in the Netherlands is Legit",
    "description":
      "Four checks to do before signing with any Dutch employment agency.",
    "totalTime": "PT15M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Check KvK registration",
        "text": "Search the agency name on kvk.nl. Every legitimate Dutch agency must be registered with the KvK (Chamber of Commerce). No registration means no legal protection for you.",
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Check SNF housing certification",
        "text": "If the agency provides housing, verify their SNF certification at snf.nl. SNF-certified means inspected accommodation and a legal cap of €113.50/week on housing deductions.",
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Read real worker reviews",
        "text": "Ignore the agency's own website. Find reviews from people who actually worked there — what they earned after deductions, what the housing was actually like, how management treated them.",
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Get a written salary breakdown",
        "text": "Ask for every deduction in writing before you agree: housing, health insurance, transport, admin. Calculate your real weekly take-home. The gross number they advertise tells you almost nothing.",
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <div className="min-h-screen bg-surface-base">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

            <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
              <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-gray-400">Check an agency</span>
            </nav>

            <p className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-3">2026 Guide</p>

            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-6">
              How to Check if a Work Agency in the Netherlands is Legit
            </h1>

            <p className="text-base text-gray-300 leading-relaxed">
              Agencies promise good pay, housing included, easy start. What workers actually find is different —
              overcrowded rooms, deductions they weren&apos;t told about, and contracts that only protect the agency.
              Before you commit to anything, run these four checks. Takes 15 minutes. Could save you months of problems.
            </p>

          </div>
        </section>

        {/* ── Steps ─────────────────────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">

            {/* Step 1 */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Step 1</p>
              <h2 className="text-xl font-black text-white mb-4">
                Check if the agency is officially registered
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                Every legal employment agency in the Netherlands must be registered with the KvK — the Dutch
                Chamber of Commerce. Go to{" "}
                <a href="https://www.kvk.nl" target="_blank" rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-2">kvk.nl</a>{" "}
                and search for the company name. You&apos;ll get their registration number, address, and when they were founded.
              </p>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                Also check if they&apos;re a member of ABU or NBBU — the two main industry associations. Members
                are bound by CAO agreements which set minimum rules on salary, contracts, and deductions.
                You can verify at{" "}
                <a href="https://www.abu.nl" target="_blank" rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-2">abu.nl</a> or{" "}
                <a href="https://www.nbbu.nl" target="_blank" rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-2">nbbu.nl</a>.
              </p>
              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-5 py-4">
                <p className="text-xs font-black uppercase tracking-widest text-red-400 mb-2">Red flags</p>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>— Can&apos;t find them on kvk.nl or the name doesn&apos;t match what they told you</li>
                  <li>— Company was registered only a few months ago</li>
                  <li>— Vague company name with no real address</li>
                  <li>— No ABU/NBBU membership and they won&apos;t explain why</li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Step 2</p>
              <h2 className="text-xl font-black text-white mb-4">
                Check housing — SNF certification matters
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                If the agency provides accommodation, ask for their SNF number and verify it at{" "}
                <a href="https://www.snf.nl" target="_blank" rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-2">snf.nl</a>.
                SNF (Stichting Normering Flexwonen) inspects agency housing for safety, fire exits, hygiene,
                and room occupancy. If they&apos;re certified, they&apos;ve passed those checks.
              </p>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                SNF certification also sets a legal ceiling: agencies cannot charge you more than €113.50/week
                for shared accommodation. Without SNF, there&apos;s nothing stopping them from charging €150/week
                for a room with six people in it.
              </p>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                The real problem workers run into: the housing looks fine in the photo. In person,
                it&apos;s a room with five or six other people, shared bathrooms with broken locks,
                and deductions higher than what was in the contract. This happens more than agencies will admit.
              </p>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.05] px-5 py-4">
                <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-2">Ask before you sign</p>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>— How many people share a room?</li>
                  <li>— What is the exact weekly housing deduction?</li>
                  <li>— Is housing linked to your work contract? (if job ends, do you lose the room?)</li>
                  <li>— How much notice do you get to leave if the contract ends?</li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Step 3</p>
              <h2 className="text-xl font-black text-white mb-4">
                Check real worker reviews — not the agency&apos;s own website
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                The agency&apos;s website will show you happy workers, clean photos, and numbers
                that look good. That&apos;s marketing. What you actually want to know is: what do
                people who already worked there say, once they&apos;re out?
              </p>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                On AgencyCheck, you can{" "}
                <Link href="/reviews" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                  read worker reviews
                </Link>{" "}
                sorted by agency. Look specifically for patterns — if five different people
                independently mention the same problem (housing worse than described, salary not
                matching, unpaid overtime), it&apos;s not a coincidence.
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">
                Things to look for in reviews: Was the salary after deductions close to what was promised?
                Did housing match the description? Were payslips clear and issued on time? How did the agency
                respond when there was a problem?
              </p>
            </div>

            {/* Step 4 */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Step 4</p>
              <h2 className="text-xl font-black text-white mb-4">
                Understand your real salary — after all deductions
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                The hourly rate agencies advertise is always gross. What you actually take home
                is significantly less, once you factor in everything that gets deducted.
              </p>

              {/* Salary breakdown */}
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden mb-5">
                <div className="px-5 py-3 border-b border-white/[0.06]">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                    Example — €14.71/hr × 40h/week
                  </p>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {[
                    { label: "Gross weekly pay",              amount: "+€588", positive: true },
                    { label: "Dutch income tax (after credits)", amount: "−€63",  positive: false },
                    { label: "Agency housing (SNF standard)", amount: "−€95",  positive: false },
                    { label: "Health insurance",              amount: "−€35",  positive: false },
                    { label: "Transport to work",             amount: "−€25",  positive: false },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm text-gray-300">{row.label}</span>
                      <span className={`text-sm font-bold tabular-nums ${row.positive ? "text-emerald-400" : "text-red-400"}`}>
                        {row.amount}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-5 py-3 bg-white/[0.04]">
                    <span className="text-sm font-black text-white">Take-home</span>
                    <span className="text-sm font-black text-emerald-400">≈ €370/week</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                That&apos;s €370 on a good week, with a decent agency. Some workers end up with €300 or less
                — especially when housing costs are higher or there are extra admin fees. Always ask
                for a written breakdown of every deduction before you agree.
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">
                You can{" "}
                <Link href="/salary" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                  calculate your exact take-home salary
                </Link>{" "}
                using the AgencyCheck calculator — it uses real 2026 Dutch tax tables and includes
                the heffingskortingen (tax credits) that most agencies never mention.
              </p>
            </div>

          </div>
        </section>

        {/* ── Red flags ─────────────────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
            <h2 className="text-xl font-black text-white mb-6">
              Big red flags — avoid these agencies
            </h2>
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.05] px-5 sm:px-7 py-6">
              <ul className="space-y-4 text-sm text-gray-300 leading-relaxed">
                <li>
                  <strong className="text-white">No written contract before you arrive.</strong>{" "}
                  You should receive and sign a contract before you travel. An agency that asks you
                  to &quot;sort it out when you get here&quot; is putting you in a position where you
                  have no leverage.
                </li>
                <li>
                  <strong className="text-white">Salary that sounds too high.</strong>{" "}
                  If they&apos;re promising €1,500/week net at minimum wage, something is wrong.
                  Use the salary calculator to cross-check any number they give you.
                </li>
                <li>
                  <strong className="text-white">No clear housing info.</strong>{" "}
                  &quot;Nice accommodation provided&quot; means nothing. You need exact cost per week,
                  number of people per room, location, and what happens to your housing if the contract ends.
                </li>
                <li>
                  <strong className="text-white">Refusing to provide payslips or breakdowns.</strong>{" "}
                  You are legally entitled to a loonstrook (payslip) each pay period. An agency that
                  is vague about deductions or won&apos;t provide a written breakdown is hiding something.
                </li>
                <li>
                  <strong className="text-white">Pressure to start immediately.</strong>{" "}
                  Urgency is a tactic. A real agency with a real placement will give you time to
                  read the contract. Artificial deadlines exist to stop you from checking things properly.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── How AgencyCheck helps ─────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
            <h2 className="text-xl font-black text-white mb-4">How AgencyCheck helps</h2>
            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              AgencyCheck is an independent platform built specifically for workers, not agencies.
              There are no paid listings, no promoted results.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                {
                  href:   "/salary",
                  emoji:  "💶",
                  title:  "Real take-home salaries",
                  desc:   "Net pay estimates based on actual 2026 Dutch tax — not gross numbers.",
                },
                {
                  href:   "/reviews",
                  emoji:  "⭐",
                  title:  "Unfiltered worker reviews",
                  desc:   "We publish negative reviews too. No agency can pay to remove them.",
                },
                {
                  href:   "/agencies",
                  emoji:  "🏢",
                  title:  "Verified agency profiles",
                  desc:   "150+ agencies with housing status, ratings, and verified data.",
                },
              ].map((card) => (
                <Link key={card.href} href={card.href}
                  className="flex flex-col gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.15] transition-colors p-5 group">
                  <span className="text-2xl">{card.emoji}</span>
                  <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{card.title}</p>
                  <p className="text-xs text-gray-400 leading-snug">{card.desc}</p>
                </Link>
              ))}
            </div>
            <p className="text-sm text-gray-400">
              Before you sign anything,{" "}
              <Link href="/agencies" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                check the agency profile on AgencyCheck
              </Link>.
              If they&apos;re not listed, that&apos;s worth noting too.
            </p>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <section>
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <h2 className="text-xl font-black text-white mb-8">
              Common questions
            </h2>
            <div className="space-y-5">
              {FAQ_ITEMS.map((item) => (
                <div key={item.question}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 sm:px-6 py-5">
                  <h3 className="text-sm font-bold text-white mb-2">{item.question}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
