/**
 * Shared OG image template for job pages.
 * Called from each job's opengraph-image.tsx.
 * Uses next/og ImageResponse — 1200×630px, dark green theme.
 */

import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import path from "path";

export interface JobOGData {
  title: string;
  titleAccent?: string;   // second line in green (e.g. "/ Picker")
  location: string;
  pay: string;
  tag: string;
  emoji: string;
  applicants: number;
  altText: string;
}

function loadFont(filename: string): Buffer {
  return readFileSync(path.join(process.cwd(), "public", "fonts", filename));
}

export async function generateJobOGImage(job: JobOGData): Promise<ImageResponse> {
  const fontBold    = loadFont("SansBold.ttf");
  const fontRegular = loadFont("SansRegular.ttf");

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundColor: "#0B1F14",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Sans",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Ambient glow top-left ── */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: -120,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 65%)",
            display: "flex",
          }}
        />
        {/* ── Ambient glow bottom-right ── */}
        <div
          style={{
            position: "absolute",
            bottom: -80,
            right: -80,
            width: 450,
            height: 450,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%)",
            display: "flex",
          }}
        />

        {/* ── TOP BAR ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "44px 64px 0",
          }}
        >
          {/* AgencyCheck wordmark */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: "-0.5px",
                lineHeight: 1,
                display: "flex",
              }}
            >
              <span style={{ color: "#ffffff" }}>Agency</span>
              <span style={{ color: "#22C55E" }}>Check</span>
            </span>
          </div>

          {/* NOW HIRING badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              columnGap: 10,
              backgroundColor: "rgba(34,197,94,0.12)",
              border: "1.5px solid rgba(34,197,94,0.35)",
              borderRadius: 100,
              padding: "10px 22px",
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                backgroundColor: "#22C55E",
                display: "flex",
              }}
            />
            <span
              style={{
                color: "#22C55E",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Now Hiring
            </span>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 64px",
          }}
        >
          {/* Emoji */}
          <div style={{ fontSize: 72, marginBottom: 18, display: "flex" }}>
            {job.emoji}
          </div>

          {/* Job title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: 28,
            }}
          >
            <span
              style={{
                fontSize: 76,
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.0,
                letterSpacing: "-1.5px",
              }}
            >
              {job.title}
            </span>
            {job.titleAccent && (
              <span
                style={{
                  fontSize: 76,
                  fontWeight: 700,
                  color: "#22C55E",
                  lineHeight: 1.0,
                  letterSpacing: "-1.5px",
                }}
              >
                {job.titleAccent}
              </span>
            )}
          </div>

          {/* Pills row */}
          <div style={{ display: "flex", columnGap: 12 }}>
            {/* Location */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(255,255,255,0.07)",
                borderRadius: 100,
                padding: "10px 22px",
              }}
            >
              <span style={{ color: "#9ca3af", fontSize: 20, fontWeight: 400 }}>
                📍 {job.location}
              </span>
            </div>

            {/* Pay */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(34,197,94,0.12)",
                border: "1.5px solid rgba(34,197,94,0.35)",
                borderRadius: 100,
                padding: "10px 22px",
              }}
            >
              <span
                style={{ color: "#22C55E", fontSize: 20, fontWeight: 700 }}
              >
                {job.pay}
              </span>
            </div>

            {/* Tag */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 100,
                padding: "10px 22px",
              }}
            >
              <span style={{ color: "#6b7280", fontSize: 20, fontWeight: 400 }}>
                {job.tag}
              </span>
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 64px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span style={{ color: "#4b5563", fontSize: 17, fontWeight: 400 }}>
            agencycheck.io
          </span>

          <span style={{ color: "#4b5563", fontSize: 17, fontWeight: 400 }}>
            {job.applicants} applied this week
          </span>

          {/* WhatsApp CTA */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              columnGap: 10,
              backgroundColor: "#22C55E",
              borderRadius: 14,
              padding: "12px 28px",
            }}
          >
            <span
              style={{ color: "#ffffff", fontSize: 18, fontWeight: 700 }}
            >
              Apply via WhatsApp →
            </span>
          </div>
        </div>

        {/* ── Green accent bar at very bottom ── */}
        <div
          style={{
            height: 6,
            backgroundColor: "#22C55E",
            display: "flex",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Sans", data: fontBold,    weight: 700, style: "normal" },
        { name: "Sans", data: fontRegular, weight: 400, style: "normal" },
      ],
    }
  );
}
