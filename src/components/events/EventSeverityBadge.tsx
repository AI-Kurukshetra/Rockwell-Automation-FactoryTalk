import { Badge } from "@/components/ui/badge";
import { EventSeverity } from "@/lib/validation/event";

const severityStyles: Record<EventSeverity, string> = {
  info: "bg-slate-100 text-slate-700",
  warning: "bg-amber-100 text-amber-700",
  critical: "bg-red-100 text-red-700",
};

export function EventSeverityBadge({ severity }: { severity: EventSeverity }) {
  return (
    <Badge className={`border-0 px-2.5 py-1 text-xs ${severityStyles[severity]}`}>
      {severity}
    </Badge>
  );
}
