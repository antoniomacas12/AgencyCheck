import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ALL_AGENCIES,
  ALL_AGENCY_MAP,
  type EnrichedAgency,
} from "@/lib/agencyEnriched";
import {
  filterEligibleComparisons,
  canGenerateAgencyComparison,
  getRobotsDirective,
  type ComparisonOverlap,
} from "@/lib/pageEligibility";
import { SECTOR_META } from "@/lib/agencyMeta";

// ─── Static generation — unknown pair slugs 404 immediately ─────────────────
// Never falls through to runtime rendering — all valid pages are built ahead.
export const dynamicParams = false;

// ─── Static params: all indexed eligible comparisons ─────────────────────────

export function generateStaticParams() {
  // Generate ALL indexed eligible comparisons (no cap).
  // All pass strict quality gates: score ≥ 30, confidence ≠ very_low, overlap ≥ 25.
  // Capped only by the dataset — at most n*(n-1)/2 pairs for 127 agencies.
  return filterEligibleComparisons(ALL_AGENCIES, true).map(({ a, b }) => ({
    pair: `${a.slug}-vs-${b.slug}`,
  }));
}

// ─── Parse pair slug → two EnrichedAgency objects ────────────────────────────
// Agency slugs may contain hyphens, so we try every `-vs-` occurrence.

function parsePair(
  pair: string,
): { agencyA: EnrichedAgency; agencyB: EnrichedAgency } | null {
  const SEP = "-vs-";
  let from = 0;
  while (true) {
    const idx = pair.indexOf(SEP, from);
    if (idx === -1) break;
    const slugA = pair.slice(0, idx);
    const slugB = pair.slice(idx + SEP.length);
    if (slugA && slugB && ALL_AGENCY_MAP[slugA] && ALL_AGENCY_MAP[slugB]) {
      return { agencyA: ALL_AGENCY_MAP[slugA], agencyB: ALL_AGENCY_MAP[slugB] };
    }
    from = idx + 1;
  }
  return null;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { pair: string };
}): Promise<Metadata> {
  const parsed = parsePair(params.pair);
  if (!parsed) return { title: "Comparison not found — AgencyCheck" };

  const { agencyA, agencyB } = parsed;
  const { decision, overlap } = canGenerateAgencyComparison(agencyA, agencyB);

  if (!decision.allowed) return { title: "Comparison not available — AgencyCheck" };

  const robotsMeta = getRobotsDirective(decision);
  const cityNote =
    overlap.sharedCities.length > 0
      ? ` Both agencies operate in ${overlap.sharedCities
          .slice(0, 2)
          .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
          .join(" and ")}.`
      : "";
  const sectorNote = overlap.sharedSector
    ? ` Both are ${SECTOR_META[agencyA.sector]?.label ?? agencyA.sector} agencies.`
    : "";

  return {
    title: `${agencyA.name} vs ${agencyB.name} — Side-by-Side Comparison — AgencyCheck`,
    description: `Compare ${agencyA.name} and ${agencyB.name}: housing, transparency, job types, and cities.${sectorNote}${cityNote} Find out which agency is better for workers in the Netherlands.`,
    alternates: { canonical: `/compare/${params.pair}` },
    robots: robotsMeta,
  };
}

// ─── Accommodation label helper ───────────────────────────────────────────────

function accommodationLabel(acc: EnrichedAgency["accommodation"]): {
  text: string;
  color: string;
} {
  switch (acc) {
    case "confirmed_with_deduction":
      return { text: "Yes — deducted from wage", color: "text-amber-700" };
    case "confirmed_no_deduction":
      return { text: "Yes — free of charge", color: "text-green-700" };
    case "not_provided":
      return { text: "Not provided", color: "text-gray-500" };
    case "unverified_claim":
      return { text: "Claimed (unverified)", color: "text-gray-400" };
    case "unknown":
    default:
      return { text: "Unknown", color: "text-gray-400" };
  }
}

// ─── Confidence label helper ──────────────────────────────────────────────────

