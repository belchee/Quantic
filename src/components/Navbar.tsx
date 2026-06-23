"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function QuanticLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Quantic"
    >
      {/* ── Q ── custom with smile arc at bottom */}
      {/* Outer circle */}
      <circle cx="24" cy="28" r="18" stroke="white" strokeWidth="5.5" fill="none" />
      {/* Smile arc below the circle */}
      <path
        d="M 8 38 Q 24 56 40 38"
        stroke="white"
        strokeWidth="5.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* ── U ── */}
      <path
        d="M 50 10 L 50 38 Q 50 50 62 50 Q 74 50 74 38 L 74 10"
        stroke="white"
        strokeWidth="5.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ── A ── */}
      <path
        d="M 84 50 L 98 10 L 112 50"
        stroke="white"
        strokeWidth="5.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="88" y1="36" x2="108" y2="36" stroke="white" strokeWidth="5.5" strokeLinecap="round" />

      {/* ── N ── */}
      <path
        d="M 120 50 L 120 10 L 142 50 L 142 10"
        stroke="white"
        strokeWidth="5.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ── T ── */}
      <line x1="152" y1="10" x2="174" y2="10" stroke="white" strokeWidth="5.5" strokeLinecap="round" />
      <line x1="163" y1="10" x2="163" y2="50" stroke="white" strokeWidth="5.5" strokeLinecap="round" />

      {/* ── i ── (no dot — red teardrop replaces it) */}
      {/* Red teardrop dot above i */}
      <path
        d="M 184 6 C 184 2 190 2 190 6 C 190 10 184 14 184 14 C 184 14 184 10 184 6 Z"
        fill="#e02020"
        transform="rotate(180 187 10)"
      />
      {/* i stem */}
      <line x1="187" y1="22" x2="187" y2="50" stroke="white" strokeWidth="5.5" strokeLinecap="round" />

      {/* ── C ── */}
      <path
        d="M 218 20 Q 210 10 198 10 Q 185 10 185 30 Q 185 50 198 50 Q 210 50 218 40"
        stroke="white"
        strokeWidth="5.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0f]/95 backdrop-blur-md border-b border-[#1e2030]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity duration-200">
          <QuanticLogo className="h-9 w-auto" />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-[#8892a4] hover:text-white transition-colors duration-200 font-medium"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/contact"
            className="px-4 py-2 text-sm font-semibold text-black bg-[#00d4ff] rounded-lg hover:bg-[#00b8d9] transition-colors duration-200 shadow-[0_0_20px_#00d4ff40]"
          >
            Get a Quote
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[#8892a4] hover:text-white transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0a0a0f]/98 backdrop-blur-md border-b border-[#1e2030] px-4 py-4">
          <ul className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 text-[#8892a4] hover:text-white transition-colors font-medium"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                className="block text-center mt-2 px-4 py-2 text-sm font-semibold text-black bg-[#00d4ff] rounded-lg"
                onClick={() => setOpen(false)}
              >
                Get a Quote
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
