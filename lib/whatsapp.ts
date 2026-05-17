/**
 * WhatsApp contact constants — used across the site as the
 * primary fast-apply channel for candidates.
 *
 * To change number / message, update here only.
 */

export const WA_NUMBER  = "31613754893";
export const WA_MESSAGE = "Hi, I want to apply for a job in the Netherlands.";

/** Full WhatsApp deep-link with pre-filled message */
export const WA_LINK =
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;

/**
 * Build a WhatsApp apply link with source tracking appended to the message.
 * This lets you see exactly which page/position each applicant came from.
 *
 * @param jobTitle  — shown to the applicant in the pre-filled text
 * @param source    — short slug to identify the source (e.g. "reachtruck", "food-production")
 *
 * Example message sent:
 *   "Hi, I want to apply for: C+E Truck Driver (Dordrecht, NL) [src:reachtruck]"
 */
export function buildApplyLink(jobTitle: string, source: string): string {
  const text = `Hi, I want to apply for: ${jobTitle} [src:${source}]`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Build a job alert subscription link with source tracking.
 */
export function buildAlertLink(experience: string, source: string): string {
  const text = `Hi, please add me to your job alerts list.\nMy experience: ${experience}\nI'm looking for work in the Netherlands. [src:${source}]`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}
