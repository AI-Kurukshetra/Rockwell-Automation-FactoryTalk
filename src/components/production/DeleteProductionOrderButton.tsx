"use client";

import { useActionState } from "react";

import {
  deleteProductionOrder,
  type ProductionActionState,
} from "@/app/actions/production";
import { Button } from "@/components/ui/button";

const initialState: ProductionActionState = { ok: true };

export function DeleteProductionOrderButton({ id }: { id: string }) {
  const [state, action, pending] = useActionState(
    deleteProductionOrder,
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
