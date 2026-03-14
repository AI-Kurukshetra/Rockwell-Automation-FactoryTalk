"use client";

import { useActionState } from "react";

import { updateWidget, type DashboardActionState } from "@/app/actions/dashboards";
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
import { widgetTypes, type WidgetType } from "@/lib/validation/dashboard";

type WidgetRow = {
  id: string;
  title: string;
  type: WidgetType;
  config: string | null;
  position: string | null;
};

const initialState: DashboardActionState = { ok: true };

export function EditWidgetDialog({
  widget,
  dashboardId,
}: {
  widget: WidgetRow;
  dashboardId: string;
}) {
  const [state, action, pending] = useActionState(
    updateWidget,
    initialState,
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
          <DialogTitle>Edit widget</DialogTitle>
        </DialogHeader>
        <form action={action} className="grid gap-4">
          <input type="hidden" name="id" value={widget.id} />
          <input type="hidden" name="dashboard_id" value={dashboardId} />
          {state.message ? (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.message}
            </p>
          ) : null}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor={`title-${widget.id}`}>Title</Label>
              <Input
                id={`title-${widget.id}`}
                name="title"
                defaultValue={widget.title}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`type-${widget.id}`}>Type</Label>
              <select
                id={`type-${widget.id}`}
                name="type"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                defaultValue={widget.type}
              >
                {widgetTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`position-${widget.id}`}>Position</Label>
              <Input
                id={`position-${widget.id}`}
                name="position"
                defaultValue={widget.position ?? ""}
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor={`config-${widget.id}`}>Config (JSON)</Label>
              <Textarea
                id={`config-${widget.id}`}
                name="config"
                rows={3}
                defaultValue={widget.config ?? ""}
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
