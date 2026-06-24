"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useLang } from "@/lib/i18n";

export default function Footer() {
  const { tr } = useLang();

  const navLinks = [
    { href: "/about", key: "nav_about" as const },
    { href: "/services", key: "nav_services" as const },
    { href: "/products", key: "nav_products" as const },
    { href: "/contact", key: "nav_contact" as const },
  ];

  const serviceLinks = [
    { href: "/services/video-surveillance", key: "svc_cctv_title" as const },
    { href: "/services/alarm-systems", key: "svc_alarm_title" as const },
    { href: "/services/fiber-optic", key: "svc_fiber_title" as const },
    { href: "/services/network-infrastructure", key: "svc_network_title" as const },
    { href: "/services/technical-maintenance", key: "svc_maint_title" as const },
  ];

  return (
    <footer className="bg-white text-gray-900 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image src="/quantic-logo-black.svg" height={40} width={140} alt="Quantic" unoptimized />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              {tr("footer_tagline")}
            </p>
            <a href="https://wa.me/38345460460" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-sm font-medium hover:bg-[#25D366]/20 transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.563 4.14 1.541 5.876L.057 23.943l6.224-1.452A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.032-1.392l-.361-.214-3.736.872.928-3.625-.235-.372A9.818 9.818 0 012.182 12C2.182 6.573 6.573 2.182 12 2.182S21.818 6.573 21.818 12 17.427 21.818 12 21.818z"/>
              </svg>
              WhatsApp
            </a>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-gray-900 font-semibold text-xs mb-5 uppercase tracking-widest">{tr("footer_company")}</h3>
            <ul className="space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-500 text-sm hover:text-gray-900 transition-colors">{tr(l.key)}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-gray-900 font-semibold text-xs mb-5 uppercase tracking-widest">{tr("footer_services")}</h3>
            <ul className="space-y-3">
              {serviceLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-500 text-sm hover:text-gray-900 transition-colors">{tr(l.key)}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 font-semibold text-xs mb-5 uppercase tracking-widest">{tr("footer_contact")}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <a href="tel:+38345460460" className="text-gray-500 text-sm hover:text-gray-900 transition-colors">+383 45 460 460</a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <a href="mailto:quanticshpk@gmail.com" className="text-gray-500 text-sm hover:text-gray-900 transition-colors break-all">quanticshpk@gmail.com</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <span className="text-gray-500 text-sm">Prishtinë, Kosovo</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <span className="text-gray-500 text-sm">{tr("footer_hours")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-xs">© {new Date().getFullYear()} Quantic SHPK. {tr("footer_rights")}</p>
          <p className="text-gray-400 text-xs">{tr("footer_tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
