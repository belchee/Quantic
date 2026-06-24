"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search, Menu, X, ShoppingCart, User, ChevronDown,
  Zap, Monitor, Laptop, Tv, Package, Camera, Network, Wrench,
} from "lucide-react";

const categoryLinks = [
  { href: "/services/video-surveillance", label: "Kamera dhe Sisteme Sigurie", icon: Camera },
  { href: "/services/alarm-systems", label: "Alarm Systems", icon: Package },
  { href: "/services/fiber-optic", label: "Fiber Optik", icon: Zap },
  { href: "/services/network-infrastructure", label: "Rrjeta", icon: Network },
  { href: "/products", label: "Produktet", icon: Monitor },
  { href: "/services", label: "Shërbime të IT", icon: Wrench },
  { href: "/about", label: "About", icon: User },
  { href: "/contact", label: "Kontakt", icon: Package },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const pathname = usePathname();

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      {/* ── Top bar ── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-5 h-[68px]">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 mr-2">
            <Image src="/quantic-logo-light.svg" height={40} width={140} alt="Quantic" priority />
          </Link>

          {/* Search bar (prominent, pill) */}
          <div className="flex-1 hidden sm:flex items-center border border-gray-300 rounded-full overflow-hidden bg-white max-w-2xl">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Kërko produkte"
              className="flex-1 px-5 py-2.5 text-sm text-gray-800 outline-none bg-transparent placeholder-gray-400"
            />
            <button className="px-4 py-2.5 border-l border-gray-200 text-gray-500 hover:text-blue-600 transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Right: cart + account */}
          <div className="hidden sm:flex items-center gap-5 flex-shrink-0 ml-2">
            <Link href="/products" className="text-gray-600 hover:text-blue-600 transition-colors" aria-label="Cart">
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
              <User className="w-5 h-5" />
              KYQU
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden ml-auto p-2 text-gray-600"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* ── Category nav bar ── */}
        <nav className="hidden lg:block bg-[#1a1f2e] border-t border-[#2a3040]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-11 gap-0.5">
            {categoryLinks.map((l) => {
              const Icon = l.icon;
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-colors group ${
                    active ? "text-blue-400" : "text-gray-300 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-70" />
                  {l.label}
                  <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* ── Mobile dropdown ── */}
      <div
        className={`fixed inset-x-0 top-[68px] z-40 bg-white border-b border-gray-200 shadow-lg transition-all duration-200 lg:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Mobile search */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
            <input
              type="text"
              placeholder="Kërko produkte"
              className="flex-1 px-4 py-2.5 text-sm outline-none"
            />
            <button className="px-4 py-2.5 border-l border-gray-200 text-gray-500">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
        <nav className="px-4 py-3 flex flex-col gap-1">
          {categoryLinks.map((l) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  pathname === l.href ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setOpen(false)}
              >
                <Icon className="w-4 h-4 text-gray-400" />
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
