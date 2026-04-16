import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import AgencyCard from "@/components/AgencyCard";
import SectionHeader from "@/components/SectionHeader";
import {
  getSectorCityAgencies,
  getSectorBySlug,
  getAgenciesBySector,
  getCitiesForSector,
  getTransparencyTier,
} from "@/lib/agencyEnriched";
import { CITIES, JOB_SALARY_DATA } from "@/lib/seoData";
import { WML_HOURLY_2026 } from "@/lib/dutchTax";
import { getActiveSectors } from "@/lib/agencyEnriched";
import type { AgencySector } from "@/lib/agencyMeta";

// ─── Static params ─────────────────────────────────────────────────────────────
// Generate one page per sector × city combination — but ONLY where agencies exist.
// This prevents thin/empty pages from being indexed.
export function generateStaticParams() {
  const params: { sector: string; city: string }[] = [];

  for (const sectorSlug of getActiveSectors()) {
    const cities = getCitiesForSector(sectorSlug);
    for (const cityName of cities) {
      const cityObj = CITIES.find((c) => c.name === cityName);
      if (!cityObj) continue;
      const agencies = getSectorCityAgencies(sectorSlug, cityName);
      // Only generate page if at least 1 agency
      if (agencies.length > 0) {
        params.push({ sector: sectorSlug, city: cityObj.slug });
      }
    }
  }

  return params;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { sector: string; city: string };
}): Promise<Metadata> {
  const meta    = getSectorBySlug(params.sector);
  const cityObj = CITIES.find((c) => c.slug === params.city);
  if (!meta || !cityObj) return { title: "Page not found" };

  const agencies   = getSectorCityAgencies(meta.slug as AgencySector, cityObj.name);
  const withHousing = agencies.filter((a) => a.housing === "YES").length;

  return {
    title: `${meta.label} Agencies in ${cityObj.name} — Reviews & Housing — AgencyCheck`,
    description: `${agencies.length} ${meta.label.toLowerCase()} ${agencies.length === 1 ? "agency" : "agencies"} in ${cityObj.name}.${withHousing > 0 ? ` ${withHousing} provide housing.` : ""} Worker reviews, salary data, and housing info.`,
    alternates: { canonical: `https://agencycheck.io/sectors/${params.sector}/${params.city}` },
    openGraph: {
      title: `${meta.label} Jobs in ${cityObj.name} — AgencyCheck`,
      description: `Compare ${agencies.length} ${meta.label.toLowerCase()} agencies in ${cityObj.name}. Reviews, housing, salary.`,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SectorCityPage({
  params,
}: {
  params: { sector: string; city: string };
}) {
  const meta    = getSectorBySlug(params.sector);
  const cityObj = CITIES.find((c) => c.slug === params.city);
  if (!meta || !cityObj) notFound();

  const agencies      = getSectorCityAgencies(meta.slug as AgencySector, cityObj.name);
  if (agencies.length === 0) notFound();

  const withHousing   = agencies.filter((a) => a.housing === "YES");
  const withTransport = agencies.filter((a) => a.transport === "YES");

  // Other cities in this sector for navigation
  const otherCities = getCitiesForSector(meta.slug as AgencySector)
    .filter((c) => c !== cityObj.name)
    .map((name) => {
      const obj = CITIES.find((c) => c.name === name);
      const count = getSectorCityAgencies(meta.slug as AgencySector, name).length;
      return obj ? { ...obj, count } : null;
    })
    .filter(Boolean)
    .sort((a, b) => (b?.count ?? 0) - (a?.count ?? 0))
    .slice(0, 10);

  // Relevant salary data for this sector
  const sectorJobTypes = Object.entries(JOB_SALARY_DATA)
    .filter(([slug]) =>
      (meta.jobFocusSlugs ?? []).some((jf) => slug === jf || slug.startsWith(jf.split("-")[0]))
    )
    .slice(0, 4);
  const salaryRows = sectorJobTypes.length > 0
    ? sectorJobTypes
    : Object.entries(JOB_SALARY_DATA).slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* ── Breadcrumb ── */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/agencies" className="hover:text-brand-600">Agencies</Link>
        <span>›</span>
        <Link href={`/sectors/${params.sector}`} className="hover:text-brand-600">{meta.label}</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">{cityObj.name}</span>
      </nav>

      {/* ── Hero ── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-400 border border-gray-200 rounded-full px-2 py-0.5">
            {cityObj.region}
          </span>
          {withHousing.length > 0 && (
            <span className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
              🏠 Housing available
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
          {meta.icon} {meta.label} Agencies in {cityObj.name}
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          {agencies.length} {meta.label.toLowerCase()}{" "}
          {agencies.length === 1 ? "agency" : "agencies"} in {cityObj.name}.{" "}
          {withHousing.length > 0 && `${withHousing.length} provide worker accommodation. `}
          Compare salary, housing, and worker reviews before signing any contract.
        </p>

        {/* Quick facts */}
        <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-600">
          <span>🏢 <strong>{agencies.length}</strong> agenc{agencies.length === 1 ? "y" : "ies"}</span>
          {withHousing.length > 0 && (
            <span className="text-green-700">🏠 <strong>{withHousing.length}</strong> with housing</span>
          )}
          {withTransport.length > 0 && (
            <span className="text-blue-700">🚌 <strong>{withTransport.length}</strong> with transport</span>
          )}
        </div>
      </div>

      {/* ── Quick stats ── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: "🏢", value: agencies.length,      label: "Agencies"          },
          { icon: "🏠", value: withHousing.length,   label: "With housing"      },
          { icon: "🚌", value: withTransport.length,  label: "With transport"    },
        ].map((s) => (
          <div key={s.label} className="card p-3 text-center">
            <p className="text-2xl">{s.icon}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Housing agencies ── */}
      {withHousing.length > 0 && (
        <section className="mb-8">
          <SectionHeader
            title={`🏠 ${meta.label} Agencies with Housing in ${cityObj.name}`}
            subtitle={`${withHousing.length} confirmed to include worker accommodation`}
          />
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 mb-4 text-xs text-green-800">
            ℹ️ Housing deduction is typically €80–€110/week. Confirm the exact amount in writing.
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {withHousing.map((a) => <AgencyCard key={a.id} agency={a} />)}
          </div>
        </section>
      )}

      {/* ── All agencies ── */}
      <section className="mb-8">
        <SectionHeader
          title={`All ${meta.label} Agencies in ${cityObj.name}`}
          subtitle={`${agencies.length} ${agencies.length === 1 ? "agency" : "agencies"} — sorted by data quality`}
        />
        <div className="grid sm:grid-cols-2 gap-3">
          {agencies.map((a) => <AgencyCard key={a.id} agency={a} />)}
        </div>
      </section>

      {/* ── Salary snapshot ── */}
      <section className="mb-8">
        <SectionHeader
          title={`Salary Data — ${meta.label} in ${cityObj.name}`}
          subtitle="Typical gross hourly rates for this sector. Verify net pay before signing."
        />
        <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-2.5 mb-4 text-xs text-amber-800">
          ⚠️ <strong>Gross ≠ net.</strong> Tax + healthcare levy will reduce take-home by 25–35%.
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {salaryRows.map(([slug, job]) => {
            const netEst = Math.round(job.avg * 173 * 0.63 - 140);
            return (
              <Link
                key={slug}
                href={`/salary/${slug}-${params.city}`}
                className="card p-4 hover:shadow-md hover:border-brand-100 transition-all flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-bold text-gray-900">{job.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{job.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-extrabold text-brand-700">€{job.avg}/hr</p>
                  <p className="text-xs text-gray-400">≈€{netEst}/mo net</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Worker checklist ── */}
      <section className="mb-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h2 className="font-bold text-amber-900 text-sm mb-2">
            ⚠️ Before signing with any {meta.label.toLowerCase()} agency in {cityObj.name}
          </h2>
          <ul className="text-xs text-amber-800 space-y-1.5 leading-relaxed">
            <li>→ Ask for housing deduction in writing. Standard: <strong>€80–€110/week</strong>.</li>
            <li>→ Confirm who arranges transport and whether it costs you anything.</li>
            <li>→ Minimum wage 2026: <strong>€{WML_HOURLY_2026}/hr</strong> gross.</li>
            <li>→ Get your contract in a language you understand.</li>
            <li>→ Check your payslip every month for night/Sunday premiums.</li>
          </ul>
        </div>
      </section>

      {/* ── Internal links ── */}
      <section className="mb-8">
        <h3 className="text-sm font-bold text-gray-700 mb-3">🔗 Related pages</h3>
        <div className="grid sm:grid-cols-2 gap-2 text-xs">
          <Link href={`/cities/${params.city}`}
            className="flex items-center gap-2 card px-3 py-2.5 hover:border-brand-200 hover:bg-brand-50/30 transition-all">
            <span>📍</span>
            <span className="text-gray-700 font-medium">All agencies in {cityObj.name}</span>
            <span className="text-gray-400 ml-auto">→</span>
          </Link>
          <Link href={`/sectors/${params.sector}`}
            className="flex items-center gap-2 card px-3 py-2.5 hover:border-brand-200 hover:bg-brand-50/30 transition-all">
            <span>{meta.icon}</span>
            <span className="text-gray-700 font-medium">All {meta.label} agencies</span>
            <span className="text-gray-400 ml-auto">→</span>
          </Link>
          {withHousing.length > 0 && (
            <Link href={`/cities/${params.city}/housing`}
              className="flex items-center gap-2 card px-3 py-2.5 hover:border-brand-200 hover:bg-brand-50/30 transition-all">
              <span>🏠</span>
              <span className="text-gray-700 font-medium">All housing agencies in {cityObj.name}</span>
              <span className="text-gray-400 ml-auto">→</span>
            </Link>
          )}
          <Link href="/tools/real-income-calculator"
            className="flex items-center gap-2 card px-3 py-2.5 hover:border-brand-200 hover:bg-brand-50/30 transition-all">
            <span>🧮</span>
            <span className="text-gray-700 font-medium">Real income calculator</span>
            <span className="text-gray-400 ml-auto">→</span>
          </Link>
        </div>
      </section>

      {/* ── Other cities in this sector ── */}
      {otherCities.length > 0 && (
        <section className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            📍 {meta.label} agencies in other cities
          </h3>
          <div className="flex flex-wrap gap-2">
            {otherCities.map((c) => c && (
              <Link
                key={c.slug}
                href={`/sectors/${params.sector}/${c.slug}`}
                className="text-xs text-brand-600 border border-brand-100 rounded-full px-3 py-1 hover:bg-brand-50 transition-colors"
              >
                {c.name} ({c.count})
              </Link>
            ))}
            <Link
              href={`/sectors/${params.sector}`}
              className="text-xs text-gray-500 border border-gray-200 rounded-full px-3 py-1 hover:bg-gray-50"
            >
              All cities →
            </Link>
          </div>
        </section>
      )}

    </div>
  );
}
