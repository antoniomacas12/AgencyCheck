"use client";

import { useState, useEffect } from "react";

const ACTIVITY_ITEMS = [
  { emoji: "🚨", text: "Worker discovered €340 missing from weekly pay — Otto Workforce, Venlo",       time: "1m ago",  hot: true  },
  { emoji: "💶", text: "Real take-home reported: €278/week after housing — Tilburg warehouse",         time: "3m ago",  hot: true  },
  { emoji: "⚠️", text: "6 workers reported overcrowded housing at Covebo — 4 people per room",         time: "7m ago",  hot: true  },
  { emoji: "💶", text: "Salary report: €15.20/hr forklift driver — net keep: €291/week, Rotterdam",    time: "11m ago", hot: false },
  { emoji: "⭐", text: "New verified review: Randstad 2/5 — housing was overcrowded",                  time: "18m ago", hot: false },
  { emoji: "🚨", text: "Transport cost silently increased to €45/week — workers report no warning",     time: "24m ago", hot: true  },
  { emoji: "💶", text: "Salary confirmed: €16.00/hr order picker, Den Haag — keep €334/week",          time: "31m ago", hot: false },
  { emoji: "⚠️", text: "Late salary payment reported at EG Personeel — 3rd time this month",           time: "38m ago", hot: false },
  { emoji: "⭐", text: "Worker review: Tempo-Team 3/5 — pay OK, management unreachable",               time: "45m ago", hot: false },
  { emoji: "🏠", text: "New housing photos added: Fix Team — 23 real worker photos",                   time: "52m ago", hot: false },
  { emoji: "💶", text: "Real income revealed: €14.80/hr × 40h = €237 after all deductions — Breda",    time: "1h ago",  hot: true  },
  { emoji: "⚠️", text: "Payslip error reported at ABF Flexkracht — overtime not included",              time: "1h ago",  hot: false },
  { emoji: "⭐", text: "Review: Level One housing 1/5 — 6 people per room, mold reported",             time: "1h ago",  hot: true  },
  { emoji: "💶", text: "Salary: machine operator €15.50/hr, Eindhoven — keep €308/week",               time: "2h ago",  hot: false },
  { emoji: "🚨", text: "Worker found out only after arrival: housing costs €160/week, not €90",         time: "2h ago",  hot: true  },
  { emoji: "⭐", text: "Verified review: Driessen 4/5 — fair pay, contract was clear",                  time: "2h ago",  hot: false },
  { emoji: "💶", text: "Wage data: warehouse picker €14.50/hr — takes home €256/week after costs",     time: "3h ago",  hot: false },
  { emoji: "⚠️", text: "4 workers report no transport despite job offer promising it — Maastricht",     time: "3h ago",  hot: false },
  { emoji: "🏠", text: "Housing review: Eurojob — shared toilet with 14 workers, no heating",           time: "3h ago",  hot: true  },
  { emoji: "💶", text: "Salary: cleaning staff €14.06/hr (min) — net take-home €224/week",             time: "4h ago",  hot: false },
  { emoji: "⭐", text: "Worker: 'Left after 2 weeks. Housing was nothing like described.' — Venlo",     time: "4h ago",  hot: false },
  { emoji: "💶", text: "Highest reported wage today: €17.80/hr, senior forklift, Roosendaal",           time: "4h ago",  hot: false },
  { emoji: "⚠️", text: "Contract changed without notice after 3 weeks — Actief Werkt, Limburg",         time: "5h ago",  hot: false },
  { emoji: "⭐", text: "Review: Best Flex 2/5 — promised €300/week, actually got €198 first month",     time: "5h ago",  hot: true  },
  { emoji: "💶", text: "Salary: production worker €15.00/hr — keep €293/week net",                     time: "5h ago",  hot: false },
  { emoji: "🏠", text: "New housing photos: Otto Workforce accommodation — 25 photos from workers",      time: "6h ago",  hot: false },
  { emoji: "⚠️", text: "Missing overtime: worker clocked 48h, paid for 40h — no explanation given",    time: "6h ago",  hot: false },
  { emoji: "⭐", text: "Review: Adecco 4/5 — management responsive, contract terms were fair",          time: "7h ago",  hot: false },
  { emoji: "🚨", text: "3 workers quit same agency same week due to housing conditions — reported",      time: "7h ago",  hot: true  },
  { emoji: "💶", text: "Reality check: average net keep across 40 reports this week = €287/week",        time: "8h ago",  hot: false },
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
