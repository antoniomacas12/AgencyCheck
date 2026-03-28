"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { ActiveFilter } from "@/lib/searchLogic";

interface ActiveFiltersProps {
  filters: ActiveFilter[];
}

export default function ActiveFilters({ filters }: ActiveFiltersProps) {
  const router      = useRouter();
  const searchParams = useSearchParams();

  const removeFilter = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      router.push(`/search?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearAll = useCallback(() => {
    router.push("/search");
  }, [router]);

  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5">
      <span className="text-xs text-gray-400 shrink-0 font-medium">Active:</span>

      {filters.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-full border border-brand-100"
        >
          {filter.label}
          <button
            onClick={() => removeFilter(filter.key)}
            className="text-brand-400 hover:text-brand-700 leading-none transition-colors"
            aria-label={`Remove filter: ${filter.label}`}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M2 2l8 8M10 2l-8 8" />
            </svg>
          </button>
        </span>
      ))}

      {filters.length > 1 && (
        <button
          onClick={clearAll}
          className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
