/**
 * lib/reviewSanitizer.ts
 *
 * AgencyCheck — Legal Risk Protection Layer for public reviews.
 *
 * Operates like Glassdoor / Indeed / Trustpilot: treat every review as a
 * USER OPINION, not a verified fact.  The system runs four protection passes
 * before any review text is saved or displayed publicly:
 *
 *   1. removeEmployeeNames()              — replace staff names with role labels
 *   2. removePersonalAttacks()            — remove profanity & direct insults
 *   3. convertAccusationsToReportedExperience() — convert fact claims → opinions
 *   4. sanitizeReview()                   — remove defamatory / legally risky terms
 *
 * Call generateSafePublicVersion() to run all four in order.
 *
 * Platform disclaimers are exported as REVIEW_DISCLAIMER (per-review) and
 * FOOTER_DISCLAIMER (site-wide), ready to embed in React components.
 *
 * Rules maintained:
 *   ✓ Keep 95%+ of review meaning
 *   ✓ Never invent new facts
 *   ✓ Never remove negative content — only re-frame accusations as opinions
 *   ✓ Never censor salary, housing, communication or dismissal complaints
 *   ✓ Never modify ratings
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

  // "a scam" / "it's a scam" / "total scam" — noun form only
  // Verb form ("scams workers") is handled in convertAccusationsToReportedExperience
  [/\ba\s+(?:total\s+)?scam\b/gi,   "a reported concern",              "scam-noun"],
  [/\bscam\b/gi,                    "reported concern",                "scam-noun-sg"],

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

// ═══════════════════════════════════════════════════════════════════════════════
// LEGAL RISK PROTECTION LAYER — Glassdoor / Indeed / Trustpilot model
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Platform disclaimers ─────────────────────────────────────────────────────

/**
 * Per-review disclaimer — render below every public review card.
 */
export const REVIEW_DISCLAIMER =
  "This review reflects the personal experience and opinion of the reviewer. " +
  "AgencyCheck does not independently verify all claims.";

/**
 * Site-wide disclaimer — render in the footer and on review pages.
 */
export const FOOTER_DISCLAIMER =
  "AgencyCheck provides a platform for workers to share experiences and opinions. " +
  "Reviews are user-generated content and do not necessarily represent verified facts.";

// ─── Layer 1: removeEmployeeNames ────────────────────────────────────────────

/**
 * Anonymises individual employee names found in review text.
 *
 * Targets:
 *   • "Name's [noun]"              → "Their [noun]"
 *   • "Name told/said/promised me" → "A staff member told me"
 *   • "I spoke to Name who"        → "I spoke to a staff member who"
 *
 * Named-individual accusation patterns (Monika is a liar, etc.) are handled
 * by sanitizeReview()'s sentence-level rules, which run in pass 4.
 */
export function removeEmployeeNames(input: string): string {
  if (!input) return input;
  let text = input;

  // "[Name]'s" possessive → "Their" (sentence-start) / "their" (mid-sentence)
  text = text.replace(
    new RegExp(`${N}(?:'s|'s)\\s+`, "g"),
    (match) => match[0] === match[0].toUpperCase() ? "Their " : "their ",
  );

  // "Name told / said / informed / promised / assured me/us"
  text = text.replace(
    new RegExp(
      `${N}\\s+(told|said|informed|promised|assured|guaranteed|confirmed)\\s+(me|us|everyone|all\\s+of\\s+us)`,
      "g",
    ),
    "A staff member $1 $2",
  );

  // "spoke / talked / called / emailed / messaged to/with Name"
  text = text.replace(
    new RegExp(
      `\\b(spoke|talked|called|emailed|messaged|wrote|contacted)\\s+(to\\s+|with\\s+)?${N}\\b`,
      "g",
    ),
    "$1 $2a staff member",
  );

  // "I/we asked / contacted / called Name"
  text = text.replace(
    new RegExp(`\\b(?:I|we)\\s+(asked|contacted|called|emailed)\\s+${N}\\b`, "g"),
    "The reviewer $1 a staff member",
  );

  return text;
}

// ─── Layer 2: removePersonalAttacks ──────────────────────────────────────────

/**
 * Removes or softens personal attacks and profanity that do not constitute
 * legally defamatory statements (those are handled in sanitizeReview).
 *
 * Profanity is replaced with neutral equivalents; direct insults aimed at
 * individuals are softened to professional language.
 * Negative-but-legitimate criticism ("terrible housing", "poor salary") is
 * never touched.
 */
