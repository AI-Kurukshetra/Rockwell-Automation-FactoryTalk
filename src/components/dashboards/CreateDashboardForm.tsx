"use client";

import { useActionState, useEffect, useRef } from "react";

import { createDashboard, type DashboardActionState } from "@/app/actions/dashboards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: DashboardActionState = { ok: true };

export function CreateDashboardForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(
    createDashboard,
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
        <h2 className="text-lg font-semibold">Create Dashboard</h2>
        <p className="text-xs text-muted-foreground">
          Build a custom monitoring view for your team.
        </p>
      </div>

      {state.message ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-3">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="Operations Overview" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={3} placeholder="Optional description." />
        </div>
      </div>

      <div className="flex items-center justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Create"}
        </Button>
      </div>
    </form>
  );
}
