/**
 * GET    /api/admin/leads/[id] — fetch single lead
 * PATCH  /api/admin/leads/[id] — update status, notes, assignedTo, tags
 * DELETE /api/admin/leads/[id] — permanently remove lead
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, unauthorizedJson } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const VALID_STATUSES = new Set([
  "new", "reviewed", "waiting_for_match", "potential_fit",
  "agency_contact_pending", "approved", "sent", "converted",
  "confirmed", "paid", "rejected", "contacted",
]);

// tags and assignedAgencies stored as JSON strings; parse before returning.
function safeParseArray(v: unknown): unknown[] {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") {
    try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch { return []; }
  }
  return [];
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseLead(lead: any): any {
  if (!lead) return lead;
  return { ...lead, tags: safeParseArray(lead.tags), assignedAgencies: safeParseArray(lead.assignedAgencies) };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await verifyAdminRequest())) return unauthorizedJson();

  const lead = await prisma.lead.findUnique({
    where:   { id: params.id },
    include: { sends: true },
  });

  if (!lead) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(parseLead(lead));
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await verifyAdminRequest())) return unauthorizedJson();

  const body = await req.json().catch(() => ({}));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Record<string, any> = {};

  if (body.status !== undefined) {
    if (!VALID_STATUSES.has(body.status)) {
      return NextResponse.json({ error: "invalid_status" }, { status: 400 });
    }
    data.status = body.status;
    if (body.status !== "new") {
      data.lastContactedAt = new Date();
    }
  }

  if (body.internalNotes !== undefined) {
    data.internalNotes = typeof body.internalNotes === "string"
      ? body.internalNotes.slice(0, 5000)
      : null;
  }

  if (body.assignedTo !== undefined) {
    data.assignedTo = typeof body.assignedTo === "string"
      ? body.assignedTo.slice(0, 100)
      : null;
  }

  if (body.tags !== undefined && Array.isArray(body.tags)) {
    const tagsArr = (body.tags as unknown[])
      .filter((t): t is string => typeof t === "string")
      .map((t) => t.slice(0, 50))
      .slice(0, 20);
    data.tags = JSON.stringify(tagsArr);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "nothing_to_update" }, { status: 400 });
  }

  const existing = await prisma.lead.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const updated = await prisma.lead.update({
    where:   { id: params.id },
    data,
    include: { sends: true },
  });

  return NextResponse.json({ ok: true, lead: parseLead(updated) });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await verifyAdminRequest())) return unauthorizedJson();

  const existing = await prisma.lead.findUnique({ where: { id: params.id }, select: { id: true } });
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });

  await prisma.lead.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true, deleted: params.id });
}
