"use client";

import { useActionState, useMemo } from "react";

import { updateEquipment, type EquipmentActionState } from "@/app/actions/equipment";
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
import { equipmentStatuses, type EquipmentStatus } from "@/lib/validation/equipment";

type EquipmentRow = {
  id: string;
  name: string;
  status: EquipmentStatus;
  location: string | null;
  last_seen: string | null;
  notes: string | null;
};

const initialState: EquipmentActionState = { ok: true };

function toDatetimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function EditEquipmentDialog({ equipment }: { equipment: EquipmentRow }) {
  const [state, action, pending] = useActionState(
    updateEquipment,
    initialState,
  );
  const defaultLastSeen = useMemo(
    () => toDatetimeLocal(equipment.last_seen),
    [equipment.last_seen],
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Edit equipment</DialogTitle>
        </DialogHeader>
        <form action={action} className="grid gap-4">
          <input type="hidden" name="id" value={equipment.id} />
          {state.message ? (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.message}
            </p>
          ) : null}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor={`name-${equipment.id}`}>Name</Label>
              <Input
                id={`name-${equipment.id}`}
                name="name"
                defaultValue={equipment.name}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`status-${equipment.id}`}>Status</Label>
              <select
                id={`status-${equipment.id}`}
                name="status"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                defaultValue={equipment.status}
              >
                {equipmentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`location-${equipment.id}`}>Location</Label>
              <Input
                id={`location-${equipment.id}`}
                name="location"
                defaultValue={equipment.location ?? ""}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`last_seen-${equipment.id}`}>Last Seen</Label>
              <Input
                id={`last_seen-${equipment.id}`}
                name="last_seen"
                type="datetime-local"
                defaultValue={defaultLastSeen}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`notes-${equipment.id}`}>Notes</Label>
            <Textarea
              id={`notes-${equipment.id}`}
              name="notes"
              rows={3}
              defaultValue={equipment.notes ?? ""}
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
