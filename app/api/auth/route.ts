import { NextRequest, NextResponse } from "next/server";

const ADMIN_USER = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASS = process.env.ADMIN_PASSWORD ?? "admin";
const VALID_TOKEN = "qs-admin-token-v2";

export async function POST(req: NextRequest) {
  const { action, username, password, token } = await req.json();

  if (action === "login") {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      return NextResponse.json({ ok: true, token: VALID_TOKEN });
    }
    return NextResponse.json({ ok: false, error: "Kredencialet janë gabim" }, { status: 401 });
  }

  if (action === "verify") {
    return NextResponse.json({ ok: token === VALID_TOKEN });
  }

  return NextResponse.json({ ok: false }, { status: 400 });
}
