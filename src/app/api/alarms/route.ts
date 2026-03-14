import { NextResponse } from "next/server";

import { createServerClientWithCookies } from "@/lib/supabase/server";
import { alarmSchema } from "@/lib/validation/alarm";

export async function GET() {
  const supabase = await createServerClientWithCookies();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("alarms")
    .select(
      "id,title,description,severity,status,created_at,acknowledged_at,resolved_at,equipment(name)",
    )
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
  const parsed = alarmSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  const { error } = await supabase.from("alarms").insert({
    user_id: authData.user.id,
    title: parsed.data.title.trim(),
    description: parsed.data.description?.trim() || null,
    severity: parsed.data.severity,
    equipment_id: parsed.data.equipment_id || null,
    status: "active",
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
