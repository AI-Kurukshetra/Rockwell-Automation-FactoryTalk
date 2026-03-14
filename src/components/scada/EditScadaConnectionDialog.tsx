"use client";

import { useActionState, useMemo } from "react";

import {
  updateScadaConnection,
  type ScadaActionState,
} from "@/app/actions/scada";
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
  scadaProtocols,
  scadaStatuses,
  type ScadaProtocol,
  type ScadaStatus,
} from "@/lib/validation/scada";

type ScadaRow = {
  id: string;
  name: string;
  protocol: ScadaProtocol;
  endpoint: string;
  status: ScadaStatus;
  last_sync: string | null;
  notes: string | null;
};

const initialState: ScadaActionState = { ok: true };

function toDatetimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function EditScadaConnectionDialog({ connection }: { connection: ScadaRow }) {
  const [state, action, pending] = useActionState(
    updateScadaConnection,
    initialState,
  );
  const lastSync = useMemo(
    () => toDatetimeLocal(connection.last_sync),
    [connection.last_sync],
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
          <DialogTitle>Edit SCADA connection</DialogTitle>
        </DialogHeader>
        <form action={action} className="grid gap-4">
          <input type="hidden" name="id" value={connection.id} />
          {state.message ? (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.message}
            </p>
          ) : null}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor={`name-${connection.id}`}>Name</Label>
              <Input
                id={`name-${connection.id}`}
                name="name"
                defaultValue={connection.name}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`protocol-${connection.id}`}>Protocol</Label>
              <select
                id={`protocol-${connection.id}`}
                name="protocol"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                defaultValue={connection.protocol}
              >
                {scadaProtocols.map((protocol) => (
                  <option key={protocol} value={protocol}>
                    {protocol.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`endpoint-${connection.id}`}>Endpoint</Label>
              <Input
                id={`endpoint-${connection.id}`}
                name="endpoint"
                defaultValue={connection.endpoint}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`status-${connection.id}`}>Status</Label>
              <select
                id={`status-${connection.id}`}
                name="status"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                defaultValue={connection.status}
              >
                {scadaStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`last-sync-${connection.id}`}>Last Sync</Label>
              <Input
                id={`last-sync-${connection.id}`}
                name="last_sync"
                type="datetime-local"
                defaultValue={lastSync}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`notes-${connection.id}`}>Notes</Label>
            <Textarea
              id={`notes-${connection.id}`}
              name="notes"
              rows={3}
              defaultValue={connection.notes ?? ""}
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
