import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import AgencyCard from "@/components/AgencyCard";
import SectionHeader from "@/components/SectionHeader";
import { CITIES, TOP_CITIES, JOB_SALARY_DATA } from "@/lib/seoData";
import { WML_HOURLY_2026 } from "@/lib/dutchTax";
import {
  getCityAgencies,
  getCityHousingAgencies,
  getCityMaybeHousingAgencies,
  cityHasJobs,
  getCityJobs,
  getCityJobsWithHousing,
  getCityCharacter,
} from "@/lib/cityUtils";
import type { JobListing } from "@/lib/jobData";

// ─── Static params: only cities that have agencies ────────────────────────────
export function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const city    = CITIES.find((c) => c.slug === params.city);
  if (!city) return { title: "City not found" };

  const housing       = getCityHousingAgencies(city.name);
  const allAgencies   = getCityAgencies(city.name);
  const jobsWithHousing = getCityJobsWithHousing(city.name);

  const jobStr  = jobsWithHousing.length > 0 ? ` ${jobsWithHousing.length} active jobs include accommodation.` : "";

  return {
    title: `Jobs with Housing in ${city.name} — Agency Accommodation — AgencyCheck`,
    description: `Find agency jobs in ${city.name} that include housing. ${housing.length} out of ${allAgencies.length} agencies confirmed to provide accommodation for workers.${jobStr} Compare conditions, salary, and reviews.`,
    alternates: { canonical: `/cities/${params.city}/housing` },
    openGraph: {
      title: `Agency Jobs with Housing in ${city.name} — AgencyCheck`,
      description: `${housing.length} agenc${housing.length === 1 ? "y" : "ies"} in ${city.name} include worker accommodation. Compare conditions, salary, and transport.`,
    },
  };
}

