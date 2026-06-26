/**
 * lib/reviewSanitizer.ts
 *
 * Legal risk reduction for user-submitted agency reviews.
 *
 * Transforms defamatory / legally risky language into factual,
 * worker-reported framing — WITHOUT:
 *   - removing negative content
 *   - censoring complaints, salary issues, housing issues, dismissal experiences
 *   - altering factual statements or ratings
 *   - inventing new facts
 *
 * Two-pass approach:
 *   Pass 1 — Sentence-level patterns  (name + accusation clauses, run FIRST
 *             so "Monika is a liar" is caught before "liar" is word-replaced)
 *   Pass 2 — Word / phrase replacements
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SanitizationResult {
  /** The sanitized text (equals input if nothing was changed). */
  text:        string;
  /** True when at least one replacement was made. */
  wasModified: boolean;
  /** Number of individual replacements made. */
  changes:     number;
  /** Human-readable log of what changed (server-side audit only, never public). */
  log:         string[];
}

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Run one regex rule against text, count hits, preserve original sentence-
 * start capitalisation where relevant.
 */
function applyRule(
  text:        string,
  pattern:     RegExp,
  replacement: string,
  counter:     { n: number },
  log:         string[],
  label:       string,
): string {
  return text.replace(pattern, (match) => {
    counter.n++;
    log.push(`[${label}] "${match}" → "${replacement}"`);

    // If the matched fragment started with a capital letter, capitalise
    // the first char of the replacement too (handles sentence starts).
    const firstChar = match[0];
    if (firstChar === firstChar.toUpperCase() && firstChar !== firstChar.toLowerCase()) {
      return replacement.charAt(0).toUpperCase() + replacement.slice(1);
    }
    return replacement;
  });
}

// ─── Name pattern ─────────────────────────────────────────────────────────────
// Matches a single capitalised FIRST NAME (3–20 chars, supports diacritics).
// Negative lookahead excludes common English words that are capitalised only
// because they appear at the start of a sentence (They, The, He, She, etc.).
// This prevents "They lied" from triggering the "name+lied" sentence rule.

const EXCLUDED_CAPS =
  "(?!(?:They|Them|The|This|That|These|Those|There|Then|Though|Through|" +
  "He|She|We|You|It|His|Her|Its|Our|My|Your|Their|" +
  "But|And|Or|If|As|At|In|On|By|Of|To|Up|So|Yet|For|Nor|" +
  "When|Where|Why|How|What|Who|Which|While|After|Before|Since|Although|" +
  "However|Furthermore|Moreover|Therefore|Nevertheless|Because|Although|" +
  "Company|Agency|Manager|Coordinator|Boss|Supervisor|Staff|Team|" +
  "Workers|Employees|Work|Job|Pay|Salary|Money|Housing|Transport|" +
  "Very|Just|Also|Even|Only|Never|Always|All|Any|Each|Some|Most|More|" +
  "Here|Now|Today|Yesterday|Tomorrow|Netherlands|Holland|Belgium)\\b)";

const N = `${EXCLUDED_CAPS}[A-ZÁÉÍÓÚÄËÏÖÜÑÇÀÈÌÒÙÂÊÎÔÛÃÕ][a-záéíóúäëïöüñçàèìòùâêîôûãõ]{2,19}`;

// ─── Pass 1: Sentence-level rules ────────────────────────────────────────────
// Each entry: [pattern, replacement, label]
// Run BEFORE word rules so named-individual clauses are caught whole.

type Rule = [RegExp, string, string];

const SENTENCE_RULES: Rule[] = [
  // NOTE: all sentence rules use "g" only (NOT "gi") so that the name pattern
  // N — which starts with [A-Z...] — correctly requires a capitalised first
  // letter. The verb/adjective portions are already lowercase in the pattern.
  // Using "i" would make [A-Z] match lowercase too, causing common nouns like
  // "coordinator" or "manager" to be misidentified as names.

  // "[Cc]oordinator / [Mm]anager / [Bb]oss / [Ss]upervisor Name is [negative]"
  // Character-class pairs handle both sentence-start (capital) and mid-sentence (lower)
  [
    new RegExp(
      `(?:[Cc]oordinator|[Mm]anager|[Bb]oss|[Ss]upervisor|[Tt]eam\\s+[Ll]ead(?:er)?)\\s+${N}` +
      `(?:\\s+[A-ZÁÉÍÓÚ][a-záéíóú]+)?` +        // optional surname
      `\\s+(?:is|was|are|were)` +
      `(?:\\s+(?:a|an|very|so|totally|completely))?` +
      `\\s+(?:liar|scammer|criminal|thief|fraudster?|racist|` +
      `irresponsible|incompetent|useless|corrupt|rude|unprofessional|dishonest)`,
      "g",
    ),
    "The reviewer reported concerns with a coordinator",
    "coord+name+accusation",
  ],

  // "Name is a liar / scammer / criminal / thief / fraudster"
  [
    new RegExp(
      `${N}\\s+(?:is|was)\\s+a(?:n)?\\s+(?:liar|scammer|criminal|thief|fraudster?)`,
      "g",
    ),
    "The reviewer reported communication issues with a coordinator",
    "name+is+a+accusation",
  ],

  // "Name is [negative adjective]"
  [
    new RegExp(
      `${N}\\s+(?:is|was)(?:\\s+(?:very|so|totally|completely))?` +
      `\\s+(?:irresponsible|incompetent|useless|rude|unprofessional|` +
      `dishonest|corrupt|racist|lying)`,
      "g",
    ),
    "The reviewer reported difficulties with coordinator communication",
    "name+is+adjective",
  ],

  // "Name lied / lies / is lying / was lying / has lied"
  [
    new RegExp(
      `${N}\\s+(?:lied|lies|is\\s+lying|was\\s+lying|has\\s+lied)`,
      "g",
    ),
    "The reviewer reported communication issues with a coordinator",
    "name+lied",
  ],

  // "Name stole / scammed / defrauded / cheated / robbed [me/us/workers…]"
  [
    new RegExp(
      `${N}\\s+(?:stole|scammed|defrauded|cheated|robbed)` +
      `(?:\\s+(?:me|us|my\\s+\\w+|workers|employees|everyone|the\\s+workers))?`,
      "g",
    ),
    "The reviewer reported payment concerns involving a coordinator",
    "name+stole",
  ],

  // "Name is a thief"
  [
    new RegExp(`${N}\\s+(?:is|was)\\s+a\\s+thief`, "g"),
    "The reviewer reported payment concerns with a coordinator",
    "name+is+thief",
  ],
];

