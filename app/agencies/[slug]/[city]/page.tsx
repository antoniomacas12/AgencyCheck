import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ALL_AGENCIES,
  ALL_AGENCY_MAP,
  getTransparencyTier,
  type EnrichedAgency,
} from "@/lib/agencyEnriched";
import {
  filterEligibleAgencyCityPairs,
  canGenerateAgencyCityPage,
  getRobotsDirective,
  filterEligibleComparisons,
} from "@/lib/pageEligibility";
import { SECTOR_META } from "@/lib/agencyMeta";
import { CITIES } from "@/lib/seoData";
import {
  getDbAgency,
  getAgencyCommentsByCity,
  getAgencyCityMentions,
  type DbAgencyCityComment,
  type DbCityMention,
} from "@/lib/agencyDb";
import { fromCitySlug, toDisplayCity, toCitySlug } from "@/lib/cityNormalization";

// ─── Dynamic rendering — verified agencies are statically pre-rendered,
//     DB-only agencies are rendered on demand.
export const dynamic = "force-dynamic";

// ─── Static params: all eligible agency+city pairs ───────────────────────────

export function generateStaticParams() {
  return filterEligibleAgencyCityPairs(ALL_AGENCIES).map(({ agency, city }) => ({
    slug: agency.slug,
    city: city.toLowerCase().replace(/\s+/g, "-"),
  }));
}

// ─── City name normalisation helpers ─────────────────────────────────────────

/** Convert a URL city slug ("amsterdam", "den-haag") to a display name */
function citySlugToName(slug: string): string {
  // Try CITIES lookup first
  const found = CITIES.find((c) => c.slug === slug);
  if (found) return found.name.charAt(0).toUpperCase() + found.name.slice(1).toLowerCase();
  // Fallback: capitalise each word
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Normalise a city name for matching */
function normCity(city: string): string {
  return city.toLowerCase().trim().replace(/\s+/g, " ");
}

/** Convert city slug to the normalised form used in supportedCities */
function slugToNormCity(slug: string): string {
  return slug.replace(/-/g, " ").toLowerCase();
}

/** Check if agency explicitly covers a city */
function agencyCoversCitySlug(agency: EnrichedAgency, citySlug: string): boolean {
  const targetNorm = slugToNormCity(citySlug);
  if (agency.supportedCities.some((c) => normCity(c) === targetNorm)) return true;
  if (normCity(agency.city) === targetNorm) return true;
  return false;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string; city: string };
}): Promise<Metadata> {
  const cityNorm = fromCitySlug(params.city);
  const cityName = citySlugToName(params.city);

  // Verified agency
  const agency = ALL_AGENCY_MAP[params.slug];
  if (agency) {
    const decision   = canGenerateAgencyCityPage(agency, slugToNormCity(params.city));
    const robotsMeta = getRobotsDirective(decision);
    const sectorLabel = SECTOR_META[agency.sector]?.label ?? agency.sector;
    const housingNote = agency.accommodation === "confirmed_with_deduction" || agency.accommodation === "confirmed_no_deduction"
      ? " Worker housing available."
      : "";
    return {
      title: `${agency.name} ${cityName} Reviews – Jobs, Housing & Worker Experiences`,
      description: `${agency.name} is a ${sectorLabel} staffing agency in ${cityName}.${housingNote} Transparency score: ${agency.transparencyScore}/100. Real worker experiences, housing details, and pay information.`,
      alternates: { canonical: `/agencies/${params.slug}/${params.city}` },
      robots: robotsMeta,
    };
  }

  // DB-only agency
  const dbAgency = await getDbAgency(params.slug);
  if (!dbAgency) return { title: "Agency not found — AgencyCheck" };

  const cityMentions = await getAgencyCityMentions(dbAgency.id);
  const hasCityData  = cityMentions.some((m) => m.cityNormalized === cityNorm);
  if (!hasCityData)  return { title: "Page not found — AgencyCheck" };

  return {
    title: `${dbAgency.name} ${cityName} Reviews – Worker Experiences Netherlands`,
    description: `Read what workers say about ${dbAgency.name} in ${cityName}. Real worker-submitted comments and reviews from the Netherlands. Based on worker-submitted data on AgencyCheck.`,
    alternates: { canonical: `/agencies/${params.slug}/${params.city}` },
    openGraph: {
      title: `${dbAgency.name} ${cityName} – Worker Reviews`,
      description: `Worker experiences with ${dbAgency.name} in ${cityName}, Netherlands.`,
    },
  };
}

