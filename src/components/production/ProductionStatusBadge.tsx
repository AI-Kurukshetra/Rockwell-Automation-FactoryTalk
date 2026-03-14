import { Badge } from "@/components/ui/badge";
import { ProductionStatus } from "@/lib/validation/production";

const statusStyles: Record<ProductionStatus, string> = {
  planned: "bg-slate-100 text-slate-700",
  in_progress: "bg-blue-100 text-blue-700",
  paused: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export function ProductionStatusBadge({ status }: { status: ProductionStatus }) {
  return (
    <Badge className={`border-0 px-2.5 py-1 text-xs ${statusStyles[status]}`}>
      {status.replace("_", " ")}
    </Badge>
  );
}
