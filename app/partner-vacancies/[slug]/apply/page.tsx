"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getPartnerVacancyBySlug, WRX_WA_NUMBER } from "@/lib/partnerVacancies";

type BSN          = "yes" | "not_yet" | "no";
type Availability = "immediately" | "week1" | "week2" | "later";

interface FormState {
  euCitizen:    boolean | null;
  country:      string;
  bsn:          BSN | null;
  driving:      "yes" | "no" | null;
  housing:      "yes" | "no" | null;
  availability: Availability | null;
  location:     string;
}

const EMPTY: FormState = {
  euCitizen:    null,
  country:      "",
  bsn:          null,
  driving:      null,
  housing:      null,
  availability: null,
  location:     "",
};

function buildWhatsAppMessage(f: FormState, jobTitle: string, jobLocation: string): string {
  const bsnLabel: Record<BSN, string> = {
    yes:     "Yes",
    not_yet: "Not yet (willing to arrange)",
    no:      "No",
  };
  const availLabel: Record<Availability, string> = {
    immediately: "Immediately",
    week1:       "Within 1 week",
    week2:       "Within 2 weeks",
    later:       "Later",
  };
  return [
    `🔔 NEW APPLICATION via AgencyCheck`,
    ``,
    `📋 POSITION: ${jobTitle} — ${jobLocation}`,
    ``,
    `Candidate details:`,
    `- EU citizenship: ${f.country.trim()} (EU)`,
    `- BSN: ${f.bsn ? bsnLabel[f.bsn] : "—"}`,
    `- Driving licence: ${f.driving === "yes" ? "Yes" : "No"}`,
    `- Housing needed: ${f.housing === "yes" ? "Yes" : "No"}`,
    `- Available from: ${f.availability ? availLabel[f.availability] : "—"}`,
    `- Current location: ${f.location.trim()}`,
    ``,
    `[Source: AgencyCheck Partner Vacancy]`,
  ].join("\n");
}

function isEuCountry(input: string): boolean {
  const EU = new Set([
    "austria","osterreich","belgium","belgique","belgie","bulgaria","croatia","hrvatska",
    "cyprus","kibris","czech republic","czechia","czech","ceska republika","cesko",
    "denmark","danmark","estonia","eesti","finland","suomi","france","germany","deutschland",
    "greece","hellas","ellada","hungary","magyarorszag","ireland","eire","italy","italia",
    "latvia","latvija","lithuania","lietuva","luxembourg","malta","netherlands","the netherlands",
    "holland","nederland","poland","polska","portugal","romania","rumania","romainia",
    "slovakia","slovak republic","slovensko","slovenia","slovenija","spain","espana",
    "sweden","sverige","ukraine","ukrainian","norway","norge","iceland","island",
    "liechtenstein","switzerland","schweiz","suisse",
  ]);
  const n = input.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z\s]/g,"").trim();
  return EU.has(n);
}

