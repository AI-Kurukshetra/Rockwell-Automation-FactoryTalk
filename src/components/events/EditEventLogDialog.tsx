"use client";

import { useActionState, useMemo } from "react";

import { updateEventLog, type EventActionState } from "@/app/actions/events";
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
import {
  eventSeverities,
  eventTypes,
  type EventSeverity,
  type EventType,
} from "@/lib/validation/event";

type EventRow = {
  id: string;
  title: string;
  type: EventType;
  severity: EventSeverity;
  actor: string | null;
  details: string | null;
  occurred_at: string | null;
};

const initialState: EventActionState = { ok: true };

function toDatetimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function EditEventLogDialog({ event }: { event: EventRow }) {
  const [state, action, pending] = useActionState(
    updateEventLog,
    initialState,
  );
  const occurredAt = useMemo(
    () => toDatetimeLocal(event.occurred_at),
    [event.occurred_at],
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
          <DialogTitle>Edit event</DialogTitle>
        </DialogHeader>
        <form action={action} className="grid gap-4">
          <input type="hidden" name="id" value={event.id} />
          {state.message ? (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.message}
            </p>
          ) : null}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor={`title-${event.id}`}>Title</Label>
              <Input
                id={`title-${event.id}`}
                name="title"
                defaultValue={event.title}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`type-${event.id}`}>Type</Label>
              <select
                id={`type-${event.id}`}
                name="type"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                defaultValue={event.type}
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`severity-${event.id}`}>Severity</Label>
              <select
                id={`severity-${event.id}`}
                name="severity"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                defaultValue={event.severity}
              >
                {eventSeverities.map((severity) => (
                  <option key={severity} value={severity}>
                    {severity}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`actor-${event.id}`}>Actor</Label>
              <Input
                id={`actor-${event.id}`}
                name="actor"
                defaultValue={event.actor ?? ""}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`occurred-${event.id}`}>Occurred At</Label>
              <Input
                id={`occurred-${event.id}`}
                name="occurred_at"
                type="datetime-local"
                defaultValue={occurredAt}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`details-${event.id}`}>Details</Label>
            <Textarea
              id={`details-${event.id}`}
              name="details"
              rows={3}
              defaultValue={event.details ?? ""}
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
