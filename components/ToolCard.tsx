/**
 * ToolCard.tsx — Reusable tool card generated from toolsRegistry entries.
 *
 * Two variants:
 *   featured  — Large card with full description, inputs/outputs, bold CTA.
 *               Used in the featured section of the tools overview page.
 *   standard  — Compact card for the category grid.
 *               Used in the "All Tools" section.
 */

import Link from "next/link";
import type { ToolRegistryEntry } from "@/lib/toolsRegistry";

// ── Badge component ───────────────────────────────────────────────────────────

function Badge({ label, featured }: { label: string; featured?: boolean }) {
  if (featured) {
    return (
      <span className="text-[10px] font-semibold bg-brand-600 text-white rounded-full px-2 py-0.5">
        {label}
      </span>
    );
  }
  return (
    <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 rounded-full px-1.5 py-0.5">
      {label}
    </span>
  );
}

// ── Featured card (large) ─────────────────────────────────────────────────────

interface FeaturedToolCardProps {
  tool: ToolRegistryEntry;
  /** Optional rank number shown in top-left (1-indexed) */
  rank?: number;
}

export function FeaturedToolCard({ tool, rank }: FeaturedToolCardProps) {
  return (
    <Link
      href={tool.href}
      className="block card p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all group border-brand-100 bg-gradient-to-br from-brand-50/60 to-white relative overflow-hidden"
    >
      {/* Rank number watermark */}
      {rank !== undefined && (
        <span className="absolute top-3 right-4 text-4xl font-black text-brand-50 select-none pointer-events-none">
          #{rank}
        </span>
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <span className="text-3xl shrink-0 mt-0.5">{tool.icon}</span>

        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors text-base leading-snug">
              {tool.title}
            </h3>
            {tool.badge && <Badge label={tool.badge} featured />}
          </div>

          {/* Tagline */}
          <p className="text-xs text-brand-600 font-semibold mb-2">{tool.tagline}</p>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed mb-4">{tool.description}</p>

          {/* Inputs / Outputs */}
          <div className="flex flex-wrap gap-6 text-xs text-gray-500 mb-4">
            <div>
              <p className="font-semibold text-gray-700 mb-1">You enter</p>
              <ul className="space-y-0.5">
                {tool.inputHints.map((hint) => (
                  <li key={hint} className="flex items-center gap-1">
                    <span className="text-gray-300">→</span> {hint}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-1">You get</p>
              <ul className="space-y-0.5">
                {tool.outputHints.map((hint) => (
                  <li key={hint} className="flex items-center gap-1">
                    <span className="text-green-500">✓</span> {hint}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-brand-600 group-hover:bg-brand-700 transition-colors rounded-lg px-4 py-2">
            {tool.ctaLabel} →
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Standard card (compact) ───────────────────────────────────────────────────

interface StandardToolCardProps {
  tool: ToolRegistryEntry;
}

export function StandardToolCard({ tool }: StandardToolCardProps) {
  return (
    <Link
      href={tool.href}
      className="card p-4 hover:shadow-md hover:border-brand-100 hover:-translate-y-0.5 transition-all block group"
    >
      {/* Icon */}
      <span className="text-2xl block mb-3">{tool.icon}</span>

      {/* Title + Badge */}
      <div className="flex items-start gap-2 mb-1 flex-wrap">
        <p className="text-sm font-bold text-gray-900 group-hover:text-brand-600 transition-colors leading-snug">
          {tool.title}
        </p>
        {tool.badge && <Badge label={tool.badge} />}
      </div>

      {/* Tagline */}
      <p className="text-xs text-brand-600 font-medium mb-2">{tool.tagline}</p>

      {/* Description */}
      <p className="text-xs text-gray-500 leading-relaxed mb-3">{tool.description}</p>

      {/* Inline CTA link */}
      <p className="text-xs text-brand-600 font-semibold group-hover:underline">
        {tool.ctaLabel} →
      </p>
    </Link>
  );
}

// ── Default export: auto-selects variant ─────────────────────────────────────

interface ToolCardProps {
  tool: ToolRegistryEntry;
  variant?: "featured" | "standard";
  rank?: number;
}

export default function ToolCard({ tool, variant = "standard", rank }: ToolCardProps) {
  if (variant === "featured") {
    return <FeaturedToolCard tool={tool} rank={rank} />;
  }
  return <StandardToolCard tool={tool} />;
}
