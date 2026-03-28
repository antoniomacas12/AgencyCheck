/**
 * Worker Q&A seed data.
 * Questions are keyed by agencySlug (or "global" for all pages).
 * All data is worker-reported and clearly labeled as such.
 */

export interface QAAnswer {
  id: string;
  text: string;
  authorLabel: "Worker (reported)" | "Verified worker";
  createdAt: string; // ISO date
}

export interface QAQuestion {
  id: string;
  text: string;
  agencySlug: string; // "global" = shown on all pages
  answers: QAAnswer[];
  createdAt: string;
  isExample?: boolean; // seed/example content
}

export const QA_SEED: QAQuestion[] = [

  // ── GLOBAL — shown everywhere ──────────────────────────────────────────────

  {
    id: "global-1",
    agencySlug: "global",
    text: "How many people usually share a room in agency housing?",
    createdAt: "2026-01-14",
    answers: [
      {
        id: "global-1-a1",
        text: "At my agency it was 4 people per room. Two bunk beds, one small wardrobe for everyone. Not private at all.",
        authorLabel: "Worker (reported)",
        createdAt: "2026-01-15",
      },
      {
        id: "global-1-a2",
        text: "I had 3 people in one room. The house had 12 workers total. One kitchen, one bathroom. Very hard.",
        authorLabel: "Worker (reported)",
        createdAt: "2026-01-18",
      },
    ],
  },
  {
    id: "global-2",
    agencySlug: "global",
    text: "Is transport always deducted from your salary?",
    createdAt: "2026-01-20",
    answers: [
      {
        id: "global-2-a1",
        text: "Yes. At my agency the bus to the factory cost €28/week and they took it straight from the payslip. Nobody told me this before I signed.",
        authorLabel: "Worker (reported)",
        createdAt: "2026-01-21",
      },
    ],
  },
  {
    id: "global-3",
    agencySlug: "global",
    text: "How much do you actually keep every week after all costs?",
    createdAt: "2026-01-22",
    answers: [
      {
        id: "global-3-a1",
        text: "I earn €15/hr, 40 hours. After housing (€140), bus (€28), and tax I keep about €290/week. Much less than I expected.",
        authorLabel: "Verified worker",
        createdAt: "2026-01-23",
      },
      {
        id: "global-3-a2",
        text: "Around €310/week for me. €14.50/hr. Not bad but housing was €155/week which I didn't expect.",
        authorLabel: "Worker (reported)",
        createdAt: "2026-01-25",
      },
    ],
  },
  {
    id: "global-4",
    agencySlug: "global",
    text: "Is the housing clean or in bad condition?",
    createdAt: "2026-02-01",
    answers: [
      {
        id: "global-4-a1",
        text: "Depended on the location. First house was okay, SNF certified. Second was old and damp. Always ask if it's SNF certified before you start.",
        authorLabel: "Verified worker",
        createdAt: "2026-02-02",
      },
    ],
  },

  // ── RANDSTAD ────────────────────────────────────────────────────────────────

  {
    id: "randstad-1",
    agencySlug: "randstad-nederland",
    text: "Does Randstad provide housing and how much do they deduct?",
    createdAt: "2026-01-10",
    answers: [
      {
        id: "randstad-1-a1",
        text: "Randstad itself doesn't usually provide housing — they partner with housing companies. The deduction through the partner was €130–€150/week for me.",
        authorLabel: "Worker (reported)",
        createdAt: "2026-01-11",
      },
    ],
  },
  {
    id: "randstad-2",
    agencySlug: "randstad-nederland",
    text: "Is the contract at Randstad easy to understand?",
    createdAt: "2026-01-12",
    answers: [
      {
        id: "randstad-2-a1",
        text: "Contract was in Dutch. I asked for English version, they said no. I had to translate it myself on my phone.",
        authorLabel: "Worker (reported)",
        createdAt: "2026-01-13",
      },
      {
        id: "randstad-2-a2",
        text: "My Randstad consultant was actually helpful. They explained the main points verbally. But written contract still Dutch only.",
        authorLabel: "Worker (reported)",
        createdAt: "2026-01-15",
      },
    ],
  },

  // ── TEMPO-TEAM ──────────────────────────────────────────────────────────────

  {
    id: "tempo-1",
    agencySlug: "tempo-team-amsterdam-uitzendbureau",
    text: "How is the pay at Tempo-Team? Do they pay on time?",
    createdAt: "2026-01-08",
    answers: [
      {
        id: "tempo-1-a1",
        text: "Always paid on time for me. Every 4 weeks. Payslip was detailed but confusing — lots of deduction codes I didn't understand.",
        authorLabel: "Verified worker",
        createdAt: "2026-01-09",
      },
    ],
  },
  {
    id: "tempo-2",
    agencySlug: "tempo-team-amsterdam-uitzendbureau",
    text: "Do Tempo-Team deduct transport costs automatically?",
    createdAt: "2026-01-16",
    answers: [
      {
        id: "tempo-2-a1",
        text: "Yes, €32/week for the bus to my warehouse. They said transport was provided — they didn't say it was at extra cost until payslip arrived.",
        authorLabel: "Worker (reported)",
        createdAt: "2026-01-17",
      },
    ],
  },

  // ── OTTO WORKFORCE ──────────────────────────────────────────────────────────

  {
    id: "otto-1",
    agencySlug: "otto-workforce",
    text: "How is the housing with Otto Workforce?",
    createdAt: "2026-01-05",
    answers: [
      {
        id: "otto-1-a1",
        text: "Housing was okay — SNF certified. Shared room with 2 others. Cost was €140/week deducted. Internet included. Not luxury but liveable.",
        authorLabel: "Verified worker",
        createdAt: "2026-01-06",
      },
      {
        id: "otto-1-a2",
        text: "My Otto house had 6 people per house, 2 per room. Location was near a factory far from the city. Hard to go anywhere without a car.",
        authorLabel: "Worker (reported)",
        createdAt: "2026-01-07",
      },
    ],
  },
  {
    id: "otto-2",
    agencySlug: "otto-workforce",
    text: "What happens to housing when your Otto contract ends?",
    createdAt: "2026-01-20",
    answers: [
      {
        id: "otto-2-a1",
        text: "You have to leave within 1 week. They told me this when I started but I forgot. It was very stressful finding somewhere new so fast.",
        authorLabel: "Worker (reported)",
        createdAt: "2026-01-21",
      },
    ],
  },

  // ── COVEBO ───────────────────────────────────────────────────────────────────

  {
    id: "covebo-1",
    agencySlug: "covebo",
    text: "How much does Covebo deduct for housing per week?",
    createdAt: "2026-01-18",
    answers: [
      {
        id: "covebo-1-a1",
        text: "€155/week for me. They also took €25 for insurance I didn't ask for. Total deductions before tax were over €180/week.",
        authorLabel: "Worker (reported)",
        createdAt: "2026-01-19",
      },
    ],
  },
  {
    id: "covebo-2",
    agencySlug: "covebo",
    text: "Is housing with Covebo shared room or private?",
    createdAt: "2026-01-22",
    answers: [
      {
        id: "covebo-2-a1",
        text: "Shared room, 2 people per room in my case. House had 8 workers total. Some people had 3 or 4 per room in older houses.",
        authorLabel: "Worker (reported)",
        createdAt: "2026-01-23",
      },
    ],
  },
];

/**
 * Get Q&As for a specific agency page.
 * Returns both agency-specific AND global questions.
 */
export function getQAsForContext(agencySlug?: string): QAQuestion[] {
  const global = QA_SEED.filter((q) => q.agencySlug === "global");
  if (!agencySlug) return global;
  const agencySpecific = QA_SEED.filter((q) => q.agencySlug === agencySlug);
  return [...agencySpecific, ...global];
}

/** Seed example question prompts (shown in the input area as chips). */
export const EXAMPLE_PROMPTS = [
  "How many people share a room?",
  "Is transport deducted from salary?",
  "How much do you actually keep weekly?",
  "Is housing clean or bad?",
  "What happens to housing when contract ends?",
  "Is the contract in English?",
];
