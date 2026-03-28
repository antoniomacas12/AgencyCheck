import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, unauthorizedJson } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { sendEmail, buildLeadEmail } from "@/lib/emailService";

// ─── Agency registry ──────────────────────────────────────────────────────────

interface AgencyContact {
  slug: string;
  name: string;
  email: string;
}

const AGENCY_CONTACTS: AgencyContact[] = [
  { slug: "hobij",                  name: "HOBIJ",                 email: process.env.AGENCY_EMAIL_HOBIJ                   ?? "" },
  { slug: "nl-jobs",                name: "NL Jobs",               email: process.env.AGENCY_EMAIL_NL_JOBS                 ?? "" },
  { slug: "westflex",               name: "Westflex",              email: process.env.AGENCY_EMAIL_WESTFLEX                ?? "" },
  { slug: "carriere",               name: "Carrière",              email: process.env.AGENCY_EMAIL_CARRIERE                ?? "" },
  { slug: "international-flex-job", name: "International Flex Job", email: process.env.AGENCY_EMAIL_INTERNATIONAL_FLEX_JOB ?? "" },
  { slug: "covebo",                 name: "Covebo",                email: process.env.AGENCY_EMAIL_COVEBO                  ?? "" },
  { slug: "otto-workforce",         name: "Otto Work Force",       email: process.env.AGENCY_EMAIL_OTTO_WORKFORCE           ?? "" },
  { slug: "randstad-nederland",     name: "Randstad Nederland",    email: process.env.AGENCY_EMAIL_RANDSTAD                ?? "" },
  { slug: "tempo-team",             name: "Tempo-Team",            email: process.env.AGENCY_EMAIL_TEMPO_TEAM               ?? "" },
];

export function getAllAgencyContacts(): AgencyContact[] {
  return AGENCY_CONTACTS;
}

// ─── POST /api/admin/leads/[id]/send ─────────────────────────────────────────

export const dynamic = "force-dynamic";

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

    const agenciesToSend = (body.agencies as unknown[]).filter(
      (a): a is { slug: string; name: string; email: string } =>
        typeof a === "object" && a !== null &&
        typeof (a as Record<string, unknown>).slug === "string" &&
        typeof (a as Record<string, unknown>).name === "string" &&
        typeof (a as Record<string, unknown>).email === "string"
    ).slice(0, 10);

    if (agenciesToSend.length === 0) {
      return NextResponse.json({ error: "no_valid_agencies" }, { status: 400 });
    }

    // Build email payloads + send + collect results in a single pass
    const results: Array<{
      agencySlug: string; agencyName: string;
      ok: boolean; method: string; error?: string; pending?: boolean;
      emailSubject: string; emailBody: string;
    }> = [];

    for (const agency of agenciesToSend) {
      const emailData = buildLeadEmail(
        {
          leadId:              lead.id,
          fullName:            lead.fullName,
          phone:               lead.phone,
          email:               lead.email ?? undefined,
          nationality:         lead.nationality ?? undefined,
          currentCountry:      lead.currentCountry ?? undefined,
          alreadyInNL:         lead.alreadyInNL ?? undefined,
          preferredWorkType:   lead.preferredWorkType ?? undefined,
          preferredRegion:     lead.preferredRegion ?? undefined,
          accommodationNeeded: lead.accommodationNeeded ?? undefined,
          driversLicense:      lead.driversLicense ?? undefined,
          canWorkWeekends:     lead.canWorkWeekends ?? undefined,
          experienceLevel:     lead.experienceLevel ?? undefined,
          availableFrom:       lead.availableFrom?.toISOString().split("T")[0],
          notes:               lead.notes ?? undefined,
          sourcePage:          lead.sourcePage,
          submittedAt:         lead.createdAt.toISOString(),
          agencyName:          agency.name,
          internalNotes:       lead.internalNotes ?? undefined,
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

    // ── Persist send history to DB ───────────────────────────────────────────
    // Create one LeadSend row per agency so the admin detail page shows history.
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

    // Update lead in database
    const currentAgencies: string[] = JSON.parse((lead.assignedAgencies as unknown as string) || "[]");
    const allSlugs        = agenciesToSend.map((a) => a.slug);
    const mergedSlugs     = [...new Set([...currentAgencies, ...allSlugs])];
    const anySuccess      = results.some((r) => r.ok);

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

export async function GET(_req: NextRequest) {
  if (!(await verifyAdminRequest())) return unauthorizedJson();
  return NextResponse.json({ agencies: getAllAgencyContacts() });
}
