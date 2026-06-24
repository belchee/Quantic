"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle, ShoppingBag, CheckCircle, Minus, Plus } from "lucide-react";
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
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"specs" | "desc">("specs");
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
    for (let i = 0; i < qty; i++) {
      add({ id: product.id, name: product.name, price: product.price, image: product.image });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const t = {
    back: { sq: "Kthehu te produktet", en: "Back to Products" },
    specs: { sq: "Specifikimet", en: "Specifications" },
    desc: { sq: "Përshkrimi", en: "Description" },
    addToCart: { sq: "Shto në shportë", en: "Add to Cart" },
    added: { sq: "U shtua!", en: "Added!" },
    related: { sq: "Produkte të ngjashme", en: "Related Products" },
    outOfStock: { sq: "Jashtë stokut", en: "Out of Stock" },
    inStock: { sq: "Në stok", en: "In Stock" },
    category: { sq: "Kategoria", en: "Category" },
    brand: { sq: "Brendi", en: "Brand" },
    code: { sq: "Kodi i produktit", en: "Product Code" },
    specCat: { sq: "KATEGORIA", en: "CATEGORY" },
    specVal: { sq: "SPECIFIKIMI", en: "SPECIFICATION" },
    whatsapp: { sq: "Porosit përmes WhatsApp", en: "Order via WhatsApp" },
  };

  if (!product) {
    return (
      <div className="min-h-screen pt-[64px] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const orig = product.originalPrice && product.originalPrice > product.price ? product.originalPrice : null;
  const disc = orig ? Math.round(((orig - product.price) / orig) * 100) : 0;

  // Parse specs into {label, value} pairs
  const parsedSpecs = (product.specs ?? []).filter((s) => {
    const lower = s.toLowerCase();
    return !(lower.startsWith("category") && lower.includes("specification"));
  }).map((s) => {
    const colonIdx = s.indexOf(":");
    if (colonIdx > 0) {
      return { label: s.slice(0, colonIdx).trim(), value: s.slice(colonIdx + 1).trim() };
    }
    return { label: null, value: s };
  });

  // Guess brand from category or name
  const brandNames = ["Tiandy", "Dahua", "TVT"];
  const detectedBrand = brandNames.find((b) =>
    product.name.toLowerCase().includes(b.toLowerCase()) ||
    product.model.toLowerCase().includes(b.toLowerCase())
  ) ?? null;

  return (
    <div className="bg-white min-h-screen pt-[64px]">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 px-5 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-gray-400">
          <Link href="/products" className="hover:text-gray-700 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> {t.back[lang]}
          </Link>
          <span>/</span>
          <span className="text-gray-700">{product.name}</span>
        </div>
      </div>

      {/* Product hero */}
      <section className="py-10 px-5 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-10 flex items-center justify-center min-h-80">
            <Image src={product.image || "/placeholder-product.svg"} alt={product.name}
              width={420} height={320} className="w-full max-w-sm object-contain" />
          </div>

          {/* Info */}
          <div>
            {/* Brand badge */}
            {detectedBrand && (
              <span className="inline-block mb-3 text-blue-600 font-bold text-base tracking-tight">{detectedBrand}</span>
            )}

            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-snug"
              style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}>
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-3xl font-bold text-gray-900">{product.price.toFixed(2)} €</span>
              {orig && disc > 0 && (
                <>
                  <span className="text-base text-gray-400 line-through">{orig.toFixed(2)} €</span>
                  <span className="px-2 py-0.5 bg-gray-900 text-white text-xs font-bold rounded-md">-{disc}%</span>
                </>
              )}
            </div>

            {/* Meta info */}
            <div className="space-y-2 mb-6 text-sm border-t border-b border-gray-100 py-4">
              <div className="flex gap-2">
                <span className="text-gray-400 w-32 shrink-0">{t.code[lang]}:</span>
                <span className="text-gray-900 font-mono font-semibold">{product.model}</span>
              </div>
              {detectedBrand && (
                <div className="flex gap-2">
                  <span className="text-gray-400 w-32 shrink-0">{t.brand[lang]}:</span>
                  <span className="text-blue-600 font-semibold">{detectedBrand}</span>
                </div>
              )}
              <div className="flex gap-2">
                <span className="text-gray-400 w-32 shrink-0">{t.category[lang]}:</span>
                <Link href={`/products?category=${product.category}`}
                  className="text-blue-600 hover:underline capitalize">
                  {product.category.replace(/-/g, " ")}
                </Link>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 w-32 shrink-0">Status:</span>
                {product.inStock ? (
                  <span className="text-green-600 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> {t.inStock[lang]}
                  </span>
                ) : (
                  <span className="text-red-500 font-semibold">{t.outOfStock[lang]}</span>
                )}
              </div>
            </div>

            {/* Qty + Add to cart */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-3 py-2.5 hover:bg-gray-50 transition-colors">
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="px-4 py-2.5 text-sm font-semibold text-gray-900 min-w-[40px] text-center">{qty}</span>
                <button onClick={() => setQty(q => q + 1)}
                  className="px-3 py-2.5 hover:bg-gray-50 transition-colors">
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                  added ? "bg-green-600 text-white"
                  : product.inStock ? "bg-gray-900 hover:bg-black text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}>
                {added ? <><CheckCircle className="w-4 h-4" /> {t.added[lang]}</> : <><ShoppingBag className="w-4 h-4" /> {t.addToCart[lang]}</>}
              </button>
            </div>
            <a href={`https://wa.me/38345460460?text=Përshëndetje, dua të porosis: ${encodeURIComponent(product.name)}`}
              target="_blank" rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 hover:border-green-400 text-gray-700 hover:text-green-600 font-semibold text-sm transition-colors">
              <MessageCircle className="w-4 h-4" /> {t.whatsapp[lang]}
            </a>
          </div>
        </div>
      </section>

      {/* Tabs + Spec Table */}
      <section className="px-5 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Tab bar */}
          <div className="flex border-b border-gray-200 mb-0">
            <button
              onClick={() => setTab("specs")}
              className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${
                tab === "specs" ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}>
              {t.specs[lang]}
            </button>
            {product.shortDesc && (
              <button
                onClick={() => setTab("desc")}
                className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${
                  tab === "desc" ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
                }`}>
                {t.desc[lang]}
              </button>
            )}
          </div>

          {/* Spec table */}
          {tab === "specs" && parsedSpecs.length > 0 && (
            <div className="border border-gray-200 border-t-0 rounded-b-2xl overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-2 bg-gray-100 border-b border-gray-200">
                <div className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">{t.specCat[lang]}</div>
                <div className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest border-l border-gray-200">{t.specVal[lang]}</div>
              </div>
              {parsedSpecs.map((s, i) => (
                <div key={i} className={`grid grid-cols-2 border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <div className="px-5 py-3 text-sm font-medium text-gray-800">{s.label ?? "—"}</div>
                  <div className="px-5 py-3 text-sm text-gray-700 border-l border-gray-100">{s.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Description tab */}
          {tab === "desc" && product.shortDesc && (
            <div className="border border-gray-200 border-t-0 rounded-b-2xl p-6 text-sm text-gray-600 leading-relaxed">
              {product.shortDesc.split("\n").map((line, i) => (
                line.trim() ? <p key={i} className="mb-2">{line}</p> : <br key={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-12 px-5 lg:px-8 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-space-grotesk)" }}>
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
