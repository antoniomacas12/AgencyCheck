import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import AgencyCard from "@/components/AgencyCard";
import SectionHeader from "@/components/SectionHeader";
import {
  getAgenciesBySector,
  getSectorMeta,
  getSectorBySlug,
  getCitiesForSector,
  getActiveSectors,
  getTransparencyTier,
  type EnrichedAgency,
} from "@/lib/agencyEnriched";
import { CITIES } from "@/lib/seoData";
import { WML_HOURLY_2026 } from "@/lib/dutchTax";
import type { AgencySector } from "@/lib/agencyMeta";

// ─── Static params — one page per active sector ───────────────────────────────
export function generateStaticParams() {
  return getActiveSectors().map((sector) => ({ sector }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { sector: string };
}): Promise<Metadata> {
  const meta = getSectorBySlug(params.sector);
  if (!meta) return { title: "Sector not found" };

  const agencies  = getAgenciesBySector(meta.slug);
  const withHousing = agencies.filter((a) => a.housing === "YES").length;
  const housingStr  = withHousing > 0 ? ` ${withHousing} provide housing.` : "";

  return {
    title:       `${meta.label} Agencies Netherlands — Reviews & Housing — AgencyCheck`,
    description: `${agencies.length} employment ${agencies.length === 1 ? "agency" : "agencies"} in ${meta.label.toLowerCase()} across the Netherlands.${housingStr} Compare salary, housing, and worker reviews.`,
    alternates:  { canonical: `/sectors/${params.sector}` },
    openGraph: {
      title:       `${meta.label} Jobs & Agencies — AgencyCheck`,
      description: `Find ${meta.label.toLowerCase()} temp agencies in the Netherlands. Worker reviews, housing info, and salary data.`,
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function TransparencyBadge({ score }: { score: number }) {
  const tier = getTransparencyTier(score);
  return (
    <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${tier.color} ${tier.bg}`}>
      {score}% data
    </span>
  );
}

function AgencyRow({ agency }: { agency: EnrichedAgency }) {
  return (
    <Link
      href={`/agencies/${agency.slug}`}
      className="card p-3.5 flex items-start gap-3 hover:shadow-md hover:border-brand-100 transition-all hover:-translate-y-0.5"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-bold text-gray-900 truncate">{agency.name}</p>
          <TransparencyBadge score={agency.transparencyScore} />
        </div>
        <p className="text-xs text-gray-500 mt-0.5">📍 {agency.city}</p>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {agency.housing === "YES" && (
            <span className="text-[10px] bg-green-50 text-green-700 border border-green-100 rounded-full px-1.5 py-0.5 font-medium">
              🏠 Housing
            </span>
          )}
          {agency.transport === "YES" && (
            <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-1.5 py-0.5 font-medium">
              🚌 Transport
            </span>
          )}
          {agency.jobTypes && (
            <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-100 rounded-full px-1.5 py-0.5">
              {agency.jobTypes}
            </span>
          )}
        </div>
      </div>
      <span className="text-xs text-brand-600 font-medium shrink-0 mt-0.5">View →</span>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SectorPage({ params }: { params: { sector: string } }) {
  const meta = getSectorBySlug(params.sector);
  if (!meta) notFound();

  const agencies      = getAgenciesBySector(meta.slug as AgencySector);
  const withHousing   = agencies.filter((a) => a.housing === "YES");
  const withTransport = agencies.filter((a) => a.transport === "YES");
  const verified      = agencies.filter((a) => a.transparencyScore >= 50);
  const cities        = getCitiesForSector(meta.slug as AgencySector)
    .filter((c) => CITIES.find((cd) => cd.name === c)); // only known cities

  const topCities = [...cities]
    .map((name) => ({ name, count: agencies.filter((a) => a.supportedCities.includes(name) || a.city === name).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 16);

  const otherSectors = getActiveSectors()
    .filter((s) => s !== meta.slug)
    .slice(0, 8)
    .map((s) => getSectorMeta(s));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* ── Breadcrumb ── */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/agencies" className="hover:text-brand-600">Agencies</Link>
        <span>›</span>
        <span className="text-gray-600">Sectors</span>
        <span>›</span>
        <span className="text-gray-800 font-medium">{meta.label}</span>
      </nav>

      {/* ── Hero ── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{meta.icon}</span>
          <span className="text-xs text-gray-400 border border-gray-200 rounded-full px-2 py-0.5">
            {meta.labelNL}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
          {meta.label} Agencies in the Netherlands
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          {meta.description} Compare worker reviews, housing options, transport, and
          salary data for {meta.label.toLowerCase()} employment agencies across the Netherlands.
        </p>

        {/* Quick stats row */}
        <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <strong>{agencies.length}</strong>&nbsp;agenc{agencies.length === 1 ? "y" : "ies"}
          </span>
          {withHousing.length > 0 && (
            <span className="text-green-700">
              🏠 <strong>{withHousing.length}</strong> with housing
            </span>
          )}
          {withTransport.length > 0 && (
            <span className="text-blue-700">
              🚌 <strong>{withTransport.length}</strong> with transport
            </span>
          )}
          {cities.length > 0 && (
            <span className="text-brand-700">
              📍 <strong>{cities.length}</strong>&nbsp;cit{cities.length === 1 ? "y" : "ies"}
            </span>
          )}
          {verified.length > 0 && (
            <span className="text-gray-500">
              🔍 <strong>{verified.length}</strong> with verified data
            </span>
          )}
        </div>
      </div>

      {/* ── Quick stats grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon: "🏢", value: agencies.length,      label: "Total agencies"    },
          { icon: "🏠", value: withHousing.length,   label: "Provide housing"   },
          { icon: "🚌", value: withTransport.length,  label: "Include transport" },
          { icon: "🔍", value: verified.length,       label: "Data-verified"     },
        ].map((s) => (
          <div key={s.label} className="card p-3 text-center">
            <p className="text-2xl">{s.icon}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Context note ── */}
      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-7 text-sm text-brand-800 leading-relaxed">
        <strong>{meta.icon} {meta.label} work in the Netherlands:</strong>{" "}
        Employment agencies in this sector typically place workers on flexible (uitzend) contracts.
        Always verify your gross hourly rate, housing deduction, and transport arrangement before signing.
        Minimum wage 2026: <strong>€{WML_HOURLY_2026}/hr</strong>.
      </div>

      {/* ── Agencies with housing ── */}
      {withHousing.length > 0 && (
        <section className="mb-8">
          <SectionHeader
            title={`🏠 ${meta.label} Agencies with Housing`}
            subtitle={`${withHousing.length} agenc${withHousing.length === 1 ? "y" : "ies"} confirmed to include accommodation`}
          />
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 mb-4 text-xs text-green-800">
            ℹ️ Housing is typically deducted from salary (€80–€110/week).
            Always get the deduction amount in writing before starting.
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {withHousing.slice(0, 6).map((a) => (
              <AgencyCard key={a.id} agency={a} />
            ))}
          </div>
          {withHousing.length > 6 && (
            <p className="text-xs text-gray-400 text-center mt-3">
              Showing 6 of {withHousing.length}. Browse by city below for more.
            </p>
          )}
        </section>
      )}

      {/* ── All agencies ── */}
      <section className="mb-8">
        <SectionHeader
          title={`All ${meta.label} Agencies`}
          subtitle={`${agencies.length} agenc${agencies.length === 1 ? "y" : "ies"} — sorted by data quality`}
        />

        {agencies.length === 0 ? (
          <div className="card p-8 text-center text-gray-400">
            <p className="text-3xl mb-3">{meta.icon}</p>
            <p className="font-medium">No agencies listed for this sector yet</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-3">
              {agencies.slice(0, 20).map((a) => (
                <AgencyRow key={a.id} agency={a} />
              ))}
            </div>
            {agencies.length > 20 && (
              <p className="text-xs text-gray-400 text-center mt-3">
                Showing 20 of {agencies.length} agencies. Filter by city below.
              </p>
            )}
          </>
        )}
      </section>

      {/* ── Browse by city ── */}
      {topCities.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">
            📍 {meta.label} Jobs by City
          </h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {topCities.map(({ name, count }) => {
              const cityObj = CITIES.find((c) => c.name === name);
              if (!cityObj) return null;
              return (
                <Link
                  key={name}
                  href={`/sectors/${params.sector}/${cityObj.slug}`}
                  className="card px-4 py-3 flex items-center justify-between hover:border-brand-200 hover:bg-brand-50/30 transition-all"
                >
                  <span className="text-sm font-medium text-gray-800">{name}</span>
                  <span className="text-xs text-gray-400">
                    {count} agenc{count === 1 ? "y" : "ies"} →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Worker checklist ── */}
      <section className="mb-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h2 className="font-bold text-amber-900 text-sm mb-2">
            ⚠️ Before signing with any {meta.label.toLowerCase()} agency
          </h2>
          <ul className="text-xs text-amber-800 space-y-1.5 leading-relaxed">
            <li>→ Ask for housing deduction in writing. Standard: <strong>€80–€110/week</strong>.</li>
            <li>→ Confirm transport: is it included or deducted from pay?</li>
            <li>→ Minimum wage 2026: <strong>€{WML_HOURLY_2026}/hr</strong> gross.</li>
            <li>→ Night and Sunday premiums must appear on your payslip.</li>
            <li>→ Get your contract in a language you understand.</li>
            <li>→ Check your payslip monthly. Report problems to FNV.</li>
          </ul>
        </div>
      </section>

      {/* ── Data transparency note ── */}
      <section className="mb-8">
        <div className="card p-4">
          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
            🔍 About this data
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Agencies are classified into sectors based on their listed job types, descriptions,
            and agency names. Transparency scores reflect the availability and quality of
            verified data (housing status, transport, website, contact details, and worker reviews).
            A score of 0–49 means limited public data; 50–79 means partial; 80–100 means well-documented.
          </p>
        </div>
      </section>

      {/* ── Related sectors ── */}
      <section className="mb-8">
        <h3 className="text-sm font-bold text-gray-700 mb-3">🏢 Other sectors</h3>
        <div className="flex flex-wrap gap-2">
          {otherSectors.map((s) => (
            <Link
              key={s.slug}
              href={`/sectors/${s.slug}`}
              className="text-xs text-brand-600 border border-brand-100 rounded-full px-3 py-1 hover:bg-brand-50 transition-colors"
            >
              {s.icon} {s.label}
            </Link>
          ))}
          <Link
            href="/agencies"
            className="text-xs text-gray-500 border border-gray-200 rounded-full px-3 py-1 hover:bg-gray-50"
          >
            All agencies →
          </Link>
        </div>
      </section>

      {/* ── Resources ── */}
      <section>
        <div className="card p-4">
          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">
            🛡️ Worker Rights Resources
          </h3>
          <div className="space-y-2">
            {[
              { label: "FNV — Workers Union Netherlands", href: "https://www.fnv.nl" },
              { label: "SNF — Housing standards for workers", href: "https://www.normenvoorflessenarbeiders.nl" },
              { label: "Inspectie SZW — Workers rights info", href: "https://www.nlarbeidsinspectie.nl" },
              { label: "Inspectie SZW — Report a violation", href: "https://www.inspectieszw.nl/contact" },
            ].map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-brand-600 hover:underline">
                <span className="text-gray-300">→</span> {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
