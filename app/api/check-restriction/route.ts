import { NextRequest, NextResponse } from "next/server";
import { checkRestriction, logBlockedAttempt, normalizePhone } from "@/lib/restriction-db";
import { isBotRequest } from "@/lib/bot-detection";

export const dynamic = "force-dynamic";

// ─── In-memory rate limiter — prevent phone enumeration ──────────────────────
// Simple sliding window: max 10 checks per IP per minute.
const RATE_WINDOW_MS  = 60_000;
const RATE_MAX_CHECKS = 10;
const rateLimitMap    = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now  = Date.now();
  const hits = (rateLimitMap.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  rateLimitMap.set(ip, hits);
  // Prune old entries to avoid memory leak (keep map small)
  if (rateLimitMap.size > 5000) {
    const cutoff = now - RATE_WINDOW_MS * 2;
    for (const [k, v] of rateLimitMap) {
      if (v.every((t) => t < cutoff)) rateLimitMap.delete(k);
    }
  }
  return hits.length > RATE_MAX_CHECKS;
}

// ─── POST /api/check-restriction ─────────────────────────────────────────────
// Body: { phone, jobId?, jobTitle? }
// Returns: { blocked: boolean }
// NEVER returns restriction reason or details — keeps internal info private.

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Bots never have a real phone — ignore silently
  if (isBotRequest(req)) {
    return NextResponse.json({ blocked: false });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim()
           ?? req.headers.get("x-real-ip")
           ?? "unknown";
  const ua = req.headers.get("user-agent") ?? "";

  if (isRateLimited(ip)) {
    console.warn(`[check-restriction] rate limited ip=${ip}`);
    return NextResponse.json({ blocked: false }); // fail-open: don't block on rate limit
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { phone, jobId, jobTitle } = body as {
      phone?:    string;
      jobId?:    string;
      jobTitle?: string;
    };

    if (!phone || typeof phone !== "string") {
      return NextResponse.json({ blocked: false });
    }

    const normalized = normalizePhone(phone);
    if (normalized.length < 7) {
      return NextResponse.json({ blocked: false });
    }

    const restriction = await checkRestriction(phone);

    if (restriction) {
      console.info(
        `[check-restriction] BLOCKED ip=${ip} phone=***${normalized.slice(-4)} ` +
        `restriction=${restriction.id} jobId=${jobId ?? ""}`,
      );

      // Log the blocked attempt (non-fatal)
      try {
        await logBlockedAttempt({
          restrictionId:     restriction.id,
          phoneNormalized:   normalized,
          attemptedJobId:    jobId,
          attemptedJobTitle: jobTitle,
          ipAddress:         ip !== "unknown" ? ip : undefined,
          userAgent:         ua || undefined,
        });
      } catch (logErr) {
        console.error("[check-restriction] failed to log blocked attempt:", logErr);
      }

      // Return blocked=true — no reason/details exposed publicly
      return NextResponse.json({ blocked: true });
    }

    return NextResponse.json({ blocked: false });
  } catch (err) {
    console.error("[check-restriction] error:", err);
    // Fail-open: if check errors, don't block the candidate
    return NextResponse.json({ blocked: false });
  }
}
