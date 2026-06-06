import Link from "next/link";

const JOBS = [
  {
    icon: "🏗️",
    title: "Reachtruck Driver",
    salary: "€16.24/hour",
    city: "Tiel",
    housing: "Included",
    tag: "Cert required",
    href: "/jobs/reachtruck-driver-tiel",
    color: "from-blue-600/20 to-blue-500/5",
    border: "border-blue-500/20",
    tagColor: "bg-blue-500/15 text-blue-300 border-blue-500/20",
  },
  {
    icon: "📦",
    title: "Warehouse Worker",
    salary: "€14.71/hour",
    city: "Tiel",
    housing: "Included",
    tag: "No experience",
    href: "/jobs/forklift-warehouse-worker-tiel",
    color: "from-emerald-600/20 to-emerald-500/5",
    border: "border-emerald-500/20",
    tagColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  },
  {
    icon: "🏭",
    title: "Production Operator",
    salary: "€14.71–€16.00/hour",
    city: "Tiel",
    housing: "Included",
    tag: "Shifts available",
    href: "/partner-vacancies",
    color: "from-amber-600/20 to-amber-500/5",
    border: "border-amber-500/20",
    tagColor: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  },
  {
    icon: "🔧",
    title: "Forklift Operator",
    salary: "€15.00–€16.50/hour",
    city: "Tiel",
    housing: "Included",
    tag: "Cert required",
    href: "/jobs/forklift-warehouse-worker-tiel",
    color: "from-purple-600/20 to-purple-500/5",
    border: "border-purple-500/20",
    tagColor: "bg-purple-500/15 text-purple-300 border-purple-500/20",
  },
];

export default function JobsWithAccommodationSection() {
  return (
    <section id="jobs-accommodation" className="bg-[#0B1F14] border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.04] px-3 py-1 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold tracking-widest uppercase text-gray-400">Jobs with accommodation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Housing included with every job
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl">
            All positions below include SNF-certified accommodation. No apartment hunting, no upfront deposit.
          </p>
        </div>

        {/* Job cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {JOBS.map((job) => (
            <Link
              key={job.title}
              href={job.href}
              className={`group block rounded-2xl border ${job.border} bg-gradient-to-b ${job.color} p-5 hover:scale-[1.02] active:scale-[0.99] transition-all duration-150`}
            >
              {/* Icon + title */}
              <div className="text-3xl mb-3">{job.icon}</div>
              <h3 className="text-white font-bold text-[15px] leading-snug mb-1">{job.title}</h3>

              {/* Salary */}
              <p className="text-emerald-400 font-black text-[18px] mb-3">{job.salary}</p>

              {/* Meta */}
              <div className="flex flex-col gap-1.5 mb-4">
                <div className="flex items-center gap-2 text-[12px] text-gray-400">
                  <span>📍</span>
                  <span>{job.city}, Netherlands</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-gray-400">
                  <span>🏠</span>
                  <span>Accommodation {job.housing}</span>
                </div>
              </div>

              {/* Tag + arrow */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center text-[11px] font-semibold rounded-full border px-2.5 py-0.5 ${job.tagColor}`}>
                  {job.tag}
                </span>
                <svg
                  className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-150"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Browse all */}
        <div className="mt-6 text-center">
          <Link
            href="/partner-vacancies"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-150 font-semibold"
          >
            View all available positions
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
