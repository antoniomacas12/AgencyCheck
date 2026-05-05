/**
 * OG image for /apply — the "Now Hiring" landing page.
 * Shows all 4 open positions in a grid layout.
 * 1200×630px, dark green theme matching the page.
 */

import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import path from "path";

export const alt  = "Now Hiring in the Netherlands — Open Positions | AgencyCheck";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const JOBS = [
  { emoji: "🚛", title: "C+E Truck Driver",                 detail: "€150+/day · Dordrecht"       },
  { emoji: "🏭", title: "Food Production Operator",         detail: "Fast placement · Netherlands" },
  { emoji: "🍪", title: "Production Worker / Picker",       detail: "€16.12/hr · Near Maastricht"  },
  { emoji: "📦", title: "Warehouse Worker",                 detail: "Housing incl. · Netherlands"  },
];

function loadFont(filename: string): Buffer {
  return readFileSync(path.join(process.cwd(), "public", "fonts", filename));
}

export default function Image() {
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
        {/* Ambient glow top-left */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 550,
            height: 550,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 65%)",
            display: "flex",
          }}
        />
        {/* Ambient glow bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 65%)",
            display: "flex",
          }}
        />

        {/* TOP BAR */}
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
            <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px", display: "flex" }}>
              <span style={{ color: "#ffffff" }}>Agency</span>
              <span style={{ color: "#22C55E" }}>Check</span>
            </span>
          </div>

          {/* Badge */}
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
            <div style={{ width: 9, height: 9, borderRadius: "50%", backgroundColor: "#22C55E", display: "flex" }} />
            <span style={{ color: "#22C55E", fontSize: 14, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
              4 Positions Open
            </span>
          </div>
        </div>

        {/* HERO TEXT */}
        <div style={{ display: "flex", flexDirection: "column", padding: "28px 64px 0" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 68, fontWeight: 700, color: "#ffffff", lineHeight: 1.0, letterSpacing: "-1.5px" }}>
              Now Hiring
            </span>
            <span style={{ fontSize: 68, fontWeight: 700, color: "#22C55E", lineHeight: 1.0, letterSpacing: "-1.5px" }}>
              in the Netherlands
            </span>
          </div>
          <span style={{ color: "#6b7280", fontSize: 20, fontWeight: 400, marginTop: 10 }}>
            Apply directly via WhatsApp · No fees · Reply within 24h
          </span>
        </div>

        {/* JOB CARDS GRID */}
        <div
          style={{
            display: "flex",
            columnGap: 12,
            padding: "24px 64px 0",
            flex: 1,
          }}
        >
          {JOBS.map((job) => (
            <div
              key={job.title}
              style={{
                flex: 1,
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 16,
                padding: "16px 18px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span style={{ fontSize: 28, marginBottom: 8 }}>{job.emoji}</span>
              <span style={{ color: "#ffffff", fontSize: 16, fontWeight: 700, lineHeight: 1.2, marginBottom: 6 }}>
                {job.title}
              </span>
              <span style={{ color: "#4b5563", fontSize: 13, fontWeight: 400 }}>
                {job.detail}
              </span>
            </div>
          ))}
        </div>

        {/* BOTTOM BAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 64px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            marginTop: 20,
          }}
        >
          <span style={{ color: "#4b5563", fontSize: 17, fontWeight: 400 }}>agencycheck.io/apply</span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#22C55E",
              borderRadius: 14,
              padding: "12px 28px",
            }}
          >
            <span style={{ color: "#ffffff", fontSize: 18, fontWeight: 700 }}>
              Apply via WhatsApp →
            </span>
          </div>
        </div>

        {/* Green accent bar */}
        <div style={{ height: 6, backgroundColor: "#22C55E", display: "flex" }} />
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
