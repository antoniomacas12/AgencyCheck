/**
 * AgencyCheck — The Truth Mark
 *
 * Brand spec (Logo9 copy.pdf):
 *   ViewBox      160 × 128 · base unit 8px
 *   Stroke       24px · linecap: square
 *   Left arm     A(8,80)→B(48,120) · 45° · Green #22C55E
 *   Right arm    B(48,120)→C(104,32) · 32.5° · Ink #0B1F14
 *   Gap          20px deliberate break · C(104,32) → D(124,20)
 *   Ghost        D(124,20)→E(152,0) · 35.5° · Ink · 15% opacity
 *   Wordmark     Plus Jakarta Sans 800 · "Agency" Ink / "Check" Green
 *                letter-spacing −0.03em
 *   Gap to text  ½ icon width
 */

import Link from "next/link";

type Size = "xs" | "sm" | "md" | "lg";

interface LogoProps {
  /** Wraps in a <Link> when provided */
  href?: string;
  size?: Size;
  /** Show wordmark alongside the mark — defaults true */
  wordmark?: boolean;
  className?: string;
}

// Icon dimensions (height drives everything; width = height × 160/128)
const HEIGHTS: Record<Size, number> = { xs: 18, sm: 24, md: 32, lg: 44 };
const FONT_SIZES: Record<Size, string> = {
  xs: "text-sm",
  sm: "text-base",
  md: "text-xl",
  lg: "text-3xl",
};

function TruthMark({ height }: { height: number }) {
  const width = Math.round(height * (160 / 128));
  return (
    <svg
      viewBox="0 0 160 128"
      width={width}
      height={height}
      fill="none"
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      {/* Left arm — Green · A(8,80)→B(48,120) */}
      <line
        x1="8"  y1="80"
        x2="48" y2="120"
        stroke="#22C55E"
        strokeWidth="24"
        strokeLinecap="square"
      />
      {/* Right arm — Ink · B(48,120)→C(104,32) */}
      <line
        x1="48"  y1="120"
        x2="104" y2="32"
        stroke="#0B1F14"
        strokeWidth="24"
        strokeLinecap="square"
      />
      {/* 20px gap — no stroke — deliberate severance */}
      {/* Ghost — Ink 15% · D(124,20)→E(152,0) */}
      <line
        x1="124" y1="20"
        x2="152" y2="0"
        stroke="#0B1F14"
        strokeWidth="24"
        strokeLinecap="square"
        opacity="0.15"
      />
    </svg>
  );
}

export default function Logo({
  href,
  size = "md",
  wordmark = true,
  className = "",
}: LogoProps) {
  const h = HEIGHTS[size];
  // Gap between icon and text = ½ icon width (spec)
  const gapPx = Math.round((h * (160 / 128)) / 2);

  const inner = (
    <span
      className={`inline-flex items-center ${className}`}
      style={{ gap: `${gapPx}px` }}
    >
      <TruthMark height={h} />
      {wordmark && (
        <span
          className={`font-extrabold ${FONT_SIZES[size]}`}
          style={{
            fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#0B1F14" }}>Agency</span>
          <span style={{ color: "#22C55E" }}>Check</span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label="AgencyCheck — home" style={{ display: "inline-flex" }}>
        {inner}
      </Link>
    );
  }
  return inner;
}
