/**
 * lib/reliability-db.ts
 *
 * Candidate Reliability Notes — private admin-only system.
 * Notes are NEVER exposed publicly or to candidates.
 *
 * Table: candidate_reliability_notes
 * Uses raw SQL (same pattern as recruiter-db.ts) to avoid prisma generate dependency.
 */

import { prisma } from "@/lib/prisma";

// ─── Setup guard ──────────────────────────────────────────────────────────────
let reliabilityDbReady = false;

export async function ensureReliabilityReady(): Promise<void> {
  if (reliabilityDbReady) return;

  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS candidate_reliability_notes (
      "id"              TEXT        PRIMARY KEY,
      "leadId"          TEXT        NOT NULL,
      "candidateName"   TEXT        NOT NULL,
      "noteType"        TEXT        NOT NULL,
      "severity"        TEXT        NOT NULL DEFAULT 'medium',
      "recruiterSource" TEXT,
      "incidentDate"    DATE,
      "noteText"        TEXT,
      "createdByAdmin"  TEXT,
      "createdAt"       TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS crn_lead_id_idx   ON candidate_reliability_notes ("leadId")
  `;
  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS crn_severity_idx  ON candidate_reliability_notes ("severity")
  `;
  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS crn_note_type_idx ON candidate_reliability_notes ("noteType")
  `;
  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS crn_created_at_idx ON candidate_reliability_notes ("createdAt")
  `;

  reliabilityDbReady = true;
  console.log("[reliability-db] table ready");
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type NoteType =
  | "no_show_interview"
  | "no_show_first_day"
  | "left_without_notice"
  | "false_cv"
  | "invalid_documents"
  | "unresponsive_after_offer"
  | "agency_hopping"
  | "other";

export type Severity = "low" | "medium" | "high";

export const NOTE_TYPE_LABELS: Record<NoteType, string> = {
  no_show_interview:       "No-show interview",
  no_show_first_day:       "No-show first work day",
  left_without_notice:     "Left job without notice",
  false_cv:                "False CV information",
  invalid_documents:       "Invalid documents",
  unresponsive_after_offer:"Unresponsive after offer",
  agency_hopping:          "Agency hopping reported",
  other:                   "Other",
};

export const SEVERITY_META: Record<Severity, { label: string; bg: string; text: string; dot: string }> = {
  low:    { label: "Low",    bg: "bg-yellow-50",  text: "text-yellow-700", dot: "bg-yellow-400" },
  medium: { label: "Medium", bg: "bg-orange-50",  text: "text-orange-700", dot: "bg-orange-400" },
  high:   { label: "High",   bg: "bg-red-50",     text: "text-red-700",    dot: "bg-red-500"    },
};

export interface ReliabilityNote {
  id:              string;
  leadId:          string;
  candidateName:   string;
  noteType:        NoteType;
  severity:        Severity;
  recruiterSource: string | null;
  incidentDate:    string | null;   // ISO date string (YYYY-MM-DD)
  noteText:        string | null;
  createdByAdmin:  string | null;
  createdAt:       string;          // ISO timestamp
}

export interface CreateNoteInput {
  leadId:          string;
  candidateName:   string;
  noteType:        NoteType;
  severity:        Severity;
  recruiterSource?: string;
  incidentDate?:   string;
  noteText?:       string;
  createdByAdmin?: string;
}

// ─── Write ────────────────────────────────────────────────────────────────────

export async function createReliabilityNote(input: CreateNoteInput): Promise<string> {
  await ensureReliabilityReady();
  const id = crypto.randomUUID();

  await prisma.$executeRaw`
    INSERT INTO candidate_reliability_notes
      ("id", "leadId", "candidateName", "noteType", "severity",
       "recruiterSource", "incidentDate", "noteText", "createdByAdmin")
    VALUES
      (${id}, ${input.leadId}, ${input.candidateName}, ${input.noteType},
       ${input.severity}, ${input.recruiterSource ?? null},
       ${input.incidentDate ?? null}, ${input.noteText ?? null},
       ${input.createdByAdmin ?? null})
  `;

  console.log(
    `[reliability-db] note created id=${id} leadId=${input.leadId} ` +
    `type=${input.noteType} severity=${input.severity}`,
  );
  return id;
}

export async function deleteReliabilityNote(id: string): Promise<void> {
  await ensureReliabilityReady();
  await prisma.$executeRaw`
    DELETE FROM candidate_reliability_notes WHERE "id" = ${id}
  `;
  console.log(`[reliability-db] note deleted id=${id}`);
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getNotesForLead(leadId: string): Promise<ReliabilityNote[]> {
  await ensureReliabilityReady();
  return prisma.$queryRaw<ReliabilityNote[]>`
    SELECT
      "id", "leadId", "candidateName", "noteType", "severity",
      "recruiterSource",
      TO_CHAR("incidentDate", 'YYYY-MM-DD') AS "incidentDate",
      "noteText", "createdByAdmin",
      "createdAt"::text AS "createdAt"
    FROM candidate_reliability_notes
    WHERE "leadId" = ${leadId}
    ORDER BY "createdAt" DESC
  `;
}

export interface ListNotesFilter {
  noteType?:  NoteType;
  severity?:  Severity;
  leadId?:    string;
  q?:         string;       // search by candidate name
  page?:      number;
  limit?:     number;
}

export async function listReliabilityNotes(
  filter: ListNotesFilter = {},
): Promise<{ notes: ReliabilityNote[]; total: number }> {
  await ensureReliabilityReady();

  const page  = Math.max(1, filter.page  ?? 1);
  const limit = Math.min(100, filter.limit ?? 50);
  const offset = (page - 1) * limit;

  // Build WHERE clauses dynamically using a parameterised approach via tagged template
  // is not straightforward with Prisma raw, so we fetch all and filter in JS for
  // simplicity (notes table will be small, <10k rows in practice).
  // This is safe because this is an admin-only internal query.

  const allNotes = await prisma.$queryRaw<ReliabilityNote[]>`
    SELECT
      "id", "leadId", "candidateName", "noteType", "severity",
      "recruiterSource",
      TO_CHAR("incidentDate", 'YYYY-MM-DD') AS "incidentDate",
      "noteText", "createdByAdmin",
      "createdAt"::text AS "createdAt"
    FROM candidate_reliability_notes
    ORDER BY "createdAt" DESC
  `;

  let filtered = allNotes;

  if (filter.noteType)  filtered = filtered.filter((n) => n.noteType === filter.noteType);
  if (filter.severity)  filtered = filtered.filter((n) => n.severity === filter.severity);
  if (filter.leadId)    filtered = filtered.filter((n) => n.leadId   === filter.leadId);
  if (filter.q) {
    const lq = filter.q.toLowerCase();
    filtered = filtered.filter((n) => n.candidateName.toLowerCase().includes(lq));
  }

  const total = filtered.length;
  const notes = filtered.slice(offset, offset + limit);

  return { notes, total };
}

/**
 * Returns a map of leadId → note count.
 * Used by the leads API to attach reliability warning counts to each lead row.
 */
export async function getNoteCountsForLeads(
  leadIds: string[],
): Promise<Record<string, number>> {
  if (leadIds.length === 0) return {};
  await ensureReliabilityReady();

  const rows = await prisma.$queryRaw<{ leadId: string; cnt: bigint }[]>`
    SELECT "leadId", COUNT(*) AS cnt
    FROM candidate_reliability_notes
    WHERE "leadId" = ANY(${leadIds})
    GROUP BY "leadId"
  `;

  const map: Record<string, number> = {};
  for (const row of rows) {
    map[row.leadId] = Number(row.cnt);
  }
  return map;
}

/**
 * Returns leadIds that have at least one note with the given severity filter.
 * Used by the leads API `hasNotes` filter.
 */
export async function getLeadIdsWithNotes(options?: {
  severityIn?: Severity[];
  noteTypeIn?: NoteType[];
}): Promise<string[]> {
  await ensureReliabilityReady();

  const rows = await prisma.$queryRaw<{ leadId: string }[]>`
    SELECT DISTINCT "leadId" FROM candidate_reliability_notes
  `;

  let leadIds = rows.map((r) => r.leadId);

  // JS-side filtering for severity/type (small table, acceptable)
  if (options?.severityIn?.length) {
    const sevSet = new Set(options.severityIn);
    const matchingRows = await prisma.$queryRaw<{ leadId: string; severity: string }[]>`
      SELECT DISTINCT "leadId", "severity" FROM candidate_reliability_notes
    `;
    const matching = matchingRows
      .filter((r) => sevSet.has(r.severity as Severity))
      .map((r) => r.leadId);
    leadIds = leadIds.filter((id) => matching.includes(id));
  }

  return leadIds;
}
