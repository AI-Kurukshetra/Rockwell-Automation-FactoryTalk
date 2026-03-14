import { Badge } from "@/components/ui/badge";
import { AlarmSeverity } from "@/lib/validation/alarm";

const severityStyles: Record<AlarmSeverity, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

export function AlarmSeverityBadge({
  severity,
}: {
  severity: AlarmSeverity;
}) {
  return (
    <Badge className={`border-0 px-2.5 py-1 text-xs ${severityStyles[severity]}`}>
      {severity}
    </Badge>
  );
}
