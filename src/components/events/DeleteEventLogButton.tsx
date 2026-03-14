"use client";

import { useActionState } from "react";

import { deleteEventLog, type EventActionState } from "@/app/actions/events";
import { Button } from "@/components/ui/button";

const initialState: EventActionState = { ok: true };

export function DeleteEventLogButton({ id }: { id: string }) {
  const [state, action, pending] = useActionState(
    deleteEventLog,
    initialState,
  );

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="outline" size="sm" disabled={pending}>
        {pending ? "Deleting..." : "Delete"}
      </Button>
      {state.message ? (
        <p className="mt-2 text-xs text-destructive">{state.message}</p>
      ) : null}
    </form>
  );
}