// ─── Inline job row ───────────────────────────────────────────────────────────
function JobRow({ job }: { job: JobListing }) {
  return (
    <Link href={`/jobs/${job.slug}`}
      className="card p-3.5 hover:shadow-md hover:border-brand-100 transition-all flex items-start gap-3">
      <span className="text-2xl shrink-0">{job.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-bold text-gray-900 leading-tight">{job.title}</p>
          <span className="text-xs font-bold text-brand-700 shrink-0">
            €{job.salaryMin.toFixed(2)}–€{job.salaryMax.toFixed(2)}/hr
          </span>
        </div>
        <p className="text-xs text-brand-600 hover:underline mt-0.5">{job.agencyName}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-[10px] bg-green-50 text-green-700 border border-green-100 rounded-full px-1.5 py-0.5 font-medium">
            🏠 Housing incl. (deducted from salary)
          </span>
          {job.transport === "YES" && (
            <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-1.5 py-0.5 font-medium">
              🚌 Transport included
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CityHousingPage({ params }: { params: { city: string } }) {
  const city = CITIES.find((c) => c.slug === params.city);
  if (!city) notFound();

  const char          = getCityCharacter(city.name);
  const allAgencies   = getCityAgencies(city.name);
  const confirmed     = getCityHousingAgencies(city.name);
  const maybeHousing  = getCityMaybeHousingAgencies(city.name);
  const hasJobs       = cityHasJobs(city.name);
  const jobs          = hasJobs ? getCityJobs(city.name) : [];
  const jobsWithHousing = jobs.filter((j) => j.housing === "YES");

  // If no agencies at all, 404
  if (allAgencies.length === 0) notFound();

  const otherCities   = TOP_CITIES.filter((c) => c.slug !== params.city).slice(0, 8);
  const salarySlugs   = Object.keys(JOB_SALARY_DATA).slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* ── Breadcrumb ── */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/agencies" className="hover:text-brand-600">Agencies</Link>
        <span>›</span>
        <Link href={`/cities/${params.city}`} className="hover:text-brand-600">{city.name}</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Jobs with housing</span>
      </nav>

      {/* ── Hero ── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-400 border border-gray-200 rounded-full px-2 py-0.5">
            {city.region}
          </span>
          <span className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
            🏠 Housing incl. (deducted from salary)
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
          Jobs with Housing in {city.name}
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          {confirmed.length > 0
            ? `${confirmed.length} agenc${confirmed.length === 1 ? "y" : "ies"} in ${city.name} confirmed to include accommodation for workers. This means your housing is arranged as part of the work arrangement.`
            : `No agencies in ${city.name} have confirmed housing yet. Check back, or contact agencies directly — some may provide housing without listing it publicly.`
          }
          {char.housingNote && ` ${char.housingNote}`}
        </p>

        <div className="flex flex-wrap gap-3 mt-4 text-xs">
          <span className="text-gray-600">
            <strong>{confirmed.length}</strong> with housing confirmed
          </span>
          <span className="text-gray-600">
            <strong>{allAgencies.length}</strong> total agencies in {city.name}
          </span>
          {jobsWithHousing.length > 0 && (
            <span className="text-green-700">
              <strong>{jobsWithHousing.length}</strong> active jobs include housing
            </span>
          )}
          {maybeHousing.length > 0 && (
            <span className="text-amber-700">
              <strong>{maybeHousing.length}</strong> housing status unknown
            </span>
          )}
        </div>
      </div>

      {/* ── Housing explained ── */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-7 text-sm leading-relaxed">
        <h2 className="font-bold text-green-900 mb-2">🏠 How agency housing works</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-xs text-green-800">
          <div>
            <p className="font-semibold mb-1">What is included:</p>
            <ul className="space-y-0.5">
              <li>→ A room in a shared house near the workplace</li>
              <li>→ Basic amenities: kitchen, bathroom, WiFi</li>
              <li>→ Usually transport to/from the workplace</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">What to confirm before signing:</p>
            <ul className="space-y-0.5">
              <li>→ Weekly deduction from salary (standard: €80–€110)</li>
              <li>→ Number of people sharing the room</li>
              <li>→ Notice period to leave the housing</li>
              <li>→ What happens to housing if you stop working</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
        {[
          { icon: "🏠", value: confirmed.length,       label: "Housing confirmed" },
          { icon: "❓", value: maybeHousing.length,    label: "Housing unknown"   },
          { icon: "💼", value: jobsWithHousing.length, label: "Jobs with housing" },
          { icon: "🏢", value: allAgencies.length,     label: "Total agencies"    },
        ].map((s) => (
          <div key={s.label} className="card p-3 text-center">
            <p className="text-2xl">{s.icon}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Jobs with housing ── */}
      {jobsWithHousing.length > 0 && (
        <section className="mb-8">
          <SectionHeader
            title={`Active Jobs with Housing in ${city.name}`}
            subtitle={`${jobsWithHousing.length} job listing${jobsWithHousing.length !== 1 ? "s" : ""} where accommodation is included`}
          />
          <div className="grid sm:grid-cols-2 gap-3">
            {jobsWithHousing.slice(0, 8).map((job) => (
              <JobRow key={job.id} job={job} />
            ))}
          </div>
        </section>
      )}

      {/* ── Confirmed housing agencies ── */}
      {confirmed.length > 0 && (
        <section className="mb-8">
          <SectionHeader
            title={`Agencies Confirmed to Provide Housing`}
            subtitle={`${confirmed.length} agenc${confirmed.length === 1 ? "y" : "ies"} in ${city.name} with verified accommodation`}
          />
          <div className="grid sm:grid-cols-2 gap-3">
            {confirmed.map((a) => <AgencyCard key={a.id} agency={a} />)}
          </div>
        </section>
      )}

      {/* ── Maybe housing agencies ── */}
      {maybeHousing.length > 0 && (
        <section className="mb-8">
          <SectionHeader
            title="Ask These Agencies About Housing"
            subtitle="Housing status not confirmed — contact them directly to find out"
          />
          <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-2.5 mb-3 text-xs text-amber-800">
            ℹ️ These agencies haven't publicly confirmed whether they provide housing.
            Call or email them before visiting to ask about accommodation availability.
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {maybeHousing.slice(0, 6).map((a) => <AgencyCard key={a.id} agency={a} />)}
          </div>
        </section>
      )}

      {/* ── No housing found state ── */}
      {confirmed.length === 0 && maybeHousing.length === 0 && (
        <section className="mb-8">
          <div className="card p-8 text-center text-gray-400">
            <p className="text-3xl mb-3">🏚️</p>
            <p className="font-medium text-gray-600">No housing agencies confirmed in {city.name} yet</p>
            <p className="text-xs mt-2 max-w-xs mx-auto">
              Check the main city page or browse all agencies with housing across the Netherlands.
            </p>
            <div className="flex gap-3 justify-center mt-4">
              <Link href={`/cities/${params.city}`}
                className="text-xs text-brand-600 hover:underline">← Back to {city.name}</Link>
              <Link href="/agencies-with-housing"
                className="text-xs text-brand-600 hover:underline">All housing agencies →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Salary context ── */}
      <section className="mb-8">
        <SectionHeader
          title={`Salary Expectations in ${city.name}`}
          subtitle="Typical rates for agency work. Remember: housing deduction reduces your spendable income."
        />
        <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-2.5 mb-4 text-xs text-amber-800">
          ⚠️ If your agency deducts €95/week for housing, that is <strong>€410/month</strong> less in your pocket.
          Factor this into your budget before accepting.
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {salarySlugs.map((slug) => {
            const job = JOB_SALARY_DATA[slug];
            if (!job) return null;
            const netEst = Math.round(job.avg * 173 * 0.63 - 140);
            const netWithHousing = netEst - 410;
            return (
              <Link key={slug} href={`/salary/${slug}-${params.city}`}
                className="card p-4 hover:shadow-md hover:border-brand-100 transition-all">
                <p className="text-sm font-bold text-gray-900">{job.label ?? slug.replace(/-/g, " ")}</p>
                <p className="text-xs text-gray-400 mt-0.5">{job.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <p className="text-base font-extrabold text-brand-700">€{job.avg}/hr gross</p>
                    <p className="text-xs text-gray-400">≈€{netEst}/mo net</p>
                  </div>
                  <div className="text-right text-xs text-gray-400 border-l border-gray-100 pl-3 ml-3">
                    <p className="font-medium text-amber-700">−€410 housing</p>
                    <p>≈€{netWithHousing}/mo spendable</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="text-center mt-3">
          <Link href="/tools/real-income-calculator"
            className="text-xs text-brand-600 hover:underline">
            Calculate my real spendable income with housing deduction →
          </Link>
        </div>
      </section>

      {/* ── Housing checklist ── */}
      <section className="mb-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h2 className="font-bold text-amber-900 text-sm mb-2">
            📋 Housing checklist — what to ask before signing
          </h2>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-amber-800">
            <div className="space-y-1.5">
              <p className="font-semibold text-amber-900">About the room:</p>
              <p>→ How many people share this room?</p>
              <p>→ Is there a private space for my belongings?</p>
              <p>→ Are bed linen and cooking equipment provided?</p>
              <p>→ Is the address SNF-certified?</p>
            </div>
            <div className="space-y-1.5">
              <p className="font-semibold text-amber-900">About the deduction:</p>
              <p>→ Exact weekly amount in writing: €<span className="font-semibold">____</span>/week</p>
              <p>→ Is the deduction stopped if I have no shifts?</p>
              <p>→ What is the notice period to leave?</p>
              <p>→ What happens to housing if I leave the agency?</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Internal links ── */}
      <section className="mb-8">
        <h3 className="text-sm font-bold text-gray-700 mb-3">🔗 Related pages</h3>
        <div className="grid sm:grid-cols-2 gap-2 text-xs">
          <Link href={`/cities/${params.city}`}
            className="flex items-center gap-2 card px-3 py-2.5 hover:border-brand-200 hover:bg-brand-50/30 transition-all">
            <span>📍</span>
            <span className="text-gray-700 font-medium">All agencies in {city.name}</span>
            <span className="text-gray-400 ml-auto">→</span>
          </Link>
          <Link href="/agencies-with-housing"
            className="flex items-center gap-2 card px-3 py-2.5 hover:border-brand-200 hover:bg-brand-50/30 transition-all">
            <span>🏠</span>
            <span className="text-gray-700 font-medium">All housing agencies — Netherlands</span>
            <span className="text-gray-400 ml-auto">→</span>
          </Link>
          <Link href={`/salary/order-picker-${params.city}`}
            className="flex items-center gap-2 card px-3 py-2.5 hover:border-brand-200 hover:bg-brand-50/30 transition-all">
            <span>💶</span>
            <span className="text-gray-700 font-medium">Order picker salary in {city.name}</span>
            <span className="text-gray-400 ml-auto">→</span>
          </Link>
          <Link href="/tools/real-income-calculator"
            className="flex items-center gap-2 card px-3 py-2.5 hover:border-brand-200 hover:bg-brand-50/30 transition-all">
            <span>🧮</span>
            <span className="text-gray-700 font-medium">Real income calculator (incl. housing)</span>
            <span className="text-gray-400 ml-auto">→</span>
          </Link>
          <Link href="/issues/bad-housing"
            className="flex items-center gap-2 card px-3 py-2.5 hover:border-brand-200 hover:bg-brand-50/30 transition-all">
            <span>⚠️</span>
            <span className="text-gray-700 font-medium">Housing complaints guide</span>
            <span className="text-gray-400 ml-auto">→</span>
          </Link>
          <Link href="https://www.normeringflexwonen.nl" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 card px-3 py-2.5 hover:border-brand-200 hover:bg-brand-50/30 transition-all">
            <span>🛡️</span>
            <span className="text-gray-700 font-medium">SNF housing standard — verify your house</span>
            <span className="text-gray-400 ml-auto">↗</span>
          </Link>
        </div>
      </section>

      {/* ── Other cities ── */}
      <section>
        <h3 className="text-sm font-bold text-gray-700 mb-3">🗺️ Housing in other cities</h3>
        <div className="flex flex-wrap gap-2">
          {otherCities.map((c) => (
            <Link key={c.slug} href={`/cities/${c.slug}/housing`}
              className="text-xs text-brand-600 border border-brand-100 rounded-full px-3 py-1 hover:bg-brand-50 transition-colors">
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-8 text-xs text-gray-400 text-center">
        Housing data is sourced from the official ABU register and worker reports.
        Always confirm conditions directly with the agency.
      </p>
    </div>
  );
}
