import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { breadcrumbSchema } from "@/lib/schemaMarkup";
import AgencyCard from "@/components/AgencyCard";
import SectionHeader from "@/components/SectionHeader";
import WorkerReviewCard, { type WorkerReview } from "@/components/WorkerReviewCard";
import { CITIES, TOP_CITIES, JOB_SALARY_DATA } from "@/lib/seoData";
import { getCityWorkerData } from "@/lib/agencyDb";
import { normalizeCity, toCitySlug } from "@/lib/cityNormalization";
import { WML_HOURLY_2026 } from "@/lib/dutchTax";
import {
  getCityCharacter,
  getCityAgencies,
  getCityHousingAgencies,
  getCityMaybeHousingAgencies,
  getCityTransportAgencies,
  cityHasJobs,
  getCityJobs,
  getCityJobsWithHousing,
  getCityJobTypes,
  getCityReviews,
  getCityIssueTags,
  getCityAvgRating,
  ISSUE_TAG_DISPLAY,
} from "@/lib/cityUtils";
import type { JobListing } from "@/lib/jobData";

// ─── Static params: all 143 canonical cities ──────────────────────────────────
export function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const city = CITIES.find((c) => c.slug === params.city);
  if (!city) return { title: "City not found" };

  const agencies     = getCityAgencies(city.name);
  const housing      = getCityHousingAgencies(city.name);
  const jobs         = getCityJobs(city.name);
  const avgRating    = getCityAvgRating(city.name);
  const jobTypes     = getCityJobTypes(city.name);

  const housingStr   = housing.length > 0
    ? `${housing.length} agenc${housing.length === 1 ? "y" : "ies"} provide accommodation.`
    : "";
  const jobsStr      = jobs.length > 0
    ? ` ${jobs.length} active job listings.`
    : "";
  const ratingStr    = avgRating != null
    ? ` Worker rating: ${avgRating.toFixed(1)}/5.`
    : "";
  const topJob       = jobTypes[0]?.meta.title ?? "warehouse";

  return {
    title: `Agency Jobs in ${city.name} — Housing, Salary & Reviews — AgencyCheck`,
    description: `${agencies.length} employment agenc${agencies.length === 1 ? "y" : "ies"} in ${city.name}. ${housingStr}${jobsStr} Find ${topJob.toLowerCase()} jobs, compare salary, and read worker reviews.${ratingStr}`,
    alternates: { canonical: `/cities/${params.city}` },
    openGraph: {
      title: `Jobs in ${city.name} with Housing & Reviews — AgencyCheck`,
      description: `Compare ${agencies.length} employment agencies in ${city.name}. Housing, salary, transport, and worker reviews.`,
    },
  };
}

// ─── Inline sub-components ────────────────────────────────────────────────────