export function removePersonalAttacks(input: string): string {
  if (!input) return input;
  const counter = { n: 0 };
  const log: string[] = [];
  let text = input;

  const ATTACK_RULES: Rule[] = [
    // Profanity — replace with neutral/mild equivalents
    [/\bf+u+c+k+ing\b/gi,                "very",          "profanity-fucking"],
    [/\bf+u+c+k(?:\s+this|\s+them)?\b/gi, "",             "profanity-fuck"],
    [/\bshitty\b/gi,                      "poor",          "profanity-shitty"],
    [/\bshit\b/gi,                        "poor",          "profanity-shit"],
    [/\bcrappy\b/gi,                      "poor",          "profanity-crappy"],
    [/\bcrap\b/gi,                        "poor",          "profanity-crap"],
    [/\bbullshit\b/gi,                    "misleading",    "profanity-bs"],
    [/\bdamn(?:ed)?\b/gi,                 "very",          "profanity-damn"],
    [/\bhell(?:\s+of\s+a)?\b/gi,          "very",          "profanity-hell"],
    [/\bcrap\b/gi,                        "poor",          "profanity-crap2"],

    // Personal insults (targeted at individuals, not situations)
    // "unprofessional" works grammatically in "they are unprofessional" context
    [/\b(?:total\s+)?idiot\b/gi,       "unprofessional",     "insult-idiot"],
    [/\bidiots\b/gi,                   "unprofessional",     "insult-idiots"],
    [/\bmoron\b/gi,                    "unprofessional",     "insult-moron"],
    [/\bmorons\b/gi,                   "unprofessional",     "insult-morons"],
    [/\bastards?\b/gi,                 "difficult",          "insult-bastard"],
    [/\bass+h+ole\b/gi,                "very difficult",     "insult-ahole"],
    [/\bprick\b/gi,                    "difficult",          "insult-prick"],
    [/\bbitch\b/gi,                    "very difficult",     "insult-bitch"],
    [/\bdipshit\b/gi,                  "poor judgment",      "insult-dipshit"],
    [/\bwanker\b/gi,                   "unprofessional",     "insult-wanker"],
    [/\btwat\b/gi,                     "unprofessional",     "insult-twat"],
    [/\bpsycho\b/gi,                   "very difficult",     "insult-psycho"],
    [/\bnazis?\b/gi,                   "extremely strict",   "insult-nazi"],
    [/\bmonsters?\b/gi,                "very difficult",     "insult-monster"],
    [/\bpigs?\b/gi,                    "unprofessional",     "insult-pig"],
    [/\banimals?\b/gi,                 "unprofessional",     "insult-animal"],
  ];

  for (const [pattern, replacement, label] of ATTACK_RULES) {
    text = applyRule(text, pattern, replacement, counter, log, label);
  }

  return text;
}

// ─── Layer 3: convertAccusationsToReportedExperience ─────────────────────────

/**
 * Converts absolute fact-claim sentences into reported-experience framing.
 *
 * This is the core of the Glassdoor / Indeed model: we don't remove the
 * negative content; we convert it from "verified fact" to "user opinion."
 *
 *   "They don't pay salaries."
 *   → "The reviewer reported payment issues."
 *
 *   "The housing is terrible."
 *   → "The reviewer reported dissatisfaction with the housing conditions."
 *
 *   "They fired me because I was sick."
 *   → "The reviewer reported losing their position after a period of illness."
 */
