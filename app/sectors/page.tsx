import type { Metadata } from "next";
import Link from "next/link";
import { SECTORS } from "@/lib/agencyMeta";
import { AGENCIES_BY_SECTOR, getActiveSectors } from "@/lib/agencyEnriched";

export const metadata: Metadata = {
  title:       "Employment Agency Sectors in the Netherlands — AgencyCheck",
  description: "Browse employment agencies in the Netherlands by sector: logistics, food production, construction, healthcare, IT, transport, hospitality, and more.",
  alternates:  { canonical: "https://agencycheck.io/sectors" },
};

export default function SectorsIndexPage() {
  const activeSectors = getActiveSectors();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* ── Breadcrumb ── */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/agencies" className="hover:text-brand-600">Agencies</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Sectors</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
          Browse Agencies by Sector
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          Find employment agencies in the Netherlands grouped by industry sector.
          Each sector page shows agencies, housing availability, salary data, and worker reviews.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {activeSectors.map((sectorSlug) => {
          const meta     = SECTORS.find((s) => s.slug === sectorSlug);
          const agencies = AGENCIES_BY_SECTOR[sectorSlug] ?? [];
          const withHousing = agencies.filter((a) => a.housing === "YES").length;
          if (!meta) return null;
          return (
            <Link
              key={sectorSlug}
              href={`/sectors/${sectorSlug}`}
              className="card p-4 hover:shadow-md hover:border-brand-100 transition-all hover:-translate-y-0.5 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{meta.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">{meta.label}</p>
                  <p className="text-[10px] text-gray-400">{meta.labelNL}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{meta.description}</p>
              <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-auto pt-1 border-t border-gray-50">
                <span>🏢 {agencies.length} agenc{agencies.length === 1 ? "y" : "ies"}</span>
                {withHousing > 0 && (
                  <span className="text-green-700">🏠 {withHousing} with housing</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="text-center">
        <Link href="/agencies" className="text-sm text-brand-600 hover:underline">
          Browse all agencies →
        </Link>
      </div>
    </div>
  );
}
