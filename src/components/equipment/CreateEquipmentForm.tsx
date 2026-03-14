"use client";

import { useActionState, useEffect, useRef } from "react";

import { createEquipment, type EquipmentActionState } from "@/app/actions/equipment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { equipmentStatuses } from "@/lib/validation/equipment";

const initialState: EquipmentActionState = { ok: true };

export function CreateEquipmentForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(
    createEquipment,
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
        <h2 className="text-lg font-semibold">Add Equipment</h2>
        <p className="text-xs text-muted-foreground">
          Register a new asset to track.
        </p>
      </div>

      {state.message ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="Filling Line 3" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            defaultValue="offline"
          >
            {equipmentStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" placeholder="Zone B / Line 2" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="last_seen">Last Seen</Label>
          <Input id="last_seen" name="last_seen" type="datetime-local" />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Optional notes about the asset."
          rows={3}
        />
      </div>

      <div className="flex items-center justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Create"}
        </Button>
      </div>
    </form>
  );
}
