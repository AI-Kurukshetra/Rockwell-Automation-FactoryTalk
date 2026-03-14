"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createServerClientWithCookies } from "@/lib/supabase/server";
import { scadaConnectionSchema } from "@/lib/validation/scada";

const updateSchema = scadaConnectionSchema.extend({
  id: z.string().uuid("Invalid SCADA connection id."),
});

export type ScadaActionState = {
  ok: boolean;
  message?: string;
};

function toIsoOrNull(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function normalizeScadaInput(data: z.infer<typeof scadaConnectionSchema>) {
  return {
    name: data.name.trim(),
    protocol: data.protocol,
    endpoint: data.endpoint.trim(),
    status: data.status,
    last_sync: toIsoOrNull(data.last_sync),
    notes: data.notes?.trim() || null,
  };
}

export async function createScadaConnection(
  _prevState: ScadaActionState,
  formData: FormData,
) {
  const payload = {
    name: String(formData.get("name") ?? ""),
    protocol: String(formData.get("protocol") ?? "opc_ua"),
    endpoint: String(formData.get("endpoint") ?? ""),
    status: String(formData.get("status") ?? "offline"),
    last_sync: String(formData.get("last_sync") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  };

  const parsed = scadaConnectionSchema.safeParse(payload);
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

  const { error } = await supabase.from("scada_connections").insert({
    user_id: authData.user.id,
    ...normalizeScadaInput(parsed.data),
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateScadaConnection(
  _prevState: ScadaActionState,
  formData: FormData,
) {
  const payload = {
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? ""),
    protocol: String(formData.get("protocol") ?? "opc_ua"),
    endpoint: String(formData.get("endpoint") ?? ""),
    status: String(formData.get("status") ?? "offline"),
    last_sync: String(formData.get("last_sync") ?? ""),
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
    .from("scada_connections")
    .update(normalizeScadaInput(parsed.data))
    .eq("id", parsed.data.id)
    .eq("user_id", authData.user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteScadaConnection(
  _prevState: ScadaActionState,
  formData: FormData,
) {
  const id = String(formData.get("id") ?? "");

  if (!z.string().uuid().safeParse(id).success) {
    return { ok: false, message: "Invalid SCADA connection id." };
  }

  const supabase = await createServerClientWithCookies();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return { ok: false, message: "You must be signed in." };
  }

  const { error } = await supabase
    .from("scada_connections")
    .delete()
    .eq("id", id)
    .eq("user_id", authData.user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}
