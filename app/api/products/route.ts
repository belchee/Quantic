import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json([], { status: 500 });
  return NextResponse.json((data ?? []).map(toClient));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const row = toRow(body);
  const { data, error } = await supabaseAdmin
    .from("products")
    .upsert(row, { onConflict: "id" })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(toClient(data));
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

function toRow(p: Record<string, unknown>) {
  return {
    id: p.id || String(p.model).toLowerCase().replace(/[^a-z0-9]/g, "-"),
    name: p.name,
    model: p.model,
    category: p.category,
    brand: p.brand ?? "",
    price: p.price,
    original_price: p.originalPrice ?? null,
    image: p.image ?? "",
    short_desc: p.shortDesc ?? "",
    specs: p.specs ?? [],
    in_stock: p.inStock ?? true,
  };
}

function toClient(r: Record<string, unknown>) {
  return {
    id: r.id,
    name: r.name,
    model: r.model,
    category: r.category,
    brand: r.brand ?? "",
    price: r.price,
    originalPrice: r.original_price ?? undefined,
    image: r.image,
    shortDesc: r.short_desc,
    specs: r.specs,
    inStock: r.in_stock,
  };
}
