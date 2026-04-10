"use client";

/**
 * FloatingStack
 *
 * Single, unified floating widget — bottom-right on desktop, bottom-right on mobile.
 * Replaces the old GlobalMatchWidget (bottom-left pill) and ShareWidget (bottom-right pill).
 * Three buttons stacked vertically:
 *   1. Find me a job  → HousingChoiceModal → ApplyModal
 *   2. Ask workers    → triggers WorkerQAPanel via hidden [aria-label="Ask workers"] button
 *   3. Share          → inline share panel (copy / WhatsApp / Telegram / Email)
 *
 * Positioning:
 *   - Mobile : bottom-28 right-3 — clears StickyIncomeStrip (56px) and StickyReviewBar (~90px)
 *   - Desktop: sm:bottom-8 sm:right-5
 *   - z-40   — above sticky strips (z-20), QA panel trigger (z-30), below modals (z-50)
 *
 * Visibility: slides in after 200 px scroll.
 */

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { stripLocalePrefix, useT } from "@/lib/i18n";
import { WA_LINK } from "@/lib/whatsapp";
import HousingChoiceModal, { type HousingPreference } from "./HousingChoiceModal";
import ApplyModal, { type ApplyContext } from "./ApplyModal";

type FlowState = "closed" | "choosing" | "form";

// ─── Icon helpers ─────────────────────────────────────────────────────────────

function ShareIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 shrink-0"
      viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2.5}
      strokeLinecap="round" strokeLinejoin="round"
    >
      <circle cx="18" cy="5"  r="3" />
      <circle cx="6"  cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59"  y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51"  x2="8.59"  y2="10.49" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 shrink-0"
      viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2.5}
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

// ─── Share row ────────────────────────────────────────────────────────────────

