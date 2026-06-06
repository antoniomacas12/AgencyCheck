/**
 * Analytics helpers — thin wrappers around GA4 gtag().
 *
 * - Safe: no-op if GA script is blocked, not loaded, or this runs server-side.
 * - Typed: each event has typed params so callers can't send junk keys.
 * - Tree-shakeable: only the events you import end up in the bundle.
 */

// Extend Window so TypeScript knows gtag may exist
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Internal fire-and-forget wrapper. Never throws. */
function fireEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (typeof window === "undefined") return; // SSR guard
  if (typeof window.gtag !== "function") return; // GA blocked or not loaded
  window.gtag("event", eventName, params);
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
