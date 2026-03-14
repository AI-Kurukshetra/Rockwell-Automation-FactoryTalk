import { Badge } from "@/components/ui/badge";
import { EventType } from "@/lib/validation/event";

const typeStyles: Record<EventType, string> = {
  auth: "bg-blue-100 text-blue-700",
  equipment: "bg-emerald-100 text-emerald-700",
  alarm: "bg-rose-100 text-rose-700",
  telemetry: "bg-indigo-100 text-indigo-700",
  production: "bg-amber-100 text-amber-700",
  quality: "bg-teal-100 text-teal-700",
  system: "bg-slate-100 text-slate-700",
};

export function EventTypeBadge({ type }: { type: EventType }) {
  return (
    <Badge className={`border-0 px-2.5 py-1 text-xs ${typeStyles[type]}`}>
      {type}
    </Badge>
  );
}
