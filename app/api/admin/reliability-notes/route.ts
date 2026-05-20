import { NextRequest, NextResponse }  from "next/server";
import { verifyAdminRequest, unauthorizedJson } from "@/lib/adminAuth";
import {
  listReliabilityNotes,
  createReliabilityNote,
  NOTE_TYPE_LABELS,
  type NoteType,
  type Severity,
} from "@/lib/reliability-db";

export const dynamic = "force-dynamic";

const VALID_NOTE_TYPES = new Set(Object.keys(NOTE_TYPE_LABELS) as NoteType[]);
const VALID_SEVERITIES  = new Set<Severity>(["low", "medium", "high"]);

// ─── GET /api/admin/reliability-notes ────────────────────────────────────────
// Query params: noteType, severity, leadId, q, page, limit

export async function GET(req: NextRequest) {
  if (!(await verifyAdminRequest())) return unauthorizedJson();

  try {
    const sp       = req.nextUrl.searchParams;
    const noteType = sp.get("noteType") as NoteType | null;
    const severity = sp.get("severity") as Severity | null;
    const leadId   = sp.get("leadId")   ?? undefined;
    const q        = sp.get("q")        ?? undefined;
    const page     = Math.max(1, parseInt(sp.get("page")  ?? "1",  10));
    const limit    = Math.min(100, parseInt(sp.get("limit") ?? "50", 10));

    const { notes, total } = await listReliabilityNotes({
      noteType: noteType && VALID_NOTE_TYPES.has(noteType) ? noteType : undefined,
      severity: severity && VALID_SEVERITIES.has(severity)  ? severity : undefined,
      leadId,
      q,
      page,
      limit,
    });

    const pages = Math.max(1, Math.ceil(total / limit));
    return NextResponse.json({ notes, total, page, pages });
  } catch (err) {
    console.error("[reliability-notes] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── POST /api/admin/reliability-notes ───────────────────────────────────────
// Body: { leadId, candidateName, noteType, severity, recruiterSource?, incidentDate?, noteText? }

export async function POST(req: NextRequest) {
  if (!(await verifyAdminRequest())) return unauthorizedJson();

  try {
    const body = await req.json();
    const { leadId, candidateName, noteType, severity, recruiterSource, incidentDate, noteText } = body as {
      leadId:           string;
      candidateName:    string;
      noteType:         NoteType;
      severity:         Severity;
      recruiterSource?: string;
      incidentDate?:    string;
      noteText?:        string;
    };

    if (!leadId || !candidateName || !noteType || !severity) {
      return NextResponse.json(
        { error: "leadId, candidateName, noteType, and severity are required" },
        { status: 400 },
      );
    }

    if (!VALID_NOTE_TYPES.has(noteType)) {
      return NextResponse.json({ error: "Invalid noteType" }, { status: 400 });
    }
    if (!VALID_SEVERITIES.has(severity)) {
      return NextResponse.json({ error: "Invalid severity" }, { status: 400 });
    }

    // Sanitise free-text fields
    const sanitise = (v?: string) => v?.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim().slice(0, 2000);

    const id = await createReliabilityNote({
      leadId:          leadId.trim(),
      candidateName:   candidateName.trim().slice(0, 200),
      noteType,
      severity,
      recruiterSource: sanitise(recruiterSource) || undefined,
      incidentDate:    incidentDate || undefined,
      noteText:        sanitise(noteText) || undefined,
      createdByAdmin:  "admin",
    });

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[reliability-notes] POST error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
