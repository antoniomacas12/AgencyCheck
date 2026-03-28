import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, unauthorizedJson } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await verifyAdminRequest())) return unauthorizedJson();

  const existing = await prisma.lead.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const updated = await prisma.lead.update({
    where: { id: params.id },
    data: {
      status:          "approved",
      lastContactedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true, status: updated.status });
}
