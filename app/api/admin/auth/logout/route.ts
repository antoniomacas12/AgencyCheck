import { NextResponse } from "next/server";
import { adminLogout } from "@/lib/adminAuth";

// Handles both POST (from fetch) and GET (from form submission)
export async function POST() {
  await adminLogout();
  return NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"));
}

export async function GET() {
  await adminLogout();
  return NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"));
}
