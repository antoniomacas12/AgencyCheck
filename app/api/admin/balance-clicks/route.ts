import { NextRequest, NextResponse } from "next/server";
import { prisma }          from "@/lib/prisma";
import { RECRUITER_SEEDS } from "@/lib/recruiters";
import { ensureDbReady }   from "@/lib/recruiter-db";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/balance-clicks
 *
 * Sets a baseline of 10 clicks for EACH recruiter so the round-robin
 * starts balanced. Idempotent — only adds rows up to the target count,
 * never removes existing real clicks.
 *
 * Call once after deploy to reset the balance.
 */
export async function POST(_req: NextRequest) {
  try {
    await ensureDbReady();

    const TARGET = 10;
    const results: { recruiter: string; existing: number; added: number }[] = [];

    for (const seed of RECRUITER_SEEDS) {
      // Count existing clicks for this recruiter
      const [row] = await prisma.$queryRaw<{ cnt: bigint }[]>`
        SELECT COUNT(*) AS cnt
        FROM referral_clicks
        WHERE "recruiter" = ${seed.name}
      `;
      const existing = Number(row.cnt);
      const toAdd    = Math.max(0, TARGET - existing);

      for (let i = 0; i < toAdd; i++) {
        const id = crypto.randomUUID();
        await prisma.$executeRaw`
          INSERT INTO referral_clicks
            ("id", "recruiter", "recruiterWa", "jobId", "jobTitle", "source")
          VALUES
            (${id}, ${seed.name}, ${seed.waUrl}, 'baseline', 'Balance seed', 'baseline-seed')
        `;
      }

      results.push({ recruiter: seed.name, existing, added: toAdd });
      console.log(`[balance-clicks] ${seed.name}: existing=${existing} added=${toAdd}`);
    }

    return NextResponse.json({ ok: true, results });
  } catch (err) {
    console.error("[balance-clicks] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
