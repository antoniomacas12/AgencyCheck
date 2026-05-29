import Link from "next/link";

/**
 * JobsUrgencyBar — replaces HotJobsBanner above the hero.
 *
 * Always-visible strip (no collapse). Shows open position count,
 * category pills, and urgency cues to push visitors toward /apply.
 * Server component — no JS needed.
 */

const CATEGORIES = [
  { label: "Warehouse",   href: "/apply?cat=warehouse",  emoji: "📦" },
  { label: "Driving",     href: "/apply?cat=driving",    emoji: "🚛" },
  { label: "Production",  href: "/apply?cat=production", emoji: "🏭" },
  { label: "Technical",   href: "/apply?cat=technical",  emoji: "🔧" },
];

export default function JobsUrgencyBar({ totalJobs }: { totalJobs: number }) {
  return (
    <div className="mb-6">
      <Link href="/apply" className="block group">
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] hover:bg-emerald-500/[0.10] transition-all duration-200 active:scale-[0.99]">
          {/* Subtle glow */}
          <div className="pointer-events-none absolute -top-8 -right-8 w-32 h-32 rounded-full bg-emerald-400/10 blur-2xl" />

          <div className="relative flex items-center gap-3.5 px-4 py-3.5 sm:px-5">
            {/* Animated live dot */}
            <span className="relative flex-shrink-0">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-25" />
              <span className="relative flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-[14px] sm:text-[15px] leading-snug">
                <span className="text-emerald-400">{totalJobs} positions open</span>
                {" · "}
                <span className="text-gray-300">EU citizens · Start next week</span>
              </p>
            </div>

            {/* Arrow */}
            <svg
              className="w-4 h-4 text-emerald-400 flex-shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </Link>

      {/* Category pills */}
      <div className="flex gap-2 mt-2.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.label}
            href={cat.href}
            className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full border border-white/[0.10] bg-white/[0.04] hover:bg-white/[0.09] px-3.5 py-1.5 text-[12px] font-semibold text-gray-300 hover:text-white transition-all duration-150"
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </Link>
        ))}
        <Link
          href="/apply"
          className="flex-shrink-0 inline-flex items-center gap-1 rounded-full border border-white/[0.10] bg-white/[0.04] hover:bg-white/[0.09] px-3.5 py-1.5 text-[12px] font-semibold text-gray-400 hover:text-white transition-all duration-150"
        >
          All jobs →
        </Link>
      </div>
    </div>
  );
}
