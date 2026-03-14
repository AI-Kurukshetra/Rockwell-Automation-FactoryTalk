import { Badge } from "@/components/ui/badge";
import { AlarmStatus } from "@/lib/validation/alarm";

const statusStyles: Record<AlarmStatus, string> = {
  active: "bg-red-100 text-red-700",
  acknowledged: "bg-blue-100 text-blue-700",
  resolved: "bg-emerald-100 text-emerald-700",
};

export function AlarmStatusBadge({ status }: { status: AlarmStatus }) {
  return (
    <Badge className={`border-0 px-2.5 py-1 text-xs ${statusStyles[status]}`}>
      {status}
    </Badge>
  );
}
