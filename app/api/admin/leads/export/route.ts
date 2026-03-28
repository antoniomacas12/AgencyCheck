/**
 * GET /api/admin/leads/export
 *
 * Exports all (or filtered) leads as a CSV file — for invoicing agencies.
 *
 * Query params (all optional — same as /api/admin/leads list):
 *   status, sourceType, accommodation, workType, q
 *
 * Returns: text/csv with filename attachment header.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, unauthorizedJson } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function escCsv(v: unknown): string {
  if (v == null) return "";
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function row(cells: unknown[]): string {
  return cells.map(escCsv).join(",");
}

function fmtDate(d: Date | null | undefined): string {
  if (!d) return "";
  return d.toISOString().split("T")[0];
}

export async function GET(req: NextRequest) {
  if (!(await verifyAdminRequest())) return unauthorizedJson();

  const { searchParams } = new URL(req.url);
  const status        = searchParams.get("status")        ?? undefined;
  const sourceType    = searchParams.get("sourceType")    ?? undefined;
  const accommodation = searchParams.get("accommodation");
  const workType      = searchParams.get("workType")      ?? undefined;
  const q             = searchParams.get("q")             ?? undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = {};
  if (status)                  where.status = status;
  if (sourceType)              where.sourceType = sourceType;
  if (accommodation === "yes") where.accommodationNeeded = true;
  if (accommodation === "no")  where.accommodationNeeded = false;
  if (workType)                where.preferredWorkType = workType;
  if (q) {
    where.OR = [
      { fullName: { contains: q } },
      { phone:    { contains: q } },
      { email:    { contains: q } },
    ];
  }

  try {
    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 10000, // max export
      include: { sends: { orderBy: { createdAt: "desc" }, take: 1 } },
    });

    const HEADER = row([
      "ID", "Submitted", "Status",
      "Full Name", "Phone", "Email", "WhatsApp Same",
      "Nationality", "Current Country", "Already in NL",
      "Work Type", "Region", "Needs Housing", "Driver License", "Can Work Weekends",
      "Experience", "Available From",
      "Source Page", "Source Type", "Source Label",
      "Assigned Agencies", "Sent At",
      "Confirmed At", "Worker Start Date", "Payout Amount (€)", "Paid At",
      "Assigned To", "Tags", "Notes",
    ]);

    const lines = [HEADER];

    for (const lead of leads) {
      const agencies: string[] = (() => {
        try { return JSON.parse(lead.assignedAgencies as string); } catch { return []; }
      })();
      const tags: string[] = (() => {
        try { return JSON.parse(lead.tags as string); } catch { return []; }
      })();

      lines.push(row([
        lead.id,
        fmtDate(lead.createdAt),
        lead.status,
        lead.fullName,
        lead.phone,
        lead.email ?? "",
        lead.whatsappSame ? "Yes" : "No",
        lead.nationality ?? "",
        lead.currentCountry ?? "",
        lead.alreadyInNL == null ? "" : lead.alreadyInNL ? "Yes" : "No",
        lead.preferredWorkType ?? "",
        lead.preferredRegion ?? "",
        lead.accommodationNeeded == null ? "" : lead.accommodationNeeded ? "Yes" : "No",
        lead.driversLicense == null ? "" : lead.driversLicense ? "Yes" : "No",
        lead.canWorkWeekends == null ? "" : lead.canWorkWeekends ? "Yes" : "No",
        lead.experienceLevel ?? "",
        lead.availableFrom ? fmtDate(lead.availableFrom) : "",
        lead.sourcePage,
        lead.sourceType,
        lead.sourceLabel ?? "",
        agencies.join("; "),
        lead.sentAt ? fmtDate(lead.sentAt) : "",
        lead.confirmedAt ? fmtDate(lead.confirmedAt) : "",
        lead.workerStartDate ? fmtDate(lead.workerStartDate) : "",
        lead.payoutAmount != null ? String(lead.payoutAmount) : "",
        lead.paidAt ? fmtDate(lead.paidAt) : "",
        lead.assignedTo ?? "",
        tags.join("; "),
        lead.notes ?? "",
      ]));
    }

    const csv  = lines.join("\r\n");
    const date = new Date().toISOString().split("T")[0];

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type":        "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="agencycheck-leads-${date}.csv"`,
        "Cache-Control":       "no-store",
      },
    });
  } catch (err) {
    console.error("[GET /api/admin/leads/export]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
