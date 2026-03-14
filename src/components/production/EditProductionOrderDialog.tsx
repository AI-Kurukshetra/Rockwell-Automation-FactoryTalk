"use client";

import { useActionState, useMemo } from "react";

import {
  updateProductionOrder,
  type ProductionActionState,
} from "@/app/actions/production";
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
import {
  productionPriorities,
  productionStatuses,
  type ProductionPriority,
  type ProductionStatus,
} from "@/lib/validation/production";

type ProductionOrderRow = {
  id: string;
  order_number: string;
  product_name: string;
  line: string;
  quantity: number;
  status: ProductionStatus;
  priority: ProductionPriority;
  scheduled_start: string | null;
  scheduled_end: string | null;
  actual_start: string | null;
  actual_end: string | null;
  notes: string | null;
};

const initialState: ProductionActionState = { ok: true };

function toDatetimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function EditProductionOrderDialog({
  order,
}: {
  order: ProductionOrderRow;
}) {
  const [state, action, pending] = useActionState(
    updateProductionOrder,
    initialState,
  );
  const scheduledStart = useMemo(
    () => toDatetimeLocal(order.scheduled_start),
    [order.scheduled_start],
  );
  const scheduledEnd = useMemo(
    () => toDatetimeLocal(order.scheduled_end),
    [order.scheduled_end],
  );
  const actualStart = useMemo(
    () => toDatetimeLocal(order.actual_start),
    [order.actual_start],
  );
  const actualEnd = useMemo(
    () => toDatetimeLocal(order.actual_end),
    [order.actual_end],
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
          <DialogTitle>Edit production order</DialogTitle>
        </DialogHeader>
        <form action={action} className="grid gap-4">
          <input type="hidden" name="id" value={order.id} />
          {state.message ? (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.message}
            </p>
          ) : null}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor={`order-${order.id}`}>Order #</Label>
              <Input
                id={`order-${order.id}`}
                name="order_number"
                defaultValue={order.order_number}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`product-${order.id}`}>Product</Label>
              <Input
                id={`product-${order.id}`}
                name="product_name"
                defaultValue={order.product_name}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`line-${order.id}`}>Line</Label>
              <Input
                id={`line-${order.id}`}
                name="line"
                defaultValue={order.line}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`quantity-${order.id}`}>Quantity</Label>
              <Input
                id={`quantity-${order.id}`}
                name="quantity"
                type="number"
                min={1}
                defaultValue={order.quantity}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`status-${order.id}`}>Status</Label>
              <select
                id={`status-${order.id}`}
                name="status"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                defaultValue={order.status}
              >
                {productionStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`priority-${order.id}`}>Priority</Label>
              <select
                id={`priority-${order.id}`}
                name="priority"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                defaultValue={order.priority}
              >
                {productionPriorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`scheduled-start-${order.id}`}>
                Scheduled Start
              </Label>
              <Input
                id={`scheduled-start-${order.id}`}
                name="scheduled_start"
                type="datetime-local"
                defaultValue={scheduledStart}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`scheduled-end-${order.id}`}>
                Scheduled End
              </Label>
              <Input
                id={`scheduled-end-${order.id}`}
                name="scheduled_end"
                type="datetime-local"
                defaultValue={scheduledEnd}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`actual-start-${order.id}`}>Actual Start</Label>
              <Input
                id={`actual-start-${order.id}`}
                name="actual_start"
                type="datetime-local"
                defaultValue={actualStart}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`actual-end-${order.id}`}>Actual End</Label>
              <Input
                id={`actual-end-${order.id}`}
                name="actual_end"
                type="datetime-local"
                defaultValue={actualEnd}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`notes-${order.id}`}>Notes</Label>
            <Textarea
              id={`notes-${order.id}`}
              name="notes"
              rows={3}
              defaultValue={order.notes ?? ""}
            />
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
