import Link from "next/link";

/**
 * WorkerHousingStrip — raw, honest housing reality cards.
 * Intentionally NOT polished. No Airbnb vibes. Real worker conditions.
 */

type HousingCard = {
  emoji:  string;
  bg:     string;
  label:  string;
  price:  string;
  detail: string;
  note:   string;
  tag:    string;
  badges?: { text: string; color: string }[];
};

const HOUSING_CARDS: HousingCard[] = [
  {
    emoji:  "🛏️",
    bg:     "bg-zinc-800",
    label:  "2 people in one room",
    price:  "€150/week",
    detail: "bunk beds · no wardrobe",
    note:   "Agency deduction",
    tag:    "Covebo · Westland",
    badges: [
      { text: "Overcrowded",   color: "bg-red-700 text-red-100" },
      { text: "Shared room",   color: "bg-orange-700 text-orange-100" },
    ],
  },
  {
    emoji:  "🚿",
    bg:     "bg-zinc-900",
    label:  "Shared kitchen & bathroom",
    price:  "€130/week",
    detail: "8 workers per house",
    note:   "Agency deduction",
    tag:    "Multiple agencies",
    badges: [
      { text: "No privacy",     color: "bg-orange-700 text-orange-100" },
      { text: "8 per house",    color: "bg-yellow-700 text-yellow-100" },
    ],
  },
  {
    emoji:  "🏚️",
    bg:     "bg-zinc-950",
    label:  "Old house — no heating",
    price:  "€120/week",
    detail: "mould reported · cold winters",
    note:   "Worker reported",
    tag:    "Rotterdam area",
    badges: [
      { text: "⚠️ Worker issue",    color: "bg-red-800 text-red-200" },
      { text: "No heating",         color: "bg-red-700 text-red-100" },
    ],
  },
  {
    emoji:  "🛋️",
    bg:     "bg-zinc-800",
    label:  "3–4 people · one living room",
    price:  "€140/week",
    detail: "shared living · no private space",
    note:   "Agency deduction",
    tag:    "Otto Workforce",
    badges: [
      { text: "Overcrowded",   color: "bg-red-700 text-red-100" },
    ],
  },
  {
    emoji:  "✅",
    bg:     "bg-green-950",
    label:  "Private room — decent",
    price:  "€110/week",
    detail: "private room confirmed",
    note:   "Verified source",
    tag:    "Best case · rare",
    badges: [
      { text: "✅ Verified",    color: "bg-green-800 text-green-200" },
      { text: "Best case",      color: "bg-green-900 text-green-300" },
    ],
  },
];

export default function WorkerHousingStrip() {
  return (
    <div>
      {/* Section header */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
            Reported by workers — not agencies
          </p>
          <h2 className="text-xl font-black text-gray-900 leading-tight">
            This is where you&apos;ll actually sleep
          </h2>
          <p className="text-sm text-gray-500 mt-1 leading-snug max-w-lg">
            Agency housing in the Netherlands — as reported by workers who lived there.
            Not the brochure. Not agency marketing.{" "}
            <span className="font-semibold text-gray-700">Real conditions. Real prices.</span>
          </p>
        </div>
        <Link href="/agencies-with-housing"
          className="hidden sm:block text-xs text-brand-600 font-semibold hover:underline shrink-0 mb-1">
          All housing agencies →
        </Link>
      </div>

      {/* Cards — tighter, rawer */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-3">
        {HOUSING_CARDS.map((card) => (
          <div
            key={card.label}
            className={`${card.bg} rounded-lg p-3 flex flex-col gap-1.5 relative overflow-hidden`}
          >
            {/* Warning badges */}
            {card.badges && card.badges.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-0.5">
                {card.badges.map((b) => (
                  <span
                    key={b.text}
                    className={`text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide ${b.color}`}
                  >
                    {b.text}
                  </span>
                ))}
              </div>
            )}

            <span className="text-2xl leading-none">{card.emoji}</span>

            <div>
              <p className="text-[11px] font-bold text-white leading-snug">{card.label}</p>
              <p className="text-[9px] text-gray-400 mt-0.5 leading-snug">{card.detail}</p>
            </div>

            <div className="mt-auto pt-1.5 border-t border-white/10">
              <p className="text-sm font-black text-white">{card.price}</p>
              <p className="text-[9px] text-gray-500 mt-0.5">{card.note}</p>
              <p className="text-[9px] text-gray-600">{card.tag}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom warning — stark */}
      <div className="rounded-xl border border-red-200 overflow-hidden">
        <div className="bg-red-900 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-sm text-red-100 leading-snug">
            <strong className="text-white">Most workers never ask the right questions</strong> before they arrive.
            Always get housing terms <em>in writing</em> — how many per room, exact weekly cost, what happens if you leave.
          </p>
          <Link href="/issues/bad-housing"
            className="shrink-0 text-xs font-bold bg-white text-red-800 rounded-full px-3 py-1.5 hover:bg-red-50 transition-colors whitespace-nowrap">
            Report bad housing →
          </Link>
        </div>
        <div className="bg-red-950/60 px-4 py-2.5 grid grid-cols-3 gap-3 text-center">
          {[
            { val: "€110–€170", label: "weekly deduction range" },
            { val: "2–6",       label: "people per room typical" },
            { val: "0",         label: "workers who asked first" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-base font-black text-red-200">{s.val}</p>
              <p className="text-[9px] text-red-400 leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
