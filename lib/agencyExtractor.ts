/**
 * agencyExtractor.ts
 *
 * Extracts agency names from free-text review comments.
 * Two-phase approach:
 *   Phase 1 — scan the text for known agency names (static dataset).
 *   Phase 2 — extract capitalized candidate phrases not in the blocklist,
 *              then fuzzy-match against known agencies or flag as new.
 *
 * Returns an array of ExtractionResult objects ready for DB insertion.
 */

import { VERIFIED_AGENCIES } from "@/data/agencies";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ExtractionResult {
  extractedName:   string;           // raw text fragment from comment
  matchedName:     string;           // canonical agency name (may differ from extracted)
  matchedSlug:     string | null;    // slug of existing agency, null if new
  detectionMethod: "exact_match" | "fuzzy_match" | "text_extraction";
  confidence:      number;           // 0–100
  isNew:           boolean;          // true = no existing agency found, must create
}

// ─── Normalisation helpers ────────────────────────────────────────────────────

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // strip diacritics
    .replace(/[^a-z0-9\s]/g, " ")      // non-alphanumeric → space
    .replace(/\s+/g, " ")
    .trim();
}

/** Token overlap (Jaccard) between two normalised strings — returns 0–1 */
function tokenOverlap(a: string, b: string): number {
  const tokA = new Set(normalize(a).split(" ").filter((t) => t.length > 1));
  const tokB = new Set(normalize(b).split(" ").filter((t) => t.length > 1));
  if (tokA.size === 0 || tokB.size === 0) return 0;
  let shared = 0;
  for (const t of tokA) if (tokB.has(t)) shared++;
  return shared / (tokA.size + tokB.size - shared);
}

// ─── Blocklist ────────────────────────────────────────────────────────────────
// Terms that look like proper nouns but are NOT agency names.

const BLOCKLIST = new Set([
  // countries / regions
  "netherlands","holland","dutch","olanda","polska","romania","belgium","germany",
  "poland","france","spain","portugal","czechia","slovakia","hungary","bulgaria",
  "ukraine","croatia","moldova","serbia","austria","switzerland",
  // major Dutch cities
  "amsterdam","rotterdam","utrecht","eindhoven","tilburg","groningen","breda",
  "nijmegen","venlo","venray","zwolle","arnhem","enschede","apeldoorn","schiedam",
  "delft","leiden","haarlem","maastricht","dordrecht","almelo","deventer","helmond",
  "heerlen","amersfoort","alkmaar","zaandam","zoetermeer","hertogenbosch",
  // generic labour/housing terms
  "agency","agencies","agentie","agentii","agencja","uitzendbureau","bureau",
  "company","employer","business","firm","organisation","organization",
  "housing","accommodation","cazare","zakwaterowanie","woning","huis","room",
  "salary","wage","wages","loon","wynagrodzenie","salariu","payment","pay",
  "transport","bus","car","train","shuttle","shuttle bus",
  "work","job","jobs","praca","munca","worker","workers","employee","employees",
  "staff","team","management","manager","supervisor","boss","recruiter",
  "contract","contracts","hours","overtime","payslip","deduction","tax","taxes",
  "monday","tuesday","wednesday","thursday","friday","saturday","sunday",
  "january","february","march","april","may","june","july","august",
  "september","october","november","december",
  // common noise words
  "the","and","or","but","with","from","in","at","for","to","on","by","of","a","an",
  "my","they","we","it","this","that","was","were","had","have","has","been","be",
  "good","bad","nice","great","terrible","awful","fine","okay","ok","terrible",
  "very","quite","really","always","never","sometimes","often","already","also",
  "new","old","big","small","large","little","many","much","more","most","some",
  "dutch","dutch agency","temp","temporary","staffing","recruitment","recruiter",
]);

function isBlocklisted(phrase: string): boolean {
  const n = normalize(phrase);
  if (BLOCKLIST.has(n)) return true;
  // reject single short words or all-digit strings
  if (n.replace(/\s+/g, "").length < 3) return true;
  if (/^\d+$/.test(n)) return true;
  return false;
}

// ─── Phase 1 — scan for known agency names ───────────────────────────────────

const STATIC_AGENCIES = VERIFIED_AGENCIES.map((a) => ({
  name: a.name,
  slug: a.slug,
  norm: normalize(a.name),
}));

function findKnownAgencies(text: string): ExtractionResult[] {
  const results: ExtractionResult[] = [];
  const normText = normalize(text);

  for (const agency of STATIC_AGENCIES) {
    if (agency.norm.length < 3) continue;

    if (normText.includes(agency.norm)) {
      results.push({
        extractedName:   agency.name,
        matchedName:     agency.name,
        matchedSlug:     agency.slug,
        detectionMethod: "exact_match",
        confidence:      95,
        isNew:           false,
      });
    }
  }

  return results;
}

// ─── Phase 2 — extract capitalized candidate phrases ─────────────────────────

