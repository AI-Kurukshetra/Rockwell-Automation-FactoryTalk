import Link from "next/link";
import { redirect } from "next/navigation";

import { signIn } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { createServerClientReadOnly } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createServerClientReadOnly();
  const { data: authData } = await supabase.auth.getUser();

  if (authData.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_oklch(0.98_0.02_220),_oklch(1_0_0)_60%)] px-6 py-16">
      <div className="w-full max-w-md space-y-6">
        <AuthForm
          title="Welcome back"
          subtitle="Sign in to monitor and manage your equipment."
          action={signIn}
          submitLabel="Sign in"
          footer={
            <span>
              New here?{" "}
              <Link className="font-medium text-primary" href="/signup">
                Create an account
              </Link>
            </span>
          }
        />
        <div className="text-center text-sm text-muted-foreground">
          <Link className="font-medium text-primary" href="/forgot-password">
            Forgot your password?
          </Link>
        </div>
      </div>
    </main>
  );
}
