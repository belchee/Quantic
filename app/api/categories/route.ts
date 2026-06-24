import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "categories.json");

function read() {
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

export async function GET() {
  return NextResponse.json(read());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const cats = read();
  const idx = cats.findIndex((c: { value: string }) => c.value === body.value);
  if (idx >= 0) cats[idx] = body;
  else cats.push(body);
  fs.writeFileSync(FILE, JSON.stringify(cats, null, 2));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { value } = await req.json();
  const cats = read().filter((c: { value: string }) => c.value !== value);
  fs.writeFileSync(FILE, JSON.stringify(cats, null, 2));
  return NextResponse.json({ ok: true });
}
