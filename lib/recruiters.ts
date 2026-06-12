// ─── Recruiter seed data ───────────────────────────────────────────────────────
// This is the initial data inserted into recruiter_config on first cold-start.
// To add a new recruiter: add an entry here and re-deploy (the ensureSetup()
// in the redirect route will upsert it).
//
// enabled: false  → force-disables the row in DB regardless of admin toggle.
//                   Use for permanently retired recruiters that must be kept
//                   for historical records. Omit (or true) for active recruiters.

export interface RecruiterSeed {
  id:        string;    // stable identifier, used as PK
  name:      string;    // display name
  waUrl:     string;    // full wa.me URL
  sortOrder: number;    // tie-break order for round-robin (lower = first)
  enabled?:  boolean;   // default true; false = force-inactive on every cold-start
}

export const RECRUITER_SEEDS: RecruiterSeed[] = [
  {
    id:        "antonio",
    name:      "Antonio",
    waUrl:     "https://wa.me/31649210631",
    sortOrder: 0,
  },
  {
    id:        "carolina",
    name:      "Carolina",
    waUrl:     "https://wa.me/31685166776",
    sortOrder: 1,
  },
  // Nuno — disabled, kept for historical records only
  {
    id:        "nuno",
    name:      "Nuno Barroso",
    waUrl:     "https://wa.me/31649210631",
    sortOrder: 99,
    enabled:   false,
  },
  // Raquel — disabled, kept for historical records only
  {
    id:        "nuno-wife",
    name:      "Raquel Teixeira",
    waUrl:     "https://wa.me/351911099945",
    sortOrder: 99,
    enabled:   false,
  },
];
