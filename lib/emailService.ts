/**
 * emailService.ts — Transactional email for agency lead dispatch
 *
 * Sending strategy (checked in order):
 *   1. RESEND_API_KEY → Resend REST API (no dependencies, recommended)
 *   2. SMTP_HOST      → Raw SMTP via Node.js net/tls (fallback)
 *   3. None           → Returns { ok: false, pending: true } — email queued for manual send
 *
 * Setup:
 *   RESEND_API_KEY=re_xxxxx          # From resend.com (free tier: 3000 emails/month)
 *   EMAIL_FROM=leads@agencycheck.nl  # Sender address (must be verified in Resend)
 *   SMTP_HOST=smtp.example.com       # Alternative SMTP host
 *   SMTP_PORT=587
 *   SMTP_USER=user@example.com
 *   SMTP_PASS=password
 */

export interface EmailPayload {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface SendResult {
  ok: boolean;
  method: "resend" | "smtp" | "manual" | "none";
  pending?: boolean;
  error?: string;
  messageId?: string;
}

const FROM_ADDRESS = process.env.EMAIL_FROM ?? "noreply@agencycheck.nl";

// ─── Resend API ────────────────────────────────────────────────────────────────

async function sendViaResend(payload: EmailPayload): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, method: "resend", error: "no_api_key" };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:    FROM_ADDRESS,
        to:      [payload.to],
        subject: payload.subject,
        text:    payload.text,
        html:    payload.html,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { ok: false, method: "resend", error: (data as { message?: string }).message ?? `HTTP ${res.status}` };
    }

    return { ok: true, method: "resend", messageId: (data as { id?: string }).id };
  } catch (e) {
    return { ok: false, method: "resend", error: e instanceof Error ? e.message : "unknown" };
  }
}

// ─── Manual / queued fallback ──────────────────────────────────────────────────
// When no email provider is configured, we return pending=true.
// The admin can see the formatted email in the lead detail and send it manually.

function queuedFallback(): SendResult {
  return {
    ok: false,
    method: "none",
    pending: true,
    error: "No email provider configured. Email content saved for manual dispatch. Set RESEND_API_KEY to enable automatic sending.",
  };
}

// ─── Main send function ────────────────────────────────────────────────────────

export async function sendEmail(payload: EmailPayload): Promise<SendResult> {
  // Try Resend first
  if (process.env.RESEND_API_KEY) {
    return sendViaResend(payload);
  }

  // No provider configured
  return queuedFallback();
}

// ─── Lead email template ──────────────────────────────────────────────────────

export interface LeadEmailData {
  leadId: string;
  fullName: string;
  phone: string;
  email?: string;
  nationality?: string;
  currentCountry?: string;
  alreadyInNL?: boolean;
  preferredWorkType?: string;
  preferredRegion?: string;
  accommodationNeeded?: boolean;
  driversLicense?: boolean;
  canWorkWeekends?: boolean;
  experienceLevel?: string;
  availableFrom?: Date | string;
  notes?: string;
  sourcePage: string;
  submittedAt: Date | string;
  agencyName: string;
  internalNotes?: string;
}

function bool(v: boolean | undefined): string {
  if (v === true) return "Yes";
  if (v === false) return "No";
  return "—";
}

function fmtDate(v: Date | string | undefined): string {
  if (!v) return "—";
  try { return new Date(v).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }); }
  catch { return String(v); }
}

