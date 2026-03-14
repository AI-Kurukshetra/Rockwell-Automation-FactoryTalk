"use client";

import { useActionState, useEffect, useRef } from "react";

import { createWidget, type DashboardActionState } from "@/app/actions/dashboards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { widgetTypes } from "@/lib/validation/dashboard";

const initialState: DashboardActionState = { ok: true };

export function CreateWidgetForm({ dashboardId }: { dashboardId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(
    createWidget,
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
      <input type="hidden" name="dashboard_id" value={dashboardId} />
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Add Widget</h2>
        <p className="text-xs text-muted-foreground">
          Configure a new block for this dashboard.
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
          <Input id="title" name="title" placeholder="OEE KPI" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            name="type"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            defaultValue="kpi"
          >
            {widgetTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="position">Position</Label>
          <Input id="position" name="position" placeholder="row-1 / col-1-2" />
        </div>
        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="config">Config (JSON)</Label>
          <Textarea
            id="config"
            name="config"
            rows={3}
            placeholder='{"metric":"oee","range":"24h"}'
          />
        </div>
      </div>

      <div className="flex items-center justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Add widget"}
        </Button>
      </div>
    </form>
  );
}
