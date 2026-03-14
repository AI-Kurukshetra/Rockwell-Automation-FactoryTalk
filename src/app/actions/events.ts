"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createServerClientWithCookies } from "@/lib/supabase/server";
import { eventLogSchema } from "@/lib/validation/event";

const updateSchema = eventLogSchema.extend({
  id: z.string().uuid("Invalid event id."),
});

export type EventActionState = {
  ok: boolean;
  message?: string;
};

function toIsoOrNull(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function normalizeEventInput(data: z.infer<typeof eventLogSchema>) {
  return {
    title: data.title.trim(),
    type: data.type,
    severity: data.severity,
    actor: data.actor?.trim() || null,
    details: data.details?.trim() || null,
    occurred_at: toIsoOrNull(data.occurred_at),
  };
}

export async function createEventLog(
  _prevState: EventActionState,
  formData: FormData,
) {
  const payload = {
    title: String(formData.get("title") ?? ""),
    type: String(formData.get("type") ?? "system"),
    severity: String(formData.get("severity") ?? "info"),
    actor: String(formData.get("actor") ?? ""),
    details: String(formData.get("details") ?? ""),
    occurred_at: String(formData.get("occurred_at") ?? ""),
  };

  const parsed = eventLogSchema.safeParse(payload);
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

  const { error } = await supabase.from("event_logs").insert({
    user_id: authData.user.id,
    ...normalizeEventInput(parsed.data),
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateEventLog(
  _prevState: EventActionState,
  formData: FormData,
) {
  const payload = {
    id: String(formData.get("id") ?? ""),
    title: String(formData.get("title") ?? ""),
    type: String(formData.get("type") ?? "system"),
    severity: String(formData.get("severity") ?? "info"),
    actor: String(formData.get("actor") ?? ""),
    details: String(formData.get("details") ?? ""),
    occurred_at: String(formData.get("occurred_at") ?? ""),
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
    .from("event_logs")
    .update(normalizeEventInput(parsed.data))
    .eq("id", parsed.data.id)
    .eq("user_id", authData.user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteEventLog(
  _prevState: EventActionState,
  formData: FormData,
) {
  const id = String(formData.get("id") ?? "");

  if (!z.string().uuid().safeParse(id).success) {
    return { ok: false, message: "Invalid event id." };
  }

  const supabase = await createServerClientWithCookies();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return { ok: false, message: "You must be signed in." };
  }

  const { error } = await supabase
    .from("event_logs")
    .delete()
    .eq("id", id)
    .eq("user_id", authData.user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}
