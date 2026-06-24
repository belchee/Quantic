import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const AUTH_FILE = path.join(process.cwd(), "data", "auth.json");

function readAuth() {
  return JSON.parse(fs.readFileSync(AUTH_FILE, "utf-8"));
}

export async function POST(req: NextRequest) {
  const { action, username, password, newPassword } = await req.json();

  if (action === "login") {
    const auth = readAuth();
    if (username === auth.username && password === auth.password) {
      return NextResponse.json({ ok: true, token: "qs-admin-token" });
    }
    return NextResponse.json({ ok: false, error: "Kredencialet janë gabim" }, { status: 401 });
  }

  if (action === "change-password") {
    const auth = readAuth();
    if (password !== auth.password) {
      return NextResponse.json({ ok: false, error: "Fjalëkalimi aktual është gabim" }, { status: 401 });
    }
    auth.password = newPassword;
    fs.writeFileSync(AUTH_FILE, JSON.stringify(auth, null, 2));
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false }, { status: 400 });
}
