"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const brands = ["Tiandy", "Dahua", "Hikvision", "TVT", "EZVIZ"];

const productShowcase = [
  { label: "IP Bullet Camera", icon: "📷" },
  { label: "NVR Recorder", icon: "🖥️" },
  { label: "PTZ Camera", icon: "🔭" },
  { label: "PoE Switch", icon: "🔌" },
  { label: "Dome Camera", icon: "🎥" },
  { label: "Alarm System", icon: "🔔" },
];

export default function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0f1623 0%, #1a2744 50%, #0f1623 100%)" }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 40% 50%, #1e3a6e 0%, transparent 60%),
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "100% 100%, 60px 60px, 60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-14 lg:pt-40 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.h1
              variants={item}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5 uppercase"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Zbulo Ofertat<br />
              <span className="text-blue-400">Më Të Mira</span><br />
              për Sisteme Sigurie
            </motion.h1>

            <motion.div variants={item} className="flex flex-wrap gap-2 mb-8">
              {brands.map((b) => (
                <span key={b} className="px-3 py-1 rounded bg-white/10 border border-white/20 text-white text-sm font-semibold">
                  {b}
                </span>
              ))}
            </motion.div>

            <motion.div variants={item} className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center px-7 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-all shadow-lg shadow-blue-600/30"
              >
                Bli Tani
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-7 py-3.5 rounded-lg border border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-all"
              >
                Kërko Ofertë
              </Link>
            </motion.div>

            <motion.div variants={item} className="mt-8 flex flex-wrap gap-6">
              {["✓ Teknikë të Certifikuar", "✓ Mbështetje 24/7", "✓ Kosovë & Maqedoni"].map((t) => (
                <span key={t} className="text-blue-200 text-sm font-medium">{t}</span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
            className="hidden lg:grid grid-cols-3 gap-3"
          >
            {productShowcase.map((p) => (
              <div
                key={p.label}
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center gap-2 backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <span className="text-4xl">{p.icon}</span>
                <span className="text-white text-xs font-medium text-center leading-tight">{p.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
