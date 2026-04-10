"use client";

/**
 * HomepageStickyBar — fixed bottom CTA bar that fades in after 400 px of scroll.
 * Stays visible across the entire homepage, dismissed to sessionStorage so it
 * doesn't re-appear once the user has acted on it.
 */

import { useEffect, useState } from "react";
import ApplyBar from "./ApplyBar";

const DISMISSED_KEY = "ac_sticky_bar_dismissed";

export default function HomepageStickyBar() {
  const [visible,       setVisible]       = useState(false);
  const [dismissed,     setDismissed]     = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISSED_KEY)) {
        setDismissed(true);
        return;
      }
    } catch { /* ignore */ }

    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Hide bar when footer scrolls into view so it never covers footer content
    const footer = document.querySelector("footer");
    if (footer) {
      const observer = new IntersectionObserver(
        ([entry]) => setFooterVisible(entry.isIntersecting),
        { threshold: 0.05 }
      );
      observer.observe(footer);
      return () => {
        window.removeEventListener("scroll", onScroll);
        observer.disconnect();
      };
    }

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function dismiss() {
    try { sessionStorage.setItem(DISMISSED_KEY, "1"); } catch { /* ignore */ }
    setDismissed(true);
  }

  if (dismissed || !visible || footerVisible) return null;

  return (
    <div
      role="complementary"
      aria-label="Job matching CTA"
      className="hidden sm:block fixed bottom-0 inset-x-0 z-40 bg-gray-950/95 backdrop-blur-md border-t border-white/10 shadow-2xl"
      style={{ transform: visible ? "translateY(0)" : "translateY(100%)", transition: "transform 0.3s ease" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

        {/* Copy */}
        <div className="hidden sm:flex flex-col min-w-0">
          <span className="text-sm font-black text-white leading-none">
            Find safe jobs with transparent deductions
          </span>
          <span className="text-[11px] text-gray-400 mt-0.5">
            No paid rankings · Verified agencies · Free matching
          </span>
        </div>
        <span className="sm:hidden text-xs font-bold text-white truncate">
          Find safe jobs · No paid rankings
        </span>

        {/* CTA row */}
        <div className="flex items-center gap-3 shrink-0">
          <ApplyBar
            context={{
              sourcePage:           "/",
              sourceType:           "general_apply",
              sourceLabel:          "Homepage sticky bar",
              defaultAccommodation: true,
            }}
            ctaText="Get matched"
            buttonOnly
          />
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="text-gray-500 hover:text-gray-300 transition-colors p-1"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
