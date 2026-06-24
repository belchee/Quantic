"use client";

import Link from "next/link";
import { CheckCircle, ArrowLeft, Phone } from "lucide-react";
import { services } from "@/lib/services";
import { useLang } from "@/lib/i18n";

export default function ServicePageClient({ slug }: { slug: string }) {
  const { lang, tr } = useLang();
  const service = services.find((s) => s.slug === slug);
  if (!service) return null;

  const Icon = service.icon;
  const otherServices = services.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <div className="bg-white min-h-screen pt-[64px]">
      {/* Header */}
      <div className="border-b border-gray-100 py-16 px-5 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/services"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-700 text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {tr("services_label")}
          </Link>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
            style={{ background: `${service.color}15`, border: `1px solid ${service.color}30` }}>
            <Icon className="w-6 h-6" style={{ color: service.color }} />
          </div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">{tr("services_label")}</span>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mt-3 mb-5 tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.035em" }}>
            {service.title[lang]}
          </h1>
          <p className="text-gray-500 text-xl max-w-2xl leading-relaxed">{service.description[lang]}</p>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 px-5 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8"
            style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {lang === "sq" ? "Çfarë përfshihet" : "What's Included"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {service.features.map((f, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <span className="text-gray-700 text-sm">{f[lang]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 px-5 lg:px-8 bg-gray-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {lang === "sq" ? `Interesoheni për ${service.title.sq}?` : `Interested in ${service.title.en}?`}
          </h2>
          <p className="text-gray-400 mb-8 text-sm">
            {lang === "sq"
              ? "Na kontaktoni për konsultim falas dhe ofertë të personalizuar."
              : "Contact us for a free consultation and custom quote tailored to your needs."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/contact"
              className="px-8 py-3.5 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-semibold text-sm transition-colors">
              {tr("cta_primary")}
            </Link>
            <a href="tel:+38345460460"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/20 hover:border-white/40 text-white font-semibold text-sm transition-colors">
              <Phone className="w-4 h-4" />
              +383 45 460 460
            </a>
          </div>
        </div>
      </div>

      {/* Other services */}
      {otherServices.length > 0 && (
        <div className="py-16 px-5 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8"
              style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {lang === "sq" ? "Shërbime të tjera" : "Other Services"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {otherServices.map((s) => {
                const OtherIcon = s.icon;
                return (
                  <Link key={s.slug} href={`/services/${s.slug}`}
                    className="flex flex-col p-6 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-sm transition-all">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                      <OtherIcon className="w-4.5 h-4.5 text-gray-600" />
                    </div>
                    <h3 className="text-gray-900 font-semibold mb-1.5 text-sm">{s.title[lang]}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{s.shortDesc[lang]}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