function confidenceLabel(level: EnrichedAgency["confidenceLevel"]): {
  text: string;
  color: string;
  bg: string;
} {
  switch (level) {
    case "high":
      return { text: "High", color: "text-green-700", bg: "bg-green-50" };
    case "medium":
      return { text: "Medium", color: "text-amber-700", bg: "bg-amber-50" };
    case "low":
      return { text: "Low", color: "text-gray-600", bg: "bg-gray-100" };
    case "very_low":
    default:
      return { text: "Very Low", color: "text-red-600", bg: "bg-red-50" };
  }
}

// ─── Score bar component ──────────────────────────────────────────────────────

function ScoreBar({ score, highlight }: { score: number; highlight: boolean }) {
  const pct = Math.min(score, 100);
  const color =
    score >= 70
      ? "bg-green-500"
      : score >= 40
      ? "bg-amber-400"
      : "bg-red-400";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-2 rounded-full ${color} ${highlight ? "ring-2 ring-offset-1 ring-brand-400" : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-sm font-semibold w-8 text-right ${highlight ? "text-brand-700" : "text-gray-700"}`}>
        {score}
      </span>
    </div>
  );
}

// ─── Comparison row component ─────────────────────────────────────────────────

function CompareRow({
  label,
  valA,
  valB,
  highlightA,
  highlightB,
}: {
  label: string;
  valA: ReactNode;
  valB: ReactNode;
  highlightA?: boolean;
  highlightB?: boolean;
}) {
  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors">
      <td className="py-3 px-4 text-xs font-medium text-gray-500 w-36">{label}</td>
      <td
        className={`py-3 px-4 text-sm ${highlightA ? "font-semibold text-brand-700 bg-brand-50/40" : "text-gray-700"}`}
      >
        {valA}
      </td>
      <td
        className={`py-3 px-4 text-sm ${highlightB ? "font-semibold text-brand-700 bg-brand-50/40" : "text-gray-700"}`}
      >
        {valB}
      </td>
    </tr>
  );
}

// ─── Related comparisons helper ───────────────────────────────────────────────

function getRelatedComparisons(
  agencyA: EnrichedAgency,
  agencyB: EnrichedAgency,
  limit = 4,
): Array<{ a: EnrichedAgency; b: EnrichedAgency; overlapScore: number }> {
  // Find pairs that include agencyA or agencyB (but not the current pair itself)
  const eligible = filterEligibleComparisons(ALL_AGENCIES, true).filter(
    ({ a, b }) =>
      !(
        (a.slug === agencyA.slug && b.slug === agencyB.slug) ||
        (a.slug === agencyB.slug && b.slug === agencyA.slug)
      ) &&
      (a.slug === agencyA.slug ||
        b.slug === agencyA.slug ||
        a.slug === agencyB.slug ||
        b.slug === agencyB.slug),
  );

  return eligible
    .sort((x, y) => y.overlap.overlapScore - x.overlap.overlapScore)
    .slice(0, limit)
    .map(({ a, b, overlap }) => ({ a: a as EnrichedAgency, b: b as EnrichedAgency, overlapScore: overlap.overlapScore }));
}

// ─── Worker relevance section helper ──────────────────────────────────────────

function WorkerRelevanceSection({
  agencyA,
  agencyB,
  overlap,
}: {
  agencyA: EnrichedAgency;
  agencyB: EnrichedAgency;
  overlap: ComparisonOverlap;
}) {
  const scoreA = agencyA.transparencyScore;
  const scoreB = agencyB.transparencyScore;
  const higherTransparency =
    scoreA > scoreB ? agencyA : scoreB > scoreA ? agencyB : null;

  const betterAccommodation: EnrichedAgency | null = (() => {
    const rankAcc = (acc: EnrichedAgency["accommodation"]) => {
      if (acc === "confirmed_no_deduction") return 3;
      if (acc === "confirmed_with_deduction") return 2;
      if (acc === "unverified_claim") return 1;
      return 0;
    };
    const ra = rankAcc(agencyA.accommodation);
    const rb = rankAcc(agencyB.accommodation);
    if (ra > rb) return agencyA;
    if (rb > ra) return agencyB;
    return null;
  })();

  const warehouseJobs = ["order-picker", "warehouse-worker", "forklift-driver", "reach-truck-driver"];
  const aHasWarehouse = agencyA.jobFocus.some((j) => warehouseJobs.includes(j));
  const bHasWarehouse = agencyB.jobFocus.some((j) => warehouseJobs.includes(j));

  return (
    <section className="mt-6 space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Which agency is better for you?</h2>

      {/* Transparency */}
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <p className="text-sm font-semibold text-gray-800 mb-1">
          🔍 Which agency appears more transparent?
        </p>
        {higherTransparency ? (
          <p className="text-sm text-gray-600">
            <strong>{higherTransparency.name}</strong> has a higher transparency score (
            {higherTransparency.transparencyScore}/100 vs{" "}
            {higherTransparency === agencyA ? agencyB.transparencyScore : agencyA.transparencyScore}
            /100), meaning more verified data is available about their working conditions,
            housing, and contact details.
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Both agencies share the same transparency score ({scoreA}/100). Either choice gives you
            similar levels of available worker information.
          </p>
        )}
      </div>

      {/* Accommodation */}
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <p className="text-sm font-semibold text-gray-800 mb-1">
          🏠 Which agency is better for workers needing accommodation?
        </p>
        {betterAccommodation ? (
          <p className="text-sm text-gray-600">
            <strong>{betterAccommodation.name}</strong> offers better accommodation terms:{" "}
            {accommodationLabel(betterAccommodation.accommodation).text.toLowerCase()}. If housing
            is important to you, this agency is the stronger choice.
          </p>
        ) : agencyA.accommodation === "not_provided" && agencyB.accommodation === "not_provided" ? (
          <p className="text-sm text-gray-600">
            Neither agency provides worker housing. You will need to arrange your own
            accommodation. Consider checking{" "}
            <Link href="/tools/accommodation-costs" className="text-brand-600 underline">
              our accommodation cost calculator
            </Link>
            .
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Both agencies offer similar accommodation arrangements. Verify directly with each
            agency before signing.
          </p>
        )}
      </div>

      {/* Warehouse / logistics jobs */}
      {(aHasWarehouse || bHasWarehouse) && (
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-800 mb-1">
            📦 Which agency is better for warehouse jobs?
          </p>
          {aHasWarehouse && bHasWarehouse ? (
            <p className="text-sm text-gray-600">
              Both <strong>{agencyA.name}</strong> and <strong>{agencyB.name}</strong> focus on
              warehouse and logistics roles.
              {overlap.sharedCities.length > 0
                ? ` They overlap in ${overlap.sharedCities
                    .slice(0, 2)
                    .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
                    .join(" and ")}, making this a genuine side-by-side choice.`
                : ""}
            </p>
          ) : aHasWarehouse ? (
            <p className="text-sm text-gray-600">
              <strong>{agencyA.name}</strong> specifically lists warehouse and logistics roles
              among its job focus, while <strong>{agencyB.name}</strong> does not. For warehouse
              jobs, {agencyA.name} is the more targeted option.
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              <strong>{agencyB.name}</strong> specifically lists warehouse and logistics roles,
              while <strong>{agencyA.name}</strong> does not. For warehouse jobs,{" "}
              {agencyB.name} is the more targeted option.
            </p>
          )}
        </div>
      )}

      {/* Shared cities context */}
      {overlap.sharedCities.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-800 mb-1">
            📍 Where do they both operate?
          </p>
          <p className="text-sm text-gray-600">
            Both agencies are active in{" "}
            {overlap.sharedCities
              .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
              .join(", ")}
            . If you are looking for work in these cities, you have a real choice between the two.
          </p>
        </div>
      )}
    </section>
  );
}

// ─── Page component ────────────────────────────────────────────────────────────

export default function ComparisonPage({
  params,
}: {
  params: { pair: string };
}) {
  const parsed = parsePair(params.pair);
  if (!parsed) return notFound();

  const { agencyA, agencyB } = parsed;
  const { decision, overlap } = canGenerateAgencyComparison(agencyA, agencyB);

  if (!decision.allowed) return notFound();

  const sectorA = SECTOR_META[agencyA.sector];
  const sectorB = SECTOR_META[agencyB.sector];

  const confA = confidenceLabel(agencyA.confidenceLevel);
  const confB = confidenceLabel(agencyB.confidenceLevel);
  const accA  = accommodationLabel(agencyA.accommodation);
  const accB  = accommodationLabel(agencyB.accommodation);

  const scoreAWins = agencyA.transparencyScore > agencyB.transparencyScore;
  const scoreBWins = agencyB.transparencyScore > agencyA.transparencyScore;

  const needsTrustNote =
    agencyA.confidenceLevel === "low" ||
    agencyB.confidenceLevel === "low" ||
    agencyA.confidenceLevel === "medium" ||
    agencyB.confidenceLevel === "medium" ||
    agencyA.transparencyScore < 50 ||
    agencyB.transparencyScore < 50;

  const related = getRelatedComparisons(agencyA, agencyB);

  // Shared job focus — job slug → readable label
  const jobLabels: Record<string, string> = {
    "order-picker":       "Order picker",
    "warehouse-worker":   "Warehouse worker",
    "forklift-driver":    "Forklift driver",
    "reach-truck-driver": "Reach truck driver",
    "production-worker":  "Production worker",
    "packing-operator":   "Packing operator",
    "truck-driver":       "Truck driver",
    "delivery-driver":    "Delivery driver",
    "machine-operator":   "Machine operator",
    "assembly-worker":    "Assembly worker",
    "greenhouse-worker":  "Greenhouse worker",
    "cleaning-staff":     "Cleaning staff",
    "care-worker":        "Care worker",
    "nursing":            "Nursing",
    "home-care":          "Home care",
    "software-developer": "Software developer",
    "it-infrastructure":  "IT infrastructure",
    "data-analyst":       "Data analyst",
    "hospitality-staff":  "Hospitality staff",
    "admin-worker":       "Admin worker",
    "technical-specialist": "Technical specialist",
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link href="/compare" className="hover:text-brand-600">Compare</Link>
        <span>/</span>
        <span className="text-gray-600">{agencyA.name} vs {agencyB.name}</span>
      </nav>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
          {agencyA.name} vs {agencyB.name}
        </h1>
        <p className="text-sm text-gray-500">
          Side-by-side worker comparison for agencies in the Netherlands.
          {overlap.sharedSector && sectorA
            ? ` Both are ${sectorA.label} agencies.`
            : ""}
          {overlap.sharedCities.length > 0
            ? ` Both operate in ${overlap.sharedCities
                .slice(0, 2)
                .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
                .join(" and ")}.`
            : ""}
        </p>
        {overlap.sharedJobFocus.length > 0 && (
          <p className="text-xs text-brand-700 bg-brand-50 border border-brand-100 rounded-lg px-3 py-1.5 mt-3 inline-block">
            Shared job focus:{" "}
            {overlap.sharedJobFocus
              .map((j) => jobLabels[j] ?? j)
              .join(", ")}
          </p>
        )}
      </header>

      {/* ── Quick agency links ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {([agencyA, agencyB] as const).map((agency) => (
          <Link
            key={agency.slug}
            href={`/agencies/${agency.slug}`}
            className="block bg-white border border-gray-200 rounded-xl p-3 hover:border-brand-200 hover:bg-brand-50/30 transition-colors group"
          >
            <p className="text-xs text-gray-400 mb-0.5">View full profile</p>
            <p className="text-sm font-semibold text-gray-800 group-hover:text-brand-700 leading-tight">
              {agency.name}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {SECTOR_META[agency.sector]?.icon ?? "🏢"} {SECTOR_META[agency.sector]?.label ?? agency.sector}
            </p>
          </Link>
        ))}
      </div>

      {/* ── Comparison table ───────────────────────────────────────────────── */}
      <section className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-6">
        <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-100">
          <div className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Detail
          </div>
          <div className="py-3 px-4 text-xs font-semibold text-gray-700 truncate border-l border-gray-100">
            {agencyA.name}
          </div>
          <div className="py-3 px-4 text-xs font-semibold text-gray-700 truncate border-l border-gray-100">
            {agencyB.name}
          </div>
        </div>

        <table className="w-full">
          <tbody>
            {/* Sector */}
            <CompareRow
              label="Sector"
              valA={
                <span>
                  {sectorA?.icon ?? "🏢"} {sectorA?.label ?? agencyA.sector}
                </span>
              }
              valB={
                <span>
                  {sectorB?.icon ?? "🏢"} {sectorB?.label ?? agencyB.sector}
                </span>
              }
              highlightA={overlap.sharedSector}
              highlightB={overlap.sharedSector}
            />

            {/* Job focus */}
            <CompareRow
              label="Job focus"
              valA={
                agencyA.jobFocus.length > 0 ? (
                  <span className="text-xs">
                    {agencyA.jobFocus.map((j) => jobLabels[j] ?? j).join(", ")}
                  </span>
                ) : (
                  <span className="text-gray-400 text-xs">Not specified</span>
                )
              }
              valB={
                agencyB.jobFocus.length > 0 ? (
                  <span className="text-xs">
                    {agencyB.jobFocus.map((j) => jobLabels[j] ?? j).join(", ")}
                  </span>
                ) : (
                  <span className="text-gray-400 text-xs">Not specified</span>
                )
              }
            />

            {/* Supported cities */}
            <CompareRow
              label="Operates in"
              valA={
                agencyA.supportedCities.length > 0 ? (
                  <span className="text-xs">
                    {agencyA.supportedCities
                      .slice(0, 4)
                      .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
                      .join(", ")}
                    {agencyA.supportedCities.length > 4
                      ? ` +${agencyA.supportedCities.length - 4} more`
                      : ""}
                  </span>
                ) : (
                  <span className="text-xs">{agencyA.city}</span>
                )
              }
              valB={
                agencyB.supportedCities.length > 0 ? (
                  <span className="text-xs">
                    {agencyB.supportedCities
                      .slice(0, 4)
                      .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
                      .join(", ")}
                    {agencyB.supportedCities.length > 4
                      ? ` +${agencyB.supportedCities.length - 4} more`
                      : ""}
                  </span>
                ) : (
                  <span className="text-xs">{agencyB.city}</span>
                )
              }
            />

            {/* Accommodation */}
            <CompareRow
              label="Housing"
              valA={
                <span className={`text-xs ${accA.color}`}>{accA.text}</span>
              }
              valB={
                <span className={`text-xs ${accB.color}`}>{accB.text}</span>
              }
              highlightA={
                agencyA.accommodation === "confirmed_with_deduction" ||
                agencyA.accommodation === "confirmed_no_deduction"
              }
              highlightB={
                agencyB.accommodation === "confirmed_with_deduction" ||
                agencyB.accommodation === "confirmed_no_deduction"
              }
            />

            {/* Transparency score */}
            <CompareRow
              label="Transparency"
              valA={
                <ScoreBar
                  score={agencyA.transparencyScore}
                  highlight={scoreAWins}
                />
              }
              valB={
                <ScoreBar
                  score={agencyB.transparencyScore}
                  highlight={scoreBWins}
                />
              }
              highlightA={scoreAWins}
              highlightB={scoreBWins}
            />

            {/* Confidence level */}
            <CompareRow
              label="Data quality"
              valA={
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${confA.bg} ${confA.color}`}
                >
                  {confA.text}
                </span>
              }
              valB={
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${confB.bg} ${confB.color}`}
                >
                  {confB.text}
                </span>
              }
            />

            {/* Website */}
            <CompareRow
              label="Website"
              valA={
                agencyA.website ? (
                  <a
                    href={agencyA.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-600 underline hover:text-brand-800 truncate block max-w-[160px]"
                  >
                    {agencyA.website.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                ) : (
                  <span className="text-gray-400 text-xs">Not listed</span>
                )
              }
              valB={
                agencyB.website ? (
                  <a
                    href={agencyB.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-600 underline hover:text-brand-800 truncate block max-w-[160px]"
                  >
                    {agencyB.website.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                ) : (
                  <span className="text-gray-400 text-xs">Not listed</span>
                )
              }
            />
          </tbody>
        </table>
      </section>

      {/* ── Worker relevance sections ──────────────────────────────────────── */}
      <WorkerRelevanceSection agencyA={agencyA} agencyB={agencyB} overlap={overlap} />

      {/* ── Trust note ─────────────────────────────────────────────────────── */}
      {needsTrustNote && (
        <div className="mt-6 bg-amber-50 border border-amber-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-amber-800 mb-1">
            ⚠️ Data completeness note
          </p>
          <p className="text-xs text-amber-700">
            One or both agencies in this comparison have limited publicly available data
            (medium or low confidence level, or transparency score below 50/100). The
            information shown is based on research from official sources, but some details
            may be incomplete. Always verify housing, pay, and contract terms directly
            with the agency before signing.
          </p>
        </div>
      )}

      {/* ── Inline tools CTA ───────────────────────────────────────────────── */}
      <div className="mt-6 bg-brand-50 border border-brand-100 rounded-xl p-4">
        <p className="text-sm font-semibold text-brand-800 mb-2">
          💶 Know what you&apos;ll actually earn
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
          {(agencyA.accommodation !== "not_provided" || agencyB.accommodation !== "not_provided") && (
            <Link
              href="/tools/accommodation-costs"
              className="text-xs bg-white border border-brand-200 text-brand-700 rounded-lg px-3 py-1.5 hover:bg-brand-100 transition-colors"
            >
              Accommodation cost calculator →
            </Link>
          )}
        </div>
      </div>

      {/* ── Shared job category links ───────────────────────────────────────── */}
      {overlap.sharedJobFocus.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Salary information for shared job types
          </h3>
          <div className="flex flex-wrap gap-2">
            {overlap.sharedJobFocus.map((jobSlug) => (
              <Link
                key={jobSlug}
                href={`/jobs/${jobSlug}`}
                className="text-xs bg-gray-50 border border-gray-200 text-gray-600 rounded-lg px-3 py-1.5 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-colors"
              >
                {jobLabels[jobSlug] ?? jobSlug} jobs →
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Related comparisons ─────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Related comparisons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {related.map(({ a, b, overlapScore }) => (
              <Link
                key={`${a.slug}-vs-${b.slug}`}
                href={`/compare/${a.slug}-vs-${b.slug}`}
                className="block bg-white border border-gray-100 rounded-xl p-3 hover:border-brand-200 hover:bg-brand-50/30 transition-colors group"
              >
                <p className="text-xs text-gray-400 mb-0.5">Compare agencies</p>
                <p className="text-sm font-medium text-gray-800 group-hover:text-brand-700 leading-snug">
                  {a.name} vs {b.name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Match score: {overlapScore}/100
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Full profile links ───────────────────────────────────────────────── */}
      <section className="mt-8 pt-6 border-t border-gray-100">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">
          Full agency profiles
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {([agencyA, agencyB] as const).map((agency) => (
            <Link
              key={agency.slug}
              href={`/agencies/${agency.slug}`}
              className="block bg-gray-50 border border-gray-200 rounded-xl p-3 hover:border-brand-200 hover:bg-brand-50 transition-colors"
            >
              <p className="text-sm font-semibold text-gray-800">{agency.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Transparency: {agency.transparencyScore}/100 · {SECTOR_META[agency.sector]?.label ?? agency.sector}
              </p>
              <p className="text-xs text-brand-600 mt-1">View full profile →</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
