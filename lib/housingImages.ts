// ─── AgencyCheck — Housing Image Metadata ────────────────────────────────────
// Maps agency slugs to their curated set of public housing images.
// Images live at /public/images/housing/[slug]/[nn].webp
// All images were sourced from worker-submitted documentation and curated
// to remove TikTok cover slides, duplicate frames, and unidentifiable content.
//
// Total: 17 agencies · 293 images

export interface HousingImage {
  /** Public path for use in <img src="..." /> or next/image */
  src:  string;
  /** Human-readable label (e.g. "Bedroom", "Bathroom") — derived from index */
  alt:  string;
}

// ─── Image counts per agency (derived from processed output) ─────────────────

const AGENCY_IMAGE_COUNTS: Record<string, number> = {
  "ab-groep":                    9,
  "ab-midden":                   9,
  "carriere-uitzendbureau":     11,
  "contrain":                   23,
  "covebo":                     25,
  "e-a-uitzendbureau":          29,
  "eg-personeel":               14,
  "eurojob":                    26,
  "fix-team":                   26,
  "hellojob-watchout":          13,
  "jts-work":                   14,
  "level-one":                  11,
  "otto-workforce":             28,
  "ruigrok":                    10,
  "select-uitzendbureau":       16,
  "uitbeenbedrijf-rien-vanoss": 15,
  "up-force":                   14,
};

// ─── Build image list for a given agency slug ─────────────────────────────────

export function getHousingImages(slug: string): HousingImage[] {
  const count = AGENCY_IMAGE_COUNTS[slug];
  if (!count) return [];

  return Array.from({ length: count }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return {
      src: `/images/housing/${slug}/${n}.webp`,
      alt: `Housing photo ${i + 1} — ${slug}`,
    };
  });
}

// ─── Preview thumbnail (first image only) ────────────────────────────────────

export function getHousingPreview(slug: string): HousingImage | null {
  const count = AGENCY_IMAGE_COUNTS[slug];
  if (!count) return null;
  return {
    src: `/images/housing/${slug}/01.webp`,
    alt: `Housing preview — ${slug}`,
  };
}

// ─── Slugs that have housing images ──────────────────────────────────────────

export const HOUSING_IMAGE_SLUGS = Object.keys(AGENCY_IMAGE_COUNTS);

// ─── Total image count across all agencies ───────────────────────────────────

export const HOUSING_IMAGE_TOTAL = Object.values(AGENCY_IMAGE_COUNTS).reduce(
  (sum, n) => sum + n,
  0,
);
