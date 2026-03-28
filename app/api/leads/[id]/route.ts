/**
 * GET  /api/leads/[id]   — fetch single lead (admin only)
 * PATCH /api/leads/[id]  — update status, notes, tags (admin only)
 *
 * Both endpoints require valid admin session cookie.
 * This prevents PII exposure to unauthenticated requests.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, unauthorizedJson } from "@/lib/adminAuth";
import { leadDelegate } from "@/lib/leadClient";
import type { LeadUpdateInput, LeadStatus } from "@/lib/leadClient";

// Parse JSON-string fields back to arrays before returning in HTTP responses.
// tags and assignedAgencies are stored as JSON strings in PostgreSQL.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseLead(lead: any): any {
  if (!lead) return lead;
  return {
    ...lead,
    tags:             safeParseArray(lead.tags),
    assignedAgencies: safeParseArray(lead.assignedAgencies),
  };
}

function safeParseArray(v: unknown): unknown[] {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") {
    try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch { return []; }
  }
  return [];
}

const VALID_STATUSES = new Set<string>([
  "new", "reviewed", "waiting_for_match", "potential_fit",
  "agency_contact_pending", "approved", "sent", "converted", "rejected",
]);

// ─── GET /api/leads/[id] ──────────────────────────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await verifyAdminRequest())) return unauthorizedJson();

  try {
    const lead = await leadDelegate.findUnique({ where: { id: params.id } });
    if (!lead) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json(parseLead(lead));
  } catch (err) {
    console.error("[GET /api/leads/[id]]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

// ─── PATCH /api/leads/[id] ────────────────────────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await verifyAdminRequest())) return unauthorizedJson();

  try {
    const body = await req.json();
    const updates: LeadUpdateInput = {};

    if (body.status !== undefined) {
      if (!VALID_STATUSES.has(body.status)) {
        return NextResponse.json({ error: "invalid_status" }, { status: 400 });
      }
      updates.status = body.status as LeadStatus;
      if (body.status !== "new") {
        updates.lastContactedAt = new Date();
      }
    }

    if (body.internalNotes !== undefined) {
      if (typeof body.internalNotes !== "string") {
        return NextResponse.json({ error: "invalid_notes" }, { status: 400 });
      }
      updates.internalNotes = body.internalNotes.slice(0, 5000);
    }

    if (body.assignedTo !== undefined) {
      updates.assignedTo =
        typeof body.assignedTo === "string" ? body.assignedTo.slice(0, 100) : null;
    }

    if (body.tags !== undefined) {
      if (!Array.isArray(body.tags)) {
        return NextResponse.json({ error: "invalid_tags" }, { status: 400 });
      }
      const tagsArr = (body.tags as unknown[])
        .filter((t): t is string => typeof t === "string")
        .map((t) => t.slice(0, 50))
        .slice(0, 20);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (updates as any).tags = JSON.stringify(tagsArr);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "nothing_to_update" }, { status: 400 });
    }

    const lead = await leadDelegate.update({
      where: { id: params.id },
      data:  updates,
    });

    return NextResponse.json({ ok: true, lead: parseLead(lead) });
  } catch (err) {
    console.error("[PATCH /api/leads/[id]]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
