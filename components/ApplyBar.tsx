"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { stripLocalePrefix, useT } from "@/lib/i18n";
import HousingChoiceModal, { type HousingPreference } from "./HousingChoiceModal";
import ApplyModal, { type ApplyContext } from "./ApplyModal";

interface ApplyBarProps {
  context: ApplyContext;
  /** CTA headline shown in the inline block (overrides translated default) */
  headline?: string;
  /** Sub-copy below the headline (overrides translated default) */
  subline?: string;
  /** Button text (overrides translated default) */
  ctaText?: string;
  /** Show bar immediately (no scroll trigger) — useful for job pages */
  alwaysVisible?: boolean;
  /** Show inline CTA block (desktop sidebar / section CTA) in addition to sticky pill */
  showInline?: boolean;
  /** Inline block variant label — shown as a section heading */
  inlineLabel?: string;
  /**
   * Render just the button — no card wrapper, no headline/subline.
   * Use this when ApplyBar is placed inside dark-background sections
   * where the white card would be visually broken.
   */
  buttonOnly?: boolean;
}

// Flow state: closed → choosing (housing modal) → form (apply modal)
type FlowState = "closed" | "choosing" | "form";

export default function ApplyBar({
  context,
  headline,
  subline,
  ctaText,
  alwaysVisible = false,
  showInline = false,
  inlineLabel,
  buttonOnly = false,
}: ApplyBarProps) {
  const pathname = usePathname();
  const { locale } = stripLocalePrefix(pathname);
  const t = useT(locale);

  // Fall back to translated strings when caller doesn't override
  const resolvedHeadline = headline ?? t("apply_bar.headline");
  const resolvedSubline  = subline  ?? t("apply_bar.subline");
  const resolvedCta      = ctaText  ?? t("apply_bar.cta");

  const [flow, setFlow]       = useState<FlowState>("closed");
  const [housingPref, setHousingPref] = useState<HousingPreference | undefined>(undefined);

  function handleOpen() {
    setHousingPref(undefined);
    setFlow("choosing");
  }

  function handleChoice(choice: HousingPreference) {
    setHousingPref(choice);
    setFlow("form");
  }

  function handleClose() {
    setFlow("closed");
    setHousingPref(undefined);
  }

  return (
    <>
      {/* Sticky pill removed — FloatingStack (bottom-right) handles global floating CTA */}

      {/* ── Button-only mode — for use inside dark-background sections ────── */}
      {buttonOnly && (
        <button
          onClick={handleOpen}
          className="px-7 py-3 rounded-xl bg-white text-gray-900 font-bold text-sm hover:bg-gray-100 active:scale-[0.99] transition shadow-sm whitespace-nowrap"
        >
          {resolvedCta}
        </button>
      )}

      {/* ── Inline CTA block (optional, for light-background pages) ──────── */}
      {showInline && !buttonOnly && (
        <div className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6">
          {inlineLabel && (
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand-500 mb-2">{inlineLabel}</p>
          )}
          <h3 className="text-lg font-bold text-gray-900 mb-1">{resolvedHeadline}</h3>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">{resolvedSubline}</p>
          <button
            onClick={handleOpen}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 active:scale-[0.99] transition shadow-sm"
          >
            {resolvedCta}
          </button>
          <p className="text-xs text-gray-400 mt-2">{t("apply_bar.privacy")}</p>
        </div>
      )}

      {/* ── Housing choice modal ───────────────────────────────────────────── */}
      {flow === "choosing" && (
        <HousingChoiceModal onChoice={handleChoice} onClose={handleClose} />
      )}

      {/* ── Apply modal (opened after housing choice) ─────────────────────── */}
      {flow === "form" && (
        <ApplyModal
          context={context}
          housingPreference={housingPref}
          onClose={handleClose}
        />
      )}
    </>
  );
}
