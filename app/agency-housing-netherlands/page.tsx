import type { Metadata } from "next";
import Link from "next/link";
import { ALL_AGENCIES } from "@/lib/agencyEnriched";

export const metadata: Metadata = {
  title: "Agency Housing in the Netherlands 2026 — SNF Rules, Costs & Rights | AgencyCheck",
  description:
    "How agency housing (SNF) works in the Netherlands. Maximum deduction €113.50/week in 2026. What shared accommodation looks like, your rights, which agencies have best housing.",
  alternates: { canonical: "https://agencycheck.io/agency-housing-netherlands" },
  openGraph: {
    title: "Agency Housing Netherlands 2026 — SNF Rules, Costs & Your Rights",
    description:
      "SNF certification explained. Max deduction €113.50/week. What to check before moving in. Which agencies have the best housing.",
  },
};

const housingAgencies = ALL_AGENCIES
  .filter((a) => a.housing === "YES")
  .sort((a, b) => b.transparencyScore - a.transparencyScore);

export default function AgencyHousingNetherlandsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/work-agency-netherlands" className="hover:text-brand-600">Work Agencies</Link>
        <span>›</span>
        <span className="text-gray-700 font-medium">Agency Housing</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-3 py-1 font-medium">
            SNF max €113.50/week · 2026 rules
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
          Agency Housing in the Netherlands:<br className="hidden sm:inline" /> Costs, Standards, and What Workers Need to Know
        </h1>
        <p className="text-gray-600 leading-relaxed text-lg">
          Many work agencies in the Netherlands offer accommodation alongside employment —
          particularly for logistics, food processing, and production roles. Understanding how
          agency housing is regulated, how much it costs, and what your rights are as a
          tenant-worker is essential before accepting a package that bundles housing with pay.
        </p>
      </div>

      {/* What SNF is */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">What SNF Certification Means</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          SNF (Stichting Normering Flexwonen) is the Dutch certification body for flexible
          worker accommodation. Agencies registered with SNF agree to meet minimum standards for
          room quality, occupancy limits, hygiene, safety, and contract transparency. SNF
          inspectors audit registered properties to verify compliance.
        </p>
        <p className="text-gray-600 leading-relaxed mb-4">
          SNF certification is not legally mandatory — but under the ABU CAO, ABU-registered
          agencies are required to use SNF-certified accommodation when providing housing to
          workers. In practice, most legitimate agencies use SNF housing or a comparable
          certified alternative (such as SKW, the certification body for construction workers).
        </p>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
          <p className="text-sm font-semibold text-amber-900 mb-1">What to ask any agency before accepting housing:</p>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• &quot;Is this accommodation SNF-certified? What is the registration number?&quot;</li>
            <li>• &quot;How many people will share my room and bathroom?&quot;</li>
            <li>• &quot;What exactly is deducted from my salary for housing — in euros per week?&quot;</li>
            <li>• &quot;Can I stay in the housing if the contract ends, and for how long?&quot;</li>
          </ul>
        </div>
      </div>

      {/* Maximum deduction */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Maximum Legal Housing Deduction: €113.50/week in 2026</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          The SNF norm sets the maximum that an agency can deduct from your wages for
          accommodation. In 2026 that figure is <strong>€113.50 per week</strong> — equivalent
          to approximately €491/month. This is the ceiling, not a standard — some agencies
          charge less.
        </p>
        <p className="text-gray-600 leading-relaxed mb-4">
          The deduction only applies when the accommodation genuinely meets SNF standards.
          If an agency deducts €113.50 for housing that fails inspection — overcrowded rooms,
          broken facilities, missing safety equipment — you have grounds to dispute the full
          amount through SNF&apos;s complaints process.
        </p>
        <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
          {[
            { label: "SNF maximum (2026)", value: "€113.50 / week", note: "≈€491/month" },
            { label: "Typical mid-range deduction", value: "€90–€105 / week", note: "Per worker research on AgencyCheck" },
            { label: "Occupancy ceiling (SNF)", value: "Max. 2 workers/room", note: "4 workers/room in some older properties" },
            { label: "Notice period to leave housing", value: "Typically 4 weeks", note: "Must be stated in your housing contract" },
          ].map(({ label, value, note }) => (
            <div key={label} className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-600">{label}</span>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">{value}</p>
                {note && <p className="text-xs text-gray-400">{note}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What shared accommodation looks like */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">What Agency Housing Actually Looks Like</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Agency accommodation in the Netherlands is almost always shared. The standard
          setup is a shared house or apartment with individual bedrooms, communal kitchen,
          communal bathroom, and shuttle access to the work site. Here is what AgencyCheck
          data and worker reports show about typical conditions:
        </p>
        <div className="space-y-4">
          {[
            {
              heading: "Room occupancy",
              body: "SNF allows up to 2 workers per bedroom in newer properties. Older properties may have 4 per room under different certification periods. Workers near large logistics hubs (Tilburg, Venlo, Rotterdam) report larger shared houses — 10–20 workers — than those in smaller cities.",
            },
            {
              heading: "Facilities",
              body: "A shared kitchen with basic appliances (hob, fridge, microwave), shared bathroom(s), and a common area are standard. WiFi is increasingly included, though quality varies. Washing machine access is common but often coin-operated or shared.",
            },
            {
              heading: "Distance to work",
              body: "SNF-registered accommodation is typically within shuttle distance of the client site. Travel time varies — some housing is on-site (e.g., at distribution centres), others are 20–40 minutes away by shuttle.",
            },
            {
              heading: "What 'included' means in practice",
              body: "Heat and electricity are usually included in the SNF deduction. Internet and TV sometimes are. Food is never included — budget €40–€70/week for groceries. Personal items (toiletries, bedding) are sometimes provided on day one; confirm this before arriving.",
            },
          ].map(({ heading, body }) => (
            <div key={heading} className="flex gap-3 items-start">
              <span className="text-green-500 mt-0.5 text-lg shrink-0">✓</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">{heading}</p>
                <p className="text-sm text-gray-500 mt-0.5">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rights */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Your Rights as an Agency Housing Tenant</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Agency housing in the Netherlands sits in a specific legal category. You are a
          tenant, but your tenancy is typically tied to your employment contract. This
          creates asymmetric power — losing your job often means losing your home. Knowing
          your rights limits that risk:
        </p>
        <div className="space-y-3 text-sm">
          {[
            {
              right: "Housing contract separate from employment contract",
              detail: "Your housing agreement should be a distinct document from your work contract. If they are bundled, ending work automatically ends housing — ask if these can be separated, particularly if you plan to stay in the Netherlands after one placement ends.",
            },
            {
              right: "Right to complain to SNF",
              detail: "If housing falls below SNF standards — mould, pest infestation, overcrowding, broken facilities not repaired within a reasonable time — you can report directly to SNF. SNF can initiate inspection and, if standards are not met, require the agency to reduce or refund the deduction.",
            },
            {
              right: "Right to a written housing statement",
              detail: "Before you move in, the agency must provide a written statement of the weekly deduction, what is included, and the notice period. If this is not provided, request it in writing before signing any contract.",
            },
            {
              right: "Protection against sudden eviction",
              detail: "Even when tied to employment, agency housing has a notice period — typically 4 weeks. Immediate eviction on the same day a contract ends is not standard practice and may be challenged.",
            },
          ].map(({ right, detail }) => (
            <div key={right} className="bg-gray-50 rounded-xl p-4">
              <p className="font-semibold text-gray-800 mb-1">{right}</p>
              <p className="text-gray-500">{detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Agencies with housing */}
      {housingAgencies.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Agencies with Confirmed Housing ({housingAgencies.length})
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            These agencies have confirmed accommodation provision in our dataset. Always verify
            current availability and deduction amount directly before signing.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {housingAgencies.slice(0, 10).map((a) => (
              <Link
                key={a.id}
                href={`/agencies/${a.slug}`}
                className="card p-4 hover:shadow-md hover:border-brand-100 transition-all"
              >
                <p className="text-sm font-bold text-gray-900 leading-tight">{a.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.city || "Netherlands"}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2 py-0.5">
                    🏠 Housing confirmed
                  </span>
                  <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2 py-0.5">
                    {a.transparencyScore}/100
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {housingAgencies.length > 10 && (
            <Link href="/agencies-with-housing" className="inline-block mt-3 text-sm text-brand-700 font-medium hover:text-brand-800">
              → View all {housingAgencies.length} agencies with housing →
            </Link>
          )}
        </section>
      )}

      {/* Related */}
      <div className="card p-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Related Resources</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            ["/work-in-netherlands-with-accommodation", "Work in the Netherlands with accommodation"],
            ["/best-work-agencies-netherlands", "Best work agencies overall"],
            ["/temporary-work-netherlands-accommodation", "Temporary work with housing"],
            ["/tools/accommodation-costs", "Calculate housing cost impact on net pay"],
            ["/tools/payslip-checker", "Verify housing deductions on your payslip"],
            ["/agencies-with-housing", "Full list: agencies with housing"],
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
