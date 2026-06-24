"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full bg-white pt-[112px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

        {/* ── Full-width banner box ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #091828 0%, #0d2040 45%, #091828 100%)",
            minHeight: 320,
          }}
        >
          {/* Circular radar/grid overlay */}
          <div className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 50%, rgba(37,99,235,0.15) 0%, transparent 55%), " +
                "radial-gradient(circle at 30% 50%, transparent 30%, rgba(255,255,255,0.03) 31%, transparent 32%), " +
                "radial-gradient(circle at 30% 50%, transparent 45%, rgba(255,255,255,0.02) 46%, transparent 47%), " +
                "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), " +
                "linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
              backgroundSize: "100% 100%, 100% 100%, 100% 100%, 52px 52px, 52px 52px",
            }}
          />

          <div className="relative flex h-full" style={{ minHeight: 320 }}>

            {/* Left column: brand logos + CTA */}
            <div className="w-64 shrink-0 flex flex-col justify-between py-8 px-8 z-10">
              <div className="space-y-2">
                {[
                  { name: "HIKVISION", color: "#d40000" },
                  { name: "alhua", color: "#1a7fd4", prefix: true },
                  { name: "Tiandy", color: "#00aa44" },
                  { name: "TVT", color: "#3b82f6" },
                  { name: "EZVIZ", color: "#a855f7" },
                ].map((b) => (
                  <div key={b.name} className="text-xl font-extrabold tracking-tight" style={{ color: b.color }}>
                    {b.prefix && <span className="text-gray-400 text-sm">d</span>}
                    {b.name}
                  </div>
                ))}
              </div>

              <Link href="/products"
                className="inline-flex items-center justify-center px-7 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-all w-fit mt-6">
                BLEJ TANI
              </Link>
            </div>

            {/* Right: headline centered at top + product images */}
            <div className="flex-1 flex flex-col pt-7 pr-6 pb-6">
              <h1 className="text-center text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white uppercase leading-tight mb-6"
                style={{ fontFamily: "var(--font-space-grotesk)", textShadow: "0 2px 30px rgba(0,0,0,0.6)" }}>
                ZBULO OFERTAT MË TË MIRA<br />PËR SISTEME SIGURIE
              </h1>

              {/* Product image placeholders scattered */}
              <div className="flex-1 relative">
                {[
                  { emoji: "📷", label: "Bullet", style: { top: "0%", left: "5%" } },
                  { emoji: "🖥️", label: "NVR", style: { top: "40%", left: "0%" } },
                  { emoji: "🔭", label: "PTZ", style: { top: "0%", left: "35%" } },
                  { emoji: "🔌", label: "Switch", style: { top: "50%", left: "30%" } },
                  { emoji: "🎥", label: "Dome", style: { top: "0%", left: "62%" } },
                  { emoji: "🔔", label: "Alarm", style: { top: "45%", left: "58%" } },
                  { emoji: "📡", label: "Fiber", style: { top: "5%", left: "85%" } },
                ].map((p, i) => (
                  <motion.div key={p.label}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 + i * 0.06, duration: 0.35 }}
                    className="absolute flex flex-col items-center gap-1"
                    style={p.style}
                  >
                    <div className="bg-white/10 border border-white/15 rounded-xl p-2.5 backdrop-blur-sm">
                      <span className="text-3xl">{p.emoji}</span>
                    </div>
                    <span className="text-white/60 text-[10px]">{p.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Trust badges ── */}
        <div className="mt-6 mb-2">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Blej online</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: "🚚", title: "Transport falas", sub: "Brenda gjithë Kosovës" },
              { icon: "💳", title: "Pagesa të sigurta me kartelë", sub: "Me të gjitha bankat" },
              { icon: "🛡️", title: "Garacion", sub: "Garacion direkt nga prodhuesi në të gjitha produktet" },
            ].map((b) => (
              <div key={b.title} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-2xl shrink-0">{b.icon}</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{b.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
