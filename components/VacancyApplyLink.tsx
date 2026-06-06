"use client";

/**
 * Drop-in replacement for <Link> on vacancy apply CTAs.
 * Fires an apply_job_click GA4 event before navigation.
 */

import Link from "next/link";
import { trackApplyJobClick } from "@/lib/analytics";

interface Props {
  href: string;
  className?: string;
  children: React.ReactNode;
  vacancyTitle?: string;
  vacancySlug?: string;
  source?: "sticky_bar" | "hero_cta" | "final_cta" | "featured_card";
}

export default function VacancyApplyLink({
  href,
  className,
  children,
  vacancyTitle,
  vacancySlug,
  source,
}: Props) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        trackApplyJobClick({
          vacancy_title: vacancyTitle,
          vacancy_slug: vacancySlug,
          source,
        })
      }
    >
      {children}
    </Link>
  );
}
