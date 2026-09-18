"use client";

import Link from "next/link";

/**
 * FeaturedJobVerifiedPartner — Homepage featured section
 *
 * Two open vacancies via a verified recruitment partner.
 * Client name intentionally not disclosed — displays "Verified Partner" only.
 */

const JOBS = [
  {
    slug:    "warehouse-worker-verified-partner",
    title:   "Warehouse Worker (m/f)",
    salary:  "€14.99",
    tag:     "Warehouse & Logistics",
    tagColor:"bg-sky-400/10 text-sky-300 border-sky-400/25",
    location:"Netherlands",
    housing: "€149/week",
    desc:    "Order picking, packing, sorting and labelling in various Dutch warehouses. Shared accommodation included.",
    bullets: [
      "Accommodation provided — €149/week",
      "Shared/twin rooms",
      "Shifts available",
      "EU citizenship required",
    ],
  },
  {
    slug:    "food-production",
    title:   "Food Production Worker – Cheese, Meat, Salads & Sauces",
    salary:  "€14.99",
    tag:     "Food Production",
    tagColor:"bg-emerald-400/10 text-emerald-300 border-emerald-400/25",
    location:"Netherlands",
    housing: "paid",
    desc:    "Cheese production, meat packing (salami & more), salad mixing, sauces & dips (e.g. hummus). 3-shift rotation incl. nights. Cold environment: 0–10°C.",
    bullets: [
      "Accommodation paid — shared/double rooms",
      "3-shift work incl. night shifts",
      "Cold environment: 0–10°C (PPE provided)",
      "Experience preferred — not required",
    ],
  },
] as const;

export default function FeaturedJobVerifiedPartner() {
  return (
    <section className="bg-[#0B1F14] border-b border-white/[0.06]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">

        {/* ── Header ── */}
        <div className="rounded-2xl border border-white/[0.10] bg-gradient-to-br from-[#0f2318] to-[#0B1F14] px-5 sm:px-8 py-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#22C55E]">
              Open Vacancies
            </span>
            <span className="h-px flex-1 bg-white/[0.06]" />
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                2 positions open
              </span>
            </div>
          </div>

          {/* Partner label */}
          <div className="flex items-center gap-2 mb-4">
            <div className="inline-flex items-center bg-white/[0.06] border border-white/[0.09] rounded-xl px-3 py-2">
              <span className="text-white font-black text-[13px] tracking-tight">Verified Partner</span>
            </div>
            <span className="text-[11px] text-gray-500">· Recruitment partnership</span>
          </div>

          <h2 className="text-white font-extrabold text-[24px] sm:text-[30px] leading-tight mb-2">
            Warehouse & Food Production Jobs — Netherlands
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
            Two active vacancies via a verified recruitment partner. Accommodation included.
            EU citizenship required for both positions.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              "✓ Accommodation Included",
              "✓ Shifts Available",
              "✓ Stable Employment",
              "✓ Long-Term Opportunity",
              "✓ EU Citizenship Required",
            ].map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center text-[11px] font-semibold text-gray-300 bg-white/[0.05] border border-white/[0.09] rounded-full px-3 py-1.5"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* ── Job Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {JOBS.map((job) => {
            const isFoodProd = job.slug === "food-production";
            return (
              <div
                key={job.slug}
                className={`rounded-2xl border flex flex-col ${
                  isFoodProd
                    ? "border-amber-400/25 bg-amber-400/[0.03]"
                    : "border-white/[0.10] bg-white/[0.03]"
                }`}
              >
                {/* Cheese priority strip — food production only */}
                {isFoodProd && (
                  <div className="flex items-center gap-2 bg-amber-400/10 border-b border-amber-400/20 rounded-t-2xl px-5 py-2.5">
                    <span className="text-[13px]">🧀</span>
                    <span className="text-amber-300 font-black text-[11px] uppercase tracking-wider">
                      Priority hiring: Cheese Production
                    </span>
                    <span className="ml-auto shrink-0">
                      <span className="text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full px-2 py-0.5 uppercase tracking-wide">
                        Urgent demand
                      </span>
                    </span>
                  </div>
                )}

                {/* Card header */}
                <div className="px-5 pt-5 pb-4 border-b border-white/[0.07]">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="text-white font-extrabold text-[17px] leading-snug">
                        {job.title}
                      </p>
                      <p className="text-gray-500 text-[12px] mt-0.5">
                        Verified Partner · {job.location}
                      </p>
                    </div>
                    <span className={`shrink-0 text-[10px] font-bold border rounded-full px-2.5 py-1 ${job.tagColor}`}>
                      {job.tag}
                    </span>
                  </div>

                  {/* Salary */}
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-[#22C55E] font-black text-[26px] leading-none">{job.salary}</span>
                    <span className="text-gray-500 text-[12px]">/hr gross</span>
                  </div>

                  <p className="text-gray-400 text-[13px] leading-relaxed">{job.desc}</p>
                </div>

                {/* Bullets */}
                <div className="px-5 py-4 border-b border-white/[0.07] flex-1">
                  <ul className="space-y-2">
                    {isFoodProd && (
                      <li className="flex items-start gap-2 text-[13px] text-amber-200">
                        <span className="text-amber-400 shrink-0 font-bold mt-0.5">🧀</span>
                        Cheese production: cutting, handling, packing — night shifts available, better pay via shift allowances
                      </li>
                    )}
                    {job.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[13px] text-gray-300">
                        <span className="text-[#22C55E] shrink-0 font-bold mt-0.5">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="px-5 py-4 flex flex-col gap-2">
                  <Link
                    href={`/apply/${job.slug}`}
                    className={`w-full inline-flex items-center justify-center gap-2 font-bold text-sm px-5 py-3 rounded-xl transition-colors active:scale-[0.98] ${
                      isFoodProd
                        ? "bg-red-500 hover:bg-red-400 text-white"
                        : "bg-[#22C55E] hover:bg-green-400 text-white"
                    }`}
                  >
                    {isFoodProd ? "🧀 View Cheese & Food Jobs →" : "View & Apply →"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer note ── */}
        <p className="text-center text-gray-600 text-[11px]">
          AgencyCheck · Real data. Real experiences. · EU work authorisation required for both positions.
        </p>

      </div>
    </section>
  );
}
