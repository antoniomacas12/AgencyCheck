"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  defaultJob?:       string;
  defaultCity?:      string;
  defaultHousing?:   boolean;
  // Salary params are preserved from the current URL so they aren't lost when
  // the user submits a new keyword/city search from the /search page.
  defaultSalaryMin?: string;
  defaultSalaryMax?: string;
  size?: "default" | "large";
}

export default function SearchBar({
  defaultJob       = "",
  defaultCity      = "",
  defaultHousing   = false,
  defaultSalaryMin = "",
  defaultSalaryMax = "",
  size             = "default",
}: SearchBarProps) {
  const router  = useRouter();
  const [job,     setJob]     = useState(defaultJob);
  const [city,    setCity]    = useState(defaultCity);
  const [housing, setHousing] = useState(defaultHousing);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();

    if (job.trim())     params.set("job", job.trim());
    if (city.trim())    params.set("city", city.trim());
    if (housing)        params.set("housing", "yes");
    // Preserve active salary filters when re-searching
    if (defaultSalaryMin) params.set("salaryMin", defaultSalaryMin);
    if (defaultSalaryMax) params.set("salaryMax", defaultSalaryMax);

    router.push(`/search?${params.toString()}`);
  }

  const isLarge = size === "large";
  const inputCls = `w-full bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400
    focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow
    ${isLarge ? "py-3.5 text-base" : "py-2.5 text-sm"}`;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`flex flex-col sm:flex-row gap-2 ${isLarge ? "sm:gap-3" : ""}`}>

        {/* Job / keyword */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none select-none">
            🔍
          </span>
          <input
            type="text"
            placeholder="Job title (e.g. order picker, warehouse)"
            value={job}
            onChange={(e) => setJob(e.target.value)}
            className={`${inputCls} pl-9 pr-3`}
          />
        </div>

        {/* City */}
        <div className="relative sm:w-44">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none select-none">
            📍
          </span>
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`${inputCls} pl-9 pr-3`}
          />
        </div>

        {/* Housing toggle */}
        <button
          type="button"
          onClick={() => setHousing(!housing)}
          className={`flex items-center justify-center gap-2 px-4 rounded-xl border font-medium transition-all shrink-0
            ${isLarge ? "py-3.5 text-base" : "py-2.5 text-sm"}
            ${housing
              ? "bg-green-50 border-green-400 text-green-700"
              : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
            }`}
        >
          🏠 {housing ? "Housing: Yes" : "Housing"}
        </button>

        {/* Submit */}
        <button
          type="submit"
          className={`flex items-center justify-center gap-2 px-6 bg-brand-600 hover:bg-brand-700
            text-white font-semibold rounded-xl transition-colors shrink-0
            ${isLarge ? "py-3.5 text-base" : "py-2.5 text-sm"}`}
        >
          Search
        </button>
      </div>
    </form>
  );
}
