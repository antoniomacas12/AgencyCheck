"use client";

import { useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Props {
  jobTitle: string;
  waBase: string;    // wa.me URL without text param, e.g. "https://wa.me/31649210631"
  source?: string;   // tracking slug, e.g. "reachtruck" — appended to WA message
  jobId?: string;    // job slug / page identifier for analytics, e.g. "warehouse"
  children: (openFn: () => void) => React.ReactNode;
}

type YesNo = "yes" | "no" | null;

// ─── Helper: build WhatsApp URL with pre-filled message ────────────────────────
function buildWaUrl(waBase: string, jobTitle: string, source?: string) {
  const srcTag = source ? ` [src:${source}]` : "";
  const msg = `Hi, I want to apply for: ${jobTitle}${srcTag}\n✅ EU citizen: Yes\n✅ BSN: Yes`.trim();
  return `${waBase}?text=${encodeURIComponent(msg)}`;
}

// ─── Analytics: fire-and-forget DB save ───────────────────────────────────────
async function savePreQual(payload: {
  isEuCitizen: boolean;
  hasBsn: boolean;
  jobId?: string;
  jobTitle?: string;
  source?: string;
}) {
  try {
    await fetch("/api/prequalification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Non-blocking — never interrupt the user flow for analytics
  }
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

// ─── Component ─────────────────────────────────────────────────────────────────
export default function ApplyPreScreen({
  jobTitle,
  waBase,
  source,
  jobId,
  children,
}: Props) {
  const [open, setOpen]    = useState(false);
  const [euCitizen, setEu] = useState<YesNo>(null);
  const [hasBsn, setBsn]   = useState<YesNo>(null);

  const bothAnswered = euCitizen !== null && hasBsn !== null;
  const qualified    = euCitizen === "yes" && hasBsn === "yes";
  const disqualified = bothAnswered && !qualified;

  function handleOpen() {
    setOpen(true);
    setEu(null);
    setBsn(null);
  }

  function handleApply() {
    if (!qualified) return;

    // Open WhatsApp FIRST — must be synchronous with the click event,
    // otherwise browser popup blocker will block window.open after an await.
    const url = buildWaUrl(waBase, jobTitle, source);
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);

    // Save analytics fire-and-forget AFTER opening WA
    savePreQual({
      isEuCitizen: true,
      hasBsn: true,
      jobId,
      jobTitle,
      source,
    });
  }

  // Save disqualified answers when both are answered (for analytics)
  function handleAnswer(field: "eu" | "bsn", val: YesNo) {
    const nextEu  = field === "eu"  ? val : euCitizen;
    const nextBsn = field === "bsn" ? val : hasBsn;

    if (field === "eu")  setEu(val);
    if (field === "bsn") setBsn(val);

    // Fire analytics save when a disqualifying combination is complete
    if (nextEu !== null && nextBsn !== null) {
      const isQualified = nextEu === "yes" && nextBsn === "yes";
      if (!isQualified) {
        savePreQual({
          isEuCitizen: nextEu === "yes",
          hasBsn: nextBsn === "yes",
          jobId,
          jobTitle,
          source,
        });
      }
    }
  }

  return (
    <>
      {/* Trigger — caller decides what the button looks like */}
      {children(handleOpen)}

      {/* ── Backdrop ─────────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Bottom sheet ─────────────────────────────────────────── */}
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
            Eligibility check · 2 questions
          </p>
          <h2 className="text-white font-bold text-[18px] leading-snug">
            {jobTitle}
          </h2>
        </div>

        {/* ── Q1: EU citizen ───────────────────────────────────── */}
        <div className="mb-5">
          <p className="text-gray-300 text-[13px] font-semibold mb-3">
            Are you an EU citizen?
          </p>
          <YesNoButtons value={euCitizen} onChange={(v) => handleAnswer("eu", v)} />
        </div>

        {/* ── Q2: BSN ──────────────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-gray-300 text-[13px] font-semibold mb-3">
            Do you already have a BSN number?
          </p>
          <YesNoButtons value={hasBsn} onChange={(v) => handleAnswer("bsn", v)} />
        </div>

        {/* ── Disqualified message ─────────────────────────────── */}
        {disqualified && (
          <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-4">
            <p className="text-red-300 text-[13px] font-semibold leading-snug text-center">
              This position is currently available only for EU candidates with an existing BSN number.
            </p>
          </div>
        )}

        {/* ── CTA ─────────────────────────────────────────────── */}
        {!disqualified && (
          <button
            onClick={handleApply}
            disabled={!qualified}
            className={`
              w-full flex items-center justify-center gap-2.5
              font-black text-[16px] py-4 rounded-2xl
              transition-all duration-150
              ${qualified
                ? "bg-[#22C55E] hover:bg-green-400 active:scale-[0.98] text-white shadow-lg shadow-green-900/40"
                : "bg-white/10 text-gray-500 cursor-not-allowed"}
            `}
          >
            {/* WhatsApp icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 shrink-0"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.962-1.418A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.95 7.95 0 01-4.07-1.116l-.292-.174-3.036.868.872-3.046-.19-.31A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.29-5.89c-.233-.117-1.379-.681-1.593-.759-.214-.077-.37-.116-.526.117-.155.232-.603.759-.739.915-.136.155-.272.174-.505.058-.233-.117-.982-.362-1.87-1.154-.691-.617-1.158-1.38-1.294-1.613-.136-.232-.014-.358.103-.474.105-.104.233-.272.35-.408.116-.136.155-.233.233-.388.077-.155.039-.291-.019-.407-.059-.117-.527-1.27-.722-1.739-.19-.456-.384-.394-.527-.401l-.448-.008c-.156 0-.408.059-.621.291-.214.233-.814.796-.814 1.94s.834 2.25.95 2.406c.116.155 1.64 2.504 3.975 3.512.556.24 1.99.52 2.315.336.233-.136.942-.385 1.074-.756.131-.37.131-.686.092-.756-.039-.077-.155-.116-.388-.233z" />
            </svg>
            {qualified ? "Continue to WhatsApp →" : "Answer both questions"}
          </button>
        )}

        <p className="text-center text-gray-600 text-[11px] mt-3">
          {qualified
            ? "Opens WhatsApp · Your details are sent automatically"
            : disqualified
            ? "Check other positions that may suit your profile"
            : "Both questions required to proceed"}
        </p>
      </div>
    </>
  );
}
