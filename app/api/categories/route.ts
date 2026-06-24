import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase.from("categories").select("*").order("value");
  if (error) return NextResponse.json([], { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { error } = await supabaseAdmin.from("categories").upsert(body, { onConflict: "value" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { value } = await req.json();
  const { error } = await supabaseAdmin.from("categories").delete().eq("value", value);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
