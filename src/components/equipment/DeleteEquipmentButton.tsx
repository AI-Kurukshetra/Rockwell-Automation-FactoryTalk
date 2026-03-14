"use client";

import { useActionState } from "react";

import { deleteEquipment, type EquipmentActionState } from "@/app/actions/equipment";
import { Button } from "@/components/ui/button";

const initialState: EquipmentActionState = { ok: true };

export function DeleteEquipmentButton({ id }: { id: string }) {
  const [state, action, pending] = useActionState(
    deleteEquipment,
    initialState,
  );

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="ghost" size="sm" disabled={pending}>
        {state.message ? "Error" : pending ? "Deleting..." : "Delete"}
      </Button>
    </form>
  );
}
