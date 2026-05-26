"use client";

import { useState, useEffect } from "react";
import { createPortal }        from "react-dom";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Props {
  jobTitle:      string;
  waBase:        string;        // owner WA fallback (used when referralMode is false)
  source?:       string;        // tracking slug
  jobId?:        string;        // vacancy slug / page identifier
  referralMode?: boolean;       // if true → server-side recruiter rotation via /api/referral-redirect
  children:      (openFn: () => void) => React.ReactNode;
}

type Screen = "gate" | "details_a" | "details_b" | "disqualified" | "geo_blocked";
type BSN    = "yes" | "no" | "not_yet";
type Avail  = "immediately" | "week1" | "week2" | "later";
type Eng    = "basic" | "good" | "fluent";
type Group  = "alone" | "partner" | "group";

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
  jobTitle: string,
  source:   string | undefined,
  bsn:      BSN,
  driving:  "yes" | "no",
  housing:  "yes" | "no",
  avail:    Avail,
  location: string,
  phone:    string,
  english:  Eng,
  group:    Group,
  cv:       "yes" | "no",
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

  const srcTag = source ? ` [AgencyCheck · src:${source}]` : " [AgencyCheck]";

  return [
    `Hi, I want to apply for: ${jobTitle}${srcTag}`,
    ``,
    `Candidate details:`,
    `- EU citizenship: Yes`,
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
  const [open,    setOpen]    = useState(false);
  const [screen,  setScreen]  = useState<Screen>("gate");
  const [errors,  setErrors]  = useState(false);
  // Portal mount guard — prevents SSR/hydration mismatch
  const [mounted, setMounted] = useState(false);
  // Geo gate — null = unknown (fail-open), false = non-EU blocked
  const [isEU,    setIsEU]    = useState<boolean | null>(null);

  useEffect(() => {
    setMounted(true);
    // Fetch geo on mount — result cached for 10 min (private)
    fetch("/api/geo")
      .then((r) => r.json())
      .then((d: { isEU: boolean }) => setIsEU(d.isEU))
      .catch(() => setIsEU(null)); // fail-open on network error
  }, []);

  // ── Form state ────────────────────────────────────────────────────────────
  const [bsn,      setBsn]      = useState<BSN | null>(null);
  const [driving,  setDriving]  = useState<"yes" | "no" | null>(null);
  const [housing,  setHousing]  = useState<"yes" | "no" | null>(null);
  const [avail,    setAvail]    = useState<Avail | null>(null);
  const [location, setLocation] = useState("");
  const [phone,    setPhone]    = useState("");
  const [english,  setEnglish]  = useState<Eng | null>(null);
  const [group,    setGroup]    = useState<Group | null>(null);
  const [cv,       setCv]       = useState<"yes" | "no" | null>(null);

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleOpen() {
    // isEU === false means we have a confirmed non-EU IP — block the apply flow.
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

  function handleEuYes() {
    setErrors(false);
    setScreen("details_a");
  }

  function handleDetailsA() {
    if (!bsn || !driving || !housing || !avail) {
      setErrors(true);
      return;
    }
    setErrors(false);
    setScreen("details_b");
  }

  // Called from button onClick — MUST remain synchronous so popup blocker
  // never intercepts the window.open() call.
  function handleSubmit() {
    const phoneClean = phone.trim();
    const phoneValid = phoneClean.length >= 7 && /^[+\d\s\-()]+$/.test(phoneClean);

    if (!english || !group || !cv || location.trim().length < 2 || !phoneValid) {
      setErrors(true);
      return;
    }

    const msg = buildCandidateMsg(
      jobTitle, source,
      bsn!, driving!, housing!, avail!,
      location.trim(), phoneClean, english!, group!, cv!,
    );

    const dest = referralMode
      ? buildRedirectUrl(jobId, jobTitle, source ?? "agencycheck", msg)
      : `${waBase}?text=${encodeURIComponent(msg)}`;

    // Synchronous — called directly from click event, no async gap
    window.open(dest, "_blank", "noopener,noreferrer");
    setOpen(false);

    // Fire-and-forget logging (non-blocking, never delays WA open)
    savePreQual({
      isEuCitizen: true,
      hasBsn:      bsn === "yes" || bsn === "not_yet",
      jobId,
      jobTitle,
      source,
    });
  }

  // Progress (1 = gate, 2 = details_a, 3 = details_b)
  const step = screen === "gate" ? 1 : screen === "details_a" ? 2 : 3;


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

        {/* Header (hidden on disqualified / geo_blocked screens) */}
        {screen !== "disqualified" && screen !== "geo_blocked" && (
          <div className="mb-5">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400 shrink-0">
                Step {step} of 3 · Application
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
                  onClick={handleEuYes}
                  className="
                    py-3.5 rounded-xl border border-white/10 bg-white/5
                    text-gray-400 text-[14px] font-bold
                    hover:border-emerald-400/50 hover:bg-emerald-400/10 hover:text-emerald-300
                    transition-all duration-150
                  "
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
            <p className="text-center text-gray-600 text-[11px] mt-1">
              EU citizenship required for most positions
            </p>
          </>
        )}

        {/* ── SCREEN: disqualified ────────────────────────────────────────── */}
        {screen === "disqualified" && (
          <div className="py-2">
            <p className="text-[11px] font-black uppercase tracking-widest text-red-400 mb-4">
              Not eligible
            </p>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5 mb-5">
              <p className="text-white font-semibold text-[15px] leading-snug mb-2">
                Thank you for your interest.
              </p>
              <p className="text-gray-400 text-[13px] leading-relaxed">
                Our current job offers are mainly available for EU citizens. We are unable to process your application at this time, but we may have more options in the future.
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
              Close
            </button>
          </div>
        )}

        {/* ── SCREEN: geo_blocked — non-EU IP detected ────────────────────── */}
        {screen === "geo_blocked" && (
          <div className="py-2">
            <p className="text-[11px] font-black uppercase tracking-widest text-orange-400 mb-4">
              Applications unavailable
            </p>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5 mb-5">
              <p className="text-white font-semibold text-[15px] leading-snug mb-2">
                Applications are open for EU residents only.
              </p>
              <p className="text-gray-400 text-[13px] leading-relaxed">
                Our positions require candidates to be based in the European Union. You can still browse all job listings and agency reviews on our platform.
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
              Close
            </button>
          </div>
        )}

        {/* ── SCREEN: details_a — BSN, driving, housing, availability ─────── */}
        {screen === "details_a" && (
          <>
            <Question label="Do you have a BSN number?" error={errors && !bsn}>
              <div className="grid grid-cols-3 gap-2">
                <Opt label="Yes"     selected={bsn === "yes"}     onClick={() => setBsn("yes")} />
                <Opt label="No"      selected={bsn === "no"}      onClick={() => setBsn("no")} />
                <Opt label="Not yet" selected={bsn === "not_yet"} onClick={() => setBsn("not_yet")} />
              </div>
            </Question>

            <Question label="Do you have a driving licence?" error={errors && !driving}>
              <div className="grid grid-cols-2 gap-2">
                <Opt label="Yes" selected={driving === "yes"} onClick={() => setDriving("yes")} />
                <Opt label="No"  selected={driving === "no"}  onClick={() => setDriving("no")} />
              </div>
            </Question>

            <Question label="Do you need accommodation / housing?" error={errors && !housing}>
              <div className="grid grid-cols-2 gap-2">
                <Opt label="Yes" selected={housing === "yes"} onClick={() => setHousing("yes")} />
                <Opt label="No"  selected={housing === "no"}  onClick={() => setHousing("no")} />
              </div>
            </Question>

            <Question label="Available from when?" error={errors && !avail}>
              <div className="grid grid-cols-2 gap-2">
                <Opt label="Immediately"    selected={avail === "immediately"} onClick={() => setAvail("immediately")} />
                <Opt label="Within 1 week"  selected={avail === "week1"}       onClick={() => setAvail("week1")} />
                <Opt label="Within 2 weeks" selected={avail === "week2"}       onClick={() => setAvail("week2")} />
                <Opt label="Later"          selected={avail === "later"}       onClick={() => setAvail("later")} />
              </div>
            </Question>

            {errors && (
              <p className="text-red-400 text-[11px] mb-3">
                Please answer all questions to continue.
              </p>
            )}

            <button
              onClick={handleDetailsA}
              className="
                w-full flex items-center justify-center gap-2
                bg-[#22C55E] hover:bg-green-400 active:scale-[0.98]
                text-white font-black text-[15px]
                py-4 rounded-2xl
                shadow-lg shadow-green-900/30
                transition-all duration-150 mb-3
              "
            >
              Continue →
            </button>
            <button
              onClick={() => { setErrors(false); setScreen("gate"); }}
              className="w-full py-2 text-gray-600 text-[11px] hover:text-gray-400 transition"
            >
              ← Back
            </button>
          </>
        )}

        {/* ── SCREEN: details_b — location, english, group, CV ────────────── */}
        {screen === "details_b" && (
          <>
            <Question
              label="Current country / city"
              error={errors && location.trim().length < 2}
            >
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Poland, Warsaw"
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
              label="Phone number"
              error={errors && !(phone.trim().length >= 7 && /^[+\d\s\-()]+$/.test(phone.trim()))}
            >
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +48 123 456 789"
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
                So the recruiter can reach you directly
              </p>
            </Question>

            <Question label="English level" error={errors && !english}>
              <div className="grid grid-cols-3 gap-2">
                <Opt label="Basic"  selected={english === "basic"}  onClick={() => setEnglish("basic")} />
                <Opt label="Good"   selected={english === "good"}   onClick={() => setEnglish("good")} />
                <Opt label="Fluent" selected={english === "fluent"} onClick={() => setEnglish("fluent")} />
              </div>
            </Question>

            <Question label="Applying alone or with someone?" error={errors && !group}>
              <div className="grid grid-cols-3 gap-2">
                <Opt label="Alone"        selected={group === "alone"}   onClick={() => setGroup("alone")} />
                <Opt label="With partner" selected={group === "partner"} onClick={() => setGroup("partner")} />
                <Opt label="With friend"  selected={group === "group"}   onClick={() => setGroup("group")} />
              </div>
            </Question>

            <Question label="Do you have a CV ready?" error={errors && !cv}>
              <div className="grid grid-cols-2 gap-2">
                <Opt label="Yes" selected={cv === "yes"} onClick={() => setCv("yes")} />
                <Opt label="No"  selected={cv === "no"}  onClick={() => setCv("no")} />
              </div>
            </Question>

            {errors && (
              <p className="text-red-400 text-[11px] mb-3">
                Please answer all questions to continue.
              </p>
            )}

            {/* handleSubmit is synchronous — window.open() called directly
                from click event so popup blockers do not interfere */}
            <button
              onClick={handleSubmit}
              className="
                w-full flex items-center justify-center gap-2.5
                bg-[#22C55E] hover:bg-green-400 active:scale-[0.98]
                text-white font-black text-[16px]
                py-4 rounded-2xl
                shadow-lg shadow-green-900/30
                transition-all duration-150 mb-3
              "
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Apply via WhatsApp
            </button>

            <button
              onClick={() => { setErrors(false); setScreen("details_a"); }}
              className="w-full py-2 text-gray-600 text-[11px] hover:text-gray-400 transition"
            >
              ← Back
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
