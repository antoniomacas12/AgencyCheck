"use client";

/**
 * AgencyListClient — Client-side searchable agency grid for /agencies.
 * Filters the full agency list in real time as the user types.
 * Replaces the static grid in the server-rendered agencies page.
 */

import { useState, useMemo } from "react";
import AgencyCard from "@/components/AgencyCard";
import type { EnrichedAgency } from "@/lib/agencyEnriched";
import { useT, type Locale } from "@/lib/i18n";

interface AgencyListClientProps {
  agencies: EnrichedAgency[];
  /** slug → job count map, pre-computed server-side */
  jobCounts?: Record<string, number>;
  /** Locale forwarded from the server page */
  locale?: Locale;
}

export default function AgencyListClient({ agencies, jobCounts, locale = "en" }: AgencyListClientProps) {
  const t = useT(locale);
  const [query, setQuery] = useState("");

  const filtered = useMemo<EnrichedAgency[]>(() => {
    const q = query.toLowerCase().trim();
    if (!q) return agencies;

    return agencies.filter((a) => {
      const fields = [
        a.name,
        a.city,
        a.description ?? "",
        a.jobTypes ?? "",
        ...a.cities,
        ...a.jobTitles,
        ...a.aliases,
      ];
      return fields.some((f) => f.toLowerCase().includes(q));
    });
  }, [agencies, query]);

  return (
    <div>
      {/* ── Search input ── */}
      <div className="relative mb-5">
        <span
          aria-hidden
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none select-none"
        >
          🔍
        </span>
        <input
          type="text"
          placeholder={t("agencies_page.search_placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          className={[
            "w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl",
            "text-sm text-gray-900 placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
            "transition-shadow",
          ].join(" ")}
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Result count (only shown while searching) ── */}
      {query.trim() && (
        <p className="text-sm text-gray-500 mb-4">
          {filtered.length === 0
            ? t("agencies_page.search_no_results", { query })
            : t("agencies_page.search_results", { count: filtered.length, plural: filtered.length === 1 ? "" : "s" })}
        </p>
      )}

      {/* ── Agency grid ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((agency) => (
          <AgencyCard
            key={agency.id}
            agency={agency}
            jobCount={jobCounts?.[agency.slug]}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}
