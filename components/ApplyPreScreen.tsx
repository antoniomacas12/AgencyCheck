"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal }               from "react-dom";
import { useT }                       from "@/lib/i18n";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Props {
  jobTitle:      string;
  waBase:        string;        // owner WA fallback (used when referralMode is false)
  source?:       string;        // tracking slug
  jobId?:        string;        // vacancy slug / page identifier
  referralMode?: boolean;       // default true → server-side recruiter rotation via /api/referral-redirect. Pass false to use waBase directly.
  children:      (openFn: () => void) => React.ReactNode;
}

type Screen = "gate" | "details" | "disqualified" | "geo_blocked" | "already_applied" | "bsn_blocked" | "completed";
type BSN          = "yes" | "no" | "not_yet";
type Availability = "immediately" | "week1" | "week2" | "later";

// Citizenship is stored as a free-text string (e.g. "Poland", "Romania").
// Using string rather than a locked-down union so the input is flexible.
type EUCountry = string;

// ─── EU country validation ────────────────────────────────────────────────────
// Covers all 27 EU member states + EEA (NO/IS/LI) + Switzerland + common
// spelling variants and native-language names. Diacritics are stripped before
// comparison so e.g. "România" and "Österreich" are matched correctly.
const EU_COUNTRIES = new Set([
  // Austria
  "austria", "osterreich",
  // Belgium
  "belgium", "belgique", "belgie",
  // Bulgaria
  "bulgaria",
  // Croatia
  "croatia", "hrvatska",
  // Cyprus
  "cyprus", "kibris",
  // Czech Republic
  "czech republic", "czechia", "czech", "ceska republika", "cesko",
  // Denmark
  "denmark", "danmark",
  // Estonia
  "estonia", "eesti",
  // Finland
  "finland", "suomi",
  // France
  "france",
  // Germany
  "germany", "deutschland",
  // Greece
  "greece", "hellas", "ellada",
  // Hungary
  "hungary", "magyarorszag",
  // Ireland
  "ireland", "eire",
  // Italy
  "italy", "italia",
  // Latvia
  "latvia", "latvija",
  // Lithuania
  "lithuania", "lietuva",
  // Luxembourg
  "luxembourg",
  // Malta
  "malta",
  // Netherlands
  "netherlands", "the netherlands", "holland", "nederland",
  // Poland
  "poland", "polska",
  // Portugal
  "portugal",
  // Romania
  "romania", "rumania", "romainia",
  // Slovakia
  "slovakia", "slovak republic", "slovensko",
  // Slovenia
  "slovenia", "slovenija",
  // Spain
  "spain", "espana",
  // Sweden
  "sweden", "sverige",
  // Ukraine — Temporary Protection Directive (valid for NL work since 2022)
  "ukraine", "ukrainian",
  // EEA + Switzerland (valid for NL work)
  "norway", "norge",
  "iceland", "island",
  "liechtenstein",
  "switzerland", "schweiz", "suisse",
]);

