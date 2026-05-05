// ApplicantBadge — social proof counter for job pages & cards
// Pass `count` (applications this week) and optional `hoursAgo` (last application).

interface Props {
  count: number;
  hoursAgo?: number;
  size?: "sm" | "md";
}

export default function ApplicantBadge({ count, hoursAgo, size = "md" }: Props) {
  const isSmall = size === "sm";

  return (
    <div className={`inline-flex items-center gap-2 ${isSmall ? "gap-1.5" : "gap-2"}`}>
      {/* People icons */}
      <div className="flex -space-x-1.5">
        {["bg-blue-400", "bg-emerald-400", "bg-amber-400"].map((color, i) => (
          <span
            key={i}
            className={`
              rounded-full border-2 border-[#0B1F14] ${color} opacity-80
              ${isSmall ? "w-4 h-4" : "w-5 h-5"}
            `}
          />
        ))}
      </div>

      {/* Text */}
      <span className={`text-gray-400 ${isSmall ? "text-[11px]" : "text-[12px]"}`}>
        <span className="text-white font-bold">{count}</span> applied this week
        {hoursAgo !== undefined && (
          <span className="text-gray-600"> · last {hoursAgo}h ago</span>
        )}
      </span>
    </div>
  );
}
