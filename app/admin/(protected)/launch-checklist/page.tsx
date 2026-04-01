"use client";

import { useState, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// CHECKLIST DATA
// ---------------------------------------------------------------------------

interface CheckItem {
  id: string;
  label: string;
  note?: string;
}
interface Section {
  id: string;
  letter: string;
  title: string;
  color: string;
  dotColor: string;
  items: CheckItem[];
}

const SECTIONS: Section[] = [
  {
    id: "public-flow",
    letter: "A",
    title: "Public Flow Test",
    color: "bg-blue-50 border-blue-200",
    dotColor: "bg-blue-500",
    items: [
      { id: "a1", label: "Open homepage", note: "Verify layout loads, no broken elements, hero visible" },
      { id: "a2", label: "Click main CTA button", note: "Verify the correct flow starts (housing / job search)" },
      { id: "a3", label: "Complete housing selection step", note: "Step progresses correctly, no JS errors" },
      { id: "a4", label: "Submit lead form with test data", note: "Use a real phone number to verify receipt" },
      { id: "a5", label: "Confirm success message appears", note: "User sees confirmation — not a blank page or error" },
      { id: "a6", label: "Open /admin/leads and verify lead saved", note: "New entry appears with correct name, phone, source" },
    ],
  },
  {
    id: "admin-flow",
    letter: "B",
    title: "Admin Flow Test",
    color: "bg-violet-50 border-violet-200",
    dotColor: "bg-violet-500",
    items: [
      { id: "b1", label: "Navigate to /admin/login", note: "Login page loads, form visible" },
      { id: "b2", label: "Login with admin credentials", note: "Redirected to /admin/leads on success" },
      { id: "b3", label: "Open /admin/leads", note: "Pipeline table loads, leads visible" },
      { id: "b4", label: "Confirm test lead appears", note: "From Section A — shows status = New" },
      { id: "b5", label: "Open lead detail page", note: "All fields visible: name, phone, work type, housing" },
      { id: "b6", label: "Assign agency to lead", note: "Dropdown updates and saves without error" },
      { id: "b7", label: "Mark lead as 'Approved'", note: "Status badge updates in real time" },
      { id: "b8", label: "Mark lead as 'Sent'", note: "sentAt timestamp is set" },
      { id: "b9", label: "Mark lead as 'Converted'", note: "Status shows Converted — pipeline complete" },
    ],
  },
  {
    id: "billing",
    letter: "C",
    title: "Billing System Test",
    color: "bg-emerald-50 border-emerald-200",
    dotColor: "bg-emerald-500",
    items: [
      { id: "c1", label: "Create at least 2 leads and mark both Converted", note: "These represent billable placements" },
      { id: "c2", label: "Open billing summary (if enabled)", note: "Check /admin/billing or billing section in leads" },
      { id: "c3", label: "Verify converted lead count is correct", note: "Should match manual count" },
      { id: "c4", label: "Verify per-agency totals are shown", note: "Each agency shows correct number" },
      { id: "c5", label: "Verify total € amount is calculated correctly", note: "Cross-check with known per-lead fee" },
      { id: "c6", label: "Verify billing period grouping works", note: "Month/week groupings display correctly" },
    ],
  },
  {
    id: "translations",
    letter: "D",
    title: "Translation Test",
    color: "bg-amber-50 border-amber-200",
    dotColor: "bg-amber-500",
    items: [
      { id: "d1", label: "Switch to English — full page scan", note: "URL /en — all text in English, no placeholders" },
      { id: "d2", label: "Switch to Polish — full page scan", note: "URL /pl — no English text visible anywhere" },
      { id: "d3", label: "Switch to Romanian — full page scan", note: "URL /ro — no English text visible anywhere" },
      { id: "d4", label: "Check all CTA buttons in each language", note: "Labels correct, not empty, not raw keys" },
      { id: "d5", label: "Check all form labels in each language", note: "Input placeholders and labels translated" },
      { id: "d6", label: "Check validation error messages", note: "Required field errors appear in correct language" },
      { id: "d7", label: "Check success message after submit", note: "Confirmation text fully translated in PL + RO" },
    ],
  },
  {
    id: "mobile",
    letter: "E",
    title: "Mobile Test",
    color: "bg-pink-50 border-pink-200",
    dotColor: "bg-pink-500",
    items: [
      { id: "e1", label: "Open site on a real mobile device or browser DevTools mobile", note: "iPhone SE / 375px width is the minimum target" },
      { id: "e2", label: "Verify layout is clean — no horizontal scroll", note: "Nothing overflows the viewport" },
      { id: "e3", label: "Verify CTA button is fully visible", note: "Not hidden behind nav or cut off" },
      { id: "e4", label: "Complete the lead form on mobile", note: "All inputs reachable, keyboard doesn't break layout" },
      { id: "e5", label: "Verify no overlapping elements", note: "Floating widgets, modals, and nav don't collide" },
    ],
  },
  {
    id: "image-safety",
    letter: "F",
    title: "Image Safety / GDPR",
    color: "bg-red-50 border-red-200",
    dotColor: "bg-red-500",
    items: [
      { id: "f1", label: "Open a sample of housing/worker images", note: "Check at least one from each agency folder" },
      { id: "f2", label: "Confirm NO full names visible in images", note: "Check ID cards, contracts, documents in photos" },
      { id: "f3", label: "Confirm NO home addresses visible", note: "No street/city visible on any document in photos" },
      { id: "f4", label: "Confirm NO BSN (citizen service) numbers", note: "9-digit Dutch IDs must not be readable" },
      { id: "f5", label: "Confirm NO IBAN bank account numbers", note: "NL prefix codes must not appear" },
      { id: "f6", label: "Confirm faces are blurred where detected", note: "Haar cascade blur was applied — spot check 5 images" },
      { id: "f7", label: "Confirm no sensitive printed text remains", note: "Salary slips, contracts, payslips fully obscured" },
    ],
  },
  {
    id: "data-validation",
    letter: "G",
    title: "Data Validation",
    color: "bg-orange-50 border-orange-200",
    dotColor: "bg-orange-500",
    items: [
      { id: "g1", label: "Spot-check 10 job listings — no salary below €14.71/hr", note: "Dutch WML Jan 2026 is the legal minimum" },
      { id: "g2", label: "Scan for duplicate job slugs", note: "No two jobs with same URL should appear in listings" },
      { id: "g3", label: "Verify featured jobs appear at the top", note: "FLEXCRAFT, ATIK, INTRO EU, HR KAMER jobs first" },
      { id: "g4", label: "Verify agency names and slugs match their pages", note: "Click an agency — listing matches /agencies/[slug]" },
      { id: "g5", label: "Verify accommodation flags are correct", note: "Jobs marked housing:YES should show housing badge" },
      { id: "g6", label: "Check new cities appear in city filter", note: "Bergen op Zoom, Enschede, Roosendaal etc. visible" },
    ],
  },
  {
    id: "analytics",
    letter: "H",
    title: "Analytics Test",
    color: "bg-cyan-50 border-cyan-200",
    dotColor: "bg-cyan-500",
    items: [
      { id: "h1", label: "Set NEXT_PUBLIC_GA_ID in .env and redeploy", note: "Without this GA4 is silently disabled — verify the env var is set on host" },
      { id: "h2", label: "Load homepage — confirm GA4 fires in browser Network tab", note: "Look for request to google-analytics.com or googletagmanager.com" },
      { id: "h3", label: "Click main CTA — verify event captured in GA4 DebugView", note: "Enable GA4 DebugView in Google Analytics console" },
      { id: "h4", label: "Submit lead form — verify conversion event tracked", note: "Conversion should appear in GA4 within 30 seconds" },
      { id: "h5", label: "Confirm no duplicate events fire", note: "Reload page, check only one pageview — not two or three" },
    ],
  },
  {
    id: "deployment",
    letter: "I",
    title: "Deployment Check",
    color: "bg-gray-50 border-gray-200",
    dotColor: "bg-gray-500",
    items: [
      { id: "i1", label: "Run npm run build — exits with no errors", note: "Zero TypeScript errors, zero ESLint errors" },
      { id: "i2", label: "No runtime errors in browser console after deploy", note: "Open DevTools → Console on live URL. Must be clean." },
      { id: "i3", label: "Database migration is applied on the server", note: "Run npx prisma db push on server before first request" },
      { id: "i4", label: "ADMIN_PASSWORD changed from default", note: "Default is 'admin2024' — must be changed before going live" },
      { id: "i5", label: "ADMIN_SESSION_SECRET is a secure random string (≥32 chars)", note: "Do not use the placeholder from .env.local" },
      { id: "i6", label: "NEXT_PUBLIC_BASE_URL set to real domain", note: "e.g. https://agencycheck.io — not localhost" },
      { id: "i7", label: "RESEND_API_KEY configured if email notifications required", note: "Optional — but email-to-agency won't work without it" },
      { id: "i8", label: "No dev.db committed to Git / on server", note: "Production database must be on persistent storage, not repo" },
    ],
  },
];

const STORAGE_KEY = "agencycheck_launch_checklist_v1";
const ALL_ITEM_IDS = SECTIONS.flatMap((s) => s.items.map((i) => i.id));
const TOTAL = ALL_ITEM_IDS.length;

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

function loadState(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveState(checked: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  } catch {
    // storage full or private mode — ignore
  }
}

// ---------------------------------------------------------------------------
// SUBCOMPONENTS
// ---------------------------------------------------------------------------

function SectionBlock({
  section,
  checked,
  onToggle,
}: {
  section: Section;
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  const done = section.items.filter((i) => checked[i.id]).length;
  const allDone = done === section.items.length;

  return (
    <div className={`rounded-xl border ${section.color} overflow-hidden`}>
      {/* Section header */}
      <div className="px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`w-7 h-7 rounded-full ${section.dotColor} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}
          >
            {section.letter}
          </span>
          <h2 className="font-bold text-gray-900 text-sm">{section.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">
            {done}/{section.items.length}
          </span>
          {allDone && (
            <span className="text-xs bg-green-600 text-white font-bold px-2 py-0.5 rounded-full">
              ✓ Done
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-black/5 mx-5 rounded-full mb-0.5">
        <div
          className={`h-0.5 rounded-full transition-all duration-300 ${allDone ? "bg-green-500" : "bg-blue-500"}`}
          style={{ width: `${(done / section.items.length) * 100}%` }}
        />
      </div>

      {/* Items */}
      <div className="divide-y divide-black/5">
        {section.items.map((item) => (
          <label
            key={item.id}
            className={`flex items-start gap-3 px-5 py-3 cursor-pointer hover:bg-black/5 transition-colors ${
              checked[item.id] ? "opacity-60" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={!!checked[item.id]}
              onChange={() => onToggle(item.id)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer flex-shrink-0 accent-blue-600"
            />
            <div className="min-w-0">
              <p
                className={`text-sm font-medium leading-snug ${
                  checked[item.id] ? "line-through text-gray-400" : "text-gray-800"
                }`}
              >
                {item.label}
              </p>
              {item.note && (
                <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                  {item.note}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN PAGE
// ---------------------------------------------------------------------------

export default function LaunchChecklistPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage after mount
  useEffect(() => {
    setChecked(loadState());
    setHydrated(true);
  }, []);

  // Persist whenever state changes
  useEffect(() => {
    if (hydrated) saveState(checked);
  }, [checked, hydrated]);

  const toggleItem = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const doneCount = ALL_ITEM_IDS.filter((id) => checked[id]).length;
  const allComplete = doneCount === TOTAL;
  const pct = Math.round((doneCount / TOTAL) * 100);

  function markAllComplete() {
    const all: Record<string, boolean> = {};
    ALL_ITEM_IDS.forEach((id) => (all[id] = true));
    setChecked(all);
  }

  function resetAll() {
    if (window.confirm("Reset all checklist items? This cannot be undone.")) {
      setChecked({});
    }
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5 sticky top-[52px] z-10 shadow-sm">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                🚀 Launch Checklist
                {allComplete && (
                  <span className="text-sm bg-green-600 text-white font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                    ALL DONE
                  </span>
                )}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {doneCount} of {TOTAL} items completed · {pct}%
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetAll}
                className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition"
              >
                Reset
              </button>
              <button
                onClick={markAllComplete}
                disabled={allComplete}
                className="px-3 py-1.5 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Mark all complete
              </button>
            </div>
          </div>

          {/* Overall progress bar */}
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                allComplete ? "bg-green-500" : pct > 66 ? "bg-blue-500" : pct > 33 ? "bg-amber-400" : "bg-red-400"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 space-y-4">
        {SECTIONS.map((section) => (
          <SectionBlock
            key={section.id}
            section={section}
            checked={checked}
            onToggle={toggleItem}
          />
        ))}

        {/* ---------------------------------------------------------------- */}
        {/* FINAL LAUNCH CONFIRMATION                                         */}
        {/* ---------------------------------------------------------------- */}
        <div
          className={`rounded-xl border-2 transition-all duration-500 ${
            allComplete
              ? "border-green-500 bg-green-50 shadow-lg shadow-green-100"
              : "border-dashed border-gray-200 bg-white opacity-50"
          }`}
        >
          <div className="px-6 py-6 text-center">
            {allComplete ? (
              <>
                <div className="text-4xl mb-3">✅</div>
                <h2 className="text-lg font-bold text-green-800">
                  System is ready for live traffic
                </h2>
                <p className="text-sm text-green-700 mt-1">
                  All {TOTAL} checks passed. AgencyCheck is cleared for launch.
                </p>
                <div className="mt-4 text-xs text-green-600 font-mono bg-green-100 rounded-lg px-4 py-2 inline-block">
                  Checklist completed ·{" "}
                  {new Date().toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </>
            ) : (
              <>
                <div className="text-3xl mb-2 grayscale">🔒</div>
                <h2 className="text-sm font-bold text-gray-400">
                  System is ready for live traffic
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Complete all {TOTAL} items to unlock final confirmation
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {TOTAL - doneCount} item{TOTAL - doneCount !== 1 ? "s" : ""} remaining
                </p>
              </>
            )}
          </div>
        </div>

        <p className="text-[10px] text-gray-400 text-center pb-4">
          State saved in browser localStorage · Clears if you clear browser data ·
          AgencyCheck internal tool — not visible to public
        </p>
      </div>
    </div>
  );
}
