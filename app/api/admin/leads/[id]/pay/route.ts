/**
 * POST /api/admin/leads/[id]/pay
 *
 * Marks a lead as paid — agency has paid for this worker placement.
 * Sets status → "paid", records paidAt and optional payoutAmount.
 *
 * Body (all optional):
 *   { payoutAmount?: number, notes?: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, unauthorizedJson } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await verifyAdminRequest())) return unauthorizedJson();

  const body = await req.json().catch(() => ({}));

  const existing = await prisma.lead.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const payoutAmount =
    typeof body.payoutAmount === "number" && body.payoutAmount > 0
      ? body.payoutAmount
      : undefined;

  // Append payout note to internal notes
  let newNotes: string | undefined;
  if (typeof body.notes === "string" && body.notes.trim()) {
    const prev = existing.internalNotes ?? "";
    newNotes = prev
      ? `${prev}\n\n[Paid: ${new Date().toISOString().split("T")[0]}] ${body.notes.trim()}`
      : `[Paid: ${new Date().toISOString().split("T")[0]}] ${body.notes.trim()}`;
  }

  const updated = await prisma.lead.update({
    where: { id: params.id },
    data: {
      status:  "paid",
      paidAt:  new Date(),
      ...(payoutAmount !== undefined ? { payoutAmount } : {}),
      ...(newNotes !== undefined ? { internalNotes: newNotes } : {}),
    },
  });

  return NextResponse.json({ ok: true, status: updated.status, paidAt: updated.paidAt });
}
