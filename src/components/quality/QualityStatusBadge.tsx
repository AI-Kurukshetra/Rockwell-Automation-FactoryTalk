import { Badge } from "@/components/ui/badge";
import { QualityStatus } from "@/lib/validation/quality";

const statusStyles: Record<QualityStatus, string> = {
  pass: "bg-emerald-100 text-emerald-700",
  fail: "bg-red-100 text-red-700",
  rework: "bg-amber-100 text-amber-700",
};

export function QualityStatusBadge({ status }: { status: QualityStatus }) {
  return (
    <Badge className={`border-0 px-2.5 py-1 text-xs ${statusStyles[status]}`}>
      {status}
    </Badge>
  );
}
