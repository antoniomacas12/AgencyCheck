import type { Metadata } from "next";
import Link from "next/link";
import StickyApplyBar from "@/components/StickyApplyBar";
import GateLink      from "@/components/GateLink";
import { WA_NUMBER } from "@/lib/whatsapp";

// ─── SEO ──────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Praca w Holandii — Magazyn i Produkcja, z Zakwaterowaniem | AgencyCheck",
  description:
    "100+ ofert pracy w Holandii. Magazyn, produkcja, logistyka. Bez opłat, zakwaterowanie w cenie. Aplikuj przez WhatsApp i odzywamy się tego samego dnia.",
  keywords: [
    "praca w Holandii magazyn", "praca holandia magazyn", "praca w magazynie holandia",
    "praca holandia bez doświadczenia", "praca holandia z zakwaterowaniem",
  ],
  alternates: {
    canonical: "https://agencycheck.io/praca-holandia-magazyn",
    languages: {
      "pl":        "https://agencycheck.io/praca-holandia-magazyn",
      "en":        "https://agencycheck.io/work-netherlands-warehouse",
      "x-default": "https://agencycheck.io/work-netherlands-warehouse",
    },
  },
  openGraph: {
    title: "Praca w Holandii — Magazyn, z Zakwaterowaniem | AgencyCheck",
    description: "100+ ofert pracy. Magazyn, produkcja. Bez opłat. Zakwaterowanie w cenie. Aplikuj przez WhatsApp.",
  },
};

// ─── Real job data (from vacanciesData.ts — actual live postings) ──────────────
const JOBS = [
  {
    slug:  "order-picker-ept-driver-food-freezer-waalwijk",
    title: "Order Picker / Kierowca EPT",
    location: "Waalwijk",
    salary: "€14,98/h brutto",
    desc: "Praca w chłodzonej hali (warunki mroźnicze). Obsługa elektrycznego wózka paletowego (EPT). Zakwaterowanie dostępne.",
    acc: true,
  },
  {
    slug:  "allround-warehouse-eindhoven",
    title: "Pracownik Magazynowy All-round",
    location: "Helmond / Deurne / Eindhoven",
    salary: "€14,71/h brutto",
    desc: "Różnorodne zadania magazynowe — kompletacja, pakowanie, obsługa towarów. Wymagana rozmowa kwalifikacyjna na żywo. Zakwaterowanie dostępne.",
    acc: true,
  },
  {
    slug:  "order-picker-ept-experience-apeldoorn",
    title: "Order Picker z doświadczeniem EPT",
    location: "Apeldoorn",
    salary: "€16,47/h brutto",
    desc: "Wymagane doświadczenie z obsługą EPT. Lepsza stawka godzinowa dla doświadczonych pracowników.",
    acc: true,
  },
  {
    slug:  "warehouse-worker-amsterdam-tilburg-den-bosch",
    title: "Pracownik Magazynowy",
    location: "Amsterdam / Tilburg / Den Bosch",
    salary: "€14,71/h brutto",
    desc: "Praca w dużych centrach dystrybucyjnych. Kilka lokalizacji do wyboru. Zakwaterowanie w pobliżu miejsca pracy.",
    acc: true,
  },
  {
    slug:  "warehouse-worker-experience-waddinxveen",
    title: "Pracownik Magazynowy z doświadczeniem",
    location: "Waddinxveen",
    salary: "€16,47/h brutto",
    desc: "Wymagane wcześniejsze doświadczenie w magazynie. Wyższa stawka dla doświadczonych kandydatów.",
    acc: true,
  },
  {
    slug:  "order-picker-ept-experience-fresh-netherlands",
    title: "Order Picker — Dział Świeży (Fresh)",
    location: "Holandia",
    salary: "€14,98/h brutto",
    desc: "Praca w dziale świeżym. Kompletacja zamówień. Wymagane doświadczenie z EPT. Zakwaterowanie dostępne.",
    acc: true,
  },
] as const;

const WA_BASE = `https://wa.me/${WA_NUMBER}`;
const SOURCE  = "pl-magazyn";

