"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, ArrowLeft, MessageCircle, ShoppingBag, Plus } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";

interface Product {
  id: string; name: string; model: string; category: string;
  price: number; originalPrice?: number; image: string;
  shortDesc?: string; specs: string[]; inStock: boolean;
}

export default function ProductPageClient({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const { lang } = useLang();

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((all: Product[]) => {
        const p = all.find((x) => x.id === slug);
        if (p) {
          setProduct(p);
          setRelated(all.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4));
        }
      });
  }, [slug]);

  function handleAdd() {
    if (!product) return;
    add({ id: product.id, name: product.name, price: product.price, image: product.image });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const t = {
    back: { sq: "Kthehu te produktet", en: "Back to Products" },
    specs: { sq: "Specifikimet", en: "Specifications" },
    addToCart: { sq: "Shto në shportë", en: "Add to Cart" },
    added: { sq: "U shtua!", en: "Added!" },
    quote: { sq: "Kërko ofertë", en: "Request a Quote" },
    related: { sq: "Produkte të ngjashme", en: "Related Products" },
    outOfStock: { sq: "Jashtë stokut", en: "Out of Stock" },
    inStock: { sq: "Në stok", en: "In Stock" },
  };

  if (!product) {
    return (
      <div className="min-h-screen pt-[64px] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const orig = product.originalPrice ?? Math.round(product.price * 1.2);
  const disc = product.originalPrice ? Math.round(((orig - product.price) / orig) * 100) : 0;

  return (
    <div className="bg-white min-h-screen pt-[64px]">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 px-5 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/products"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t.back[lang]}
          </Link>
        </div>
      </div>

      {/* Product */}
      <section className="py-12 px-5 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-10 flex items-center justify-center min-h-80">
            <Image src={product.image || "/placeholder-product.svg"} alt={product.name}
              width={420} height={320} className="w-full max-w-sm object-contain" />
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-gray-900 text-white">
                {product.model}
              </span>
              {product.inStock ? (
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-green-50 text-green-700">{t.inStock[lang]}</span>
              ) : (
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-600">{t.outOfStock[lang]}</span>
              )}
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}>
              {product.name}
            </h1>

            {product.shortDesc && (
              <p className="text-gray-500 text-base mb-6 leading-relaxed">{product.shortDesc}</p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-4xl font-bold text-gray-900">{product.price.toFixed(2)} €</span>
              {disc > 0 && (
                <>
                  <span className="text-lg text-gray-400 line-through">{orig.toFixed(2)} €</span>
                  <span className="px-2 py-0.5 bg-gray-900 text-white text-xs font-bold rounded-md">-{disc}%</span>
                </>
              )}
            </div>

            {/* Key specs preview (first 4) */}
            {product.specs?.length > 0 && (
              <div className="mb-8">
                <ul className="space-y-2">
                  {product.specs.slice(0, 4).map((spec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                      <span className="text-gray-600 text-sm">{spec.includes(":") ? spec.split(":").slice(1).join(":").trim() : spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAdd}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                  added
                    ? "bg-green-600 text-white"
                    : product.inStock
                    ? "bg-gray-900 hover:bg-black text-white"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {added ? (
                  <><CheckCircle className="w-4 h-4" /> {t.added[lang]}</>
                ) : (
                  <><ShoppingBag className="w-4 h-4" /> {t.addToCart[lang]}</>
                )}
              </button>
              <a href="https://wa.me/38345460460" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-gray-200 hover:border-green-400 text-gray-700 hover:text-green-600 font-semibold text-sm transition-colors">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Full Specifications Table */}
      {product.specs?.length > 0 && (
        <section className="py-12 px-5 lg:px-8 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {t.specs[lang]}
            </h2>
            <div className="rounded-2xl border border-gray-200 overflow-hidden">
              {product.specs.map((spec, i) => {
                const colonIdx = spec.indexOf(":");
                const hasColon = colonIdx > 0;
                const label = hasColon ? spec.slice(0, colonIdx).trim() : null;
                const value = hasColon ? spec.slice(colonIdx + 1).trim() : spec;
                return (
                  <div key={i} className={`flex flex-col sm:flex-row ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    {label && (
                      <div className="sm:w-56 shrink-0 px-5 py-3.5 font-semibold text-sm text-gray-700 border-b sm:border-b-0 sm:border-r border-gray-200">
                        {label}
                      </div>
                    )}
                    <div className={`flex-1 px-5 py-3.5 text-sm text-gray-600 border-b border-gray-200 ${!label ? "col-span-2 font-medium text-gray-800" : ""}`}>
                      {value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="py-12 px-5 lg:px-8 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8"
              style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {t.related[lang]}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all">
                  <div className="h-36 bg-gray-50 flex items-center justify-center p-4">
                    <Image src={p.image || "/placeholder-product.svg"} alt={p.name}
                      width={140} height={140} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-3.5 border-t border-gray-100">
                    <p className="text-gray-900 font-medium text-xs line-clamp-2 mb-1">{p.name}</p>
                    <p className="text-gray-900 font-bold text-sm">{p.price.toFixed(2)} €</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
