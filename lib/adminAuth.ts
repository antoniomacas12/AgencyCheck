/**
 * adminAuth.ts — Server-side admin authentication utilities
 *
 * Uses HMAC-SHA256 signed session tokens stored in an HTTP-only cookie.
 * Runs in Node.js (Server Components, Route Handlers, Server Actions).
 *
 * Environment variables (set in .env.local or production env):
 *   ADMIN_EMAIL            admin login email (default: admin@agencycheck.io)
 *   ADMIN_PASSWORD         admin login password (default: CHANGE_THIS_NOW)
 *   ADMIN_SESSION_SECRET   32+ char random string for HMAC signing
 */

import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ─── Config ───────────────────────────────────────────────────────────────────

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    ?? "admin@agencycheck.io";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "CHANGE_THIS_PASSWORD";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? "dev-secret-please-change-in-production-32chars";
const COOKIE_NAME    = "ac_admin_session";
const SESSION_TTL    = 60 * 60 * 8; // 8 hours in seconds
const SESSION_MS     = SESSION_TTL * 1000;

// ─── Token helpers ────────────────────────────────────────────────────────────

function signToken(payload: string): string {
  return crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("hex");
}

function makeSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ sub: "admin", iat: Date.now(), exp: Date.now() + SESSION_MS })
  ).toString("base64url");
  const sig = signToken(payload);
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string): boolean {
  const dotIdx = token.lastIndexOf(".");
  if (dotIdx < 0) return false;
  const payload = token.slice(0, dotIdx);
  const sig     = token.slice(dotIdx + 1);
  // Constant-time comparison to prevent timing attacks
  const expected = signToken(payload);
  if (expected.length !== sig.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_TTL,
};

// ─── Auth actions ─────────────────────────────────────────────────────────────

/**
 * Attempt to log in with the given credentials.
 * Returns { ok: true } on success, { ok: false, error } on failure.
 */
export async function adminLogin(
  email: string,
  password: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  // Constant-time comparison for email
  const emailMatch =
    email.length === ADMIN_EMAIL.length &&
    crypto.timingSafeEqual(Buffer.from(email), Buffer.from(ADMIN_EMAIL));

  // Constant-time comparison for password
  const passwordMatch =
    password.length === ADMIN_PASSWORD.length &&
    crypto.timingSafeEqual(Buffer.from(password), Buffer.from(ADMIN_PASSWORD));

  if (!emailMatch || !passwordMatch) {
    // Introduce a small artificial delay to slow brute-force
    await new Promise((r) => setTimeout(r, 300));
    return { ok: false, error: "Invalid email or password" };
  }

  const token = makeSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, COOKIE_OPTIONS);
  return { ok: true };
}

/**
 * Log out the current admin session.
 */
export async function adminLogout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Check if the current request has a valid admin session.
 * Returns true/false — does NOT redirect.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

/**
 * Require admin authentication.
 * Redirects to /admin/login if not authenticated.
 * Use at the top of admin Server Components and Route Handlers.
 */
export async function requireAdmin(): Promise<void> {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    redirect("/admin/login");
  }
}

/**
 * Verify auth from an API Route Handler.
 * Returns the session token value if valid, null otherwise.
 * Use in /api/admin/* routes.
 */
export async function verifyAdminRequest(): Promise<boolean> {
  return isAdminAuthenticated();
}

// ─── Utility: unauthorized response ──────────────────────────────────────────

export function unauthorizedJson() {
  return new Response(JSON.stringify({ error: "unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}
