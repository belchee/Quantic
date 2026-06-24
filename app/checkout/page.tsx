"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, CheckCircle, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";

export default function CheckoutPage() {
  const { items, total, update, remove, clear } = useCart();
  const { lang } = useLang();
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", address: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const t = {
    title: { sq: "Checkout", en: "Checkout" },
    back: { sq: "Vazhdo blerjen", en: "Continue Shopping" },
    orderSummary: { sq: "Përmbledhja e porosisë", en: "Order Summary" },
    empty: { sq: "Shporta është bosh", en: "Your cart is empty" },
    name: { sq: "Emri dhe mbiemri", en: "Full Name" },
    email: { sq: "Email", en: "Email" },
    phone: { sq: "Numri i telefonit", en: "Phone Number" },
    city: { sq: "Qyteti", en: "City" },
    address: { sq: "Adresa", en: "Address" },
    note: { sq: "Shënime shtesë (opsionale)", en: "Additional notes (optional)" },
    submit: { sq: "Konfirmo porosinë", en: "Place Order" },
    submitting: { sq: "Duke dërguar...", en: "Sending..." },
    total: { sq: "Totali", en: "Total" },
    subtotal: { sq: "Nëntotali", en: "Subtotal" },
    shipping: { sq: "Transport", en: "Shipping" },
    shippingFree: { sq: "Falas", en: "Free" },
    successTitle: { sq: "Porosia u dërgua!", en: "Order Received!" },
    successMsg: { sq: "Faleminderit për porosinë tuaj. Ekipi ynë do t'ju kontaktojë së shpejti për konfirmim.", en: "Thank you for your order. Our team will contact you shortly to confirm." },
    backHome: { sq: "Kthehu në kreu", en: "Back to Home" },
    contactInfo: { sq: "Të dhënat e kontaktit", en: "Contact Information" },
    deliveryInfo: { sq: "Adresa e dorëzimit", en: "Delivery Address" },
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items, total }),
      });
      const data = await res.json();
      if (data.ok) {
        clear();
        setDone(true);
      } else {
        setError(data.error || "Ndodhi një gabim. Provoni përsëri.");
      }
    } catch {
      setError("Ndodhi një gabim. Provoni përsëri.");
    }
    setSubmitting(false);
  }

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-all";

  if (done) {
    return (
      <div className="min-h-screen bg-white pt-[64px] flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3"
            style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {t.successTitle[lang]}
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">{t.successMsg[lang]}</p>
          <Link href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-black transition-colors">
            {t.backHome[lang]}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[64px]">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-10">
        <Link href="/products"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          {t.back[lang]}
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8"
          style={{ fontFamily: "var(--font-space-grotesk)" }}>
          {t.title[lang]}
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-6">{t.empty[lang]}</p>
            <Link href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-colors">
              {t.back[lang]}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
              {/* Contact */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="font-bold text-gray-900 mb-5 text-sm uppercase tracking-widest">{t.contactInfo[lang]}</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t.name[lang]} *</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} required
                        placeholder="Arben Krasniqi" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t.phone[lang]} *</label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} required
                        placeholder="+383 4X XXX XXX" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t.email[lang]} *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required
                      placeholder="email@juaj.com" className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="font-bold text-gray-900 mb-5 text-sm uppercase tracking-widest">{t.deliveryInfo[lang]}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t.city[lang]} *</label>
                    <input type="text" name="city" value={form.city} onChange={handleChange} required
                      placeholder="Prishtinë" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t.address[lang]} *</label>
                    <input type="text" name="address" value={form.address} onChange={handleChange} required
                      placeholder="Rr. ..." className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t.note[lang]}</label>
                    <textarea name="note" value={form.note} onChange={handleChange} rows={3}
                      className={inputClass + " resize-none"} placeholder="..." />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
              )}

              <button type="submit" disabled={submitting}
                className="w-full py-4 bg-gray-900 hover:bg-black disabled:opacity-60 text-white font-bold rounded-xl text-sm transition-colors">
                {submitting ? t.submitting[lang] : t.submit[lang]}
              </button>
            </form>

            {/* Order summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
                <h2 className="font-bold text-gray-900 mb-5 text-sm uppercase tracking-widest">{t.orderSummary[lang]}</h2>

                <ul className="space-y-4 mb-6">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-start gap-3">
                      <div className="w-14 h-14 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center shrink-0">
                        <Image src={item.image || "/placeholder-product.svg"} alt={item.name}
                          width={56} height={56} className="object-contain w-full h-full p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-medium text-xs line-clamp-2 mb-1">{item.name}</p>
                        <p className="text-gray-500 text-xs mb-2">{item.price.toFixed(2)} € × {item.quantity}</p>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => update(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => update(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                          <button onClick={() => remove(item.id)}
                            className="ml-auto p-1 text-gray-300 hover:text-red-500 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-900 font-bold text-sm shrink-0">
                        {(item.price * item.quantity).toFixed(2)} €
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{t.subtotal[lang]}</span>
                    <span className="text-gray-900 font-semibold">{total.toFixed(2)} €</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{t.shipping[lang]}</span>
                    <span className="text-green-600 font-semibold">{t.shippingFree[lang]}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="font-bold text-gray-900">{t.total[lang]}</span>
                    <span className="text-2xl font-bold text-gray-900">{total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
