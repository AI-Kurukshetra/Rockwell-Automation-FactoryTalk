"use client";

import { useActionState, useEffect, useRef } from "react";

import { createAlarm, type AlarmActionState } from "@/app/actions/alarms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { alarmSeverities } from "@/lib/validation/alarm";

type EquipmentOption = {
  id: string;
  name: string;
};

const initialState: AlarmActionState = { ok: true };

export function CreateAlarmForm({
  equipmentOptions,
}: {
  equipmentOptions: EquipmentOption[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(createAlarm, initialState);

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
        <h2 className="text-lg font-semibold">Create Alarm</h2>
        <p className="text-xs text-muted-foreground">
          Log a new event for operators to acknowledge.
        </p>
      </div>

      {state.message ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-3">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Packaging Cell 3 temp spike"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="severity">Severity</Label>
          <select
            id="severity"
            name="severity"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            defaultValue="medium"
          >
            {alarmSeverities.map((severity) => (
              <option key={severity} value={severity}>
                {severity}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="equipment_id">Equipment</Label>
          <select
            id="equipment_id"
            name="equipment_id"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            defaultValue=""
          >
            <option value="">Unassigned</option>
            {equipmentOptions.map((equipment) => (
              <option key={equipment.id} value={equipment.id}>
                {equipment.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Optional alarm notes."
          rows={3}
        />
      </div>

      <div className="flex items-center justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Create alarm"}
        </Button>
      </div>
    </form>
  );
}
