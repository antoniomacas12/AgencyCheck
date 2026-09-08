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
import type { Locale }  from "@/lib/i18n";

export default function HeroRightColumn({ totalJobs, locale = "en" }: { totalJobs: number; locale?: Locale }) {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <HomepageJobsCard totalJobs={totalJobs} onExpandChange={setMoreOpen} />
      <ETCostsTipCard moreJobsOpen={moreOpen} locale={locale} />
    </div>
  );
}
