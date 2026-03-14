"use client";

import { useActionState } from "react";

import { deleteDashboard, type DashboardActionState } from "@/app/actions/dashboards";
import { Button } from "@/components/ui/button";

const initialState: DashboardActionState = { ok: true };

export function DeleteDashboardButton({ id }: { id: string }) {
  const [state, action, pending] = useActionState(
    deleteDashboard,
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
