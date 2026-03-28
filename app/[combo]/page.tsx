/**
 * AgencyCheck — Programmatic combo page
 *
 * Handles all dynamic programmatic SEO routes:
 *   /forklift-jobs-netherlands
 *   /forklift-jobs-amsterdam
 *   /forklift-jobs-amsterdam-with-accommodation
 *   /jobs-with-accommodation-netherlands
 *
 * Total static paths: 553+ (12 job types × combo variants)
 */

import type { Metadata }     from "next";
import Link                  from "next/link";
import {
  getAllComboParams,
  parseComboSlug,
  SEO_JOB_TYPES,
  SEO_TOP_CITIES,
  getJobsForTypeAndCity,
  avgSalaryForJobs,
  housingPctForJobs,
  topAgenciesForJobs,
  type SeoJobType,
}                            from "@/lib/seoRoutes";
import type { CityData }     from "@/lib/seoData";
import { CITIES }            from "@/lib/seoData";
import {
  getJobTypeIntro,
  getCityJobTypeIntro,
  getJobConditionBullets,
  getJobTypeFAQ,
  buildFAQSchema,
  buildJobPostingSchema,
}                            from "@/lib/seoContent";
import {
  rankJobs,
  getTopEmployerBadge,
}                            from "@/lib/jobRanking";
import InternalLinksGrid     from "@/components/InternalLinksGrid";
import SalaryCalculatorEmbed from "@/components/SalaryCalculatorEmbed";

// ─── Static generation ────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return getAllComboParams();
}

