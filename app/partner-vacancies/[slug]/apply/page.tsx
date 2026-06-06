"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getPartnerVacancyBySlug, WRX_WA_NUMBER } from "@/lib/partnerVacancies";
import { trackWhatsappClick } from "@/lib/analytics";

type Step = "form" | "success";

interface FormData {
  name:           string;
  nationality:    string;
  phone:          string;
  whatsapp:       string;
  location:       string;
  bsnStatus:      string;
  drivingLicence: string;
  reachtruck:     string;
  forklift:       string;
  englishLevel:   string;
  dutchLevel:     string;
  accommodation:  string;
  ownTransport:   string;
  availability:   string;
  cvNote:         string;
}

const EMPTY: FormData = {
  name:           "",
  nationality:    "",
  phone:          "",
  whatsapp:       "",
  location:       "",
  bsnStatus:      "",
  drivingLicence: "",
  reachtruck:     "",
  forklift:       "",
  englishLevel:   "",
  dutchLevel:     "",
  accommodation:  "",
  ownTransport:   "",
  availability:   "",
  cvNote:         "",
};

function buildWhatsAppMessage(f: FormData, jobTitle: string, location: string): string {
  return [
    `🔔 NEW APPLICATION via AgencyCheck`,
    ``,
    `📋 POSITION: ${jobTitle} — ${location}`,
    ``,
    `👤 CANDIDATE DETAILS`,
    `Name: ${f.name}`,
    `Nationality: ${f.nationality}`,
    `Phone: ${f.phone}`,
    `WhatsApp: ${f.whatsapp || f.phone}`,
    `Current location: ${f.location}`,
    ``,
    `📄 DOCUMENTS & QUALIFICATIONS`,
    `BSN status: ${f.bsnStatus}`,
    `Driving licence: ${f.drivingLicence}`,
    `Reachtruck certificate: ${f.reachtruck}`,
    `Forklift certificate: ${f.forklift}`,
    ``,
    `🗣 LANGUAGE SKILLS`,
    `English: ${f.englishLevel}`,
    `Dutch: ${f.dutchLevel}`,
    ``,
    `🏠 PRACTICAL`,
    `Accommodation needed: ${f.accommodation}`,
    `Own transport: ${f.ownTransport}`,
    `Available from: ${f.availability}`,
    ``,
    f.cvNote ? `📎 CV / EXTRA INFO: ${f.cvNote}` : "",
    ``,
    `[Source: AgencyCheck Partner Vacancy]`,
  ].filter((l) => l !== undefined).join("\n");
}

