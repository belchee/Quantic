import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, city, address, note, items, total } = body;

  if (!name || !email || !phone || !city || !address || !items?.length) {
    return NextResponse.json({ ok: false, error: "Të dhënat janë të pakompletuara" }, { status: 400 });
  }

  // Save to Supabase
  const { data: order, error: dbError } = await getSupabase()
    .from("orders")
    .insert({
      name,
      email,
      phone,
      city,
      address,
      note: note || null,
      items,
      total,
      status: "pending",
    })
    .select()
    .single();

  if (dbError) {
    console.error("Supabase error:", dbError);
    return NextResponse.json({ ok: false, error: "Gabim gjatë ruajtjes së porosisë" }, { status: 500 });
  }

  // Build email HTML
  const itemRows = items.map((item: OrderItem) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#1e293b;">${item.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#64748b;text-align:center;">${item.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#1e293b;text-align:right;font-weight:600;">${(item.price * item.quantity).toFixed(2)} €</td>
    </tr>
  `).join("");

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="background:#0f172a;padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;letter-spacing:-0.5px;">Porosi e re — Quantic SHPK</h1>
        </div>
        <div style="padding:32px;">
          <div style="background:#f8fafc;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #e2e8f0;">
            <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#64748b;">Të dhënat e klientit</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:4px 0;font-size:13px;color:#64748b;width:120px;">Emri:</td><td style="padding:4px 0;font-size:13px;color:#1e293b;font-weight:600;">${name}</td></tr>
              <tr><td style="padding:4px 0;font-size:13px;color:#64748b;">Telefoni:</td><td style="padding:4px 0;font-size:13px;color:#1e293b;font-weight:600;">${phone}</td></tr>
              <tr><td style="padding:4px 0;font-size:13px;color:#64748b;">Email:</td><td style="padding:4px 0;font-size:13px;color:#1e293b;">${email}</td></tr>
              <tr><td style="padding:4px 0;font-size:13px;color:#64748b;">Qyteti:</td><td style="padding:4px 0;font-size:13px;color:#1e293b;">${city}</td></tr>
              <tr><td style="padding:4px 0;font-size:13px;color:#64748b;">Adresa:</td><td style="padding:4px 0;font-size:13px;color:#1e293b;">${address}</td></tr>
              ${note ? `<tr><td style="padding:4px 0;font-size:13px;color:#64748b;">Shënim:</td><td style="padding:4px 0;font-size:13px;color:#1e293b;">${note}</td></tr>` : ""}
            </table>
          </div>

          <h2 style="margin:0 0 12px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#64748b;">Produktet e porositura</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <thead>
              <tr style="background:#f8fafc;">
                <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;color:#94a3b8;border-bottom:2px solid #e2e8f0;">Produkti</th>
                <th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;color:#94a3b8;border-bottom:2px solid #e2e8f0;">Sasia</th>
                <th style="padding:10px 12px;text-align:right;font-size:11px;font-weight:700;text-transform:uppercase;color:#94a3b8;border-bottom:2px solid #e2e8f0;">Çmimi</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>

          <div style="background:#0f172a;border-radius:12px;padding:20px;display:flex;justify-content:space-between;align-items:center;">
            <span style="color:#94a3b8;font-size:14px;font-weight:600;">TOTALI</span>
            <span style="color:#fff;font-size:24px;font-weight:800;">${total.toFixed(2)} €</span>
          </div>

          <div style="margin-top:24px;padding:16px;background:#f0fdf4;border-radius:12px;border:1px solid #bbf7d0;">
            <p style="margin:0;font-size:13px;color:#166534;">Kontaktoni klientin me telefon: <strong>${phone}</strong> për konfirmim.</p>
          </div>
        </div>
        <div style="padding:20px 32px;background:#f8fafc;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">Quantic SHPK · quantic-ks.net · +383 45 460 460</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Send email notification
  try {
    await getResend().emails.send({
      from: "Quantic Web <onboarding@resend.dev>",
      to: process.env.ORDER_NOTIFY_EMAIL!,
      subject: `Porosi e re nga ${name} — ${total.toFixed(2)} €`,
      html: emailHtml,
    });
  } catch (emailError) {
    // Email failure shouldn't fail the order
    console.error("Email error:", emailError);
  }

  return NextResponse.json({ ok: true, orderId: order?.id });
}

export async function GET() {
  const { data, error } = await getSupabase()
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  const { error } = await getSupabase().from("orders").update({ status }).eq("id", id);
  if (error) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const { error } = await getSupabase().from("orders").delete().eq("id", id);
  if (error) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true });
}
