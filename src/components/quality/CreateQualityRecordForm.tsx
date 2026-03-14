"use client";

import { useActionState, useEffect, useRef } from "react";

import {
  createQualityRecord,
  type QualityActionState,
} from "@/app/actions/quality";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { qualityStatuses } from "@/lib/validation/quality";

const initialState: QualityActionState = { ok: true };

export function CreateQualityRecordForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(
    createQualityRecord,
    initialState,
  );

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  return (
    <form
      ref={formRef}
      action={action}
      className="grid gap-4 rounded-3xl border border-border/70 bg-card/70 p-5 shadow-sm"
    >
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Log Quality Record</h2>
        <p className="text-xs text-muted-foreground">
          Track inspections and defect outcomes.
        </p>
      </div>

      {state.message ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="record_number">Record #</Label>
          <Input id="record_number" name="record_number" placeholder="QR-9001" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="product_name">Product</Label>
          <Input id="product_name" name="product_name" placeholder="Sparkling Water 500ml" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="line">Line</Label>
          <Input id="line" name="line" placeholder="Line A / QA" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            defaultValue="pass"
          >
            {qualityStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="defect_type">Defect Type</Label>
          <Input id="defect_type" name="defect_type" placeholder="Seal leak" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="defect_count">Defect Count</Label>
          <Input id="defect_count" name="defect_count" type="number" min={0} defaultValue={0} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="inspected_at">Inspected At</Label>
          <Input id="inspected_at" name="inspected_at" type="datetime-local" />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={3} placeholder="Optional notes." />
      </div>

      <div className="flex items-center justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Create"}
        </Button>
      </div>
    </form>
  );
}
