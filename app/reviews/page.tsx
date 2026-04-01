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
  alternates: { canonical: "/reviews" },
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
      <ReviewsClientPage
        locale={locale}
        initialTotal={stats.total}
        initialVerified={stats.verifiedCount}
      />

      {/* ── SEO content section — server-rendered for indexability ── */}
      <div className="max-w-3xl mx-auto px-4 pb-16 mt-4">
        <div className="border-t border-gray-100 pt-8">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            About these reviews — real experiences, real risks
          </h2>

          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">

            <p>
              AgencyCheck collects reviews from workers who have worked through employment agencies in the
              Netherlands. Reviews cover the four areas that matter most to foreign workers: salary accuracy,
              housing conditions, agency management, and contract clarity. Of the{" "}
              <strong>{seedTotal} reviews</strong> in our dataset, <strong>{verifiedCount} are verified</strong> —
              meaning the worker's employment was confirmed through contract documentation or payslip evidence.
              The remaining reviews are worker-reported and published after moderation.
            </p>

            <p>
              <strong>What the data shows about real experiences:</strong> {positivePct}% of workers rated their
              overall agency experience 4–5 stars — a positive outcome. {negativePct}% rated it 1–2 stars,
              representing workers who encountered serious problems with salary, housing, or management. The
              average salary rating across all {totalAgencies} agencies is <strong>{salaryAvg}/5</strong>, which
              reflects that while most agencies pay correctly, a significant minority have recurring payslip
              problems. Specifically, <strong>{payslipErrors} workers</strong> reported payslip errors — most
              commonly missing overtime pay or shift premiums — and <strong>{missingOvertime} workers</strong>{" "}
              reported overtime hours not appearing on their payslip at all.
            </p>

            <p>
              <strong>Housing conditions — what workers report:</strong> Of the {housingCount} agencies on
              AgencyCheck that offer accommodation, housing quality varies significantly. The SNF (Stichting
              Normering Flexwonen) certification scheme sets a legal maximum of €113.50/week for housing deductions
              and sets minimum standards for shared accommodation. However, certification does not guarantee
              quality — <strong>{housingIssues} of {seedTotal} reviews</strong> reported housing that was
              overcrowded or in poor condition. Agencies with the highest housing ratings on AgencyCheck
              consistently provided private or double-occupancy rooms, clean facilities, and housing costs that
              matched what was agreed in the contract before arrival.
            </p>

            <p>
              <strong>Risks workers report most frequently:</strong> The three risks that appear most consistently
              across negative reviews are: (1) payslip errors that go unchallenged because workers do not know
              their rights, (2) housing conditions that differ from what was described before travel, and (3)
              contract terms that reference "company policy" for overtime rates without specifying the actual
              multiplier. All three are addressable — but only before you sign. Workers who checked their payslip
              against their contracted rate from the first week almost always caught errors early; workers who
              waited months discovered they had been under-paid for the entire period.
            </p>

            <p>
              <strong>How to use these reviews:</strong> Search by agency name using the filter above, or browse
              by the issue tags — "payslip errors", "housing", "management" — to see which agencies have
              recurring problems. Reviews from verified workers carry more weight, but even unverified reviews
              reveal patterns when multiple workers report the same issue independently. Before contacting any
              agency, check their transparency score and read the most recent 5–10 reviews. The pattern you find
              there is almost always representative of what new workers will experience.
            </p>

            <div className="flex flex-wrap gap-3 pt-2 text-xs border-t border-gray-100">
              <Link href="/guides/agency-jobs-netherlands-worker-experience" className="text-brand-600 hover:underline">→ Worker experience guide</Link>
              <Link href="/guides/dutch-payslip-explained-agency-workers"    className="text-brand-600 hover:underline">→ Payslip guide</Link>
              <Link href="/guides/netherlands-agency-housing-conditions-rights" className="text-brand-600 hover:underline">→ Housing rights guide</Link>
              <Link href="/guides/hidden-costs-netherlands"                  className="text-brand-600 hover:underline">→ Hidden costs explained</Link>
              <Link href="/tools/payslip-checker"                            className="text-brand-600 hover:underline">→ Check your payslip</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
