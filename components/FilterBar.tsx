"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

const HOUSING_OPTIONS = [
  { label: "All",          value: ""    },
  { label: "🏠 Housing",   value: "yes" },
  { label: "No housing",   value: "no"  },
];

interface FilterBarProps {
  totalResults?: number;
}

export default function FilterBar({ totalResults }: FilterBarProps) {
  const router      = useRouter();
  const searchParams = useSearchParams();

  const currentHousing = searchParams.get("housing") ?? "";

  // Local state for salary inputs — avoids a route push on every keystroke
  const [salaryMin, setSalaryMin] = useState(searchParams.get("salaryMin") ?? "");
  const [salaryMax, setSalaryMax] = useState(searchParams.get("salaryMax") ?? "");

  // Keep local salary state in sync if URL changes externally (e.g. ActiveFilters removes a chip)
  useEffect(() => {
    setSalaryMin(searchParams.get("salaryMin") ?? "");
    setSalaryMax(searchParams.get("salaryMax") ?? "");
  }, [searchParams]);

  // Push a single param change to the URL
  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.push(`/search?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Apply both salary inputs at once (called on blur or Enter)
  const applySalary = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    const min = salaryMin.trim();
    const max = salaryMax.trim();

    if (min) params.set("salaryMin", min);
    else params.delete("salaryMin");

    if (max) params.set("salaryMax", max);
    else params.delete("salaryMax");

    router.push(`/search?${params.toString()}`);
  }, [router, searchParams, salaryMin, salaryMax]);

  const handleSalaryKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") applySalary();
  };

  const hasAnySalary = !!(searchParams.get("salaryMin") || searchParams.get("salaryMax"));

  return (
    <div className="bg-white border-b border-gray-200 sticky top-14 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">

          {/* Result count */}
          {totalResults !== undefined && (
            <p className="text-sm text-gray-500 shrink-0 mr-1">
              <span className="font-semibold text-gray-800">{totalResults}</span>{" "}
              {totalResults === 1 ? "agency" : "agencies"}
            </p>
          )}

          {/* Divider */}
          <div className="hidden sm:block h-5 w-px bg-gray-200 shrink-0" />

          {/* Housing filter pills */}
          <div
            className="flex items-center gap-0.5 bg-gray-100 rounded-xl p-1 shrink-0"
            role="group"
            aria-label="Housing filter"
          >
            {HOUSING_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateParam("housing", opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentHousing === opt.value
                    ? "bg-white text-brand-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Salary range */}
          <div className="flex items-center gap-1.5" role="group" aria-label="Salary range filter">
            <span className="text-xs text-gray-400 shrink-0 font-medium">€/hr</span>
            <input
              type="number"
              min="0"
              step="0.5"
              placeholder="Min"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              onBlur={applySalary}
              onKeyDown={handleSalaryKeyDown}
              aria-label="Minimum hourly pay"
              className={`w-16 px-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-400 text-gray-800 transition-colors ${
                searchParams.get("salaryMin") ? "border-brand-400 bg-brand-50" : "border-gray-300 bg-white"
              }`}
            />
            <span className="text-xs text-gray-400">–</span>
            <input
              type="number"
              min="0"
              step="0.5"
              placeholder="Max"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              onBlur={applySalary}
              onKeyDown={handleSalaryKeyDown}
              aria-label="Maximum hourly pay"
              className={`w-16 px-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-400 text-gray-800 transition-colors ${
                searchParams.get("salaryMax") ? "border-brand-400 bg-brand-50" : "border-gray-300 bg-white"
              }`}
            />
            {hasAnySalary && (
              <button
                onClick={() => {
                  setSalaryMin("");
                  setSalaryMax("");
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("salaryMin");
                  params.delete("salaryMax");
                  router.push(`/search?${params.toString()}`);
                }}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear salary filter"
                title="Clear salary"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
