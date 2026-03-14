"use server";

import { revalidatePath } from "next/cache";

import { createServerClientWithCookies } from "@/lib/supabase/server";
import { telemetrySchema } from "@/lib/validation/telemetry";

export type TelemetryActionState = {
  ok: boolean;
  message?: string;
};

export async function createTelemetry(
  _prevState: TelemetryActionState,
  formData: FormData,
) {
  const payload = {
    equipment_id: String(formData.get("equipment_id") ?? ""),
    metric: String(formData.get("metric") ?? ""),
    value: String(formData.get("value") ?? ""),
    unit: String(formData.get("unit") ?? ""),
    recorded_at: String(formData.get("recorded_at") ?? ""),
  };

  const parsed = telemetrySchema.safeParse(payload);
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

  const { error } = await supabase.from("telemetry").insert({
    user_id: authData.user.id,
    equipment_id: parsed.data.equipment_id,
    metric: parsed.data.metric.trim(),
    value: parsed.data.value,
    unit: parsed.data.unit?.trim() || null,
    recorded_at: parsed.data.recorded_at
      ? new Date(parsed.data.recorded_at).toISOString()
      : new Date().toISOString(),
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard/telemetry");
  return { ok: true };
}
