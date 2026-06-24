"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Upload, Save, Package } from "lucide-react";

const CATEGORIES = [
  { value: "bullet-cameras", label: "Bullet Cameras" },
  { value: "dome-cameras", label: "Dome Cameras" },
  { value: "ptz-cameras", label: "PTZ Cameras" },
  { value: "nvr", label: "NVR Recorders" },
  { value: "poe-switches", label: "PoE Switches" },
  { value: "wifi-cameras", label: "WiFi Cameras" },
  { value: "accessories", label: "Accessories" },
];

const EMPTY: Record<string, string | number | boolean | string[]> = {
  id: "", name: "", model: "", category: "bullet-cameras",
  price: "", originalPrice: "", image: "/placeholder-product.svg",
  shortDesc: "", specs: [], inStock: true,
};

export default function AdminPage() {
  const [products, setProducts] = useState<Record<string, string | number | boolean | string[]>[]>([]);
  const [editing, setEditing] = useState<Record<string, string | number | boolean | string[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [specInput, setSpecInput] = useState("");
  const [search, setSearch] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const r = await fetch("/api/products");
    setProducts(await r.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing) return;
    setSaving(true);
    const method = "POST";
    const product = {
      ...editing,
      price: Number(editing.price),
      originalPrice: editing.originalPrice ? Number(editing.originalPrice) : undefined,
      id: editing.id || String(editing.model).toLowerCase().replace(/[^a-z0-9]/g, "-"),
    };
    await fetch("/api/products", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    await load();
    setEditing(null);
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  async function uploadImage(file: File) {
    setUploadingImg(true);
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch("/api/upload", { method: "POST", body: fd });
    const { url } = await r.json();
    setEditing((e) => e ? { ...e, image: url } : e);
    setUploadingImg(false);
  }

  const filtered = products.filter(
    (p) =>
      String(p.name).toLowerCase().includes(search.toLowerCase()) ||
      String(p.model).toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-[112px]">
      <p className="text-gray-500">Loading products...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-[112px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Admin</h1>
            <p className="text-gray-500 text-sm mt-1">{products.length} products total</p>
          </div>
          <button
            onClick={() => setEditing({ ...EMPTY })}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm mb-6 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
        />

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold w-16">Image</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Name</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold hidden md:table-cell">Model</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold hidden lg:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Price</th>
                <th className="text-right px-4 py-3 text-gray-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={String(p.id)} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      {p.image ? (
                        <Image src={String(p.image)} alt="" width={48} height={48} className="object-contain" />
                      ) : (
                        <Package className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{String(p.name)}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell font-mono text-xs">{String(p.model)}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                      {CATEGORIES.find((c) => c.value === p.category)?.label ?? String(p.category)}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">€{String(p.price)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditing({ ...p })}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => remove(String(p.id))}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-400">No products found.</div>
          )}
        </div>
      </div>

      {/* Edit / Add Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                {editing.id ? "Edit Product" : "Add Product"}
              </h2>
              <button onClick={() => setEditing(null)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Image upload */}
              <div className="flex items-center gap-5">
                <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center border border-gray-200 shrink-0">
                  {editing.image ? (
                    <Image src={String(editing.image)} alt="" width={96} height={96} className="object-contain" />
                  ) : (
                    <Package className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <div>
                  <input type="file" accept="image/*" ref={fileRef} className="hidden"
                    onChange={(e) => { if (e.target.files?.[0]) uploadImage(e.target.files[0]); }} />
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploadingImg}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-blue-400 transition-colors disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    {uploadingImg ? "Uploading..." : "Upload Image"}
                  </button>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                  {/* Or enter URL */}
                  <input
                    type="text"
                    placeholder="Or paste image URL"
                    value={String(editing.image ?? "")}
                    onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                    className="mt-2 w-full px-3 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Fields grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Product Name *</label>
                  <input
                    value={String(editing.name ?? "")}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                    placeholder="e.g. 2MP Full Color Bullet Camera"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Model *</label>
                  <input
                    value={String(editing.model ?? "")}
                    onChange={(e) => setEditing({ ...editing, model: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                    placeholder="e.g. TC-C32WP-I3W"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Category *</label>
                  <select
                    value={String(editing.category ?? "bullet-cameras")}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Price (€) *</label>
                  <input
                    type="number"
                    value={String(editing.price ?? "")}
                    onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                    placeholder="29"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Original Price (€) <span className="text-gray-400 font-normal">for discount badge</span></label>
                  <input
                    type="number"
                    value={String(editing.originalPrice ?? "")}
                    onChange={(e) => setEditing({ ...editing, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                    placeholder="39"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Short Description</label>
                  <input
                    value={String(editing.shortDesc ?? "")}
                    onChange={(e) => setEditing({ ...editing, shortDesc: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                    placeholder="Brief product description"
                  />
                </div>
              </div>

              {/* Specs */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Specifications</label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={specInput}
                    onChange={(e) => setSpecInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && specInput.trim()) {
                        e.preventDefault();
                        setEditing({ ...editing, specs: [...(editing.specs as string[]), specInput.trim()] });
                        setSpecInput("");
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                    placeholder="Type a spec and press Enter"
                  />
                  <button
                    onClick={() => {
                      if (specInput.trim()) {
                        setEditing({ ...editing, specs: [...(editing.specs as string[]), specInput.trim()] });
                        setSpecInput("");
                      }
                    }}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(editing.specs as string[]).map((s, i) => (
                    <span key={i} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                      {s}
                      <button onClick={() => setEditing({ ...editing, specs: (editing.specs as string[]).filter((_, j) => j !== i) })}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* In stock */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(editing.inStock)}
                  onChange={(e) => setEditing({ ...editing, inStock: e.target.checked })}
                  className="w-4 h-4 rounded accent-blue-600"
                />
                <span className="text-sm text-gray-700 font-medium">In Stock</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg transition-colors">
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving || !editing.name || !editing.model || !editing.price}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
