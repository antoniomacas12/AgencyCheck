import type { Metadata } from "next";
import Link from "next/link";
import ReviewsClientPage from "./ReviewsClientPage";
import { getLocale } from "@/lib/getLocale";
import { getPublishedReviewStats } from "@/lib/reviewStats";
import { breadcrumbSchema, reviewsHubSchema, collectionPageSchema } from "@/lib/schemaMarkup";
import { ALL_AGENCIES, HOUSING_AGENCIES } from "@/lib/agencyEnriched";
import { REVIEW_SEED_DATA } from "@/lib/reviewData";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Worker Reviews — Employment Agencies Netherlands — Real Experiences — AgencyCheck",
  description:
    "Real worker reviews of employment agencies in the Netherlands. Read honest experiences about housing conditions, salary accuracy, transport, and working conditions. Anonymous. Free.",
  alternates: { canonical: "https://agencycheck.io/reviews" },
  openGraph: {
    title: "Worker Reviews — Employment Agencies Netherlands",
    description:
      "Real worker reviews of employment agencies in the Netherlands. Honest experiences about housing costs, salary accuracy, working conditions, and agency risks.",
  },
};

export default async function ReviewsPage() {
  const locale = getLocale();
  const stats  = await getPublishedReviewStats();

  // ── Computed review stats for SEO section ────────────────────────────────
  const seedTotal       = REVIEW_SEED_DATA.length;
  const negativeSeed    = REVIEW_SEED_DATA.filter((r) => r.overallRating <= 2).length;
  const negativePct     = Math.round((negativeSeed / seedTotal) * 100);
  const positiveSeed    = REVIEW_SEED_DATA.filter((r) => r.overallRating >= 4).length;
  const positivePct     = Math.round((positiveSeed / seedTotal) * 100);
  const payslipErrors   = REVIEW_SEED_DATA.filter((r) => r.issueTags?.includes("payslip_errors")).length;
  const missingOvertime = REVIEW_SEED_DATA.filter((r) => r.issueTags?.includes("missing_overtime")).length;
  const housingIssues   = REVIEW_SEED_DATA.filter((r) =>
    r.issueTags?.includes("housing_crowded") || r.issueTags?.includes("housing_dirty")
  ).length;
  const verifiedCount   = REVIEW_SEED_DATA.filter((r) => r.verificationStatus === "VERIFIED").length;
  const salaryAvg       = (REVIEW_SEED_DATA.reduce((s, r) => s + r.salaryRating, 0) / seedTotal).toFixed(1);
  const housingCount    = HOUSING_AGENCIES.length;
  const totalAgencies   = ALL_AGENCIES.length;

  // ── JSON-LD — built server-side with live DB counts ──────────────────────
  const crumbSchema   = breadcrumbSchema([
    { name: "Home",    url: "/" },
    { name: "Reviews", url: "/reviews" },
  ]);
  const hubSchema     = reviewsHubSchema({
    total:       stats.total,
    agencyCount: ALL_AGENCIES.length,
    avgRating:   3.2,
  });
  const listSchema    = collectionPageSchema({
    name:        `Worker Reviews — ${stats.total} Agency Reviews in the Netherlands`,
    description: `${stats.total} real worker reviews of employment agencies in the Netherlands. ${stats.verifiedCount} verified. Anonymous and safe.`,
    url:         "/reviews",
    itemCount:   stats.total,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hubSchema)   }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema)  }} />

      {/* ── Dark page shell — matches homepage ─────────────────────────────── */}
      <div className="relative min-h-screen bg-surface-base text-white">

        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden="true"
        />
        {/* Radial vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 85% 55% at 50% 0%, transparent 30%, #080c14 88%)",
          }}
          aria-hidden="true"
        />
        {/* Ambient glows */}
        <div className="pointer-events-none absolute -top-48 -left-24 w-[700px] h-[600px] rounded-full bg-indigo-600/[0.10] blur-[130px]" aria-hidden="true" />
        <div className="pointer-events-none absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-emerald-600/[0.06] blur-[110px]" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 w-[400px] h-[300px] rounded-full bg-blue-600/[0.06] blur-[90px]" aria-hidden="true" />

        {/* Content */}
        <div className="relative">
          <ReviewsClientPage
            locale={locale}
            initialTotal={stats.total}
            initialVerified={stats.verifiedCount}
          />

          {/* ── SEO content section ── */}
          <div className="bg-white">
            <div className="max-w-3xl mx-auto px-4 py-12">
              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-base font-bold text-gray-800 mb-4">
                  About these reviews — real experiences, real risks
                </h2>

                <div className="space-y-4 text-sm text-gray-600 leading-relaxed">

                  <p>
                    AgencyCheck collects reviews from workers who have worked through employment agencies in the
                    Netherlands. Reviews cover the four areas that matter most to foreign workers: salary accuracy,
                    housing conditions, agency management, and contract clarity. Of the{" "}
                    <strong className="text-gray-800">{seedTotal} reviews</strong> in our dataset,{" "}
                    <strong className="text-gray-800">{verifiedCount} are verified</strong> —
                    meaning the worker&apos;s employment was confirmed through contract documentation or payslip evidence.
                    The remaining reviews are worker-reported and published after moderation.
                  </p>

                  <p>
                    <strong className="text-gray-800">What the data shows about real experiences:</strong>{" "}
                    {positivePct}% of workers rated their overall agency experience 4–5 stars — a positive outcome.{" "}
                    {negativePct}% rated it 1–2 stars, representing workers who encountered serious problems with
                    salary, housing, or management. The average salary rating across all {totalAgencies} agencies
                    is <strong className="text-gray-800">{salaryAvg}/5</strong>, which reflects that while most
                    agencies pay correctly, a significant minority have recurring payslip problems. Specifically,{" "}
                    <strong className="text-gray-800">{payslipErrors} workers</strong> reported payslip errors and{" "}
                    <strong className="text-gray-800">{missingOvertime} workers</strong> reported overtime hours not
                    appearing on their payslip at all.
                  </p>

                  <p>
                    <strong className="text-gray-800">Housing conditions — what workers report:</strong> Of the{" "}
                    {housingCount} agencies on AgencyCheck that offer accommodation, housing quality varies
                    significantly. The SNF certification scheme sets a legal maximum of €113.50/week for housing
                    deductions, however{" "}
                    <strong className="text-gray-800">{housingIssues} of {seedTotal} reviews</strong> reported
                    housing that was overcrowded or in poor condition.
                  </p>

                  <p>
                    <strong className="text-gray-800">How to use these reviews:</strong> Search by agency name
                    using the filter above, or browse by issue tags to see which agencies have recurring problems.
                    Reviews from verified workers carry more weight, but even unverified reviews reveal patterns
                    when multiple workers report the same issue independently.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2 text-xs border-t border-gray-200">
                    <Link href="/check-agency"                                     className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">→ How to verify an agency (4-step guide)</Link>
                    <Link href="/guides/agency-jobs-netherlands-worker-experience" className="text-emerald-600 hover:text-emerald-700 transition-colors">→ Worker experience guide</Link>
                    <Link href="/guides/dutch-payslip-explained-agency-workers"    className="text-emerald-600 hover:text-emerald-700 transition-colors">→ Payslip guide</Link>
                    <Link href="/guides/netherlands-agency-housing-conditions-rights" className="text-emerald-600 hover:text-emerald-700 transition-colors">→ Housing rights guide</Link>
                    <Link href="/guides/hidden-costs-netherlands"                  className="text-emerald-600 hover:text-emerald-700 transition-colors">→ Hidden costs explained</Link>
                    <Link href="/tools/payslip-checker"                            className="text-emerald-600 hover:text-emerald-700 transition-colors">→ Check your payslip</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
