import Link from "next/link";
import { getLocale } from "@/lib/getLocale";
import { getT } from "@/lib/i18n";
import { LEGAL } from "@/lib/legalConfig";

const TOP_CITIES = [
  { name: "Amsterdam",  slug: "amsterdam"  },
  { name: "Rotterdam",  slug: "rotterdam"  },
  { name: "Den Haag",   slug: "den-haag"   },
  { name: "Utrecht",    slug: "utrecht"    },
  { name: "Eindhoven",  slug: "eindhoven"  },
  { name: "Tilburg",    slug: "tilburg"    },
  { name: "Schiphol",   slug: "schiphol"   },
  { name: "Venlo",      slug: "venlo"      },
];

const TOP_SECTORS = [
  { label: "Logistics",        slug: "logistics"        },
  { label: "Healthcare",       slug: "healthcare"       },
  { label: "Food Production",  slug: "food-production"  },
  { label: "Construction",     slug: "construction"     },
  { label: "IT & Technology",  slug: "it-tech"          },
  { label: "Office & Admin",   slug: "office-admin"     },
];

const TOP_JOBS = [
  { label: "Order Picker",    slug: "order-picker"    },
  { label: "Forklift Driver", slug: "forklift-driver" },
  { label: "Warehouse Worker",slug: "warehouse-worker"},
  { label: "Truck Driver",    slug: "truck-driver"    },
  { label: "Production Worker",slug:"production-worker"},
  { label: "Reach Truck Driver",slug:"reach-truck-driver"},
];

const JOB_LANDING_PAGES = [
  { label: "🏭 Warehouse + housing",    href: "/warehouse-jobs-with-accommodation" },
  { label: "⚙️ Production + housing",   href: "/production-jobs-with-accommodation" },
  { label: "🌿 Greenhouse + housing",   href: "/greenhouse-jobs-with-accommodation" },
  { label: "🏗️ Reach truck jobs",       href: "/reach-truck-jobs" },
  { label: "📦 Order picker jobs",      href: "/order-picker-jobs" },
];

const SALARY_SPOTLIGHT = [
  { label: "Order picker salary Amsterdam",    href: "/salary/order-picker-amsterdam"    },
  { label: "Forklift driver salary Rotterdam", href: "/salary/forklift-driver-rotterdam" },
  { label: "Warehouse worker salary Utrecht",  href: "/salary/warehouse-worker-utrecht"  },
  { label: "Truck driver salary Den Haag",     href: "/salary/truck-driver-s-gravenhage" },
];

