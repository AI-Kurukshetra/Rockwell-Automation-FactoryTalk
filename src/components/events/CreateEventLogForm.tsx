"use client";

import { useActionState, useEffect, useRef } from "react";

import { createEventLog, type EventActionState } from "@/app/actions/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { eventSeverities, eventTypes } from "@/lib/validation/event";

const initialState: EventActionState = { ok: true };

export function CreateEventLogForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(
    createEventLog,
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
        <h2 className="text-lg font-semibold">Log Event</h2>
        <p className="text-xs text-muted-foreground">
          Capture operational and audit events.
        </p>
      </div>

      {state.message ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" placeholder="Operator login" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            name="type"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            defaultValue="system"
          >
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="severity">Severity</Label>
          <select
            id="severity"
            name="severity"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            defaultValue="info"
          >
            {eventSeverities.map((severity) => (
              <option key={severity} value={severity}>
                {severity}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="actor">Actor</Label>
          <Input id="actor" name="actor" placeholder="Ops Supervisor" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="occurred_at">Occurred At</Label>
          <Input id="occurred_at" name="occurred_at" type="datetime-local" />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="details">Details</Label>
        <Textarea id="details" name="details" rows={3} placeholder="Optional context." />
      </div>

      <div className="flex items-center justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Create"}
        </Button>
      </div>
    </form>
  );
}
