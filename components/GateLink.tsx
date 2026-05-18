"use client";

/**
 * GateLink — drop-in replacement for <a href={WA_LINK}>.
 *
 * Renders with identical className/children as the <a> it replaces,
 * but intercepts the click and opens the EU + BSN pre-screen gate
 * instead of going straight to WhatsApp.
 *
 * Usage:
 *   <GateLink className="..." source="randstad-review">
 *     <WAIcon /> Apply on WhatsApp
 *   </GateLink>
 */

import ApplyPreScreen from "@/components/ApplyPreScreen";
import { WA_NUMBER } from "@/lib/whatsapp";

interface Props {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  jobTitle?: string;
  source?: string;
  jobId?: string;
}

export default function GateLink({
  className,
  style,
  children,
  jobTitle = "Work in the Netherlands",
  source,
  jobId = "general",
}: Props) {
  return (
    <ApplyPreScreen
      waBase={`https://wa.me/${WA_NUMBER}`}
      jobTitle={jobTitle}
      source={source}
      jobId={jobId}
      referralMode
    >
      {(openFn) => (
        <button onClick={openFn} className={className} style={style} type="button">
          {children}
        </button>
      )}
    </ApplyPreScreen>
  );
}
