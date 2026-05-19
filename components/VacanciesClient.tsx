"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ApplyPreScreen from "@/components/ApplyPreScreen";
import {
  VACANCIES,
  CAT_LABELS,
  CAT_ICONS,
  BADGE_META,
  type Badge,
  type Category,
  type Vacancy,
} from "@/lib/vacanciesData";

const WA_BASE = "https://wa.me/31613754893";
const ALL_CATS = Object.keys(CAT_LABELS) as Category[];

export default function VacanciesClient() {
  const [search,    setSearch]    = useState("");
  const [cat,       setCat]       = useState<"all" | Category>("all");
  const [minSal,    setMinSal]    = useState(0);
  const [badge,     setBadge]     = useState<"" | Badge>("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  function toggleCat(c: string) {
    setCollapsed((prev) => ({ ...prev, [c]: !prev[c] }));
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return VACANCIES.filter((j) => {
      if (cat !== "all" && j.c !== cat) return false;
      if (minSal > 0 && j.sm < minSal) return false;
      if (badge && !(j.b as string[]).includes(badge)) return false;
      if (q && !j.t.toLowerCase().includes(q) && !j.l.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, cat, minSal, badge]);

  const byCat = useMemo(() => {
    const map: Record<string, Vacancy[]> = {};
    filtered.forEach((j) => { (map[j.c] = map[j.c] || []).push(j); });
    return map;
  }, [filtered]);

  const visibleCats = cat === "all" ? ALL_CATS : ([cat] as Category[]);

  return (
    <div className="min-h-screen bg-[#0B1F14]">
      <div className="max-w-2xl mx-auto px-4 py-8 pb-16">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400 mb-1">
            Current openings · Netherlands & Greece
          </p>
          <h1 className="text-white font-extrabold text-[26px] sm:text-[30px] leading-tight mb-2">
            Actual Jobs
          </h1>
          <p className="text-gray-400 text-[13px]">
            {VACANCIES.length} positions · EU citizens only · Immediate start
          </p>
        </div>

        {/* ── Stats strip ──────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {[
            { n: filtered.length.toString(), l: "Positions" },
            { n: "7",    l: "Categories" },
            { n: "€450+", l: "Per week" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-white/[0.07] bg-white/[0.04] py-3 text-center">
              <p className="text-emerald-400 font-extrabold text-[20px] leading-none">{s.n}</p>
              <p className="text-gray-500 text-[11px] mt-1">{s.l}</p>
            </div>
          ))}
        </div>

        {/* ── Requirements ─────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 mb-4 rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3">
          <span className="text-[12px] font-semibold text-amber-300">🇪🇺 EU citizens only</span>
          <span className="text-[12px] font-semibold text-blue-300">🌐 English required</span>
          <span className="text-[12px] font-semibold text-emerald-300">⚡ Immediate start</span>
        </div>

        {/* ── Search ───────────────────────────────────────────────── */}
        <div className="relative mb-3">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">🔍</span>
          <input
            type="text"
            placeholder="Search jobs, locations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full bg-white/[0.05] border border-white/10 rounded-xl
              text-white placeholder-gray-600 text-[14px]
              pl-10 pr-4 py-3 outline-none
              focus:border-emerald-500/50 transition-colors
            "
          />
        </div>

        {/* ── Category tabs ─────────────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-3" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setCat("all")}
            className={`flex-shrink-0 rounded-full border text-[12px] font-semibold px-3.5 py-1.5 transition-all ${
              cat === "all"
                ? "bg-emerald-500 border-emerald-500 text-[#0B1F14] font-black"
                : "border-white/10 bg-white/[0.04] text-gray-400 hover:bg-white/[0.08]"
            }`}
          >
            All
          </button>
          {ALL_CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`flex-shrink-0 rounded-full border text-[12px] font-semibold px-3.5 py-1.5 transition-all whitespace-nowrap ${
                cat === c
                  ? "bg-emerald-500 border-emerald-500 text-[#0B1F14] font-black"
                  : "border-white/10 bg-white/[0.04] text-gray-400 hover:bg-white/[0.08]"
              }`}
            >
              {CAT_ICONS[c]} {CAT_LABELS[c].split(" ")[0]}
            </button>
          ))}
        </div>

        {/* ── Filters ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <select
            value={minSal}
            onChange={(e) => setMinSal(Number(e.target.value))}
            className="bg-white/[0.05] border border-white/10 rounded-xl text-gray-300 text-[12px] px-3 py-2.5 outline-none focus:border-emerald-500/50"
          >
            <option value={0}>Any salary</option>
            <option value={400}>€400+/wk</option>
            <option value={500}>€500+/wk</option>
            <option value={600}>€600+/wk</option>
            <option value={700}>€700+/wk</option>
            <option value={800}>€800+/wk</option>
          </select>
          <select
            value={badge}
            onChange={(e) => setBadge(e.target.value as "" | Badge)}
            className="bg-white/[0.05] border border-white/10 rounded-xl text-gray-300 text-[12px] px-3 py-2.5 outline-none focus:border-emerald-500/50"
          >
            <option value="">All jobs</option>
            <option value="acc">Accommodation incl.</option>
            <option value="car">Own car needed</option>
            <option value="eng">Language req.</option>
          </select>
        </div>

        {/* ── Result count ─────────────────────────────────────────── */}
        {filtered.length !== VACANCIES.length && (
          <p className="text-gray-500 text-[12px] mb-3">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
          </p>
        )}

        {/* ── Job listings ─────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-[14px]">
            No vacancies match your filters.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {visibleCats.map((c) => {
              const jobs = byCat[c];
              if (!jobs?.length) return null;
              const isOpen = collapsed[c] !== true;

              return (
                <div key={c} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
                  {/* Category header */}
                  <button
                    onClick={() => toggleCat(c)}
                    className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 text-[11px] font-black uppercase tracking-widest">
                        {CAT_ICONS[c]} {CAT_LABELS[c]}
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-400/10 text-emerald-400 rounded-full px-2 py-0.5">
                        {jobs.length}
                      </span>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Jobs list */}
                  {isOpen && (
                    <div className="flex flex-col gap-2 px-3 pb-3">
                      {jobs.map((job) => (
                        <div
                          key={job.slug}
                          className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-3.5 py-3.5"
                        >
                          {/* Title — links to individual SEO page */}
                          <Link
                            href={`/apply/${job.slug}`}
                            className="block text-white font-semibold text-[14px] leading-snug mb-2 hover:text-emerald-300 transition-colors"
                          >
                            {job.t}
                          </Link>

                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className={`text-[11px] font-bold rounded-md px-2 py-0.5 ${
                              job.sm > 0 ? "bg-emerald-400/10 text-emerald-400" : "bg-white/[0.05] text-gray-500"
                            }`}>
                              {job.s}
                            </span>
                            <span className="text-gray-400 text-[12px]">📍 {job.l}</span>
                          </div>

                          {job.b.length > 0 && (
                            <div className="flex gap-1.5 flex-wrap mb-2.5">
                              {job.b.map((b) => (
                                <span key={b} className={`text-[10px] font-bold border rounded px-1.5 py-0.5 ${BADGE_META[b].color}`}>
                                  {BADGE_META[b].label}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Apply button — WA gate */}
                          <ApplyPreScreen
                            waBase={WA_BASE}
                            jobTitle={job.t}
                            source={`vacancies-${c}`}
                            jobId={job.slug}
                            referralMode
                          >
                            {(openFn) => (
                              <button
                                onClick={openFn}
                                className="flex items-center gap-1.5 text-emerald-400 text-[12px] font-black hover:text-emerald-300 transition-colors"
                              >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Apply on WhatsApp
                              </button>
                            )}
                          </ApplyPreScreen>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-gray-600 text-[11px] mt-8">
          All positions require EU citizenship
        </p>
      </div>
    </div>
  );
}
