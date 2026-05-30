"use client";

import { useState, useEffect } from "react";
import { createPortal }        from "react-dom";
import { useT }                from "@/lib/i18n";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Props {
  jobTitle:      string;
  waBase:        string;        // owner WA fallback (used when referralMode is false)
  source?:       string;        // tracking slug
  jobId?:        string;        // vacancy slug / page identifier
  referralMode?: boolean;       // if true → server-side recruiter rotation via /api/referral-redirect
  children:      (openFn: () => void) => React.ReactNode;
}

type Screen = "gate" | "details_a" | "details_b" | "disqualified" | "geo_blocked" | "already_applied" | "bsn_blocked";
type BSN    = "yes" | "no" | "not_yet";
type Avail  = "immediately" | "week1" | "week2" | "later";
type Eng    = "basic" | "good" | "fluent";
type Group  = "alone" | "partner" | "group";

// Citizenship is stored as a free-text string (e.g. "Poland", "Romania").
// Using string rather than a locked-down union so the input is flexible.
type EUCountry = string;

// ─── URL builders ──────────────────────────────────────────────────────────────
function buildRedirectUrl(
  jobId?:     string,
  jobTitle?:  string,
  source?:    string,
  customMsg?: string,
): string {
  const params = new URLSearchParams();
  if (jobId)     params.set("jobId",     jobId);
  if (jobTitle)  params.set("jobTitle",  jobTitle);
  if (source)    params.set("source",    source);
  if (customMsg) params.set("customMsg", customMsg);
  return `/api/referral-redirect?${params.toString()}`;
}

// ─── WhatsApp message builder ─────────────────────────────────────────────────
// Builds the full pre-filled candidate message that appears in WhatsApp.
function buildCandidateMsg(
  jobTitle:    string,
  source:      string | undefined,
  citizenship: EUCountry,
  bsn:         BSN,
  driving:     "yes" | "no",
  housing:     "yes" | "no",
  avail:       Avail,
  location:    string,
  phone:       string,
  english:     Eng,
  group:       Group,
  cv:          "yes" | "no",
): string {
  const bsnLabel: Record<BSN, string> = {
    yes:     "Yes",
    no:      "No",
    not_yet: "Not yet (willing to arrange)",
  };
  const availLabel: Record<Avail, string> = {
    immediately: "Immediately",
    week1:       "Within 1 week",
    week2:       "Within 2 weeks",
    later:       "Later",
  };
  const engLabel: Record<Eng, string> = {
    basic:  "Basic",
    good:   "Good",
    fluent: "Fluent",
  };
  const groupLabel: Record<Group, string> = {
    alone:   "Alone",
    partner: "With partner",
    group:   "With friend/group",
  };

  const srcTag = source ? ` [AgencyCheck · ${source}]` : " [AgencyCheck]";

  return [
    `Hi, I want to apply for: ${jobTitle}${srcTag}`,
    ``,
    `Candidate details:`,
    `- EU citizenship: ${citizenship.trim()} (EU)`,
    `- BSN: ${bsnLabel[bsn]}`,
    `- Driving licence: ${driving === "yes" ? "Yes" : "No"}`,
    `- Housing needed: ${housing === "yes" ? "Yes" : "No"}`,
    `- Current location: ${location}`,
    `- Phone: ${phone}`,
    `- Available from: ${availLabel[avail]}`,
    `- English level: ${engLabel[english]}`,
    `- Applying: ${groupLabel[group]}`,
    `- CV ready: ${cv === "yes" ? "Yes" : "No"}`,
  ].join("\n");
}

// ─── Duplicate-application guard ─────────────────────────────────────────────
// Three-layer dedup — each layer covers a different bypass scenario:
//
// 1. DEVICE lock  — localStorage "ac_device_applied" → timestamp.
//    Checked in handleOpen() so the form never even opens for 24 h.
//    Device-level: works regardless of phone number. Fastest check.
//
// 2. PHONE lock   — localStorage "ac_apply_guard" → [{phone, ts}].
//    Checked in handleSubmit() before opening WhatsApp.
//    Same device, different session (e.g. cleared cache but same browser).
//
// 3. SERVER lock  — POST /api/check-phone → DB PhoneApplication table.
//    Called after window.open("about:blank") using blank-window trick so
//    popup blocker is never triggered. Covers: incognito, different device,
//    Vercel cold starts (in-memory Map would have been reset).
//
// All layers fail-open: a storage/network error never permanently blocks
// a real candidate.

