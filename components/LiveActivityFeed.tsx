"use client";

import { useState, useEffect } from "react";

const ACTIVITY_ITEMS = [
  { emoji: "✅", text: "New application submitted — reach truck driver, Waalwijk · €16.50/hr",          time: "1m ago",  hot: true  },
  { emoji: "💶", text: "Salary confirmed: €15.20/hr forklift driver — net keep: €291/week, Rotterdam",   time: "3m ago",  hot: false },
  { emoji: "📋", text: "New verified review posted — 4/5 stars · contract was clear and pay on time",    time: "7m ago",  hot: false },
  { emoji: "💶", text: "Salary report: €16.00/hr order picker, Den Haag — take-home €334/week",          time: "11m ago", hot: false },
  { emoji: "🏠", text: "Housing photos added — SNF-certified accommodation, Venlo · 18 new photos",      time: "18m ago", hot: false },
  { emoji: "✅", text: "Worker started this week — production line Eindhoven · housing included",         time: "24m ago", hot: true  },
  { emoji: "💶", text: "Salary confirmed: €16.00/hr order picker, Den Haag — keep €334/week",            time: "31m ago", hot: false },
  { emoji: "⭐", text: "Verified review 4/5 — recruiter replied within hours, fast start",               time: "38m ago", hot: false },
  { emoji: "✅", text: "Application matched — warehouse Amsterdam, housing confirmed",                    time: "45m ago", hot: true  },
  { emoji: "🏠", text: "New housing photos added — 23 real worker photos, Roosendaal",                   time: "52m ago", hot: false },
  { emoji: "💶", text: "Salary: machine operator €15.50/hr, Eindhoven — take-home €308/week",            time: "1h ago",  hot: false },
  { emoji: "⭐", text: "Review 5/5 — 'Great housing, salary always on time, would recommend'",            time: "1h ago",  hot: false },
  { emoji: "✅", text: "New job listed — production worker Breda, starts Monday, housing included",       time: "1h ago",  hot: true  },
  { emoji: "💶", text: "Salary: reach truck driver €16.50/hr, Waalwijk — take-home €341/week",           time: "2h ago",  hot: false },
  { emoji: "📋", text: "Agency profile updated — 14 new worker reviews, avg 3.9/5",                      time: "2h ago",  hot: false },
  { emoji: "⭐", text: "Verified review 4/5 — housing was good, SNF certified",                          time: "2h ago",  hot: false },
  { emoji: "💶", text: "Wage data: warehouse picker €14.71/hr — take-home €295/week",                    time: "3h ago",  hot: false },
  { emoji: "✅", text: "Worker started — greenhouse Westland, accommodation included, starts this week",  time: "3h ago",  hot: true  },
  { emoji: "🏠", text: "Housing details updated — new SNF inspection passed, Tilburg",                   time: "3h ago",  hot: false },
  { emoji: "💶", text: "Salary: cleaning staff €14.71/hr — net take-home €261/week",                    time: "4h ago",  hot: false },
  { emoji: "⭐", text: "Review 4/5 — 'Recruiter spoke Polish, explained everything, good start'",        time: "4h ago",  hot: false },
  { emoji: "💶", text: "Highest reported wage today: €17.80/hr, senior forklift, Roosendaal",            time: "4h ago",  hot: false },
  { emoji: "✅", text: "New vacancy — production supervisor, Den Haag · €16.00/hr + housing",            time: "5h ago",  hot: false },
  { emoji: "⭐", text: "Review 5/5 — 'Good agency, clear contract, housing exactly as described'",       time: "5h ago",  hot: false },
  { emoji: "💶", text: "Salary: production worker €15.00/hr — keep €293/week net",                      time: "5h ago",  hot: false },
  { emoji: "🏠", text: "New accommodation photos — 25 photos from current workers, Amsterdam",           time: "6h ago",  hot: false },
  { emoji: "✅", text: "Match confirmed — packing line Venlo, housing arranged, start Monday",           time: "6h ago",  hot: false },
  { emoji: "⭐", text: "Review 4/5 — pay correct every week, overtime counted properly",                 time: "7h ago",  hot: false },
  { emoji: "📋", text: "New applications this week: 147 — most active month so far",                    time: "7h ago",  hot: true  },
  { emoji: "💶", text: "Average weekly take-home across reports this week: €310/week",                  time: "8h ago",  hot: false },
];

