import { NextResponse } from "next/server";
import { z } from "zod";

import { createServerClientWithCookies } from "@/lib/supabase/server";

const idSchema = z.string().uuid();

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const parsedId = idSchema.safeParse(params.id);
  if (!parsedId.success) {
    return NextResponse.json({ message: "Invalid id." }, { status: 400 });
  }

  const payload = await request.json().catch(() => null);
  if (!payload || !payload.status) {
    return NextResponse.json({ message: "Missing status." }, { status: 400 });
  }

  const supabase = await createServerClientWithCookies();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const status = String(payload.status);
  const updates: Record<string, string | null> = { status };

  if (status === "acknowledged") {
    updates.acknowledged_at = new Date().toISOString();
  }
  if (status === "resolved") {
    updates.resolved_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("alarms")
    .update(updates)
    .eq("id", parsedId.data)
    .eq("user_id", authData.user.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
