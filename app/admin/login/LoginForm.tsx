"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const router                  = useRouter();
  const emailRef                = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/admin/leads");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Login failed. Check your credentials.");
        setPassword("");
        emailRef.current?.focus();
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
          Email
        </label>
        <input
          ref={emailRef}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@agencycheck.nl"
          required
          autoComplete="email"
          className="w-full bg-gray-800 border border-gray-700 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder-gray-600"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
          className="w-full bg-gray-800 border border-gray-700 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder-gray-600"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !email || !password}
        className="w-full py-3 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-[0.99]"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Signing in…
          </span>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
}
