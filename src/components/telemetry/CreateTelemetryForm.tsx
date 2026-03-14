"use client";

import { useActionState, useEffect, useRef } from "react";

import {
  createTelemetry,
  type TelemetryActionState,
} from "@/app/actions/telemetry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EquipmentOption = {
  id: string;
  name: string;
};

const initialState: TelemetryActionState = { ok: true };

export function CreateTelemetryForm({
  equipmentOptions,
}: {
  equipmentOptions: EquipmentOption[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(createTelemetry, initialState);

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
        <h2 className="text-lg font-semibold">Log Reading</h2>
        <p className="text-xs text-muted-foreground">
          Capture a time-series data point.
        </p>
      </div>

      {state.message ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="equipment_id">Equipment</Label>
          <select
            id="equipment_id"
            name="equipment_id"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            defaultValue=""
            required
          >
            <option value="" disabled>
              Select equipment
            </option>
            {equipmentOptions.map((equipment) => (
              <option key={equipment.id} value={equipment.id}>
                {equipment.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="metric">Metric</Label>
          <Input id="metric" name="metric" placeholder="temperature" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="value">Value</Label>
          <Input id="value" name="value" type="number" step="0.01" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="unit">Unit</Label>
          <Input id="unit" name="unit" placeholder="C" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="recorded_at">Recorded At</Label>
          <Input id="recorded_at" name="recorded_at" type="datetime-local" />
        </div>
      </div>

      <div className="flex items-center justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Create reading"}
        </Button>
      </div>
    </form>
  );
}
