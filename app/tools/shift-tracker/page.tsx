"use client";

import { useState, useId } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Shift {
  id:           string;
  date:         string;
  startTime:    string;
  endTime:      string;
  breakMinutes: number;
  hourlyRate:   number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shiftHours(shift: Shift): number {
  const [sh, sm] = shift.startTime.split(":").map(Number);
  const [eh, em] = shift.endTime.split(":").map(Number);
  const totalMinutes = (eh * 60 + em) - (sh * 60 + sm) - shift.breakMinutes;
  return Math.max(totalMinutes / 60, 0);
}

function shiftEarnings(shift: Shift): number {
  return shiftHours(shift) * shift.hourlyRate;
}

function formatHours(h: number): string {
  const hrs  = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  return `${hrs}h ${mins.toString().padStart(2, "0")}m`;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-NL", {
      weekday: "short", day: "numeric", month: "short",
    });
  } catch {
    return dateStr;
  }
}

// ─── Weekly quick-entry ───────────────────────────────────────────────────────

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function WeeklyView({ defaultRate }: { defaultRate: string }) {
  const [dayHours, setDayHours] = useState<string[]>(["8", "8", "8", "8", "8", "0", "0"]);
  const [rate, setRate]         = useState(parseFloat(defaultRate) || 13);

  const totalHours    = dayHours.reduce((s, h) => s + (parseFloat(h) || 0), 0);
  const totalEarnings = totalHours * rate;
  const daysWorked    = dayHours.filter((h) => parseFloat(h) > 0).length;

  function setDay(i: number, val: string) {
    const next = [...dayHours];
    next[i] = val;
    setDayHours(next);
  }

  return (
    <div className="space-y-4">
      {/* Rate input */}
      <div className="flex items-center gap-3">
        <label className="text-xs text-gray-500 shrink-0">Hourly rate:</label>
        <div className="relative w-32">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
            step="0.25"
            min="0"
            className="w-full border border-gray-200 rounded-lg pl-7 pr-10 py-2 text-sm focus:outline-none focus:border-brand-400"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">/hr</span>
        </div>
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {DAYS.map((day, i) => {
          const hrs  = parseFloat(dayHours[i]) || 0;
          const earn = hrs * rate;
          const isWeekend = i >= 5;
          return (
            <div key={day} className={`rounded-xl border p-2 text-center ${
              hrs > 0
                ? isWeekend
                  ? "border-amber-200 bg-amber-50"
                  : "border-brand-200 bg-brand-50"
                : "border-gray-100 bg-gray-50"
            }`}>
              <p className={`text-[10px] font-semibold mb-1.5 ${
                isWeekend ? "text-amber-600" : "text-gray-500"
              }`}>
                {day}
              </p>
              <input
                type="number"
                value={dayHours[i]}
                onChange={(e) => setDay(i, e.target.value)}
                min="0"
                max="24"
                step="0.5"
                className="w-full text-center border-0 bg-transparent text-sm font-bold text-gray-900 focus:outline-none"
                placeholder="0"
              />
              <p className="text-[10px] text-gray-400 mt-0.5">hrs</p>
              {hrs > 0 && (
                <p className="text-[10px] text-brand-600 font-medium mt-0.5">
                  €{earn.toFixed(0)}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Weekly totals */}
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-extrabold text-brand-600">{totalHours.toFixed(1)}</p>
            <p className="text-xs text-gray-500 mt-0.5">Total hours</p>
          </div>
          <div className="border-x border-gray-100">
            <p className="text-2xl font-extrabold text-green-600">€{totalEarnings.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-0.5">Est. gross pay</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-700">{daysWorked}</p>
            <p className="text-xs text-gray-500 mt-0.5">Days worked</p>
          </div>
        </div>
        {totalHours > 0 && (
          <div className="border-t border-gray-100 mt-3 pt-3 grid grid-cols-2 gap-2 text-center text-xs text-gray-500">
            <div>
              <p className="font-semibold text-gray-800">{totalHours > 0 ? `€${(totalEarnings / totalHours).toFixed(2)}/hr` : "—"}</p>
              <p>Effective rate</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">€{(totalEarnings * 1.08).toFixed(2)}</p>
              <p>+8% vakantiegeld</p>
            </div>
          </div>
        )}
      </div>

      <p className="text-[10px] text-gray-400 text-center">
        Weekend hours shown in amber. All data stays in your browser.
      </p>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function ShiftTrackerPage() {
  const uid = useId();
  const today = new Date().toISOString().slice(0, 10);

  const [mode,            setMode]           = useState<"weekly" | "shifts">("weekly");
  const [shifts,          setShifts]         = useState<Shift[]>([]);
  const [showForm,        setShowForm]       = useState(false);
  const [copied,          setCopied]         = useState(false);
  const [defaultRate,     setDefaultRate]    = useState("13.00");

  const [form, setForm] = useState({
    date:         today,
    startTime:    "07:00",
    endTime:      "15:30",
    breakMinutes: "30",
    hourlyRate:   defaultRate,
  });

  const totalHours    = shifts.reduce((s, sh) => s + shiftHours(sh), 0);
  const totalEarnings = shifts.reduce((s, sh) => s + shiftEarnings(sh), 0);

  function addShift() {
    const newShift: Shift = {
      id:           `${uid}-${Date.now()}`,
      date:         form.date,
      startTime:    form.startTime,
      endTime:      form.endTime,
      breakMinutes: parseInt(form.breakMinutes) || 0,
      hourlyRate:   parseFloat(form.hourlyRate) || 13,
    };
    if (shiftHours(newShift) <= 0) return;
    setShifts([...shifts, newShift].sort((a, b) => a.date.localeCompare(b.date)));
    setShowForm(false);
  }

  function removeShift(id: string) {
    setShifts(shifts.filter((s) => s.id !== id));
  }

  function copyReport() {
    const lines = [
      "AgencyCheck Shift Report",
      "========================",
      ...shifts.map(
        (s) =>
          `${formatDate(s.date)}  ${s.startTime}–${s.endTime}  (−${s.breakMinutes}min break)  ` +
          `${formatHours(shiftHours(s))}  €${shiftEarnings(s).toFixed(2)}`
      ),
      "========================",
      `Total: ${formatHours(totalHours)}  Estimated: €${totalEarnings.toFixed(2)}`,
    ];
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Link href="/tools" className="text-xs text-gray-400 hover:text-brand-600">← Tools</Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">🕐 Work Hours Tracker</h1>
      <p className="text-sm text-gray-500 mb-5">
        Track your hours to verify your payslip is correct. Data stays in your browser only.
      </p>

      {/* ── Mode toggle ── */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6 text-sm font-semibold">
        <button
          onClick={() => setMode("weekly")}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            mode === "weekly" ? "bg-white shadow-sm text-brand-700" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          📅 Weekly view (Mon–Sun)
        </button>
        <button
          onClick={() => setMode("shifts")}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            mode === "shifts" ? "bg-white shadow-sm text-brand-700" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          ⏱ Shift log (start/end times)
        </button>
      </div>

      {/* ── Weekly view ── */}
      {mode === "weekly" && (
        <WeeklyView defaultRate={defaultRate} />
      )}

      {/* ── Shift log view ── */}
      {mode === "shifts" && (
        <>
          {/* Totals card */}
          <div className="card p-5 mb-5">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-3xl font-extrabold text-brand-600">{formatHours(totalHours)}</p>
                <p className="text-xs text-gray-500 mt-1">Total hours logged</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-green-600">€{totalEarnings.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Estimated gross earnings</p>
              </div>
            </div>
            {shifts.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-3 text-center text-xs text-gray-500">
                <div>
                  <p className="font-semibold text-gray-800">{shifts.length}</p>
                  <p>Shifts</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {totalHours > 0 ? `€${(totalEarnings / totalHours).toFixed(2)}/hr` : "—"}
                  </p>
                  <p>Avg rate</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">€{(totalEarnings * 1.08).toFixed(2)}</p>
                  <p>+8% vakantiegeld</p>
                </div>
              </div>
            )}
          </div>

          {/* Default rate input */}
          <div className="card p-4 mb-5 flex items-center gap-3">
            <label className="text-sm text-gray-700 font-medium shrink-0">Default rate:</label>
            <div className="relative flex-1 max-w-36">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
              <input
                type="number"
                value={defaultRate}
                onChange={(e) => {
                  setDefaultRate(e.target.value);
                  setForm((f) => ({ ...f, hourlyRate: e.target.value }));
                }}
                step="0.25"
                min="0"
                className="w-full border border-gray-200 rounded-lg pl-7 pr-10 py-2 text-sm focus:outline-none focus:border-brand-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">/hr</span>
            </div>
            <p className="text-xs text-gray-400">Applied to new shifts</p>
          </div>

          {/* Add shift form */}
          {showForm ? (
            <div className="card p-4 mb-5 border-brand-200">
              <h3 className="text-sm font-bold text-gray-800 mb-4">Add shift</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Date</label>
                  <input type="date" value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Hourly rate (€)</label>
                  <input type="number" value={form.hourlyRate}
                    onChange={(e) => setForm((f) => ({ ...f, hourlyRate: e.target.value }))}
                    step="0.25" min="0"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Start time</label>
                  <input type="time" value={form.startTime}
                    onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">End time</label>
                  <input type="time" value={form.endTime}
                    onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400" />
                </div>
              </div>
              <div className="mb-4">
                <label className="text-xs text-gray-500 block mb-1">Break (minutes)</label>
                <select value={form.breakMinutes}
                  onChange={(e) => setForm((f) => ({ ...f, breakMinutes: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400">
                  {[0, 15, 30, 45, 60].map((m) => (
                    <option key={m} value={m}>{m === 0 ? "No break" : `${m} minutes`}</option>
                  ))}
                </select>
              </div>

              {/* Preview */}
              {form.startTime && form.endTime && (
                <div className="bg-brand-50 rounded-lg px-3 py-2 mb-4 text-xs text-brand-700">
                  Preview: {formatHours(shiftHours({
                    id: "", date: form.date,
                    startTime: form.startTime, endTime: form.endTime,
                    breakMinutes: parseInt(form.breakMinutes) || 0,
                    hourlyRate: parseFloat(form.hourlyRate) || 0,
                  }))} →{" "}
                  €{shiftEarnings({
                    id: "", date: form.date,
                    startTime: form.startTime, endTime: form.endTime,
                    breakMinutes: parseInt(form.breakMinutes) || 0,
                    hourlyRate: parseFloat(form.hourlyRate) || 0,
                  }).toFixed(2)}
                </div>
              )}

              <div className="flex gap-2">
                <button onClick={addShift}
                  className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                  Add shift
                </button>
                <button onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { setShowForm(true); setForm((f) => ({ ...f, hourlyRate: defaultRate })); }}
              className="w-full border-2 border-dashed border-brand-200 hover:border-brand-400 text-brand-600 font-semibold py-3 rounded-xl transition-colors text-sm mb-5"
            >
              + Add shift
            </button>
          )}

          {/* Shift list */}
          {shifts.length > 0 && (
            <div className="card overflow-hidden mb-5">
              <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Your shifts</p>
                <button onClick={copyReport}
                  className="text-xs text-brand-600 font-medium hover:underline">
                  {copied ? "✓ Copied!" : "Copy report"}
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {shifts.map((shift) => (
                  <div key={shift.id} className="px-4 py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{formatDate(shift.date)}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {shift.startTime} – {shift.endTime}
                        {shift.breakMinutes > 0 && ` · −${shift.breakMinutes}min break`}
                        {" · €"}{shift.hourlyRate.toFixed(2)}/hr
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-gray-900">{formatHours(shiftHours(shift))}</p>
                      <p className="text-xs text-green-600 font-medium">€{shiftEarnings(shift).toFixed(2)}</p>
                    </div>
                    <button onClick={() => removeShift(shift.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors ml-1 shrink-0"
                      aria-label="Remove shift">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {shifts.length === 0 && !showForm && (
            <div className="text-center py-10 text-gray-400">
              <p className="text-4xl mb-3">🕐</p>
              <p className="text-sm font-semibold">No shifts logged yet.</p>
              <p className="text-xs mt-1">Add your first shift above.</p>
            </div>
          )}
        </>
      )}

      {/* ── Cross-tool links ── */}
      <div className="flex flex-wrap gap-4 mt-6">
        <Link href="/tools/payslip-checker"   className="text-xs text-brand-600 font-medium hover:underline">→ Check your payslip</Link>
        <Link href="/tools/salary-calculator" className="text-xs text-brand-600 font-medium hover:underline">→ Salary calculator</Link>
        <Link href="/tools"                   className="text-xs text-gray-400 font-medium hover:underline">→ All tools</Link>
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        Data is stored in your browser only and is never sent to AgencyCheck servers.
      </p>
    </div>
  );
}
