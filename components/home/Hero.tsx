"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Wifi, Camera } from "lucide-react";
import { useLang } from "@/lib/i18n";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

export default function Hero() {
  const { tr } = useLang();

  return (
    <section className="min-h-screen bg-white flex flex-col pt-[64px]">
      {/* Main hero area */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-5 py-24 lg:py-32 max-w-5xl mx-auto w-full">
        <motion.div {...fade(0.1)}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-10">
            {tr("hero_label")}
          </span>
        </motion.div>

        <motion.h1
          {...fade(0.2)}
          className="text-6xl sm:text-7xl lg:text-8xl font-bold text-gray-900 tracking-tight leading-[1.04] mb-6"
          style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.035em" }}
        >
          {tr("hero_h1_1")}<br />
          <span className="text-gray-400">{tr("hero_h1_2")}</span>
        </motion.h1>

        <motion.p {...fade(0.3)} className="text-lg sm:text-xl text-gray-500 max-w-2xl leading-relaxed mb-10">
          {tr("hero_sub")}
        </motion.p>

        <motion.div {...fade(0.4)} className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/products"
            className="flex items-center gap-2 px-7 py-3.5 bg-gray-900 hover:bg-black text-white font-semibold text-sm rounded-xl transition-all duration-200"
          >
            {tr("hero_cta_primary")}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 px-7 py-3.5 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold text-sm rounded-xl transition-all duration-200 hover:bg-gray-50"
          >
            {tr("hero_cta_secondary")}
          </Link>
        </motion.div>

        {/* Trust signals */}
        <motion.div {...fade(0.55)} className="flex flex-wrap items-center justify-center gap-6 mt-14">
          {[
            { icon: Camera, label: tr("hero_trust_1") },
            { icon: Shield, label: tr("hero_trust_2") },
            { icon: Wifi, label: tr("hero_trust_3") },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-gray-500">
              <Icon className="w-4 h-4 text-gray-400" />
              {label}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Full-width image banner */}
      <div className="w-full bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
          <div className="relative w-full rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden" style={{ minHeight: 340 }}>
            {/* Subtle grid overlay */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }} />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full py-16 px-8 text-center">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-[0.2em] mb-8">Quantic SHPK</p>
              <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
                <Image src="/brand-tvt.svg" alt="TVT" width={120} height={35} className="h-8 w-auto object-contain" />
                <Image src="/brand-dahua.svg" alt="Dahua" width={120} height={35} className="h-8 w-auto object-contain" />
                <Image src="/brand-tiandy.svg" alt="Tiandy" width={120} height={35} className="h-8 w-auto object-contain" />
                <Image src="/brand-fourth.svg" alt="Brand" width={50} height={50} className="h-8 w-auto object-contain" />
              </div>
              <p className="text-white/50 text-sm max-w-lg leading-relaxed">
                {tr("hero_partner_seller")}
              </p>
              <Link href="/products"
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold text-sm rounded-xl transition-colors">
                {tr("hero_cta_primary")} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