export default async function Footer() {
  const locale = getLocale();
  const t = await getT(locale);

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-6">

        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-sm mb-8">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-brand-600 mb-3">
              <span>✅</span>
              <span>AgencyCheck</span>
            </Link>
            <p className="text-gray-500 text-xs leading-relaxed mb-4">
              {t("footer.tagline")}
            </p>
            <ul className="space-y-1.5 text-xs text-gray-500">
              <li><Link href="/about"             className="hover:text-brand-600">{t("footer.about")}</Link></li>
              <li><Link href="/share-experience"  className="hover:text-brand-600 font-medium text-brand-600">{t("footer.share")}</Link></li>
              <li><Link href="/for-agencies"      className="hover:text-brand-600">{t("footer.for_agencies")}</Link></li>
              <li><Link href="/contact"           className="hover:text-brand-600">{t("footer.contact")}</Link></li>
            </ul>
          </div>

          {/* Cities column */}
          <div>
            <p className="font-semibold text-gray-800 mb-3">{t("footer.cities")}</p>
            <ul className="space-y-2 text-gray-500 text-xs">
              {TOP_CITIES.map((c) => (
                <li key={c.slug}>
                  <Link href={`/cities/${c.slug}`} className="hover:text-brand-600">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sectors column */}
          <div>
            <p className="font-semibold text-gray-800 mb-3">{t("footer.sectors")}</p>
            <ul className="space-y-2 text-gray-500 text-xs">
              {TOP_SECTORS.map((s) => (
                <li key={s.slug}>
                  <Link href={`/sectors/${s.slug}`} className="hover:text-brand-600">
                    {s.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/sectors" className="text-brand-600 font-medium hover:underline">
                  {t("footer.all_sectors")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Jobs column */}
          <div>
            <p className="font-semibold text-gray-800 mb-3">{t("footer.job_types")}</p>
            <ul className="space-y-2 text-gray-500 text-xs">
              {TOP_JOBS.map((j) => (
                <li key={j.slug}>
                  <Link href={`/jobs/${j.slug}`} className="hover:text-brand-600">
                    {j.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/jobs" className="text-brand-600 font-medium hover:underline">
                  {t("footer.all_jobs")}
                </Link>
              </li>
            </ul>
            <p className="font-semibold text-gray-800 mt-4 mb-2">{t("footer.jobs_housing")}</p>
            <ul className="space-y-2 text-gray-500 text-xs">
              {JOB_LANDING_PAGES.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="hover:text-brand-600">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools & Legal column */}
          <div>
            <p className="font-semibold text-gray-800 mb-3">{t("footer.tools")}</p>
            <ul className="space-y-2 text-gray-500 text-xs mb-5">
              <li><Link href="/tools/salary-calculator"      className="hover:text-brand-600">{t("footer.salary_calc")}</Link></li>
              <li><Link href="/tools/real-income-calculator" className="hover:text-brand-600">{t("footer.real_income_calc")}</Link></li>
              <li><Link href="/tools/payslip-checker"        className="hover:text-brand-600">{t("footer.payslip_checker")}</Link></li>
              <li><Link href="/tools/shift-tracker"          className="hover:text-brand-600">{t("footer.shift_tracker")}</Link></li>
              <li><Link href="/agencies-with-housing"        className="hover:text-brand-600">{t("footer.with_housing")}</Link></li>
              <li><Link href="/compare"                      className="hover:text-brand-600">{t("footer.compare")}</Link></li>
            </ul>
            <p className="font-semibold text-gray-800 mb-3">{t("footer.legal")}</p>
            <ul className="space-y-2 text-gray-500 text-xs">
              <li><Link href="/privacy" className="hover:text-brand-600">{t("footer.privacy")}</Link></li>
              <li><Link href="/terms"   className="hover:text-brand-600">{t("footer.terms")}</Link></li>
            </ul>
          </div>
        </div>

        {/* Salary spotlight strip */}
        <div className="border-t border-gray-100 pt-5 mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            {t("footer.popular_searches")}
          </p>
          <div className="flex flex-wrap gap-2">
            {SALARY_SPOTLIGHT.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="text-xs text-gray-500 hover:text-brand-600 bg-gray-50 border border-gray-200 rounded-full px-3 py-1 hover:bg-brand-50 transition-colors"
              >
                {s.label}
              </Link>
            ))}
            <Link
              href="/tools/salary-calculator"
              className="text-xs text-brand-600 hover:text-brand-700 bg-brand-50 border border-brand-200 rounded-full px-3 py-1 hover:bg-brand-100 transition-colors font-medium"
            >
              {t("footer.calculate_salary")}
            </Link>
          </div>
        </div>

        {/* Legal entity strip — required by Dutch law (Wet elektronische handel) */}
        <div className="border-t border-gray-100 pt-4 mb-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-gray-300">
            <span>{LEGAL.legalName}</span>
            {LEGAL.kvkNumber ? <span>KvK {LEGAL.kvkNumber}</span> : null}
            {LEGAL.vatNumber  ? <span>BTW {LEGAL.vatNumber}</span>  : null}
            {LEGAL.address.street
              ? <span>{LEGAL.address.street}, {LEGAL.address.postcode} {LEGAL.address.city}</span>
              : null}
            <a href={`mailto:${LEGAL.emailGeneral}`} className="hover:text-gray-400">{LEGAL.emailGeneral}</a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 pt-4 text-xs text-gray-400 flex flex-col md:flex-row justify-between gap-2">
          <p>
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/about"        className="hover:text-brand-600">{t("footer.about_link")}</Link>
            <Link href="/contact"      className="hover:text-brand-600">{t("footer.contact_link")}</Link>
            <Link href="/privacy"      className="hover:text-brand-600">{t("footer.privacy_link")}</Link>
            <Link href="/terms"        className="hover:text-brand-600">{t("footer.terms_link")}</Link>
            <Link href="/methodology"  className="hover:text-brand-600">Methodology</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