/**
 * Finds capitalised 1–3 word phrases in the original (non-normalised) text.
 * Each word must start with an uppercase letter.
 * Filters out blocklisted terms and phrases already found in phase 1.
 */
function extractCandidates(text: string, alreadyFound: Set<string>): string[] {
  const candidates: string[] = [];

  // Match sequences of 1–3 consecutive capitalised words
  // Word: starts with uppercase letter, may contain letters/digits/hyphens
  const CAP_WORD = "[A-ZÁÉÍÓÚÀÈÌÒÙĂÂÎȘȚ][A-Za-záéíóúàèìòùăâîșțA-Z0-9\\-]*";
  const pattern  = new RegExp(`(?<![\\w])(?:${CAP_WORD}(?:\\s+${CAP_WORD}){0,2})`, "g");

  let m: RegExpExecArray | null;
  while ((m = pattern.exec(text)) !== null) {
    const phrase = m[0].trim();
    if (isBlocklisted(phrase)) continue;
    if (alreadyFound.has(normalize(phrase))) continue;
    // Skip single-character "words"
    if (phrase.replace(/\s+/g, "").length < 4) continue;
    // Skip sentence-start false positives: if preceded only by line-start or ". "
    // we're less confident — still include but with lower confidence
    candidates.push(phrase);
  }

  return [...new Set(candidates)]; // deduplicate
}

/** Fuzzy-match a candidate against the static list. Returns best match or null. */
function fuzzyMatch(candidate: string): { agency: typeof STATIC_AGENCIES[number]; score: number } | null {
  let best: { agency: typeof STATIC_AGENCIES[number]; score: number } | null = null;

  for (const agency of STATIC_AGENCIES) {
    const score = tokenOverlap(candidate, agency.name);
    if (score > 0.4 && (!best || score > best.score)) {
      best = { agency, score };
    }
  }

  return best;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * extractAgencies(comment)
 *
 * Main entry point. Returns a deduplicated list of ExtractionResult objects,
 * sorted by confidence descending.
 * Pass an empty string or null-ish value to get an empty array.
 */
export function extractAgencies(comment: string | null | undefined): ExtractionResult[] {
  if (!comment || comment.trim().length < 10) return [];

  const results: ExtractionResult[] = [];
  const seenSlugs = new Set<string>();
  const seenNorms = new Set<string>();

  // ── Phase 1: known agency names ──────────────────────────────────────────
  for (const r of findKnownAgencies(comment)) {
    const key = r.matchedSlug ?? normalize(r.matchedName);
    if (seenSlugs.has(key)) continue;
    seenSlugs.add(key);
    seenNorms.add(normalize(r.extractedName));
    results.push(r);
  }

  // ── Phase 2: capitalized candidate extraction ─────────────────────────────
  const candidates = extractCandidates(comment, seenNorms);

  for (const candidate of candidates) {
    const fuzzy = fuzzyMatch(candidate);

    if (fuzzy && fuzzy.score >= 0.6) {
      // High-confidence fuzzy match → existing agency
      const key = fuzzy.agency.slug;
      if (seenSlugs.has(key)) continue;
      seenSlugs.add(key);
      results.push({
        extractedName:   candidate,
        matchedName:     fuzzy.agency.name,
        matchedSlug:     fuzzy.agency.slug,
        detectionMethod: "fuzzy_match",
        confidence:      Math.round(fuzzy.score * 100),
        isNew:           false,
      });
    } else if (fuzzy && fuzzy.score >= 0.4) {
      // Weak match — still use known agency but lower confidence
      const key = fuzzy.agency.slug;
      if (seenSlugs.has(key)) continue;
      seenSlugs.add(key);
      results.push({
        extractedName:   candidate,
        matchedName:     fuzzy.agency.name,
        matchedSlug:     fuzzy.agency.slug,
        detectionMethod: "fuzzy_match",
        confidence:      Math.round(fuzzy.score * 100),
        isNew:           false,
      });
    } else {
      // No match — candidate may be a new agency if it looks plausible
      const normCand = normalize(candidate);
      if (seenNorms.has(normCand)) continue;
      seenNorms.add(normCand);

      // Only flag as new if it contains ≥2 tokens or ends with agency-like suffix
      const tokens = candidate.split(/\s+/);
      const looksLikeAgency =
        tokens.length >= 2 ||
        /\b(workforce|staffing|uitzend|recruitment|interim|werk|groep|group|services|solutions|flex|temp)\b/i.test(candidate);

      if (!looksLikeAgency) continue;

      results.push({
        extractedName:   candidate,
        matchedName:     candidate,
        matchedSlug:     null,
        detectionMethod: "text_extraction",
        confidence:      30,
        isNew:           true,
      });
    }
  }

  return results.sort((a, b) => b.confidence - a.confidence);
}

// ─── Slug generator (shared, mirrors the one in review API) ──────────────────

export function generateAgencySlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}
