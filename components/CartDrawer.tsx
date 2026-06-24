"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";

export default function CartDrawer() {
  const { items, open, setOpen, remove, update, total, count } = useCart();
  const { lang } = useLang();

  const t = {
    title: { sq: "Shporta", en: "Cart" },
    empty: { sq: "Shporta është bosh", en: "Your cart is empty" },
    emptySub: { sq: "Shto produkte për të vazhduar", en: "Add products to continue" },
    checkout: { sq: "Vazhdo me porosinë", en: "Proceed to Checkout" },
    browse: { sq: "Shiko produktet", en: "Browse Products" },
    total: { sq: "Totali", en: "Total" },
    items: { sq: "artikuj", en: "items" },
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
        open ? "translate-x-0" : "translate-x-full"
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gray-700" />
            <span className="font-semibold text-gray-900">{t.title[lang]}</span>
            {count > 0 && (
              <span className="bg-gray-900 text-white text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
            )}
          </div>
          <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-gray-400" />
              </div>
              <p className="font-semibold text-gray-900 mb-1">{t.empty[lang]}</p>
              <p className="text-gray-400 text-sm mb-6">{t.emptySub[lang]}</p>
              <Link href="/products" onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-colors">
                {t.browse[lang]} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 px-5">
              {items.map((item) => (
                <li key={item.id} className="py-4 flex items-start gap-3">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                    <Image src={item.image || "/placeholder-product.svg"} alt={item.name}
                      width={64} height={64} className="object-contain w-full h-full p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium text-sm leading-snug line-clamp-2 mb-2">{item.name}</p>
                    <p className="text-gray-900 font-bold text-sm mb-2">
                      {(item.price * item.quantity).toFixed(2)} €
                    </p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => update(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <Minus className="w-3 h-3 text-gray-600" />
                      </button>
                      <span className="text-sm font-semibold text-gray-900 w-5 text-center">{item.quantity}</span>
                      <button onClick={() => update(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <Plus className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <button onClick={() => remove(item.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">{t.total[lang]}</span>
              <span className="text-xl font-bold text-gray-900">{total.toFixed(2)} €</span>
            </div>
            <Link href="/checkout" onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl text-sm transition-colors">
              {t.checkout[lang]} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
