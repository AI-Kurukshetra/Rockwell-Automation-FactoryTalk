"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const supabase = createClient();
    const next = searchParams.get("next") ?? "/reset-password";
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : "";
    const hashParams = new URLSearchParams(hash);

    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    const code = searchParams.get("code");

    const run = async () => {
      if (accessToken && refreshToken) {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      } else if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }

      window.location.replace(next);
    };

    void run();
  }, [searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_oklch(0.98_0.02_220),_oklch(1_0_0)_60%)] px-6 py-16">
      <div className="w-full max-w-md space-y-4 rounded-3xl border border-border/70 bg-card/80 p-8 text-center shadow-lg">
        <h1 className="text-2xl font-semibold">Preparing secure session</h1>
        <p className="text-sm text-muted-foreground">
          Redirecting you to reset your password.
        </p>
      </div>
    </main>
  );
}
