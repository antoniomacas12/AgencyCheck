import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // lib files contain Tailwind class strings returned from helper functions
    // (e.g. getTierBadgeClasses in trustScore.ts, jobRanking.ts, agencyEnriched.ts).
    // Without this, those classes are invisible to Tailwind and get purged in production.
    "./lib/**/*.{js,ts}",
  ],
  safelist: [
    // ── Dynamic badge/tier classes from lib/trustScore.ts ─────────────────────
    "bg-purple-50", "text-purple-700", "border-purple-200",
    "bg-amber-50",  "text-amber-700",  "border-amber-200",
    "bg-orange-50", "text-orange-700", "border-orange-200",
    "bg-gray-100",  "text-gray-600",   "border-gray-200",
    "bg-gray-50",   "text-gray-500",   "border-gray-100",
    // ── Dynamic agency tier colors from lib/jobRanking.ts ─────────────────────
    "bg-blue-50",   "text-blue-700",   "border-blue-100",
    // ── Dynamic score badge colors from lib/agencyEnriched.ts ─────────────────
    "text-green-700", "bg-green-50",
    // ── White opacity utilities (used in hero/dark-bg sections) ───────────────
    // Tailwind's scanner doesn't always parse `bg-white/N` from template strings.
    "bg-white/5",  "bg-white/8",  "bg-white/10", "bg-white/15",
    "bg-white/20", "bg-white/30", "bg-white/40", "bg-white/50",
    "bg-white/60", "bg-white/70", "bg-white/80", "bg-white/90",
    "border-white/8",  "border-white/10", "border-white/15",
    "border-white/20", "border-white/30", "border-white/60",
    "divide-white/30",
    "hover:bg-white/15", "hover:bg-white/20", "hover:bg-white/30", "hover:bg-white/90",
    // ── Agency color variants used via dynamic object in page.tsx ─────────────
    "bg-blue-50",   "border-blue-100",   "bg-blue-100",   "text-blue-700",
    "bg-orange-50", "border-orange-100", "bg-orange-100", "text-orange-700",
    "bg-green-50",  "border-green-100",  "bg-green-100",  "text-green-700",
    "bg-purple-50", "border-purple-100", "bg-purple-100", "text-purple-700",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
        },
        housing: {
          yes:     "#16a34a",
          no:      "#dc2626",
          unknown: "#9ca3af",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
