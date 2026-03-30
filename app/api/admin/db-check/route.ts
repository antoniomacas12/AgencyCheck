/**
 * GET /api/admin/db-check
 * Admin-only diagnostic endpoint.
 * Returns sanitised connection info (host, port, user — NO password)
 * plus a live connectivity test so you can confirm what DATABASE_URL
 * Vercel is actually using at runtime.
 */
import { NextResponse } from "next/server";
import { verifyAdminRequest, unauthorizedJson } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function parseUrl(raw: string | undefined) {
  if (!raw) return { error: "DATABASE_URL is not set" };
  try {
    const u = new URL(raw);
    return {
      host:     u.hostname,
      port:     u.port || "5432",
      user:     u.username,          // password intentionally omitted
      database: u.pathname.replace(/^\//, ""),
      params:   u.search || "(none)",
    };
  } catch {
    return { error: "DATABASE_URL is set but could not be parsed" };
  }
}

export async function GET() {
  if (!(await verifyAdminRequest())) return unauthorizedJson();

  const info = parseUrl(process.env.DATABASE_URL);

  // Attempt a live query — $queryRaw is the lightest possible round-trip
  let dbOk  = false;
  let dbErr = "";
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch (e) {
    dbErr = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json({
    connection: info,
    live_query: dbOk ? "ok" : "failed",
    live_error: dbErr || undefined,
    note: "password is intentionally hidden — only host/user/port shown",
  });
}
