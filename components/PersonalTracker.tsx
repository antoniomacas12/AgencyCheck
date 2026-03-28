"use client";

/**
 * PersonalTracker — localStorage wage reality widget.
 *
 * The user enters their deal (hourly rate, hours, housing, transport).
 * The widget shows: "You earn €X gross — You actually keep €Y — You LOSE €Z/week"
 * Numbers persist across sessions via localStorage.
 * Designed to be emotionally impactful: loss emphasis > income.
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const LS_KEY = "ac_tracker_v1";

interface TrackerState {
  hourlyRate:    number;  // €/hr
  hoursPerWeek:  number;
  housingCost:   number;  // €/week (0 = no housing)
  transportCost: number;  // €/week
  taxRate:       number;  // fraction, e.g. 0.22
  hasHousing:    boolean;
}

const DEFAULTS: TrackerState = {
  hourlyRate:    15,
  hoursPerWeek:  40,
  housingCost:   140,
  transportCost: 35,
  taxRate:       0.22,
  hasHousing:    true,
};

function calcNumbers(s: TrackerState) {
  const gross     = s.hourlyRate * s.hoursPerWeek;
  const taxAmt    = Math.round(gross * s.taxRate);
  const housing   = s.hasHousing ? s.housingCost : 0;
  const transport = s.transportCost;
  const net       = Math.round(gross - taxAmt - housing - transport);
  const lost      = gross - net;
  const keepPct   = Math.round((net / gross) * 100);
  return { gross: Math.round(gross), taxAmt, housing, transport, net, lost: Math.round(lost), keepPct };
}

function SliderRow({
  label, value, min, max, step, prefix = "", suffix = "",
  onChange, highlight = false,
}: {
  label: string; value: number; min: number; max: number; step: number;
  prefix?: string; suffix?: string; onChange: (v: number) => void; highlight?: boolean;
}) {
  return (
    <div className={`rounded-lg px-3 py-2.5 ${highlight ? "bg-red-950/40 border border-red-800/40" : "bg-gray-800/40"}`}>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-xs text-gray-300">{label}</p>
        <p className={`text-sm font-black tabular-nums ${highlight ? "text-red-400" : "text-white"}`}>
          {prefix}{value}{suffix}
        </p>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-red-500"
        style={{ background: `linear-gradient(to right, ${highlight ? "#ef4444" : "#6366f1"} 0%, ${highlight ? "#ef4444" : "#6366f1"} ${((value - min) / (max - min)) * 100}%, #374151 ${((value - min) / (max - min)) * 100}%, #374151 100%)` }}
      />
      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-gray-600">{prefix}{min}{suffix}</span>
        <span className="text-[9px] text-gray-600">{prefix}{max}{suffix}</span>
      </div>
    </div>
  );
}

export default function PersonalTracker() {
  const [state,       setState]       = useState<TrackerState>(DEFAULTS);
  const [expanded,    setExpanded]    = useState(false);
  const [mounted,     setMounted]     = useState(false);
  const [saved,       setSaved]       = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [savedDate,   setSavedDate]   = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<TrackerState & { _savedAt?: string }>;
        const { _savedAt, ...trackerData } = parsed as Partial<TrackerState> & { _savedAt?: string };
        setState((prev) => ({ ...prev, ...trackerData }));
        setExpanded(true); // auto-expand if user has saved data
        setIsReturning(true);
        if (_savedAt) {
          // Format as relative time (e.g. "2 days ago", "today")
          try {
            const saved = new Date(_savedAt);
            const diffMs = Date.now() - saved.getTime();
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            if (diffDays === 0) setSavedDate("today");
            else if (diffDays === 1) setSavedDate("yesterday");
            else setSavedDate(`${diffDays} days ago`);
          } catch {
            setSavedDate(null);
          }
        }
      }
    } catch {}
  }, []);

  // Persist to localStorage (include save timestamp)
  const save = useCallback(() => {
    try {
      const payload = { ...state, _savedAt: new Date().toISOString() };
      localStorage.setItem(LS_KEY, JSON.stringify(payload));
      setSaved(true);
      setIsReturning(true);
      setSavedDate("today");
      setTimeout(() => setSaved(false), 2000);
    } catch {}
  }, [state]);

  const set = <K extends keyof TrackerState>(key: K, value: TrackerState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const nums = calcNumbers(state);

  // Color the keep % ring
  const keepColor =
    nums.keepPct >= 70 ? "text-green-400" :
    nums.keepPct >= 50 ? "text-amber-400" :
    "text-red-400";

  const lostColor =
    nums.lost > 300 ? "text-red-400" :
    nums.lost > 200 ? "text-orange-400" :
    "text-amber-400";

  if (!mounted) return null;

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden">

      {/* ── Summary bar (always visible) ── */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-4 py-4 hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shrink-0">
            <span className="text-base">📉</span>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Your personal reality check</p>
            <p className="text-sm font-black text-white leading-tight">
              At €{state.hourlyRate}/hr you{" "}
              <span className="text-green-400">earn €{nums.gross}/wk</span>
              {" · "}
              <span className={lostColor}>lose €{nums.lost}/wk</span>
              {" · "}
              <span className={keepColor}>keep €{nums.net}/wk</span>
            </p>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform shrink-0 ml-2 ${expanded ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ── Expanded panel ── */}
      {expanded && (
        <div className="border-t border-gray-800 px-4 pb-5 pt-4">

          {/* ── Welcome back banner (only shown when returning user with saved data) ── */}
          {isReturning && (
            <div className="flex items-center gap-2 bg-brand-600/15 border border-brand-600/30 rounded-xl px-3 py-2.5 mb-4">
              <span className="text-base shrink-0">👋</span>
              <div>
                <p className="text-xs font-bold text-brand-300 leading-tight">
                  Welcome back — your numbers are saved
                </p>
                {savedDate && (
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Last saved {savedDate} · stored on your device only
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Main numbers — emotional layout */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            <div className="rounded-xl bg-gray-800/60 p-3 text-center">
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">Gross / week</p>
              <p className="text-xl font-black text-white">€{nums.gross}</p>
              <p className="text-[9px] text-gray-500 mt-0.5">before anything</p>
            </div>
            <div className="rounded-xl bg-red-950/60 border border-red-800/40 p-3 text-center">
              <p className="text-[9px] font-bold uppercase tracking-widest text-red-500 mb-1">⚠ You lose</p>
              <p className="text-xl font-black text-red-400">€{nums.lost}</p>
              <p className="text-[9px] text-red-600 mt-0.5">every week</p>
            </div>
            <div className="rounded-xl bg-gray-800/60 p-3 text-center">
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">You keep</p>
              <p className={`text-xl font-black ${keepColor}`}>€{nums.net}</p>
              <p className="text-[9px] text-gray-500 mt-0.5">{nums.keepPct}% of gross</p>
            </div>
          </div>

          {/* Deduction breakdown */}
          <div className="space-y-1 mb-5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Where the money goes</p>
            {[
              { label: "Gross income",          amount: nums.gross,     color: "text-green-400", prefix: "+" },
              { label: "− Income tax (~22%)",   amount: nums.taxAmt,    color: "text-red-400",   prefix: "−" },
              ...(state.hasHousing ? [{ label: "− Housing (agency deducts)", amount: nums.housing, color: "text-red-400", prefix: "−" }] : []),
              { label: "− Transport",            amount: nums.transport, color: "text-orange-400", prefix: "−" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-xs py-1 border-b border-gray-800/60">
                <span className="text-gray-400">{row.label}</span>
                <span className={`font-bold tabular-nums ${row.color}`}>{row.prefix}€{row.amount}</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-sm py-1.5 pt-2">
              <span className="font-black text-white">You actually keep</span>
              <span className={`font-black tabular-nums ${keepColor}`}>€{nums.net}/week</span>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-2.5 mb-4">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Adjust your situation</p>
            <SliderRow label="Hourly rate (€/hr)" value={state.hourlyRate} min={13} max={25} step={0.5}
              prefix="€" onChange={(v) => set("hourlyRate", v)} />
            <SliderRow label="Hours per week" value={state.hoursPerWeek} min={20} max={48} step={1}
              suffix="h" onChange={(v) => set("hoursPerWeek", v)} />
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs text-gray-300">Agency housing included?</p>
                <button
                  onClick={() => set("hasHousing", !state.hasHousing)}
                  className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${
                    state.hasHousing ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {state.hasHousing ? "Yes (deducted)" : "No"}
                </button>
              </div>
            </div>
            {state.hasHousing && (
              <SliderRow label="Housing cost (€/week)" value={state.housingCost} min={80} max={200} step={5}
                prefix="€" onChange={(v) => set("housingCost", v)} highlight />
            )}
            <SliderRow label="Transport cost (€/week)" value={state.transportCost} min={0} max={80} step={5}
              prefix="€" onChange={(v) => set("transportCost", v)} highlight />
          </div>

          {/* Annualized shock stat */}
          <div className="rounded-xl bg-red-950/40 border border-red-800/30 px-3 py-3 mb-4">
            <p className="text-xs text-red-300 font-semibold leading-snug">
              That&apos;s <strong className="text-red-400 text-sm">€{(nums.lost * 52).toLocaleString()}/year</strong> you
              lose to housing, tax &amp; transport — without realizing it.
            </p>
            <p className="text-[10px] text-red-600 mt-1">
              Most workers only notice when they count what&apos;s left at the end of the month.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={save}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
                saved
                  ? "bg-green-700 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300"
              }`}
            >
              {saved ? "✓ Saved" : "💾 Save my numbers"}
            </button>
            <Link
              href="/tools/real-income-calculator"
              className="flex-1 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white transition-colors text-center"
            >
              Full calculator →
            </Link>
          </div>

          <p className="text-[9px] text-gray-600 text-center mt-3">
            Saved locally on your device · No account needed · AgencyCheck never shares your data
          </p>
        </div>
      )}
    </div>
  );
}
