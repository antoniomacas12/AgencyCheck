import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ScoreBadge from "@/components/ScoreBadge";
import HousingBadge from "@/components/HousingBadge";
import WorkerReviewCard, { type WorkerReview } from "@/components/WorkerReviewCard";
import ReviewModal from "@/components/ReviewModal";
import { AGENCIES } from "@/lib/agencyData";
import { getReviewsByAgency } from "@/lib/reviewData";
import { getLocale } from "@/lib/getLocale";
import { getT } from "@/lib/i18n";
import { AgencyReviewsSection } from "@/components/AgencyReviewsSection";

export const dynamic = "force-dynamic";

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const agency = AGENCIES.find((a) => a.slug === params.slug);
  if (!agency) return { title: "Agency not found" };
  const reviews = getReviewsByAgency(params.slug);
  const count   = reviews.length;
  const avg     = count > 0
    ? (reviews.reduce((s, r) => s + r.overallRating, 0) / count).toFixed(1)
    : null;
  const ratingStr = avg ? ` Rated ${avg}/5 by ${count} workers.` : "";
  return {
    title:       `${agency.name} — Worker Reviews & Salary Reports — AgencyCheck`,
    description: `Worker reviews, salary reports, and issue reports for ${agency.name}.${ratingStr} Community-reported data.`,
    alternates:  { canonical: `/agencies/${agency.slug}/reviews` },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Stars({ value, size = "sm" }: { value: number; size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <span className="flex items-center gap-0.5" aria-label={`${value}/5`}>
      {Array.from({ length: 5 }, (_, i) => i + 1).map((s) => (
        <svg key={s} className={`${cls} ${s <= Math.round(value) ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function RatingBar({ label, avg, count }: { label: string; avg: number; count: number }) {
  const pct = Math.round((avg / 5) * 100);
  const color = avg >= 4 ? "bg-green-400" : avg >= 3 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-32 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium text-gray-700 w-8 text-right">{avg.toFixed(1)}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function AgencyReviewsPage({ params }: { params: { slug: string } }) {
  const agency = AGENCIES.find((a) => a.slug === params.slug);
  if (!agency) notFound();

  const locale = getLocale();
  const t = await getT(locale);

  // Load seed reviews for this agency
  // When Prisma is connected, replace with:
  //   const dbReviews = await prisma.review.findMany({ where: { agency: { slug: params.slug } }, orderBy: { createdAt: "desc" } });
  const seedReviews = getReviewsByAgency(params.slug);

  // Map to WorkerReview shape
  const reviews: WorkerReview[] = seedReviews
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((r, i) => ({
      id:                    `seed-${i}`,
      reviewType:            r.reviewType,
      title:                 r.title,
      overallRating:         r.overallRating,
      salaryRating:          r.salaryRating,
      housingRating:         r.housingRating ?? null,
      managementRating:      r.managementRating,
      contractClarityRating: r.contractClarityRating,
      issueTags:             r.issueTags,
      verificationStatus:    r.verificationStatus,
      comment:               r.comment,
      jobTitle:              r.jobTitle ?? null,
      city:                  r.city ?? null,
      createdAt:             r.createdAt,
    }));

  const hasReviews = reviews.length > 0;

  // Compute averages
  const avgOverall  = hasReviews ? reviews.reduce((s, r) => s + (r.overallRating ?? 0), 0) / reviews.length : 0;
  const avgSalary   = hasReviews ? reviews.reduce((s, r) => s + r.salaryRating, 0) / reviews.length : 0;
  const avgManage   = hasReviews ? reviews.reduce((s, r) => s + r.managementRating, 0) / reviews.length : 0;
  const avgContract = hasReviews ? reviews.reduce((s, r) => s + r.contractClarityRating, 0) / reviews.length : 0;
  const housingRevs = reviews.filter((r) => r.housingRating != null);
  const avgHousing  = housingRevs.length > 0 ? housingRevs.reduce((s, r) => s + (r.housingRating ?? 0), 0) / housingRevs.length : null;

  const verifiedCount = reviews.filter((r) => r.reviewType === "VERIFIED_WORKER").length;

  // Collect all issue tags with counts
  const tagCounts: Record<string, number> = {};
  for (const r of reviews) {
    for (const t of (r.issueTags ?? [])) {
      tagCounts[t] = (tagCounts[t] ?? 0) + 1;
    }
  }
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Star distribution
  const starDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => (r.overallRating ?? 0) >= star - 0.5 && (r.overallRating ?? 0) < star + 0.5).length,
  }));

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* ── Breadcrumb ── */}
      <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">{t("common.home")}</Link>
        <span>›</span>
        <Link href="/agencies" className="hover:text-brand-600">{t("nav.agencies")}</Link>
        <span>›</span>
        <Link href={`/agencies/${agency.slug}`} className="hover:text-brand-600">{agency.name}</Link>
        <span>›</span>
        <span className="text-gray-600">{t("nav.reviews")}</span>
      </nav>

      {/* ── Header card ── */}
      <div className="card p-5 mb-6">
        <div className="flex items-start gap-4">
          <ScoreBadge score={agency.score} size="lg" showLabel />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">{agency.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <HousingBadge housing={agency.housing} />
              <span className="text-xs text-gray-400">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                {verifiedCount > 0 && ` · ${verifiedCount} verified`}
              </span>
            </div>
            <div className="mt-3">
              <Link
                href={`/agencies/${agency.slug}`}
                className="text-xs text-brand-600 font-medium hover:underline"
              >
                ← Back to profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Review summary (only when reviews exist) ── */}
      {hasReviews && (
        <section className="card p-5 mb-6">
          <h2 className="text-sm font-bold text-gray-900 mb-4">⭐ Review Summary</h2>

          {/* Overall score + star distribution */}
          <div className="flex gap-6 mb-5">
            <div className="text-center">
              <p className="text-4xl font-extrabold text-gray-900">{avgOverall.toFixed(1)}</p>
              <Stars value={Math.round(avgOverall)} size="lg" />
              <p className="text-xs text-gray-400 mt-1">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {starDist.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-4">{star}</span>
                  <svg className="w-3 h-3 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : "0%" }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-4 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category averages */}
          <div className="space-y-2 mb-4">
            <RatingBar label={t("review_card.rating_salary")}   avg={avgSalary}   count={reviews.length} />
            <RatingBar label={t("review_card.rating_management")} avg={avgManage} count={reviews.length} />
            <RatingBar label={t("review_card.rating_contract")} avg={avgContract} count={reviews.length} />
            {avgHousing != null && (
              <RatingBar label={t("review_card.rating_housing")} avg={avgHousing}  count={housingRevs.length} />
            )}
          </div>

          {/* Top issue tags */}
          {topTags.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Frequently mentioned</p>
              <div className="flex flex-wrap gap-1.5">
                {topTags.map(([tag, count]) => {
                  const isNegative = ["housing_crowded","housing_dirty","late_salary","missing_overtime",
                    "unclear_contract","payslip_errors","transport_delays","management_poor",
                    "below_average_pay","no_transport","communication_poor"].includes(tag);
                  const isPositive = ["fair_pay","housing_good","housing_clean","transport_good",
                    "overtime_paid","fair_contract","management_good","payslip_ok",
                    "communication_good"].includes(tag);
                  const colorClass = isNegative
                    ? "bg-red-50 text-red-700 border-red-100"
                    : isPositive
                      ? "bg-green-50 text-green-700 border-green-100"
                      : "bg-gray-100 text-gray-600 border-gray-200";
                  const label = tag.replace(/_/g, " ");
                  return (
                    <span key={tag}
                      className={`inline-flex items-center gap-1 text-xs font-medium border rounded-full px-2.5 py-0.5 ${colorClass}`}>
                      {label}
                      <span className="text-[10px] opacity-70">×{count}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Real worker reviews (submitted + published via admin) ── */}
      <AgencyReviewsSection agencySlug={agency.slug} agencyName={agency.name} />

      {/* ── Salary reports ── */}
      <section className="mb-7">
        <h2 className="text-base font-bold text-gray-900 mb-3">
          💶 Salary Reports
        </h2>
        <div className="card p-6 text-center text-gray-400">
          <p className="text-2xl mb-2">💶</p>
          <p className="text-sm font-medium text-gray-600">No salary reports yet</p>
          <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
            Know what {agency.name} pays? Help other workers by sharing your hourly rate.
            {agency.jobTypes ? ` Job types at this agency: ${agency.jobTypes}.` : ""}
          </p>
          <div className="mt-4 flex justify-center">
            <ReviewModal agencySlug={agency.slug} agencyName={agency.name} reviewCount={reviews.length} />
          </div>
        </div>
      </section>

      {/* ── What workers check before signing ── */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-7 text-xs text-amber-800 leading-relaxed">
        <strong>ℹ️ Before you sign with {agency.name}:</strong>
        <ul className="mt-1.5 space-y-1">
          <li>→ Confirm housing deduction in writing (typically €80–110/week)</li>
          <li>→ Ask if transport is provided or if you need to arrange it yourself</li>
          <li>→ Check your contract against the ABU or NBBU CAO</li>
          <li>→ Your minimum hourly pay must be at least €14.71 (WML 2026)</li>
        </ul>
      </div>

      {/* ── Key facts about this agency ── */}
      <div className="card p-4 mb-7">
        <h3 className="text-sm font-bold text-gray-800 mb-3">📋 Agency Facts</h3>
        <div className="space-y-2 text-xs">
          {agency.cities.length > 0 && (
            <div className="flex justify-between gap-2">
              <span className="text-gray-500">Active cities</span>
              <span className="text-gray-800 font-medium text-right max-w-[60%]">
                {agency.cities.slice(0, 6).join(", ")}
                {agency.cities.length > 6 ? ` +${agency.cities.length - 6} more` : ""}
              </span>
            </div>
          )}
          <div className="flex justify-between gap-2">
            <span className="text-gray-500">Housing</span>
            <span className={`font-medium ${agency.housing === "YES" ? "text-green-700" : "text-gray-600"}`}>
              {agency.housing === "YES" ? "✅ Provided" : agency.housing === "NO" ? "❌ Not provided" : "❓ Ask agency"}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-gray-500">Transport</span>
            <span className={`font-medium ${agency.transport === "YES" ? "text-green-700" : "text-gray-600"}`}>
              {agency.transport === "YES" ? "✅ Provided" : agency.transport === "NO" ? "❌ Not provided" : "❓ Ask agency"}
            </span>
          </div>
          {agency.jobTypes && (
            <div className="flex justify-between gap-2">
              <span className="text-gray-500">Job types</span>
              <span className="text-gray-800 font-medium text-right">{agency.jobTypes}</span>
            </div>
          )}
          {agency.website && (
            <div className="flex justify-between gap-2">
              <span className="text-gray-500">Website</span>
              <a
                href={agency.website.startsWith("http") ? agency.website : `https://${agency.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 hover:underline font-medium truncate max-w-[60%]"
              >
                {agency.website.replace(/^https?:\/\//, "")} ↗
              </a>
            </div>
          )}
        </div>
      </div>

      {/* ── Submit CTA ── */}
      <div className="card p-5 text-center border-brand-100 bg-brand-50/30">
        <p className="font-semibold text-gray-800 text-sm mb-1">Worked at {agency.name}?</p>
        <p className="text-xs text-gray-500 mb-4 max-w-xs mx-auto">
          Share your experience to help other workers. You can submit anonymously or as a verified worker.
        </p>
        <div className="flex justify-center">
          <ReviewModal agencySlug={agency.slug} agencyName={agency.name} reviewCount={reviews.length} fullWidth={false} />
        </div>
      </div>

      {/* ── Useful links ── */}
      <section className="mt-6">
        <div className="card p-4">
          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">
            🛡️ Worker Rights Resources
          </h3>
          <div className="space-y-2">
            {[
              { label: "FNV — Workers Union Netherlands",       href: "https://www.fnv.nl" },
              { label: "SNF — Housing standards for workers",   href: "https://www.normeringflexwonen.nl" },
              { label: "Inspectie SZW — Workers rights info",    href: "https://www.nlarbeidsinspectie.nl" },
              { label: "Inspectie SZW — Report a violation",    href: "https://www.nlarbeidsinspectie.nl" },
            ].map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-brand-600 hover:underline">
                <span className="text-gray-300">→</span> {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <p className="mt-6 text-xs text-gray-400 text-center">
        All reviews and salary reports are worker-reported and informational. AgencyCheck does not verify this data.
      </p>
    </div>
  );
}
