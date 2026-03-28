import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, unauthorizedJson } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await verifyAdminRequest())) return unauthorizedJson();

  const body   = await req.json().catch(() => ({}));
  const reason = typeof body.reason === "string" ? body.reason.slice(0, 500) : undefined;

  const existing = await prisma.lead.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // Append reason to existing notes instead of overwriting
  let newNotes: string | undefined;
  if (reason) {
    const prevNotes = existing.internalNotes ?? "";
    newNotes = prevNotes
      ? `${prevNotes}\n\n[Rejected: ${new Date().toISOString().split("T")[0]}] ${reason}`
      : `[Rejected: ${new Date().toISOString().split("T")[0]}] ${reason}`;
  }

  const updated = await prisma.lead.update({
    where: { id: params.id },
    data: {
      status: "rejected",
      ...(newNotes !== undefined ? { internalNotes: newNotes } : {}),
    },
  });

  return NextResponse.json({ ok: true, status: updated.status });
}