// ─── JobPosting Schema ─────────────────────────────────────────────────────────
function jobPostingSchema(job: typeof JOBS[number]) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.desc,
    hiringOrganization: {
      "@type": "Organization",
      name: "AgencyCheck",
      sameAs: "https://agencycheck.io",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "NL",
        addressLocality: job.location,
      },
    },
    employmentType: "FULL_TIME",
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "EUR",
      value: {
        "@type": "QuantitativeValue",
        unitText: "HOUR",
      },
    },
    datePosted: new Date().toISOString().split("T")[0],
    validThrough: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    applicantLocationRequirements: { "@type": "Country", name: "Netherlands" },
    jobBenefits: "Zakwaterowanie dostępne, transport organizowany przez agencję",
  };
}

// ─── WA icon ──────────────────────────────────────────────────────────────────
function WAIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`shrink-0 ${className}`} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export default function PracaMagazynPage() {
  return (
    <>
      {/* ── JSON-LD schemas ── */}
      {JOBS.map((job) => (
        <script key={job.slug} type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema(job)) }}
        />
      ))}

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="bg-[#0f172a] text-white pt-10 pb-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[12px] font-bold uppercase tracking-wide text-emerald-400">
              {JOBS.length} ofert aktywnych
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            Praca w Holandii —{" "}
            <span className="text-emerald-400">magazyn i produkcja</span>,{" "}
            z zakwaterowaniem
          </h1>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-7 max-w-xl mx-auto">
            Ponad 100 aktualnych ofert. Bez opłat. Aplikuj przez WhatsApp i odzywamy się{" "}
            <strong className="text-white">tego samego dnia</strong>.
          </p>

          <GateLink
            source={SOURCE}
            jobTitle="Praca w magazynie — Holandia"
            jobId="pl-magazyn"
            className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebe5a] active:scale-[0.98] text-white font-black text-[16px] px-8 py-4 rounded-2xl transition-all duration-150"
            style={{ boxShadow: "0 8px 32px rgba(37,211,102,0.30)" }}
          >
            <WAIcon />
            Aplikuj przez WhatsApp →
          </GateLink>

          <p className="text-gray-500 text-[12px] mt-3">
            Bezpłatne dla pracownika · Odpowiadamy tego samego dnia
          </p>

          {/* Trust pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {["Bez opłat", "Zakwaterowanie w cenie", "Bez doświadczenia", "Bez języka"].map((p) => (
              <span key={p} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] text-gray-300">
                <span className="text-emerald-400">✓</span> {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOB CARDS ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#0c1524] px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-white font-black text-xl mb-1">Aktualne oferty pracy</h2>
          <p className="text-gray-400 text-sm mb-6">Sprawdzone i aktywne stanowiska. Bez pośredników.</p>

          <div className="space-y-3">
            {JOBS.map((job) => (
              <div
                key={job.slug}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-white font-bold text-[15px] leading-snug">{job.title}</h3>
                      {job.acc && (
                        <span className="shrink-0 text-[10px] font-bold bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 rounded-full px-2 py-0.5">
                          🏠 zakwaterowanie
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-[12px]">📍 {job.location} &nbsp;·&nbsp; 💶 {job.salary}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-[13px] leading-relaxed mb-4">{job.desc}</p>
                <GateLink
                  source={SOURCE}
                  jobTitle={job.title}
                  jobId={job.slug}
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5a] active:scale-[0.98] text-white font-bold text-[14px] py-3 rounded-xl transition-all duration-150"
                >
                  <WAIcon className="w-4 h-4" />
                  Aplikuj na WhatsApp
                </GateLink>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 text-[12px] mt-5">
            Więcej ofert?{" "}
            <Link href="/apply" className="text-emerald-400 underline">
              Zobacz wszystkie stanowiska →
            </Link>
          </p>
        </div>
      </section>

      {/* ── 3 STEPS ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#0f1f14] border-y border-white/[0.06] px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-white font-black text-xl text-center mb-8">Jak to działa?</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { n: "1", title: "Wybierz ofertę", body: "Kliknij «Aplikuj przez WhatsApp» pod ofertą, która Cię interesuje." },
              { n: "2", title: "Wyślij zgłoszenie", body: "Otworzy się WhatsApp z gotową wiadomością. Wyślij ją i potwierdź swoje dane." },
              { n: "3", title: "Odzywamy się", body: "Oddzwaniamy tego samego dnia. Potwierdzamy termin startu i zakwaterowanie." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-3">
                  <span className="text-emerald-400 font-black text-[14px]">{s.n}</span>
                </div>
                <h3 className="text-white font-bold text-[14px] mb-1">{s.title}</h3>
                <p className="text-gray-400 text-[12px] leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ────────────────────────────────────────────────────────────── */}
      <section className="bg-[#0c1524] px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-white font-black text-xl text-center mb-7">Dlaczego przez nas?</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: "🆓", title: "Bez opłat dla pracownika", body: "Nigdy nie płacisz za pośrednictwo. Agencja pokrywa nasze koszty." },
              { icon: "🏠", title: "Zakwaterowanie w cenie", body: "Mieszkanie w pobliżu pracy organizowane przez agencję od pierwszego dnia." },
              { icon: "✅", title: "Sprawdzone oferty", body: "Współpracujemy tylko z certyfikowanymi agencjami pracy w Holandii (SNA/ABU)." },
              { icon: "⚡", title: "Szybka odpowiedź", body: "Odzywamy się tego samego dnia — zwykle w ciągu kilku godzin." },
            ].map((b) => (
              <div key={b.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="text-2xl mb-2">{b.icon}</div>
                <h3 className="text-white font-bold text-[14px] mb-1">{b.title}</h3>
                <p className="text-gray-400 text-[12px] leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <section className="bg-[#0f172a] px-4 py-10 border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-white font-black text-xl text-center mb-7">Często zadawane pytania</h2>
          <div className="space-y-3">
            {[
              {
                q: "Czy muszę płacić za pośrednictwo?",
                a: "Nie. Praca przez AgencyCheck jest w 100% bezpłatna dla pracownika. Agencja płaci nam za skuteczne pośrednictwo.",
              },
              {
                q: "Czy potrzebuję znajomości języka?",
                a: "Większość ofert magazynowych nie wymaga znajomości holenderskiego. Wystarczy podstawowy angielski lub nawet tylko chęci do pracy.",
              },
              {
                q: "Jak działa zakwaterowanie?",
                a: "Agencja organizuje zakwaterowanie (zazwyczaj w domach pracowniczych) blisko miejsca pracy. Koszt to ok. €95–€113/tydzień, odliczany od wynagrodzenia.",
              },
              {
                q: "Jak szybko mogę zacząć pracować?",
                a: "Zazwyczaj start jest możliwy w ciągu 1–2 tygodni od pierwszego kontaktu. Wiele firm poszukuje pracowników z natychmiastowym startem.",
              },
              {
                q: "Czy muszę mieć BSN (holenderski numer podatkowy)?",
                a: "Jeśli jeszcze nie masz BSN, agencja pomoże Ci go wyrobić po przyjeździe. Nie blokuje to zatrudnienia.",
              },
            ].map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-white font-bold text-[14px] mb-2">{faq.q}</p>
                <p className="text-gray-400 text-[13px] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ────────────────────────────────────────────────────────── */}
      <section className="bg-[#0d1f14] px-4 py-10 border-t border-[#25D366]/10">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-white font-black text-xl mb-3">Gotowy do aplikowania?</h2>
          <p className="text-gray-400 text-sm mb-6">
            Napisz do nas na WhatsApp — odpiszemy tego samego dnia.
          </p>
          <GateLink
            source={SOURCE}
            jobTitle="Praca w magazynie — Holandia"
            jobId="pl-magazyn"
            className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebe5a] active:scale-[0.98] text-white font-black text-[16px] px-8 py-4 rounded-2xl transition-all duration-150"
            style={{ boxShadow: "0 8px 32px rgba(37,211,102,0.30)" }}
          >
            <WAIcon />
            Aplikuj przez WhatsApp →
          </GateLink>
          <div className="mt-6 text-[12px] text-gray-500 flex flex-wrap justify-center gap-x-4 gap-y-1">
            <a href="mailto:hello@agencycheck.io" className="hover:text-gray-400">hello@agencycheck.io</a>
            <Link href="/agencies" className="hover:text-gray-400">Agencje pracy</Link>
            <Link href="/pl" className="hover:text-gray-400">Więcej po polsku</Link>
          </div>
        </div>
      </section>

      {/* ── Sticky mobile apply bar ─────────────────────────────────────────── */}
      <StickyApplyBar
        waBase={WA_BASE}
        jobTitle="Praca w magazynie — Holandia"
        source={SOURCE}
        jobId="pl-magazyn"
        referralMode={true}
      />

      {/* Bottom padding so sticky bar doesn't cover content on mobile */}
      <div className="h-24 md:hidden" />
    </>
  );
}