function isEuCountry(input: string): boolean {
  const normalized = input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")  // strip diacritics (România → romania)
    .replace(/[^a-z\s]/g, "")         // strip non-letters
    .replace(/\s+/g, " ")
    .trim();
  return EU_COUNTRIES.has(normalized);
}

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
// Lean message — EU, BSN, driving, housing, location. Phone visible to recruiter from WA sender.
function buildCandidateMsg(
  jobTitle:      string,
  source:        string | undefined,
  citizenship:   EUCountry,
  bsn:           BSN,
  driving:       "yes" | "no" | null,
  housing:       "yes" | "no" | null,
  location:      string,
  availability:  Availability | null,
): string {
  const bsnLabel: Record<BSN, string> = {
    yes:     "Yes",
    no:      "No",
    not_yet: "Not yet (willing to arrange)",
  };
  const availLabel: Record<Availability, string> = {
    immediately: "Immediately",
    week1:       "Within 1 week",
    week2:       "Within 2 weeks",
    later:       "Later",
  };
  const srcTag = source ? ` [AgencyCheck · ${source}]` : " [AgencyCheck]";
  const lines = [
    `Hi, I want to apply for: ${jobTitle}${srcTag}`,
    ``,
    `Candidate details:`,
    `- Citizenship: ${
      citizenship.trim().startsWith("Non-EU")
        ? citizenship.trim()
        : `${citizenship.trim()} ${/^(ukraine|ukrainian)$/i.test(citizenship.trim()) ? "(TPD)" : "(EU)"}`
    }`,
    `- BSN: ${bsnLabel[bsn]}`,
    driving !== null ? `- Driving licence: ${driving === "yes" ? "Yes" : "No"}` : null,
    housing !== null ? `- Housing needed: ${housing === "yes" ? "Yes" : "No"}` : null,
    availability !== null ? `- Available from: ${availLabel[availability]}` : null,
    `- Current location: ${location}`,
  ].filter(Boolean);
  return lines.join("\n");
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
//    Covers: incognito, different device, Vercel cold starts.
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

// ─── UUID helper — falls back to Math.random on browsers without crypto.randomUUID ──
function makeUUID(): string {
  try {
    return crypto.randomUUID();
  } catch {
    // Fallback: RFC-4122 v4 UUID via Math.random (good enough for funnel session IDs)
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }
}

// ─── Funnel tracking ──────────────────────────────────────────────────────────
// Fire-and-forget — never blocks the apply flow.
// Events: "open" | "gate_passed" | "completed" | "abandoned" | "disqualified"
// Steps:  "gate" | "details" | "geo_blocked" | "already_applied" | "complete"
async function trackFunnel(payload: {
  sessionId: string;
  event:     string;
  step:      string;
  jobId?:    string;
  source?:   string;
}) {
  try {
    await fetch("/api/funnel-event", {
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
        w-full min-h-[44px] py-2.5 px-3 rounded-xl border text-[13px] font-semibold
        transition-all duration-150 text-left leading-snug break-words
        flex items-center
        ${selected
          ? "border-emerald-400 bg-emerald-400/15 text-emerald-300"
          : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}
      `}
    >
      {selected && <span className="mr-1 text-emerald-400 text-[11px] shrink-0">✓ </span>}
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
  referralMode = true,   // default: all WA applies go through recruiter rotation
  children,
}: Props) {
  const [open,       setOpen]       = useState(false);
  const [screen,     setScreen]     = useState<Screen>("gate");
  const [errors,     setErrors]     = useState(false);
  const [submitting, setSubmitting] = useState(false); // true while server dedup check is in-flight
  // Portal mount guard — prevents SSR/hydration mismatch
  const [mounted,    setMounted]    = useState(false);
  // Per-attempt session ID for funnel tracking — regenerated on every open()
  const sessionIdRef = useRef<string>("");
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

  // Body scroll lock — prevents the background page from scrolling while the
  // bottom sheet is open. Uses the fixed-position technique because it's the
  // only approach that works reliably on iOS Safari (overflow:hidden on body
  // does not prevent momentum-scroll on iOS).
  useEffect(() => {
    if (!mounted) return;
    if (open) {
      const y = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top      = `-${y}px`;
      document.body.style.width    = "100%";
    } else {
      const savedY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top      = "";
      document.body.style.width    = "";
      if (savedY) window.scrollTo(0, -parseInt(savedY, 10));
    }
    return () => {
      // Cleanup on unmount — always restore scroll
      document.body.style.position = "";
      document.body.style.top      = "";
      document.body.style.width    = "";
    };
  }, [open, mounted]);

  // Always English — recruiter must understand the candidate's answers
  const t = useT("en");

  // ── Form state ────────────────────────────────────────────────────────────
  const [citizenship,   setCitizenship]   = useState<EUCountry | null>(null);
  const [euAnswer,      setEuAnswer]      = useState<"yes" | "no" | null>(null);
  const [nonEuPapers,   setNonEuPapers]   = useState<"yes" | "no" | null>(null);
  const [bsn,           setBsn]           = useState<BSN | null>(null);
  const [driving,       setDriving]       = useState<"yes" | "no" | null>(null);
  const [housing,       setHousing]       = useState<"yes" | "no" | null>(null);
  const [availability,  setAvailability]  = useState<Availability | null>(null);
  const [location,      setLocation]      = useState("");

  // ── Handlers ─────────────────────────────────────────────────────────────
  function handleOpen() {
    // Generate a fresh session ID for this apply attempt
    const sid = makeUUID();
    sessionIdRef.current = sid;

    // Layer 1: device lock — this device already applied in the last 24 h
    if (deviceAlreadyApplied()) {
      setOpen(true);
      setScreen("already_applied");
      trackFunnel({ sessionId: sid, event: "disqualified", step: "already_applied", jobId, source });
      return;
    }
    // Layer 2: geo block — confirmed non-EU IP
    // isEU === null means geo check failed/pending — fail-open so real candidates
    // are never blocked by a network error.
    if (isEU === false) {
      setOpen(true);
      setScreen("geo_blocked");
      trackFunnel({ sessionId: sid, event: "disqualified", step: "geo_blocked", jobId, source });
      return;
    }
    setOpen(true);
    setScreen("gate");
    setErrors(false);
    setCitizenship(null);
    setEuAnswer(null);
    setNonEuPapers(null);
    setBsn(null);
    setDriving(null);
    setHousing(null);
    setAvailability(null);
    setLocation("");
    // Track: modal opened
    trackFunnel({ sessionId: sid, event: "open", step: "gate", jobId, source });
  }

  function handleClose() {
    // Track abandonment — record which step the user was on when they closed
    if (open && screen !== "disqualified" && screen !== "geo_blocked" && screen !== "already_applied" && screen !== "bsn_blocked" && screen !== "completed") {
      trackFunnel({ sessionId: sessionIdRef.current, event: "abandoned", step: screen, jobId, source });
    }
    setOpen(false);
  }

  function handleEuContinue() {
    if (euAnswer === "yes") {
      if (citizenship === null || citizenship.trim().length < 2) { setErrors(true); return; }
      if (!isEuCountry(citizenship)) {
        setScreen("disqualified");
        trackFunnel({ sessionId: sessionIdRef.current, event: "disqualified", step: "gate", jobId, source });
        return;
      }
    } else if (euAnswer === "no") {
      if (nonEuPapers === null) { setErrors(true); return; }
      if (nonEuPapers === "no") {
        setScreen("disqualified");
        trackFunnel({ sessionId: sessionIdRef.current, event: "disqualified", step: "gate", jobId, source });
        return;
      }
      // non-EU with valid work permit — allowed
      setCitizenship("Non-EU (NL work permit)");
    } else {
      setErrors(true);
      return;
    }
    setErrors(false);
    setScreen("details");
    trackFunnel({ sessionId: sessionIdRef.current, event: "gate_passed", step: "details", jobId, source });
  }

  // handleSubmit:
  // Phone is not collected — recruiter sees the sender's number directly in WhatsApp.
  // Dedup uses device lock only (layer 1). Layers 2+3 were phone-based and are removed.
  function handleSubmit() {
    if (!bsn || !housing || !availability || location.trim().length < 2) {
      setErrors(true);
      return;
    }

    // Device lock — prevents double-submit from the same device within 24 h
    if (deviceAlreadyApplied()) {
      setScreen("already_applied");
      return;
    }

    const msg = buildCandidateMsg(
      jobTitle, source,
      citizenship!, bsn!, driving, housing,
      location.trim(), availability,
    );
    const dest = referralMode
      ? buildRedirectUrl(jobId, jobTitle, source ?? "agencycheck", msg)
      : `${waBase}?text=${encodeURIComponent(msg)}`;

    saveDeviceLock();
    setScreen("completed");
    trackFunnel({ sessionId: sessionIdRef.current, event: "completed", step: "complete", jobId, source });
    savePreQual({ isEuCitizen: true, hasBsn: bsn === "yes" || bsn === "not_yet", jobId, jobTitle, source });
    // Fire webhook BEFORE redirecting — keepalive:true keeps the request alive
    // even after the page navigates away. Order matters: fetch must be initiated
    // before window.location.href to guarantee the browser registers the request.
    fetch("/api/apply-webhook", {
      method:    "POST",
      keepalive: true,
      headers:   { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId, jobTitle,
        source:       source ?? null,
        location:     location.trim(),
        bsn, driving, housing,
        availability: availability ?? null,
        eu_citizen:   citizenship
          ? citizenship.trim().startsWith("Non-EU")
            ? citizenship.trim()
            : `${citizenship.trim()} (${/^(ukraine|ukrainian)$/i.test(citizenship.trim()) ? "TPD" : "EU"})`
          : null,
        waMessage: msg,
      }),
    }).catch(() => { /* non-blocking */ });
    // Redirect to WhatsApp after fetch is registered with the browser
    window.location.href = dest;
  }

  // Progress (1 = gate, 2 = details)
  const step = screen === "gate" ? 1 : 2;

  // ── Readiness guard — submit only when required fields are filled ──
  const detailsReady = !!bsn && !!housing && !!availability && location.trim().length >= 2;


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
        {screen !== "disqualified" && screen !== "geo_blocked" && screen !== "already_applied" && screen !== "bsn_blocked" && screen !== "completed" && (
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
                style={{ width: `${(step / 2) * 100}%` }}
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
                  onClick={() => { setEuAnswer("yes"); setCitizenship("" as EUCountry); setNonEuPapers(null); setErrors(false); }}
                  className={`
                    py-3.5 rounded-xl border text-[14px] font-bold
                    transition-all duration-150
                    ${euAnswer === "yes"
                      ? "border-emerald-400 bg-emerald-400/15 text-emerald-300"
                      : "border-white/10 bg-white/5 text-gray-400 hover:border-emerald-400/50 hover:bg-emerald-400/10 hover:text-emerald-300"}
                  `}
                >
                  ✅ Yes
                </button>
                <button
                  type="button"
                  onClick={() => { setEuAnswer("no"); setCitizenship(null); setNonEuPapers(null); setErrors(false); }}
                  className={`
                    py-3.5 rounded-xl border text-[14px] font-bold
                    transition-all duration-150
                    ${euAnswer === "no"
                      ? "border-red-400/60 bg-red-400/10 text-red-300"
                      : "border-white/10 bg-white/5 text-gray-400 hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-300"}
                  `}
                >
                  ❌ No
                </button>
              </div>
            </Question>

            {/* Country input — shown only after clicking Yes */}
            {euAnswer === "yes" && (
              <Question
                label="Which EU country are you from?"
                error={errors && (citizenship ?? "").trim().length < 2}
              >
                <input
                  type="text"
                  value={citizenship ?? ""}
                  onChange={(e) => setCitizenship(e.target.value as EUCountry)}
                  placeholder="e.g. Poland, Romania, Bulgaria..."
                  autoComplete="off"
                  className={`
                    block w-full bg-white/5 border rounded-xl
                    px-4 py-3 text-white text-base placeholder-gray-600
                    focus:outline-none transition-colors min-w-0
                    ${(citizenship ?? "").trim().length >= 2
                      ? "border-emerald-400/50"
                      : errors
                        ? "border-red-400/50"
                        : "border-white/10 focus:border-emerald-400/50"}
                  `}
                />
              </Question>
            )}

            {/* Work permit question — shown only after clicking No */}
            {euAnswer === "no" && (
              <Question label="Do you have a valid work permit to work in the Netherlands?">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNonEuPapers("yes")}
                    className={`
                      py-3.5 rounded-xl border text-[14px] font-bold
                      transition-all duration-150
                      ${nonEuPapers === "yes"
                        ? "border-emerald-400 bg-emerald-400/15 text-emerald-300"
                        : "border-white/10 bg-white/5 text-gray-400 hover:border-emerald-400/50 hover:bg-emerald-400/10 hover:text-emerald-300"}
                    `}
                  >
                    ✅ Yes, I do
                  </button>
                  <button
                    type="button"
                    onClick={() => setNonEuPapers("no")}
                    className={`
                      py-3.5 rounded-xl border text-[14px] font-bold
                      transition-all duration-150
                      ${nonEuPapers === "no"
                        ? "border-red-400/60 bg-red-400/10 text-red-300"
                        : "border-white/10 bg-white/5 text-gray-400 hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-300"}
                    `}
                  >
                    ❌ No
                  </button>
                </div>
              </Question>
            )}

            {/* Continue button */}
            {(() => {
              const ready =
                (euAnswer === "yes" && (citizenship ?? "").trim().length >= 2) ||
                (euAnswer === "no" && nonEuPapers !== null);
              const label =
                euAnswer === "yes" && (citizenship ?? "").trim().length >= 2
                  ? `Continue as EU citizen (${(citizenship ?? "").trim()}) →`
                  : euAnswer === "yes"
                    ? "Enter your country to continue"
                    : euAnswer === "no" && nonEuPapers === "yes"
                      ? "Continue with work permit →"
                      : euAnswer === "no" && nonEuPapers === "no"
                        ? "Continue →"
                        : euAnswer === "no"
                          ? "Answer the question above to continue"
                          : "Confirm your status to continue";
              return (
                <button
                  type="button"
                  onClick={handleEuContinue}
                  disabled={!ready}
                  className={`
                    w-full py-3.5 rounded-xl text-[14px] font-bold
                    transition-all duration-150 mb-3
                    ${ready
                      ? "bg-[#22C55E] hover:bg-green-400 active:scale-[0.98] text-white shadow-lg shadow-green-900/30 cursor-pointer"
                      : "border border-white/10 bg-white/5 text-gray-500 cursor-not-allowed"}
                  `}
                >
                  {label}
                </button>
              );
            })()}

            <p className="text-center text-gray-600 text-[11px] mt-1">
              EU citizenship or valid NL work permit required
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

        {/* ── SCREEN: details — BSN, housing, location, phone ────────────── */}
        {screen === "details" && (
          <>
            {/* BSN — most important qualifier for client */}
            <Question label={t("apply_screen.question_bsn")} error={errors && !bsn}>
              <div className="grid grid-cols-3 gap-2">
                <Opt label={t("apply_screen.bsn_yes")}     selected={bsn === "yes"}     onClick={() => setBsn("yes")} />
                <Opt label={t("apply_screen.bsn_not_yet")} selected={bsn === "not_yet"} onClick={() => setBsn("not_yet")} />
                <Opt label={t("apply_screen.bsn_no")}      selected={bsn === "no"}      onClick={() => setBsn("no")} />
              </div>
            </Question>

            {/* Driving licence — optional but important context for client */}
            <Question label={t("apply_screen.question_driving")}>
              <div className="grid grid-cols-2 gap-2">
                <Opt label={t("apply_screen.bsn_yes")} selected={driving === "yes"} onClick={() => setDriving("yes")} />
                <Opt label={t("apply_screen.bsn_no")}  selected={driving === "no"}  onClick={() => setDriving("no")} />
              </div>
            </Question>

            {/* Housing needed? — required, routes candidate to correct vacancy type */}
            <Question label={t("apply_screen.question_housing")} error={errors && !housing}>
              <div className="grid grid-cols-2 gap-2">
                <Opt label={t("apply_screen.bsn_yes")} selected={housing === "yes"} onClick={() => setHousing("yes")} />
                <Opt label={t("apply_screen.bsn_no")}  selected={housing === "no"}  onClick={() => setHousing("no")} />
              </div>
            </Question>

            {/* When to start — required */}
            <Question label={t("apply_screen.question_avail")} error={errors && !availability}>
              <div className="grid grid-cols-2 gap-2">
                <Opt label={t("apply_screen.avail_immediately")} selected={availability === "immediately"} onClick={() => setAvailability("immediately")} />
                <Opt label={t("apply_screen.avail_week1")}       selected={availability === "week1"}       onClick={() => setAvailability("week1")} />
                <Opt label={t("apply_screen.avail_week2")}       selected={availability === "week2"}       onClick={() => setAvailability("week2")} />
                <Opt label={t("apply_screen.avail_later")}       selected={availability === "later"}       onClick={() => setAvailability("later")} />
              </div>
            </Question>

            {/* City/region */}
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
                  px-4 py-3 text-white text-base placeholder-gray-600
                  focus:outline-none focus:border-emerald-400/50
                  transition-colors min-w-0
                "
              />
            </Question>


            {errors && (
              <p className="text-red-400 text-[11px] mb-3">
                {t("apply_screen.error_all_required")}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={!detailsReady || submitting}
              className={`
                w-full flex items-center justify-center gap-2.5
                text-[16px] font-black
                py-4 rounded-2xl
                transition-all duration-150 mb-3
                ${detailsReady && !submitting
                  ? "bg-[#22C55E] hover:bg-green-400 active:scale-[0.98] text-white shadow-lg shadow-green-900/30 cursor-pointer"
                  : "bg-white/10 text-gray-500 cursor-not-allowed"}
              `}
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  Checking…
                </>
              ) : detailsReady ? (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {t("apply_screen.btn_apply_wa")}
                </>
              ) : "Fill in all fields to apply"}
            </button>

            <button
              onClick={() => { setErrors(false); setCitizenship(null); setEuAnswer(null); setNonEuPapers(null); setBsn(null); setDriving(null); setHousing(null); setAvailability(null); setLocation(""); setScreen("gate"); }}
              className="w-full py-3.5 text-gray-600 text-[13px] hover:text-gray-400 transition"
            >
              {t("apply_screen.btn_back")}
            </button>

            {/* GDPR notice */}
            <p className="text-center text-gray-600 text-[11px] mt-2 leading-snug">
              By applying, your details are shared with a recruiter partner.{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-400">
                Privacy Policy
              </a>
            </p>
          </>
        )}

        {/* ── SCREEN: completed — redirecting to WhatsApp ─────────────────── */}
        {screen === "completed" && (
          <div className="py-8 flex flex-col items-center text-center">
            <div className="text-6xl mb-5">✅</div>
            <h2 className="text-white font-black text-[20px] leading-snug mb-2">
              Opening WhatsApp…
            </h2>
            <p className="text-gray-400 text-[14px] leading-relaxed max-w-xs">
              You&apos;re being redirected. If WhatsApp doesn&apos;t open, check your browser.
            </p>
          </div>
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
