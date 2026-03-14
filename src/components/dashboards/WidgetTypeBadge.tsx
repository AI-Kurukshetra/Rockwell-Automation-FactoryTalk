import { Badge } from "@/components/ui/badge";
import { WidgetType } from "@/lib/validation/dashboard";

const typeStyles: Record<WidgetType, string> = {
  kpi: "bg-emerald-100 text-emerald-700",
  chart: "bg-indigo-100 text-indigo-700",
  table: "bg-amber-100 text-amber-700",
  text: "bg-slate-100 text-slate-700",
};

export function WidgetTypeBadge({ type }: { type: WidgetType }) {
  return (
    <Badge className={`border-0 px-2.5 py-1 text-xs ${typeStyles[type]}`}>
      {type}
    </Badge>
  );
}