export function convertAccusationsToReportedExperience(input: string): string {
  if (!input) return input;
  const counter = { n: 0 };
  const log: string[] = [];
  let text = input;

  // Patterns ordered: longer / more specific first to avoid partial matches.
  const CONVERSION_RULES: Rule[] = [

    // ── Payment / salary ──────────────────────────────────────────────────────

    // "they don't / didn't / never pay [salaries/workers]"
    [/\b(?:they|company|agency|employer)\s+(?:don'?t|didn'?t|never|do\s+not|did\s+not)\s+pay(?:\s+(?:salaries|wages|workers|you|us|on\s+time|correctly))?\b/gi,
      "the reviewer reported payment issues",
      "conv-no-pay"],

    // "I / we didn't get paid / receive salary"
    [/\b(?:I|we)\s+(?:didn'?t|haven'?t|was\s+not|were\s+not|never|don'?t)\s+(?:get|receive|got|received)\s+(?:paid|(?:my|our)\s+(?:salary|wages|pay|payment))\b/gi,
      "the reviewer reported not receiving payment",
      "conv-i-not-paid"],

    // "I/we haven't been paid / wasn't paid"
    [/\b(?:I|we)\s+(?:haven'?t|wasn'?t|weren'?t|have\s+not|was\s+not|were\s+not)\s+(?:been\s+)?paid\b/gi,
      "the reviewer reported not receiving payment",
      "conv-havent-paid"],

    // "they fired me because / after / when"
    [/\bthey\s+fired\s+me\s+(?:because|after|when|due\s+to|for\s+being|as)\b/gi,
      "the reviewer reported losing their position after",
      "conv-fired-because"],

    // "I was fired / got fired / was dismissed / was let go"
    [/\b(?:I|we)\s+(?:was|were|got)\s+(?:fired|dismissed|terminated|let\s+go|laid\s+off)\b/gi,
      "the reviewer reported being dismissed",
      "conv-i-fired"],

    // "they fired me" (general)
    [/\bthey\s+fired\s+(?:me|us)\b/gi,
      "the reviewer reported being dismissed",
      "conv-fired"],

    // "salary / wages / pay was late / missing / not paid"
    [/\b(?:salary|wages|pay|payment)\s+(?:was|were|is|are)\s+(?:late|delayed|not\s+paid|never\s+paid|missing|withheld|incorrect|short)\b/gi,
      "the reviewer reported payment delays or discrepancies",
      "conv-salary-late"],

    // ── Housing / accommodation ───────────────────────────────────────────────

    [/\b(?:the\s+)?housing\s+(?:is|was|are|were)\s+(?:terrible|awful|horrible|disgusting|bad|poor|filthy|dirty|unsafe|overcrowded|tiny|small|mouldy|moldy|cramped|infested)\b/gi,
      "the reviewer reported dissatisfaction with the housing conditions",
      "conv-housing-bad"],

    [/\b(?:the\s+)?accommodation\s+(?:is|was|are|were)\s+(?:terrible|awful|horrible|disgusting|bad|poor|filthy|dirty|unsafe|overcrowded|tiny|cramped|mouldy|moldy|infested)\b/gi,
      "the reviewer reported poor accommodation conditions",
      "conv-accom-bad"],

    [/\b(?:the\s+)?room\s+(?:is|was|are|were)\s+(?:terrible|awful|horrible|disgusting|bad|poor|filthy|dirty|unsafe|overcrowded|tiny|small|cramped|infested|mouldy|moldy)\b/gi,
      "the reviewer reported dissatisfaction with the room",
      "conv-room-bad"],

    // ── Working conditions ────────────────────────────────────────────────────

    [/\b(?:working|work)\s+conditions?\s+(?:is|are|was|were)\s+(?:terrible|awful|horrible|disgusting|bad|poor|dangerous|unsafe|harsh|brutal)\b/gi,
      "the reviewer reported poor working conditions",
      "conv-work-conditions"],

    [/\b(?:this|the)\s+(?:company|agency|place|employer)\s+(?:is|was)\s+(?:terrible|awful|horrible|the\s+worst|disgusting|toxic|abusive)\b/gi,
      "the reviewer reported a very negative overall experience with this company",
      "conv-company-terrible"],

    // ── Communication ─────────────────────────────────────────────────────────

    [/\b(?:they|company|agency|employer|management)\s+(?:ignore|ignores|ignored)\s+(?:you|us|me|workers?|employees?|everyone)\b/gi,
      "the reviewer reported poor communication and responsiveness",
      "conv-ignore"],

    [/\b(?:they|company|agency|employer)\s+(?:never|don'?t|didn'?t)\s+(?:answer|respond|reply|call\s+back|get\s+back)\b/gi,
      "the reviewer reported difficulty reaching the company",
      "conv-no-response"],

    [/\bno\s+one\s+(?:answers?|responds?|replies?|picks?\s+up|calls?\s+back)\b/gi,
      "the reviewer reported difficulty reaching the company",
      "conv-no-one-responds"],

    // ── Dismissal after illness ───────────────────────────────────────────────

    [/\b(?:fired|dismissed|terminated|let\s+go)\s+(?:because|after|when|for\s+being|due\s+to)\s+(?:I\s+was\s+)?(?:sick|ill|injured|on\s+sick\s+leave|hospitalised|hospitalized)\b/gi,
      "the reviewer reported losing their position after a period of illness",
      "conv-fired-sick"],

    // ── Company-level accusation verbs ───────────────────────────────────────

    // "This/the company scams workers" — user's exact example
    [/\b(?:this|the)\s+(?:company|agency)\s+scams?\s+(?:workers?|employees?|people|you|us|everyone)\b/gi,
      "the reviewer believes workers may experience payment or administrative issues",
      "conv-company-scams"],

    // "they scam / scammed you / workers"
    [/\bthey\s+scams?\s+(?:you|us|workers?|employees?|everyone|people)\b/gi,
      "the reviewer reported payment or administrative concerns",
      "conv-they-scam"],

    // "they exploit / exploited workers"
    [/\b(?:they|company|agency)\s+exploit(?:s|ed)?\s+(?:workers?|employees?|you|us)\b/gi,
      "the reviewer reported feeling exploited",
      "conv-exploit"],

    // ── Recommendation / avoidance ────────────────────────────────────────────

    [/\bnever\s+work\s+(?:here|for\s+them|there|at\s+this\s+(?:company|agency|place))\b/gi,
      "the reviewer would not recommend this company",
      "conv-never-work"],

    [/\bavoid\s+(?:this\s+(?:company|agency|place)|at\s+all\s+costs?)\b/gi,
      "the reviewer would not recommend this company",
      "conv-avoid"],

    [/\bstay\s+away\s+from\s+(?:this\s+(?:company|agency|place)|them)\b/gi,
      "the reviewer would not recommend this company",
      "conv-stay-away"],
  ];

  for (const [pattern, replacement, label] of CONVERSION_RULES) {
    text = applyRule(text, pattern, replacement, counter, log, label);
  }

  return text;
}

// ─── SafePublicVersion ────────────────────────────────────────────────────────

export interface SafePublicVersion {
  /** Final text safe for public display. */
  text:         string;
  /** Per-review disclaimer string ready to embed in UI. */
  disclaimer:   string;
  /** True when any layer made at least one change. */
  wasModified:  boolean;
  /** Total number of replacements across all layers. */
  changes:      number;
  /** Detailed audit log — server-side only, never exposed publicly. */
  log:          string[];
}

// ─── generateSafePublicVersion ────────────────────────────────────────────────

/**
 * Master orchestrator — runs all four protection layers in sequence.
 *
 * Layer order:
 *   1. removeEmployeeNames()              — anonymise staff names
 *   2. removePersonalAttacks()            — remove profanity / insults
 *   3. convertAccusationsToReportedExperience() — convert fact claims → opinions
 *   4. sanitizeReview()                   — remove defamatory / legally risky terms
 *
 * @param input - Raw review text (comment or title field).
 * @returns SafePublicVersion with final text + per-review disclaimer + audit log.
 *
 * @example
 * const safe = generateSafePublicVersion(
 *   "Terrible company, scammers, coordinator Monika is a liar, " +
 *   "they don't pay and the housing is horrible."
 * );
 * // safe.text →
 * //   "Terrible company, company with reported payment concerns,
 * //    The reviewer reported concerns with a coordinator,
 * //    the reviewer reported payment issues and
 * //    the reviewer reported dissatisfaction with the housing conditions."
 * // safe.disclaimer → REVIEW_DISCLAIMER
 */
export function generateSafePublicVersion(input: string): SafePublicVersion {
  if (!input || typeof input !== "string") {
    return {
      text:        input ?? "",
      disclaimer:  REVIEW_DISCLAIMER,
      wasModified: false,
      changes:     0,
      log:         [],
    };
  }

  const allLog: string[] = [];
  let text = input;
  let totalChanges = 0;

  // Layer 1 — employee names
  const afterNames = removeEmployeeNames(text);
  if (afterNames !== text) {
    allLog.push("[L1:names] employee name(s) anonymised");
    totalChanges++;
  }
  text = afterNames;

  // Layer 2 — personal attacks
  const afterAttacks = removePersonalAttacks(text);
  if (afterAttacks !== text) {
    allLog.push("[L2:attacks] personal attack(s) softened");
    totalChanges++;
  }
  text = afterAttacks;

  // Layer 3 — accusations → reported experience
  const afterConversion = convertAccusationsToReportedExperience(text);
  if (afterConversion !== text) {
    allLog.push("[L3:convert] accusation(s) converted to reported experience");
    totalChanges++;
  }
  text = afterConversion;

  // Layer 4 — defamatory / legally risky words (existing sanitizeReview)
  const sanitized = sanitizeReview(text);
  allLog.push(...sanitized.log);
  totalChanges += sanitized.changes;
  text = sanitized.text;

  return {
    text,
    disclaimer:  REVIEW_DISCLAIMER,
    wasModified: totalChanges > 0,
    changes:     totalChanges,
    log:         allLog,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// HIGH-RISK DEFAMATION FILTER
// Runs BEFORE generateSafePublicVersion for stronger, clause-level protection.
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Output type ─────────────────────────────────────────────────────────────

export interface LegallySaferReview {
  /** Original unmodified input (never public). */
  originalReview:  string;
  /** Final text safe for public display. */
  safeReview:      string;
  /** 0–100.  0 = clean review,  100 = critical defamation risk. */
  riskScore:       number;
  /** Human-readable list of detected issue categories (deduplicated). */
  detectedIssues:  string[];
  /** Convenience flag — true when at least one change was made. */
  wasModified:     boolean;
  /** Total replacements across all layers. */
  changes:         number;
  /** Server-side audit log — never expose publicly. */
  log:             string[];
}

// ─── detectHighRiskLanguage — detection patterns with weights ─────────────────

interface RiskPattern {
  pattern: RegExp;
  label:   string;
  weight:  number;   // points per match; total capped at 100
}

const RISK_DETECTION_PATTERNS: RiskPattern[] = [
  // ── Critical (30 pts) — named individual + criminal accusation ────────────
  { pattern: new RegExp(`${N}\\s+(?:stole|defrauded|robbed|cheated|scammed)`, "g"),
    label: "Named individual accused of financial crime", weight: 30 },
  { pattern: new RegExp(`${N}\\s+(?:is|was)\\s+a\\s+(?:criminal|fraudster?)`, "g"),
    label: "Named individual accused of criminal conduct", weight: 30 },

  // ── High (20 pts) ────────────────────────────────────────────────────────
  { pattern: /\b(?:fraud|fraudulent|fraudulently)\b/gi,
    label: "Allegation of fraud", weight: 20 },
  { pattern: /\b(?:criminal|criminally)\b/gi,
    label: "Criminal accusation", weight: 20 },
  { pattern: /\b(?:stole|stolen|stealing|theft)\b/gi,
    label: "Allegation of theft or financial crime", weight: 20 },
  { pattern: /\b(?:illegal|illegally|unlawful|unlawfully)\b/gi,
    label: "Allegation of illegal conduct", weight: 20 },
  { pattern: /\bscam(?:s|med|mers?)?\b/gi,
    label: "Allegation of fraudulent business practices", weight: 20 },
  { pattern: new RegExp(`${N}\\s+(?:is|was)\\s+a(?:n)?\\s+(?:liar|scammer|thief)`, "g"),
    label: "Named individual personally accused of misconduct", weight: 20 },

  // ── Medium (15 pts) ──────────────────────────────────────────────────────
  { pattern: /\b(?:liar|liars|lied|lying)\b/gi,
    label: "Allegation of dishonesty or deception", weight: 15 },
  { pattern: /\b(?:corrupt|corruption)\b/gi,
    label: "Allegation of corruption", weight: 15 },
  { pattern: /\b(?:racist|racism|xenophob)\b/gi,
    label: "Allegation of discrimination", weight: 15 },
  { pattern: /\bexploit(?:s|ed|ing)?\b/gi,
    label: "Allegation of worker exploitation", weight: 15 },
  { pattern: /\bthey\s+(?:don'?t|didn'?t|never)\s+pay\b/gi,
    label: "Absolute payment claim", weight: 15 },
  { pattern: /\bfired\s+(?:me|us)\s+(?:illegally|unlawfully|wrongfully)\b/gi,
    label: "Claim of wrongful dismissal", weight: 15 },

  // ── Low (5 pts) ──────────────────────────────────────────────────────────
  { pattern: /\b(?:idiot|moron|asshole?|bastard|bitch|wanker)\b/gi,
    label: "Personal insult or profanity", weight: 5 },
  { pattern: /\bf+u+c+k/gi,
    label: "Profanity", weight: 5 },
  { pattern: /\bshit(?:ty)?\b/gi,
    label: "Profanity", weight: 5 },
];

/**
 * Scan text for legally risky language WITHOUT modifying it.
 *
 * Risk bands:
 *    0–20  Low      — standard negative review, no legal risk
 *   21–50  Medium   — some risky terms, sanitization recommended
 *   51–75  High     — clear legal risk, sanitization required
 *   76–100 Critical — serious defamation risk
 *
 * @param text - Raw review text (pre-sanitization).
 * @returns Deduplicated issue labels + 0–100 risk score.
 */
export function detectHighRiskLanguage(text: string): {
  issues:    string[];
  riskScore: number;
} {
  if (!text) return { issues: [], riskScore: 0 };

  const seen  = new Set<string>();
  const issues: string[] = [];
  let totalScore = 0;

  for (const { pattern, label, weight } of RISK_DETECTION_PATTERNS) {
    // Re-create with fresh lastIndex each iteration
    const re      = new RegExp(pattern.source, pattern.flags);
    const matches = text.match(re) ?? [];
    if (matches.length > 0) {
      totalScore += weight * matches.length;
      if (!seen.has(label)) {
        seen.add(label);
        issues.push(label);
      }
    }
  }

  return {
    issues,
    riskScore: Math.min(100, totalScore),
  };
}

// ─── replaceHighRiskLanguage — clause + word rules ────────────────────────────
// Full-clause patterns run FIRST (more specific), word fallbacks run LAST.
// All replacements are lowercase; applyRule auto-capitalises at sentence start.

const HIGH_RISK_RULES: Rule[] = [

  // ── Named individual + role ───────────────────────────────────────────────
  // "[Coordinator/Manager] Name is incompetent / useless / irresponsible"
  // → "the reviewer reported dissatisfaction with coordinator communication"
  [
    new RegExp(
      `(?:[Cc]oordinator|[Mm]anager|[Bb]oss|[Ss]upervisor|[Tt]eam\\s+[Ll]ead(?:er)?)` +
      `\\s+${N}(?:\\s+${N})?` +
      `\\s+(?:is|was)\\s+(?:incompetent|useless|irresponsible|unprofessional)`,
      "g",
    ),
    "the reviewer reported dissatisfaction with coordinator communication",
    "hr-coord-incompetent",
  ],

  // "[Coordinator/Manager] Name is a liar / scammer / criminal"
  // → "the reviewer reported communication issues with a coordinator"
  [
    new RegExp(
      `(?:[Cc]oordinator|[Mm]anager|[Bb]oss|[Ss]upervisor|[Tt]eam\\s+[Ll]ead(?:er)?)` +
      `\\s+${N}(?:\\s+${N})?` +
      `\\s+(?:is|was)\\s+a(?:n)?\\s+(?:liar|scammer|criminal|thief|fraudster?)`,
      "g",
    ),
    "the reviewer reported communication issues with a coordinator",
    "hr-coord-liar",
  ],

  // ── Dismissal ─────────────────────────────────────────────────────────────
  // "they fired me illegally / unlawfully / wrongfully"
  // → "the reviewer reported losing their position and believes the decision was unfair"
  [
    /\bthey\s+fired\s+me\s+(?:illegally|unlawfully|wrongfully|unjustly)\b/gi,
    "the reviewer reported losing their position and believes the decision was unfair",
    "hr-fired-illegally",
  ],

  // ── Lies / misinformation ─────────────────────────────────────────────────
  // "they lied to me / us / workers"
  // → "the reviewer reported receiving information they believe was inaccurate"
  [
    /\bthey\s+lied\s+to\s+(?:me|us|workers?|employees?|everyone)\b/gi,
    "the reviewer reported receiving information they believe was inaccurate",
    "hr-lied-to-me",
  ],
  // "I was lied to"
  [
    /\bI\s+was\s+lied\s+to\b/gi,
    "the reviewer reported receiving information they believe was inaccurate",
    "hr-i-was-lied-to",
  ],

  // ── Theft / payment dispute ───────────────────────────────────────────────
  // "they stole my money / salary / wages / pay"
  // → "the reviewer reported a payment dispute"
  [
    /\bthey\s+stole\s+my\s+(?:money|salary|wages|pay|cash|earnings|income)\b/gi,
    "the reviewer reported a payment dispute",
    "hr-stole-my-money",
  ],
  // "they stole from me / us"
  [
    /\bthey\s+stole\s+(?:from\s+)?(?:me|us)\b/gi,
    "the reviewer reported a payment dispute",
    "hr-stole-from-me",
  ],

  // ── Exploitation ──────────────────────────────────────────────────────────
  // "this / the company exploits workers"
  // → "the reviewer reported concerns regarding working conditions"
  [
    /\b(?:this|the)\s+(?:company|agency)\s+exploits?\s+(?:workers?|employees?|you|us|people)\b/gi,
    "the reviewer reported concerns regarding working conditions",
    "hr-company-exploits",
  ],
  // "they exploit workers"
  [
    /\bthey\s+exploit(?:s|ed)?\s+(?:workers?|employees?|you|us)\b/gi,
    "the reviewer reported concerns regarding working conditions",
    "hr-they-exploit",
  ],

  // ── Criminal company ──────────────────────────────────────────────────────
  // "criminal / illegal company / agency / business"
  // → "the reviewer expressed strong dissatisfaction with the company"
  [
    /\b(?:criminal|illegal)\s+(?:company|agency|business|operation|employer)\b/gi,
    "the reviewer expressed strong dissatisfaction with the company",
    "hr-criminal-company",
  ],
  // "[this/the] company is criminal / illegal"
  [
    /\b(?:this|the)\s+(?:company|agency)\s+(?:is|was)\s+(?:criminal|illegal)\b/gi,
    "the reviewer expressed strong dissatisfaction with the company",
    "hr-company-is-criminal",
  ],

  // ── Illegal housing / conditions ──────────────────────────────────────────
  // "illegal housing"
  // → "the reviewer reported concerns regarding housing conditions"
  [
    /\billegal\s+housing\b/gi,
    "the reviewer reported concerns regarding housing conditions",
    "hr-illegal-housing",
  ],
  // "illegal [contract / conditions / workplace / treatment / dismissal]"
  [
    /\billegal\s+(?:conditions?|contract|workplace|practice|treatment|dismissal|termination)\b/gi,
    "the reviewer reported concerns regarding working conditions",
    "hr-illegal-noun",
  ],

  // ── Scam — clause-level (specific before generic) ────────────────────────
  // "[this/the] company is a scam"
  [
    /\b(?:this|the)\s+(?:company|agency|employer|place)\s+(?:is|was)\s+a(?:n)?\s+(?:total\s+)?scam\b/gi,
    "the reviewer reported financial concerns regarding this company",
    "hr-company-is-scam",
  ],
  // "it's / this is / that is a [total] scam"
  [
    /\b(?:it'?s|it\s+is|this\s+is|that\s+is|that'?s)\s+a(?:n)?\s+(?:total\s+|complete\s+|absolute\s+)?scam\b/gi,
    "the reviewer reported financial concerns",
    "hr-its-a-scam",
  ],
  // "total / complete / absolute scam"
  [
    /\b(?:total|complete|absolute|utter|pure)\s+scam\b/gi,
    "the reviewer reported financial concerns",
    "hr-total-scam",
  ],
  // "they are scammers" / "company of scammers" etc.
  [
    /\b(?:they\s+are|they\s+were|it'?s\s+a|this\s+is\s+a|run\s+by|company\s+of)\s+scammers?\b/gi,
    "the reviewer reported concerns regarding business practices",
    "hr-they-are-scammers",
  ],
  // "[are/is/were] scammers" standalone predicate
  [
    /\b(?:is|are|were|was)\s+scammers?\b/gi,
    "the reviewer reported concerns regarding business practices",
    "hr-are-scammers",
  ],

  // ── Fraud — clause-level ──────────────────────────────────────────────────
  // "[this/the] company commits fraud"
  [
    /\b(?:this|the)\s+(?:company|agency)\s+(?:commits?|committed|is\s+committing)\s+fraud\b/gi,
    "the reviewer believes there were serious administrative issues",
    "hr-company-commits-fraud",
  ],
  // "this is / it's fraud"
  [
    /\b(?:this\s+is|that'?s|it'?s|it\s+is)\s+fraud\b/gi,
    "the reviewer believes there were serious administrative issues",
    "hr-this-is-fraud",
  ],

  // ── Word-level fallbacks (fire on anything not caught by clause patterns) ─
  // Phrased to work mid-sentence where possible.
  [/\bscammers\b/gi, "the reviewer reported concerns regarding business practices", "hr-scammers"],
  [/\bscammer\b/gi,  "the reviewer reported concerns regarding business practices", "hr-scammer"],
  [/\bscams\b/gi,    "reported financial concerns",                                  "hr-scam-verb"],
  [/\bscam\b/gi,     "reported financial concerns",                                  "hr-scam"],
  [/\bfraud\b/gi,    "the reviewer believes there were serious administrative issues", "hr-fraud"],
];

/**
 * Replace high-risk defamatory or legally risky language with safer alternatives.
 *
 * Uses "The reviewer reported…" framing (Glassdoor / Indeed / Trustpilot model).
 * Runs BEFORE the existing 4-layer pass so full-clause patterns catch sentences
 * first; word-level rules serve as the fallback.
 *
 * Covers all user-spec examples:
 *   "Scam"                        → "The reviewer reported financial concerns."
 *   "Scammers"                    → "The reviewer reported concerns regarding business practices."
 *   "Fraud"                       → "The reviewer believes there were serious administrative issues."
 *   "Criminal company"            → "The reviewer expressed strong dissatisfaction with the company."
 *   "They stole my money"         → "The reviewer reported a payment dispute."
 *   "They lied to me"             → "The reviewer reported receiving information they believe was inaccurate."
 *   "This company exploits workers" → "The reviewer reported concerns regarding working conditions."
 *   "Coordinator Monika is a liar"  → "The reviewer reported communication issues with a coordinator."
 *   "Coordinator Monika is incompetent" → "The reviewer reported dissatisfaction with coordinator communication."
 *   "Illegal housing"             → "The reviewer reported concerns regarding housing conditions."
 *   "They fired me illegally"     → "The reviewer reported losing their position and believes the decision was unfair."
 */
export function replaceHighRiskLanguage(input: string): string {
  if (!input) return input;
  const counter = { n: 0 };
  const log: string[] = [];
  let text = input;

  for (const [pattern, replacement, label] of HIGH_RISK_RULES) {
    text = applyRule(text, pattern, replacement, counter, log, label);
  }

  return text;
}

/**
 * Anonymise ALL private individual names in review text.
 *
 * Superset of removeEmployeeNames() — adds:
 *   • "Coordinator / Manager [Name]" → role only ("a coordinator")
 *   • "Mr. / Mrs. / Ms. / Dr. [Name]" → "a staff member"
 *   • Any remaining Name in negative predicate → "A staff member"
 *
 * Run as Layer 0, before replaceHighRiskLanguage, so names don't interfere
 * with pattern matching in later layers.
 */
export function anonymizeIndividuals(input: string): string {
  if (!input) return input;

  // Start with the existing name anonymiser
  let text = removeEmployeeNames(input);

  // "[Coordinator/Manager/Boss/Supervisor/Team Lead] Name [optional surname]"
  // → "A coordinator" / "a coordinator"
  text = text.replace(
    new RegExp(
      `\\b([Cc]oordinator|[Mm]anager|[Bb]oss|[Ss]upervisor|[Tt]eam\\s+[Ll]ead(?:er)?)` +
      `\\s+${N}(?:\\s+${N})?\\b`,
      "g",
    ),
    (_, role: string) => {
      const r = role.toLowerCase();
      // Capitalise "A" if role was capitalised (sentence start)
      return role[0].toUpperCase() === role[0] ? `A ${r}` : `a ${r}`;
    },
  );

  // "Mr. / Mrs. / Ms. / Miss / Dr. Name [optional surname]"
  // → "a staff member"
  text = text.replace(
    new RegExp(`\\b(?:Mr\\.?|Mrs\\.?|Ms\\.?|Miss|Dr\\.?)\\s+${N}(?:\\s+${N})?\\b`, "g"),
    "a staff member",
  );

  // Any remaining lone Name in negative predicate not caught by the above
  // "[Name] is / was [bad adjective]" → "A staff member"
  text = text.replace(
    new RegExp(
      `${N}\\s+(?:is|was|are|were)\\s+(?:a\\s+)?(?:very\\s+)?` +
      `(?:bad|terrible|awful|horrible|incompetent|irresponsible|useless|` +
      `rude|dishonest|unprofessional|corrupt)`,
      "g",
    ),
    "A staff member",
  );

  return text;
}

/**
 * Master high-risk defamation filter — the single entry point for the POST route.
 *
 * Orchestration order:
 *   0. detectHighRiskLanguage()              — score the RAW input (pre-change)
 *   1. anonymizeIndividuals()                — remove all private names
 *   2. replaceHighRiskLanguage()             — rewrite risky clauses
 *   3. generateSafePublicVersion()           — run existing 4-layer protection
 *
 * @param input - Raw review text (comment or title field).
 * @returns LegallySaferReview with originalReview, safeReview, riskScore,
 *          detectedIssues, and server-side audit log.
 *
 * @example
 * const r = createLegallySaferReview("Scam. They fired me illegally.");
 * // r.riskScore    → 55
 * // r.detectedIssues → ["Allegation of fraudulent business practices", "Claim of wrongful dismissal"]
 * // r.safeReview   → "The reviewer reported financial concerns. The reviewer reported
 * //                   losing their position and believes the decision was unfair."
 */
export function createLegallySaferReview(input: string): LegallySaferReview {
  if (!input || typeof input !== "string") {
    return {
      originalReview: input ?? "",
      safeReview:     input ?? "",
      riskScore:      0,
      detectedIssues: [],
      wasModified:    false,
      changes:        0,
      log:            [],
    };
  }

  const log: string[] = [];
  let totalChanges = 0;
  let text = input;

  // Step 0 — detect issues on the untouched input
  const { issues, riskScore } = detectHighRiskLanguage(input);
  if (riskScore > 0) {
    log.push(`[HR:detect] riskScore=${riskScore} issues=[${issues.join(", ")}]`);
  }

  // Step 1 — anonymise all individual names
  const afterAnon = anonymizeIndividuals(text);
  if (afterAnon !== text) {
    log.push("[HR:anon] individual name(s) anonymised");
    totalChanges++;
  }
  text = afterAnon;

  // Step 2 — replace high-risk clauses and words
  const afterReplace = replaceHighRiskLanguage(text);
  if (afterReplace !== text) {
    log.push("[HR:replace] high-risk language replaced");
    totalChanges++;
  }
  text = afterReplace;

  // Step 3 — existing 4-layer protection (catches anything HR missed)
  const safe = generateSafePublicVersion(text);
  log.push(...safe.log);
  totalChanges += safe.changes;
  text = safe.text;

  return {
    originalReview: input,
    safeReview:     text,
    riskScore,
    detectedIssues: issues,
    wasModified:    totalChanges > 0,
    changes:        totalChanges,
    log,
  };
}
