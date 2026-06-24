"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SlidersHorizontal, X } from "lucide-react";

const CATEGORIES = [
  { value: "bullet-cameras", label: "IP Kamera" },
  { value: "dome-cameras", label: "Kamera Dome" },
  { value: "ptz-cameras", label: "Kamera PTZ" },
  { value: "nvr", label: "Regjistrues NVR" },
  { value: "poe-switches", label: "PoE Switch" },
  { value: "wifi-cameras", label: "Wi-Fi Kamera" },
  { value: "accessories", label: "Aksesorë" },
];

interface Product {
  id: string; name: string; model: string; category: string;
  price: number; originalPrice?: number; image: string;
  shortDesc: string; specs: string[]; inStock: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 9999]);
  const [sort, setSort] = useState("default");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        const prices = data.map((p: Product) => p.price);
        setPriceRange([Math.min(...prices), Math.max(...prices)]);
        setLoading(false);
      });
  }, []);

  const minP = products.length ? Math.min(...products.map((p) => p.price)) : 0;
  const maxP = products.length ? Math.max(...products.map((p) => p.price)) : 9999;

  const toggleCat = (c: string) =>
    setSelectedCategories((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c]);

  const filtered = useMemo(() => {
    let r = [...products];
    if (selectedCategories.length) r = r.filter((p) => selectedCategories.includes(p.category));
    r = r.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sort === "price-asc") r.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r.sort((a, b) => b.price - a.price);
    return r;
  }, [products, selectedCategories, priceRange, sort]);

  const Sidebar = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold text-gray-900 mb-4 text-sm">Filter by price</h3>
        <input type="range" min={minP} max={maxP} value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-amber-500 cursor-pointer" />
        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
          <span>Min: <strong className="text-gray-900">{priceRange[0]} €</strong></span>
          <span>Max: <strong className="text-gray-900">{priceRange[1]} €</strong></span>
        </div>
      </div>
      <div>
        <h3 className="font-bold text-gray-900 mb-4 text-sm">Filter by category</h3>
        <div className="space-y-2.5">
          {CATEGORIES.map((c) => {
            const count = products.filter((p) => p.category === c.value).length;
            return (
              <label key={c.value} className="flex items-center gap-2.5 cursor-pointer group">
                <input type="checkbox" checked={selectedCategories.includes(c.value)}
                  onChange={() => toggleCat(c.value)} className="w-4 h-4 accent-blue-600 cursor-pointer" />
                <span className={`text-sm ${selectedCategories.includes(c.value) ? "text-blue-600 font-semibold" : "text-gray-700"}`}>
                  {c.label}
                </span>
                <span className="text-xs text-gray-400 ml-auto">({count})</span>
              </label>
            );
          })}
        </div>
        {selectedCategories.length > 0 && (
          <button onClick={() => setSelectedCategories([])}
            className="mt-4 text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1">
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pt-[112px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex gap-8">
            <aside className="hidden lg:block w-60 shrink-0">
              <div className="sticky top-32"><Sidebar /></div>
            </aside>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
                <button onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700">
                  <SlidersHorizontal className="w-4 h-4" /> FILTRO
                </button>
                <p className="text-sm text-gray-500 flex-1">
                  PO SHFAQEN 1-{filtered.length} NGA {filtered.length} PËRFUNDIME GJITHSEJ
                </p>
                <select value={sort} onChange={(e) => setSort(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-400">
                  <option value="default">Renditje parazgjedhje</option>
                  <option value="price-asc">Çmimi: Ulët – Lartë</option>
                  <option value="price-desc">Çmimi: Lartë – Ulët</option>
                </select>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((p) => {
                  const orig = p.originalPrice ?? Math.round(p.price * 1.2);
                  const disc = Math.round(((orig - p.price) / orig) * 100);
                  return (
                    <Link key={p.id} href={`/products/${p.id}`}
                      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                      <div className="relative bg-gray-50 flex items-center justify-center h-48 p-4">
                        <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                          -{disc}%
                        </span>
                        <Image src={p.image || "/placeholder-product.svg"} alt={p.name}
                          width={180} height={180} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="p-3 border-t border-gray-100">
                        <h3 className="text-gray-900 font-semibold text-xs leading-snug line-clamp-3 mb-2 min-h-[3rem]">
                          {p.name}
                        </h3>
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-lg font-extrabold text-gray-900">
                            {p.price.toFixed(2).replace(".", ",")} €
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            {orig.toFixed(2).replace(".", ",")} €
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 inset-y-0 w-72 bg-white shadow-xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Filtro</h3>
              <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <Sidebar />
            <button onClick={() => setSidebarOpen(false)}
              className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold">
              Shfaq {filtered.length} rezultate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
