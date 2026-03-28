type HousingValue = "YES" | "NO" | "UNKNOWN";

interface HousingBadgeProps {
  housing: HousingValue;
  size?: "sm" | "md";
}

const config = {
  YES:     { label: "Housing incl. (deducted from salary)", icon: "🏠", classes: "bg-green-100 text-green-700" },
  NO:      { label: "No housing",       icon: "🚫", classes: "bg-red-50 text-red-600"     },
  UNKNOWN: { label: "Housing unknown",  icon: "❓", classes: "bg-gray-100 text-gray-500"  },
};

export default function HousingBadge({ housing, size = "md" }: HousingBadgeProps) {
  const { label, icon, classes } = config[housing] ?? config.UNKNOWN;

  return (
    <span
      className={`housing-badge ${classes} ${size === "sm" ? "text-xs" : "text-sm"}`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  );
}
