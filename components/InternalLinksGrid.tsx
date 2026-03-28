/**
 * InternalLinksGrid — reusable SEO internal linking component.
 *
 * Renders a flex-wrap pill grid of links.
 * Used across city pages, job type pages, and combo pages.
 */
import Link from "next/link";

export interface InternalLink {
  href:  string;
  label: string;
  icon?: string;
  highlight?: boolean;
}

interface InternalLinksGridProps {
  title:  string;
  links:  InternalLink[];
  className?: string;
}

export default function InternalLinksGrid({
  title,
  links,
  className = "",
}: InternalLinksGridProps) {
  if (!links.length) return null;

  return (
    <section className={`mb-6 ${className}`}>
      <h2 className="text-sm font-bold text-gray-700 mb-2">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`inline-flex items-center gap-1 text-xs font-medium rounded-full px-3 py-1.5 transition-colors ${
              link.highlight
                ? "bg-brand-50 border border-brand-100 text-brand-700 hover:bg-brand-100"
                : "bg-white border border-gray-200 text-gray-700 hover:border-brand-300 hover:text-brand-700"
            }`}
          >
            {link.icon && <span>{link.icon}</span>}
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
