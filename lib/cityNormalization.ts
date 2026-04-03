/**
 * cityNormalization.ts
 *
 * Utilities for normalising city names extracted from worker comments.
 * Used to deduplicate city mentions for the AgencyCityMention table.
 */

/**
 * Converts a raw city string into a lowercase, whitespace-collapsed key
 * suitable for use as the `cityNormalized` field and as a dedup key.
 *
 * Examples:
 *   "  Rotterdam  " → "rotterdam"
 *   "Den Haag"      → "den haag"
 *   "AMSTERDAM"     → "amsterdam"
 */
export function normalizeCity(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Converts a normalised city key back to a display-friendly title-cased string.
 * Falls back gracefully if the original display name was stored separately.
 *
 * Examples:
 *   "rotterdam"  → "Rotterdam"
 *   "den haag"   → "Den Haag"
 *   "s-gravenhage" → "S-gravenhage"
 */
export function toDisplayCity(normalized: string): string {
  return normalized
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Converts a normalized city key to a URL-safe slug.
 * Spaces become hyphens; the result is already lowercase.
 *
 * Examples:
 *   "rotterdam" → "rotterdam"
 *   "den haag"  → "den-haag"
 *   "s-hertogenbosch" → "s-hertogenbosch"
 */
export function toCitySlug(normalized: string): string {
  return normalized.replace(/\s+/g, "-");
}

/**
 * Converts a URL city slug back to the normalized key used in the DB.
 * Hyphens become spaces; already lowercase.
 *
 * Examples:
 *   "rotterdam"  → "rotterdam"
 *   "den-haag"   → "den haag"
 */
export function fromCitySlug(slug: string): string {
  return slug.replace(/-/g, " ");
}
