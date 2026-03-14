"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createServerClientWithCookies } from "@/lib/supabase/server";
import { qualityRecordSchema } from "@/lib/validation/quality";

const updateSchema = qualityRecordSchema.extend({
  id: z.string().uuid("Invalid quality record id."),
});

export type QualityActionState = {
  ok: boolean;
  message?: string;
};

function toIsoOrNull(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function normalizeQualityInput(data: z.infer<typeof qualityRecordSchema>) {
  return {
    record_number: data.record_number.trim(),
    product_name: data.product_name.trim(),
    line: data.line.trim(),
    status: data.status,
    defect_type: data.defect_type?.trim() || null,
    defect_count: data.defect_count ?? 0,
    inspected_at: toIsoOrNull(data.inspected_at),
    notes: data.notes?.trim() || null,
  };
}

export async function createQualityRecord(
  _prevState: QualityActionState,
  formData: FormData,
) {
  const payload = {
    record_number: String(formData.get("record_number") ?? ""),
    product_name: String(formData.get("product_name") ?? ""),
    line: String(formData.get("line") ?? ""),
    status: String(formData.get("status") ?? "pass"),
    defect_type: String(formData.get("defect_type") ?? ""),
    defect_count: String(formData.get("defect_count") ?? "0"),
    inspected_at: String(formData.get("inspected_at") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  };

  const parsed = qualityRecordSchema.safeParse(payload);
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

  const { error } = await supabase.from("quality_records").insert({
    user_id: authData.user.id,
    ...normalizeQualityInput(parsed.data),
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateQualityRecord(
  _prevState: QualityActionState,
  formData: FormData,
) {
  const payload = {
    id: String(formData.get("id") ?? ""),
    record_number: String(formData.get("record_number") ?? ""),
    product_name: String(formData.get("product_name") ?? ""),
    line: String(formData.get("line") ?? ""),
    status: String(formData.get("status") ?? "pass"),
    defect_type: String(formData.get("defect_type") ?? ""),
    defect_count: String(formData.get("defect_count") ?? "0"),
    inspected_at: String(formData.get("inspected_at") ?? ""),
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
    .from("quality_records")
    .update(normalizeQualityInput(parsed.data))
    .eq("id", parsed.data.id)
    .eq("user_id", authData.user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteQualityRecord(
  _prevState: QualityActionState,
  formData: FormData,
) {
  const id = String(formData.get("id") ?? "");

  if (!z.string().uuid().safeParse(id).success) {
    return { ok: false, message: "Invalid quality record id." };
  }

  const supabase = await createServerClientWithCookies();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return { ok: false, message: "You must be signed in." };
  }

  const { error } = await supabase
    .from("quality_records")
    .delete()
    .eq("id", id)
    .eq("user_id", authData.user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}