export const dynamicParams = false;

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { combo: string };
}): Promise<Metadata> {
  const parsed = parseComboSlug(params.combo);
  if (!parsed) return { title: "Jobs in Netherlands | AgencyCheck" };

  if (parsed.type === "national-housing") {
    return {
      title:       "Jobs with Accommodation Netherlands 2026 | AgencyCheck",
      description: "Find agency jobs in the Netherlands that include housing. Compare agencies offering SNF-certified accommodation with rent deductions from €80/week.",
      alternates:  { canonical: `https://agencycheck.nl/${params.combo}` },
    };
  }

  if (parsed.type === "national-jobtype") {
    const { jobType } = parsed;
    return {
      title:       `${jobType.label} Jobs Netherlands 2026 — €${jobType.salaryMin.toFixed(2)}–€${jobType.salaryMax.toFixed(2)}/hr | AgencyCheck`,
      description: `Browse ${jobType.label.toLowerCase()} jobs across the Netherlands. Compare verified agencies, salaries, and housing options. ${jobType.description}`,
      alternates:  { canonical: `https://agencycheck.nl/${params.combo}` },
    };
  }

  if (parsed.type === "city-jobtype") {
    const { jobType, city } = parsed;
    return {
      title:       `${jobType.label} Jobs in ${city.name} 2026 — €${jobType.salaryMin.toFixed(2)}–€${jobType.salaryMax.toFixed(2)}/hr | AgencyCheck`,
      description: `${jobType.label} positions in ${city.name}. See real salaries, top agencies, and housing options. Updated daily.`,
      alternates:  { canonical: `https://agencycheck.nl/${params.combo}` },
    };
  }

  if (parsed.type === "city-jobtype-housing") {
    const { jobType, city } = parsed;
    return {
      title:       `${jobType.label} Jobs in ${city.name} with Housing 2026 | AgencyCheck`,
      description: `${jobType.label} jobs in ${city.name} with agency-arranged accommodation. Rent from €80–€130/week. Compare verified agencies.`,
      alternates:  { canonical: `https://agencycheck.nl/${params.combo}` },
    };
  }

  return { title: "Jobs in Netherlands | AgencyCheck" };
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function ComboPage({ params }: { params: { combo: string } }) {
  const parsed = parseComboSlug(params.combo);
  if (!parsed) return <NotFoundSection />;

  if (parsed.type === "national-housing")     return <NationalHousingPage />;
  if (parsed.type === "national-jobtype")     return <NationalJobTypePage jobType={parsed.jobType} />;
  if (parsed.type === "city-jobtype")         return <CityJobTypePage jobType={parsed.jobType} city={parsed.city} />;
  if (parsed.type === "city-jobtype-housing") return <CityJobTypeHousingPage jobType={parsed.jobType} city={parsed.city} />;

  return <NotFoundSection />;
}

// ─── Sub-templates ────────────────────────────────────────────────────────────

// ── 1. National job type page ─────────────────────────────────────────────────

function NationalJobTypePage({ jobType }: { jobType: SeoJobType }) {
  const allJobs     = getJobsForTypeAndCity(jobType.slug);
  const ranked      = rankJobs(allJobs);
  const avgSal      = avgSalaryForJobs(allJobs);
  const housingPct  = housingPctForJobs(allJobs);
  const topAgencies = topAgenciesForJobs(allJobs, 5);
  const intro       = getJobTypeIntro(jobType);
  const conditions  = getJobConditionBullets(jobType.slug);
  const faq         = getJobTypeFAQ(jobType);
  const faqSchema   = buildFAQSchema(faq);

  const cityLinks = SEO_TOP_CITIES.slice(0, 20).map((c) => ({
    href:  `/${jobType.prefix}-jobs-${c.slug}`,
    label: c.name,
    icon:  "📍",
  }));

  const relatedJobLinks = SEO_JOB_TYPES.filter((j) => j.slug !== jobType.slug).map((j) => ({
    href:  `/${j.prefix}-jobs-netherlands`,
    label: j.label,
    icon:  j.icon,
  }));

  const housingLink = {
    href:      `/${jobType.prefix}-jobs-netherlands-with-accommodation`,
    label:     `${jobType.label} jobs with housing`,
    icon:      "🏠",
    highlight: true,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/" className="hover:text-brand-600">AgencyCheck</Link>
          <span>/</span>
          <Link href="/jobs" className="hover:text-brand-600">Jobs</Link>
          <span>/</span>
          <span className="text-gray-700">{jobType.label} Netherlands</span>
        </div>

        {/* Hero */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {jobType.icon} {jobType.label} Jobs in the Netherlands
        </h1>
        <p className="text-gray-600 text-base leading-relaxed mb-4">{intro}</p>

        {/* Data bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <StatCard label="Active jobs"  value={allJobs.length > 0 ? `${allJobs.length}+` : "50+"} />
          <StatCard label="Avg salary"   value={avgSal > 0 ? `€${avgSal.toFixed(2)}/hr` : `€${jobType.avgSalary.toFixed(2)}/hr`} />
          <StatCard label="With housing" value={`${housingPct > 0 ? housingPct : "~30"}%`} />
          <StatCard label="Agencies"     value={topAgencies.length > 0 ? `${topAgencies.length}+` : "10+"} />
        </div>

        <Link
          href={`/${jobType.prefix}-jobs-netherlands-with-accommodation`}
          className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors mb-8"
        >
          🏠 See jobs with accommodation
        </Link>

        {/* Working conditions */}
        <section className="mb-8 bg-amber-50 border border-amber-100 rounded-xl p-5">
          <h2 className="text-base font-bold text-amber-900 mb-3">
            What it&apos;s really like — {jobType.label} in the Netherlands
          </h2>
          <ul className="space-y-2">
            {conditions.map((c, i) => (
              <li key={i} className="flex gap-2 text-sm text-amber-800">
                <span className="mt-0.5 text-amber-500 shrink-0">→</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Salary table */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            {jobType.label} Salary in the Netherlands 2026
          </h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Level</th>
                  <th className="px-4 py-3 text-right">Hourly (gross)</th>
                  <th className="px-4 py-3 text-right">Monthly (40h week)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">Entry level</td>
                  <td className="px-4 py-3 text-right font-medium">€{jobType.salaryMin.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-gray-600">€{Math.round(jobType.salaryMin * 173).toLocaleString()}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">Average</td>
                  <td className="px-4 py-3 text-right font-medium text-green-700">€{jobType.avgSalary.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-gray-600">€{Math.round(jobType.avgSalary * 173).toLocaleString()}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">Experienced / night shift</td>
                  <td className="px-4 py-3 text-right font-medium">€{jobType.salaryMax.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-gray-600">€{Math.round(jobType.salaryMax * 173).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Gross figures. Monthly = hourly × 173 (40h/week). Dutch income tax: approx. 20–27% effective for these income levels.{" "}
            <Link href="/tools/real-salary-calculator" className="text-brand-600 hover:underline">
              Calculate your exact net salary →
            </Link>
          </p>
        </section>

        {/* Salary calculator embed */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Calculate Your Take-Home Pay</h2>
          <SalaryCalculatorEmbed
            defaultHourly={jobType.avgSalary}
            defaultHours={40}
            jobLabel={`${jobType.label} in the Netherlands`}
          />
        </section>

        {/* Top agencies */}
        {topAgencies.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Top Agencies for {jobType.label} Jobs
            </h2>
            <div className="space-y-2">
              {topAgencies.map((ag) => {
                const badge = getTopEmployerBadge(ag.slug);
                return (
                  <Link
                    key={ag.slug}
                    href={`/agencies/${ag.slug}`}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-brand-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900 text-sm">{ag.name}</span>
                      {badge && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${badge.className}`}>
                          {badge.label}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{ag.count} jobs →</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Job listings */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {jobType.label} Vacancies — Netherlands
          </h2>
          {ranked.length > 0
            ? <JobList jobs={ranked.slice(0, 20)} />
            : <NoJobsPlaceholder jobType={jobType} />
          }
        </section>

        {/* Internal links */}
        <InternalLinksGrid
          title={`${jobType.label} jobs by city`}
          links={[housingLink, ...cityLinks]}
        />
        <InternalLinksGrid
          title="Other job types in the Netherlands"
          links={relatedJobLinks}
        />

        {/* FAQ */}
        <FAQSection faq={faq} />
      </div>
    </>
  );
}

// ── 2. City + job type page ───────────────────────────────────────────────────

function CityJobTypePage({ jobType, city }: { jobType: SeoJobType; city: CityData }) {
  const allJobs     = getJobsForTypeAndCity(jobType.slug, city.slug);
  const ranked      = rankJobs(allJobs);
  const avgSal      = avgSalaryForJobs(allJobs);
  const housingPct  = housingPctForJobs(allJobs);
  const topAgencies = topAgenciesForJobs(allJobs, 4);
  const intro       = getCityJobTypeIntro(jobType, city);
  const faq         = getJobTypeFAQ(jobType, city.name);
  const faqSchema   = buildFAQSchema(faq);

  // Nearby cities (same region)
  const nearbyCities = CITIES.filter(
    (c) => c.region === city.region && c.slug !== city.slug && c.population >= 30000
  ).slice(0, 6);

  const cityJobLinks = nearbyCities.map((c) => ({
    href:  `/${jobType.prefix}-jobs-${c.slug}`,
    label: `${jobType.label} in ${c.name}`,
    icon:  "📍",
  }));

  const otherJobsInCity = SEO_JOB_TYPES.filter((j) => j.slug !== jobType.slug).slice(0, 8).map((j) => ({
    href:  `/${j.prefix}-jobs-${city.slug}`,
    label: `${j.label} in ${city.name}`,
    icon:  j.icon,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-brand-600">AgencyCheck</Link>
          <span>/</span>
          <Link href={`/${jobType.prefix}-jobs-netherlands`} className="hover:text-brand-600">
            {jobType.label} Netherlands
          </Link>
          <span>/</span>
          <span className="text-gray-700">{city.name}</span>
        </div>

        {/* Hero */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {jobType.icon} {jobType.label} Jobs in {city.name}
        </h1>
        <p className="text-gray-600 text-base leading-relaxed mb-5">{intro}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard label="Active jobs"  value={allJobs.length > 0 ? `${allJobs.length}+` : "10+"} />
          <StatCard label="Avg salary"   value={avgSal > 0 ? `€${avgSal.toFixed(2)}/hr` : `€${jobType.avgSalary.toFixed(2)}/hr`} />
          <StatCard label="With housing" value={`${housingPct > 0 ? housingPct : "~25"}%`} />
          <StatCard label="City pop."    value={city.population >= 1000 ? `${Math.round(city.population / 1000)}k` : city.population.toString()} />
        </div>

        {/* CTA row */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href={`/${jobType.prefix}-jobs-${city.slug}-with-accommodation`}
            className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
          >
            🏠 Jobs with housing in {city.name}
          </Link>
          <Link
            href={`/jobs-in-${city.slug}`}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:border-brand-300 hover:text-brand-700 transition-colors"
          >
            All jobs in {city.name} →
          </Link>
        </div>

        {/* Top agencies */}
        {topAgencies.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              Top agencies for {jobType.label} in {city.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {topAgencies.map((ag) => {
                const badge = getTopEmployerBadge(ag.slug);
                return (
                  <Link
                    key={ag.slug}
                    href={`/agencies/${ag.slug}`}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-brand-300 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm">{ag.name}</span>
                      {badge && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${badge.className}`}>
                          {badge.label}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{ag.count} jobs</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Job listings */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {jobType.label} Vacancies in {city.name}
          </h2>
          {ranked.length > 0
            ? <JobList jobs={ranked.slice(0, 20)} />
            : <NoJobsPlaceholder jobType={jobType} cityName={city.name} />
          }
        </section>

        {/* Internal links */}
        <InternalLinksGrid
          title={`${jobType.label} jobs in nearby cities`}
          links={[
            { href: `/${jobType.prefix}-jobs-netherlands`, label: `All ${jobType.label} jobs Netherlands`, icon: "🇳🇱", highlight: true },
            { href: `/${jobType.prefix}-jobs-${city.slug}-with-accommodation`, label: `${jobType.label} with housing in ${city.name}`, icon: "🏠" },
            ...cityJobLinks,
          ]}
        />
        <InternalLinksGrid
          title={`Other jobs in ${city.name}`}
          links={otherJobsInCity}
        />

        {/* FAQ */}
        <FAQSection faq={faq} />
      </div>
    </>
  );
}

// ── 3. City + job type + housing page ─────────────────────────────────────────

function CityJobTypeHousingPage({ jobType, city }: { jobType: SeoJobType; city: CityData }) {
  const allJobs     = getJobsForTypeAndCity(jobType.slug, city.slug);
  const housingJobs = rankJobs(
    allJobs.filter((j) => j.housing === "YES" || j.housing === "UNKNOWN")
  );
  const avgSal  = avgSalaryForJobs(housingJobs);
  const faq     = getJobTypeFAQ(jobType, city.name);
  const faqSchema = buildFAQSchema(faq);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-brand-600">AgencyCheck</Link>
          <span>/</span>
          <Link href={`/${jobType.prefix}-jobs-${city.slug}`} className="hover:text-brand-600">
            {jobType.label} in {city.name}
          </Link>
          <span>/</span>
          <span className="text-gray-700">With housing</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          🏠 {jobType.label} Jobs in {city.name} with Accommodation
        </h1>
        <p className="text-gray-600 text-base leading-relaxed mb-5">
          Find {jobType.label.toLowerCase()} positions in {city.name} where the agency arranges housing.
          Accommodation is deducted from your salary — typically €80–€130/week, legally capped at 25% of gross wage (SNF standard).
          {avgSal > 0 && ` Average pay for these roles: €${avgSal.toFixed(2)}/hr.`}
        </p>

        {/* Housing info box */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8">
          <h2 className="font-bold text-blue-900 mb-2">What to expect with agency housing</h2>
          <ul className="space-y-1.5 text-sm text-blue-800">
            <li>→ Rent deducted weekly: €80–€130 (SNF standard, max 25% of gross wage)</li>
            <li>→ Transport to worksite usually included</li>
            <li>→ Shared accommodation (typically 2–4 people per room)</li>
            <li>→ Contract tied to employment — if you leave the job, you must vacate housing within 7–14 days</li>
            <li>→{" "}
              <Link href="/agencies-with-housing" className="underline hover:text-blue-600">
                Compare all agencies with housing →
              </Link>
            </li>
          </ul>
        </div>

        {/* Job listings */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {jobType.label} Jobs with Housing in {city.name}
          </h2>
          {housingJobs.length > 0
            ? <JobList jobs={housingJobs.slice(0, 20)} showHousingBadge />
            : <NoJobsPlaceholder jobType={jobType} cityName={city.name} housingOnly />
          }
        </section>

        {/* Internal links */}
        <InternalLinksGrid
          title="Related pages"
          links={[
            { href: `/${jobType.prefix}-jobs-${city.slug}`,          label: `All ${jobType.label} jobs in ${city.name}`,  icon: "💼", highlight: true },
            { href: `/${jobType.prefix}-jobs-netherlands`,            label: `${jobType.label} jobs nationwide`,           icon: "🇳🇱" },
            { href: "/agencies-with-housing",                         label: "All agencies with housing",                  icon: "🏠" },
            { href: "/jobs-with-accommodation-netherlands",           label: "Jobs with accommodation Netherlands",        icon: "🏘️" },
          ]}
        />

        {/* FAQ */}
        <FAQSection faq={faq} />
      </div>
    </>
  );
}

// ── 4. National housing landing ───────────────────────────────────────────────

function NationalHousingPage() {
  const housingJobTypeLinks = SEO_JOB_TYPES.map((jt) => ({
    href:  `/${jt.prefix}-jobs-netherlands`,
    label: `${jt.label} with housing`,
    icon:  jt.icon,
  }));

  const topCityHousingLinks = SEO_TOP_CITIES.slice(0, 12).map((c) => ({
    href:  `/jobs-in-${c.slug}`,
    label: `Jobs in ${c.name}`,
    icon:  "📍",
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-brand-600">AgencyCheck</Link>
        <span>/</span>
        <span className="text-gray-700">Jobs with accommodation Netherlands</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        🏠 Jobs with Accommodation Netherlands 2026
      </h1>
      <p className="text-gray-600 text-base leading-relaxed mb-6">
        Many employment agencies in the Netherlands arrange housing for workers as part of the job package.
        This is especially common in logistics, greenhouse horticulture, production, and cleaning sectors.
        Rent is typically deducted €80–€130/week under the SNF standard, legally capped at 25% of gross wage.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard label="Agencies with housing" value="40+" />
        <StatCard label="Avg rent deduction"    value="€100/wk" />
        <StatCard label="Transport included"    value="Usually" />
        <StatCard label="SNF certified"         value="Required" />
      </div>

      <section className="mb-8 bg-amber-50 border border-amber-100 rounded-xl p-5">
        <h2 className="text-base font-bold text-amber-900 mb-3">What you need to know about agency housing</h2>
        <ul className="space-y-2 text-sm text-amber-800">
          <li>→ <strong>SNF certification</strong> means the accommodation meets Dutch safety and hygiene standards.</li>
          <li>→ <strong>Rent is deducted weekly</strong>, not monthly. Typical range: €80–€130/week for a shared room with utilities included.</li>
          <li>→ <strong>Legal cap:</strong> The agency cannot deduct more than 25% of your gross weekly wage for housing.</li>
          <li>→ <strong>Transport:</strong> Most agencies include a bus or van from accommodation to worksite. Confirm before accepting.</li>
          <li>→ <strong>Contract dependency:</strong> If you end the employment contract, you must vacate housing within 7–14 days.</li>
        </ul>
      </section>

      <InternalLinksGrid
        title="Browse by job type — jobs with accommodation"
        links={housingJobTypeLinks}
      />
      <InternalLinksGrid
        title="Browse by city"
        links={topCityHousingLinks}
      />

      <div className="mt-6">
        <Link
          href="/agencies-with-housing"
          className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-brand-700 transition-colors"
        >
          Compare all agencies with housing →
        </Link>
      </div>
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
      <div className="text-lg font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

type JobItem = ReturnType<typeof getJobsForTypeAndCity>[number];

function JobList({
  jobs,
  showHousingBadge = false,
}: {
  jobs: JobItem[];
  showHousingBadge?: boolean;
}) {
  return (
    <div className="space-y-3">
      {jobs.map((job) => {
        const badge      = getTopEmployerBadge(job.agencySlug);
        const hasHousing = job.housing === "YES";
        const schema     = buildJobPostingSchema(job);

        return (
          <div key={`${job.agencySlug}-${job.title}-${job.city}`}>
            {schema && (
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
              />
            )}
            <Link
              href={`/agencies/${job.agencySlug}`}
              className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-brand-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{job.title}</h3>
                    {badge && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${badge.className}`}>
                        {badge.label}
                      </span>
                    )}
                    {(showHousingBadge || hasHousing) && (
                      <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded-full shrink-0">
                        🏠 Housing
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                    <span>{job.agencyName}</span>
                    <span>📍 {job.city}</span>
                    {job.salaryMin > 0 && (
                      <span className="text-green-700 font-medium">
                        €{job.salaryMin.toFixed(2)}
                        {job.salaryMax > job.salaryMin ? `–€${job.salaryMax.toFixed(2)}` : ""}
                        /hr
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-brand-600 font-medium shrink-0">View →</span>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

function NoJobsPlaceholder({
  jobType,
  cityName,
  housingOnly = false,
}: {
  jobType: SeoJobType;
  cityName?: string;
  housingOnly?: boolean;
}) {
  const location = cityName ?? "the Netherlands";
  return (
    <div className="text-center py-10 bg-gray-50 border border-gray-200 rounded-xl">
      <p className="text-gray-500 text-sm mb-3">
        No {housingOnly ? "housing-included " : ""}{jobType.label.toLowerCase()} vacancies indexed for {location} yet.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href={`/${jobType.prefix}-jobs-netherlands`} className="text-sm text-brand-600 hover:underline">
          View all {jobType.label} jobs in Netherlands →
        </Link>
        <Link href="/jobs" className="text-sm text-brand-600 hover:underline">
          Browse all job types →
        </Link>
      </div>
    </div>
  );
}

function FAQSection({ faq }: { faq: { q: string; a: string }[] }) {
  if (!faq.length) return null;
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faq.map((item, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-2">{item.q}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function NotFoundSection() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-3">Page not found</h1>
      <p className="text-gray-500 mb-6">This job page doesn&apos;t exist or hasn&apos;t been generated yet.</p>
      <Link href="/jobs" className="text-brand-600 hover:underline">Browse all job types →</Link>
    </div>
  );
}
