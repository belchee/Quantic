"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { SlidersHorizontal, X } from "lucide-react";
import { products, categories, categoryLabels, type ProductCategory } from "@/lib/products/cameras";

const minPrice = Math.min(...products.map((p) => p.price));
const maxPrice = Math.max(...products.map((p) => p.price));

export default function ProductsPage() {
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [sort, setSort] = useState<"default" | "price-asc" | "price-desc">("default");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleCategory = (cat: ProductCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    return result;
  }, [selectedCategories, priceRange, sort]);

  const Sidebar = () => (
    <div className="space-y-8">
      {/* Price filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4">Filter by price</h3>
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-amber-500 h-1.5 rounded-full cursor-pointer"
        />
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Minimum:</span>
            <span className="text-sm font-semibold text-gray-900 w-12 text-center border border-gray-200 rounded px-1 py-0.5">
              {priceRange[0]}
            </span>
            <span className="text-xs text-gray-500">€</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Maximum:</span>
            <span className="text-sm font-semibold text-gray-900 w-16 text-center border border-gray-200 rounded px-1 py-0.5">
              {priceRange[1]}
            </span>
            <span className="text-xs text-gray-500">€</span>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4">Filter by category</h3>
        <div className="space-y-2.5">
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            const active = selectedCategories.includes(cat);
            return (
              <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggleCategory(cat)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer"
                />
                <span className={`text-sm transition-colors ${active ? "text-blue-600 font-semibold" : "text-gray-700 group-hover:text-gray-900"}`}>
                  {categoryLabels[cat]}
                </span>
                <span className="text-xs text-gray-400 ml-auto">({count})</span>
              </label>
            );
          })}
        </div>
        {selectedCategories.length > 0 && (
          <button
            onClick={() => setSelectedCategories([])}
            className="mt-4 text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear filters
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pt-[110px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-28">
              <Sidebar />
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 hover:border-blue-400"
              >
                <SlidersHorizontal className="w-4 h-4" /> FILTRO
              </button>
              <p className="text-sm text-gray-500 flex-1">
                PO SHFAQEN 1-{filtered.length} NGA {filtered.length} PËRFUNDIME GJITHSEJ
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-400 bg-white"
              >
                <option value="default">Renditje parazgjedhje</option>
                <option value="price-asc">Çmimi: Ulët – Lartë</option>
                <option value="price-desc">Çmimi: Lartë – Ulët</option>
              </select>
            </div>

            {/* Product Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
                <p className="text-gray-500">No products found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {filtered.map((product) => {
                  const originalPrice = Math.round(product.price * 1.22);
                  const discountPct = Math.round(((originalPrice - product.price) / originalPrice) * 100);
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                    >
                      {/* Image area */}
                      <div className="relative bg-gray-50 flex items-center justify-center h-52 p-4">
                        <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          -{discountPct}%
                        </span>
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={200}
                          height={200}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      {/* Info */}
                      <div className="p-4 border-t border-gray-100">
                        <h3 className="text-gray-900 font-semibold text-sm leading-snug line-clamp-3 mb-3 min-h-[3.5rem]">
                          {product.name}
                        </h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-extrabold text-gray-900">
                            {product.price.toFixed(2).replace(".", ",")} €
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            {originalPrice.toFixed(2).replace(".", ",")} €
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 inset-y-0 w-72 bg-white shadow-xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Filtro</h3>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <Sidebar />
            <button
              onClick={() => setSidebarOpen(false)}
              className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold"
            >
              Shfaq {filtered.length} rezultate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