// ─── Accommodation display ─────────────────────────────────────────────────────

function AccommodationBlock({ acc }: { acc: EnrichedAgency["accommodation"] }) {
  const config: Record<EnrichedAgency["accommodation"], { label: string; sub: string; color: string; bg: string }> = {
    confirmed_with_deduction: {
      label:  "Housing available",
      sub:    "Deduction typically €80–115/week from your salary",
      color:  "text-amber-700",
      bg:     "bg-amber-50",
    },
    confirmed_no_deduction: {
      label:  "Housing available — free",
      sub:    "No deduction from salary reported",
      color:  "text-green-700",
      bg:     "bg-green-50",
    },
    not_provided: {
      label:  "Housing not provided",
      sub:    "You will need to arrange your own accommodation",
      color:  "text-gray-600",
      bg:     "bg-gray-50",
    },
    unverified_claim: {
      label:  "Housing — agency claim (unverified)",
      sub:    "Verify directly with the agency before signing",
      color:  "text-gray-500",
      bg:     "bg-gray-50",
    },
    unknown: {
      label:  "Housing status unknown",
      sub:    "Ask the agency directly about housing",
      color:  "text-gray-400",
      bg:     "bg-gray-50",
    },
  };

  const { label, sub, color, bg } = config[acc] ?? config.unknown;
  return (
    <div className={`rounded-xl px-4 py-3 border ${bg} border-gray-100`}>
      <p className={`text-sm font-semibold ${color}`}>🏠 {label}</p>
      <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
    </div>
  );
}

// ─── Agency mini-card ──────────────────────────────────────────────────────────

function AgencyMiniCard({ agency }: { agency: EnrichedAgency }) {
  const tier = getTransparencyTier(agency.transparencyScore);
  return (
    <Link
      href={`/agencies/${agency.slug}`}
      className="block bg-white border border-gray-100 rounded-xl p-3 hover:border-brand-200 hover:bg-brand-50/30 transition-colors group"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-gray-800 group-hover:text-brand-700 leading-snug truncate">
          {agency.name}
        </p>
        <span
          className={`text-xs font-bold px-1.5 py-0.5 rounded-md shrink-0 ${tier.bg} ${tier.color}`}
        >
          {agency.transparencyScore}
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {SECTOR_META[agency.sector]?.icon ?? "🏢"}{" "}
        {SECTOR_META[agency.sector]?.label ?? agency.sector}
      </p>
      {(agency.accommodation === "confirmed_with_deduction" ||
        agency.accommodation === "confirmed_no_deduction") && (
        <p className="text-xs text-green-700 mt-0.5">🏠 Housing available</p>
      )}
    </Link>
  );
}

// ─── Worker comment bubble ────────────────────────────────────────────────────

function WorkerCommentBubble({ c }: { c: DbAgencyCityComment }) {
  const diff = Date.now() - new Date(c.createdAt).getTime();
  const days = Math.floor(diff / 86_400_000);
  const timeStr = days === 0 ? "today" : days === 1 ? "yesterday" : `${days}d ago`;

  return (
    <div className="flex gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="shrink-0 w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-sm mt-0.5">
        👷
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1">
          <span className="text-xs font-semibold text-gray-800">{c.agencyName}</span>
          <span className="text-[11px] text-gray-400">·</span>
          <span className="text-[11px] text-gray-500">📍 {c.city}</span>
          <span className="text-[11px] text-gray-400">·</span>
          <span className="text-[11px] text-gray-400">{timeStr}</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed break-words whitespace-pre-line">
          {c.body}
        </p>
      </div>
    </div>
  );
}

// ─── DB-only agency city page ─────────────────────────────────────────────────

