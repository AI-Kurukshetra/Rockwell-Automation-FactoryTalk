"use client";

import { useActionState, useEffect, useRef } from "react";

import {
  createScadaConnection,
  type ScadaActionState,
} from "@/app/actions/scada";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { scadaProtocols, scadaStatuses } from "@/lib/validation/scada";

const initialState: ScadaActionState = { ok: true };

export function CreateScadaConnectionForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(
    createScadaConnection,
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
        <h2 className="text-lg font-semibold">Add SCADA Connection</h2>
        <p className="text-xs text-muted-foreground">
          Register PLC and SCADA endpoints for monitoring.
        </p>
      </div>

      {state.message ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="PLC Gateway A" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="protocol">Protocol</Label>
          <select
            id="protocol"
            name="protocol"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            defaultValue="opc_ua"
          >
            {scadaProtocols.map((protocol) => (
              <option key={protocol} value={protocol}>
                {protocol.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="endpoint">Endpoint</Label>
          <Input id="endpoint" name="endpoint" placeholder="opc.tcp://10.0.0.15:4840" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            defaultValue="offline"
          >
            {scadaStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="last_sync">Last Sync</Label>
          <Input id="last_sync" name="last_sync" type="datetime-local" />
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
