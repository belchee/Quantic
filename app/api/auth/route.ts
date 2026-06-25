import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";
import { randomBytes } from "crypto";

function makeToken() {
  return randomBytes(32).toString("hex");
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body;

  if (action === "login") {
    const { username, password } = body;
    const { data: user } = await supabaseAdmin
      .from("admin_users")
      .select("id, username, password_hash, role")
      .eq("username", username)
      .single();

    if (!user) {
      return NextResponse.json({ ok: false, error: "Kredencialet janë gabim" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ ok: false, error: "Kredencialet janë gabim" }, { status: 401 });
    }

    const token = makeToken();
    await supabaseAdmin.from("admin_users").update({ session_token: token }).eq("id", user.id);

    return NextResponse.json({ ok: true, token, username: user.username, role: user.role });
  }

  if (action === "verify") {
    const { token } = body;
    if (!token) return NextResponse.json({ ok: false });
    const { data: user } = await supabaseAdmin
      .from("admin_users")
      .select("id, username, role")
      .eq("session_token", token)
      .single();
    if (!user) return NextResponse.json({ ok: false });
    return NextResponse.json({ ok: true, username: user.username, role: user.role });
  }

  if (action === "logout") {
    const { token } = body;
    if (token) {
      await supabaseAdmin.from("admin_users").update({ session_token: null }).eq("session_token", token);
    }
    return NextResponse.json({ ok: true });
  }

  if (action === "change-password") {
    const { token, password, newPassword } = body;
    if (!token) return NextResponse.json({ ok: false, error: "Nuk jeni i kyçur" }, { status: 401 });
    const { data: user } = await supabaseAdmin
      .from("admin_users")
      .select("id, password_hash")
      .eq("session_token", token)
      .single();
    if (!user) return NextResponse.json({ ok: false, error: "Sesioni ka skaduar" }, { status: 401 });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return NextResponse.json({ ok: false, error: "Fjalëkalimi aktual është gabim" }, { status: 401 });
    const hash = await bcrypt.hash(newPassword, 12);
    await supabaseAdmin.from("admin_users").update({ password_hash: hash }).eq("id", user.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false }, { status: 400 });
}
