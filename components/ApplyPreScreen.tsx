"use client";

import { useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Props {
  jobTitle: string;
  waBase: string;        // owner WA fallback (used when referralMode is false)
  source?: string;       // tracking slug
  jobId?: string;        // vacancy slug / page identifier
  referralMode?: boolean; // if true → server-side recruiter rotation via /api/referral-redirect
  children: (openFn: () => void) => React.ReactNode;
}

type YesNo  = "yes" | "no" | null;
type Screen =
  | "gate"          // EU citizen question
  | "phone"         // phone number entry + restriction check
  | "checking"      // async restriction check in progress
  | "blocked"       // restriction found — show neutral message
  | "ready"         // check passed — show final WhatsApp button
  | "disqualified"; // EU = no

// ─── Helpers ───────────────────────────────────────────────────────────────────

function buildWaUrl(base: string, jobTitle: string, source?: string) {
  const srcTag = source ? ` [src:${source}]` : "";
  const msg    = `Hi, I want to apply for: ${jobTitle}${srcTag}`.trim();
  return `${base}?text=${encodeURIComponent(msg)}`;
}

function buildRedirectUrl(jobId?: string, jobTitle?: string, source?: string) {
  const params = new URLSearchParams();
  if (jobId)    params.set("jobId",    jobId);
  if (jobTitle) params.set("jobTitle", jobTitle);
  if (source)   params.set("source",  source);
  return `/api/referral-redirect?${params.toString()}`;
}

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

// ─── Sub-component: Yes/No button pair ────────────────────────────────────────
function YesNoButtons({
  value,
  onChange,
}: {
  value: YesNo;
  onChange: (v: YesNo) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={() => onChange("yes")}
        className={`
          py-3.5 rounded-xl border text-[14px] font-bold transition-all duration-150
          ${value === "yes"
            ? "border-emerald-400 bg-emerald-400/15 text-emerald-300"
            : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}
        `}
      >
        ✅&nbsp; Yes
      </button>
      <button
        onClick={() => onChange("no")}
        className={`
          py-3.5 rounded-xl border text-[14px] font-bold transition-all duration-150
          ${value === "no"
            ? "border-red-400/60 bg-red-400/10 text-red-300"
            : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}
        `}
      >
        ❌&nbsp; No
      </button>
    </div>
  );
}

// ─── WA icon ─────────────────────────────────────────────────────────────────
function WAIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.962-1.418A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.95 7.95 0 01-4.07-1.116l-.292-.174-3.036.868.872-3.046-.19-.31A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.29-5.89c-.233-.117-1.379-.681-1.593-.759-.214-.077-.37-.116-.526.117-.155.232-.603.759-.739.915-.136.155-.272.174-.505.058-.233-.117-.982-.362-1.87-1.154-.691-.617-1.158-1.38-1.294-1.613-.136-.232-.014-.358.103-.474.105-.104.233-.272.35-.408.116-.136.155-.233.233-.388.077-.155.039-.291-.019-.407-.059-.117-.527-1.27-.722-1.739-.19-.456-.384-.394-.527-.401l-.448-.008c-.156 0-.408.059-.621.291-.214.233-.814.796-.814 1.94s.834 2.25.95 2.406c.116.155 1.64 2.504 3.975 3.512.556.24 1.99.52 2.315.336.233-.136.942-.385 1.074-.756.131-.37.131-.686.092-.756-.039-.077-.155-.116-.388-.233z" />
    </svg>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────
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
  const [euCitizen, setEu]    = useState<YesNo>(null);
  const [phone,   setPhone]   = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  // destination URL built after successful check — used by the synchronous click
  const [destination, setDestination] = useState("");

  function handleOpen() {
    setOpen(true);
    setScreen("gate");
    setEu(null);
    setPhone("");
    setPhoneErr("");
    setDestination("");
  }

  function handleClose() {
    setOpen(false);
  }

  function handleEuAnswer(val: YesNo) {
    setEu(val);
    if (val === "no") {
      setScreen("disqualified");
      savePreQual({ isEuCitizen: false, hasBsn: false, jobId, jobTitle, source });
    } else if (val === "yes") {
      // If referralMode, add phone step for restriction check.
      // If direct WA mode, skip phone step and go straight through.
      if (referralMode) {
        setScreen("phone");
      } else {
        // Non-referral: just redirect directly (old behaviour, no restriction check)
        const dest = buildWaUrl(waBase, jobTitle, source);
        setDestination(dest);
        setScreen("ready");
        savePreQual({ isEuCitizen: true, hasBsn: true, jobId, jobTitle, source });
      }
    }
  }

  // Called when user clicks "Check & Apply" on the phone screen.
  // Async check — then sets screen to "ready" or "blocked".
  async function handlePhoneCheck() {
    const trimmed = phone.trim();
    if (trimmed.length < 7) {
      setPhoneErr("Please enter a valid phone number.");
      return;
    }
    setPhoneErr("");
    setScreen("checking");

    try {
      const res  = await fetch("/api/check-restriction", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          phone:    trimmed,
          jobId,
          jobTitle,
        }),
      });
      const data = await res.json().catch(() => ({ blocked: false }));

      if (data.blocked === true) {
        setScreen("blocked");
        return;
      }

      // Passed — pre-build the destination URL before showing the button.
      const dest = buildRedirectUrl(jobId, jobTitle, source ?? "agencycheck");
      setDestination(dest);
      setScreen("ready");
      savePreQual({ isEuCitizen: true, hasBsn: true, jobId, jobTitle, source });

    } catch {
      // Fail-open: if check errors, let the candidate through
      const dest = buildRedirectUrl(jobId, jobTitle, source ?? "agencycheck");
      setDestination(dest);
      setScreen("ready");
      savePreQual({ isEuCitizen: true, hasBsn: true, jobId, jobTitle, source });
    }
  }

  // Called synchronously from a button click — safe for window.open().
  function handleFinalApply() {
    if (!destination) return;
    window.open(destination, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  return (
    <>
      {/* Trigger */}
      {children(handleOpen)}

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
        aria-label="Application eligibility check"
        className={`
          fixed bottom-0 left-0 right-0 z-50
          bg-[#0f2318] border-t border-white/10
          rounded-t-3xl px-5 pt-5 pb-8
          max-h-[92vh] overflow-y-auto
          transition-transform duration-300 ease-out
          ${open ? "translate-y-0" : "translate-y-full"}
        `}
      >
        {/* Handle bar */}
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

        {/* Header */}
        <div className="mb-6">
          <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400 mb-1">
            {screen === "phone" || screen === "checking" || screen === "ready"
              ? "Almost there · step 2 of 2"
              : "Eligibility check"}
          </p>
          <h2 className="text-white font-bold text-[18px] leading-snug">
            {jobTitle}
          </h2>
          {referralMode && screen !== "blocked" && (
            <p className="text-gray-600 text-[11px] mt-1">
              via AgencyCheck · recruiter assigned automatically
            </p>
          )}
        </div>

        {/* ── SCREEN: gate (EU question) ───────────────────────────── */}
        {screen === "gate" && (
          <>
            <div className="mb-6">
              <p className="text-gray-300 text-[13px] font-semibold mb-3">
                Are you an EU citizen?
              </p>
              <YesNoButtons value={euCitizen} onChange={handleEuAnswer} />
            </div>
            <p className="text-center text-gray-600 text-[11px] mt-3">
              EU citizenship required to apply
            </p>
          </>
        )}

        {/* ── SCREEN: disqualified ─────────────────────────────────── */}
        {screen === "disqualified" && (
          <>
            <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-4">
              <p className="text-red-300 text-[13px] font-semibold leading-snug text-center">
                This position is currently available for EU citizens only.
              </p>
            </div>
            <p className="text-center text-gray-600 text-[11px] mt-3">
              Check other positions that may suit your profile
            </p>
          </>
        )}

        {/* ── SCREEN: phone entry ──────────────────────────────────── */}
        {screen === "phone" && (
          <>
            <div className="mb-6">
              <p className="text-gray-300 text-[13px] font-semibold mb-2">
                Your WhatsApp number
              </p>
              <p className="text-gray-500 text-[11px] mb-3">
                The recruiter will contact you on this number.
              </p>
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setPhoneErr(""); }}
                onKeyDown={(e) => { if (e.key === "Enter") handlePhoneCheck(); }}
                placeholder="+31 6 12 34 56 78"
                autoComplete="tel"
                inputMode="tel"
                className="
                  w-full bg-white/5 border border-white/10 rounded-xl
                  px-4 py-3.5 text-white text-[15px] placeholder-gray-600
                  focus:outline-none focus:border-emerald-400/50
                  transition-colors
                "
              />
              {phoneErr && (
                <p className="text-red-400 text-[11px] mt-2">{phoneErr}</p>
              )}
            </div>

            <button
              onClick={handlePhoneCheck}
              disabled={phone.trim().length < 7}
              className={`
                w-full flex items-center justify-center gap-2.5
                font-black text-[16px] py-4 rounded-2xl
                transition-all duration-150
                ${phone.trim().length >= 7
                  ? "bg-[#22C55E] hover:bg-green-400 active:scale-[0.98] text-white shadow-lg shadow-green-900/40"
                  : "bg-white/10 text-gray-500 cursor-not-allowed"}
              `}
            >
              Check &amp; Continue →
            </button>
            <p className="text-center text-gray-600 text-[11px] mt-3">
              Number is only shared with your assigned recruiter
            </p>
          </>
        )}

        {/* ── SCREEN: checking ─────────────────────────────────────── */}
        {screen === "checking" && (
          <div className="py-6 text-center">
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-[13px]">Verifying eligibility…</p>
          </div>
        )}

        {/* ── SCREEN: blocked — NEUTRAL public message ─────────────── */}
        {screen === "blocked" && (
          <div className="py-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-6 text-center">
              <p className="text-white font-semibold text-[15px] leading-snug mb-2">
                Thank you for your interest.
              </p>
              <p className="text-gray-400 text-[13px] leading-relaxed">
                Unfortunately we are unable to process your application at this time.
              </p>
            </div>
            <p className="text-center text-gray-600 text-[11px] mt-4">
              You may browse other opportunities on our site.
            </p>
          </div>
        )}

        {/* ── SCREEN: ready — final synchronous WhatsApp button ────── */}
        {screen === "ready" && (
          <>
            <div className="mb-5 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3">
              <p className="text-emerald-400 text-[12px] font-semibold text-center">
                ✓ Eligibility confirmed — recruiter assigned
              </p>
            </div>

            <button
              onClick={handleFinalApply}
              className="
                w-full flex items-center justify-center gap-2.5
                bg-[#22C55E] hover:bg-green-400 active:scale-[0.98]
                text-white font-black text-[16px]
                py-4 rounded-2xl
                shadow-lg shadow-green-900/40
                transition-all duration-150
              "
            >
              <WAIcon />
              Open WhatsApp →
            </button>
            <p className="text-center text-gray-600 text-[11px] mt-3">
              Opens WhatsApp · recruiter assigned automatically
            </p>
          </>
        )}
      </div>
    </>
  );
}
