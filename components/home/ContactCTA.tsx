"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

export default function ContactCTA() {
  const { tr } = useLang();

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-gray-900 rounded-3xl px-8 sm:px-16 py-16 lg:py-20 text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.025em" }}>
            {tr("cta_h2")}
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            {tr("cta_sub")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/contact"
              className="px-8 py-3.5 bg-white hover:bg-gray-100 text-gray-900 font-semibold text-sm rounded-xl transition-colors">
              {tr("cta_primary")}
            </Link>
            <a href="tel:+38345460460"
              className="px-8 py-3.5 border border-white/20 hover:border-white/40 text-white font-semibold text-sm rounded-xl transition-colors">
              {tr("cta_phone")} →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
