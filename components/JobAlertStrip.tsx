"use client";

import { useState } from "react";

const WA_BASE = "https://wa.me/31649210631";

const EXPERIENCE_OPTIONS = [
  { id: "driver",      label: "🚛 Driver (C/CE/BE)" },
  { id: "reachtruck",  label: "🏗️ Reachtruck / Forklift" },
  { id: "orderpicker", label: "📦 Order Picker" },
  { id: "operator",    label: "🏭 Production Operator" },
  { id: "machine",     label: "🔧 Machine Operator" },
  { id: "other",       label: "🔍 Other" },
];

export default function JobAlertStrip() {
  const [open, setOpen]   = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleSubscribe() {
    const expLabels = EXPERIENCE_OPTIONS
      .filter((o) => selected.includes(o.id))
      .map((o) => o.label.replace(/^\S+\s/, "")) // strip emoji
      .join(", ");

    const msg = `Hi, please add me to your job alerts list.\nMy experience: ${expLabels || "Not specified"}\nI'm looking for work in the Netherlands.`;
    window.open(`${WA_BASE}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
    setOpen(false);
    setSelected([]);
  }

  return (
    <div className="my-10 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/20 flex items-center justify-center text-lg">
          🔔
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-[14px] leading-snug mb-0.5">
            New jobs every week
          </p>
          <p className="text-gray-500 text-[12px] leading-snug">
            Get notified on WhatsApp when new positions open up.
          </p>
        </div>
      </div>

      {/* ── Experience selector (expands on click) ───────────────── */}
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="
            w-full flex items-center justify-center gap-2
            border border-[#22C55E]/30 bg-[#22C55E]/10
            hover:bg-[#22C55E]/20 active:scale-[0.98]
            text-[#22C55E] font-bold text-[13px]
            py-3 rounded-xl transition-all duration-150
          "
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.962-1.418A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.95 7.95 0 01-4.07-1.116l-.292-.174-3.036.868.872-3.046-.19-.31A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.29-5.89c-.233-.117-1.379-.681-1.593-.759-.214-.077-.37-.116-.526.117-.155.232-.603.759-.739.915-.136.155-.272.174-.505.058-.233-.117-.982-.362-1.87-1.154-.691-.617-1.158-1.38-1.294-1.613-.136-.232-.014-.358.103-.474.105-.104.233-.272.35-.408.116-.136.155-.233.233-.388.077-.155.039-.291-.019-.407-.059-.117-.527-1.27-.722-1.739-.19-.456-.384-.394-.527-.401l-.448-.008c-.156 0-.408.059-.621.291-.214.233-.814.796-.814 1.94s.834 2.25.95 2.406c.116.155 1.64 2.504 3.975 3.512.556.24 1.99.52 2.315.336.233-.136.942-.385 1.074-.756.131-.37.131-.686.092-.756-.039-.077-.155-.116-.388-.233z" />
          </svg>
          Add me to job alerts →
        </button>
      ) : (
        <div className="space-y-3">
          {/* Question */}
          <p className="text-gray-300 text-[13px] font-semibold">
            What's your experience? <span className="text-gray-600 font-normal">(select all that apply)</span>
          </p>

          {/* Options grid */}
          <div className="grid grid-cols-2 gap-2">
            {EXPERIENCE_OPTIONS.map((opt) => {
              const active = selected.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => toggle(opt.id)}
                  className={`
                    text-left px-3 py-2.5 rounded-xl border text-[13px] font-semibold
                    transition-all duration-150 leading-snug
                    ${active
                      ? "border-emerald-400 bg-emerald-400/15 text-emerald-300"
                      : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}
                  `}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Subscribe CTA */}
          <button
            onClick={handleSubscribe}
            disabled={selected.length === 0}
            className={`
              w-full flex items-center justify-center gap-2
              font-bold text-[14px] py-3.5 rounded-xl
              transition-all duration-150
              ${selected.length > 0
                ? "bg-[#22C55E] hover:bg-green-400 active:scale-[0.98] text-white"
                : "bg-white/10 text-gray-500 cursor-not-allowed"}
            `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.962-1.418A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.95 7.95 0 01-4.07-1.116l-.292-.174-3.036.868.872-3.046-.19-.31A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.29-5.89c-.233-.117-1.379-.681-1.593-.759-.214-.077-.37-.116-.526.117-.155.232-.603.759-.739.915-.136.155-.272.174-.505.058-.233-.117-.982-.362-1.87-1.154-.691-.617-1.158-1.38-1.294-1.613-.136-.232-.014-.358.103-.474.105-.104.233-.272.35-.408.116-.136.155-.233.233-.388.077-.155.039-.291-.019-.407-.059-.117-.527-1.27-.722-1.739-.19-.456-.384-.394-.527-.401l-.448-.008c-.156 0-.408.059-.621.291-.214.233-.814.796-.814 1.94s.834 2.25.95 2.406c.116.155 1.64 2.504 3.975 3.512.556.24 1.99.52 2.315.336.233-.136.942-.385 1.074-.756.131-.37.131-.686.092-.756-.039-.077-.155-.116-.388-.233z" />
            </svg>
            {selected.length > 0 ? "Send to WhatsApp →" : "Select your experience first"}
          </button>

          {/* Cancel */}
          <button
            onClick={() => { setOpen(false); setSelected([]); }}
            className="w-full text-center text-gray-600 text-[12px] hover:text-gray-400 transition-colors py-1"
          >
            Cancel
          </button>
        </div>
      )}

      {!open && (
        <p className="text-center text-gray-600 text-[11px] mt-2">
          Free · No spam · Unsubscribe anytime
        </p>
      )}
    </div>
  );
}
