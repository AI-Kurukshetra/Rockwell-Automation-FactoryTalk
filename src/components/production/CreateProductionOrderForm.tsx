"use client";

import { useActionState, useEffect, useRef } from "react";

import {
  createProductionOrder,
  type ProductionActionState,
} from "@/app/actions/production";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  productionPriorities,
  productionStatuses,
} from "@/lib/validation/production";

const initialState: ProductionActionState = { ok: true };

export function CreateProductionOrderForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(
    createProductionOrder,
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
        <h2 className="text-lg font-semibold">Schedule Production</h2>
        <p className="text-xs text-muted-foreground">
          Plan and prioritize a manufacturing order.
        </p>
      </div>

      {state.message ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="order_number">Order #</Label>
          <Input id="order_number" name="order_number" placeholder="PO-1042" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="product_name">Product</Label>
          <Input id="product_name" name="product_name" placeholder="Sparkling Water 500ml" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="line">Line</Label>
          <Input id="line" name="line" placeholder="Line A / Filling" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" name="quantity" type="number" min={1} defaultValue={1000} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            defaultValue="planned"
          >
            {productionStatuses.map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="priority">Priority</Label>
          <select
            id="priority"
            name="priority"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            defaultValue="medium"
          >
            {productionPriorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="scheduled_start">Scheduled Start</Label>
          <Input id="scheduled_start" name="scheduled_start" type="datetime-local" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="scheduled_end">Scheduled End</Label>
          <Input id="scheduled_end" name="scheduled_end" type="datetime-local" />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={3} placeholder="Optional notes." />
      </div>

      <div className="flex items-center justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Create"}
        </Button>
      </div>
    </form>
  );
}
