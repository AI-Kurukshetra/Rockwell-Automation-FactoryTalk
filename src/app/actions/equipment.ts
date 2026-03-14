"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createServerClientWithCookies } from "@/lib/supabase/server";
import { equipmentSchema } from "@/lib/validation/equipment";

const updateSchema = equipmentSchema.extend({
  id: z.string().uuid("Invalid equipment id."),
});

export type EquipmentActionState = {
  ok: boolean;
  message?: string;
};

function normalizeEquipmentInput(data: z.infer<typeof equipmentSchema>) {
  return {
    name: data.name.trim(),
    status: data.status,
    location: data.location?.trim() || null,
    last_seen: data.last_seen ? new Date(data.last_seen).toISOString() : null,
    notes: data.notes?.trim() || null,
  };
}

export async function createEquipment(
  _prevState: EquipmentActionState,
  formData: FormData,
) {
  const payload = {
    name: String(formData.get("name") ?? ""),
    status: String(formData.get("status") ?? "offline"),
    location: String(formData.get("location") ?? ""),
    last_seen: String(formData.get("last_seen") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  };

  const parsed = equipmentSchema.safeParse(payload);
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

  const { error } = await supabase.from("equipment").insert({
    user_id: authData.user.id,
    ...normalizeEquipmentInput(parsed.data),
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateEquipment(
  _prevState: EquipmentActionState,
  formData: FormData,
) {
  const payload = {
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? ""),
    status: String(formData.get("status") ?? "offline"),
    location: String(formData.get("location") ?? ""),
    last_seen: String(formData.get("last_seen") ?? ""),
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
    .from("equipment")
    .update(normalizeEquipmentInput(parsed.data))
    .eq("id", parsed.data.id)
    .eq("user_id", authData.user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteEquipment(
  _prevState: EquipmentActionState,
  formData: FormData,
) {
  const id = String(formData.get("id") ?? "");

  if (!z.string().uuid().safeParse(id).success) {
    return { ok: false, message: "Invalid equipment id." };
  }

  const supabase = await createServerClientWithCookies();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return { ok: false, message: "You must be signed in." };
  }

  const { error } = await supabase
    .from("equipment")
    .delete()
    .eq("id", id)
    .eq("user_id", authData.user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}
