"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createServerClientWithCookies } from "@/lib/supabase/server";
import { productionOrderSchema } from "@/lib/validation/production";

const updateSchema = productionOrderSchema.extend({
  id: z.string().uuid("Invalid production order id."),
});

export type ProductionActionState = {
  ok: boolean;
  message?: string;
};

function toIsoOrNull(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function normalizeProductionInput(data: z.infer<typeof productionOrderSchema>) {
  return {
    order_number: data.order_number.trim(),
    product_name: data.product_name.trim(),
    line: data.line.trim(),
    quantity: data.quantity,
    status: data.status,
    priority: data.priority,
    scheduled_start: toIsoOrNull(data.scheduled_start),
    scheduled_end: toIsoOrNull(data.scheduled_end),
    actual_start: toIsoOrNull(data.actual_start),
    actual_end: toIsoOrNull(data.actual_end),
    notes: data.notes?.trim() || null,
  };
}

export async function createProductionOrder(
  _prevState: ProductionActionState,
  formData: FormData,
) {
  const payload = {
    order_number: String(formData.get("order_number") ?? ""),
    product_name: String(formData.get("product_name") ?? ""),
    line: String(formData.get("line") ?? ""),
    quantity: String(formData.get("quantity") ?? ""),
    status: String(formData.get("status") ?? "planned"),
    priority: String(formData.get("priority") ?? "medium"),
    scheduled_start: String(formData.get("scheduled_start") ?? ""),
    scheduled_end: String(formData.get("scheduled_end") ?? ""),
    actual_start: "",
    actual_end: "",
    notes: String(formData.get("notes") ?? ""),
  };

  const parsed = productionOrderSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const supabase = await createServerClientWithCookies();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return { ok: false, message: "You must be signed in." };
  }

  const { error } = await supabase.from("production_orders").insert({
    user_id: authData.user.id,
    ...normalizeProductionInput(parsed.data),
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateProductionOrder(
  _prevState: ProductionActionState,
  formData: FormData,
) {
  const payload = {
    id: String(formData.get("id") ?? ""),
    order_number: String(formData.get("order_number") ?? ""),
    product_name: String(formData.get("product_name") ?? ""),
    line: String(formData.get("line") ?? ""),
    quantity: String(formData.get("quantity") ?? ""),
    status: String(formData.get("status") ?? "planned"),
    priority: String(formData.get("priority") ?? "medium"),
    scheduled_start: String(formData.get("scheduled_start") ?? ""),
    scheduled_end: String(formData.get("scheduled_end") ?? ""),
    actual_start: String(formData.get("actual_start") ?? ""),
    actual_end: String(formData.get("actual_end") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  };

  const parsed = updateSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const supabase = await createServerClientWithCookies();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return { ok: false, message: "You must be signed in." };
  }

  const { error } = await supabase
    .from("production_orders")
    .update(normalizeProductionInput(parsed.data))
    .eq("id", parsed.data.id)
    .eq("user_id", authData.user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteProductionOrder(
  _prevState: ProductionActionState,
  formData: FormData,
) {
  const id = String(formData.get("id") ?? "");

  if (!z.string().uuid().safeParse(id).success) {
    return { ok: false, message: "Invalid production order id." };
  }

  const supabase = await createServerClientWithCookies();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return { ok: false, message: "You must be signed in." };
  }

  const { error } = await supabase
    .from("production_orders")
    .delete()
    .eq("id", id)
    .eq("user_id", authData.user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}
