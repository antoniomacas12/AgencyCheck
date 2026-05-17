import { NextRequest, NextResponse } from "next/server";
import { RECRUITER_SEEDS }           from "@/lib/recruiters";
import { isBotRequest }              from "@/lib/bot-detection";
import {
  ensureDbReady,
  pickNextRecruiter,
  saveClick,
}                                    from "@/lib/recruiter-db";

export const dynamic = "force-dynamic";

// ─── Param limits ─────────────────────────────────────────────────────────────
const MAX_JOB_ID_LEN    = 120;
const MAX_JOB_TITLE_LEN = 200;
const MAX_SOURCE_LEN    = 100;

function sanitise(value: string | null, maxLen: number): string | undefined {
  if (!value) return undefined;
  const cleaned = value.replace(/[\x00-\x1F\x7F]/g, "").trim();
  return cleaned.length > 0 ? cleaned.slice(0, maxLen) : undefined;
}

// ─── GET /api/referral-redirect ───────────────────────────────────────────────
// Opened via window.open() as a new tab — MUST be a GET.
// Query params: jobId, jobTitle, source
//
// Flow:
//   1.  Reject bots / crawlers → 204 No Content
//   2.  Sanitise params
//   3.  Pick recruiter (round-robin: fewest clicks, tie → lowest sortOrder)
//   4.  Save click record  ← non-fatal: failure logs but never blocks redirect
//   5.  302 redirect → recruiter WhatsApp with [src:AgencyCheck] in message

export async function GET(req: NextRequest): Promise<NextResponse> {
  const ts    = new Date().toISOString();
  const route = "GET /api/referral-redirect";
  const ua    = req.headers.get("user-agent") ?? "(none)";
  const ip    = req.headers.get("x-forwarded-for")
              ?? req.headers.get("x-real-ip")
              ?? "(unknown)";

  console.log(`[${route}] entered — ts=${ts} ip=${ip} ua="${ua}"`);

  // ── 1. Bot check ──────────────────────────────────────────────────────────
  if (isBotRequest(req)) {
    console.info(
      `[${route}] BOT blocked — ts=${ts} ua="${ua}" ip=${ip} ` +
      `params=${req.nextUrl.searchParams.toString()}`,
    );
    return new NextResponse(null, { status: 204 });
  }

  // ── 2. Param sanitisation ─────────────────────────────────────────────────
  const { searchParams } = req.nextUrl;
  const jobId    = sanitise(searchParams.get("jobId"),    MAX_JOB_ID_LEN);
  const jobTitle = sanitise(searchParams.get("jobTitle"), MAX_JOB_TITLE_LEN);
  const source   = sanitise(searchParams.get("source"),   MAX_SOURCE_LEN) ?? "AgencyCheck";

  console.log(
    `[${route}] params — jobId="${jobId ?? ""}" jobTitle="${jobTitle ?? ""}" source="${source}"`,
  );

  // ── 3. Ensure tables exist + pick recruiter ───────────────────────────────
  let assigned: { name: string; waUrl: string } = RECRUITER_SEEDS[0]; // safe fallback

  try {
    await ensureDbReady();

    const pick = await pickNextRecruiter();

    if (pick) {
      assigned = pick;
      console.log(
        `[${route}] recruiter selected — id=${pick.id} name="${pick.name}" waUrl=${pick.waUrl}`,
      );
    } else {
      console.warn(
        `[${route}] no enabled recruiters — falling back to seed[0] ` +
        `name="${RECRUITER_SEEDS[0].name}" ts=${ts}`,
      );
    }
  } catch (err) {
    console.error(
      `[${route}] RECRUITER LOOKUP FAILED — falling back to seed[0]. ` +
      `ts=${ts} ua="${ua}" ip=${ip}`,
      err,
    );
  }

  // ── 4. Save click record (non-fatal) ──────────────────────────────────────
  try {
    const clickId = await saveClick({
      recruiter:   assigned.name,
      recruiterWa: assigned.waUrl,
      jobId,
      jobTitle,
    });
    console.log(`[${route}] assignment saved — clickId=${clickId} recruiter="${assigned.name}"`);
  } catch (err) {
    // DB failure must NEVER block the candidate redirect
    console.error(
      `[${route}] ASSIGNMENT INSERT FAILED (candidate will still be redirected). ` +
      `ts=${ts} ua="${ua}" ip=${ip} recruiter="${assigned.name}" ` +
      `jobId="${jobId ?? ""}" jobTitle="${jobTitle ?? ""}"`,
      err,
    );
  }

  // ── 5. Redirect to recruiter WhatsApp ─────────────────────────────────────
  // [src:AgencyCheck] is hardcoded — permanent proof of origin even if
  // the candidate edits the pre-filled message before sending.
  const waMsg = jobTitle
    ? `Hi, I want to apply for: ${jobTitle} [src:AgencyCheck]`
    : `Hi, I'm applying via AgencyCheck [src:AgencyCheck]`;
  const waUrl = `${assigned.waUrl}?text=${encodeURIComponent(waMsg)}`;

  console.log(`[${route}] redirect executed — recruiter="${assigned.name}" waUrl=${waUrl}`);

  return NextResponse.redirect(waUrl, 302);
}
