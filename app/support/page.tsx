import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MessageCircle, Clock, FileText, ShieldCheck } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import GlassCard from "@/components/ui/GlassCard";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get technical support from Quantic SHPK. 24/7 assistance for all your security and network systems.",
};

const supportOptions = [
  {
    icon: Phone,
    title: "Call Us",
    desc: "Speak directly with a technician. Available 24/7 for emergencies.",
    action: "tel:+38345460460",
    actionLabel: "+383 45 460 460",
    color: "#2563EB",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    desc: "Send us a message on WhatsApp for fast, convenient support.",
    action: "https://wa.me/38345460460",
    actionLabel: "Chat on WhatsApp",
    color: "#25D366",
  },
  {
    icon: Mail,
    title: "Email",
    desc: "Send us a detailed description of your issue. We respond within 2 hours.",
    action: "mailto:quanticshpk@gmail.com",
    actionLabel: "quanticshpk@gmail.com",
    color: "#06B6D4",
  },
];

const faq = [
  {
    q: "What are your support hours?",
    a: "We offer 24/7 emergency support via phone and WhatsApp. For non-urgent requests, our office hours are Monday–Saturday, 08:00–18:00.",
  },
  {
    q: "How quickly do you respond to emergency calls?",
    a: "For clients with a maintenance contract, we guarantee on-site response within 2 hours in Prishtinë and surrounding areas.",
  },
  {
    q: "Do you offer remote diagnostics?",
    a: "Yes. Most camera and NVR issues can be diagnosed and resolved remotely via our monitoring platform, avoiding the need for an on-site visit.",
  },
  {
    q: "What is covered under warranty?",
    a: "All hardware we supply comes with a minimum 2-year manufacturer warranty. Our installations are covered by a 1-year workmanship guarantee.",
  },
];

export default function SupportPage() {
  return (
    <div className="bg-[#09090B] min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[400px] bg-cyan-500/6 rounded-full blur-[140px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <SectionLabel>Support Center</SectionLabel>
          <h1
            className="text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
          >
            We&apos;re Here to Help
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            24/7 technical support for all Quantic installations. Choose the fastest way to reach us.
          </p>
        </div>
      </section>

      {/* Support options */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5">
          {supportOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <GlassCard key={opt.title} className="text-center flex flex-col items-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                  style={{ background: `${opt.color}15`, border: `1px solid ${opt.color}30` }}
                >
                  <Icon className="w-6 h-6" style={{ color: opt.color }} />
                </div>
                <h3
                  className="text-white font-semibold mb-2"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {opt.title}
                </h3>
                <p className="text-zinc-500 text-sm mb-4 flex-1">{opt.desc}</p>
                <a
                  href={opt.action}
                  target={opt.action.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: opt.color }}
                >
                  {opt.actionLabel}
                </a>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* SLA info */}
      <section className="py-16 bg-[#18181B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-center">
            <div className="flex flex-col items-center gap-3">
              <Clock className="w-8 h-8 text-cyan-400" />
              <p className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>2h</p>
              <p className="text-zinc-500 text-sm">Emergency on-site response (Prishtinë)</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-blue-400" />
              <p className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>2yr</p>
              <p className="text-zinc-500 text-sm">Hardware warranty on all products</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <FileText className="w-8 h-8 text-cyan-400" />
              <p className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>24/7</p>
              <p className="text-zinc-500 text-sm">Remote monitoring & emergency support</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[#09090B]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionLabel>FAQ</SectionLabel>
            <h2
              className="text-3xl font-bold text-white"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Common Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faq.map((item) => (
              <div key={item.q} className="bg-white/3 border border-white/8 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-2 text-sm">{item.q}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-[#18181B]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2
            className="text-2xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Need a Maintenance Contract?
          </h2>
          <p className="text-zinc-400 mb-6 text-sm">
            Get priority support, preventive maintenance visits, and guaranteed SLA response times.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200"
          >
            Get a Maintenance Quote
          </Link>
        </div>
      </section>
    </div>
  );
}
