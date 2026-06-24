"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown, Search } from "lucide-react";
import { useLang } from "@/lib/i18n";

interface Product {
  id: string; name: string; model: string; category: string;
  price: number; originalPrice?: number; image: string;
  shortDesc: string; specs: string[]; inStock: boolean;
}

interface Category { value: string; label: string }

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 9999]);
  const [sort, setSort] = useState("default");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { tr } = useLang();
  const searchParams = useSearchParams();

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
      const prices = prods.map((p: Product) => p.price);
      setPriceRange([Math.min(...prices), Math.max(...prices)]);
      const cat = searchParams.get("category");
      if (cat) setSelectedCategories([cat]);
      setLoading(false);
    });
  }, [searchParams]);

  const minP = products.length ? Math.min(...products.map((p) => p.price)) : 0;
  const maxP = products.length ? Math.max(...products.map((p) => p.price)) : 9999;

  const toggleCat = (c: string) =>
    setSelectedCategories((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c]);

  const filtered = useMemo(() => {
    let r = [...products];
    if (search.trim()) r = r.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.model.toLowerCase().includes(search.toLowerCase()));
    if (selectedCategories.length) r = r.filter((p) => selectedCategories.includes(p.category));
    r = r.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sort === "price-asc") r.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r.sort((a, b) => b.price - a.price);
    return r;
  }, [products, selectedCategories, priceRange, sort, search]);

  function Sidebar() {
    return (
      <div className="space-y-8">
        {/* Price */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">{tr("products_filter_price")}</h3>
          <input type="range" min={minP} max={maxP} value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-gray-900 cursor-pointer" />
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <span>{minP} €</span>
            <span className="font-semibold text-gray-900">{priceRange[1]} €</span>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">{tr("products_filter_cat")}</h3>
          <div className="space-y-2">
            {categories.map((c) => {
              const count = products.filter((p) => p.category === c.value).length;
              const active = selectedCategories.includes(c.value);
              return (
                <label key={c.value} className="flex items-center gap-2.5 cursor-pointer group py-1">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${active ? "bg-gray-900 border-gray-900" : "border-gray-300 group-hover:border-gray-400"}`}>
                    {active && <div className="w-2 h-2 bg-white rounded-sm" />}
                  </div>
                  <input type="checkbox" checked={active} onChange={() => toggleCat(c.value)} className="sr-only" />
                  <span className={`text-sm flex-1 ${active ? "text-gray-900 font-medium" : "text-gray-600"}`}>{c.label}</span>
                  <span className="text-xs text-gray-400">({count})</span>
                </label>
              );
            })}
          </div>
          {selectedCategories.length > 0 && (
            <button onClick={() => setSelectedCategories([])}
              className="mt-4 text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors">
              <X className="w-3 h-3" /> {tr("products_clear")}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-[64px]">
      {/* Page header */}
      <div className="border-b border-gray-100 py-10 px-5 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">{tr("products_label")}</span>
          <h1 className="text-4xl font-bold text-gray-900 mt-2 tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.025em" }}>
            {tr("products_h2")}
          </h1>
          <p className="text-gray-500 mt-2 text-base mb-6">{tr("products_sub")}</p>
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Kërko produkte..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-gray-400 text-gray-900 placeholder-gray-400"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-gray-400 hover:text-gray-700" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex gap-10">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-56 shrink-0">
              <div className="sticky top-24"><Sidebar /></div>
            </aside>

            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 hover:border-gray-300 transition-colors">
                  <SlidersHorizontal className="w-4 h-4" /> {tr("products_filter")}
                </button>
                <p className="text-sm text-gray-400 flex-1">
                  {filtered.length} {tr("products_showing")}
                </p>
                <div className="relative">
                  <select value={sort} onChange={(e) => setSort(e.target.value)}
                    className="appearance-none border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-sm bg-white focus:outline-none focus:border-gray-300 text-gray-700 cursor-pointer">
                    <option value="default">{tr("products_sort_default")}</option>
                    <option value="price-asc">{tr("products_sort_asc")}</option>
                    <option value="price-desc">{tr("products_sort_desc")}</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Grid */}
              {filtered.length === 0 ? (
                <div className="py-24 text-center text-gray-400 text-sm">{tr("products_no_results")}</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filtered.map((p) => {
                    const orig = p.originalPrice ?? Math.round(p.price * 1.2);
                    const disc = Math.round(((orig - p.price) / orig) * 100);
                    return (
                      <Link key={p.id} href={`/products/${p.id}`}
                        className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-200">
                        <div className="relative bg-gray-50 h-44 flex items-center justify-center p-5">
                          {disc > 0 && (
                            <span className="absolute top-2.5 left-2.5 bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                              -{disc}%
                            </span>
                          )}
                          <Image src={p.image || "/placeholder-product.svg"} alt={p.name}
                            width={160} height={160} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="p-3.5 border-t border-gray-100 flex-1 flex flex-col">
                          <h3 className="text-gray-900 font-medium text-xs leading-snug line-clamp-2 mb-2.5 flex-1">{p.name}</h3>
                          <div className="flex items-baseline gap-2">
                            <span className="text-base font-bold text-gray-900">{p.price.toFixed(2).replace(".", ",")} €</span>
                            {orig > p.price && (
                              <span className="text-xs text-gray-400 line-through">{orig.toFixed(2).replace(".", ",")} €</span>
                            )}
                          </div>
                          {!p.inStock && (
                            <span className="mt-2 text-[10px] font-semibold text-red-500 uppercase tracking-wide">{tr("products_out_of_stock")}</span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 inset-y-0 w-72 bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">{tr("products_filter")}</h3>
              <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <Sidebar />
            <button onClick={() => setSidebarOpen(false)}
              className="mt-6 w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold">
              {filtered.length} {tr("products_showing")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