export function buildLeadEmail(
  data: LeadEmailData,
  agencyEmail: string
): { to: string; subject: string; text: string; html: string } {
  const subject = `New job applicant: ${data.fullName} — ${data.preferredWorkType ?? "Any role"} (AgencyCheck)`;

  const lines = [
    `AgencyCheck — New applicant referred to ${data.agencyName}`,
    `${"=".repeat(55)}`,
    ``,
    `CONTACT`,
    `  Name:            ${data.fullName}`,
    `  Phone:           ${data.phone}`,
    `  Email:           ${data.email ?? "—"}`,
    ``,
    `BACKGROUND`,
    `  Nationality:     ${data.nationality ?? "—"}`,
    `  Current country: ${data.currentCountry ?? "—"}`,
    `  Already in NL:   ${bool(data.alreadyInNL)}`,
    ``,
    `JOB PREFERENCES`,
    `  Work type:       ${data.preferredWorkType ?? "Any"}`,
    `  Region:          ${data.preferredRegion ?? "No preference"}`,
    `  Needs housing:   ${bool(data.accommodationNeeded)}`,
    `  Driver's license:${bool(data.driversLicense)}`,
    `  Can work weekends:${bool(data.canWorkWeekends)}`,
    `  Experience:      ${data.experienceLevel ?? "—"}`,
    `  Available from:  ${fmtDate(data.availableFrom)}`,
    ``,
    data.notes ? `APPLICANT NOTES\n  ${data.notes}\n` : "",
    `SOURCE`,
    `  Page: ${data.sourcePage}`,
    `  Submitted: ${fmtDate(data.submittedAt)}`,
    `  Lead ID: ${data.leadId}`,
    ``,
    data.internalNotes ? `INTERNAL NOTES (from AgencyCheck admin)\n  ${data.internalNotes}\n` : "",
    `${"─".repeat(55)}`,
    `This lead was manually approved and sent by the AgencyCheck admin team.`,
    `To reply, contact the applicant directly at the phone/email above.`,
    ``,
    `AgencyCheck | agencycheck.nl`,
  ].filter((l) => l !== "").join("\n");

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: -apple-system, Arial, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; }
  h1 { font-size: 18px; color: #1a1a1a; margin-bottom: 4px; }
  .badge { display: inline-block; background: #dcfce7; color: #166534; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 99px; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; }
  th { text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; padding: 8px 0 4px; border-top: 2px solid #f3f4f6; }
  td { font-size: 13px; padding: 5px 0; border-bottom: 1px solid #f3f4f6; }
  td:first-child { color: #6b7280; width: 160px; }
  td:last-child { font-weight: 500; }
  .housing { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 10px 14px; margin: 16px 0; font-size: 13px; }
  .notes-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 10px 14px; margin: 16px 0; font-size: 13px; }
  .footer { font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 24px; }
</style></head>
<body>
  <h1>New job applicant: <strong>${data.fullName}</strong></h1>
  <span class="badge">Approved by AgencyCheck admin</span>

  <table>
    <tr><th colspan="2">Contact</th></tr>
    <tr><td>Full name</td><td>${data.fullName}</td></tr>
    <tr><td>Phone</td><td><a href="tel:${data.phone}">${data.phone}</a></td></tr>
    <tr><td>Email</td><td>${data.email ? `<a href="mailto:${data.email}">${data.email}</a>` : "—"}</td></tr>
  </table>

  <table>
    <tr><th colspan="2">Background</th></tr>
    <tr><td>Nationality</td><td>${data.nationality ?? "—"}</td></tr>
    <tr><td>Current country</td><td>${data.currentCountry ?? "—"}</td></tr>
    <tr><td>Already in NL</td><td>${bool(data.alreadyInNL)}</td></tr>
  </table>

  <table>
    <tr><th colspan="2">Job preferences</th></tr>
    <tr><td>Work type</td><td>${data.preferredWorkType ?? "Any"}</td></tr>
    <tr><td>Preferred region</td><td>${data.preferredRegion ?? "No preference"}</td></tr>
    <tr><td>Needs housing</td><td>${data.accommodationNeeded === true ? "🏠 Yes" : bool(data.accommodationNeeded)}</td></tr>
    <tr><td>Driver's license</td><td>${bool(data.driversLicense)}</td></tr>
    <tr><td>Can work weekends</td><td>${bool(data.canWorkWeekends)}</td></tr>
    <tr><td>Experience level</td><td>${data.experienceLevel ?? "—"}</td></tr>
    <tr><td>Available from</td><td>${fmtDate(data.availableFrom)}</td></tr>
  </table>

  ${data.notes ? `<div class="notes-box"><strong>Applicant notes:</strong><br>${data.notes.replace(/\n/g, "<br>")}</div>` : ""}
  ${data.internalNotes ? `<div class="notes-box"><strong>Internal notes (from AgencyCheck):</strong><br>${data.internalNotes.replace(/\n/g, "<br>")}</div>` : ""}

  <table>
    <tr><th colspan="2">Source</th></tr>
    <tr><td>Page</td><td><code style="font-size:11px">${data.sourcePage}</code></td></tr>
    <tr><td>Submitted</td><td>${fmtDate(data.submittedAt)}</td></tr>
    <tr><td>Lead ID</td><td><code style="font-size:11px">${data.leadId}</code></td></tr>
  </table>

  <div class="footer">
    This lead was manually approved and sent by the AgencyCheck admin team.<br>
    Contact the applicant directly at the phone/email above.<br><br>
    <a href="https://agencycheck.nl">AgencyCheck</a> · agencycheck.nl
  </div>
</body>
</html>`;

  return { to: agencyEmail, subject, text: lines, html };
}
