"use client";

import { useActionState } from "react";

import {
  deleteQualityRecord,
  type QualityActionState,
} from "@/app/actions/quality";
import { Button } from "@/components/ui/button";

const initialState: QualityActionState = { ok: true };

export function DeleteQualityRecordButton({ id }: { id: string }) {
  const [state, action, pending] = useActionState(
    deleteQualityRecord,
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