function Opt({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full min-h-[44px] py-2.5 px-3 rounded-xl border text-[13px] font-semibold
        transition-all duration-150 text-left leading-snug flex items-center
        ${selected
          ? "border-emerald-400 bg-emerald-400/15 text-emerald-300"
          : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}
      `}
    >
      {selected && <span className="mr-1 text-emerald-400 text-[11px] shrink-0">✓ </span>}
      {label}
    </button>
  );
}

function Question({ label, children, error }: { label: string; children: React.ReactNode; error?: boolean }) {
  return (
    <div className="mb-4">
      <p className={`text-[12px] font-bold mb-2 ${error ? "text-red-400" : "text-gray-400"}`}>
        {label}{error && <span className="ml-1 text-red-400">*</span>}
      </p>
      {children}
    </div>
  );
}

export default function PartnerApplyPage() {
  const params  = useParams<{ slug: string }>();
  const vacancy = getPartnerVacancyBySlug(params.slug ?? "");

  const [form,    setForm]    = useState<FormState>(EMPTY);
  const [errors,  setErrors]  = useState(false);
  const [done,    setDone]    = useState(false);

  if (!vacancy) {
    return (
      <div className="min-h-screen bg-[#0B1F14] text-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-2xl mb-3">❌</p>
          <p className="font-bold text-white mb-2">Vacancy not found</p>
          <Link href="/partner-vacancies" className="text-emerald-400 hover:underline text-sm">Back to vacancies</Link>
        </div>
      </div>
    );
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(false);
  }

  function handleSubmit() {
    const valid =
      form.euCitizen === true &&
      form.country.trim().length >= 2 &&
      isEuCountry(form.country) &&
      !!form.bsn &&
      !!form.housing &&
      !!form.availability &&
      form.location.trim().length >= 2;

    if (!valid) { setErrors(true); return; }

    const msg = buildWhatsAppMessage(form, vacancy!.title, vacancy!.location);
    const url = `https://wa.me/${WRX_WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    setDone(true);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#0B1F14] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-black text-white mb-3">Application Sent!</h1>
          <div className="rounded-2xl border border-emerald-700/30 bg-emerald-900/20 p-6 mb-6">
            <p className="text-sm text-gray-300 leading-relaxed">
              Your details have been sent via WhatsApp. A recruiter will review your profile and respond the same day.
            </p>
          </div>
          <div className="space-y-2">
            <Link href={`/partner-vacancies/${vacancy.slug}`}
              className="block w-full rounded-xl border border-white/[0.07] bg-white/[0.04] py-3 text-sm font-semibold text-gray-300 hover:text-white transition-colors">
              ← Back to vacancy
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const euBlocked = form.euCitizen === true && form.country.trim().length >= 2 && !isEuCountry(form.country);

  return (
    <div className="min-h-screen bg-[#0B1F14] text-white">
      <div className="max-w-lg mx-auto px-4 py-8 pb-20">

        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-emerald-400">Home</Link>
          <span>›</span>
          <Link href={`/partner-vacancies/${vacancy.slug}`} className="hover:text-emerald-400">{vacancy.title}</Link>
          <span>›</span>
          <span className="text-gray-300">Apply</span>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full px-2.5 py-1">✓ Verified Partner</span>
            <span className="text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full px-2.5 py-1">🔥 Urgent</span>
          </div>
          <h1 className="text-2xl font-black text-white mb-1">Apply: {vacancy.title}</h1>
          <p className="text-sm text-gray-400">📍 {vacancy.location} · {vacancy.partner}</p>
        </div>

        {/* Trust notice */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.06] px-4 py-3 mb-6 flex items-start gap-3">
          <span className="text-blue-400 shrink-0 mt-0.5">🔒</span>
          <p className="text-xs text-blue-200/90 leading-relaxed">
            Quick 6-question check. Your details are sent directly to our recruiter via WhatsApp — response the same day.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-1">

          {/* EU citizenship */}
          <Question label="Are you an EU citizen?" error={errors && form.euCitizen !== true}>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Opt label="✅ Yes" selected={form.euCitizen === true}  onClick={() => set("euCitizen", true)} />
              <Opt label="❌ No"  selected={form.euCitizen === false} onClick={() => set("euCitizen", false)} />
            </div>
            {form.euCitizen === true && (
              <input
                type="text"
                value={form.country}
                onChange={e => set("country", e.target.value)}
                placeholder="e.g. Poland, Romania, Bulgaria..."
                autoComplete="off"
                className={`block w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-base placeholder-gray-600 focus:outline-none transition-colors ${
                  euBlocked ? "border-red-400/50" : form.country.trim().length >= 2 ? "border-emerald-400/50" : "border-white/10 focus:border-emerald-400/50"
                }`}
              />
            )}
            {euBlocked && (
              <p className="text-red-400 text-[11px] mt-1">EU citizenship required for this position.</p>
            )}
            {form.euCitizen === false && (
              <p className="text-red-400 text-[11px] mt-1">This position requires EU citizenship. We cannot process your application.</p>
            )}
          </Question>

          {/* BSN */}
          <Question label="Do you have a BSN number?" error={errors && !form.bsn}>
            <div className="grid grid-cols-3 gap-2">
              <Opt label="Yes"      selected={form.bsn === "yes"}     onClick={() => set("bsn", "yes")} />
              <Opt label="Not yet"  selected={form.bsn === "not_yet"} onClick={() => set("bsn", "not_yet")} />
              <Opt label="No"       selected={form.bsn === "no"}      onClick={() => set("bsn", "no")} />
            </div>
          </Question>

          {/* Driving licence */}
          <Question label="Do you have a driving licence?">
            <div className="grid grid-cols-2 gap-2">
              <Opt label="Yes" selected={form.driving === "yes"} onClick={() => set("driving", "yes")} />
              <Opt label="No"  selected={form.driving === "no"}  onClick={() => set("driving", "no")} />
            </div>
          </Question>

          {/* Housing */}
          <Question label="Do you need accommodation / housing?" error={errors && !form.housing}>
            <div className="grid grid-cols-2 gap-2">
              <Opt label="Yes" selected={form.housing === "yes"} onClick={() => set("housing", "yes")} />
              <Opt label="No"  selected={form.housing === "no"}  onClick={() => set("housing", "no")} />
            </div>
          </Question>

          {/* When to start */}
          <Question label="Available from when?" error={errors && !form.availability}>
            <div className="grid grid-cols-2 gap-2">
              <Opt label="Immediately"    selected={form.availability === "immediately"} onClick={() => set("availability", "immediately")} />
              <Opt label="Within 1 week"  selected={form.availability === "week1"}       onClick={() => set("availability", "week1")} />
              <Opt label="Within 2 weeks" selected={form.availability === "week2"}       onClick={() => set("availability", "week2")} />
              <Opt label="Later"          selected={form.availability === "later"}       onClick={() => set("availability", "later")} />
            </div>
          </Question>

          {/* Location */}
          <Question label="Current country / city" error={errors && form.location.trim().length < 2}>
            <input
              type="text"
              value={form.location}
              onChange={e => set("location", e.target.value)}
              placeholder="e.g. Poland, Warsaw"
              autoComplete="off"
              className="block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base placeholder-gray-600 focus:outline-none focus:border-emerald-400/50 transition-colors"
            />
          </Question>

          {errors && (
            <p className="text-red-400 text-[12px] pt-1">Please answer all required questions to continue.</p>
          )}

          {/* Submit */}
          <div className="pt-3">
            <button
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] active:scale-[0.97] text-white font-black text-[16px] py-4 rounded-2xl transition-all duration-150"
              style={{ boxShadow: "0 4px 18px rgba(37,211,102,0.25)" }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Apply via WhatsApp
            </button>
            <p className="text-center text-[11px] text-gray-500 mt-2">
              Opens WhatsApp with your details pre-filled. Send the message to complete.
            </p>
          </div>

          {/* GDPR */}
          <p className="text-center text-[11px] text-gray-600 pt-2 leading-snug">
            By applying, your details are shared with a recruiter partner.{" "}
            <Link href="/privacy" className="text-emerald-400 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
