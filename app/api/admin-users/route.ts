import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";

async function requireSuperAdmin(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (!token) return null;
  const { data } = await supabaseAdmin
    .from("admin_users")
    .select("id, username, role")
    .eq("session_token", token)
    .single();
  if (!data || data.role !== "superadmin") return null;
  return data;
}

export async function GET(req: NextRequest) {
  const caller = await requireSuperAdmin(req);
  if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data } = await supabaseAdmin
    .from("admin_users")
    .select("id, username, role, created_at")
    .order("created_at", { ascending: true });

  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const caller = await requireSuperAdmin(req);
  if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { username, password, role } = await req.json();
  if (!username || !password) return NextResponse.json({ error: "Username and password required" }, { status: 400 });
  if (!["admin", "superadmin"].includes(role ?? "admin")) return NextResponse.json({ error: "Invalid role" }, { status: 400 });

  const hash = await bcrypt.hash(password, 12);
  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .insert({ username, password_hash: hash, role: role ?? "admin" })
    .select("id, username, role, created_at")
    .single();

  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "Username already exists" }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const caller = await requireSuperAdmin(req);
  if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const { data: target } = await supabaseAdmin.from("admin_users").select("role").eq("id", id).single();
  if (target?.role === "superadmin") return NextResponse.json({ error: "Cannot delete superadmin" }, { status: 400 });

  const { error } = await supabaseAdmin.from("admin_users").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const caller = await requireSuperAdmin(req);
  if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, password } = await req.json();
  if (!id || !password) return NextResponse.json({ error: "ID and password required" }, { status: 400 });

  const hash = await bcrypt.hash(password, 12);
  const { error } = await supabaseAdmin.from("admin_users").update({ password_hash: hash }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
