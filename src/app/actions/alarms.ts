"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createServerClientWithCookies } from "@/lib/supabase/server";
import { alarmSchema } from "@/lib/validation/alarm";

const idSchema = z.string().uuid("Invalid alarm id.");

export type AlarmActionState = {
  ok: boolean;
  message?: string;
};

export async function createAlarm(
  _prevState: AlarmActionState,
  formData: FormData,
) {
  const payload = {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    severity: String(formData.get("severity") ?? "medium"),
    equipment_id: String(formData.get("equipment_id") ?? ""),
  };

  const parsed = alarmSchema.safeParse(payload);
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

  const { error } = await supabase.from("alarms").insert({
    user_id: authData.user.id,
    title: parsed.data.title.trim(),
    description: parsed.data.description?.trim() || null,
    severity: parsed.data.severity,
    equipment_id: parsed.data.equipment_id || null,
    status: "active",
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard/alarms");
  return { ok: true };
}

export async function acknowledgeAlarm(
  _prevState: AlarmActionState,
  formData: FormData,
) {
  const id = String(formData.get("id") ?? "");
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message };
  }

  const supabase = await createServerClientWithCookies();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return { ok: false, message: "You must be signed in." };
  }

  const { error } = await supabase
    .from("alarms")
    .update({ status: "acknowledged", acknowledged_at: new Date().toISOString() })
    .eq("id", parsed.data)
    .eq("user_id", authData.user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard/alarms");
  return { ok: true };
}

export async function resolveAlarm(
  _prevState: AlarmActionState,
  formData: FormData,
) {
  const id = String(formData.get("id") ?? "");
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message };
  }

  const supabase = await createServerClientWithCookies();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return { ok: false, message: "You must be signed in." };
  }

  const { error } = await supabase
    .from("alarms")
    .update({ status: "resolved", resolved_at: new Date().toISOString() })
    .eq("id", parsed.data)
    .eq("user_id", authData.user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard/alarms");
  return { ok: true };
}
