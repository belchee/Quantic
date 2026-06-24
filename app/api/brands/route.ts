import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "brands.json");

function read() {
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

export async function GET() {
  return NextResponse.json(read());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const brands = read();
  const idx = brands.findIndex((b: { name: string }) => b.name === body.name);
  if (idx >= 0) brands[idx] = body;
  else brands.push(body);
  fs.writeFileSync(FILE, JSON.stringify(brands, null, 2));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { name } = await req.json();
  const brands = read().filter((b: { name: string }) => b.name !== name);
  fs.writeFileSync(FILE, JSON.stringify(brands, null, 2));
  return NextResponse.json({ ok: true });
}
