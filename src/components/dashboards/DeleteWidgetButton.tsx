"use client";

import { useActionState } from "react";

import { deleteWidget, type DashboardActionState } from "@/app/actions/dashboards";
import { Button } from "@/components/ui/button";

const initialState: DashboardActionState = { ok: true };

export function DeleteWidgetButton({
  id,
  dashboardId,
}: {
  id: string;
  dashboardId: string;
}) {
  const [state, action, pending] = useActionState(
    deleteWidget,
    initialState,
  );

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="dashboard_id" value={dashboardId} />
      <Button type="submit" variant="outline" size="sm" disabled={pending}>
        {pending ? "Deleting..." : "Delete"}
      </Button>
      {state.message ? (
        <p className="mt-2 text-xs text-destructive">{state.message}</p>
      ) : null}
    </form>
  );
}
