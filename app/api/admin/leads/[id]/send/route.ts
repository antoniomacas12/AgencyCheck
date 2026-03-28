/**
 * /api/admin/leads/[id]/send
 *
 * GET  — returns the full list of agency contacts (for the send-lead UI).
 * POST — sends a lead to one or more selected agencies, records send history.
 *
 * Agency registry lives in lib/agencies.ts — NOT exported from here.
 * Next.js App Router only allows HTTP-method handlers and a small set of
 * config constants (dynamic, runtime, revalidate …) as named exports from
 * route files. Any other export causes a build error.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, unauthorizedJson } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { sendEmail, buildLeadEmail } from "@/lib/emailService";
import { getAllAgencyContacts } from "@/lib/agencies";

export const dynamic = "force-dynamic";

// ─── GET /api/admin/leads/[id]/send ──────────────────────────────────────────
// Returns the agency registry so the admin UI can render the checkbox list.

export async function GET(_req: NextRequest) {
  if (!(await verifyAdminRequest())) return unauthorizedJson();
  return NextResponse.json({ agencies: getAllAgencyContacts() });
}

// ─── POST /api/admin/leads/[id]/send ─────────────────────────────────────────
// Sends the lead to each selected agency by email and persists a LeadSend row.

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await verifyAdminRequest())) return unauthorizedJson();

  try {
    const body = await req.json();

    if (!Array.isArray(body.agencies) || body.agencies.length === 0) {
      return NextResponse.json({ error: "agencies_required" }, { status: 400 });
    }

    const lead = await prisma.lead.findUnique({ where: { id: params.id } });
    if (!lead) return NextResponse.json({ error: "not_found" }, { status: 404 });

    // Validate each agency object from the request body (max 10 per call).
    const agenciesToSend = (body.agencies as unknown[])
      .filter(
        (a): a is { slug: string; name: string; email: string } =>
          typeof a === "object" && a !== null &&
          typeof (a as Record<string, unknown>).slug  === "string" &&
          typeof (a as Record<string, unknown>).name  === "string" &&
          typeof (a as Record<string, unknown>).email === "string"
      )
      .slice(0, 10);

    if (agenciesToSend.length === 0) {
      return NextResponse.json({ error: "no_valid_agencies" }, { status: 400 });
    }

    // Build email payloads, send them, and capture results in a single pass so
    // we can persist LeadSend rows without a second call to buildLeadEmail.
    const results: Array<{
      agencySlug:   string;
      agencyName:   string;
      ok:           boolean;
      method:       string;
      error?:       string;
      pending?:     boolean;
      emailSubject: string;
      emailBody:    string;
    }> = [];

    for (const agency of agenciesToSend) {
      const emailData = buildLeadEmail(
        {
          leadId:              lead.id,
          fullName:            lead.fullName,
          phone:               lead.phone,
          email:               lead.email               ?? undefined,
          nationality:         lead.nationality          ?? undefined,
          currentCountry:      lead.currentCountry       ?? undefined,
          alreadyInNL:         lead.alreadyInNL          ?? undefined,
          preferredWorkType:   lead.preferredWorkType    ?? undefined,
          preferredRegion:     lead.preferredRegion      ?? undefined,
          accommodationNeeded: lead.accommodationNeeded  ?? undefined,
          driversLicense:      lead.driversLicense       ?? undefined,
          canWorkWeekends:     lead.canWorkWeekends       ?? undefined,
          experienceLevel:     lead.experienceLevel       ?? undefined,
          availableFrom:       lead.availableFrom?.toISOString().split("T")[0],
          notes:               lead.notes                ?? undefined,
          sourcePage:          lead.sourcePage,
          submittedAt:         lead.createdAt.toISOString(),
          agencyName:          agency.name,
          internalNotes:       lead.internalNotes        ?? undefined,
        },
        agency.email
      );

      const sendResult = await sendEmail(emailData);

      results.push({
        agencySlug:   agency.slug,
        agencyName:   agency.name,
        ok:           sendResult.ok || !!sendResult.pending,
        method:       sendResult.method,
        error:        sendResult.error,
        pending:      sendResult.pending,
        emailSubject: emailData.subject,
        emailBody:    emailData.text,
      });
    }

    // Persist one LeadSend row per agency so the admin detail page shows history.
    for (let i = 0; i < agenciesToSend.length; i++) {
      const agency = agenciesToSend[i];
      const result = results[i];

      await prisma.leadSend.create({
        data: {
          leadId:       params.id,
          agencySlug:   agency.slug,
          agencyName:   agency.name,
          agencyEmail:  agency.email || null,
          method:       result.method,
          status:       result.ok ? "sent" : result.pending ? "pending" : "failed",
          errorMsg:     result.error ?? null,
          emailSubject: result.emailSubject,
          emailBody:    result.emailBody,
        },
      });
    }

    // Merge newly contacted agency slugs into the lead's assignedAgencies list.
    const currentAgencies: string[] = JSON.parse(
      (lead.assignedAgencies as unknown as string) || "[]"
    );
    const mergedSlugs = [...new Set([...currentAgencies, ...agenciesToSend.map((a) => a.slug)])];
    const anySuccess  = results.some((r) => r.ok);

    await prisma.lead.update({
      where: { id: params.id },
      data: {
        status:           anySuccess ? "sent" : lead.status,
        assignedAgencies: JSON.stringify(mergedSlugs),
        sentAt:           lead.sentAt ?? new Date(),
        lastContactedAt:  new Date(),
      },
    });

    return NextResponse.json({ ok: true, results });
  } catch (err) {
    console.error("[POST /api/admin/leads/[id]/send]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
