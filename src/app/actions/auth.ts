"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";

import { createServerClientWithCookies } from "@/lib/supabase/server";

const authSchema = z.object({
  email: z.string().trim().email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type AuthActionState = {
  ok: boolean;
  message?: string;
};

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData,
) {
  const payload = {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = authSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const supabase = await createServerClientWithCookies();
  const { error } = await supabase.auth.signUp(parsed.data);

  if (error) {
    return { ok: false, message: error.message };
  }

  redirect("/dashboard");
}

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData,
) {
  const payload = {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = authSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const supabase = await createServerClientWithCookies();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { ok: false, message: error.message };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createServerClientWithCookies();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function sendPasswordReset(
  arg1: AuthActionState | FormData,
  arg2?: FormData,
) {
  const formData = arg1 instanceof FormData ? arg1 : arg2;
  if (!formData) {
    return { ok: false, message: "Invalid submission." };
  }
  const email = String(formData.get("email") ?? "").trim();
  const parsed = z.string().email("Enter a valid email.").safeParse(email);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message };
  }

  const headerList = await headers();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
    headerList.get("origin");

  if (!origin) {
    return {
      ok: false,
      message:
        "Missing site URL. Set NEXT_PUBLIC_SITE_URL (or VERCEL_URL) and retry.",
    };
  }

  const redirectUrl = new URL("/auth/callback", origin);
  redirectUrl.searchParams.set("next", "/reset-password");

  const supabase = await createServerClientWithCookies();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: redirectUrl.toString(),
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  redirect("/forgot-password/sent");
}

export async function updatePassword(
  arg1: AuthActionState | FormData,
  arg2?: FormData,
) {
  const formData = arg1 instanceof FormData ? arg1 : arg2;
  if (!formData) {
    return { ok: false, message: "Invalid submission." };
  }
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) {
    return { ok: false, message: "Password must be at least 8 characters." };
  }
  if (password !== confirm) {
    return { ok: false, message: "Passwords do not match." };
  }

  const supabase = await createServerClientWithCookies();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { ok: false, message: error.message };
  }

  redirect("/reset-password/success");
}
