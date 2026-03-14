"use client";

import { type ReactNode, useActionState } from "react";

import type { AuthActionState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthFormProps = {
  title: string;
  subtitle: string;
  action: (formData: FormData) => Promise<AuthActionState | void>;
  submitLabel: string;
  footer: ReactNode;
};

const initialState: AuthActionState = { ok: true };

export function AuthForm({
  title,
  subtitle,
  action,
  submitLabel,
  footer,
}: AuthFormProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: AuthActionState | void, formData: FormData) => action(formData),
    initialState,
  );

  return (
    <form
      action={formAction}
      className="grid gap-4 rounded-3xl border border-border/70 bg-card/80 p-8 shadow-lg"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      {state && "message" in state && state.message ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      ) : null}

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
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Working..." : submitLabel}
      </Button>

      <div className="text-center text-sm text-muted-foreground">{footer}</div>
    </form>
  );
}
