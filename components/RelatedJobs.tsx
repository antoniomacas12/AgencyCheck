import Link from "next/link";

// ─── All available jobs ────────────────────────────────────────────────────────
// When you add a new job page, add it here too.
export const ALL_JOBS = [
  {
    id: "reachtruck",
    title: "C+E Truck Driver",
    location: "Dordrecht, NL",
    tag: "Direct contract",
    tagColor: "text-blue-400 border-blue-400/30",
    href: "/apply/reachtruck",
    applicants: 18,
  },
  {
    id: "food-production",
    title: "Food Production Operator",
    location: "Netherlands",
    tag: "Fast placement",
    tagColor: "text-emerald-400 border-emerald-400/30",
    href: "/apply/food-production",
    applicants: 34,
  },
  {
    id: "production-worker-maastricht",
    title: "Production Worker / Picker",
    location: "Near Maastricht, NL",
    tag: "€16.12/hr",
    tagColor: "text-amber-400 border-amber-400/30",
    href: "/apply/production-worker-maastricht",
    applicants: 27,
  },
  {
    id: "warehouse",
    title: "Warehouse Worker",
    location: "Netherlands",
    tag: "Housing available",
    tagColor: "text-purple-400 border-purple-400/30",
    href: "/apply/warehouse",
    applicants: 41,
  },
];

interface Props {
  currentId: string; // exclude current job from the list
}

export default function RelatedJobs({ currentId }: Props) {
  const related = ALL_JOBS.filter((j) => j.id !== currentId).slice(0, 3);

  return (
    <div className="mt-16 pt-10 border-t border-white/10">
      <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-5">
        Other open positions
      </p>

      <div className="flex flex-col gap-3">
        {related.map((job) => {
          const card = (
            <div className="group flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] active:scale-[0.98] px-4 py-4 transition-all duration-150">
              {/* Left */}
              <div className="min-w-0 flex-1">
                <p className="text-white font-semibold text-[14px] leading-tight">
                  {job.title}
                </p>
                <p className="text-gray-500 text-[12px] mt-0.5">
                  📍 {job.location} · <span className="text-gray-400">{job.applicants} applied this week</span>
                </p>
              </div>

              {/* Right */}
              <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
                <span className={`text-[10px] font-bold border rounded-full px-2 py-0.5 ${job.tagColor} bg-transparent`}>
                  {job.tag}
                </span>
                <span className="text-[12px] font-bold text-gray-400 group-hover:text-emerald-400 flex items-center gap-1 transition-colors">
                  View
                  <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>
            </div>
          );

          return job.external ? (
            <a key={job.id} href={job.href} target="_blank" rel="noopener noreferrer">
              {card}
            </a>
          ) : (
            <Link key={job.id} href={job.href}>
              {card}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