const DEVICE_KEY = "ac_device_applied";
const DEDUP_KEY  = "ac_apply_guard";
const DEDUP_TTL  = 86_400_000; // 24 hours in ms

/** Normalise phone to a canonical form for comparison.
 *  Matches the normalisation used server-side in /api/apply-webhook and /api/check-phone. */
function normalisePhone(raw: string): string {
  return raw.replace(/[\s\-()]/g, "").toLowerCase();
}

function deviceAlreadyApplied(): boolean {
  try {
    const ts = localStorage.getItem(DEVICE_KEY);
    if (!ts) return false;
    return Date.now() - Number(ts) < DEDUP_TTL;
  } catch {
    return false;
  }
}

function saveDeviceLock(): void {
  try {
    localStorage.setItem(DEVICE_KEY, String(Date.now()));
  } catch { /* non-blocking */ }
}

function checkDuplicate(phone: string): boolean {
  try {
    const raw = localStorage.getItem(DEDUP_KEY);
    if (!raw) return false;
    const entries: { phone: string; ts: number }[] = JSON.parse(raw);
    const now = Date.now();
    return entries.some((e) => e.phone === phone && now - e.ts < DEDUP_TTL);
  } catch {
    return false;
  }
}

function saveDedupEntry(phone: string): void {
  try {
    const raw = localStorage.getItem(DEDUP_KEY);
    const entries: { phone: string; ts: number }[] = raw ? JSON.parse(raw) : [];
    entries.push({ phone, ts: Date.now() });
    localStorage.setItem(DEDUP_KEY, JSON.stringify(entries.slice(-30)));
  } catch { /* non-blocking */ }
}

// Non-blocking — logs candidate pre-qual data, never blocks the apply flow
async function savePreQual(payload: {
  isEuCitizen: boolean;
  hasBsn:      boolean;
  jobId?:      string;
  jobTitle?:   string;
  source?:     string;
}) {
  try {
    await fetch("/api/prequalification", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });
  } catch { /* non-blocking */ }
}

// ─── Sub-components ────────────────────────────────────────────────────────────

