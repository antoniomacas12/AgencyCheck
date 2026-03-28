/**
 * LoadingSkeleton — Reusable skeleton loading states.
 * Prevents layout shift and hydration mismatches on dynamic pages.
 *
 * Usage:
 *   <AgencyCardSkeleton />
 *   <JobListingSkeleton count={5} />
 *   <SalaryBlockSkeleton />
 *   <PageHeroSkeleton />
 */

// ─── Shimmer base ──────────────────────────────────────────────────────────────

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded ${className}`}
      style={{ backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }}
    />
  );
}

// ─── Agency card skeleton ──────────────────────────────────────────────────────

export function AgencyCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between">
        <Shimmer className="h-5 w-40 rounded" />
        <Shimmer className="h-6 w-12 rounded-full" />
      </div>
      <Shimmer className="h-3 w-24 rounded" />
      <div className="flex gap-2">
        <Shimmer className="h-5 w-20 rounded" />
        <Shimmer className="h-5 w-20 rounded" />
      </div>
      <div className="flex items-center justify-between pt-1">
        <Shimmer className="h-4 w-28 rounded" />
        <Shimmer className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

export function AgencyCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <AgencyCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Job listing skeleton ──────────────────────────────────────────────────────

export function JobListingSkeleton() {
  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <Shimmer className="h-5 w-48 rounded" />
          <Shimmer className="h-3 w-36 rounded" />
          <div className="flex gap-2 pt-1">
            <Shimmer className="h-5 w-24 rounded" />
            <Shimmer className="h-5 w-20 rounded" />
          </div>
        </div>
        <div className="text-right space-y-2 shrink-0">
          <Shimmer className="h-5 w-28 rounded" />
          <Shimmer className="h-3 w-16 rounded" />
          <Shimmer className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function JobListingSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <JobListingSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Salary block skeleton ─────────────────────────────────────────────────────

export function SalaryBlockSkeleton() {
  return (
    <div className="bg-gray-950 rounded-2xl p-6">
      <Shimmer className="h-3 w-64 rounded mb-3 bg-gray-800" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-8 w-24 bg-gray-800 animate-pulse rounded" />
            <div className="h-3 w-16 bg-gray-700 animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page hero skeleton ────────────────────────────────────────────────────────

export function PageHeroSkeleton() {
  return (
    <div className="mb-8 space-y-4">
      <Shimmer className="h-10 w-3/4 rounded" />
      <Shimmer className="h-5 w-2/3 rounded" />
      <Shimmer className="h-4 w-1/2 rounded" />
      <div className="flex flex-wrap gap-3 pt-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-28">
            <Shimmer className="h-6 w-16 rounded mb-1" />
            <Shimmer className="h-3 w-20 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Stats strip skeleton ──────────────────────────────────────────────────────

export function StatsStripSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-wrap gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
          <Shimmer className="h-6 w-16 rounded mb-1" />
          <Shimmer className="h-3 w-24 rounded" />
        </div>
      ))}
    </div>
  );
}

// ─── Review card skeleton ──────────────────────────────────────────────────────

export function ReviewCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Shimmer key={i} className="w-4 h-4 rounded" />
          ))}
        </div>
        <Shimmer className="h-3 w-20 rounded" />
      </div>
      <Shimmer className="h-4 w-full rounded" />
      <Shimmer className="h-4 w-5/6 rounded" />
      <Shimmer className="h-3 w-1/3 rounded" />
    </div>
  );
}

// ─── Inline text placeholder ───────────────────────────────────────────────────

export function InlineDataLoading({ width = "w-16" }: { width?: string }) {
  return <Shimmer className={`inline-block h-4 ${width} rounded align-middle`} />;
}

// ─── Generic full-page loading ─────────────────────────────────────────────────

export default function PageLoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <PageHeroSkeleton />
      <SalaryBlockSkeleton />
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <JobListingSkeletonList count={5} />
        </div>
        <div className="space-y-4">
          <AgencyCardSkeleton />
          <AgencyCardSkeleton />
        </div>
      </div>
    </div>
  );
}
