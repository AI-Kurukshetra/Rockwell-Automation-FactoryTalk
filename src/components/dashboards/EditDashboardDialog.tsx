"use client";

import { useActionState } from "react";

import { updateDashboard, type DashboardActionState } from "@/app/actions/dashboards";
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

type DashboardRow = {
  id: string;
  name: string;
  description: string | null;
};

const initialState: DashboardActionState = { ok: true };

export function EditDashboardDialog({ dashboard }: { dashboard: DashboardRow }) {
  const [state, action, pending] = useActionState(
    updateDashboard,
    initialState,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Edit dashboard</DialogTitle>
        </DialogHeader>
        <form action={action} className="grid gap-4">
          <input type="hidden" name="id" value={dashboard.id} />
          {state.message ? (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.message}
            </p>
          ) : null}
          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor={`name-${dashboard.id}`}>Name</Label>
              <Input
                id={`name-${dashboard.id}`}
                name="name"
                defaultValue={dashboard.name}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`description-${dashboard.id}`}>Description</Label>
              <Textarea
                id={`description-${dashboard.id}`}
                name="description"
                rows={3}
                defaultValue={dashboard.description ?? ""}
              />
            </div>
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
