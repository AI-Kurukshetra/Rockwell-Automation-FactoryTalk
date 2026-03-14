import Link from "next/link";

import { sendPasswordReset } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  async function handleReset(formData: FormData) {
    "use server";
    await sendPasswordReset(formData);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_oklch(0.98_0.02_220),_oklch(1_0_0)_60%)] px-6 py-16">
      <div className="w-full max-w-md space-y-6">
        <Button asChild variant="ghost">
          <Link href="/login">← Back to login</Link>
        </Button>
        <form
          action={handleReset}
          className="grid gap-4 rounded-3xl border border-border/70 bg-card/80 p-8 shadow-lg"
        >
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Reset your password</h1>
            <p className="text-sm text-muted-foreground">
              We’ll email you a secure reset link.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@factory.com"
              required
            />
          </div>
          <Button type="submit">Send reset link</Button>
        </form>
      </div>
    </main>
  );
}
