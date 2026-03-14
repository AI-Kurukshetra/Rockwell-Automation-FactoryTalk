"use client";

import { useActionState, useMemo } from "react";

import {
  updateQualityRecord,
  type QualityActionState,
} from "@/app/actions/quality";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { qualityStatuses, type QualityStatus } from "@/lib/validation/quality";

type QualityRow = {
  id: string;
  record_number: string;
  product_name: string;
  line: string;
  status: QualityStatus;
  defect_type: string | null;
  defect_count: number;
  inspected_at: string | null;
  notes: string | null;
};

const initialState: QualityActionState = { ok: true };

function toDatetimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function EditQualityRecordDialog({ record }: { record: QualityRow }) {
  const [state, action, pending] = useActionState(
    updateQualityRecord,
    initialState,
  );
  const inspectedAt = useMemo(
    () => toDatetimeLocal(record.inspected_at),
    [record.inspected_at],
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Edit quality record</DialogTitle>
        </DialogHeader>
        <form action={action} className="grid gap-4">
          <input type="hidden" name="id" value={record.id} />
          {state.message ? (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.message}
            </p>
          ) : null}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor={`record-${record.id}`}>Record #</Label>
              <Input
                id={`record-${record.id}`}
                name="record_number"
                defaultValue={record.record_number}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`product-${record.id}`}>Product</Label>
              <Input
                id={`product-${record.id}`}
                name="product_name"
                defaultValue={record.product_name}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`line-${record.id}`}>Line</Label>
              <Input
                id={`line-${record.id}`}
                name="line"
                defaultValue={record.line}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`status-${record.id}`}>Status</Label>
              <select
                id={`status-${record.id}`}
                name="status"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                defaultValue={record.status}
              >
                {qualityStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`defect-${record.id}`}>Defect Type</Label>
              <Input
                id={`defect-${record.id}`}
                name="defect_type"
                defaultValue={record.defect_type ?? ""}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`defects-${record.id}`}>Defect Count</Label>
              <Input
                id={`defects-${record.id}`}
                name="defect_count"
                type="number"
                min={0}
                defaultValue={record.defect_count}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`inspected-${record.id}`}>Inspected At</Label>
              <Input
                id={`inspected-${record.id}`}
                name="inspected_at"
                type="datetime-local"
                defaultValue={inspectedAt}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`notes-${record.id}`}>Notes</Label>
            <Textarea
              id={`notes-${record.id}`}
              name="notes"
              rows={3}
              defaultValue={record.notes ?? ""}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
