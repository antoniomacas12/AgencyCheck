"use client";

import { useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Props {
  jobTitle: string;
  waBase: string; // wa.me URL without text param, e.g. "https://wa.me/31649210631"
  children: (openFn: () => void) => React.ReactNode;
}

type EUAnswer = "yes" | "no" | null;
type StartAnswer = "asap" | "2weeks" | "month" | null;

// ─── Helper: build WhatsApp URL with pre-filled message ────────────────────────
function buildWaUrl(waBase: string, jobTitle: string, eu: EUAnswer, start: StartAnswer) {
  const euText   = eu    === "yes"    ? "✅ EU work permit: Yes"
                 : eu    === "no"     ? "❌ EU work permit: No"
                 : "";
  const startText = start === "asap"   ? "⚡ Start: Right now"
                  : start === "2weeks" ? "📅 Start: Within 2 weeks"
                  : start === "month"  ? "🗓 Start: Next month"
                  : "";

  const msg = `Hi, I want to apply for: ${jobTitle}\n${euText}\n${startText}`.trim();
  return `${waBase}?text=${encodeURIComponent(msg)}`;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function ApplyPreScreen({ jobTitle, waBase, children }: Props) {
  const [open, setOpen]     = useState(false);
  const [eu, setEu]         = useState<EUAnswer>(null);
  const [start, setStart]   = useState<StartAnswer>(null);

  const bothAnswered = eu !== null && start !== null;
  const disqualified = eu === "no";

  function handleOpen() {
    setOpen(true);
    setEu(null);
    setStart(null);
  }

  function handleApply() {
    const url = buildWaUrl(waBase, jobTitle, eu, start);
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
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
        aria-label="Quick application check"
        className={`
          fixed bottom-0 left-0 right-0 z-50
          bg-[#0f2318] border-t border-white/10
          rounded-t-3xl px-5 pt-5 pb-8
          transition-transform duration-300 ease-out
          ${open ? "translate-y-0" : "translate-y-full"}
        `}
      >
        {/* Handle bar */}
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

        {/* Header */}
        <div className="mb-6">
          <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400 mb-1">
            Quick check · 2 questions
          </p>
          <h2 className="text-white font-bold text-[18px] leading-snug">
            {jobTitle}
          </h2>
        </div>

        {/* ── Q1: EU work permit ───────────────────────────────── */}
        <div className="mb-5">
          <p className="text-gray-300 text-[13px] font-semibold mb-3">
            Do you have EU work authorisation?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {([
              { val: "yes" as EUAnswer, label: "✅  Yes", active: "border-emerald-400 bg-emerald-400/15 text-emerald-300" },
              { val: "no"  as EUAnswer, label: "❌  No",  active: "border-red-400/60 bg-red-400/10 text-red-300" },
            ]).map(({ val, label, active }) => (
              <button
                key={val}
                onClick={() => setEu(val)}
                className={`
                  py-3.5 rounded-xl border text-[14px] font-bold transition-all duration-150
                  ${eu === val
                    ? active
                    : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}
                `}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Soft warning if no EU */}
          {eu === "no" && (
            <p className="text-amber-400/80 text-[12px] mt-2 leading-snug">
              Most positions require EU work authorisation. You can still send a message — we'll let you know what options exist.
            </p>
          )}
        </div>

        {/* ── Q2: Start date ───────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-gray-300 text-[13px] font-semibold mb-3">
            When can you start?
          </p>
          <div className="grid grid-cols-3 gap-2">
            {([
              { val: "asap"   as StartAnswer, label: "⚡ Right now"     },
              { val: "2weeks" as StartAnswer, label: "📅 2 weeks"       },
              { val: "month"  as StartAnswer, label: "🗓 Next month"    },
            ]).map(({ val, label }) => (
              <button
                key={val}
                onClick={() => setStart(val)}
                className={`
                  py-3.5 rounded-xl border text-[13px] font-bold transition-all duration-150 leading-tight
                  ${start === val
                    ? "border-emerald-400 bg-emerald-400/15 text-emerald-300"
                    : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <button
          onClick={handleApply}
          disabled={!bothAnswered}
          className={`
            w-full flex items-center justify-center gap-2.5
            font-black text-[16px] py-4 rounded-2xl
            transition-all duration-150
            ${bothAnswered
              ? "bg-[#22C55E] hover:bg-green-400 active:scale-[0.98] text-white shadow-lg shadow-green-900/40"
              : "bg-white/10 text-gray-500 cursor-not-allowed"}
          `}
        >
          {/* WhatsApp icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.962-1.418A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.95 7.95 0 01-4.07-1.116l-.292-.174-3.036.868.872-3.046-.19-.31A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.29-5.89c-.233-.117-1.379-.681-1.593-.759-.214-.077-.37-.116-.526.117-.155.232-.603.759-.739.915-.136.155-.272.174-.505.058-.233-.117-.982-.362-1.87-1.154-.691-.617-1.158-1.38-1.294-1.613-.136-.232-.014-.358.103-.474.105-.104.233-.272.35-.408.116-.136.155-.233.233-.388.077-.155.039-.291-.019-.407-.059-.117-.527-1.27-.722-1.739-.19-.456-.384-.394-.527-.401l-.448-.008c-.156 0-.408.059-.621.291-.214.233-.814.796-.814 1.94s.834 2.25.95 2.406c.116.155 1.64 2.504 3.975 3.512.556.24 1.99.52 2.315.336.233-.136.942-.385 1.074-.756.131-.37.131-.686.092-.756-.039-.077-.155-.116-.388-.233z" />
          </svg>
          {bothAnswered ? "Send to WhatsApp →" : "Answer both questions"}
        </button>

        <p className="text-center text-gray-600 text-[11px] mt-3">
          Opens WhatsApp · Your answers are sent automatically
        </p>
      </div>
    </>
  );
}
