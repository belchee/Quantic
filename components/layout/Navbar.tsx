"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/projects", label: "Projects" },
  { href: "/support", label: "Support" },
  { href: "/contact", label: "Contact" },
];

const locales = ["EN", "SQ", "MK"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [locale, setLocale] = useState("EN");
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? "backdrop-blur-md bg-black/60 border-b border-white/8" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16 gap-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <Image src="/quantic-logo.svg" height={32} width={140} alt="Quantic" priority />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === l.href
                    ? "text-white bg-white/10"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            {/* Language switcher */}
            <div className="flex items-center gap-1">
              {locales.map((loc, i) => (
                <span key={loc} className="flex items-center">
                  {i > 0 && <span className="text-white/20 mx-0.5">|</span>}
                  <button
                    onClick={() => setLocale(loc)}
                    className={`text-xs font-mono transition-colors ${
                      locale === loc ? "text-cyan-400" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {loc}
                  </button>
                </span>
              ))}
            </div>
            <Link
              href="/contact"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden ml-auto p-2 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#09090B]/98 backdrop-blur-xl flex flex-col items-center justify-center transition-all duration-300 lg:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center gap-6 text-center">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-2xl font-semibold text-zinc-300 hover:text-white transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-4 px-8 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-colors"
          >
            Get a Quote
          </Link>
          <div className="flex items-center gap-3 mt-2">
            {locales.map((loc, i) => (
              <span key={loc} className="flex items-center gap-3">
                {i > 0 && <span className="text-white/20">|</span>}
                <button
                  onClick={() => { setLocale(loc); }}
                  className={`text-sm font-mono ${locale === loc ? "text-cyan-400" : "text-zinc-500"}`}
                >
                  {loc}
                </button>
              </span>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
