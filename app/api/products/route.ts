import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "products.json");

async function readProducts() {
  const raw = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(raw);
}

async function writeProducts(products: unknown[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2));
}

export async function GET() {
  const products = await readProducts();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const products = await readProducts();
  const newProduct = { ...body, id: body.id || body.model.toLowerCase().replace(/[^a-z0-9]/g, "-") };
  const idx = products.findIndex((p: { id: string }) => p.id === newProduct.id);
  if (idx >= 0) {
    products[idx] = newProduct;
  } else {
    products.push(newProduct);
  }
  await writeProducts(products);
  return NextResponse.json(newProduct);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const products = await readProducts();
  const filtered = products.filter((p: { id: string }) => p.id !== id);
  await writeProducts(filtered);
  return NextResponse.json({ ok: true });
}
