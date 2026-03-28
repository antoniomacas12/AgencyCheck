import type { Metadata } from "next";
import Link from "next/link";
import { HOUSING_AGENCIES } from "@/lib/agencyEnriched";
import { getJobCountForAgency } from "@/lib/jobData";
import ScoreBadge from "@/components/ScoreBadge";
import HousingBadge from "@/components/HousingBadge";

export const metadata: Metadata = {
  title: "Best Agencies with Housing Netherlands 2026 — AgencyCheck",
  description:
    `Compare ${(40).toString()}+ employment agencies in the Netherlands that provide housing for workers. Ranked by accommodation quality, job count, and worker reviews. Find the best option for you.`,
  alternates: { canonical: "/best-agencies-with-housing-netherlands" },
  openGraph: {
    title: "Best Agencies with Housing Netherlands — AgencyCheck",
    description:
      "The top Dutch employment agencies that provide accommodation for foreign workers. Ranked and reviewed.",
  },
};

// ─── Housing quality tiers ────────────────────────────────────────────────────
const FEATURED_HOUSING_AGENCIES = [
  {
    slug:    "otto-workforce",
    name:    "Otto Workforce",
    tier:    "★★★★★" as const,
    note:    "Specialist in EU workers. SNF-certified housing. Bus transport always included.",
    pros:    ["SNF certified accommodation", "Transport to work included", "Multi-language staff"],
    weekly:  "€85–€110/wk",
    cities:  ["Venlo", "Waalwijk", "Eindhoven", "Roosendaal"],
  },
  {
    slug:    "covebo",
    name:    "Covebo",
    tier:    "★★★★" as const,
    note:    "Strong logistics focus. Housing widely available across South NL.",
    pros:    ["SNF certified", "Near logistics hubs", "Stable long-term contracts"],
    weekly:  "€90–€120/wk",
    cities:  ["Tilburg", "Breda", "Bergen op Zoom"],
  },
  {
    slug:    "gi-group-temp",
    name:    "GI Group",
    tier:    "★★★★" as const,
    note:    "Italian multinational with a large NL presence. Housing available for longer placements.",
    pros:    ["European company", "Housing for long-term workers", "ABU certified"],
    weekly:  "€95–€125/wk",
    cities:  ["Amsterdam", "Rotterdam", "Utrecht"],
  },
  {
    slug:    "profcore",
    name:    "Profcore",
    tier:    "★★★" as const,
    note:    "Smaller agency, but housing included in most placements.",
    pros:    ["Flexible contracts", "Housing near work", "Quick onboarding"],
    weekly:  "€90–€115/wk",
    cities:  ["Multiple NL cities"],
  },
];

