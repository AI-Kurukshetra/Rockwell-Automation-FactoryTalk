import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ForgotPasswordSentPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_oklch(0.98_0.02_220),_oklch(1_0_0)_60%)] px-6 py-16">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-border/70 bg-card/80 p-8 text-center shadow-lg">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            We sent a password reset link. Open it to continue.
          </p>
        </div>
        <Button asChild>
          <Link href="/login">Back to login</Link>
        </Button>
      </div>
    </main>
  );
}
