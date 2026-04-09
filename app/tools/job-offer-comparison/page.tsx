import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { breadcrumbSchema, softwareApplicationSchema, faqPageSchema } from "@/lib/schemaMarkup";

// ── SEO metadata ──────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Job Offer Comparison Calculator Netherlands 2026 — Which Offer Pays More?",
  description:
    "Compare two Dutch job offers side by side. See real take-home pay after income tax (loonheffing), housing deductions, transport, and healthcare. Find out which offer actually leaves you with more money.",
  alternates: { canonical: "https://agencycheck.io/tools/job-offer-comparison" },
  openGraph: {
    title: "Compare Two Dutch Job Offers — Real Take-Home Pay Calculator 2026",
    description:
      "Enter two job offers and see which one leaves you with more money after Dutch income tax, agency housing deductions, transport costs, and healthcare.",
  },
};

// ── Client component (no SSR — uses browser state) ───────────────────────────

const JobOfferComparisonClient = dynamic(
  () => import("@/components/JobOfferComparisonClient"),
  { ssr: false, loading: () => <div className="min-h-screen bg-gray-50 animate-pulse" /> },
);

// ── Schema ────────────────────────────────────────────────────────────────────

const FAQ_SCHEMA = [
  {
    question: "How do you compare two Dutch job offers accurately?",
    answer:
      "To compare two Dutch job offers accurately, you need to look at real take-home (spendable) income rather than gross pay. Convert both offers to the same hourly or monthly gross, then deduct Dutch income tax (loonheffing with heffingskorting), housing costs, transport, and healthcare. An offer with a lower hourly rate but employer-provided accommodation can easily outperform a higher-rate offer where you pay rent separately.",
  },
  {
    question: "What is loonheffing and how does it affect my pay?",
    answer:
      "Loonheffing is Dutch payroll tax (income tax at source). It is deducted directly from your gross salary. In 2026, the tax rate is 36.97% on income up to €38,441, 37.97% on €38,441–€76,817, and 49.5% above €76,817. Most workers are entitled to the algemene heffingskorting (up to €3,362) and arbeidskorting tax credits, which significantly reduce the amount you actually pay.",
  },
  {
    question: "Does vakantiegeld (holiday allowance) affect the comparison?",
    answer:
      "Yes. Dutch law requires employers to pay at least 8% vakantiegeld on your gross earnings. Some agencies include this in the hourly rate; others pay it out separately (often in May or at contract end). When comparing two offers, check whether the hourly rate already includes vakantiegeld or if it is paid on top — this changes the real gross by 8%.",
  },
  {
    question: "How much can an agency deduct for housing?",
    answer:
      "SNF-certified agencies can deduct housing costs directly from wages. The maximum deduction in 2026 is 20% of the statutory minimum wage (WML: €14.71/hr). For a 40-hour worker, that is approximately €460/month or around €106/week. Typical SNF accommodation ranges from €80–€115 per week. This deduction reduces significantly each year: 15% in 2027, 10% in 2028, 5% in 2029, and is abolished from 2030.",
  },
  {
    question: "What is the minimum wage in the Netherlands in 2026?",
    answer:
      "The statutory minimum wage (wettelijk minimumloon, WML) is €14.71 per hour gross in 2026. Since 2024, only an hourly rate is legally defined — there is no statutory monthly minimum, as it depends on your contract hours. Any job offer below €14.71/hour is below the legal minimum for workers aged 21 and over.",
  },
  {
    question: "Which job offer should I choose — higher rate or housing included?",
    answer:
      "Run both offers through a take-home calculator using the same assumptions. Jobs with accommodation typically cost €80–115/week in deductions, but eliminate the need to find and pay for private rental housing (often €600–900/month in the Netherlands). For workers arriving from abroad without a local network, agency accommodation is usually more cost-effective in the first 3–6 months.",
  },
  {
    question: "What is the difference between gross and net salary in the Netherlands?",
    answer:
      "Gross salary is before income tax (loonheffing). Net salary is what you receive after tax. For most Dutch workers in 2026, effective tax rates are 20–30% of gross income at typical agency worker salary levels (€2,000–€3,500/month gross), after accounting for tax credits. The exact net depends on your personal tax situation, whether you have filed your loonheffingskorting, and other factors.",
  },
  {
    question: "Are healthcare costs included in a Dutch salary comparison?",
    answer:
      "Healthcare insurance (zorgverzekering) is a mandatory personal expense in the Netherlands — approximately €140/month for basic insurance (2026 estimate). You also have an eigen risico (own risk/deductible) of up to €385/year. This is a real monthly cost of around €140–175 and must be factored in when comparing job offers. Some employers offer a contribution to healthcare costs (not all), which can offset this.",
  },
];

export default function JobOfferComparisonPage() {
  const crumbSchema = breadcrumbSchema([
    { name: "Home",                       url: "/" },
    { name: "Tools",                      url: "/tools" },
    { name: "Job Offer Comparison",       url: "/tools/job-offer-comparison" },
  ]);

  const appSchema = softwareApplicationSchema({
    name:                "Job Offer Comparison Calculator — AgencyCheck",
    description:
      "Compare two Dutch job offers side by side. Real take-home calculation with 2026 income tax, housing deductions, transport, and healthcare.",
    url:                 "https://agencycheck.io/tools/job-offer-comparison",
    applicationCategory: "FinanceApplication",
    operatingSystem:     "Web",
  });

  const faqSchema = faqPageSchema(FAQ_SCHEMA);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <JobOfferComparisonClient faqItems={FAQ_SCHEMA} />
    </>
  );
}
