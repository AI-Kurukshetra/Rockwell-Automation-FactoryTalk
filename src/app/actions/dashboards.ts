"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createServerClientWithCookies } from "@/lib/supabase/server";
import { dashboardSchema, widgetSchema } from "@/lib/validation/dashboard";

const updateDashboardSchema = dashboardSchema.extend({
  id: z.string().uuid("Invalid dashboard id."),
});

const updateWidgetSchema = widgetSchema.extend({
  id: z.string().uuid("Invalid widget id."),
});

export type DashboardActionState = {
  ok: boolean;
  message?: string;
};

function normalizeDashboardInput(data: z.infer<typeof dashboardSchema>) {
  return {
    name: data.name.trim(),
    description: data.description?.trim() || null,
  };
}

function normalizeWidgetInput(data: z.infer<typeof widgetSchema>) {
  return {
    title: data.title.trim(),
    type: data.type,
    config: data.config?.trim() || null,
    position: data.position?.trim() || null,
  };
}

export async function createDashboard(
  _prevState: DashboardActionState,
  formData: FormData,
) {
  const payload = {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
  };

  const parsed = dashboardSchema.safeParse(payload);
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

  const { error } = await supabase.from("dashboards").insert({
    user_id: authData.user.id,
    ...normalizeDashboardInput(parsed.data),
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateDashboard(
  _prevState: DashboardActionState,
  formData: FormData,
) {
  const payload = {
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
  };

  const parsed = updateDashboardSchema.safeParse(payload);
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
    .from("dashboards")
    .update(normalizeDashboardInput(parsed.data))
    .eq("id", parsed.data.id)
    .eq("user_id", authData.user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteDashboard(
  _prevState: DashboardActionState,
  formData: FormData,
) {
  const id = String(formData.get("id") ?? "");

  if (!z.string().uuid().safeParse(id).success) {
    return { ok: false, message: "Invalid dashboard id." };
  }

  const supabase = await createServerClientWithCookies();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return { ok: false, message: "You must be signed in." };
  }

  const { error } = await supabase
    .from("dashboards")
    .delete()
    .eq("id", id)
    .eq("user_id", authData.user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function createWidget(
  _prevState: DashboardActionState,
  formData: FormData,
) {
  const payload = {
    title: String(formData.get("title") ?? ""),
    type: String(formData.get("type") ?? "kpi"),
    config: String(formData.get("config") ?? ""),
    position: String(formData.get("position") ?? ""),
  };
  const dashboardId = String(formData.get("dashboard_id") ?? "");

  if (!z.string().uuid().safeParse(dashboardId).success) {
    return { ok: false, message: "Invalid dashboard id." };
  }

  const parsed = widgetSchema.safeParse(payload);
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

  const { error } = await supabase.from("dashboard_widgets").insert({
    user_id: authData.user.id,
    dashboard_id: dashboardId,
    ...normalizeWidgetInput(parsed.data),
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath(`/dashboard/dashboards/${dashboardId}`);
  return { ok: true };
}

export async function updateWidget(
  _prevState: DashboardActionState,
  formData: FormData,
) {
  const payload = {
    id: String(formData.get("id") ?? ""),
    title: String(formData.get("title") ?? ""),
    type: String(formData.get("type") ?? "kpi"),
    config: String(formData.get("config") ?? ""),
    position: String(formData.get("position") ?? ""),
  };
  const dashboardId = String(formData.get("dashboard_id") ?? "");

  if (!z.string().uuid().safeParse(dashboardId).success) {
    return { ok: false, message: "Invalid dashboard id." };
  }

  const parsed = updateWidgetSchema.safeParse(payload);
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
    .from("dashboard_widgets")
    .update(normalizeWidgetInput(parsed.data))
    .eq("id", parsed.data.id)
    .eq("user_id", authData.user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath(`/dashboard/dashboards/${dashboardId}`);
  return { ok: true };
}

export async function deleteWidget(
  _prevState: DashboardActionState,
  formData: FormData,
) {
  const id = String(formData.get("id") ?? "");
  const dashboardId = String(formData.get("dashboard_id") ?? "");

  if (!z.string().uuid().safeParse(id).success) {
    return { ok: false, message: "Invalid widget id." };
  }
  if (!z.string().uuid().safeParse(dashboardId).success) {
    return { ok: false, message: "Invalid dashboard id." };
  }

  const supabase = await createServerClientWithCookies();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return { ok: false, message: "You must be signed in." };
  }

  const { error } = await supabase
    .from("dashboard_widgets")
    .delete()
    .eq("id", id)
    .eq("user_id", authData.user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath(`/dashboard/dashboards/${dashboardId}`);
  return { ok: true };
}
