"use client";

import ApplyPreScreen from "@/components/ApplyPreScreen";

interface Props {
  waBase: string;         // e.g. "https://wa.me/31613754893"
  jobTitle: string;       // e.g. "C+E Truck Driver"
  source?: string;        // tracking slug, e.g. "reachtruck"
  jobId?: string;         // job slug for analytics, e.g. "reachtruck"
  referralMode?: boolean; // if true → server-side recruiter rotation
}

export default function StickyApplyBar({ waBase, jobTitle, source, jobId, referralMode }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Soft fade above the bar */}
      <div className="pointer-events-none h-10 bg-gradient-to-t from-[#0B1F14] to-transparent" />

      <div className="bg-[#0B1F14] border-t border-white/10 px-4 pb-5 pt-3">
        <ApplyPreScreen jobTitle={jobTitle} waBase={waBase} source={source} jobId={jobId} referralMode={referralMode}>
          {(openFn) => (
            <button
              onClick={openFn}
              className="
                flex items-center justify-center gap-2.5 w-full
                bg-[#22C55E] hover:bg-green-400 active:scale-[0.98]
                text-white font-black text-[16px]
                py-4 rounded-2xl
                transition-all duration-150
              "
              style={{ boxShadow: "0 0 0 1px rgba(34,197,94,0.3), 0 8px 32px rgba(34,197,94,0.25)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.962-1.418A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.95 7.95 0 01-4.07-1.116l-.292-.174-3.036.868.872-3.046-.19-.31A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.29-5.89c-.233-.117-1.379-.681-1.593-.759-.214-.077-.37-.116-.526.117-.155.232-.603.759-.739.915-.136.155-.272.174-.505.058-.233-.117-.982-.362-1.87-1.154-.691-.617-1.158-1.38-1.294-1.613-.136-.232-.014-.358.103-.474.105-.104.233-.272.35-.408.116-.136.155-.233.233-.388.077-.155.039-.291-.019-.407-.059-.117-.527-1.27-.722-1.739-.19-.456-.384-.394-.527-.401l-.448-.008c-.156 0-.408.059-.621.291-.214.233-.814.796-.814 1.94s.834 2.25.95 2.406c.116.155 1.64 2.504 3.975 3.512.556.24 1.99.52 2.315.336.233-.136.942-.385 1.074-.756.131-.37.131-.686.092-.756-.039-.077-.155-.116-.388-.233z" />
              </svg>
              Apply via WhatsApp
            </button>
          )}
        </ApplyPreScreen>
        <p className="text-center text-gray-500 text-[11px] mt-2">
          2 quick questions · Opens WhatsApp
        </p>
      </div>
    </div>
  );
}
