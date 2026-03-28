"use client";

/**
 * SmartSearch — Autocomplete search for AgencyCheck homepage.
 * Provides live suggestions across agencies, cities, and job types.
 * Navigates directly to the relevant page when a suggestion is selected.
 */

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SearchSuggestion {
  type:      "agency" | "city" | "job";
  label:     string;
  sublabel?: string;
  href:      string;
}

interface SmartSearchProps {
  suggestions: SearchSuggestion[];
  size?:       "default" | "large";
  placeholder?: string;
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

/**
 * Score a suggestion against a query string.
 * Returns 0 if no match, higher = better.
 *
 * Priority order (matches task spec):
 *   1. Exact agency name match       → 1000
 *   2. Agency name starts with query → 800
 *   3. Agency name contains query    → 600
 *   4. City match (starts with)      → 400
 *   5. City match (contains)         → 300
 *   6. Job match (starts with)       → 200
 *   7. Job match (contains)          → 100
 */
function scoreSuggestion(s: SearchSuggestion, q: string): number {
  const label = s.label.toLowerCase();
  const exact  = label === q;
  const starts = label.startsWith(q);
  const has    = label.includes(q);

  if (!has && !exact) return 0;

  if (s.type === "agency") {
    if (exact)  return 1000;
    if (starts) return 800;
    return 600;
  }
  if (s.type === "city") {
    if (exact)  return 450;
    if (starts) return 400;
    return 300;
  }
  // job
  if (exact)  return 250;
  if (starts) return 200;
  return 100;
}

// ─── Type tag colours ─────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<SearchSuggestion["type"], { label: string; cls: string }> = {
  agency: { label: "Agency", cls: "text-brand-700 bg-brand-50 ring-brand-200" },
  city:   { label: "City",   cls: "text-green-700 bg-green-50 ring-green-200" },
  job:    { label: "Job",    cls: "text-amber-700 bg-amber-50 ring-amber-200"  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function SmartSearch({
  suggestions,
  size        = "default",
  placeholder = "Search agency, city or job",
}: SmartSearchProps) {
  const router       = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);

  const [query,     setQuery]     = useState("");
  const [open,      setOpen]      = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  // ── Filtered + ranked suggestions ──────────────────────────────────────────
  const results = useMemo<SearchSuggestion[]>(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    return suggestions
      .map((s) => ({ s, score: scoreSuggestion(s, q) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 9)
      .map(({ s }) => s);
  }, [query, suggestions]);

  // Reset active index whenever results change
  useEffect(() => {
    setActiveIdx(-1);
  }, [results]);

  // Close dropdown on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const navigateTo = useCallback((s: SearchSuggestion) => {
    setQuery(s.label);
    setOpen(false);
    router.push(s.href);
  }, [router]);

  // ── Keyboard handler ───────────────────────────────────────────────────────
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIdx((i) => (i < results.length - 1 ? i + 1 : i));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i > 0 ? i - 1 : 0));
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      setActiveIdx(-1);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (open && activeIdx >= 0 && results[activeIdx]) {
        navigateTo(results[activeIdx]);
      } else if (query.trim()) {
        setOpen(false);
        router.push(`/search?job=${encodeURIComponent(query.trim())}`);
      }
    }
  }

  // ── Input change ───────────────────────────────────────────────────────────
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setOpen(true);
  }

  const showDropdown = open && results.length > 0;
  const isLarge      = size === "large";

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="relative w-full">

      {/* ── Input ── */}
      <div className="relative">
        <span
          aria-hidden
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none select-none text-base"
        >
          🔍
        </span>
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onFocus={() => { if (query.trim()) setOpen(true); }}
          onKeyDown={handleKeyDown}
          className={[
            "w-full bg-white border border-gray-200 rounded-xl text-gray-900",
            "placeholder:text-gray-400 focus:outline-none focus:ring-2",
            "focus:ring-brand-500 focus:border-transparent transition-shadow",
            "pl-11 pr-4",
            isLarge ? "py-4 text-base" : "py-3 text-sm",
          ].join(" ")}
        />
        {/* Clear button */}
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onMouseDown={(e) => { e.preventDefault(); setQuery(""); setOpen(false); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Dropdown ── */}
      {showDropdown && (
        <div
          role="listbox"
          className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
        >
          {results.map((s, i) => {
            const tc      = TYPE_CONFIG[s.type];
            const isActive = i === activeIdx;
            return (
              <button
                key={`${s.type}-${s.href}`}
                role="option"
                aria-selected={isActive}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); navigateTo(s); }}
                onMouseEnter={() => setActiveIdx(i)}
                className={[
                  "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                  isActive ? "bg-brand-50" : "hover:bg-gray-50",
                ].join(" ")}
              >
                {/* Type badge */}
                <span className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ring-1 ${tc.cls}`}>
                  {tc.label}
                </span>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{s.label}</p>
                  {s.sublabel && (
                    <p className="text-xs text-gray-400 truncate">{s.sublabel}</p>
                  )}
                </div>
                {/* Arrow */}
                <span className="shrink-0 text-gray-300 text-xs">→</span>
              </button>
            );
          })}

          {/* "Search all" fallback row */}
          <div className="border-t border-gray-100 px-4 py-2.5 bg-gray-50">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setOpen(false);
                if (query.trim()) router.push(`/search?job=${encodeURIComponent(query.trim())}`);
              }}
              className="text-xs text-brand-600 hover:underline"
            >
              Search all results for &ldquo;{query}&rdquo; →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
