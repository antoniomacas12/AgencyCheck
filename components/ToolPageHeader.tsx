/**
 * ToolPageHeader.tsx — Shared breadcrumb + header strip for all tool pages.
 *
 * Replaces the hardcoded "← Tools" / "← All tools" links in each individual
 * client component. Import and render at the top of each ToolPageShell or
 * client tool component.
 *
 * Usage:
 *   <ToolPageHeader slug="salary-calculator" />
 *
 * The slug is used to look up the tool in toolsRegistry for the back link
 * and optional category chip. If slug is omitted, only "← Tools" is shown.
 */

import Link from "next/link";
import { TOOLS_REGISTRY, CATEGORY_META } from "@/lib/toolsRegistry";

interface ToolPageHeaderProps {
  /** Tool slug — matches toolsRegistry entry. Used for category breadcrumb. */
  slug?: string;
  /** Override the back label (default: "All tools") */
  backLabel?: string;
}

export default function ToolPageHeader({ slug, backLabel = "All tools" }: ToolPageHeaderProps) {
  const tool = slug ? TOOLS_REGISTRY.find((t) => t.slug === slug) : undefined;
  const categoryMeta = tool ? CATEGORY_META[tool.category] : undefined;

  return (
    <nav
      aria-label="Tool breadcrumb"
      className="flex items-center gap-2 text-xs text-gray-500 mb-6 flex-wrap"
    >
      {/* Home */}
      <Link href="/" className="hover:text-brand-600 transition-colors">
        Home
      </Link>
      <span className="text-gray-300">/</span>

      {/* Tools hub */}
      <Link href="/tools" className="hover:text-brand-600 transition-colors flex items-center gap-1">
        <span>🧰</span> {backLabel}
      </Link>

      {/* Category chip (optional) */}
      {categoryMeta && (
        <>
          <span className="text-gray-300">/</span>
          <span className="flex items-center gap-1 text-gray-500">
            <span>{categoryMeta.icon}</span>
            {categoryMeta.label}
          </span>
        </>
      )}

      {/* Current tool name */}
      {tool && (
        <>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-medium">{tool.title}</span>
        </>
      )}
    </nav>
  );
}
