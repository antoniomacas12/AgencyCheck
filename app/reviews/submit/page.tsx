"use client";

/**
 * /reviews/submit?agency=<slug>
 * Standalone review submission page — used from links like
 * "Write a review for Randstad" → /reviews/submit?agency=randstad
 */

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { ReviewSubmitForm } from "@/components/ReviewSubmitForm";

function SubmitPageInner() {
  const params     = useSearchParams();
  const agencySlug = params.get("agency") ?? "";
  const agencyName = params.get("name") ?? agencySlug;

  if (!agencySlug) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-sm mb-4">
          No agency specified. Please go to an agency page and click "Write a review" there.
        </p>
        <Link href="/agencies" className="text-blue-600 hover:underline text-sm">
          Browse agencies →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <nav className="text-xs text-gray-400 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link href="/agencies" className="hover:text-blue-600">Agencies</Link>
        <span>/</span>
        <Link href={`/agencies/${agencySlug}`} className="hover:text-blue-600">
          {agencyName}
        </Link>
        <span>/</span>
        <span className="text-gray-600">Write a review</span>
      </nav>

      <ReviewSubmitForm agencySlug={agencySlug} agencyName={agencyName} />
    </div>
  );
}

export default function ReviewSubmitPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading…</div>}>
      <SubmitPageInner />
    </Suspense>
  );
}