/** Single selectable option button */
function Opt({
  label,
  selected,
  onClick,
}: {
  label:    string;
  selected: boolean;
  onClick:  () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full py-2.5 px-3 rounded-xl border text-[13px] font-semibold
        transition-all duration-150 text-left leading-snug break-words
        ${selected
          ? "border-emerald-400 bg-emerald-400/15 text-emerald-300"
          : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}
      `}
    >
      {selected && <span className="mr-1 text-emerald-400 text-[11px]">✓ </span>}
      {label}
    </button>
  );
}

/** Question wrapper with label and optional error highlight */
function Question({
  label,
  children,
  error,
}: {
  label:    string;
  children: React.ReactNode;
  error?:   boolean;
}) {
  return (
    <div className="mb-4">
      <p className={`text-[12px] font-bold mb-2 ${error ? "text-red-400" : "text-gray-400"}`}>
        {label}
        {error && <span className="ml-1 text-red-400">*</span>}
      </p>
      {children}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ApplyPreScreen({
  jobTitle,
  waBase,
  source,
  jobId,
  referralMode = false,
  children,
}: Props) {
  const [open,       setOpen]       = useState(false);
  const [screen,     setScreen]     = useState<Screen>("gate");
  const [errors,     setErrors]     = useState(false);
  const [submitting, setSubmitting] = useState(false); // true while server dedup check is in-flight
  // Portal mount guard — prevents SSR/hydration mismatch
  const [mounted,    setMounted]    = useState(false);
  // Geo gate — null = unknown (fail-open), false = non-EU blocked
  const [isEU,       setIsEU]       = useState<boolean | null>(null);
  // Apply form is always in English — language never changes regardless of locale

  useEffect(() => {
    setMounted(true);
    // Fetch geo on mount — result cached for 10 min (private)
    fetch("/api/geo")
      .then((r) => r.json())
      .then((d: { isEU: boolean }) => setIsEU(d.isEU))
      .catch(() => setIsEU(null)); // fail-open on network error
  }, []);

  // Always English — recruiter must understand the candidate's answers
  const t = useT("en");

  // ── Form state ────────────────────────────────────────────────────────────
  const [citizenship, setCitizenship] = useState<EUCountry | null>(null);
  const [bsn,         setBsn]         = useState<BSN | null>(null);
  const [driving,     setDriving]     = useState<"yes" | "no" | null>(null);
  const [housing,     setHousing]     = useState<"yes" | "no" | null>(null);
  const [avail,       setAvail]       = useState<Avail | null>(null);
  const [location,    setLocation]    = useState("");
  const [phone,       setPhone]       = useState("");
  const [english,     setEnglish]     = useState<Eng | null>(null);
  const [group,       setGroup]       = useState<Group | null>(null);
  const [cv,          setCv]          = useState<"yes" | "no" | null>(null);

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleOpen() {
    // Layer 1: device lock — this device already applied in the last 24 h
    if (deviceAlreadyApplied()) {
      setOpen(true);
      setScreen("already_applied");
      return;
    }
    // Layer 2: geo block — confirmed non-EU IP
    // isEU === null means geo check failed/pending — fail-open so real candidates
    // are never blocked by a network error.
    if (isEU === false) {
      setOpen(true);
      setScreen("geo_blocked");
      return;
    }
    setOpen(true);
    setScreen("gate");
    setErrors(false);
    setCitizenship(null);
    setBsn(null);
    setDriving(null);
    setHousing(null);
    setAvail(null);
    setLocation("");
    setPhone("");
    setEnglish(null);
    setGroup(null);
    setCv(null);
  }

  function handleClose() { setOpen(false); }

  function handleEuContinue() {
    if (citizenship === null || citizenship.trim().length < 2) {
      setErrors(true);
      return;
    }
    setErrors(false);
    setScreen("details_a");
  }

  function handleDetailsA() {
    if (!bsn || !driving || !housing || !avail) {
      setErrors(true);
      return;
    }
    // BSN = No → blocked. Log for analytics, do NOT continue to WhatsApp.
    if (bsn === "no") {
      setErrors(false);
      setScreen("bsn_blocked");
      // Fire-and-forget analytics log — not a lead, never sent to recruiter
      savePreQual({ isEuCitizen: true, hasBsn: false, jobId, jobTitle, source });
      return;
    }
    setErrors(false);
    setScreen("details_b");
  }

  // handleSubmit uses the "blank-window" technique:
  //
  // 1. window.open("about:blank") — SYNCHRONOUS in the click event.
  //    Popup blocker sees this as a user-initiated open → always allowed.
  //
  // 2. fetch("/api/check-phone") — ASYNC server-side dedup check (DB-backed).
  //    If duplicate: close the blank window, show already_applied screen.
  //    If allowed:   redirect the blank window to the WhatsApp URL.
  //
  // This gives us a server-side check (cross-device, cross-session, persistent)
  // without ever triggering the popup blocker. Fails open if server is unreachable.
  function handleSubmit() {
    const phoneRaw   = phone.trim();
    const phoneClean = normalisePhone(phoneRaw);   // remove spaces/dashes/brackets
    const phoneValid = phoneClean.length >= 7 && /^[+\d]+$/.test(phoneClean);

    if (!english || !group || !cv || location.trim().length < 2 || !phoneValid) {
      setErrors(true);
      return;
    }

    // Layer 1: device lock (fastest — no network round-trip)
    if (deviceAlreadyApplied()) {
      setScreen("already_applied");
      return;
    }

    // Layer 2: local phone lock (same device, cleared cache)
    if (checkDuplicate(phoneClean)) {
      setScreen("already_applied");
      return;
    }

    // Build the WhatsApp message and destination URL now (needed in both branches)
    const msg = buildCandidateMsg(
      jobTitle, source,
      citizenship!, bsn!, driving!, housing!, avail!,
      location.trim(), phoneClean, english!, group!, cv!,
    );
    const dest = referralMode
      ? buildRedirectUrl(jobId, jobTitle, source ?? "agencycheck", msg)
      : `${waBase}?text=${encodeURIComponent(msg)}`;

    // ── BLANK WINDOW TRICK ────────────────────────────────────────────────────
    // Open about:blank synchronously (popup blocker treats it as user-initiated).
    // The actual URL is set asynchronously after the server check.
    const win = window.open("about:blank", "_blank", "noopener,noreferrer");
    setSubmitting(true);

    // Layer 3: server-side DB check (cross-device, cross-session, persistent)
    const finish = () => {
      // Redirect the pre-opened blank window to WhatsApp
      if (win && !win.closed) {
        win.location.href = dest;
      } else {
        // Fallback if blank window was closed/blocked in the meantime
        window.open(dest, "_blank", "noopener,noreferrer");
      }
      // Save local locks
      saveDeviceLock();
      saveDedupEntry(phoneClean);
      setOpen(false);
      setSubmitting(false);
      // Fire-and-forget logging (non-blocking)
      savePreQual({ isEuCitizen: true, hasBsn: bsn === "yes" || bsn === "not_yet", jobId, jobTitle, source });
      // Fire-and-forget recruiter webhook (proxied server-side, token never in browser)
      fetch("/api/apply-webhook", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId, jobTitle,
          source:   source ?? null,
          phone:    phoneClean,
          location: location.trim(),
          bsn, driving, housing, avail, english, group, cv,
          waMessage: msg,
        }),
      }).catch(() => { /* non-blocking */ });
    };

    fetch("/api/check-phone", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phoneClean }),
    })
      .then((r) => r.json())
      .then(({ allowed }: { allowed: boolean }) => {
        if (!allowed) {
          // Server confirmed duplicate — close blank window, show screen
          win?.close();
          setScreen("already_applied");
          setSubmitting(false);
          return;
        }
        finish();
      })
      .catch(() => {
        // Fail-open: server unreachable → proceed so real candidates aren't blocked
        finish();
      });
  }

  // Progress (1 = gate, 2 = details_a, 3 = details_b)
  const step = screen === "gate" ? 1 : screen === "details_a" ? 2 : 3;

  // ── Readiness guards — buttons are only enabled when ALL fields on that screen are filled ──
  const detailsAReady  = !!bsn && !!driving && !!housing && !!avail;
  const phoneNorm      = normalisePhone(phone.trim()); // consistent with server-side normalisation
  const phoneValid     = phoneNorm.length >= 7 && /^[+\d]+$/.test(phoneNorm);
  const detailsBReady  = location.trim().length >= 2 && phoneValid && !!english && !!group && !!cv;


  // ── Portal modal — rendered at document.body level ──────────────────────────
  // IMPORTANT: backdrop + sheet MUST render outside any ancestor with a CSS
  // transform (e.g. FloatingStack uses translate-y-* animations). A transformed
  // ancestor creates a new "containing block" for fixed-positioned descendants,
  // which would clip/misplace the sheet to the button's bounding box instead
  // of the viewport. createPortal escapes that containing block entirely.
  const modal = (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Bottom sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Application pre-qualification"
        className={`
          fixed bottom-0 left-0 right-0 z-50
          bg-[#0f2318] border-t border-white/10
          rounded-t-3xl
          min-h-[50svh] max-h-[92svh] overflow-y-auto overflow-x-hidden
          transition-all duration-300 ease-out
          ${open
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"}
        `}
      >
        {/* Inner wrapper — constrains width + safe-area padding */}
        <div
          className="px-5 pt-5 w-full max-w-lg mx-auto"
          style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom, 0px))" }}
        >

        {/* Handle bar */}
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-4" />

        {/* Header (hidden on terminal screens) */}
        {screen !== "disqualified" && screen !== "geo_blocked" && screen !== "already_applied" && screen !== "bsn_blocked" && (
          <div className="mb-5">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400 shrink-0">
                {t("apply_screen.step_label").replace("{step}", String(step))}
              </p>
              <button
                onClick={handleClose}
                className="text-gray-600 hover:text-gray-400 text-[20px] leading-none shrink-0 ml-auto"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <h2 className="text-white font-bold text-[17px] leading-snug break-words w-full">{jobTitle}</h2>
            {/* Progress bar */}
            <div className="mt-2.5 h-1 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* ── SCREEN: gate — EU citizenship ──────────────────────────────── */}
        {screen === "gate" && (
          <>
            <Question label="Are you an EU citizen?">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setCitizenship("" as EUCountry); setErrors(false); }}
                  className={`
                    py-3.5 rounded-xl border text-[14px] font-bold
                    transition-all duration-150
                    ${citizenship !== null
                      ? "border-emerald-400 bg-emerald-400/15 text-emerald-300"
                      : "border-white/10 bg-white/5 text-gray-400 hover:border-emerald-400/50 hover:bg-emerald-400/10 hover:text-emerald-300"}
                  `}
                >
                  ✅ Yes
                </button>
                <button
                  type="button"
                  onClick={() => setScreen("disqualified")}
                  className="
                    py-3.5 rounded-xl border border-white/10 bg-white/5
                    text-gray-400 text-[14px] font-bold
                    hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-300
                    transition-all duration-150
                  "
                >
                  ❌ No
                </button>
              </div>
            </Question>

            {/* Country input — shown only after clicking Yes */}
            {citizenship !== null && (
              <Question
                label="Which EU country are you from?"
                error={errors && citizenship.trim().length < 2}
              >
                <input
                  type="text"
                  value={citizenship}
                  onChange={(e) => setCitizenship(e.target.value as EUCountry)}
                  placeholder="e.g. Poland, Romania, Bulgaria..."
                  autoComplete="off"
                  autoFocus
                  className={`
                    block w-full bg-white/5 border rounded-xl
                    px-4 py-3 text-white text-[14px] placeholder-gray-600
                    focus:outline-none transition-colors min-w-0
                    ${citizenship.trim().length >= 2
                      ? "border-emerald-400/50"
                      : errors
                        ? "border-red-400/50"
                        : "border-white/10 focus:border-emerald-400/50"}
                  `}
                />
              </Question>
            )}

            <button
              type="button"
              onClick={handleEuContinue}
              disabled={citizenship === null || citizenship.trim().length < 2}
              className={`
                w-full py-3.5 rounded-xl text-[14px] font-bold
                transition-all duration-150 mb-3
                ${citizenship !== null && citizenship.trim().length >= 2
                  ? "bg-[#22C55E] hover:bg-green-400 active:scale-[0.98] text-white shadow-lg shadow-green-900/30 cursor-pointer"
                  : "border border-white/10 bg-white/5 text-gray-500 cursor-not-allowed"}
              `}
            >
              {citizenship !== null && citizenship.trim().length >= 2
                ? `Continue as EU citizen (${citizenship.trim()}) →`
                : citizenship !== null
                  ? "Enter your country to continue"
                  : "Confirm EU citizenship to continue"}
            </button>

            <p className="text-center text-gray-600 text-[11px] mt-1">
              EU citizenship required for all positions
            </p>
          </>
        )}

        {/* ── SCREEN: disqualified ────────────────────────────────────────── */}
        {screen === "disqualified" && (
          <div className="py-2">
            <p className="text-[11px] font-black uppercase tracking-widest text-red-400 mb-4">
              {t("apply_screen.disqualified_label")}
            </p>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5 mb-5">
              <p className="text-white font-semibold text-[15px] leading-snug mb-2">
                {t("apply_screen.disqualified_title")}
              </p>
              <p className="text-gray-400 text-[13px] leading-relaxed">
                {t("apply_screen.disqualified_body")}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="
                w-full py-3.5 rounded-xl border border-white/10
                text-gray-500 text-[13px] font-semibold
                hover:bg-white/5 transition
              "
            >
              {t("apply_screen.btn_close")}
            </button>
          </div>
        )}

        {/* ── SCREEN: geo_blocked — non-EU IP detected ────────────────────── */}
        {screen === "geo_blocked" && (
          <div className="py-2">
            <p className="text-[11px] font-black uppercase tracking-widest text-orange-400 mb-4">
              {t("apply_screen.geo_blocked_label")}
            </p>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5 mb-5">
              <p className="text-white font-semibold text-[15px] leading-snug mb-2">
                {t("apply_screen.geo_blocked_title")}
              </p>
              <p className="text-gray-400 text-[13px] leading-relaxed">
                {t("apply_screen.geo_blocked_body")}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="
                w-full py-3.5 rounded-xl border border-white/10
                text-gray-500 text-[13px] font-semibold
                hover:bg-white/5 transition
              "
            >
              {t("apply_screen.btn_close")}
            </button>
          </div>
        )}

        {/* ── SCREEN: already_applied — duplicate within 24 h ────────────── */}
        {screen === "already_applied" && (
          <div className="py-2">
            <p className="text-[11px] font-black uppercase tracking-widest text-yellow-400 mb-4">
              {t("apply_screen.already_applied_label")}
            </p>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5 mb-5">
              <p className="text-white font-semibold text-[15px] leading-snug mb-2">
                {t("apply_screen.already_applied_title")}
              </p>
              <p className="text-gray-400 text-[13px] leading-relaxed">
                {t("apply_screen.already_applied_body")}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="
                w-full py-3.5 rounded-xl border border-white/10
                text-gray-500 text-[13px] font-semibold
                hover:bg-white/5 transition
              "
            >
              {t("apply_screen.btn_close")}
            </button>
          </div>
        )}

        {/* ── SCREEN: bsn_blocked — BSN = No ─────────────────────────────── */}
        {screen === "bsn_blocked" && (
          <div className="py-2">
            <p className="text-[11px] font-black uppercase tracking-widest text-red-400 mb-4">
              {t("apply_screen.bsn_blocked_label")}
            </p>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5 mb-5">
              <p className="text-white font-semibold text-[15px] leading-snug mb-2">
                {t("apply_screen.bsn_blocked_title")}
              </p>
              <p className="text-gray-400 text-[13px] leading-relaxed">
                {t("apply_screen.bsn_blocked_body")}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="
                w-full py-3.5 rounded-xl border border-white/10
                text-gray-500 text-[13px] font-semibold
                hover:bg-white/5 transition
              "
            >
              {t("apply_screen.btn_close")}
            </button>
          </div>
        )}

        {/* ── SCREEN: details_a — BSN, driving, housing, availability ─────── */}
        {screen === "details_a" && (
          <>
            <Question label={t("apply_screen.question_bsn")} error={errors && !bsn}>
              <div className="grid grid-cols-3 gap-2">
                <Opt label={t("apply_screen.bsn_yes")}     selected={bsn === "yes"}     onClick={() => setBsn("yes")} />
                <Opt label={t("apply_screen.bsn_no")}      selected={bsn === "no"}      onClick={() => setBsn("no")} />
                <Opt label={t("apply_screen.bsn_not_yet")} selected={bsn === "not_yet"} onClick={() => setBsn("not_yet")} />
              </div>
            </Question>

            <Question label={t("apply_screen.question_driving")} error={errors && !driving}>
              <div className="grid grid-cols-2 gap-2">
                <Opt label={t("apply_screen.bsn_yes")} selected={driving === "yes"} onClick={() => setDriving("yes")} />
                <Opt label={t("apply_screen.bsn_no")}  selected={driving === "no"}  onClick={() => setDriving("no")} />
              </div>
            </Question>

            <Question label={t("apply_screen.question_housing")} error={errors && !housing}>
              <div className="grid grid-cols-2 gap-2">
                <Opt label={t("apply_screen.bsn_yes")} selected={housing === "yes"} onClick={() => setHousing("yes")} />
                <Opt label={t("apply_screen.bsn_no")}  selected={housing === "no"}  onClick={() => setHousing("no")} />
              </div>
            </Question>

            <Question label={t("apply_screen.question_avail")} error={errors && !avail}>
              <div className="grid grid-cols-2 gap-2">
                <Opt label={t("apply_screen.avail_immediately")} selected={avail === "immediately"} onClick={() => setAvail("immediately")} />
                <Opt label={t("apply_screen.avail_week1")}       selected={avail === "week1"}       onClick={() => setAvail("week1")} />
                <Opt label={t("apply_screen.avail_week2")}       selected={avail === "week2"}       onClick={() => setAvail("week2")} />
                <Opt label={t("apply_screen.avail_later")}       selected={avail === "later"}       onClick={() => setAvail("later")} />
              </div>
            </Question>

            {errors && (
              <p className="text-red-400 text-[11px] mb-3">
                {t("apply_screen.error_all_required")}
              </p>
            )}

            <button
              onClick={handleDetailsA}
              disabled={!detailsAReady}
              className={`
                w-full flex items-center justify-center gap-2
                text-[15px] font-black
                py-4 rounded-2xl
                transition-all duration-150 mb-3
                ${detailsAReady
                  ? "bg-[#22C55E] hover:bg-green-400 active:scale-[0.98] text-white shadow-lg shadow-green-900/30 cursor-pointer"
                  : "bg-white/10 text-gray-500 cursor-not-allowed"}
              `}
            >
              {detailsAReady ? t("apply_screen.btn_continue") : "Answer all questions to continue"}
            </button>
            <button
              onClick={() => { setErrors(false); setCitizenship(null); setScreen("gate"); }}
              className="w-full py-2 text-gray-600 text-[11px] hover:text-gray-400 transition"
            >
              {t("apply_screen.btn_back")}
            </button>
          </>
        )}

        {/* ── SCREEN: details_b — location, english, group, CV ────────────── */}
        {screen === "details_b" && (
          <>
            <Question
              label={t("apply_screen.question_location")}
              error={errors && location.trim().length < 2}
            >
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t("apply_screen.location_placeholder")}
                autoComplete="off"
                className="
                  block w-full bg-white/5 border border-white/10 rounded-xl
                  px-4 py-3 text-white text-[14px] placeholder-gray-600
                  focus:outline-none focus:border-emerald-400/50
                  transition-colors min-w-0
                "
              />
            </Question>

            <Question
              label={t("apply_screen.question_phone")}
              error={errors && !(phone.trim().length >= 7 && /^[+\d\s\-()]+$/.test(phone.trim()))}
            >
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("apply_screen.phone_placeholder")}
                autoComplete="tel"
                inputMode="tel"
                className="
                  block w-full bg-white/5 border border-white/10 rounded-xl
                  px-4 py-3 text-white text-[14px] placeholder-gray-600
                  focus:outline-none focus:border-emerald-400/50
                  transition-colors min-w-0
                "
              />
              <p className="text-gray-600 text-[11px] mt-1">
                {t("apply_screen.phone_hint")}
              </p>
            </Question>

            <Question label={t("apply_screen.question_english")} error={errors && !english}>
              <div className="grid grid-cols-3 gap-2">
                <Opt label={t("apply_screen.eng_basic")}  selected={english === "basic"}  onClick={() => setEnglish("basic")} />
                <Opt label={t("apply_screen.eng_good")}   selected={english === "good"}   onClick={() => setEnglish("good")} />
                <Opt label={t("apply_screen.eng_fluent")} selected={english === "fluent"} onClick={() => setEnglish("fluent")} />
              </div>
            </Question>

            <Question label={t("apply_screen.question_group")} error={errors && !group}>
              <div className="grid grid-cols-3 gap-2">
                <Opt label={t("apply_screen.group_alone")}   selected={group === "alone"}   onClick={() => setGroup("alone")} />
                <Opt label={t("apply_screen.group_partner")} selected={group === "partner"} onClick={() => setGroup("partner")} />
                <Opt label={t("apply_screen.group_friend")}  selected={group === "group"}   onClick={() => setGroup("group")} />
              </div>
            </Question>

            <Question label={t("apply_screen.question_cv")} error={errors && !cv}>
              <div className="grid grid-cols-2 gap-2">
                <Opt label={t("apply_screen.bsn_yes")} selected={cv === "yes"} onClick={() => setCv("yes")} />
                <Opt label={t("apply_screen.bsn_no")}  selected={cv === "no"}  onClick={() => setCv("no")} />
              </div>
            </Question>

            {errors && (
              <p className="text-red-400 text-[11px] mb-3">
                {t("apply_screen.error_all_required")}
              </p>
            )}

            {/* handleSubmit opens about:blank synchronously then does async server check.
                The button is disabled while the check is in-flight (submitting=true). */}
            <button
              onClick={handleSubmit}
              disabled={!detailsBReady || submitting}
              className={`
                w-full flex items-center justify-center gap-2.5
                text-[16px] font-black
                py-4 rounded-2xl
                transition-all duration-150 mb-3
                ${detailsBReady && !submitting
                  ? "bg-[#22C55E] hover:bg-green-400 active:scale-[0.98] text-white shadow-lg shadow-green-900/30 cursor-pointer"
                  : "bg-white/10 text-gray-500 cursor-not-allowed"}
              `}
            >
              {submitting ? (
                // Loading state while server dedup check is in-flight (~200–400ms)
                <>
                  <svg className="w-4 h-4 animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  Checking…
                </>
              ) : detailsBReady ? (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {t("apply_screen.btn_apply_wa")}
                </>
              ) : "Fill in all fields to apply"}
            </button>

            <button
              onClick={() => { setErrors(false); setScreen("details_a"); }}
              className="w-full py-2 text-gray-600 text-[11px] hover:text-gray-400 transition"
            >
              {t("apply_screen.btn_back")}
            </button>
          </>
        )}

        </div>{/* /inner wrapper */}
      </div>
    </>
  );

  return (
    <>
      {/* Trigger — rendered inline wherever the component is placed */}
      {children(handleOpen)}

      {/* Modal — portalled to body so CSS transforms on ancestors can't
          create a new fixed containing block and clip the sheet */}
      {mounted && createPortal(modal, document.body)}
    </>
  );
}
