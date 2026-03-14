import { Badge } from "@/components/ui/badge";
import { ProductionPriority } from "@/lib/validation/production";

const priorityStyles: Record<ProductionPriority, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

export function ProductionPriorityBadge({
  priority,
}: {
  priority: ProductionPriority;
}) {
  return (
    <Badge className={`border-0 px-2.5 py-1 text-xs ${priorityStyles[priority]}`}>
      {priority}
    </Badge>
  );
}
