// ─── Recruiter seed data ───────────────────────────────────────────────────────
// This is the initial data inserted into recruiter_config on first cold-start.
// To add a new recruiter: add an entry here and re-deploy (the ensureSetup()
// in the redirect route will upsert it).

export interface RecruiterSeed {
  id:        string;   // stable identifier, used as PK
  name:      string;   // display name
  waUrl:     string;   // full wa.me URL
  sortOrder: number;   // tie-break order for round-robin (lower = first)
}

export const RECRUITER_SEEDS: RecruiterSeed[] = [
  {
    id:        "nuno",
    name:      "Nuno",
    waUrl:     "https://wa.me/31613754893",
    sortOrder: 0,
  },
  {
    id:        "nuno-wife",
    name:      "Nuno's wife",
    waUrl:     "https://wa.me/351911099945",
    sortOrder: 1,
  },
];
