import { NextResponse } from "next/server";
import { z } from "zod";

import { createServerClientWithCookies } from "@/lib/supabase/server";
import { equipmentSchema } from "@/lib/validation/equipment";

const idSchema = z.string().uuid();
const updateSchema = equipmentSchema.partial();

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const parsedId = idSchema.safeParse(params.id);
  if (!parsedId.success) {
    return NextResponse.json({ message: "Invalid id." }, { status: 400 });
  }

  const supabase = await createServerClientWithCookies();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("equipment")
    .select("id,name,status,location,last_seen,notes,created_at")
    .eq("id", parsedId.data)
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const parsedId = idSchema.safeParse(params.id);
  if (!parsedId.success) {
    return NextResponse.json({ message: "Invalid id." }, { status: 400 });
  }

  const supabase = await createServerClientWithCookies();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  const updates: Record<string, string | null> = {};

  if (parsed.data.name !== undefined) {
    updates.name = parsed.data.name.trim();
  }
  if (parsed.data.status !== undefined) {
    updates.status = parsed.data.status;
  }
  if (parsed.data.location !== undefined) {
    updates.location = parsed.data.location?.trim() || null;
  }
  if (parsed.data.last_seen !== undefined) {
    updates.last_seen = parsed.data.last_seen
      ? new Date(parsed.data.last_seen).toISOString()
      : null;
  }
  if (parsed.data.notes !== undefined) {
    updates.notes = parsed.data.notes?.trim() || null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { message: "No fields to update." },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from("equipment")
    .update(updates)
    .eq("id", parsedId.data)
    .eq("user_id", authData.user.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const parsedId = idSchema.safeParse(params.id);
  if (!parsedId.success) {
    return NextResponse.json({ message: "Invalid id." }, { status: 400 });
  }

  const supabase = await createServerClientWithCookies();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("equipment")
    .delete()
    .eq("id", parsedId.data)
    .eq("user_id", authData.user.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
