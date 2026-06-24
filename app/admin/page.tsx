"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Plus, Pencil, Trash2, X, Upload, Save, Package,
  LogOut, Lock, LayoutDashboard, Tag, Star, Image as ImageIcon,
  ChevronDown, ChevronUp, Eye, EyeOff, AlertCircle, ShoppingCart, CheckCircle, Clock, XCircle,
} from "lucide-react";

/* ─── Types ─── */
interface Product {
  id: string; name: string; model: string; category: string;
  price: number; originalPrice?: number; image: string;
  shortDesc?: string; specs: string[]; inStock: boolean;
}
interface Category { value: string; label: string }
interface Brand { name: string; tagline: string; active: boolean }
interface HeroData {
  headline: string; ctaText: string; ctaLink: string;
  trustBadges: { icon: string; title: string; sub: string }[];
  brandLogos: { name: string; color: string }[];
}

const EMPTY_PRODUCT: Partial<Product> = {
  id: "", name: "", model: "", category: "bullet-cameras",
  price: 0, originalPrice: undefined, image: "",
  shortDesc: "", specs: [], inStock: true,
};

/* ─── Auth helpers ─── */
const TOKEN_KEY = "qs-admin-token";
function getToken() { return typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null; }
function setToken(t: string) { localStorage.setItem(TOKEN_KEY, t); }
function clearToken() { localStorage.removeItem(TOKEN_KEY); }

