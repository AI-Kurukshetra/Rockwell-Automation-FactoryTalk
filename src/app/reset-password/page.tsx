import Link from "next/link";
import { redirect } from "next/navigation";

import { updatePassword } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createServerClientReadOnly } from "@/lib/supabase/server";

export default async function ResetPasswordPage() {
  const supabase = await createServerClientReadOnly();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_oklch(0.98_0.02_220),_oklch(1_0_0)_60%)] px-6 py-16">
      <div className="w-full max-w-md space-y-6">
        <Button asChild variant="ghost">
          <Link href="/login">← Back to login</Link>
        </Button>
        <form
          action={updatePassword}
          className="grid gap-4 rounded-3xl border border-border/70 bg-card/80 p-8 shadow-lg"
        >
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Set new password</h1>
            <p className="text-sm text-muted-foreground">
              Choose a strong password for your account.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">New password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" name="confirm" type="password" required />
          </div>
          <Button type="submit">Update password</Button>
        </form>
      </div>
    </main>
  );
}
