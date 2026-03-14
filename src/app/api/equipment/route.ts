import { NextResponse } from "next/server";

import { createServerClientWithCookies } from "@/lib/supabase/server";
import { equipmentSchema } from "@/lib/validation/equipment";

export async function GET() {
  const supabase = await createServerClientWithCookies();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("equipment")
    .select("id,name,status,location,last_seen,notes,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createServerClientWithCookies();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = equipmentSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  const normalized = {
    name: parsed.data.name.trim(),
    status: parsed.data.status,
    location: parsed.data.location?.trim() || null,
    last_seen: parsed.data.last_seen
      ? new Date(parsed.data.last_seen).toISOString()
      : null,
    notes: parsed.data.notes?.trim() || null,
  };

  const { error } = await supabase.from("equipment").insert({
    user_id: authData.user.id,
    ...normalized,
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
