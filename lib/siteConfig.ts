/**
 * siteConfig.ts — Site-wide feature flags
 *
 * Change values here to toggle temporary states across the entire site.
 * No need to touch individual components or pages.
 */

// ─── Image placeholder blur ────────────────────────────────────────────────────
//
// TEMPORARY: Set to true to apply a strong blur to all site images.
// Use this while current images are pending licensing clearance.
//
// Applied via:  body.blur-placeholder-images CSS class → globals.css
// Reads from:   app/layout.tsx
//
// To disable: set this to false. All images instantly unblur across the site.
//
export const BLUR_PLACEHOLDER_IMAGES = false;
