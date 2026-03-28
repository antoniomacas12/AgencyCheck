import { getScoreTier, SCORE_TIER_CONFIG } from "@/lib/scoreLogic";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScoreBadgeProps {
  score:        number;
  reviewCount?: number; // if < 3, score is not meaningful — show placeholder instead
  size?:        "sm" | "md" | "lg";
  showLabel?:   boolean;
  showBar?:     boolean;  // horizontal score bar (used on compare/profile pages)
}

// ─── Size map ────────────────────────────────────────────────────────────────

const SIZE: Record<NonNullable<ScoreBadgeProps["size"]>, string> = {
  sm: "w-10 h-10 text-xs font-bold",
  md: "w-12 h-12 text-sm font-bold",
  lg: "w-16 h-16 text-lg font-extrabold",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ScoreBadge({
  score,
  reviewCount,
  size      = "md",
  showLabel = false,
  showBar   = false,
}: ScoreBadgeProps) {
  // Don't show a score if there aren't enough reviews to make it meaningful
  const hasEnoughReviews = reviewCount === undefined || reviewCount >= 3;

  if (!hasEnoughReviews) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div
          className={`flex items-center justify-center rounded-full ring-2 bg-gray-100 text-gray-400 ring-gray-200 ${SIZE[size]}`}
          title="Not enough reviews to calculate a score"
          aria-label="Limited review data"
        >
          <span className="text-[10px] font-medium leading-tight text-center">—</span>
        </div>
        {showLabel && (
          <span className="text-xs font-medium text-gray-400">Limited data</span>
        )}
        {showBar && (
          <div className="w-full mt-1">
            <div className="h-1.5 w-full rounded-full bg-gray-100" />
            <p className="text-[10px] text-gray-400 mt-0.5 text-center">No score yet</p>
          </div>
        )}
      </div>
    );
  }

  const tier   = getScoreTier(score);
  const config = SCORE_TIER_CONFIG[tier];

  return (
    <div className="flex flex-col items-center gap-1">

      {/* Circular badge */}
      <div
        className={`flex items-center justify-center rounded-full ring-2 ${config.bg} ${config.text} ${config.ring} ${SIZE[size]}`}
        title={`Agency score: ${score}/100`}
        aria-label={`Score ${score} out of 100 — ${config.label}`}
      >
        {score}
      </div>

      {/* Tier label */}
      {showLabel && (
        <span className={`text-xs font-semibold ${config.text}`}>
          {config.label}
        </span>
      )}

      {/* Horizontal score bar */}
      {showBar && (
        <div className="w-full mt-1">
          <div className={`h-1.5 w-full rounded-full ${config.barBg}`}>
            <div
              className={`h-1.5 rounded-full ${config.bar} transition-all duration-500`}
              style={{ width: `${Math.min(score, 100)}%` }}
              role="progressbar"
              aria-valuenow={score}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5 text-center">
            {score} / 100
          </p>
        </div>
      )}
    </div>
  );
}
