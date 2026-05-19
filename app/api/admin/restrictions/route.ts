import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, unauthorizedJson } from "@/lib/adminAuth";
import {
  getAllRestrictions,
  getBlockedAttempts,
  addRestriction,
  REASON_LABELS,
  type ReasonCategory,
  type RestrictionSeverity,
} from "@/lib/restriction-db";

export const dynamic = "force-dynamic";

const VALID_REASONS    = new Set(Object.keys(REASON_LABELS) as ReasonCategory[]);
const VALID_SEVERITIES = new Set<RestrictionSeverity>(["low", "medium", "high"]);

// ─── GET /api/admin/restrictions ─────────────────────────────────────────────

export async function GET(_req: NextRequest) {
  if (!(await verifyAdminRequest())) return unauthorizedJson();

  try {
    const [restrictions, attempts] = await Promise.all([
      getAllRestrictions(),
      getBlockedAttempts(),
    ]);
    return NextResponse.json({ restrictions, attempts });
  } catch (err) {
    console.error("[admin/restrictions] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── POST /api/admin/restrictions ────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!(await verifyAdminRequest())) return unauthorizedJson();

  try {
    const body = await req.json();
    const { phoneRaw, reasonCategory, severity, internalNote, recruiterName, dateReported } = body as {
      phoneRaw:        string;
      reasonCategory:  ReasonCategory;
      severity:        RestrictionSeverity;
      internalNote?:   string;
      recruiterName?:  string;
      dateReported?:   string;
    };

    if (!phoneRaw || !reasonCategory || !severity) {
      return NextResponse.json(
        { error: "phoneRaw, reasonCategory, and severity are required" },
        { status: 400 },
      );
    }
    if (!VALID_REASONS.has(reasonCategory)) {
      return NextResponse.json({ error: "Invalid reasonCategory" }, { status: 400 });
    }
    if (!VALID_SEVERITIES.has(severity)) {
      return NextResponse.json({ error: "Invalid severity" }, { status: 400 });
    }

    const sanitise = (v?: string) =>
      v?.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim().slice(0, 2000);

    const id = await addRestriction({
      phoneRaw:       phoneRaw.trim().slice(0, 30),
      reasonCategory,
      severity,
      internalNote:   sanitise(internalNote) || undefined,
      recruiterName:  sanitise(recruiterName)?.slice(0, 200) || undefined,
      dateReported:   dateReported || undefined,
      createdByAdmin: "admin",
    });

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("[admin/restrictions] POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
