"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import GlassCard from "@/components/ui/GlassCard";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Add backend integration
    console.log("Contact form submission:", form);
    setSubmitted(true);
  }

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "+383 45 460 460",
      href: "tel:+38345460460",
      color: "#2563EB",
    },
    {
      icon: Mail,
      label: "Email",
      value: "quanticshpk@gmail.com",
      href: "mailto:quanticshpk@gmail.com",
      color: "#06B6D4",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Prishtinë, Kosovo",
      href: null,
      color: "#2563EB",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Chat with us",
      href: "https://wa.me/38345460460",
      color: "#25D366",
    },
  ];

  return (
    <div className="bg-[#09090B] min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[400px] bg-blue-600/8 rounded-full blur-[140px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <SectionLabel>Get in Touch</SectionLabel>
          <h1
            className="text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
          >
            Let&apos;s Talk
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Ready for a free consultation? Contact us via phone, WhatsApp, or the form below.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((item) => {
              const Icon = item.icon;
              const inner = (
                <GlassCard className="flex items-center gap-4" hover={!!item.href}>
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs mb-0.5">{item.label}</p>
                    <p className="text-white font-medium text-sm">{item.value}</p>
                  </div>
                </GlassCard>
              );
              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                >
                  {inner}
                </a>
              ) : (
                <div key={item.label}>{inner}</div>
              );
            })}

            {/* Map placeholder */}
            <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden h-48 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-zinc-600 text-sm">Prishtinë, Kosovo</p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3">
            <GlassCard hover={false}>
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-7 h-7 text-green-400" />
                  </div>
                  <h3
                    className="text-white font-bold text-xl mb-2"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    Message Sent!
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    We&apos;ll get back to you within 2 hours. For urgent matters, call us directly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2
                    className="text-white font-bold text-xl mb-6"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    Send a Message
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 text-xs mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-xs mb-1.5">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 text-xs mb-1.5">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+383..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-xs mb-1.5">Subject *</label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors appearance-none"
                      >
                        <option value="" className="bg-zinc-900">Select a subject</option>
                        <option value="cctv" className="bg-zinc-900">CCTV / Surveillance</option>
                        <option value="alarm" className="bg-zinc-900">Alarm System</option>
                        <option value="fiber" className="bg-zinc-900">Fiber Optic</option>
                        <option value="network" className="bg-zinc-900">Network Infrastructure</option>
                        <option value="maintenance" className="bg-zinc-900">Maintenance Contract</option>
                        <option value="other" className="bg-zinc-900">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs mb-1.5">Message *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Describe your project or question..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              )}
            </GlassCard>
          </div>
        </div>
      </section>
    </div>
  );
}
