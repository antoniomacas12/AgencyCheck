"use client";

/**
 * VerificationBadge — shows data confidence level
 * Used on agency pages for housing, transport, salary fields
 */

export type VerificationStatus = "verified" | "worker_reported" | "unknown";

interface VerificationBadgeProps {
  status:     VerificationStatus;
  sourceUrl?: string;
  size?:      "sm" | "md";
  showIcon?:  boolean;
}

const CONFIG: Record<VerificationStatus, {
  label: string;
  badge: string;
  icon:  string;
  dot:   string;
}> = {
  verified: {
    label: "Verified by official source",
    badge: "bg-green-50 border-green-200 text-green-800",
    icon:  "✅",
    dot:   "bg-green-500",
  },
  worker_reported: {
    label: "Reported by workers",
    badge: "bg-amber-50 border-amber-200 text-amber-800",
    icon:  "👷",
    dot:   "bg-amber-400",
  },
  unknown: {
    label: "Unknown / not confirmed",
    badge: "bg-gray-50 border-gray-200 text-gray-500",
    icon:  "❓",
    dot:   "bg-gray-300",
  },
};

export default function VerificationBadge({
  status,
  sourceUrl,
  size = "md",
  showIcon = true,
}: VerificationBadgeProps) {
  const cfg = CONFIG[status] ?? CONFIG.unknown;
  const cls = size === "sm"
    ? "text-[10px] px-1.5 py-0.5"
    : "text-xs px-2.5 py-0.5";

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium border rounded-full ${cls} ${cfg.badge}`}
      title={cfg.label}
    >
      {showIcon && <span>{cfg.icon}</span>}
      {cfg.label}
      {sourceUrl && sourceUrl.startsWith("http") && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-60 hover:opacity-100 underline ml-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          ↗
        </a>
      )}
    </span>
  );
}

/** Compact dot-only version for use in tables/cards */
export function VerificationDot({ status }: { status: VerificationStatus }) {
  const cfg = CONFIG[status] ?? CONFIG.unknown;
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${cfg.dot}`}
      title={cfg.label}
    />
  );
}
