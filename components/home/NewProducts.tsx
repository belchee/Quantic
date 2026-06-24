"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string; name: string; price: number; originalPrice?: number; image: string; category: string;
}

export default function NewProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: Product[]) => setProducts(data.slice(0, 8)));
  }, []);

  if (!products.length) return null;

  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">Produktet më të reja</h2>
          <Link href="/products" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Shiko të gjitha →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          {products.map((p) => {
            const orig = p.originalPrice ?? Math.round(p.price * 1.2);
            const disc = Math.round(((orig - p.price) / orig) * 100);
            return (
              <Link key={p.id} href={`/products/${p.id}`}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="relative bg-gray-50 flex items-center justify-center h-44 p-4">
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    -{disc}%
                  </span>
                  <Image src={p.image || "/placeholder-product.svg"} alt={p.name}
                    width={160} height={160} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-3 border-t border-gray-100">
                  <h3 className="text-gray-900 font-semibold text-xs leading-snug line-clamp-2 mb-2 min-h-[2.5rem]">{p.name}</h3>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-base font-extrabold text-gray-900">{p.price.toFixed(2).replace(".", ",")} €</span>
                    <span className="text-xs text-gray-400 line-through">{orig.toFixed(2).replace(".", ",")} €</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