/* ══════════════════ LOGIN ══════════════════ */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const r = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", username, password }),
    });
    const data = await r.json();
    setLoading(false);
    if (data.ok) { setToken(data.token); onLogin(); }
    else setError(data.error || "Gabim gjatë hyrjes");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-[#0d1f3c] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
        <div className="flex justify-center mb-6">
          <Image src="/quantic-logo-light.svg" width={140} height={44} alt="Quantic" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 text-center mb-1">Admin Panel</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Hyr me kredencialet tuaja</p>

        {error && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Emri i përdoruesit</label>
            <input
              value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              placeholder="admin" autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Fjalëkalimi</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 pr-10"
                placeholder="••••••" autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit" disabled={loading || !username || !password}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition-colors"
          >
            {loading ? "Duke hyrë..." : "Hyr"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════ CHANGE PASSWORD MODAL ══════════════════ */
function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (next !== confirm) { setError("Fjalëkalimet nuk përputhen"); return; }
    if (next.length < 4) { setError("Minimumi 4 karaktere"); return; }
    setLoading(true); setError("");
    const r = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "change-password", password: cur, newPassword: next }),
    });
    const data = await r.json();
    setLoading(false);
    if (data.ok) setSuccess(true);
    else setError(data.error || "Gabim");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-900 flex items-center gap-2"><Lock className="w-4 h-4" /> Ndrysho fjalëkalimin</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="p-6">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Save className="w-6 h-6 text-green-600" />
              </div>
              <p className="font-semibold text-gray-900">Fjalëkalimi u ndryshua!</p>
              <button onClick={onClose} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">Mbyll</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
              {[
                { label: "Fjalëkalimi aktual", val: cur, set: setCur },
                { label: "Fjalëkalimi i ri", val: next, set: setNext },
                { label: "Konfirmo fjalëkalimin e ri", val: confirm, set: setConfirm },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                  <input type="password" value={f.val} onChange={(e) => f.set(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
                </div>
              ))}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700">Anulo</button>
                <button type="submit" disabled={loading}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold">
                  {loading ? "Duke ruajtur..." : "Ruaj"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════ PRODUCTS TAB ══════════════════ */
function ProductsTab({ categories }: { categories: Category[] }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [specInput, setSpecInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
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
    const product = {
      ...editing,
      price: Number(editing.price),
      originalPrice: editing.originalPrice ? Number(editing.originalPrice) : undefined,
      id: editing.id || String(editing.model).toLowerCase().replace(/[^a-z0-9]/g, "-"),
    };
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    await load(); setEditing(null); setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Fshi këtë produkt?")) return;
    await fetch("/api/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    await load();
  }

  async function uploadImage(file: File) {
    setUploadingImg(true);
    const fd = new FormData(); fd.append("file", file);
    const r = await fetch("/api/upload", { method: "POST", body: fd });
    const { url } = await r.json();
    setEditing((e) => e ? { ...e, image: url } : e);
    setUploadingImg(false);
  }

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.model.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const discount = (p: Partial<Product>) =>
    p.originalPrice && p.price ? Math.round((1 - Number(p.price) / Number(p.originalPrice)) * 100) : 0;

  if (loading) return <div className="py-20 text-center text-gray-400">Duke ngarkuar produktet...</div>;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <input type="text" placeholder="Kërko produkte..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 w-52" />
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 bg-white">
            <option value="all">Të gjitha kategoritë</option>
            {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <button onClick={() => { setEditing({ ...EMPTY_PRODUCT }); setSpecInput(""); }}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors">
          <Plus className="w-4 h-4" /> Shto produkt
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto">
        <div className="px-5 py-3 border-b border-gray-100 text-xs text-gray-500">{filtered.length} produkte</div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-semibold w-16">Foto</th>
              <th className="text-left px-4 py-3 text-gray-600 font-semibold">Emri</th>
              <th className="text-left px-4 py-3 text-gray-600 font-semibold hidden md:table-cell">Modeli</th>
              <th className="text-left px-4 py-3 text-gray-600 font-semibold hidden lg:table-cell">Kategoria</th>
              <th className="text-left px-4 py-3 text-gray-600 font-semibold">Çmimi</th>
              <th className="text-left px-4 py-3 text-gray-600 font-semibold hidden sm:table-cell">Stoku</th>
              <th className="text-right px-4 py-3 text-gray-600 font-semibold">Veprime</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    {p.image ? <Image src={p.image} alt="" width={48} height={48} className="object-contain" /> : <Package className="w-5 h-5 text-gray-400" />}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900 leading-tight">{p.name}</p>
                  {p.originalPrice && p.originalPrice > p.price && (
                    <span className="text-xs text-white bg-blue-600 px-1.5 py-0.5 rounded font-bold">-{discount(p)}%</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell font-mono text-xs">{p.model}</td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                    {categories.find((c) => c.value === p.category)?.label ?? p.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-gray-900">€{p.price}</p>
                  {p.originalPrice && <p className="text-xs text-gray-400 line-through">€{p.originalPrice}</p>}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {p.inStock ? "Në stok" : "Pa stok"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => { setEditing({ ...p }); setSpecInput(""); }}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => remove(p.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-12 text-center text-gray-400">Nuk u gjetën produkte.</div>}
      </div>

      {/* Product Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">{editing.id ? "Ndrysho produktin" : "Shto produkt"}</h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Image */}
              <div className="flex items-center gap-5">
                <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center border border-gray-200 shrink-0">
                  {editing.image
                    ? <Image src={editing.image} alt="" width={96} height={96} className="object-contain" />
                    : <Package className="w-8 h-8 text-gray-300" />}
                </div>
                <div className="flex-1">
                  <input type="file" accept="image/*" ref={fileRef} className="hidden"
                    onChange={(e) => { if (e.target.files?.[0]) uploadImage(e.target.files[0]); }} />
                  <button onClick={() => fileRef.current?.click()} disabled={uploadingImg}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-blue-400 transition-colors disabled:opacity-50">
                    <Upload className="w-4 h-4" />
                    {uploadingImg ? "Duke ngarkuar..." : "Ngarko foto"}
                  </button>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP deri 5MB</p>
                  <input type="text" placeholder="Ose ngjit URL të fotos"
                    value={editing.image ?? ""}
                    onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                    className="mt-2 w-full px-3 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Emri i produktit *</label>
                  <input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                    placeholder="p.sh. 2MP Full Color Bullet Camera" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Modeli *</label>
                  <input value={editing.model ?? ""} onChange={(e) => setEditing({ ...editing, model: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                    placeholder="TC-C32WP-I3W" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Kategoria *</label>
                  <select value={editing.category ?? "bullet-cameras"} onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 bg-white">
                    {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Çmimi (€) *</label>
                  <input type="number" value={editing.price ?? ""} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400" placeholder="29" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Çmimi origjinal (€) <span className="text-gray-400 font-normal">për badge zbritje</span></label>
                  <input type="number" value={editing.originalPrice ?? ""} onChange={(e) => setEditing({ ...editing, originalPrice: Number(e.target.value) || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400" placeholder="39" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Përshkrimi i shkurtër</label>
                  <textarea value={editing.shortDesc ?? ""} onChange={(e) => setEditing({ ...editing, shortDesc: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 resize-none"
                    placeholder="Përshkrim i shkurtër i produktit" />
                </div>
              </div>

              {/* Specs */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Specifikimet</label>
                <p className="text-xs text-gray-400 mb-2">Kopjo tabelën e specifikimeve nga faqja e prodhuesit dhe ngjite poshtë — do të shtohen automatikisht.</p>

                {/* Primary: bulk paste textarea */}
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-blue-200 rounded-xl text-xs font-mono focus:outline-none focus:border-blue-400 bg-blue-50 mb-3 resize-none"
                  placeholder={"Ngjit këtu tabelën e specifikimeve (Ctrl+V)...\n\nShembull:\nImage Sensor\t1/2.7\" CMOS\nIR Distance\tUp to 30 m\nPoer Supply\tPoE IEEE 802.3af"}
                  onPaste={(e) => {
                    e.preventDefault();
                    const text = e.clipboardData.getData("text");
                    const lines = text.split("\n").map((l: string) => l.trim()).filter(Boolean);
                    const parsed: string[] = [];
                    for (const line of lines) {
                      if (line.includes("\t")) {
                        const [key, ...rest] = line.split("\t");
                        if (key && rest.length) parsed.push(`${key.trim()}: ${rest.join(" ").trim()}`);
                      } else if (line.includes(":")) {
                        parsed.push(line.trim());
                      }
                    }
                    if (parsed.length) {
                      setEditing({ ...editing, specs: parsed });
                      (e.target as HTMLTextAreaElement).value = `✓ ${parsed.length} specifikimet u shtuan! Mund t'i shikosh poshtë.`;
                    }
                  }}
                />

                {/* Manual one-by-one add */}
                <div className="flex gap-2 mb-2">
                  <input value={specInput} onChange={(e) => setSpecInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && specInput.trim()) {
                        e.preventDefault();
                        setEditing({ ...editing, specs: [...(editing.specs ?? []), specInput.trim()] });
                        setSpecInput("");
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                    placeholder='Shto manual: "Image Sensor: 1/2.7 CMOS" + Enter' />
                  <button onClick={() => { if (specInput.trim()) { setEditing({ ...editing, specs: [...(editing.specs ?? []), specInput.trim()] }); setSpecInput(""); } }}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">Shto</button>
                </div>
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  {(editing.specs ?? []).length === 0 ? (
                    <p className="text-xs text-gray-400 px-3 py-3">Ende nuk ka specifikimet.</p>
                  ) : (
                    (editing.specs ?? []).map((s, i) => {
                      const colonIdx = s.indexOf(":");
                      const label = colonIdx > 0 ? s.slice(0, colonIdx).trim() : null;
                      const value = colonIdx > 0 ? s.slice(colonIdx + 1).trim() : s;
                      return (
                        <div key={i} className={`flex items-start gap-2 px-3 py-2 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-100 last:border-0`}>
                          {label && <span className="text-xs font-semibold text-gray-600 w-40 shrink-0">{label}</span>}
                          <span className="text-xs text-gray-700 flex-1">{value}</span>
                          <button onClick={() => setEditing({ ...editing, specs: (editing.specs ?? []).filter((_, j) => j !== i) })} className="shrink-0 ml-1">
                            <X className="w-3 h-3 text-gray-400 hover:text-red-500" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
                {(editing.specs ?? []).length > 0 && (
                  <button onClick={() => setEditing({ ...editing, specs: [] })}
                    className="mt-2 text-xs text-red-400 hover:text-red-600">
                    Fshi të gjitha specifikimet
                  </button>
                )}
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editing.inStock ?? true}
                  onChange={(e) => setEditing({ ...editing, inStock: e.target.checked })}
                  className="w-4 h-4 rounded accent-blue-600" />
                <span className="text-sm text-gray-700 font-medium">Në stok</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg transition-colors hover:bg-gray-50">Anulo</button>
              <button onClick={save} disabled={saving || !editing.name || !editing.model || !editing.price}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50">
                <Save className="w-4 h-4" />
                {saving ? "Duke ruajtur..." : "Ruaj produktin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ══════════════════ CATEGORIES TAB ══════════════════ */
function CategoriesTab({ categories, onReload }: { categories: Category[]; onReload: () => void }) {
  const [editing, setEditing] = useState<Partial<Category> | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!editing?.value || !editing?.label) return;
    setSaving(true);
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    await onReload(); setEditing(null); setSaving(false);
  }

  async function remove(value: string) {
    if (!confirm("Fshi këtë kategori?")) return;
    await fetch("/api/categories", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ value }) });
    await onReload();
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{categories.length} kategori</p>
        <button onClick={() => setEditing({ value: "", label: "" })}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors">
          <Plus className="w-4 h-4" /> Shto kategori
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
        {categories.map((c) => (
          <div key={c.value} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
            <div>
              <p className="font-semibold text-gray-900">{c.label}</p>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{c.value}</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setEditing({ ...c })}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => remove(c.value)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && <div className="py-12 text-center text-gray-400">Nuk ka kategori.</div>}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-900">{editing.value ? "Ndrysho kategorinë" : "Shto kategori"}</h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Emri (për shfaqje)</label>
                <input value={editing.label ?? ""} onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                  placeholder="p.sh. Bullet Cameras" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Slug (identifikues unik)</label>
                <input value={editing.value ?? ""}
                  onChange={(e) => setEditing({ ...editing, value: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 font-mono"
                  placeholder="bullet-cameras" />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Anulo</button>
              <button onClick={save} disabled={saving || !editing.label || !editing.value}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold">
                <Save className="w-4 h-4" /> {saving ? "Duke ruajtur..." : "Ruaj"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ══════════════════ BRANDS TAB ══════════════════ */
function BrandsTab() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [editing, setEditing] = useState<Partial<Brand> | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const r = await fetch("/api/brands");
    setBrands(await r.json());
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing?.name) return;
    setSaving(true);
    await fetch("/api/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editing.name, tagline: editing.tagline ?? "", active: editing.active ?? true }),
    });
    await load(); setEditing(null); setSaving(false);
  }

  async function remove(name: string) {
    if (!confirm("Fshi këtë brand?")) return;
    await fetch("/api/brands", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
    await load();
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{brands.length} brands</p>
        <button onClick={() => setEditing({ name: "", tagline: "", active: true })}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors">
          <Plus className="w-4 h-4" /> Shto brand
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
        {brands.map((b) => (
          <div key={b.name} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${b.active ? "bg-green-500" : "bg-gray-300"}`} />
              <div>
                <p className="font-bold text-gray-900">{b.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{b.tagline}</p>
              </div>
              {!b.active && <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">Jo aktiv</span>}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setEditing({ ...b })}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => remove(b.name)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {brands.length === 0 && <div className="py-12 text-center text-gray-400">Nuk ka brands.</div>}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-900">{editing.name ? "Ndrysho brandin" : "Shto brand"}</h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Emri i brandit *</label>
                <input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                  placeholder="HIKVISION" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Tagline</label>
                <input value={editing.tagline ?? ""} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                  placeholder="AI-Powered Surveillance" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editing.active ?? true}
                  onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                  className="w-4 h-4 accent-blue-600" />
                <span className="text-sm text-gray-700 font-medium">Aktiv (shfaqet në faqe)</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Anulo</button>
              <button onClick={save} disabled={saving || !editing.name}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold">
                <Save className="w-4 h-4" /> {saving ? "Duke ruajtur..." : "Ruaj"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ══════════════════ HERO TAB ══════════════════ */
function HeroTab() {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [badgeInput, setBadgeInput] = useState({ icon: "", title: "", sub: "" });
  const [brandInput, setBrandInput] = useState({ name: "", color: "#000000" });

  useEffect(() => {
    fetch("/api/hero").then((r) => r.json()).then(setHero);
  }, []);

  async function save() {
    if (!hero) return;
    setSaving(true);
    await fetch("/api/hero", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(hero) });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!hero) return <div className="py-20 text-center text-gray-400">Duke ngarkuar...</div>;

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Headline */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Teksti kryesor (Hero)</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Titulli kryesor</label>
            <textarea value={hero.headline} onChange={(e) => setHero({ ...hero, headline: e.target.value })}
              rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Teksti i butonit</label>
              <input value={hero.ctaText} onChange={(e) => setHero({ ...hero, ctaText: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Linku i butonit</label>
              <input value={hero.ctaLink} onChange={(e) => setHero({ ...hero, ctaLink: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Badge-t e besimit</h3>
        <div className="space-y-3 mb-4">
          {hero.trustBadges.map((b, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-2xl">{b.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{b.title}</p>
                <p className="text-xs text-gray-500 truncate">{b.sub}</p>
              </div>
              <button onClick={() => setHero({ ...hero, trustBadges: hero.trustBadges.filter((_, j) => j !== i) })}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="border border-dashed border-gray-300 rounded-xl p-4 space-y-3">
          <p className="text-xs font-semibold text-gray-600">Shto badge të ri</p>
          <div className="grid grid-cols-3 gap-2">
            <input value={badgeInput.icon} onChange={(e) => setBadgeInput({ ...badgeInput, icon: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
              placeholder="🚚 Emoji" />
            <input value={badgeInput.title} onChange={(e) => setBadgeInput({ ...badgeInput, title: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
              placeholder="Titulli" />
            <input value={badgeInput.sub} onChange={(e) => setBadgeInput({ ...badgeInput, sub: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
              placeholder="Nënshkrimi" />
          </div>
          <button onClick={() => {
            if (badgeInput.icon && badgeInput.title) {
              setHero({ ...hero, trustBadges: [...hero.trustBadges, { ...badgeInput }] });
              setBadgeInput({ icon: "", title: "", sub: "" });
            }
          }} className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
            <Plus className="w-3.5 h-3.5" /> Shto
          </button>
        </div>
      </div>

      {/* Brand Logos in Hero */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Logot e brandeve në hero</h3>
        <div className="space-y-3 mb-4">
          {hero.brandLogos.map((b, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <span className="font-bold text-lg" style={{ color: b.color }}>{b.name}</span>
              <input type="color" value={b.color} onChange={(e) => {
                const logos = [...hero.brandLogos];
                logos[i] = { ...b, color: e.target.value };
                setHero({ ...hero, brandLogos: logos });
              }} className="w-7 h-7 rounded border border-gray-200 cursor-pointer" />
              <div className="flex-1" />
              <button onClick={() => setHero({ ...hero, brandLogos: hero.brandLogos.filter((_, j) => j !== i) })}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="border border-dashed border-gray-300 rounded-xl p-4 space-y-3">
          <p className="text-xs font-semibold text-gray-600">Shto brand të ri</p>
          <div className="flex gap-2">
            <input value={brandInput.name} onChange={(e) => setBrandInput({ ...brandInput, name: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
              placeholder="Emri i brandit" />
            <input type="color" value={brandInput.color} onChange={(e) => setBrandInput({ ...brandInput, color: e.target.value })}
              className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer" />
            <button onClick={() => {
              if (brandInput.name) {
                setHero({ ...hero, brandLogos: [...hero.brandLogos, { ...brandInput }] });
                setBrandInput({ name: "", color: "#000000" });
              }
            }} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <button onClick={save} disabled={saving}
        className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-semibold transition-colors">
        <Save className="w-4 h-4" />
        {saved ? "U ruajt ✓" : saving ? "Duke ruajtur..." : "Ruaj ndryshimet"}
      </button>
    </div>
  );
}

/* ══════════════════ MAIN DASHBOARD ══════════════════ */
/* ══════════════════ ORDERS TAB ══════════════════ */
interface Order {
  id: string; name: string; email: string; phone: string;
  city: string; address: string; note?: string;
  items: { id: string; name: string; price: number; quantity: number }[];
  total: number; status: string; created_at: string;
}

function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);

  async function load() {
    const r = await fetch("/api/orders");
    setOrders(await r.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await load();
  }

  const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    pending: { label: "Në pritje", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
    confirmed: { label: "Konfirmuar", color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle },
    cancelled: { label: "Anuluar", color: "bg-red-50 text-red-600 border-red-200", icon: XCircle },
  };

  if (loading) return <div className="py-20 text-center text-gray-400">Duke ngarkuar porositë...</div>;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{orders.length} porosi gjithsej</p>
        <button onClick={load} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Rifresko</button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center text-gray-400">
          <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Nuk ka porosi ende.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-gray-600 font-semibold">Klienti</th>
                <th className="text-left px-5 py-3 text-gray-600 font-semibold hidden md:table-cell">Telefoni</th>
                <th className="text-left px-5 py-3 text-gray-600 font-semibold hidden lg:table-cell">Qyteti</th>
                <th className="text-left px-5 py-3 text-gray-600 font-semibold">Totali</th>
                <th className="text-left px-5 py-3 text-gray-600 font-semibold">Statusi</th>
                <th className="text-left px-5 py-3 text-gray-600 font-semibold hidden md:table-cell">Data</th>
                <th className="text-right px-5 py-3 text-gray-600 font-semibold">Detaje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => {
                const s = statusConfig[o.status] ?? statusConfig.pending;
                const SIcon = s.icon;
                return (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-gray-900">{o.name}</p>
                      <p className="text-xs text-gray-400">{o.email}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <a href={`tel:${o.phone}`} className="text-blue-600 hover:text-blue-700 font-medium">{o.phone}</a>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 hidden lg:table-cell">{o.city}</td>
                    <td className="px-5 py-3.5 font-bold text-gray-900">{o.total.toFixed(2)} €</td>
                    <td className="px-5 py-3.5">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${s.color}`}>
                        <SIcon className="w-3 h-3" />
                        {s.label}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs hidden md:table-cell">
                      {new Date(o.created_at).toLocaleDateString("sq-AL")}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setSelected(o)}
                          className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                          Shiko
                        </button>
                        {o.status === "pending" && (
                          <>
                            <button onClick={() => updateStatus(o.id, "confirmed")}
                              className="px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50 rounded-lg transition-colors">
                              Konfirmo
                            </button>
                            <button onClick={() => updateStatus(o.id, "cancelled")}
                              className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              Anulo
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Order detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg my-8 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-900">Detajet e porosisë</h2>
              <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Emri</span><span className="font-semibold">{selected.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Telefoni</span>
                  <a href={`tel:${selected.phone}`} className="font-semibold text-blue-600">{selected.phone}</a>
                </div>
                <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium">{selected.email}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Adresa</span><span className="font-medium text-right max-w-xs">{selected.city}, {selected.address}</span></div>
                {selected.note && <div className="flex justify-between"><span className="text-gray-500">Shënim</span><span className="font-medium text-right max-w-xs">{selected.note}</span></div>}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Produktet</p>
                <ul className="space-y-2">
                  {selected.items.map((item, i) => (
                    <li key={i} className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-700 flex-1 mr-4">{item.name}</span>
                      <span className="text-gray-500 text-xs">×{item.quantity}</span>
                      <span className="font-bold text-gray-900 ml-4">{(item.price * item.quantity).toFixed(2)} €</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="font-bold text-gray-900">Totali</span>
                <span className="text-2xl font-bold text-gray-900">{selected.total.toFixed(2)} €</span>
              </div>
              {selected.status === "pending" && (
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { updateStatus(selected.id, "confirmed"); setSelected(null); }}
                    className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors">
                    Konfirmo porosinë
                  </button>
                  <button onClick={() => { updateStatus(selected.id, "cancelled"); setSelected(null); }}
                    className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold transition-colors border border-red-200">
                    Anulo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const TABS = [
  { id: "orders", label: "Porositë", icon: ShoppingCart },
  { id: "products", label: "Produktet", icon: Package },
  { id: "categories", label: "Kategoritë", icon: Tag },
  { id: "brands", label: "Brandet", icon: Star },
  { id: "hero", label: "Faqja kryesore", icon: ImageIcon },
];

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState("orders");
  const [categories, setCategories] = useState<Category[]>([]);
  const [showChangePw, setShowChangePw] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  async function loadCategories() {
    const r = await fetch("/api/categories");
    setCategories(await r.json());
  }
  useEffect(() => { loadCategories(); }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="fixed top-0 inset-x-0 z-40 bg-white border-b border-gray-200 shadow-sm h-16 flex items-center px-4 lg:px-8 gap-4">
        <Image src="/quantic-logo-light.svg" width={120} height={38} alt="Quantic" />
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wide">Admin</span>
        <div className="flex-1" />
        <div className="relative">
          <button onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">A</div>
            admin
            {userMenuOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-50">
              <button onClick={() => { setShowChangePw(true); setUserMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Lock className="w-4 h-4 text-gray-400" /> Ndrysho fjalëkalimin
              </button>
              <div className="border-t border-gray-100 my-1" />
              <button onClick={onLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-4 h-4" /> Dil
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="pt-16 flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 fixed left-0 top-16 bottom-0">
          <nav className="flex-1 px-3 py-4 space-y-1">
            {TABS.map((t) => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    tab === t.id ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  {t.label}
                </button>
              );
            })}
          </nav>
          <div className="p-3 border-t border-gray-100">
            <a href="/" target="_blank"
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors">
              <LayoutDashboard className="w-4 h-4" /> Shiko faqen
            </a>
          </div>
        </aside>

        {/* Mobile tab bar */}
        <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 flex">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 flex flex-col items-center py-2.5 text-xs transition-colors ${
                  tab === t.id ? "text-blue-600" : "text-gray-500"
                }`}>
                <Icon className="w-5 h-5 mb-0.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Main content */}
        <main className="flex-1 md:ml-56 p-4 lg:p-8 pb-24 md:pb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {TABS.find((t) => t.id === tab)?.label}
          </h1>
          {tab === "orders" && <OrdersTab />}
          {tab === "products" && <ProductsTab categories={categories} />}
          {tab === "categories" && <CategoriesTab categories={categories} onReload={loadCategories} />}
          {tab === "brands" && <BrandsTab />}
          {tab === "hero" && <HeroTab />}
        </main>
      </div>

      {showChangePw && <ChangePasswordModal onClose={() => setShowChangePw(false)} />}
    </div>
  );
}

/* ══════════════════ ROOT ══════════════════ */
export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    setAuthed(getToken() === "qs-admin-token");
  }, []);

  if (authed === null) return null;

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  return <Dashboard onLogout={() => { clearToken(); setAuthed(false); }} />;
}
