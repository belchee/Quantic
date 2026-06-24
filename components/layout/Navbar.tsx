"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ShoppingBag, ChevronDown } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useCart } from "@/lib/cart";

const CATEGORIES = [
  { value: "bullet-cameras", label: { sq: "Kamera Bullet", en: "Bullet Cameras" } },
  { value: "dome-cameras", label: { sq: "Kamera Dome", en: "Dome Cameras" } },
  { value: "ptz-cameras", label: { sq: "Kamera PTZ", en: "PTZ Cameras" } },
  { value: "nvr", label: { sq: "Regjistrues NVR", en: "NVR Recorders" } },
  { value: "poe-switches", label: { sq: "PoE Switches", en: "PoE Switches" } },
  { value: "wifi-cameras", label: { sq: "Kamera Wi-Fi", en: "Wi-Fi Cameras" } },
  { value: "accessories", label: { sq: "Aksesore", en: "Accessories" } },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const { lang, setLang, tr } = useLang();
  const { count, setOpen: setCartOpen } = useCart();

  useEffect(() => { setOpen(false); setProductsOpen(false); }, [pathname]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  function onProductsEnter() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setProductsOpen(true);
  }

  function onProductsLeave() {
    timeoutRef.current = setTimeout(() => setProductsOpen(false), 150);
  }

  const productsActive = pathname === "/products" || pathname.startsWith("/products/");

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm" : "bg-white border-b border-gray-100"
      }`}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center h-[64px] gap-8">

          <Link href="/" className="flex-shrink-0">
            <Image src="/quantic-logo-black.svg" height={36} width={120} alt="Quantic" priority unoptimized />
          </Link>

          <nav className="hidden md:flex items-center gap-1 flex-1">
            {/* Products with dropdown */}
            <div
              ref={productsRef}
              className="relative"
              onMouseEnter={onProductsEnter}
              onMouseLeave={onProductsLeave}
            >
              <Link href="/products"
                className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  productsActive ? "text-gray-900 bg-gray-100" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}>
                {tr("nav_products")}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`} />
              </Link>

              {/* Dropdown */}
              {productsOpen && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-50">
                  <Link href="/products"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors border-b border-gray-100 mb-1">
                    {lang === "sq" ? "Të gjitha produktet" : "All Products"}
                  </Link>
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.value}
                      href={`/products?category=${cat.value}`}
                      className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      {cat.label[lang]}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Other nav links */}
            {[
              { href: "/services", key: "nav_services" as const },
              { href: "/about", key: "nav_about" as const },
              { href: "/contact", key: "nav_contact" as const },
            ].map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Link key={l.href} href={l.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active ? "text-gray-900 bg-gray-100" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}>
                  {tr(l.key)}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <button onClick={() => setLang(lang === "sq" ? "en" : "sq")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors">
              <span className={lang === "sq" ? "text-gray-900" : "text-gray-400"}>SQ</span>
              <span className="text-gray-300">|</span>
              <span className={lang === "en" ? "text-gray-900" : "text-gray-400"}>EN</span>
            </button>

            <a href="tel:+38345460460" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
              <Phone className="w-3.5 h-3.5" />
              +383 45 460 460
            </a>

            <button onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900">
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gray-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>

            <Link href="/contact"
              className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-lg transition-colors">
              {tr("nav_cta")}
            </Link>
          </div>

          {/* Mobile right */}
          <div className="flex md:hidden items-center gap-2 ml-auto">
            <button onClick={() => setLang(lang === "sq" ? "en" : "sq")}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700">
              {lang === "sq" ? "EN" : "SQ"}
            </button>
            <button onClick={() => setCartOpen(true)} className="relative p-2 text-gray-600">
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gray-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>
            <button onClick={() => setOpen(!open)} className="p-2 text-gray-600" aria-label="Menu">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`fixed inset-x-0 top-[64px] z-40 bg-white border-b border-gray-200 transition-all duration-200 md:hidden ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <nav className="px-5 py-4 flex flex-col gap-1">
          <Link href="/products" onClick={() => setOpen(false)}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              productsActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
            }`}>
            {tr("nav_products")}
          </Link>
          {CATEGORIES.map((cat) => (
            <Link key={cat.value} href={`/products?category=${cat.value}`} onClick={() => setOpen(false)}
              className="px-7 py-2 rounded-xl text-xs text-gray-500 hover:bg-gray-50 transition-colors">
              {cat.label[lang]}
            </Link>
          ))}
          {[
            { href: "/services", key: "nav_services" as const },
            { href: "/about", key: "nav_about" as const },
            { href: "/contact", key: "nav_contact" as const },
          ].map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                pathname === l.href ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
              }`}>
              {tr(l.key)}
            </Link>
          ))}
          <div className="pt-3 mt-2 border-t border-gray-100 flex flex-col gap-2">
            <a href="tel:+38345460460" className="px-4 py-3 text-sm text-gray-600 font-medium">+383 45 460 460</a>
            <Link href="/contact" onClick={() => setOpen(false)}
              className="px-4 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl text-center">
              {tr("nav_cta")}
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
