/**
 * JobListCard
 *
 * Shared Server Component — renders one job listing card for any page that
 * iterates over JOB_LISTINGS (otto-workforce-jobs, reach-truck-jobs,
 * order-picker-jobs, jobs-amsterdam, jobs-eindhoven, jobs-rotterdam, etc.).
 *
 * Key readability improvements over inline cards:
 *  - border-gray-200  (was border-gray-100 — nearly invisible on bg-gray-50)
 *  - text-[15px] title (was text-sm)
 *  - text-sm location  (was text-xs text-gray-500)
 *  - salary badge with border-green-200 (was border-green-100)
 *  - housing/transport chips at text-xs font-medium (were text-[10px])
 */

import Link from "next/link";
import type { JobListing } from "@/lib/jobData";

interface Props {
  job: JobListing;
}

export default function JobListCard({ job }: Props) {
  const sal =
    job.salaryMin > 0
      ? `€${job.salaryMin.toFixed(2)}${
          job.salaryMax > job.salaryMin ? `–${job.salaryMax.toFixed(2)}` : ""
        }/hr`
      : null;

  return (
    <Link href={`/jobs/${job.slug}`} className="group block">
      <article className="bg-white border border-gray-200 rounded-xl p-4 hover:border-brand-300 hover:shadow-md transition-all duration-150 flex items-start gap-3">
        {/* Emoji icon */}
        <span className="text-2xl shrink-0 mt-0.5" aria-hidden="true">
          {job.icon}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title + salary row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-[15px] font-semibold text-gray-900 group-hover:text-brand-700 leading-snug">
              {job.title}
            </h3>
            {sal && (
              <span className="shrink-0 text-sm font-bold text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1 tabular-nums">
                {sal}
              </span>
            )}
          </div>

          {/* Location + agency */}
          <p className="text-sm text-gray-600">
            📍 {job.city}
            {job.agencyName && (
              <span className="text-gray-400"> · {job.agencyName}</span>
            )}
          </p>

          {/* Chips + CTA */}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {job.housing === "YES" && (
              <span className="text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-full px-2.5 py-1">
                🏠 Housing
              </span>
            )}
            {job.transport === "YES" && (
              <span className="text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-1">
                🚌 Transport
              </span>
            )}
            <span className="ml-auto text-xs font-medium text-gray-400 group-hover:text-brand-600 transition-colors">
              View job →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
