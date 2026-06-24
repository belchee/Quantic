"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/i18n";

export default function ContactPage() {
  const { tr } = useLang();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const contactItems = [
    { icon: Phone, label: tr("contact_info_phone"), value: "+383 45 460 460", href: "tel:+38345460460" },
    { icon: Mail, label: tr("contact_info_email"), value: "quanticshpk@gmail.com", href: "mailto:quanticshpk@gmail.com" },
    { icon: MapPin, label: tr("contact_info_location"), value: "Prishtinë, Kosovo", href: null },
    { icon: MessageCircle, label: "WhatsApp", value: "+383 45 460 460", href: "https://wa.me/38345460460" },
  ];

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-all";

  return (
    <div className="bg-white min-h-screen pt-[64px]">
      {/* Header */}
      <div className="border-b border-gray-100 py-16 px-5 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">{tr("contact_label")}</span>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mt-3 mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.035em" }}>
            {tr("contact_h1")}
          </h1>
          <p className="text-gray-500 text-lg max-w-xl">{tr("contact_sub")}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Left: info */}
        <div className="lg:col-span-2 space-y-3">
          {contactItems.map((item) => {
            const Icon = item.icon;
            const inner = (
              <div className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">{item.label}</p>
                  <p className="text-gray-900 font-medium text-sm">{item.value}</p>
                </div>
                {item.href && <ArrowRight className="w-4 h-4 text-gray-300 ml-auto" />}
              </div>
            );
            return item.href ? (
              <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                {inner}
              </a>
            ) : <div key={item.label}>{inner}</div>;
          })}
        </div>

        {/* Right: form */}
        <div className="lg:col-span-3">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-5">
                <ArrowRight className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-gray-900 font-bold text-2xl mb-2"
                style={{ fontFamily: "var(--font-space-grotesk)" }}>
                {tr("contact_success_h")}
              </h3>
              <p className="text-gray-500 text-sm max-w-sm">{tr("contact_success_sub")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{tr("contact_name")} *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Emri juaj" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{tr("contact_email")} *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="email@juaj.com" className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{tr("contact_phone")}</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+383..." className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{tr("contact_subject")} *</label>
                  <select name="subject" value={form.subject} onChange={handleChange} required className={inputClass + " appearance-none cursor-pointer"}>
                    <option value="">—</option>
                    <option value="cctv">{tr("contact_subject_cctv")}</option>
                    <option value="alarm">{tr("contact_subject_alarm")}</option>
                    <option value="fiber">{tr("contact_subject_fiber")}</option>
                    <option value="network">{tr("contact_subject_network")}</option>
                    <option value="maint">{tr("contact_subject_maint")}</option>
                    <option value="other">{tr("contact_subject_other")}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">{tr("contact_message")} *</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                  placeholder="..." className={inputClass + " resize-none"} />
              </div>
              <button type="submit"
                className="w-full py-3.5 rounded-xl bg-gray-900 hover:bg-black text-white font-semibold text-sm transition-colors">
                {tr("contact_send")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