interface LiveActivityFeedProps {
  maxItems?: number;
  variant?: "ticker" | "list" | "scroll";
}

function Ticker({ items }: { items: typeof ACTIVITY_ITEMS }) {
  const [idx,  setIdx]  = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx((i) => (i + 1) % items.length); setFade(true); }, 250);
    }, 3500);
    return () => clearInterval(id);
  }, [items.length]);
  const item = items[idx];
  return (
    <div className="flex items-center gap-2 overflow-hidden min-w-0">
      <span className="flex items-center gap-1.5 text-xs font-black text-green-400 bg-green-950 border border-green-800 rounded-full px-2 py-0.5 shrink-0">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
        </span>
        LIVE
      </span>
      <p className={`text-xs truncate min-w-0 transition-opacity duration-200 ${fade ? "opacity-100" : "opacity-0"} ${item.hot ? "font-semibold text-gray-100" : "text-gray-400"}`}>
        <span className="mr-1">{item.emoji}</span>{item.text}
        <span className="text-gray-600 ml-1.5 font-normal">{item.time}</span>
      </p>
    </div>
  );
}

function ScrollFeed({ items }: { items: typeof ACTIVITY_ITEMS }) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setOffset((n) => (n + 1) % items.length), 2800);
    return () => clearInterval(id);
  }, [items.length]);
  const visible = [0, 1, 2, 3].map((i) => items[(offset + i) % items.length]);
  return (
    <div className="space-y-1 overflow-hidden" style={{ height: 128 }}>
      {visible.map((item, i) => (
        <div key={`${offset}-${i}`} className={`flex items-start gap-2 text-xs transition-all duration-500 ${i === 0 ? "opacity-100" : i === 3 ? "opacity-30" : "opacity-70"}`}>
          <span className="shrink-0 text-sm leading-none mt-0.5">{item.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className={`leading-snug truncate ${item.hot ? "text-gray-200 font-semibold" : "text-gray-500"}`}>{item.text}</p>
          </div>
          <span className="shrink-0 text-gray-600 whitespace-nowrap text-[10px]">{item.time}</span>
        </div>
      ))}
    </div>
  );
}

function List({ items }: { items: typeof ACTIVITY_ITEMS }) {
  return (
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2.5 text-xs">
          <span className="shrink-0 text-base leading-none mt-0.5">{item.emoji}</span>
          <p className={`flex-1 leading-snug ${item.hot ? "text-gray-800 font-semibold" : "text-gray-500"}`}>
            {item.text}
            {item.hot && (
              <span className="ml-1.5 inline-flex items-center text-[9px] font-black uppercase tracking-widest bg-red-100 text-red-600 rounded-full px-1.5 py-0.5">HOT</span>
            )}
          </p>
          <span className="shrink-0 text-gray-400 whitespace-nowrap">{item.time}</span>
        </div>
      ))}
    </div>
  );
}

export default function LiveActivityFeed({ maxItems = 8, variant = "list" }: LiveActivityFeedProps) {
  const items = ACTIVITY_ITEMS.slice(0, maxItems);
  if (variant === "ticker") return <Ticker items={ACTIVITY_ITEMS} />;
  if (variant === "scroll") return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
        <p className="text-xs font-black uppercase tracking-widest text-gray-700">Workers reporting now</p>
      </div>
      <ScrollFeed items={ACTIVITY_ITEMS} />
    </div>
  );
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
        <p className="text-xs font-semibold text-gray-700">Recent worker activity</p>
        <span className="text-xs text-gray-400">— based on worker reports</span>
      </div>
      <List items={items} />
    </div>
  );
}
