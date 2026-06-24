"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const brands = [
  { name: "HIKVISION", color: "#e2001a" },
  { name: "Dahua", color: "#0066cc" },
  { name: "Tiandy", color: "#00aa44" },
  { name: "TVT", color: "#1a73e8" },
  { name: "EZVIZ", color: "#7c3aed" },
];

const productIcons = [
  { emoji: "📷", label: "Bullet Cam", top: "15%", left: "38%" },
  { emoji: "🖥️", label: "NVR", top: "45%", left: "33%" },
  { emoji: "🔭", label: "PTZ Cam", top: "10%", left: "60%" },
  { emoji: "🎥", label: "Dome Cam", top: "55%", left: "62%" },
  { emoji: "🔌", label: "PoE Switch", top: "70%", left: "42%" },
  { emoji: "🔔", label: "Alarm", top: "25%", left: "78%" },
  { emoji: "📡", label: "Fiber", top: "65%", left: "78%" },
];

export default function Hero() {
  return (
    <section className="w-full bg-white pt-[112px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Banner container — matches rrufeja's full-width rounded box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0a1628 0%, #0d1f3c 40%, #0f2347 60%, #0a1628 100%)",
            minHeight: 360,
          }}
        >
          {/* Circular grid overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, #2563eb 0%, transparent 50%), " +
                "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), " +
                "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "100% 100%, 48px 48px, 48px 48px",
            }}
          />

          <div className="relative flex h-full" style={{ minHeight: 360 }}>
            {/* Left column — brands + CTA */}
            <div className="w-72 shrink-0 flex flex-col justify-between py-8 px-8 z-10">
              {/* Brand logos */}
              <div className="space-y-3">
                {brands.map((b) => (
                  <span
                    key={b.name}
                    className="block text-xl font-extrabold tracking-tight"
                    style={{ color: b.color, textShadow: "0 0 20px currentColor" }}
                  >
                    {b.name}
                  </span>
                ))}
              </div>
              {/* CTA button */}
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-7 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-all shadow-lg w-fit"
              >
                BLEJ TANI
              </Link>
            </div>

            {/* Center + Right — headline + products */}
            <div className="flex-1 flex flex-col">
              {/* Headline at top */}
              <div className="py-7 pr-8 text-center">
                <h1
                  className="text-3xl lg:text-5xl font-extrabold text-white uppercase tracking-wide leading-tight"
                  style={{ fontFamily: "var(--font-space-grotesk)", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
                >
                  Zbulo Ofertat Më Të Mira<br />
                  për Sisteme Sigurie
                </h1>
              </div>

              {/* Product images scattered */}
              <div className="relative flex-1">
                {productIcons.map((p, i) => (
                  <motion.div
                    key={p.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                    className="absolute flex flex-col items-center gap-1"
                    style={{ top: p.top, left: p.left }}
                  >
                    <div className="bg-white/10 border border-white/20 rounded-xl p-3 backdrop-blur-sm hover:bg-white/20 transition-colors">
                      <span className="text-4xl">{p.emoji}</span>
                    </div>
                    <span className="text-white/70 text-[10px] font-medium">{p.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* "Blej online" section header */}
        <div className="mt-10 mb-2">
          <h2 className="text-xl font-bold text-gray-900">Blej online</h2>
        </div>
      </div>
    </section>
  );
}
