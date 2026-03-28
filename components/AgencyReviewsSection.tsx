"use client";

/**
 * AgencyReviewsSection — fetches and renders published reviews for an agency.
 * Also shows the review submission form.
 * Used on /agencies/[slug] and /agencies/[slug]/reviews pages.
 */

import { useState, useEffect } from "react";
import { PublishedReviewCard, type PublishedReview } from "./PublishedReviewCard";
import { ReviewSubmitForm } from "./ReviewSubmitForm";

interface AgencyReviewsSectionProps {
  agencySlug:  string;
  agencyName?: string;
}

export function AgencyReviewsSection({ agencySlug, agencyName }: AgencyReviewsSectionProps) {
  const [reviews, setReviews]       = useState<PublishedReview[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  async function loadReviews() {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?agencySlug=${encodeURIComponent(agencySlug)}&limit=20`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setReviews(data.reviews ?? []);
    } catch {
      // silently ignore — non-critical
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadReviews(); }, [agencySlug]);

  function handleSuccess() {
    setShowForm(false);
    setSubmitted(true);
  }

  // Average rating from published reviews
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.overallRating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <section className="mt-10">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Worker reviews
            {avgRating && (
              <span className="ml-2 text-lg font-normal text-yellow-500">
                ★ {avgRating}
              </span>
            )}
          </h2>
          {reviews.length > 0 && (
            <p className="text-xs text-gray-500 mt-0.5">
              {reviews.length} published review{reviews.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        {!showForm && !submitted && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition"
          >
            + Write a review
          </button>
        )}
      </div>

      {/* Submission success banner */}
      {submitted && !showForm && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
          ✅ Your review has been submitted and is pending moderation. Thank you!
        </div>
      )}

      {/* Review form */}
      {showForm && (
        <div className="mb-6">
          <ReviewSubmitForm
            agencySlug={agencySlug}
            agencyName={agencyName}
            onSuccess={handleSuccess}
          />
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="mt-2 text-xs text-gray-400 hover:text-gray-600"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 px-6 py-10 text-center">
          <p className="text-sm text-gray-500">
            No published reviews yet.{" "}
            {!showForm && !submitted && (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="text-blue-600 hover:underline"
              >
                Be the first to share your experience.
              </button>
            )}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <PublishedReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </section>
  );
}
