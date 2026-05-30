import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

// ─── Auto-create table on cold start ─────────────────────────────────────────
let tableReady = false;

async function ensureTable() {
  if (tableReady) return;
  try {
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS apply_funnel_events (
        "id"        TEXT        PRIMARY KEY,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "sessionId" TEXT        NOT NULL,
        "event"     TEXT        NOT NULL,
        "step"      TEXT        NOT NULL,
        "jobId"     TEXT,
        "source"    TEXT
      )
    `;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS afe_session_id_idx ON apply_funnel_events ("sessionId")`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS afe_created_at_idx ON apply_funnel_events ("createdAt")`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS afe_event_idx      ON apply_funnel_events ("event")`;
    tableReady = true;
  } catch {
    // Non-blocking — table may already exist
    tableReady = true;
  }
}

// ─── POST /api/funnel-event ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, event, step, jobId, source } = body;

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ ok: false, error: "sessionId required" }, { status: 400 });
    }
    if (!event || typeof event !== "string") {
      return NextResponse.json({ ok: false, error: "event required" }, { status: 400 });
    }
    if (!step || typeof step !== "string") {
      return NextResponse.json({ ok: false, error: "step required" }, { status: 400 });
    }

    await ensureTable();

    await prisma.$executeRaw`
      INSERT INTO apply_funnel_events ("id", "sessionId", "event", "step", "jobId", "source")
      VALUES (
        ${randomUUID()},
        ${sessionId},
        ${event},
        ${step},
        ${jobId ?? null},
        ${source ?? null}
      )
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[funnel-event] error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