// ─── Pass 2: Word / phrase rules ──────────────────────────────────────────────
// Longer / more-specific phrases come BEFORE shorter overlapping ones.

const WORD_RULES: Rule[] = [
  // "stole my money / salary / wages / pay / cash / earnings"
  // Replacement works both standalone and mid-sentence
  [
    /\bstole\s+my\s+(?:money|salary|wages|pay|cash|earnings|income)\b/gi,
    "reportedly did not pay correctly",
    "stole-my-X",
  ],

  // scammers (plural) before scammer (singular)
  [/\bscammers\b/gi, "company with reported payment concerns",   "scammers"],
  [/\bscammer\b/gi,  "reported payment concerns",                "scammer"],

  // thief variants
  [/\bthieves\b/gi,  "reported missing payments",                "thieves"],
  [/\bthief\b/gi,    "reported missing payments",                "thief"],
  [/\bstealing\b/gi, "reported missing payments",                "stealing"],
  [/\bstolen\b/gi,   "reported as missing",                      "stolen"],

  // generic stole (must come AFTER "stole my X")
  [/\bstole\b/gi,    "reportedly removed without authorisation", "stole"],

  // fraud variants
  [/\bfraudulen(?:t|tly)\b/gi, "concerning",                         "fraudulent"],
  [/\bfraudster\b/gi,           "person with reported payment concerns", "fraudster"],
  [/\bfraud\b/gi,               "reported administrative concerns",   "fraud"],

  // criminal
  [/\bcriminals\b/gi, "serious concerns",  "criminals"],
  [/\bcriminal\b/gi,  "serious concerns",  "criminal"],

  // liar / liars / lying / lied / lies
  [/\bliars\b/gi, "poor communication",                  "liars"],
  [/\bliar\b/gi,  "poor communication",                  "liar"],
  [/\blying\b/gi, "providing inconsistent information",  "lying"],
  [/\blied\b/gi,  "provided inconsistent information",   "lied"],
  // "lies" only as standalone noun (avoid "the company lies in..." which is locative)
  // We target: "lies" at end of clause, preceded by subject / "only"
  [/\b(he|she|they|it|company|agency|manager|coordinator)\s+lies\b/gi,
    "$1 provides inconsistent information", "subject-lies"],

  // illegal
  [/\billegally\b/gi, "in a way possibly against company policy", "illegally"],
  [/\billegal\b/gi,   "possibly against company policy",          "illegal"],

  // corrupt
  [/\bcorruption\b/gi, "unprofessional conduct", "corruption"],
  [/\bcorrupt\b/gi,    "unprofessional",          "corrupt"],

  // racist / racism / xenophobia
  [/\bracists\b/gi,           "workers reporting discriminatory treatment", "racists"],
  [/\bracist\b/gi,            "worker reported discriminatory treatment",   "racist"],
  [/\bracism\b/gi,            "reported discriminatory treatment",          "racism"],
  [/\bxenophob(?:ic|ia)\b/gi, "reported discriminatory treatment",          "xenophobia"],
];

// ─── Main export ─────────────────────────────────────────────────────────────

/**
 * Sanitize a review text string.
 *
 * @param input - Raw user-submitted text (comment or title).
 * @returns SanitizationResult with the safe public text + audit metadata.
 *
 * @example
 * const { text, wasModified } = sanitizeReview(
 *   "Terrible company, scammers, coordinator Monika is a liar."
 * );
 * // text → "Terrible company, company with reported payment concerns,
 * //          The reviewer reported communication issues with a coordinator."
 */
export function sanitizeReview(input: string): SanitizationResult {
  if (!input || typeof input !== "string") {
    return { text: input ?? "", wasModified: false, changes: 0, log: [] };
  }

  const counter = { n: 0 };
  const log: string[] = [];
  let text = input;

  // Pass 1 — sentence-level patterns
  for (const [pattern, replacement, label] of SENTENCE_RULES) {
    text = applyRule(text, pattern, replacement, counter, log, label);
  }

  // Pass 2 — word/phrase replacements
  for (const [pattern, replacement, label] of WORD_RULES) {
    text = applyRule(text, pattern, replacement, counter, log, label);
  }

  return {
    text,
    wasModified: counter.n > 0,
    changes:     counter.n,
    log,
  };
}
