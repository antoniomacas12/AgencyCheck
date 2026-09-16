/**
 * ApplicationProcessPanel
 *
 * Transparency sidebar shown to the right of vacancy listings on /apply.
 * Explains exactly what happens after a candidate submits their application.
 * Desktop: sticky sidebar. Mobile: flows below the job list.
 */

const STEPS = [
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </svg>
    ),
    label: "CV received",
    note:  "Your application arrives via WhatsApp or the apply form.",
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
        <path fillRule="evenodd" d="M9 3a1 1 0 012 0v5.5a.5.5 0 001 0V4a1 1 0 112 0v4.5a.5.5 0 001 0V6a1 1 0 112 0v5a7 7 0 11-14 0V9a1 1 0 012 0v2.5a.5.5 0 001 0V4a1 1 0 012 0v4.5a.5.5 0 001 0V3z" clipRule="evenodd" />
      </svg>
    ),
    label: "Profile reviewed",
    note:  "AgencyCheck reviews your CV, experience and relevant details.",
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
        <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
      </svg>
    ),
    label: "Matched with vacancies",
    note:  "Your profile is compared against currently available positions.",
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
      </svg>
    ),
    label: "Forwarded to partner",
    note:  "If matched, your CV is sent to the relevant recruitment partner.",
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
      </svg>
    ),
    label: "Recruiter may contact you",
    note:  "The partner recruiter may reach out directly if your profile fits.",
  },
] as const;

export default function ApplicationProcessPanel() {
  return (
    <div
      className="rounded-2xl border border-blue-500/20 bg-[#071525] overflow-hidden"
      style={{
        boxShadow:
          "0 8px 40px rgba(0,0,0,0.55), 0 1px 0 rgba(59,130,246,0.12) inset, 0 -1px 0 rgba(0,0,0,0.3) inset",
      }}
    >
      {/* Top glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 rounded-full bg-blue-500/[0.10] blur-2xl"
        aria-hidden="true"
      />

      <div className="relative px-5 py-5">

        {/* Label */}
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-blue-400/70 mb-2">
          Transparent application process
        </p>

        {/* Headline */}
        <h2 className="text-white font-extrabold text-[15px] leading-snug mb-1">
          Know what happens to your application.
        </h2>
        <p className="text-gray-500 text-[11px] leading-relaxed mb-5">
          No black box. See exactly how AgencyCheck handles your CV.
        </p>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connector line */}
          <div
            className="absolute left-[13px] top-4 bottom-4 w-px"
            style={{
              background:
                "linear-gradient(to bottom, rgba(59,130,246,0.35) 0%, rgba(59,130,246,0.12) 70%, rgba(59,130,246,0.02) 100%)",
            }}
            aria-hidden="true"
          />

          <div className="flex flex-col gap-0">
            {STEPS.map((step, i) => (
              <div key={i} className="relative flex gap-3.5 pb-5 last:pb-0">
                {/* Node */}
                <div className="shrink-0 relative z-10">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-blue-300"
                    style={{
                      background:
                        "radial-gradient(circle at 40% 35%, rgba(59,130,246,0.22), rgba(59,130,246,0.06))",
                      border: "1px solid rgba(59,130,246,0.30)",
                      boxShadow: "0 0 0 3px rgba(59,130,246,0.06)",
                    }}
                  >
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="min-w-0 pt-0.5">
                  <p className="text-white font-semibold text-[12px] leading-snug mb-0.5">
                    {step.label}
                  </p>
                  <p className="text-gray-500 text-[10px] leading-relaxed">
                    {step.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mt-5 border-t border-white/[0.06] pt-4">
          <p className="text-gray-600 text-[10px] leading-relaxed">
            Submitting an application does not guarantee placement. AgencyCheck forwards profiles only when they match relevant available vacancies.
          </p>
        </div>

        {/* Trust badge */}
        <div className="mt-3 flex items-center gap-1.5">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-blue-400 shrink-0" aria-hidden="true">
            <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm8.5-2.5a.5.5 0 00-1 0v3.5a.5.5 0 00.146.354l2 2a.5.5 0 00.708-.708L8.5 9.293V5.5z" clipRule="evenodd" />
          </svg>
          <p className="text-blue-400/60 text-[10px] font-semibold">
            Transparent · No hidden steps · GDPR compliant
          </p>
        </div>
      </div>
    </div>
  );
}
