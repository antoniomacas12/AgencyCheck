"use client";

/**
 * PublishedReviewCard — displays a single published review on an agency page.
 * Shows rating, tags, comment, and any approved photos.
 */

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReviewPhoto {
  id:        string;
  fileUrl:   string;
  fileType:  string;
  caption?:  string | null;
  sortOrder: number;
}

export interface ReviewMentionChip {
  id:            string;
  extractedName: string;
  confidence:    number;
  autoCreated:   boolean;
  agency: { slug: string; name: string };
}

export interface PublishedReview {
  id:                    string;
  city?:                 string | null;
  jobType?:              string | null;
  title?:                string | null;
  overallRating:         number;
  salaryRating?:         number | null;
  housingRating?:        number | null;
  managementRating?:     number | null;
  contractClarityRating?: number | null;
  transportRating?:      number | null;
  salaryAccuracyRating?: number | null;
  accommodationProvided?: string;
  roomType?:             string;
  weeklyRent?:           number | null;
  peopleInHouse?:        number | null;
  wouldRecommend?:       string;
  workerStatus?:         string;
  experiencePeriod?:     string | null;
  comment?:              string | null;
  issueTags?:            string[];
  createdAt:             string;
  photos:                ReviewPhoto[];
  mentions?:             ReviewMentionChip[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Stars({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "text-base" : "text-lg";
  return (
    <span className={`${cls} leading-none`}>
      <span className="text-yellow-400">{"★".repeat(Math.round(rating))}</span>
      <span className="text-gray-200">{"★".repeat(5 - Math.round(rating))}</span>
    </span>
  );
}

function RatingPill({ label, value }: { label: string; value: number }) {
  const color =
    value >= 4 ? "bg-green-50 text-green-700 border-green-100" :
    value >= 3 ? "bg-yellow-50 text-yellow-700 border-yellow-100" :
                 "bg-red-50 text-red-700 border-red-100";
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${color}`}>
      {label}: {value}/5
    </span>
  );
}

function HousingTag({ value }: { value: string }) {
  const map: Record<string, string> = {
    YES:     "✅ Housing provided",
    NO:      "🏠 Own housing",
    UNKNOWN: "",
    PRIVATE: "🚪 Private room",
    SHARED:  "🛏 Shared room",
    YES_REC: "👍 Would recommend",
    NO_REC:  "👎 Would not recommend",
  };
  if (!map[value]) return null;
  return (
    <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-medium">
      {map[value]}
    </span>
  );
}

// ─── Photo lightbox ───────────────────────────────────────────────────────────

function PhotoStrip({ photos }: { photos: ReviewPhoto[] }) {
  const [open, setOpen] = useState<number | null>(null);

  if (photos.length === 0) return null;

  return (
    <>
      <div className="flex gap-2 flex-wrap mt-3">
        {photos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setOpen(i)}
            className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 hover:opacity-80 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="View photo"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- user-uploaded photo with dynamic URL; next/image requires known dimensions */}
            <img
              src={p.fileUrl}
              alt={p.caption ?? "Review photo"}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {open !== null && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setOpen(null)}
        >
          <div
            className="relative max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- user-uploaded photo lightbox; next/image requires known dimensions */}
            <img
              src={photos[open].fileUrl}
              alt={photos[open].caption ?? "Review photo"}
              className="w-full rounded-xl object-contain max-h-[80vh]"
            />
            {photos.length > 1 && (
              <div className="flex justify-between mt-3">
                <button
                  onClick={() => setOpen((o) => (o! > 0 ? o! - 1 : photos.length - 1))}
                  className="text-white bg-black/40 hover:bg-black/60 rounded-lg px-4 py-2 text-sm"
                >
                  ← Prev
                </button>
                <span className="text-white/60 text-sm self-center">
                  {open + 1} / {photos.length}
                </span>
                <button
                  onClick={() => setOpen((o) => (o! < photos.length - 1 ? o! + 1 : 0))}
                  className="text-white bg-black/40 hover:bg-black/60 rounded-lg px-4 py-2 text-sm"
                >
                  Next →
                </button>
              </div>
            )}
            <button
              onClick={() => setOpen(null)}
              className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black/70 rounded-full w-8 h-8 flex items-center justify-center text-lg leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Main card ────────────────────────────────────────────────────────────────

export function PublishedReviewCard({ review }: { review: PublishedReview }) {
  const [expanded, setExpanded] = useState(false);
  const needsTruncate = (review.comment?.length ?? 0) > 300;

  const displayDate = new Date(review.createdAt).toLocaleDateString("en-GB", {
    month: "short",
    year:  "numeric",
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 space-y-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Stars rating={review.overallRating} />
            <span className="text-sm font-bold text-gray-900">{review.overallRating}/5</span>
            {review.city && (
              <span className="text-xs text-gray-500">📍 {review.city}</span>
            )}
            {review.jobType && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {review.jobType}
              </span>
            )}
          </div>
          {review.title && (
            <p className="text-sm font-semibold text-gray-800">&quot;{review.title}&quot;</p>
          )}
        </div>
        <div className="text-xs text-gray-400 shrink-0">{displayDate}</div>
      </div>

      {/* Tags row */}
      <div className="flex flex-wrap gap-1.5">
        {review.accommodationProvided && review.accommodationProvided !== "UNKNOWN" && (
          <HousingTag value={review.accommodationProvided} />
        )}
        {review.roomType && review.roomType !== "UNKNOWN" && (
          <HousingTag value={review.roomType} />
        )}
        {review.wouldRecommend === "YES" && <HousingTag value="YES_REC" />}
        {review.wouldRecommend === "NO"  && <HousingTag value="NO_REC" />}
        {review.weeklyRent != null && (
          <span className="text-xs bg-orange-50 text-orange-700 border border-orange-100 px-2 py-0.5 rounded-full font-medium">
            💶 €{review.weeklyRent}/wk rent
          </span>
        )}
        {review.peopleInHouse != null && (
          <span className="text-xs bg-gray-50 text-gray-600 border border-gray-100 px-2 py-0.5 rounded-full">
            {review.peopleInHouse} people in house
          </span>
        )}
      </div>

      {/* Sub-ratings */}
      <div className="flex flex-wrap gap-1.5">
        {review.salaryRating         != null && <RatingPill label="Salary"   value={review.salaryRating} />}
        {review.housingRating        != null && <RatingPill label="Housing"  value={review.housingRating} />}
        {review.managementRating     != null && <RatingPill label="Mgmt"     value={review.managementRating} />}
        {review.contractClarityRating != null && <RatingPill label="Contract" value={review.contractClarityRating} />}
        {review.transportRating      != null && <RatingPill label="Transport" value={review.transportRating} />}
        {review.salaryAccuracyRating != null && <RatingPill label="Pay accuracy" value={review.salaryAccuracyRating} />}
      </div>

      {/* Comment */}
      {review.comment && (
        <div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {needsTruncate && !expanded
              ? review.comment.slice(0, 300) + "…"
              : review.comment}
          </p>
          {needsTruncate && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="text-xs text-blue-600 hover:underline mt-1"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      )}

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <PhotoStrip photos={review.photos} />
      )}

      {/* Mentioned agencies */}
      {review.mentions && review.mentions.length > 0 && (
        <div className="pt-2 border-t border-gray-100">
          <p className="text-[11px] text-gray-400 mb-1.5">Also mentioned in this review:</p>
          <div className="flex flex-wrap gap-1.5">
            {review.mentions.map((m) => (
              <a
                key={m.id}
                href={`/agency/${m.agency.slug}`}
                className="text-xs bg-gray-50 text-gray-600 border border-gray-200 px-2.5 py-0.5 rounded-full hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-colors"
              >
                {m.agency.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
