// /apply/production-worker-maastricht — Production Worker / Picker
// Dark theme, green accents. Apply via WhatsApp.

export default function ProductionWorkerMaastrichtPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans px-5 py-12">
      <div className="max-w-2xl mx-auto">

        {/* ── Badge ─────────────────────────────────────────────── */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse inline-block" />
          Now Hiring · Netherlands
        </div>

        {/* ── Title ─────────────────────────────────────────────── */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Production Worker<br />
          <span className="text-[#22C55E]">/ Picker</span>
        </h1>
        <p className="text-gray-400 text-sm mb-2">Near Maastricht, Netherlands</p>
        <p className="text-[#22C55E] font-semibold text-sm mb-10 tracking-wide uppercase">
          €16.12/hr · Immediate start · Cookie factory
        </p>

        {/* ── Quick highlights ──────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 mb-10">
          {[
            { icon: "⚡", label: "Start ASAP" },
            { icon: "🏭", label: "Food factory" },
            { icon: "🚗", label: "Own transport" },
          ].map(({ icon, label }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-center">
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-gray-300 text-[11px] font-semibold leading-tight">{label}</div>
            </div>
          ))}
        </div>

        {/* ── Divider ───────────────────────────────────────────── */}
        <div className="border-t border-white/10 mb-10" />

        {/* ── Sections ──────────────────────────────────────────── */}
        <div className="space-y-10 text-sm text-gray-300 leading-relaxed">

          {/* The Role */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">
              The Role
            </p>
            <p className="text-white text-base font-medium">
              Production &amp; picking work in a cookie factory near Maastricht.<br />
              <span className="text-gray-300 font-normal">
                Stable factory environment, consistent shifts, immediate start available.
              </span>
            </p>
          </div>

          {/* What You Get */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">
              What You Get
            </p>
            <ul className="space-y-3">
              {[
                "€16.12/hr — shift allowance paid on top",
                "2 or 3 shift system",
                "Start ASAP — no long waiting process",
              ].map(item => (
                <li key={item} className="flex items-center gap-3">
                  <span className="text-[#22C55E] font-bold text-base">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">
              Requirements
            </p>
            <ul className="space-y-3">
              {[
                "English or Dutch — basic communication",
                "Own transport to the workplace",
                "Physically fit for production line work",
                "EU work authorisation required",
              ].map(item => (
                <li key={item} className="flex items-center gap-3">
                  <span className="text-[#22C55E] font-bold text-base">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Warning note */}
          <div className="bg-amber-400/10 border border-amber-400/25 rounded-xl px-5 py-4 text-sm leading-relaxed">
            <p className="text-amber-300 font-semibold mb-1">⚠ Important</p>
            <p className="text-gray-300">
              Own transport is required — the factory is not accessible by public transport.
            </p>
          </div>

        </div>

        {/* ── CTA ───────────────────────────────────────────────── */}
        <div className="mt-12">
          <a
            href="https://wa.me/31649210631?text=Hi%2C%20I%20want%20to%20apply%20for%20the%20Production%20Worker%20%2F%20Picker%20position%20near%20Maastricht%2C%20NL."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-[#22C55E] hover:bg-green-400 active:scale-[0.98] text-white font-bold text-base py-4 rounded-2xl transition-all duration-150 shadow-lg shadow-green-900/40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.962-1.418A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.95 7.95 0 01-4.07-1.116l-.292-.174-3.036.868.872-3.046-.19-.31A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.29-5.89c-.233-.117-1.379-.681-1.593-.759-.214-.077-.37-.116-.526.117-.155.232-.603.759-.739.915-.136.155-.272.174-.505.058-.233-.117-.982-.362-1.87-1.154-.691-.617-1.158-1.38-1.294-1.613-.136-.232-.014-.358.103-.474.105-.104.233-.272.35-.408.116-.136.155-.233.233-.388.077-.155.039-.291-.019-.407-.059-.117-.527-1.27-.722-1.739-.19-.456-.384-.394-.527-.401l-.448-.008c-.156 0-.408.059-.621.291-.214.233-.814.796-.814 1.94s.834 2.25.95 2.406c.116.155 1.64 2.504 3.975 3.512.556.24 1.99.52 2.315.336.233-.136.942-.385 1.074-.756.131-.37.131-.686.092-.756-.039-.077-.155-.116-.388-.233z" />
            </svg>
            Apply via WhatsApp
          </a>
          <p className="text-center text-gray-500 text-xs mt-3">
            Fastest way to apply · We reply within 24h
          </p>
        </div>

      </div>
    </div>
  );
}
