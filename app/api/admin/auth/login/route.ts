import { NextRequest, NextResponse } from "next/server";
import { adminLogin } from "@/lib/adminAuth";

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
