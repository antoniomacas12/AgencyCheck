"use client";

/**
 * QuickRateButton — inline modal trigger for reviewing an agency.
 * Renders as a small pill button; clicking opens ReviewModal directly
 * without any page navigation or redirect.
 *
 * Use this inside server components that need a review CTA
 * (e.g. AgencyCard) — client components can be rendered by server components.
 */

import ReviewModal from "./ReviewModal";

interface Props {
  agencySlug:   string;
  agencyName:   string;
  reviewCount?: number;
  /** Display style: "pill" (default, compact) or "block" (full-width) */
  variant?: "pill" | "block";
}

export default function QuickRateButton({
  agencySlug,
  agencyName,
  reviewCount = 0,
  variant = "pill",
}: Props) {
  // ReviewModal handles all open/close state internally.
  // fullWidth=true → block button, false → inline pill
  return (
    <ReviewModal
      agencySlug={agencySlug}
      agencyName={agencyName}
      reviewCount={reviewCount}
      fullWidth={variant === "block"}
      variant={variant === "pill" ? "pill" : "default"}
    />
  );
}
