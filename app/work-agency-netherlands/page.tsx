import type { Metadata } from "next";
import Link from "next/link";
import { ALL_AGENCIES } from "@/lib/agencyEnriched";

export const metadata: Metadata = {
  title: "Work Agencies in the Netherlands 2026 — How They Work | AgencyCheck",
  description:
    "How Dutch work agencies (uitzendbureaus) operate in 2026. Phase A/B contracts, legal deductions, housing, salary reality, and how to compare 150+ agencies before you register.",
  alternates: { canonical: "https://agencycheck.io/work-agency-netherlands" },
  openGraph: {
    title: "Work Agencies in the Netherlands 2026 — How They Work",
    description:
      "Phase A/B contracts, legal deductions, housing, salary reality. What work agencies actually offer — and what to watch out for.",
  },
};

const topAgencies = ALL_AGENCIES.filter(
  (a) => a.transparencyScore >= 60
).sort((a, b) => b.transparencyScore - a.transparencyScore).slice(0, 8);

const housingAgencies = ALL_AGENCIES.filter(
  (a) => a.housing === "YES"
).sort((a, b) => b.transparencyScore - a.transparencyScore).slice(0, 6);

export default function WorkAgencyNetherlandsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <span className="text-gray-700 font-medium">Work Agencies Netherlands</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-3 py-1 font-medium">
            151 agencies profiled · 2026 data
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
          Work Agencies in the Netherlands:<br className="hidden sm:inline" /> How They Work and What to Expect
        </h1>
        <p className="text-gray-600 leading-relaxed text-lg">
          A work agency (uitzendbureau) in the Netherlands connects workers to employers — often
          in logistics, food production, construction, and manufacturing. For workers coming from
          abroad, they typically handle housing, BSN registration, and payroll in one package.
          Understanding how they operate before you sign is the difference between a good
          placement and a costly surprise.
        </p>
      </div>

      {/* What is a work agency */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">What is a Work Agency (Uitzendbureau)?</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          An uitzendbureau is a licensed staffing intermediary. You sign a contract with the
          agency — not directly with the employer — and the agency places you at a client company.
          The client tells the agency how many workers they need and when; the agency recruits,
          pays wages, withholds tax, and manages your contract.
        </p>
        <p className="text-gray-600 leading-relaxed mb-4">
          Most legitimate agencies operating in the Netherlands are registered with the ABU
          (Algemene Bond Uitzendondernemingen) or NBBU (Nederlandse Bond van Bemiddelings- en
          Uitzendondernemingen). ABU membership means the agency is bound by the ABU CAO —
          a collective labour agreement that sets minimum wage, overtime premiums, and phase
          progression rules. NBBU membership offers similar protections under its own CAO.
        </p>
        <p className="text-gray-600 leading-relaxed">
          A handful of agencies operating in the Netherlands are not ABU/NBBU members and
          follow their own sector CAO instead — or in the worst cases, no recognised CAO at all.
          AgencyCheck records each agency&apos;s registration status where it can be verified.
        </p>
      </div>

      {/* Phase A vs Phase B */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Phase A vs Phase B: What Your Contract Stage Means</h2>
        <p className="text-gray-600 leading-relaxed mb-5">
          Under the ABU CAO, agency workers move through contract phases based on how long
          they have worked. The phase determines your rights and protections.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="font-bold text-amber-900 mb-2">Phase A (weeks 1–78)</p>
            <ul className="text-sm text-amber-800 space-y-1.5">
              <li>• Contract can be terminated weekly with no notice</li>
              <li>• No paid public holidays</li>
              <li>• Sick pay: first two days unpaid, then 90% via UWV</li>
              <li>• Minimum 15 hours/week if contracted hours not specified</li>
              <li>• Vakantiegeld (8% holiday pay) accrues, paid periodically</li>
            </ul>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <p className="font-bold text-green-900 mb-2">Phase B (week 79+)</p>
            <ul className="text-sm text-green-800 space-y-1.5">
              <li>• Fixed-term contract (max 6 contracts over 4 years)</li>
              <li>• Public holidays: paid</li>
              <li>• Sick pay: 90–100% for up to 2 years</li>
              <li>• Right to transition to permanent employment after phase</li>
              <li>• Stronger protection against sudden contract end</li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Weeks only count toward phase progression when you actively work. Gaps of more than
          26 weeks reset the counter. Some agencies deliberately manage rotations to keep
          workers in Phase A indefinitely — a practice that is legal but worth knowing about.
        </p>
      </div>

      {/* What agencies can deduct */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">What Agencies Can Legally Deduct from Your Pay</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Dutch law and the ABU CAO permit agencies to deduct certain costs from your gross
          wage — but with strict limits. Knowing the rules protects you from illegal deductions.
        </p>
        <div className="space-y-3">
          {[
            { item: "Loonheffing (income tax)", detail: "Mandatory. Rate at WML (€14.71/hr) is approximately 10.7% of gross. Increases with higher earnings. This is a tax — not an agency charge.", legal: true },
            { item: "Housing (SNF-certified)", detail: "Maximum €113.50/week in 2026 for SNF-registered accommodation. If housing is not SNF-certified, the same cap applies but your rights to complain are stronger.", legal: true },
            { item: "Health insurance (ZVW)", detail: "Employee contribution capped at roughly €176/month in 2026. Some agencies bundle this incorrectly — check your payslip.", legal: true },
            { item: "Transport to work", detail: "Only deductible if agreed in your contract AND you are actually using the transport. Maximum varies by contract; typically €15–€30/week.", legal: true },
            { item: "Administration fees", detail: "Illegal in the Netherlands for standard placements. Any 'admin fee', 'registration fee', or 'service fee' deducted from wages without a specific contractual basis is not permitted.", legal: false },
          ].map(({ item, detail, legal }) => (
            <div key={item} className="flex gap-3 items-start">
              <span className={`mt-0.5 text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${legal ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {legal ? "Legal" : "Illegal"}
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-800">{item}</p>
                <p className="text-xs text-gray-500 mt-0.5">{detail}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link href="/tools/payslip-checker" className="text-sm font-medium text-brand-700 hover:text-brand-800">
            → Use our payslip checker to verify your deductions
          </Link>
        </div>
      </div>

      {/* Real salary */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Real Salary: What You Keep After Deductions</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          The 2026 Statutory Minimum Wage (WML) is <strong>€14.71 gross per hour</strong>. On a
          standard 40-hour week, that is €588.40 gross. Here is what the typical deduction
          path looks like for a worker with agency housing:
        </p>
        <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
          {[
            { label: "Gross weekly pay (40h at WML)", value: "€588", color: "text-gray-800" },
            { label: "− Loonheffing (~10.7%)", value: "−€63", color: "text-red-600" },
            { label: "− ZVW health insurance levy", value: "−€41", color: "text-red-600" },
            { label: "+ Vakantiegeld (8%, accrued)", value: "+€47", color: "text-green-600" },
            { label: "= Cash before housing", value: "≈€531", color: "text-gray-700 font-semibold" },
            { label: "− Agency housing (typical)", value: "−€95–€113", color: "text-amber-700" },
            { label: "YOU KEEP (weekly)", value: "≈€340–€436", color: "text-brand-700 font-bold text-base" },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-600">{label}</span>
              <span className={`text-sm font-mono ${color}`}>{value}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Night shift (+22%) and Sunday (+50%) premiums significantly change the picture.
          Workers on full night rotations typically take home €420–€460/week before housing.
        </p>
        <div className="mt-3 flex gap-3">
          <Link href="/tools/real-income-calculator" className="text-sm font-medium text-brand-700 hover:text-brand-800">
            → Calculate your exact take-home
          </Link>
          <Link href="/real-salary-netherlands-agency-work" className="text-sm font-medium text-gray-500 hover:text-gray-700">
            → Salary reality guide
          </Link>
        </div>
      </div>

      {/* Agencies with best transparency */}
      {topAgencies.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Highest-Transparency Agencies</h2>
          <p className="text-gray-500 text-sm mb-4">
            These agencies have the most verifiable public information — contract terms, housing details,
            CAO compliance — making them easier to compare and hold accountable.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {topAgencies.map((a) => (
              <Link
                key={a.id}
                href={`/agencies/${a.slug}`}
                className="card p-4 hover:shadow-md hover:border-brand-100 transition-all flex items-start gap-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 leading-tight">{a.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.city || "Netherlands"}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2 py-0.5">
                      {a.transparencyScore}/100 transparency
                    </span>
                    {a.housing === "YES" && (
                      <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2 py-0.5">
                        🏠 Housing
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-gray-300 text-lg mt-0.5">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Housing agencies */}
      {housingAgencies.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Agencies That Provide Housing</h2>
          <p className="text-gray-500 text-sm mb-4">
            These agencies arrange accommodation alongside employment — useful for workers
            arriving from abroad who need both sorted at once.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {housingAgencies.map((a) => (
              <Link
                key={a.id}
                href={`/agencies/${a.slug}`}
                className="card p-4 hover:shadow-md hover:border-brand-100 transition-all flex items-start gap-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 leading-tight">{a.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.city || "Netherlands"}</p>
                </div>
                <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2 py-0.5 self-center">
                  🏠 Housing confirmed
                </span>
              </Link>
            ))}
          </div>
          <Link href="/agencies-with-housing" className="inline-block mt-3 text-sm text-brand-700 font-medium hover:text-brand-800">
            → View all agencies with housing →
          </Link>
        </section>
      )}

      {/* How to compare */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">How to Compare Agencies Before You Register</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Not all agencies are equivalent. Here are the six questions that matter most:
        </p>
        <ol className="space-y-3 text-sm text-gray-600">
          {[
            ["Is the agency ABU or NBBU registered?", "ABU and NBBU membership means the ABU CAO or NBBU CAO applies to your contract. Without this, wage and phase protections are weaker."],
            ["Is housing SNF-certified?", "SNF certification means the accommodation meets minimum standards and the deduction cap (€113.50/week) applies. Ask for the SNF registration number."],
            ["What is the exact housing deduction?", "Get this in euros per week in writing before signing. Some agencies set it at the maximum without stating this upfront."],
            ["What happens if the work ends?", "Under Phase A, contracts can end weekly. Ask what the minimum guaranteed hours are and whether there is a continuation clause."],
            ["Do they provide transport — and what does it cost?", "Transport to site is valuable. Check whether it is included, costs extra, or is run on a schedule that actually matches your shift."],
            ["Can you see recent payslips from current workers?", "The best agencies are transparent about this. If a coordinator cannot answer salary questions directly, that is worth noting."],
          ].map(([q, a], i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="text-brand-600 font-bold text-base shrink-0">{i + 1}.</span>
              <div>
                <p className="font-semibold text-gray-800">{q}</p>
                <p className="text-gray-500 mt-0.5">{a}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Related links */}
      <div className="card p-5 mb-6">
        <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Related Resources</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            ["/best-work-agencies-netherlands", "Best work agencies in the Netherlands 2026"],
            ["/agency-housing-netherlands", "Agency housing: SNF rules, costs, your rights"],
            ["/jobs-in-netherlands-for-foreigners", "Jobs in the Netherlands for foreigners"],
            ["/tools/payslip-checker", "Verify your payslip is correct"],
            ["/tools/real-income-calculator", "Calculate your real weekly take-home"],
            ["/agencies", "Browse all 151 verified agencies"],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="text-sm text-brand-700 hover:text-brand-800 hover:underline">
              → {label}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
