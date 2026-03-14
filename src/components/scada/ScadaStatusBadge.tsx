import { Badge } from "@/components/ui/badge";
import { ScadaStatus } from "@/lib/validation/scada";

const statusStyles: Record<ScadaStatus, string> = {
  online: "bg-emerald-100 text-emerald-700",
  degraded: "bg-amber-100 text-amber-700",
  offline: "bg-slate-100 text-slate-700",
};

export function ScadaStatusBadge({ status }: { status: ScadaStatus }) {
  return (
    <Badge className={`border-0 px-2.5 py-1 text-xs ${statusStyles[status]}`}>
      {status}
    </Badge>
  );
}
