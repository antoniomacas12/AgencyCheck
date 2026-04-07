"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useT, type Locale } from "@/lib/i18n";

// ─── Locale detection ─────────────────────────────────────────────────────────
// The root layout passes `locale` as a prop (read from middleware request header).
// As a safety net we also detect from `usePathname()` on the client side, which
// ensures the Navbar is correct even during client-side navigation.
function detectLocale(pathname: string, localeProp: Locale): Locale {
  if (localeProp !== "en") return localeProp;
  if (pathname === "/pl" || pathname.startsWith("/pl/")) return "pl";
  if (pathname === "/ro" || pathname.startsWith("/ro/")) return "ro";
  if (pathname === "/pt" || pathname.startsWith("/pt/")) return "pt";
  return "en";
}

interface NavbarProps {
  /**
   * Locale passed from the root layout (read from x-ac-locale middleware header).
   * Defaults to "en". The Navbar also does a client-side pathname fallback.
   */
  locale?: Locale;
}

export default function Navbar({ locale: localeProp = "en" }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname  = usePathname();

  // Effective locale: prop from server layout OR detected from client pathname
  const locale = detectLocale(pathname, localeProp);
  const t      = useT(locale);

  // ─── Locale-aware nav items (translated via useT) ──────────────────────────
  const housingHref =
    locale === "pl" ? "/pl/praca-z-zakwaterowaniem" :
    locale === "ro" ? "/ro/locuri-de-munca-cu-cazare" :
    locale === "pt" ? "/pt/trabalho-com-alojamento" :
    "/jobs-with-accommodation";

  const NAV_ITEMS = [
    { href: housingHref,                     label: t("nav.jobs_with_housing"), highlight: true },
    { href: "/tools/real-income-calculator",  label: t("nav.real_salary")   },
    { href: "/agencies-with-housing",         label: t("nav.housing_photos") },
    { href: "/reviews",                       label: t("nav.reviews")        },
    { href: "/agencies",                      label: t("nav.agencies")       },
    { href: "/tools",                         label: t("nav.tools")          },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">

          {/* Logo — always links to locale root */}
          <Link
            href={locale === "pl" ? "/pl" : locale === "ro" ? "/ro" : locale === "pt" ? "/pt" : "/"}
            className="flex items-center gap-2 font-bold text-xl text-brand-600 shrink-0"
          >
            <span className="text-2xl">✅</span>
            <span>AgencyCheck</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-600">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              if (item.highlight) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`mr-2 px-3 py-1.5 rounded-lg font-bold transition-colors ${
                      active
                        ? "bg-green-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-100 hover:text-gray-900 ${
                    active ? "text-brand-600 font-semibold" : ""
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Language switcher (desktop) */}
          <div className="hidden md:block ml-2">
            <LanguageSwitcher currentLocale={locale} />
          </div>

          {/* Mobile hamburger — min 44×44px touch target */}
          <button
            className="md:hidden p-3 rounded-xl text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-2 border-t border-gray-100 flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-3.5 rounded-xl text-sm font-medium transition-colors active:bg-gray-100 ${
                    item.highlight
                      ? "text-green-700 font-bold bg-green-50 hover:bg-green-100"
                      : active
                      ? "text-brand-600 font-semibold bg-brand-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            {/* Language switcher in mobile menu */}
            <div className="px-3 pt-3 border-t border-gray-100 mt-1 pb-1">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Language / Język / Limbă</p>
              <LanguageSwitcher currentLocale={locale} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
