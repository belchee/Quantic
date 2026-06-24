"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Phone, ChevronDown } from "lucide-react";

const categoryLinks = [
  { href: "/services/video-surveillance", label: "CCTV & Surveillance" },
  { href: "/services/alarm-systems", label: "Alarm Systems" },
  { href: "/services/fiber-optic", label: "Fiber Optic" },
  { href: "/services/network-infrastructure", label: "Rrjeta" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Shërbime" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const pathname = usePathname();

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4 h-[68px]">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="bg-[#2563EB] px-3 py-1.5 rounded-lg">
              <Image src="/quantic-logo.svg" height={28} width={110} alt="Quantic" priority />
            </div>
          </Link>

          {/* Search bar */}
          <div className="flex-1 hidden sm:flex items-center border border-gray-300 rounded-full overflow-hidden max-w-2xl mx-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Kërko produktet..."
              className="flex-1 px-5 py-2.5 text-sm text-gray-800 outline-none bg-white placeholder-gray-400"
            />
            <button className="px-4 py-2.5 bg-white text-gray-500 hover:text-blue-600 transition-colors border-l border-gray-200">
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Right: phone + contact */}
          <div className="hidden lg:flex items-center gap-5 flex-shrink-0">
            <a
              href="tel:+38345460460"
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              <Phone className="w-4 h-4 text-blue-600" />
              +383 45 460 460
            </a>
            <Link
              href="/contact"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden ml-auto p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Category nav bar */}
        <nav className="hidden lg:block bg-[#1a1f2e] border-t border-[#2a3040]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 h-11">
            {categoryLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors whitespace-nowrap ${
                  pathname === l.href || pathname.startsWith(l.href + "/")
                    ? "text-blue-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Mobile dropdown */}
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
              placeholder="Kërko produktet..."
              className="flex-1 px-4 py-2.5 text-sm outline-none"
            />
            <button className="px-4 py-2.5 border-l border-gray-200 text-gray-500">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
        <nav className="px-4 py-3 flex flex-col gap-1">
          {categoryLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === l.href ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <a href="tel:+38345460460" className="mt-2 flex items-center gap-2 px-4 py-3 text-sm text-gray-700">
            <Phone className="w-4 h-4 text-blue-600" />
            +383 45 460 460
          </a>
        </nav>
      </div>
    </>
  );
}
