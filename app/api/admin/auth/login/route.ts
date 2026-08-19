/**
 * POST /api/admin/auth/login
 *
 * Rate limiting recommendation (Phase 15):
 *   Vercel Firewall (vercel.com → Project → Firewall → Custom Rules) can be used
 *   to rate-limit this endpoint without adding npm dependencies.
 *   Suggested rule: Block any IP making > 10 requests to /api/admin/auth/login
 *   within a 60-second window.
 *   adminAuth.ts already adds a 300 ms artificial delay on failed attempts.
 */

import { NextRequest, NextResponse } from "next/server";
import { adminLogin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email    = typeof body.email    === "string" ? body.email.trim()    : "";
    const password = typeof body.password === "string" ? body.password.trim() : "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const result = await adminLogin(email, password);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/admin/auth/login]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
