import { Badge } from "@/components/ui/badge";
import { EquipmentStatus } from "@/lib/validation/equipment";

const statusStyles: Record<EquipmentStatus, string> = {
  online: "bg-emerald-100 text-emerald-700",
  offline: "bg-slate-200 text-slate-700",
  maintenance: "bg-amber-100 text-amber-700",
  idle: "bg-blue-100 text-blue-700",
};

export function EquipmentStatusBadge({ status }: { status: EquipmentStatus }) {
  return (
    <Badge className={`border-0 px-2.5 py-1 text-xs ${statusStyles[status]}`}>
      {status}
    </Badge>
  );
}
