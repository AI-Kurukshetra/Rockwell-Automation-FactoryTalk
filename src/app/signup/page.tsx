import Link from "next/link";
import { redirect } from "next/navigation";

import { signUp } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { createServerClientReadOnly } from "@/lib/supabase/server";

export default async function SignupPage() {
  const supabase = await createServerClientReadOnly();
  const { data: authData } = await supabase.auth.getUser();

  if (authData.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_oklch(0.98_0.02_220),_oklch(1_0_0)_60%)] px-6 py-16">
      <div className="w-full max-w-md space-y-6">
        <Button asChild variant="ghost">
          <Link href="/">← Back to home</Link>
        </Button>
        <AuthForm
          title="Create your account"
          subtitle="Start tracking equipment health in minutes."
          action={signUp}
          submitLabel="Create account"
          footer={
            <span>
              Already have an account?{" "}
              <Link className="font-medium text-primary" href="/login">
                Sign in
              </Link>
            </span>
          }
        />
      </div>
    </main>
  );
}
