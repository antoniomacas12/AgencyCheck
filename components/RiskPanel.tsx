/**
 * RiskPanel — worker risk assessment panel
 * Shows housing, salary, transport, issue risk signals for an agency
 */

export type RiskLevel = "low" | "medium" | "high" | "unknown";

interface RiskSignal {
  label:   string;
  level:   RiskLevel;
  detail?: string;
}

interface RiskPanelProps {
  signals: RiskSignal[];
  title?:  string;
}

const LEVEL_CONFIG: Record<RiskLevel, { color: string; icon: string; bg: string }> = {
  low:     { color: "text-green-700",  icon: "✅", bg: "bg-green-50 border-green-100"  },
  medium:  { color: "text-amber-700",  icon: "⚠️", bg: "bg-amber-50 border-amber-100"  },
  high:    { color: "text-red-700",    icon: "🔴", bg: "bg-red-50 border-red-100"      },
  unknown: { color: "text-gray-500",   icon: "❓", bg: "bg-gray-50 border-gray-100"    },
};

export default function RiskPanel({ signals, title = "Worker Risk Signals" }: RiskPanelProps) {
  if (signals.length === 0) return null;

  const overallLevel: RiskLevel = signals.some(s => s.level === "high")
    ? "high"
    : signals.some(s => s.level === "medium")
    ? "medium"
    : "low";

  const cfg = LEVEL_CONFIG[overallLevel];

  return (
    <div className={`rounded-xl border p-4 ${cfg.bg}`}>
      <div className="flex items-center gap-2 mb-3">
        <span>{cfg.icon}</span>
        <h3 className={`text-sm font-bold ${cfg.color}`}>{title}</h3>
      </div>
      <div className="space-y-2">
        {signals.map((signal, i) => {
          const sc = LEVEL_CONFIG[signal.level];
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="text-xs mt-0.5 shrink-0">{sc.icon}</span>
              <div>
                <p className={`text-xs font-medium ${sc.color}`}>{signal.label}</p>
                {signal.detail && (
                  <p className="text-xs text-gray-500 mt-0.5">{signal.detail}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-gray-400 mt-3 border-t border-gray-100 pt-2">
        Risk signals are based on worker-reported data and publicly available information.
        AgencyCheck does not make legal claims.
      </p>
    </div>
  );
}

/** Build risk signals from canonical agency data */
export function buildAgencyRiskSignals(agency: {
  housing:       string;
  transport:     string;
  issueCount?:   number;
  description?:  string | null;
  housingVerification?: { status?: string };
}): RiskSignal[] {
  const signals: RiskSignal[] = [];

  // Housing
  if (agency.housing === "YES") {
    const vs = agency.housingVerification?.status ?? "unknown";
    signals.push({
      label:  "Housing provided",
      level:  vs === "verified" ? "low" : "medium",
      detail: vs === "verified"
        ? "Confirmed via official source"
        : "Reported by workers — always verify before starting",
    });
  } else if (agency.housing === "UNKNOWN") {
    signals.push({
      label:  "Housing status unknown",
      level:  "unknown",
      detail: "Contact agency directly to confirm",
    });
  }

  // Transport
  if (agency.transport === "YES") {
    signals.push({ label: "Transport included", level: "low" });
  } else if (agency.transport === "UNKNOWN") {
    signals.push({
      label:  "Transport status unknown",
      level:  "unknown",
      detail: "Budget €60–100/month if you arrange your own",
    });
  }

  // Issues
  const issues = agency.issueCount ?? 0;
  if (issues >= 3) {
    signals.push({
      label:  `${issues} open worker complaints`,
      level:  "high",
      detail: "Multiple workers reported unresolved issues",
    });
  } else if (issues >= 1) {
    signals.push({
      label:  `${issues} worker complaint${issues > 1 ? "s" : ""} on file`,
      level:  "medium",
    });
  } else {
    signals.push({ label: "No reported issues", level: "low" });
  }

  return signals;
}
