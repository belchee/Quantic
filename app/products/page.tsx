"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, SlidersHorizontal, X } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import { products, categories, categoryLabels, type ProductCategory } from "@/lib/products/cameras";

export default function ProductsPage() {
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"name" | "price-asc" | "price-desc">("name");
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

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.model.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q)
      );
    }

    if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result.sort((a, b) => b.price - a.price);

    return result;
  }, [selectedCategories, search, sort]);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <SectionLabel>Product Catalog</SectionLabel>
          <h1
            className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
          >
            Tiandy Security Products
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Professional-grade IP cameras, NVRs, PoE switches and accessories. All products available for direct purchase or project quotation.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24">
              <h3 className="text-gray-900 font-semibold text-sm mb-4 uppercase tracking-wide">Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => {
                  const count = products.filter((p) => p.category === cat).length;
                  const active = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        active
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span>{categoryLabels[cat]}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedCategories.length > 0 && (
                <button
                  onClick={() => setSelectedCategories([])}
                  className="mt-4 text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                >
                  <X className="w-3 h-3" />
                  Clear filters
                </button>
              )}
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Search + Sort bar */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or model..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 bg-white"
                />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-400 bg-white"
              >
                <option value="name">Sort: Name</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              {/* Mobile filter button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:border-blue-300"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filter
              </button>
            </div>

            {/* Results count */}
            <p className="text-gray-500 text-sm mb-5">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
              {selectedCategories.length > 0 && ` in ${selectedCategories.map((c) => categoryLabels[c]).join(", ")}`}
            </p>

            {/* Product Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
                <p className="text-gray-500">No products found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={400}
                        height={300}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-mono font-semibold bg-blue-600 text-white">
                        {product.model}
                      </span>
                    </div>
                    {/* Info */}
                    <div className="p-4">
                      <p className="text-xs text-gray-500 mb-1">{categoryLabels[product.category]}</p>
                      <h3
                        className="text-gray-900 font-semibold text-sm mb-2 leading-snug line-clamp-2"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                      >
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-xs mb-4 line-clamp-2">{product.shortDesc}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                          €{product.price}
                        </span>
                        <span className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold">
                          Request Quote
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 inset-y-0 w-72 bg-white shadow-xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Filter by Category</h3>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-2">
              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat).length;
                const active = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      active
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{categoryLabels[cat]}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">{count}</span>
                  </button>
                );
              })}
            </div>
            {selectedCategories.length > 0 && (
              <button
                onClick={() => setSelectedCategories([])}
                className="mt-6 w-full py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:text-blue-600"
              >
                Clear all filters
              </button>
            )}
            <button
              onClick={() => setSidebarOpen(false)}
              className="mt-3 w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold"
            >
              Show {filtered.length} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
