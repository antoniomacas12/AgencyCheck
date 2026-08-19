/**
 * Analytics helpers — thin wrappers around Vercel Analytics track().
 *
 * - Safe: no-op if this runs server-side or track is unavailable.
 * - Typed: each event has typed params so callers can't send junk keys.
 * - Tree-shakeable: only the events you import end up in the bundle.
 *
 * GA4 / Google Analytics has been removed. All custom conversion events
 * now use Vercel Analytics custom events (privacy-friendly, cookieless).
 */

import { track as vercelTrack } from "@vercel/analytics";

/** Internal fire-and-forget wrapper. Never throws. */
function fireEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (typeof window === "undefined") return; // SSR guard
  try {
    vercelTrack(eventName, params as Record<string, string>);
  } catch {
    // Silently swallow — analytics must never break the application
  }
}

// ─── Public event trackers ────────────────────────────────────────────────────

/**
 * Fired when a user clicks any "Apply on WhatsApp" button.
 * Use source to distinguish which button was clicked.
 */
export function trackWhatsappClick(params?: {
  vacancy_title?: string;
  vacancy_slug?: string;
  /** Where on the page the button lives */
  source?: "featured_card" | "apply_form" | "job_alert_strip" | "vacancy_page";
}) {
  fireEvent("whatsapp_click", {
    event_category: "engagement",
    ...params,
  });
}

/**
 * Fired when a user clicks "Apply Now" / "Apply via AgencyCheck" and
 * navigates to the apply page (or sticky bar).
 */
export function trackApplyJobClick(params?: {
  vacancy_title?: string;
  vacancy_slug?: string;
  source?: "sticky_bar" | "hero_cta" | "final_cta" | "featured_card";
}) {
  fireEvent("apply_job_click", {
    event_category: "engagement",
    ...params,
  });
}

/**
 * Fired when the multi-step homepage lead form is successfully submitted
 * (after POST /api/leads returns 200).
 */
export function trackCandidateFormSubmit(params?: {
  job_type?: string;
  country?: string;
  contact_method?: "phone" | "email";
}) {
  fireEvent("candidate_form_submit", {
    event_category: "conversion",
    ...params,
  });
}

/**
 * Fired when a worker review is successfully submitted
 * (after POST /api/reviews returns 200).
 */
export function trackReviewSubmit(params?: {
  agency_slug?: string;
  review_type?: string;
  overall_rating?: number;
}) {
  fireEvent("review_submit", {
    event_category: "conversion",
    ...params,
  });
}
