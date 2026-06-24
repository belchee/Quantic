"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { services } from "@/lib/services";
import { useLang } from "@/lib/i18n";

export default function ServicesPage() {
  const { lang, tr } = useLang();

  return (
    <div className="bg-white min-h-screen pt-[64px]">
      <div className="border-b border-gray-100 py-16 px-5 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">{tr("services_label")}</span>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mt-3 mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.035em" }}>
            {tr("services_h2")}
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl">{tr("services_sub")}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 rounded-2xl overflow-hidden">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div key={svc.slug} className="bg-white flex flex-col p-8">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-6">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <h2 className="text-gray-900 font-bold text-xl mb-3"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {svc.title[lang]}
                </h2>
                <p className="text-gray-500 text-sm mb-5 leading-relaxed flex-1">{svc.shortDesc[lang]}</p>
                <ul className="space-y-2 mb-6">
                  {svc.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                      <span className="text-gray-600 text-sm">{f[lang]}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/services/${svc.slug}`}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                  {tr("svc_learn")} →
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
