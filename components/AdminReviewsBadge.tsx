"use client";

/**
 * AdminReviewsBadge — polls /api/admin/reviews/stats every 30 seconds and
 * renders a red notification badge when new reviews have arrived in the last
 * 24 hours. Embedded in the admin nav bar next to the "Reviews" link.
 */

import { useEffect, useState } from "react";

interface Stats {
  total:      number;
  newLast24h: number;
}

export default function AdminReviewsBadge() {
  const [stats, setStats]   = useState<Stats | null>(null);
  const [blink, setBlink]   = useState(false);
  const [prevNew, setPrevNew] = useState<number | null>(null);

  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/reviews/stats");
      if (!res.ok) return;
      const data: Stats = await res.json();
      setStats(data);

      // Flash animation when count increases
      if (prevNew !== null && data.newLast24h > prevNew) {
        setBlink(true);
        setTimeout(() => setBlink(false), 1200);
      }
      setPrevNew(data.newLast24h);
    } catch {
      // silently ignore — just don't show the badge
    }
  }

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!stats) return null;

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-gray-300">Reviews</span>

      {/* Total count — always shown */}
      <span className="text-[10px] font-bold text-gray-500 tabular-nums">
        ({stats.total})
      </span>

      {/* NEW badge — only shown when there are recent submissions */}
      {stats.newLast24h > 0 && (
        <span
          className={`inline-flex items-center gap-0.5 text-[10px] font-black bg-red-500 text-white rounded-full px-1.5 py-0.5 leading-none transition-transform ${
            blink ? "scale-125" : "scale-100"
          }`}
        >
          <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
          {stats.newLast24h} new
        </span>
      )}
    </span>
  );
}
