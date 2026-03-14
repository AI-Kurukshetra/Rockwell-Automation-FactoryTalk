"use client";

import { useActionState } from "react";

import {
  acknowledgeAlarm,
  resolveAlarm,
  type AlarmActionState,
} from "@/app/actions/alarms";
import { Button } from "@/components/ui/button";
import { AlarmStatus } from "@/lib/validation/alarm";

const initialState: AlarmActionState = { ok: true };

export function AlarmActionButtons({
  id,
  status,
}: {
  id: string;
  status: AlarmStatus;
}) {
  const [ackState, ackAction, ackPending] = useActionState(
    acknowledgeAlarm,
    initialState,
  );
  const [resolveState, resolveAction, resolvePending] = useActionState(
    resolveAlarm,
    initialState,
  );

  return (
    <div className="flex justify-end gap-2">
      <form action={ackAction}>
        <input type="hidden" name="id" value={id} />
        <Button
          type="submit"
          variant="outline"
          size="sm"
          disabled={status !== "active" || ackPending}
        >
          {ackState.message ? "Error" : "Acknowledge"}
        </Button>
      </form>
      <form action={resolveAction}>
        <input type="hidden" name="id" value={id} />
        <Button
          type="submit"
          size="sm"
          disabled={status === "resolved" || resolvePending}
        >
          {resolveState.message ? "Error" : "Resolve"}
        </Button>
      </form>
    </div>
  );
}