function Stars({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${value}/5`}>
      {Array.from({ length: 5 }, (_, i) => i + 1).map((s) => (
        <svg key={s} className={`w-3 h-3 ${s <= Math.round(value) ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function JobRow({ job }: { job: JobListing }) {
  const salaryDisplay = `€${job.salaryMin.toFixed(2)}–€${job.salaryMax.toFixed(2)}/hr`;
  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="card p-3.5 hover:shadow-md hover:border-brand-100 transition-all flex items-start gap-3"
    >
      <span className="text-2xl shrink-0">{job.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-bold text-gray-900 leading-tight">{job.title}</p>
          <span className="text-xs font-bold text-brand-700 shrink-0">{salaryDisplay}</span>
        </div>
        <p className="text-xs text-brand-600 hover:underline mt-0.5">{job.agencyName}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {job.housing === "YES" && (
            <span className="text-[10px] bg-green-50 text-green-700 border border-green-100 rounded-full px-1.5 py-0.5 font-medium">
              🏠 Housing incl.
            </span>
          )}
          {job.transport === "YES" && (
            <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-1.5 py-0.5 font-medium">
              🚌 Transport incl.
            </span>
          )}
          <span className="text-[10px] text-gray-400">{job.city}</span>
        </div>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function CityPage({ params }: { params: { city: string } }) {
  const city = CITIES.find((c) => c.slug === params.city);
  if (!city) notFound();

  // Fetch worker comment data from DB (city mentions + recent comments)
  // The city slug "den-haag" → normalized "den haag" for DB lookup
  const cityNorm      = normalizeCity(city.name);
  const workerData    = await getCityWorkerData(cityNorm).catch(() => ({ agencies: [], comments: [] }));
  const dbAgencies    = workerData.agencies;
  const dbComments    = workerData.comments;

  // Data
  const char         = getCityCharacter(city.name);
  const allAgencies  = getCityAgencies(city.name);
  const confirmed    = getCityHousingAgencies(city.name);
  const maybeHousing = getCityMaybeHousingAgencies(city.name);
  const withTransport = getCityTransportAgencies(city.name);
  const hasJobs      = cityHasJobs(city.name);
  const jobs         = hasJobs ? getCityJobs(city.name) : [];
  const jobsWithHousing = jobs.filter((j) => j.housing === "YES");
  const jobTypes     = getCityJobTypes(city.name);
  const reviews      = getCityReviews(city.name);
  const issueTags    = getCityIssueTags(city.name);
  const avgRating    = getCityAvgRating(city.name);

  const negativeIssueTags = issueTags.filter((t) => ISSUE_TAG_DISPLAY[t.tag]?.negative);
  const positiveIssueTags = issueTags.filter((t) => !ISSUE_TAG_DISPLAY[t.tag]?.negative);

  // Map reviews to WorkerReview type
  const mappedReviews: WorkerReview[] = reviews
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3)
    .map((r, i) => ({
      id:                    `city-${i}`,
      reviewType:            r.reviewType,
      title:                 r.title,
      overallRating:         r.overallRating,
      salaryRating:          r.salaryRating,
      housingRating:         r.housingRating ?? null,
      managementRating:      r.managementRating,
      contractClarityRating: r.contractClarityRating,
      issueTags:             r.issueTags,
      verificationStatus:    r.verificationStatus as "VERIFIED" | "WORKER_REPORTED" | "UNKNOWN",
      comment:               r.comment,
      jobTitle:              r.jobTitle ?? null,
      city:                  r.city ?? null,
      createdAt:             r.createdAt,
    }));

  // Salary slugs
  const salarySlugs = Object.keys(JOB_SALARY_DATA).slice(0, 4);

  // Other cities for navigation
  const otherCities = TOP_CITIES.filter((c) => c.slug !== params.city).slice(0, 10);

  // Housing char display
  const housingSignal =
    confirmed.length >= 3 ? "strong" :
    confirmed.length >= 1 ? "some" :
    "low";

  const crumbSchema = breadcrumbSchema([
    { name: "Home",   url: "/" },
    { name: "Cities", url: "/agencies" },
    { name: city.name, url: `/cities/${params.city}` },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />

      {/* ── Breadcrumb ── */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/agencies" className="hover:text-brand-600">Agencies</Link>
        <span>›</span>
        <span className="text-gray-600">Cities</span>
        <span>›</span>
        <span className="text-gray-800 font-medium">{city.name}</span>
      </nav>

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-400 border border-gray-200 rounded-full px-2 py-0.5">
            {city.region}
          </span>
          {city.population >= 100000 && (
            <span className="text-xs text-brand-600 bg-brand-50 border border-brand-100 rounded-full px-2 py-0.5">
              Major city
            </span>
          )}
          {housingSignal === "strong" && (
            <span className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
              🏠 Housing available
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
          Agency Jobs in {city.name}
          {confirmed.length > 0 && <span className="text-brand-600"> with Housing</span>}
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          {char.intro}
        </p>

        {/* Quick facts row */}
        <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <span className="text-gray-400">📍</span>
            <strong>{allAgencies.length}</strong> agenc{allAgencies.length === 1 ? "y" : "ies"}
          </span>
          {confirmed.length > 0 && (
            <span className="flex items-center gap-1 text-green-700">
              <span>🏠</span>
              <strong>{confirmed.length}</strong> with housing
            </span>
          )}
          {hasJobs && jobs.length > 0 && (
            <span className="flex items-center gap-1 text-brand-700">
              <span>💼</span>
              <strong>{jobs.length}</strong> active jobs
            </span>
          )}
          {withTransport.length > 0 && (
            <span className="flex items-center gap-1 text-blue-700">
              <span>🚌</span>
              <strong>{withTransport.length}</strong> with transport
            </span>
          )}
          {avgRating != null && (
            <span className="flex items-center gap-1 text-amber-600">
              <span>⭐</span>
              <strong>{avgRating.toFixed(1)}/5</strong> avg from {reviews.length} reviews
            </span>
          )}
        </div>
      </div>

      {/* ── Quick stats grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon: "🏢", value: allAgencies.length, label: "Agencies active"    },
          { icon: "🏠", value: confirmed.length,    label: "Provide housing"   },
          { icon: "💼", value: jobs.length,          label: "Active job listings" },
          { icon: "🚌", value: withTransport.length, label: "Include transport" },
        ].map((s) => (
          <div key={s.label} className="card p-3 text-center">
            <p className="text-2xl">{s.icon}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Logistics context note ── */}
      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-7 text-sm text-brand-800 leading-relaxed">
        <strong>💼 Work in {city.name}:</strong> {char.logisticsNote}
        {char.housingNote && (
          <p className="mt-1.5 text-xs text-brand-600">
            <strong>Housing tip:</strong> {char.housingNote}
          </p>
        )}
      </div>

      {/* ═══════════════════════════════════════════
          ACTIVE JOBS
      ═══════════════════════════════════════════ */}
      {hasJobs && jobs.length > 0 && (
        <section className="mb-8">
          <SectionHeader
            title={`Active Jobs in ${city.name}`}
            subtitle={`${jobs.length} current job listing${jobs.length !== 1 ? "s" : ""} from agencies in this city`}
            action={
              jobsWithHousing.length > 0 ? (
                <Link href={`/cities/${params.city}/housing`}
                  className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-full px-2.5 py-1 font-medium hover:bg-green-100 transition-colors">
                  🏠 {jobsWithHousing.length} with housing →
                </Link>
              ) : undefined
            }
          />

          {/* Job type chips */}
          {jobTypes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {jobTypes.map(({ type, count, meta }) => (
                <span key={type}
                  className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full px-3 py-1">
                  {meta.icon} {meta.title}
                  <span className="text-gray-400 ml-0.5">({count})</span>
                </span>
              ))}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-3">
            {jobs.slice(0, 8).map((job) => (
              <JobRow key={job.id} job={job} />
            ))}
          </div>

          {jobs.length > 8 && (
            <p className="text-xs text-gray-400 text-center mt-3">
              Showing 8 of {jobs.length} jobs. Check individual agency pages for the full list.
            </p>
          )}
        </section>
      )}

      {/* ═══════════════════════════════════════════
          AGENCIES WITH HOUSING
      ═══════════════════════════════════════════ */}
      {confirmed.length > 0 && (
        <section className="mb-8">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                🏠 Agencies with Housing in {city.name}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {confirmed.length} confirmed to include accommodation for workers
              </p>
            </div>
            <Link
              href={`/cities/${params.city}/housing`}
              className="shrink-0 text-xs text-green-700 font-semibold bg-green-50 border border-green-100 rounded-lg px-3 py-1.5 hover:bg-green-100 transition-colors"
            >
              View all housing →
            </Link>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 mb-4 text-xs text-green-800 leading-relaxed">
            ℹ️ These agencies include housing as part of the work arrangement.
            Always confirm the weekly deduction, room occupancy, and location before accepting.
            Standard deductions range from €80–€110/week.
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {confirmed.slice(0, 6).map((a) => <AgencyCard key={a.id} agency={a} />)}
          </div>

          {confirmed.length > 6 && (
            <div className="text-center mt-3">
              <Link href={`/cities/${params.city}/housing`}
                className="text-sm text-brand-600 hover:underline">
                + {confirmed.length - 6} more housing agencies in {city.name} →
              </Link>
            </div>
          )}
        </section>
      )}

      {/* ═══════════════════════════════════════════
          ALL AGENCIES
      ═══════════════════════════════════════════ */}
      <section className="mb-8">
        <SectionHeader
          title={`All Agencies in ${city.name}`}
          subtitle={`${allAgencies.length} ${allAgencies.length === 1 ? "agency" : "agencies"} — sorted by reliability score`}
          action={
            <Link href="/agencies" className="text-sm text-brand-600 font-medium hover:underline">
              All agencies →
            </Link>
          }
        />

        {allAgencies.length === 0 ? (
          <div className="card p-8 text-center text-gray-400">
            <p className="text-3xl mb-3">🏢</p>
            <p className="font-medium">No agencies found for {city.name}</p>
            <p className="text-sm mt-1">
              <Link href="/agencies" className="text-brand-600 hover:underline">Browse all agencies →</Link>
            </p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-3">
              {allAgencies.slice(0, 12).map((a) => <AgencyCard key={a.id} agency={a} />)}
            </div>
            {allAgencies.length > 12 && (
              <p className="text-xs text-gray-400 text-center mt-3">
                Showing 12 of {allAgencies.length} agencies.{" "}
                <Link href="/agencies" className="text-brand-600 hover:underline">
                  Browse all {allAgencies.length} →
                </Link>
              </p>
            )}
          </>
        )}
      </section>

      {/* ═══════════════════════════════════════════
          SALARY DATA
      ═══════════════════════════════════════════ */}
      <section className="mb-8">
        <SectionHeader
          title={`Salary Data — ${city.name}`}
          subtitle="Typical hourly rates for common agency job types. Verify gross vs net before signing."
        />

        <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-2.5 mb-4 text-xs text-amber-800">
          ⚠️ <strong>Gross ≠ net.</strong> Dutch income tax + healthcare levy will reduce your take-home by 25–35%.
          {char.salaryNote && ` ${char.salaryNote}`}
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {salarySlugs.map((slug) => {
            const job = JOB_SALARY_DATA[slug];
            if (!job) return null;
            const netEst = Math.round(job.avg * 173 * 0.63 - 140);
            return (
              <Link key={slug}
                href={`/salary/${slug}-${params.city}`}
                className="card p-4 hover:shadow-md hover:border-brand-100 transition-all flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">{job.label ?? slug.replace(/-/g, " ")}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{job.description}</p>
                  <p className="text-[10px] text-gray-300 mt-1">Estimated · worker-reported data</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-extrabold text-brand-700">€{job.avg}/hr</p>
                  <p className="text-xs text-gray-400">≈€{netEst}/mo net</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-4">
          <Link href="/tools/real-income-calculator"
            className="text-xs text-brand-600 hover:underline">
            Calculate my real take-home in {city.name} →
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WORKER REVIEWS + ISSUE SIGNALS
      ═══════════════════════════════════════════ */}
      <section className="mb-8">
        <SectionHeader
          title={`Worker Reports — ${city.name}`}
          subtitle={
            reviews.length > 0
              ? `${reviews.length} review${reviews.length !== 1 ? "s" : ""} from workers at agencies active in ${city.name}`
              : `Issue signals and reviews for agencies active in ${city.name}`
          }
        />

        {/* Issue signals */}
        {issueTags.length > 0 && (
          <div className="card p-4 mb-4">
            <p className="text-xs font-bold text-gray-700 mb-2">Reported by workers at agencies in this city:</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {negativeIssueTags.slice(0, 5).map(({ tag, count }) => {
                const d = ISSUE_TAG_DISPLAY[tag];
                return (
                  <span key={tag}
                    className="inline-flex items-center gap-1 text-xs font-medium bg-red-50 text-red-700 border border-red-100 rounded-full px-2.5 py-0.5">
                    {d?.icon ?? "⚠️"} {d?.label ?? tag.replace(/_/g, " ")}
                    <span className="text-red-400 text-[10px] ml-0.5">×{count}</span>
                  </span>
                );
              })}
              {positiveIssueTags.slice(0, 3).map(({ tag, count }) => {
                const d = ISSUE_TAG_DISPLAY[tag];
                return (
                  <span key={tag}
                    className="inline-flex items-center gap-1 text-xs font-medium bg-green-50 text-green-700 border border-green-100 rounded-full px-2.5 py-0.5">
                    {d?.icon ?? "✅"} {d?.label ?? tag.replace(/_/g, " ")}
                    <span className="text-green-400 text-[10px] ml-0.5">×{count}</span>
                  </span>
                );
              })}
            </div>
            {avgRating != null && (
              <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                <Stars value={Math.round(avgRating)} />
                <span className="text-xs text-gray-500">
                  Average rating: <strong>{avgRating.toFixed(1)}/5</strong> from {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Recent reviews */}
        {mappedReviews.length > 0 ? (
          <div className="space-y-3">
            {mappedReviews.map((review) => (
              <WorkerReviewCard key={review.id} review={review} />
            ))}
            {reviews.length > 3 && (
              <p className="text-xs text-gray-400 text-center pt-1">
                Showing 3 of {reviews.length} reviews.
                Browse individual agency pages for more.
              </p>
            )}
          </div>
        ) : (
          <div className="card p-5 text-center text-gray-400">
            <p className="text-2xl mb-2">⭐</p>
            <p className="text-sm text-gray-600">No reviews yet for agencies in {city.name}</p>
            <p className="text-xs mt-1 max-w-xs mx-auto">
              Work with an agency in this city? Share your experience to help other workers.
            </p>
            <Link href="/agencies"
              className="inline-block mt-3 text-xs text-brand-600 hover:underline">
              Find an agency and leave a review →
            </Link>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════
          MAYBE HOUSING
      ═══════════════════════════════════════════ */}
      {maybeHousing.length > 0 && (
        <section className="mb-8">
          <SectionHeader
            title="Housing May Be Available — Ask Directly"
            subtitle="These agencies haven't confirmed housing status — contact them to find out"
          />
          <div className="grid sm:grid-cols-2 gap-3">
            {maybeHousing.slice(0, 4).map((a) => <AgencyCard key={a.id} agency={a} />)}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          WORKER CHECKLIST
      ═══════════════════════════════════════════ */}
      <section className="mb-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h2 className="font-bold text-amber-900 text-sm mb-2">
            ⚠️ Before you sign with any agency in {city.name}
          </h2>
          <ul className="text-xs text-amber-800 space-y-1.5 leading-relaxed">
            <li>→ Ask for the housing deduction in writing. Standard range: <strong>€80–110/week</strong>.</li>
            <li>→ Confirm transport: who arranges it, is it free, or is it deducted from salary?</li>
            <li>→ Minimum wage 2026: <strong>€{WML_HOURLY_2026}/hr</strong> — your pay must be at or above this.</li>
            <li>→ Get the contract in a language you understand. Ask for a translation if needed.</li>
            <li>→ Check your payslip every month. Night/Sunday premiums must appear on the slip.</li>
            <li>→ Keep copies of all documents: contract, ID, payslips, housing agreement.</li>
          </ul>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          REAL INCOME CTA
      ═══════════════════════════════════════════ */}
      <section className="mb-8">
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4">
          <div>
            <p className="font-bold text-brand-800">🧮 What will you actually earn in {city.name}?</p>
            <p className="text-xs text-brand-600 mt-1 leading-relaxed max-w-md">
              Your gross hourly rate is not what you take home. Factor in Dutch income tax,
              healthcare levy (ZVW), housing deductions, and transport costs.
            </p>
          </div>
          <Link href="/tools/real-income-calculator"
            className="shrink-0 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap">
            Calculate real income →
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          INTERNAL LINKING GRID
      ═══════════════════════════════════════════ */}
      <section className="mb-8">
        <h3 className="text-sm font-bold text-gray-700 mb-3">🔗 Related pages</h3>
        <div className="grid sm:grid-cols-2 gap-2 text-xs">
          {/* Housing variant */}
          {confirmed.length > 0 && (
            <Link href={`/cities/${params.city}/housing`}
              className="flex items-center gap-2 card px-3 py-2.5 hover:border-brand-200 hover:bg-brand-50/30 transition-all">
              <span>🏠</span>
              <span className="text-gray-700 font-medium">Jobs with housing in {city.name}</span>
              <span className="text-gray-400 ml-auto">{confirmed.length} →</span>
            </Link>
          )}
          {/* Jobs link */}
          {hasJobs && jobs.length > 0 && (
            <Link href={`/agencies`}
              className="flex items-center gap-2 card px-3 py-2.5 hover:border-brand-200 hover:bg-brand-50/30 transition-all">
              <span>💼</span>
              <span className="text-gray-700 font-medium">Warehouse jobs in {city.name}</span>
              <span className="text-gray-400 ml-auto">{jobs.length} →</span>
            </Link>
          )}
          {/* Salary pages */}
          <Link href={`/salary/order-picker-${params.city}`}
            className="flex items-center gap-2 card px-3 py-2.5 hover:border-brand-200 hover:bg-brand-50/30 transition-all">
            <span>💶</span>
            <span className="text-gray-700 font-medium">Order picker salary in {city.name}</span>
            <span className="text-gray-400 ml-auto">→</span>
          </Link>
          <Link href={`/salary/forklift-driver-${params.city}`}
            className="flex items-center gap-2 card px-3 py-2.5 hover:border-brand-200 hover:bg-brand-50/30 transition-all">
            <span>🚜</span>
            <span className="text-gray-700 font-medium">Forklift driver salary in {city.name}</span>
            <span className="text-gray-400 ml-auto">→</span>
          </Link>
          {/* Agency with housing global page */}
          <Link href="/agencies-with-housing"
            className="flex items-center gap-2 card px-3 py-2.5 hover:border-brand-200 hover:bg-brand-50/30 transition-all">
            <span>🏠</span>
            <span className="text-gray-700 font-medium">All agencies with housing — Netherlands</span>
            <span className="text-gray-400 ml-auto">→</span>
          </Link>
          {/* Real income calculator */}
          <Link href="/tools/real-income-calculator"
            className="flex items-center gap-2 card px-3 py-2.5 hover:border-brand-200 hover:bg-brand-50/30 transition-all">
            <span>🧮</span>
            <span className="text-gray-700 font-medium">Real income calculator</span>
            <span className="text-gray-400 ml-auto">→</span>
          </Link>
        </div>
      </section>

      {/* ── Top agencies linking to their review pages ── */}
      {allAgencies.length > 0 && (
        <section className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            📋 Agency review pages in {city.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {allAgencies.slice(0, 10).map((a) => (
              <Link key={a.slug} href={`/agencies/${a.slug}/reviews`}
                className="text-xs text-brand-600 border border-brand-100 rounded-full px-3 py-1 hover:bg-brand-50 transition-colors">
                {a.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          WORKER COMMENTS FROM DB (city mentions)
      ═══════════════════════════════════════════ */}
      {(dbAgencies.length > 0 || dbComments.length > 0) && (
        <section className="mb-8">
          <div className="mb-3">
            <h2 className="text-base font-bold text-gray-900">
              💬 What workers say about agencies in {city.name}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Based on worker-submitted comments on AgencyCheck. More may be added over time.
            </p>
          </div>

          {/* Agencies workers mention for this city */}
          {dbAgencies.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Agencies mentioned by workers in {city.name}
              </p>
              <div className="flex flex-wrap gap-2">
                {dbAgencies.map((a) => (
                  <Link
                    key={a.agencyId}
                    href={
                      a.agencySlug
                        ? `/agencies/${a.agencySlug}/${toCitySlug(cityNorm)}`
                        : `/agencies`
                    }
                    className="inline-flex items-center gap-1.5 text-xs bg-white border border-gray-200
                      text-gray-700 px-3 py-1.5 rounded-full hover:bg-brand-50 hover:border-brand-200
                      hover:text-brand-700 transition-colors"
                  >
                    🏢 {a.agencyName ?? a.agencyId}
                    {a.mentionCount > 1 && (
                      <span className="text-gray-400">·{a.mentionCount}</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recent worker comments for this city */}
          {dbComments.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                Recent worker comments from {city.name}
              </p>
              <div className="space-y-3">
                {dbComments.map((c) => {
                  const diff = Date.now() - new Date(c.createdAt).getTime();
                  const days = Math.floor(diff / 86_400_000);
                  const timeStr = days === 0 ? "today" : days === 1 ? "yesterday" : `${days}d ago`;
                  return (
                    <div
                      key={c.id}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3"
                    >
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1">
                        <span className="text-xs font-semibold text-gray-800">👷 {c.agencyName}</span>
                        <span className="text-[11px] text-gray-400">·</span>
                        <span className="text-[11px] text-gray-500">📍 {c.city}</span>
                        <span className="text-[11px] text-gray-400">·</span>
                        <span className="text-[11px] text-gray-400">{timeStr}</span>
                        {c.agencySlug && (
                          <>
                            <span className="text-[11px] text-gray-400">·</span>
                            <Link
                              href={`/agencies/${c.agencySlug}/${toCitySlug(cityNorm)}`}
                              className="text-[11px] text-brand-600 hover:underline"
                            >
                              View agency page →
                            </Link>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed break-words">
                        {c.body.length > 300 ? c.body.slice(0, 300) + "…" : c.body}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Other cities ── */}
      <section>
        <h3 className="text-sm font-bold text-gray-700 mb-3">🗺️ More cities</h3>
        <div className="flex flex-wrap gap-2">
          {otherCities.map((c) => (
            <Link key={c.slug} href={`/cities/${c.slug}`}
              className="text-xs text-brand-600 border border-brand-100 rounded-full px-3 py-1 hover:bg-brand-50 transition-colors">
              {c.name}
            </Link>
          ))}
          <Link href="/agencies"
            className="text-xs text-gray-500 border border-gray-200 rounded-full px-3 py-1 hover:bg-gray-50">
            All agencies →
          </Link>
        </div>
      </section>

    </div>
  );
}
