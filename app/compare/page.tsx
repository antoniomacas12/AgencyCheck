import type { Metadata } from "next";
import Link from "next/link";
import ScoreBadge from "@/components/ScoreBadge";
import HousingBadge from "@/components/HousingBadge";
import { AGENCIES }  from "@/lib/agencyData";
import type { AgencyCardData } from "@/components/AgencyCard";

export const metadata: Metadata = {
  title: "Compare Employment Agencies Netherlands — AgencyCheck",
  description: "Compare two employment agencies in the Netherlands side by side — housing, salary, transport, worker score, and open issues. Make an informed choice before you sign.",
  alternates: { canonical: "/compare" },
  robots: { index: true, follow: true },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface ComparePageProps {
  searchParams: { agencies?: string };
}

// ─── Winner helpers ───────────────────────────────────────────────────────────

/** Returns the index(es) of the best value. higherIsBetter = true for score/pay/rating. */
function winnerIndexes(values: (number | null)[], higherIsBetter: boolean): number[] {
  const valid = values
    .map((v, i) => ({ v, i }))
    .filter(({ v }) => v !== null) as { v: number; i: number }[];
  if (valid.length === 0) return [];
  const best = higherIsBetter
    ? Math.max(...valid.map(({ v }) => v))
    : Math.min(...valid.map(({ v }) => v));
  return valid.filter(({ v }) => v === best).map(({ i }) => i);
}

const housingRank: Record<AgencyCardData["housing"], number> = {
  YES:     2,
  UNKNOWN: 1,
  NO:      0,
};

/** Tailwind classes for a winning cell (highlighted) vs. normal cell. */
function cellCls(isWinner: boolean, alt: boolean): string {
  if (isWinner) return "p-4 text-center bg-green-50";
  return alt ? "p-4 text-center bg-gray-50/50" : "p-4 text-center";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ComparePage({ searchParams }: ComparePageProps) {
  // Only allow exactly 2 agencies
  const slugs = (searchParams.agencies ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 2);

  const selected = AGENCIES.filter((a) => slugs.includes(a.slug));

  const allAgencies = [...AGENCIES].sort((a, b) => b.score - a.score);
  const showPicker  = selected.length < 2;

  // ── Precompute per-row winners ─────────────────────────────────────────────
  const scoreWinners   = winnerIndexes(selected.map((a) => a.score),               true);
  const housingWinners = winnerIndexes(selected.map((a) => housingRank[a.housing]), true);
  const ratingWinners  = winnerIndexes(selected.map((a) => a.avgSalaryRating ?? null), true);
  const issueWinners   = winnerIndexes(selected.map((a) => a.issueCount ?? null),   false); // fewer = better
  const payWinners     = winnerIndexes(selected.map((a) => a.avgHourlyPay ?? null), true);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Compare Agencies</h1>
      <p className="text-sm text-gray-500 mb-7">
        Select 2 agencies to compare side by side. Data is worker-reported and informational.
      </p>

      {/* ── Agency picker ─────────────────────────────────────────────────── */}
      {showPicker && (
        <div className="card p-5 mb-8">
          <p className="text-sm font-semibold text-gray-700 mb-1">
            {slugs.length === 0
              ? "Select 2 agencies to compare:"
              : "Now pick the second agency:"}
          </p>
          {slugs.length === 1 && (
            <p className="text-xs text-gray-400 mb-3">
              Selected: <strong className="text-brand-600">{selected[0]?.name}</strong>
            </p>
          )}
          {slugs.length === 0 && <div className="mb-3" />}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {allAgencies.map((agency) => {
              const isSelected = slugs.includes(agency.slug);
              const newSlugs   = isSelected
                ? slugs.filter((s) => s !== agency.slug)
                : [...slugs, agency.slug].slice(0, 2);
              const href = `/compare?agencies=${newSlugs.join(",")}`;

              return (
                <Link
                  key={agency.id}
                  href={href}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    isSelected
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-brand-300 hover:bg-brand-50/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">{agency.name}</span>
                    {isSelected && <span className="text-brand-600 shrink-0">✓</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 font-normal">
                    {agency.reviewCount >= 3 ? `Score: ${agency.score}` : "No reviews yet"}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Comparison table ──────────────────────────────────────────────── */}
      {selected.length === 2 && (
        <div>
          {/* Reset + change link */}
          <div className="flex items-center justify-between mb-4">
            <Link href="/compare" className="text-xs text-gray-400 hover:text-brand-600 transition-colors">
              ← Change agencies
            </Link>
            <p className="text-xs text-gray-400">
              🟢 Highlighted = better for workers
            </p>
          </div>

          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {/* Category column */}
                  <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wide w-32" />
                  {selected.map((agency, i) => (
                    <th key={agency.id} className="p-4 text-center">
                      <Link
                        href={`/agencies/${agency.slug}`}
                        className="font-bold text-gray-900 hover:text-brand-600 text-sm leading-tight block"
                      >
                        {agency.name}
                      </Link>
                      <p className="text-xs text-gray-400 font-normal mt-0.5">
                        {agency.cities.slice(0, 2).join(", ")}
                        {agency.cities.length > 2 && " +more"}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {/* ── Score ── */}
                <tr>
                  <td className="p-4 text-xs font-medium text-gray-500 whitespace-nowrap">Agency Score</td>
                  {selected.map((agency, i) => (
                    <td key={agency.id} className={cellCls(scoreWinners.includes(i), false)}>
                      <div className="flex flex-col items-center gap-2">
                        <ScoreBadge score={agency.score} reviewCount={agency.reviewCount} size="lg" showLabel showBar />
                      </div>
                    </td>
                  ))}
                </tr>

                {/* ── Housing ── */}
                <tr>
                  <td className="p-4 text-xs font-medium text-gray-500">Housing</td>
                  {selected.map((agency, i) => (
                    <td key={agency.id} className={cellCls(housingWinners.includes(i), true)}>
                      <div className="flex justify-center">
                        <HousingBadge housing={agency.housing} size="sm" />
                      </div>
                      {agency.avgHousingRating != null && (
                        <p className="text-xs text-gray-400 mt-1">
                          Avg rating: {agency.avgHousingRating.toFixed(1)}/5
                        </p>
                      )}
                    </td>
                  ))}
                </tr>

                {/* ── Avg hourly pay ── */}
                <tr>
                  <td className="p-4 text-xs font-medium text-gray-500 whitespace-nowrap">Avg Hourly Pay</td>
                  {selected.map((agency, i) => (
                    <td key={agency.id} className={cellCls(payWinners.includes(i), false)}>
                      {agency.avgHourlyPay != null ? (
                        <span className="font-semibold text-gray-800">
                          €{agency.avgHourlyPay.toFixed(2)}/hr
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">No data</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* ── Salary rating ── */}
                <tr>
                  <td className="p-4 text-xs font-medium text-gray-500 whitespace-nowrap">Salary Rating</td>
                  {selected.map((agency, i) => (
                    <td key={agency.id} className={cellCls(ratingWinners.includes(i), true)}>
                      {agency.avgSalaryRating != null ? (
                        <span className="font-medium text-gray-700">
                          {agency.avgSalaryRating.toFixed(1)} / 5
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">No data</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* ── Open issues ── */}
                <tr>
                  <td className="p-4 text-xs font-medium text-gray-500 whitespace-nowrap">Open Issues</td>
                  {selected.map((agency, i) => {
                    const count = agency.issueCount ?? 0;
                    return (
                      <td key={agency.id} className={cellCls(issueWinners.includes(i), false)}>
                        {count === 0 ? (
                          <span className="text-green-600 font-semibold text-xs">✓ None</span>
                        ) : (
                          <span className={`font-semibold ${count >= 5 ? "text-red-500" : "text-amber-600"}`}>
                            {count} ⚠️
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* ── Reviews ── */}
                <tr>
                  <td className="p-4 text-xs font-medium text-gray-500">Reviews</td>
                  {selected.map((agency) => (
                    <td key={agency.id} className="p-4 text-center bg-gray-50/50 text-gray-700 text-sm">
                      {agency.reviewCount}
                    </td>
                  ))}
                </tr>

                {/* ── View profile ── */}
                <tr className="border-t border-gray-100">
                  <td className="p-4" />
                  {selected.map((agency) => (
                    <td key={agency.id} className="p-4 text-center">
                      <Link
                        href={`/agencies/${agency.slug}`}
                        className="inline-block text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg px-4 py-2 transition-colors"
                      >
                        View profile →
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-gray-400 text-center">
            All data is worker-reported and informational. Not affiliated with any agency.
          </p>
        </div>
      )}
    </div>
  );
}