export default function BestAgenciesHousingPage() {
  const housingAgencies = HOUSING_AGENCIES;
  const totalHousing    = housingAgencies.length;

  // Sort by job count DESC for the full list
  const sortedHousing = [...housingAgencies].sort((a, b) => {
    const cA = getJobCountForAgency(a.slug);
    const cB = getJobCountForAgency(b.slug);
    return cB - cA;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/agencies" className="hover:text-brand-600">Agencies</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Best with Housing</span>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2.5 py-1 font-semibold">
            🏠 {totalHousing} agencies with housing
          </span>
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2.5 py-1 font-medium">
            🇳🇱 Netherlands
          </span>
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-1 font-medium">
            🏆 Ranked by quality
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
          Best Employment Agencies with Housing in Netherlands 2026
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          If you&apos;re moving to the Netherlands for work, finding accommodation can be
          difficult and expensive. These agencies include housing as part of the job
          package — ideal for EU workers from Poland, Romania, Bulgaria, and beyond.
          We&apos;ve ranked them by accommodation quality, job availability, and worker feedback.
        </p>
      </div>

      {/* ── Warning ────────────────────────────────────────────────────────── */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm">
        <p className="font-semibold text-amber-800 mb-1">⚠️ Know your housing rights</p>
        <ul className="text-amber-700 text-xs space-y-1 list-disc list-inside">
          <li>Agencies may deduct up to <strong>25% of your gross wage</strong> for housing (SNF standard)</li>
          <li>Housing and employment are separate — losing your job does not mean you must leave immediately</li>
          <li>You have the right to inspect the accommodation before agreeing</li>
          <li>All housing must meet SNF (Stichting Normering Flexwonen) quality standards</li>
        </ul>
      </div>

      {/* ── Featured agencies ──────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-1">🏆 Top-ranked agencies with housing</h2>
        <p className="text-xs text-gray-500 mb-4">Ranked by accommodation quality, job count, and worker reputation</p>

        <div className="space-y-4">
          {FEATURED_HOUSING_AGENCIES.map((agency, index) => {
            const jobCount = getJobCountForAgency(agency.slug);
            return (
              <div key={agency.slug} className="card p-5">
                <div className="flex items-start gap-4">
                  <div className="text-2xl font-extrabold text-gray-300 leading-none shrink-0 w-8">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <Link href={`/agencies/${agency.slug}`} className="font-bold text-base text-gray-900 hover:text-brand-600">
                          {agency.name}
                        </Link>
                        <div className="text-amber-500 text-xs mt-0.5">{agency.tier}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-semibold bg-green-50 text-green-700 border border-green-100 rounded-full px-2 py-0.5 block mb-1">
                          🏠 Housing: YES
                        </span>
                        {jobCount > 0 && (
                          <span className="text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2 py-0.5 block">
                            💼 {jobCount} jobs
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{agency.note}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {agency.pros.map((pro) => (
                        <span key={pro} className="text-xs bg-green-50 text-green-700 rounded-full px-2 py-0.5">
                          ✓ {pro}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                      <span>
                        <span className="font-semibold">Rent deduction:</span>{" "}
                        <span className="text-amber-700">{agency.weekly}</span>
                      </span>
                      <span>
                        <span className="font-semibold">Cities:</span>{" "}
                        {agency.cities.join(", ")}
                      </span>
                    </div>

                    <div className="mt-3">
                      <Link
                        href={`/agencies/${agency.slug}`}
                        className="inline-flex items-center text-xs font-semibold text-brand-600 hover:underline"
                      >
                        View full agency profile →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── All housing agencies list ──────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-base font-bold text-gray-900 mb-1">
          All {totalHousing} agencies with housing
        </h2>
        <p className="text-xs text-gray-500 mb-4">Sorted by number of active job listings</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sortedHousing.map((agency) => {
            const jobCount = getJobCountForAgency(agency.slug);
            return (
              <Link
                key={agency.id}
                href={`/agencies/${agency.slug}`}
                className="card p-3 hover:shadow-md hover:border-brand-100 transition-all duration-200 group hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-2">
                  <ScoreBadge score={agency.score} reviewCount={agency.reviewCount} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs text-gray-900 group-hover:text-brand-600 truncate">
                      {agency.name}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">
                      📍 {agency.city ?? agency.cities?.[0] ?? "NL"}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <HousingBadge housing="YES" size="sm" />
                      {jobCount > 0 && (
                        <span className="text-[10px] font-semibold bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-1.5 py-0.5">
                          {jobCount} jobs
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Comparison table ───────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-base font-bold text-gray-900 mb-3">Housing options compared</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-2 border border-gray-200 font-semibold text-gray-700">Feature</th>
                <th className="text-center p-2 border border-gray-200 font-semibold text-gray-700">Agency housing</th>
                <th className="text-center p-2 border border-gray-200 font-semibold text-gray-700">Private rental</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "Arrange yourself", agency: "❌ No", private: "✅ Yes" },
                { feature: "Cost per week", agency: "€85–€130/wk (deducted)", private: "€120–€250/wk (separate)" },
                { feature: "Near work location", agency: "✅ Usually yes", private: "⚠️ Not guaranteed" },
                { feature: "Transport included", agency: "Often yes", private: "❌ No" },
                { feature: "Contract tied to job", agency: "❌ Should not be", private: "✅ Independent" },
                { feature: "Registration possible", agency: "⚠️ Sometimes difficult", private: "✅ Yes" },
              ].map((row) => (
                <tr key={row.feature} className="border-b border-gray-100">
                  <td className="p-2 border border-gray-200 text-gray-700">{row.feature}</td>
                  <td className="p-2 border border-gray-200 text-center text-gray-600">{row.agency}</td>
                  <td className="p-2 border border-gray-200 text-center text-gray-600">{row.private}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Related links ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { href: "/agencies-with-housing",              label: "🏠 Filter agencies with housing" },
          { href: "/otto-workforce-jobs",                label: "🏭 Otto Workforce jobs" },
          { href: "/work-in-netherlands-for-foreigners", label: "🌍 Working in NL guide" },
          { href: "/jobs-in-netherlands",                label: "💼 All NL jobs" },
          { href: "/real-salary-netherlands-after-rent", label: "💰 Salary after rent" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex items-center text-xs font-medium bg-white border border-gray-200 text-gray-700 rounded-full px-3 py-1.5 hover:border-brand-300 hover:text-brand-700 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        Data is worker-reported and informational. Verify accommodation quality before committing.
      </p>
    </div>
  );
}
