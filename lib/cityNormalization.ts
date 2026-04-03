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
