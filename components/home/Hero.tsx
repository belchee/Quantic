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

      {/* Brand banner */}
      <div className="w-full bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.2em] mb-2">Quantic SHPK</p>
            <p className="text-gray-500 text-sm">{tr("hero_partner_seller")}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-14">
            <Image src="/brand-tiandy.svg" alt="Tiandy" width={200} height={60} className="h-14 w-auto max-w-[180px] object-contain" />
            <Image src="/brand-tvt.svg" alt="TVT" width={200} height={60} className="h-14 w-auto max-w-[140px] object-contain" />
            <Image src="/brand-artmotion.svg" alt="ART MOTION" width={200} height={60} className="h-14 w-auto max-w-[160px] object-contain" />
            <Image src="/brand-fourth.svg" alt="Kujtesa" width={120} height={60} className="h-14 w-auto max-w-[110px] object-contain" />
          </div>
          <div className="text-center mt-10">
            <Link href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white font-semibold text-sm rounded-xl transition-colors">
              {tr("hero_cta_primary")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
