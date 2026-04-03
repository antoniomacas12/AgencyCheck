"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { stripLocalePrefix, useT } from "@/lib/i18n";
import ReviewModal from "./ReviewModal";

interface StickyReviewBarProps {
  agencySlug:   string;
  agencyName:   string;
  reviewCount?: number;
}

export default function StickyReviewBar({
  agencySlug,
  agencyName,
  reviewCount = 0,
}: StickyReviewBarProps) {
  const [visible, setVisible] = useState(false);

  const pathname   = usePathname();
  const { locale } = stripLocalePrefix(pathname);
  const t          = useT(locale);

  // Show the bar after scrolling 300px
  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 300);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-35 sm:hidden
        transform transition-transform duration-300
        ${visible ? "translate-y-0" : "translate-y-full"}`}
      style={{ zIndex: 35 }}
    >
      {/* Safe area spacer for iOS home indicator */}
      <div
        className="bg-white border-t border-gray-200 px-4 pt-3 shadow-2xl"
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        <ReviewModal
          agencySlug={agencySlug}
          agencyName={agencyName}
          reviewCount={reviewCount}
          fullWidth
        />
        <p className="text-[10px] text-gray-400 text-center mt-1.5 leading-snug">
          {t("sticky.review_bar")}
        </p>
      </div>
    </div>
  );
}