export default function PartnerApplyPage() {
  const params  = useParams<{ slug: string }>();
  const vacancy = getPartnerVacancyBySlug(params.slug ?? "");

  const [step,   setStep]   = useState<Step>("form");
  const [form,   setForm]   = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  if (!vacancy) {
    return (
      <div className="min-h-screen bg-[#0B1F14] text-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-2xl mb-3">❌</p>
          <p className="font-bold text-white mb-2">Vacancy not found</p>
          <Link href="/partner-vacancies" className="text-emerald-400 hover:underline text-sm">
            Back to vacancies
          </Link>
        </div>
      </div>
    );
  }

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim())        e.name        = "Required";
    if (!form.nationality.trim()) e.nationality = "Required";
    if (!form.phone.trim())       e.phone       = "Required";
    if (!form.location.trim())    e.location    = "Required";
    if (!form.bsnStatus)          e.bsnStatus   = "Required";
    if (!form.ownTransport)       e.ownTransport = "Required";
    if (!form.availability.trim()) e.availability = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    trackWhatsappClick({
      vacancy_title: vacancy?.title,
      vacancy_slug: vacancy?.slug,
      source: "apply_form",
    });
    const msg = buildWhatsAppMessage(form, vacancy!.title, vacancy!.location);
    const url = `https://wa.me/${WRX_WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    setStep("success");
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-[#0B1F14] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-black text-white mb-3">Application Sent!</h1>
          <div className="rounded-2xl border border-emerald-700/30 bg-emerald-900/20 p-6 mb-6">
            <p className="text-base text-emerald-200 leading-relaxed">
              Thank you for your application.
            </p>
            <p className="text-sm text-gray-300 mt-2 leading-relaxed">
              AgencyCheck will review your profile and contact you shortly if you match the vacancy requirements.
            </p>
          </div>
          <div className="space-y-2">
            <Link
              href={`/partner-vacancies/${vacancy.slug}`}
              className="block w-full rounded-xl border border-white/[0.07] bg-white/[0.04] py-3 text-sm font-semibold text-gray-300 hover:text-white transition-colors"
            >
              ← Back to vacancy
            </Link>
            <Link
              href="/vacancies"
              className="block w-full rounded-xl border border-white/[0.07] bg-white/[0.04] py-3 text-sm font-semibold text-gray-300 hover:text-white transition-colors"
            >
              Browse more jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const Field = ({
    label, field, type = "text", placeholder, required = false,
    options,
  }: {
    label: string;
    field: keyof FormData;
    type?: string;
    placeholder?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
  }) => (
    <div>
      <label className="block text-xs font-bold text-gray-300 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {options ? (
        <select
          value={form[field]}
          onChange={(e) => update(field, e.target.value)}
          className={`w-full bg-white/[0.05] border rounded-xl px-3 py-3 text-[16px] text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all ${
            errors[field] ? "border-red-500/50" : "border-white/[0.10]"
          }`}
        >
          <option value="" className="bg-[#0B1F14]">— Select —</option>
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-[#0B1F14]">{o.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={form[field]}
          onChange={(e) => update(field, e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-white/[0.05] border rounded-xl px-3 py-3 text-[16px] text-white placeholder:text-gray-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all ${
            errors[field] ? "border-red-500/50" : "border-white/[0.10]"
          }`}
        />
      )}
      {errors[field] && (
        <p className="text-[11px] text-red-400 mt-1">{errors[field]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B1F14] text-white">
      <div className="max-w-xl mx-auto px-4 py-8 pb-16">

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
            <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full px-2.5 py-1">
              ✓ Verified Partner Vacancy
            </span>
            <span className="text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full px-2.5 py-1">
              🔥 Priority Hiring
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mb-1">Apply: {vacancy.title}</h1>
          <p className="text-sm text-gray-400">📍 {vacancy.location} · {vacancy.partner}</p>
        </div>

        {/* Trust notice */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.06] px-4 py-3 mb-6 flex items-start gap-3">
          <span className="text-blue-400 text-base shrink-0 mt-0.5">🔒</span>
          <p className="text-xs text-blue-200/90 leading-relaxed">
            Apply through AgencyCheck and we will personally review your application before forwarding it to the employer.
            Your details are sent directly via WhatsApp to our recruitment team.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">

          {/* Personal */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-5">
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4">Personal Details</p>
            <div className="space-y-4">
              <Field label="Full name" field="name" placeholder="e.g. Jan Kowalski" required />
              <Field label="Nationality" field="nationality" placeholder="e.g. Polish, Romanian, Bulgarian..." required />
              <Field label="Phone number" field="phone" type="tel" placeholder="+48 ... or +40 ..." required />
              <Field label="WhatsApp number" field="whatsapp" type="tel" placeholder="If different from phone" />
              <Field label="Current location" field="location" placeholder="City, Country" required />
            </div>
          </div>

          {/* Documents */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-5">
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4">Documents & Qualifications</p>
            <div className="space-y-4">
              <Field
                label="BSN number status" field="bsnStatus" required
                options={[
                  { value: "yes_have_it",   label: "✅ Yes, I have a BSN" },
                  { value: "registering",   label: "⏳ Registering now" },
                  { value: "no_need_help",  label: "❌ No — need help" },
                ]}
              />
              <Field
                label="Driving licence" field="drivingLicence"
                options={[
                  { value: "B",       label: "Category B (car)" },
                  { value: "B+BE",    label: "B + BE (car + trailer)" },
                  { value: "C",       label: "Category C (truck)" },
                  { value: "CE",      label: "Category CE (truck + trailer)" },
                  { value: "none",    label: "No driving licence" },
                  { value: "other",   label: "Other" },
                ]}
              />
              <Field
                label="Reachtruck certificate" field="reachtruck"
                options={[
                  { value: "yes_valid",   label: "✅ Yes — valid certificate" },
                  { value: "yes_expired", label: "⚠️ Yes — but expired" },
                  { value: "no",          label: "No certificate" },
                  { value: "experience",  label: "Experience but no certificate" },
                ]}
              />
              <Field
                label="Forklift certificate" field="forklift"
                options={[
                  { value: "yes_valid",   label: "✅ Yes — valid certificate" },
                  { value: "yes_expired", label: "⚠️ Yes — but expired" },
                  { value: "no",          label: "No certificate" },
                  { value: "experience",  label: "Experience but no certificate" },
                ]}
              />
            </div>
          </div>

          {/* Language */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-5">
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4">Language Skills</p>
            <div className="space-y-4">
              <Field
                label="English level" field="englishLevel"
                options={[
                  { value: "A1", label: "A1 — Basic words only" },
                  { value: "A2", label: "A2 — Simple sentences" },
                  { value: "B1", label: "B1 — Conversational" },
                  { value: "B2", label: "B2 — Fluent" },
                  { value: "C1", label: "C1/C2 — Advanced / Native" },
                  { value: "none", label: "No English" },
                ]}
              />
              <Field
                label="Dutch level" field="dutchLevel"
                options={[
                  { value: "none", label: "No Dutch" },
                  { value: "A1",   label: "A1 — Basic words" },
                  { value: "A2",   label: "A2 — Simple sentences" },
                  { value: "B1",   label: "B1 — Conversational" },
                  { value: "B2+",  label: "B2+ — Fluent" },
                ]}
              />
            </div>
          </div>

          {/* Practical */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-5">
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4">Practical</p>
            <div className="space-y-4">
              <Field
                label="Accommodation needed" field="accommodation"
                options={[
                  { value: "own_nl",      label: "✅ I have own accommodation in NL" },
                  { value: "own_abroad",  label: "🏠 I have own place abroad, commuting" },
                  { value: "need_room",   label: "🔍 I need accommodation" },
                  { value: "flexible",    label: "Either works" },
                ]}
              />
              <Field
                label="Own transport" field="ownTransport" required
                options={[
                  { value: "yes_car",  label: "✅ Yes — own car" },
                  { value: "yes_moto", label: "✅ Yes — motorcycle" },
                  { value: "no",       label: "❌ No own transport" },
                  { value: "bicycle",  label: "🚲 Bicycle only" },
                ]}
              />
              <Field
                label="Available from" field="availability"
                type="date"
                required
              />
              <Field
                label="CV link or extra information (optional)"
                field="cvNote"
                placeholder="LinkedIn, Google Drive link, or brief description of experience..."
              />
            </div>
          </div>

          {/* GDPR notice */}
          <p className="text-[11px] text-gray-500 text-center px-4">
            By applying, your details are shared with AgencyCheck and forwarded to the recruitment partner.{" "}
            <Link href="/privacy" className="text-emerald-400 hover:underline">Privacy Policy</Link>
          </p>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-black font-black text-base py-4 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Send Application via WhatsApp
          </button>

          <p className="text-center text-[11px] text-gray-500">
            Opens WhatsApp with your application pre-filled. Send the message to complete.
          </p>
        </div>
      </div>
    </div>
  );
}
