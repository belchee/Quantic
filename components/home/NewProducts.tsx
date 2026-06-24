"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/lib/i18n";

interface Product {
  id: string; name: string; price: number; originalPrice?: number; image: string; inStock: boolean;
}

export default function NewProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const { tr } = useLang();

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then((d) => setProducts(d.slice(0, 8)));
  }, []);

  if (!products.length) return null;

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">{tr("products_label")}</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-3 tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.025em" }}>
              {tr("products_h2")}
            </h2>
          </div>
          <Link href="/products" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
            {tr("products_see_all")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p, i) => {
            const orig = p.originalPrice && p.originalPrice > p.price ? p.originalPrice : null;
            const disc = orig ? Math.round(((orig - p.price) / orig) * 100) : 0;
            return (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}>
                <Link href={`/products/${p.id}`}
                  className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-200">
                  <div className="relative bg-gray-50 h-48 flex items-center justify-center p-6">
                    {disc > 0 && (
                      <span className="absolute top-3 left-3 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                        -{disc}%
                      </span>
                    )}
                    <Image src={p.image || "/placeholder-product.svg"} alt={p.name}
                      width={160} height={160} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4 border-t border-gray-100 flex-1 flex flex-col">
                    <h3 className="text-gray-900 font-medium text-xs leading-snug line-clamp-2 mb-3 flex-1">{p.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-gray-900">{p.price.toFixed(2).replace(".", ",")} €</span>
                      {orig && (
                        <span className="text-xs text-gray-400 line-through">{orig.toFixed(2).replace(".", ",")} €</span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
            {tr("products_see_all")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
