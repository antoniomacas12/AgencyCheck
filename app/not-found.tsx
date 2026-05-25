// app/not-found.tsx — Custom 404 page

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | AgencyCheck",
  description: "The page you're looking for doesn't exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      {/* Status */}
      <p className="text-[#22C55E] font-bold text-sm uppercase tracking-widest mb-4">
        404 · Page not found
      </p>

      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
        This page doesn&apos;t exist
      </h1>
      <p className="text-gray-500 text-base max-w-md mb-10">
        The link may be broken, or the page may have been removed.
        Here are some useful places to go instead:
      </p>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md mb-10">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-gray-200 hover:border-[#22C55E] hover:bg-green-50 transition-all text-left"
        >
          <span className="text-xl">🏠</span>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Homepage</p>
            <p className="text-gray-400 text-xs">Agency reviews &amp; tools</p>
          </div>
        </Link>

        <Link
          href="/apply"
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition-all text-left"
        >
          <span className="text-xl">🔥</span>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Now Hiring</p>
            <p className="text-gray-400 text-xs">Open positions in the Netherlands</p>
          </div>
        </Link>

        <Link
          href="/agencies"
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-gray-200 hover:border-[#22C55E] hover:bg-green-50 transition-all text-left"
        >
          <span className="text-xl">🏢</span>
          <div>
            <p className="font-semibold text-gray-900 text-sm">All Agencies</p>
            <p className="text-gray-400 text-xs">Ratings &amp; reviews</p>
          </div>
        </Link>

        <Link
          href="/reviews"
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-gray-200 hover:border-[#22C55E] hover:bg-green-50 transition-all text-left"
        >
          <span className="text-xl">⭐</span>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Worker Reviews</p>
            <p className="text-gray-400 text-xs">Real experiences</p>
          </div>
        </Link>

        <Link
          href="/tools/real-income-calculator"
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-gray-200 hover:border-[#22C55E] hover:bg-green-50 transition-all text-left sm:col-span-2"
        >
          <span className="text-xl">🧮</span>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Real Income Calculator</p>
            <p className="text-gray-400 text-xs">See your actual take-home pay</p>
          </div>
        </Link>
      </div>

      {/* Tagline */}
      <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
        AgencyCheck · Check &amp; Hire.
      </p>
    </div>
  );
}
