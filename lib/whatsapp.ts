/**
 * WhatsApp contact constants — used across the site as the
 * primary fast-apply channel for candidates.
 *
 * To change number / message, update here only.
 */

export const WA_NUMBER  = "31649210631";
export const WA_MESSAGE = "Hi, I want to apply for a job in the Netherlands.";

/** Full WhatsApp deep-link with pre-filled message */
export const WA_LINK =
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;