function ShareRow({
  icon, label, sub, onClick, href, hoverColor = "hover:bg-gray-50",
}: {
  icon: string; label: string; sub: string;
  onClick?: () => void; href?: string; hoverColor?: string;
}) {
  const inner = (
    <>
      <span className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-base shrink-0">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 leading-tight">{label}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
      </div>
    </>
  );
  const cls = `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left ${hoverColor}`;
  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={cls}>{inner}</a>;
  }
  return <button type="button" onClick={onClick} className={cls}>{inner}</button>;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FloatingStack() {
  const [visible,         setVisible]         = useState(false);
  const [flow,            setFlow]            = useState<FlowState>("closed");
  const [housingPref,     setHousingPref]     = useState<HousingPreference | undefined>(undefined);
  const [shareOpen,       setShareOpen]       = useState(false);
  const [copied,          setCopied]          = useState(false);
  const [pageUrl,         setPageUrl]         = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const pathname       = usePathname();
  const router         = useRouter();
  const { locale, rest: strippedPath } = stripLocalePrefix(pathname);
  const t              = useT(locale);

  // Show after 200 px scroll
  useEffect(() => {
    function onScroll() { setVisible(window.scrollY > 200); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide on mobile while any text input / textarea has focus (keyboard open)
  useEffect(() => {
    function onFocusIn(e: FocusEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") setKeyboardVisible(true);
    }
    function onFocusOut(e: FocusEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") setKeyboardVisible(false);
    }
    document.addEventListener("focusin",  onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin",  onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  // Resolve full URL client-side
  useEffect(() => {
    setPageUrl(window.location.href);
  }, [pathname]);

  // Close share panel on outside click
  const handleOutside = useCallback((e: MouseEvent) => {
    const panel = document.getElementById("fs-share-panel");
    const btn   = document.getElementById("fs-share-btn");
    if (panel && !panel.contains(e.target as Node) && btn && !btn.contains(e.target as Node)) {
      setShareOpen(false);
    }
  }, []);
  useEffect(() => {
    if (shareOpen) document.addEventListener("mousedown", handleOutside);
    else           document.removeEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [shareOpen, handleOutside]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setShareOpen(false); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ── Context for apply form ─────────────────────────────────────────────────
  const context: ApplyContext = {
    sourcePage:  pathname,
    sourceType:  "general_apply",
    sourceLabel: `FloatingStack — ${pathname}`,
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleOpenJob() {
    setHousingPref(undefined);
    setFlow("choosing");
    setShareOpen(false);
  }

  function handleChoice(choice: HousingPreference) {
    setHousingPref(choice);
    setFlow("form");
  }

  function handleClose() {
    setFlow("closed");
    setHousingPref(undefined);
  }

  function handleAskWorkers() {
    // Trigger WorkerQAPanel by programmatically clicking its (hidden) trigger button.
    // WorkerQAPanel renders a button with aria-label="Ask workers" which is hidden from
    // view but still in the DOM for exactly this purpose.
    const btn = document.querySelector<HTMLButtonElement>('[aria-label="Ask workers"]');
    if (btn) btn.click();
    setShareOpen(false);
  }

  function handleAddReview() {
    setShareOpen(false);
    if (strippedPath === "/reviews") {
      // Already on the reviews page — scroll to the form at the top of the left column
      const el = document.getElementById("review-form");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      // Navigate to the reviews page (locale-aware)
      const base = locale && locale !== "en" ? `/${locale}` : "";
      router.push(`${base}/reviews`);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl);
    } catch {
      // Fallback for browsers without clipboard API.
      // Guard the removeChild call — parentNode may be null if something
      // else already detached the element (race condition safety).
      const ta = document.createElement("textarea");
      ta.value = pageUrl;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch { /* ignore */ }
      if (ta.parentNode) ta.parentNode.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  // ── Share URLs ──────────────────────────────────────────────────────────────
  const waText       = encodeURIComponent(t("share_widget.intent_text", { url: pageUrl }));
  const tgText       = encodeURIComponent(t("share_widget.intent_text", { url: pageUrl }));
  const emailSubject = encodeURIComponent(t("share_widget.email_subject"));
  const emailBody    = encodeURIComponent(t("share_widget.email_body", { url: pageUrl }));

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Floating stack ─────────────────────────────────────────────────── */}
      <div
        className={`
          fixed
          right-3 bottom-24
          sm:right-5 sm:bottom-8
          z-40
          flex flex-col items-end gap-2.5
          transition-all duration-300
          ${keyboardVisible ? "max-sm:hidden" : ""}
          ${visible
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none"}
        `}
      >
        {/* ── 1a. WhatsApp Apply — mobile primary CTA (hidden on sm+) ─────── */}
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Apply on WhatsApp"
          className="
            sm:hidden
            flex items-center gap-2
            px-5 py-3.5 rounded-full
            bg-[#25D366] text-white
            text-sm font-black tracking-wide
            shadow-xl shadow-green-900/40
            hover:bg-[#1ebe5a] hover:shadow-2xl hover:shadow-green-900/50
            active:scale-95 transition-all whitespace-nowrap
            min-h-[48px]
          "
        >
          {/* WhatsApp icon */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span>Apply on WhatsApp</span>
        </a>

        {/* ── 1b. Find me a job — desktop primary CTA (hidden on mobile) ──── */}
        <button
          onClick={handleOpenJob}
          aria-label="Find me a job"
          className="
            hidden sm:flex items-center gap-2
            px-5 py-3.5 rounded-full
            bg-red-600 text-white
            text-sm font-black tracking-wide
            shadow-xl shadow-red-900/40
            hover:bg-red-700 hover:shadow-2xl hover:shadow-red-900/50
            active:scale-95 transition-all whitespace-nowrap
            min-h-[48px]
          "
        >
          <span aria-hidden>🔍</span>
          <span>{t("apply_bar.cta")}</span>
        </button>

        {/* ── 2. Add review ────────────────────────────────────────────────── */}
        <button
          onClick={handleAddReview}
          aria-label="Add a review"
          className="
            flex items-center gap-1.5
            px-4 py-2.5 rounded-full
            bg-gray-900 text-white
            text-xs font-bold
            shadow-md hover:bg-gray-700 hover:shadow-lg
            active:scale-95 transition-all whitespace-nowrap
            min-h-[44px]
          "
        >
          <PencilIcon />
          <span>{t("floating_stack.add_review")}</span>
        </button>

        {/* ── 3. Ask workers ───────────────────────────────────────────────── */}
        <button
          onClick={handleAskWorkers}
          aria-label="Ask workers from stack"
          className="
            flex items-center gap-1.5
            px-4 py-2.5 rounded-full
            bg-gray-900 text-white
            text-xs font-bold
            shadow-md hover:bg-gray-700 hover:shadow-lg
            active:scale-95 transition-all whitespace-nowrap
            min-h-[44px]
          "
        >
          <span aria-hidden>💬</span>
          <span>{t("floating_stack.ask_workers")}</span>
        </button>

        {/* ── 3. Share ─────────────────────────────────────────────────────── */}
        <div className="relative">
          {/* Share panel (slides up above button) */}
          {shareOpen && (
            <>
              <div
                id="fs-share-panel"
                className="absolute bottom-0 right-full mr-3 w-[min(280px,calc(100vw-72px))] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                style={{ animation: "fsUp .18s ease" }}
                role="dialog"
                aria-label="Share this page"
              >
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-sm font-bold text-gray-900">{t("share_widget.title")}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{t("share_widget.subtitle")}</p>
                </div>
                <div className="p-2 space-y-0.5">
                  <ShareRow
                    icon={copied ? "✓" : "🔗"}
                    label={copied ? t("share_widget.copied") : t("share_widget.copy_link")}
                    sub={t("share_widget.copy_hint")}
                    onClick={copyLink}
                  />
                  <ShareRow
                    icon="💬"
                    label={t("share_widget.whatsapp")}
                    sub={t("share_widget.whatsapp_hint")}
                    href={`https://wa.me/?text=${waText}`}
                    hoverColor="hover:bg-green-50"
                  />
                  <ShareRow
                    icon="✈️"
                    label={t("share_widget.telegram")}
                    sub={t("share_widget.telegram_hint")}
                    href={`https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${tgText}`}
                    hoverColor="hover:bg-sky-50"
                  />
                  <ShareRow
                    icon="📧"
                    label={t("share_widget.email")}
                    sub={t("share_widget.email_hint")}
                    href={`mailto:?subject=${emailSubject}&body=${emailBody}`}
                  />
                </div>
                <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
                  <p className="text-[9px] text-gray-400 text-center leading-snug">{t("share_widget.footer_note")}</p>
                </div>
              </div>
            </>
          )}

          {/* Share trigger button */}
          <button
            id="fs-share-btn"
            type="button"
            onClick={() => setShareOpen((v) => !v)}
            aria-label="Share this page"
            aria-expanded={shareOpen}
            className={`
              flex items-center gap-1.5
              px-4 py-2.5 rounded-full
              text-xs font-bold
              shadow-md transition-all duration-200
              active:scale-95
              min-h-[44px]
              ${shareOpen
                ? "bg-gray-900 text-white shadow-lg"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400 hover:shadow-lg hover:text-gray-900"}
            `}
          >
            <ShareIcon />
            <span>{t("floating_stack.share_btn")}</span>
          </button>
        </div>
      </div>

      {/* ── Housing choice modal ──────────────────────────────────────────────── */}
      {flow === "choosing" && (
        <HousingChoiceModal onChoice={handleChoice} onClose={handleClose} />
      )}

      {/* ── Apply modal ───────────────────────────────────────────────────────── */}
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
