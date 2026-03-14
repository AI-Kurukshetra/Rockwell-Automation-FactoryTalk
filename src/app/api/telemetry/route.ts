import { NextResponse } from "next/server";

import { createServerClientWithCookies } from "@/lib/supabase/server";
import { telemetrySchema } from "@/lib/validation/telemetry";

export async function GET() {
  const supabase = await createServerClientWithCookies();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("telemetry")
    .select("id,metric,value,unit,recorded_at,equipment(name)")
    .order("recorded_at", { ascending: false })
    .limit(200);

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
  const parsed = telemetrySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  const { error } = await supabase.from("telemetry").insert({
    user_id: authData.user.id,
    equipment_id: parsed.data.equipment_id,
    metric: parsed.data.metric.trim(),
    value: parsed.data.value,
    unit: parsed.data.unit?.trim() || null,
    recorded_at: parsed.data.recorded_at
      ? new Date(parsed.data.recorded_at).toISOString()
      : new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
