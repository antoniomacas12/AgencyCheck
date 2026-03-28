/**
 * POST /api/admin/leads/[id]/confirm
 *
 * Marks a lead as confirmed — the worker has started at the agency.
 * Sets status → "confirmed", records confirmedAt and optional workerStartDate.
 *
 * Body (all optional):
 *   { workerStartDate?: string (ISO date, e.g. "2026-04-01"), payoutAmount?: number }
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

  let workerStartDate: Date | undefined;
  if (typeof body.workerStartDate === "string") {
    const d = new Date(body.workerStartDate);
    if (!isNaN(d.getTime())) workerStartDate = d;
  }

  const payoutAmount =
    typeof body.payoutAmount === "number" && body.payoutAmount > 0
      ? body.payoutAmount
      : undefined;

  const updated = await prisma.lead.update({
    where: { id: params.id },
    data: {
      status:          "confirmed",
      confirmedAt:     new Date(),
      lastContactedAt: new Date(),
      ...(workerStartDate !== undefined ? { workerStartDate } : {}),
      ...(payoutAmount   !== undefined ? { payoutAmount }   : {}),
    },
  });

  return NextResponse.json({ ok: true, status: updated.status });
}
