"use client";

/**
 * HeroRightColumn
 *
 * Wrapper that owns the "more jobs expanded" state so both
 * HomepageJobsCard and ETCostsTipCard can react to it.
 *
 * When the user opens the "See more vacancies" panel inside
 * HomepageJobsCard, ETCostsTipCard fades out smoothly and
 * becomes non-interactive. Closing it fades the card back in.
 */

import { useState } from "react";
import HomepageJobsCard from "@/components/HomepageJobsCard";
import ETCostsTipCard   from "@/components/ETCostsTipCard";

export default function HeroRightColumn({ totalJobs }: { totalJobs: number }) {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <HomepageJobsCard totalJobs={totalJobs} onExpandChange={setMoreOpen} />
      <ETCostsTipCard moreJobsOpen={moreOpen} />
    </div>
  );
}