async function DbAgencyCityPage({
  agencySlug,
  citySlug,
}: {
  agencySlug: string;
  citySlug:   string;
}) {
  const cityNorm  = fromCitySlug(citySlug);
  const cityName  = toDisplayCity(cityNorm);
  const dbAgency  = await getDbAgency(agencySlug);
  if (!dbAgency) return notFound();

  // Check threshold: at least 1 city mention for this city
  const cityMentions  = await getAgencyCityMentions(dbAgency.id);
  const thisCityMention = cityMentions.find((m) => m.cityNormalized === cityNorm);
  if (!thisCityMention) return notFound();

  // Fetch comments for this agency+city
  const cityComments = await getAgencyCommentsByCity(dbAgency.id, cityNorm);

  // Other cities this agency is mentioned in
  const otherCities: DbCityMention[] = cityMentions.filter(
    (m) => m.cityNormalized !== cityNorm,
  ).slice(0, 8);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 pb-24">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link href="/agencies" className="hover:text-brand-600">Agencies</Link>
        <span>/</span>
        <Link href={`/agencies/${dbAgency.slug}`} className="hover:text-brand-600">
          {dbAgency.name}
        </Link>
        <span>/</span>
        <span className="text-gray-600">{cityName}</span>
      </nav>

      {/* Header */}
      <header className="mb-6">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold
          bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full mb-2">
          Unverified — reported by workers
        </div>
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          {dbAgency.name} in {cityName} — Worker Experiences
          <span className="block text-sm font-normal text-gray-400 mt-0.5">
            Netherlands · Based on worker-submitted data
          </span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">📍 {cityName}, Netherlands</p>
      </header>

      {/* Worker comments */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-4">
          What workers say about {dbAgency.name} in {cityName}
        </h2>

        {cityComments.length > 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-50">
            {cityComments.map((c) => (
              <div key={c.id} className="px-4">
                <WorkerCommentBubble c={c} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl px-5 py-8 text-center">
            <p className="text-2xl mb-2">💬</p>
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Workers mention {dbAgency.name} in {cityName}
            </p>
            <p className="text-xs text-gray-500">
              No detailed comments yet for this city.
              Be the first to share your experience.
            </p>
          </div>
        )}

        <p className="text-[11px] text-gray-400 mt-3 italic">
          Based on worker-submitted comments on AgencyCheck. More experiences may be added over time.
        </p>
      </section>

      {/* Other cities this agency is mentioned in */}
      {otherCities.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold text-gray-800 mb-2">
            Other cities workers mention for {dbAgency.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {otherCities.map((cm) => (
              <Link
                key={cm.cityNormalized}
                href={`/agencies/${dbAgency.slug}/${toCitySlug(cm.cityNormalized)}`}
                className="inline-flex items-center gap-1 text-xs bg-blue-50 border border-blue-100
                  text-blue-800 px-3 py-1 rounded-full hover:bg-blue-100 hover:border-blue-200 transition-colors"
              >
                📍 {cm.cityDisplay}
                {cm.mentionCount > 1 && (
                  <span className="text-blue-400">·{cm.mentionCount}</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="bg-brand-50 border border-brand-100 rounded-xl p-5 text-center mb-6">
        <p className="text-sm font-bold text-brand-800 mb-1">
          Worked with {dbAgency.name} in {cityName}?
        </p>
        <p className="text-xs text-brand-600 mb-3">
          Share your experience to help other workers make informed decisions.
        </p>
        <Link
          href={`/share-experience?agency=${encodeURIComponent(dbAgency.name)}&city=${encodeURIComponent(cityName)}`}
          className="inline-block bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold
            px-5 py-2.5 rounded-xl transition-colors"
        >
          Submit your experience →
        </Link>
      </div>

      {/* Footer nav */}
      <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
        <Link
          href={`/agencies/${dbAgency.slug}`}
          className="text-sm font-semibold text-brand-600 hover:text-brand-800"
        >
          ← Full {dbAgency.name} profile
        </Link>
        <Link href={`/cities/${toCitySlug(cityNorm)}`} className="text-sm text-gray-400 hover:text-brand-600">
          All agencies in {cityName} →
        </Link>
      </div>
    </main>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AgencyCityPage({
  params,
}: {
  params: { slug: string; city: string };
}) {
  // If not a verified agency, hand off to DB-only handler
  const agency = ALL_AGENCY_MAP[params.slug];
  if (!agency) return <DbAgencyCityPage agencySlug={params.slug} citySlug={params.city} />;

  const cityNorm = slugToNormCity(params.city);
  const decision = canGenerateAgencyCityPage(agency, cityNorm);
  if (!decision.allowed) return notFound();

  // Fetch worker comments for this agency+city from DB.
  // EnrichedAgency doesn't carry agencyId — look it up via DB slug.
  const dbRecord = await getDbAgency(agency.slug).catch(() => null);
  const dbCityComments: DbAgencyCityComment[] = dbRecord
    ? await getAgencyCommentsByCity(dbRecord.id, cityNorm).catch(() => [])
    : [];

  const cityName    = citySlugToName(params.city);
  const sectorMeta  = SECTOR_META[agency.sector];
  const tier        = getTransparencyTier(agency.transparencyScore);

  // Other agencies in the same city (excluding current)
  const otherCityAgencies = ALL_AGENCIES.filter(
    (a) => a.slug !== agency.slug && agencyCoversCitySlug(a, params.city),
  ).sort((a, b) => b.transparencyScore - a.transparencyScore).slice(0, 6);

  // Eligible comparisons involving this agency (for linking)
  const comparisons = filterEligibleComparisons(ALL_AGENCIES, true)
    .filter(({ a, b }) => a.slug === agency.slug || b.slug === agency.slug)
    .sort((x, y) => y.overlap.overlapScore - x.overlap.overlapScore)
    .slice(0, 3)
    .map(({ a, b }) => ({
      other: a.slug === agency.slug ? b : a,
      pair:  `${a.slug}-vs-${b.slug}`,
    }));

  const hasHousing =
    agency.accommodation === "confirmed_with_deduction" ||
    agency.accommodation === "confirmed_no_deduction";

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <nav
        className="text-xs text-gray-400 mb-5 flex items-center gap-1.5 flex-wrap"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link href="/agencies" className="hover:text-brand-600">Agencies</Link>
        <span>/</span>
        <Link href={`/agencies/${agency.slug}`} className="hover:text-brand-600">
          {agency.name}
        </Link>
        <span>/</span>
        <span className="text-gray-600">{cityName}</span>
      </nav>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="mb-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              {agency.name} {cityName} Netherlands Review
              <span className="block text-sm font-normal text-gray-400 mt-0.5">
                Jobs · Housing · Worker Experiences
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {sectorMeta?.icon ?? "🏢"} {sectorMeta?.label ?? agency.sector} staffing agency
              {" · "}
              <Link href={`/cities/${params.city}`} className="hover:text-brand-600 underline">
                {cityName}
              </Link>
            </p>
          </div>
          <div
            className={`flex-shrink-0 text-center px-3 py-1.5 rounded-xl ${tier.bg} ${tier.color}`}
          >
            <p className="text-2xl font-bold leading-none">{agency.transparencyScore}</p>
            <p className="text-[10px] font-medium mt-0.5">/ 100</p>
          </div>
        </div>

        {/* Confidence badge */}
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            agency.confidenceLevel === "high"
              ? "bg-green-50 text-green-700"
              : agency.confidenceLevel === "medium"
              ? "bg-amber-50 text-amber-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {agency.confidenceLevel === "high"
            ? "High confidence data"
            : agency.confidenceLevel === "medium"
            ? "Medium confidence data"
            : "Limited data available"}
        </span>
      </header>

      {/* ── Description ────────────────────────────────────────────────────── */}
      {agency.description && (
        <section className="mb-6">
          <p className="text-sm text-gray-600 leading-relaxed">{agency.description}</p>
          <p className="text-sm text-gray-600 mt-2">
            This agency operates in <strong>{cityName}</strong>
            {agency.supportedCities.length > 1
              ? ` and ${agency.supportedCities.length - 1} other ${
                  agency.supportedCities.length - 1 === 1 ? "city" : "cities"
                } across the Netherlands`
              : ""}
            .
          </p>
        </section>
      )}

      {/* ── Accommodation ──────────────────────────────────────────────────── */}
      <section className="mb-6">
        <h2 className="text-sm font-bold text-gray-700 mb-2">Worker housing</h2>
        <AccommodationBlock acc={agency.accommodation} />
        {hasHousing && (
          <p className="text-xs text-gray-400 mt-2">
            Housing may be available in {cityName}.{" "}
            <Link href="/tools/accommodation-costs" className="text-brand-600 underline">
              Calculate your accommodation costs →
            </Link>
          </p>
        )}
      </section>

      {/* ── Trust & Transparency ───────────────────────────────────────────── */}
      <section className="mb-6">
        <h2 className="text-sm font-bold text-gray-700 mb-2">Trust &amp; transparency</h2>
        <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">

          {/* Score explanation */}
          <div className="flex items-start gap-3">
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${tier.bg} ${tier.color}`}
            >
              {agency.transparencyScore}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{tier.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {agency.transparencyScore >= 70
                  ? `${agency.name} has a strong transparency profile: verified housing status, public contact details, and an official website.`
                  : agency.transparencyScore >= 40
                  ? `${agency.name} has partial data available. Some details — like housing or transport — could not be fully verified.`
                  : `Limited data was found for ${agency.name}. Verify key conditions directly before signing any contract.`}
              </p>
            </div>
          </div>

          {/* What the score covers */}
          <div className="border-t border-gray-50 pt-3">
            <p className="text-xs font-semibold text-gray-500 mb-2">
              Transparency score covers:
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {[
                { label: "Housing confirmed",   met: agency.accommodation !== "unknown" && agency.accommodation !== "not_provided" },
                { label: "Website available",   met: Boolean(agency.website) },
                { label: "Contact details",     met: Boolean(agency.phone || agency.email) },
                { label: "Description on file", met: Boolean(agency.description) },
              ].map(({ label, met }) => (
                <p key={label} className="text-xs text-gray-500 flex items-center gap-1">
                  <span className={met ? "text-green-500" : "text-gray-300"}>
                    {met ? "✓" : "○"}
                  </span>
                  {label}
                </p>
              ))}
            </div>
          </div>

          {/* Data quality caveat if low confidence */}
          {(agency.confidenceLevel === "low" || agency.confidenceLevel === "very_low") && (
            <div className="border-t border-gray-50 pt-3">
              <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                ⚠️ This profile is based on limited publicly available information. Always
                confirm housing terms, pay rates, and contract conditions directly with the
                agency before accepting a placement.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Agency details ─────────────────────────────────────────────────── */}
      <section className="bg-white border border-gray-100 rounded-xl p-4 mb-6">
        <h2 className="text-sm font-bold text-gray-700 mb-3">Agency details</h2>
        <div className="space-y-2.5">
          {/* Job focus — links to /jobs/[slug] category pages */}
          {agency.jobFocus.length > 0 && (
            <div className="flex items-start gap-2">
              <p className="text-xs text-gray-400 w-24 shrink-0 pt-0.5">Job types</p>
              <div className="flex flex-wrap gap-1.5">
                {agency.jobFocus.map((j) => (
                  <Link
                    key={j}
                    href={`/jobs/${j}`}
                    className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium hover:bg-brand-100 transition-colors"
                  >
                    {j.replace(/-/g, " ")}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {/* All cities */}
          {agency.supportedCities.length > 0 && (
            <div className="flex items-start gap-2">
              <p className="text-xs text-gray-400 w-24 shrink-0 pt-0.5">Cities</p>
              <p className="text-xs text-gray-600">
                {agency.supportedCities
                  .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
                  .join(", ")}
              </p>
            </div>
          )}
          {/* Website */}
          {agency.website && (
            <div className="flex items-start gap-2">
              <p className="text-xs text-gray-400 w-24 shrink-0 pt-0.5">Website</p>
              <a
                href={agency.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand-600 underline hover:text-brand-800 break-all"
              >
                {agency.website.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
            </div>
          )}
          {/* Contact */}
          {(agency.phone || agency.email) && (
            <div className="flex items-start gap-2">
              <p className="text-xs text-gray-400 w-24 shrink-0 pt-0.5">Contact</p>
              <div className="flex flex-col gap-0.5">
                {agency.phone && (
                  <a href={`tel:${agency.phone}`} className="text-xs text-gray-600 hover:text-brand-600">
                    {agency.phone}
                  </a>
                )}
                {agency.email && (
                  <a href={`mailto:${agency.email}`} className="text-xs text-gray-600 hover:text-brand-600 break-all">
                    {agency.email}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Worker tools CTA ──────────────────────────────────────────────── */}
      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-6">
        <p className="text-sm font-semibold text-brand-800 mb-2">
          💶 Calculate your real income before you sign
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/tools/salary-calculator"
            className="text-xs bg-white border border-brand-200 text-brand-700 rounded-lg px-3 py-1.5 hover:bg-brand-100 transition-colors"
          >
            Weekly salary calculator →
          </Link>
          <Link
            href="/tools/payslip-checker"
            className="text-xs bg-white border border-brand-200 text-brand-700 rounded-lg px-3 py-1.5 hover:bg-brand-100 transition-colors"
          >
            Payslip checker →
          </Link>
          {hasHousing && (
            <Link
              href="/tools/accommodation-costs"
              className="text-xs bg-white border border-brand-200 text-brand-700 rounded-lg px-3 py-1.5 hover:bg-brand-100 transition-colors"
            >
              Accommodation costs →
            </Link>
          )}
        </div>
      </div>

      {/* ── Compare with other agencies ────────────────────────────────────── */}
      {comparisons.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-gray-700 mb-3">
            Compare {agency.name} with similar agencies
          </h2>
          <div className="flex flex-col gap-2">
            {comparisons.map(({ other, pair }) => (
              <Link
                key={pair}
                href={`/compare/${pair}`}
                className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 hover:border-brand-200 hover:bg-brand-50/30 transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800 group-hover:text-brand-700">
                    {agency.name} vs {other.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {SECTOR_META[(other as EnrichedAgency).sector]?.label ?? (other as EnrichedAgency).sector} ·{" "}
                    Score: {other.transparencyScore}/100
                  </p>
                </div>
                <span className="text-xs text-brand-600 font-medium shrink-0">Compare →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Other agencies in the same city ───────────────────────────────── */}
      {otherCityAgencies.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-gray-700 mb-3">
            Other agencies in {cityName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {otherCityAgencies.map((a) => (
              <AgencyMiniCard key={a.slug} agency={a} />
            ))}
          </div>
          <Link
            href={`/cities/${params.city}`}
            className="mt-3 text-xs text-brand-600 hover:text-brand-800 font-medium inline-block"
          >
            See all agencies in {cityName} →
          </Link>
        </section>
      )}

      {/* ── Worker comments from DB ────────────────────────────────────────── */}
      {dbCityComments.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-gray-700 mb-3">
            What workers say about {agency.name} in {cityName}
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-50 mb-2">
            {dbCityComments.map((c) => (
              <div key={c.id} className="px-4">
                <WorkerCommentBubble c={c} />
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 italic">
            Based on worker-submitted comments on AgencyCheck. More experiences may be added over time.
          </p>
        </section>
      )}

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-6">
        <p className="text-sm font-semibold text-brand-800 mb-1">
          Worked with {agency.name} in {cityName}?
        </p>
        <p className="text-xs text-brand-600 mb-2">
          Share your experience to help other workers make informed decisions.
        </p>
        <Link
          href={`/share-experience?agency=${encodeURIComponent(agency.name)}&city=${encodeURIComponent(cityName)}`}
          className="inline-block text-xs bg-brand-600 hover:bg-brand-700 text-white font-semibold
            px-4 py-2 rounded-xl transition-colors"
        >
          Submit your experience →
        </Link>
      </div>

      {/* ── Full profile link ──────────────────────────────────────────────── */}
      <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
        <Link
          href={`/agencies/${agency.slug}`}
          className="text-sm font-semibold text-brand-600 hover:text-brand-800"
        >
          ← View full {agency.name} profile
        </Link>
        <Link
          href="/agencies"
          className="text-sm text-gray-400 hover:text-brand-600"
        >
          All agencies →
        </Link>
      </div>
    </main>
  );
}
