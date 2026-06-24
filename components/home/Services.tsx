"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Camera, Bell, Zap, Network, Wrench, Settings } from "lucide-react";
import { useLang } from "@/lib/i18n";

export default function Services() {
  const { tr } = useLang();

  const services = [
    { icon: Camera, href: "/services/video-surveillance", titleKey: "svc_cctv_title" as const, descKey: "svc_cctv_desc" as const },
    { icon: Bell, href: "/services/alarm-systems", titleKey: "svc_alarm_title" as const, descKey: "svc_alarm_desc" as const },
    { icon: Zap, href: "/services/fiber-optic", titleKey: "svc_fiber_title" as const, descKey: "svc_fiber_desc" as const },
    { icon: Network, href: "/services/network-infrastructure", titleKey: "svc_network_title" as const, descKey: "svc_network_desc" as const },
    { icon: Wrench, href: "/services", titleKey: "svc_it_title" as const, descKey: "svc_it_desc" as const },
    { icon: Settings, href: "/services/technical-maintenance", titleKey: "svc_maint_title" as const, descKey: "svc_maint_desc" as const },
  ];

  return (
    <section className="py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="mb-16">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">{tr("services_label")}</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-3 tracking-tight max-w-2xl"
            style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.025em" }}>
            {tr("services_h2")}
          </h2>
          <p className="text-gray-500 text-lg mt-4 max-w-xl">{tr("services_sub")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 rounded-2xl overflow-hidden">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.href}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link href={svc.href}
                  className="group bg-white flex flex-col p-8 h-full hover:bg-gray-50 transition-colors duration-200">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center mb-6 transition-colors">
                    <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <h3 className="text-gray-900 font-semibold text-lg mb-2">{tr(svc.titleKey)}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{tr(svc.descKey)}</p>
                  <p className="text-blue-600 text-sm font-medium mt-6 flex items-center gap-1">
                    {tr("svc_learn")} <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
