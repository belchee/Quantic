import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, ShieldCheck } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = { title: "Contact Us" };

const contactCards = [
  { icon: Phone, label: "Phone", value: "+1 (555) 000-0000", sub: "Mon–Fri, 8am–6pm", color: "#00c8ff" },
  { icon: Mail, label: "Email", value: "info@quantic.com", sub: "Reply within 24 hours", color: "#0066ff" },
  { icon: MapPin, label: "Address", value: "Your City, Country", sub: "Visit our showroom", color: "#7c3aed" },
  { icon: Clock, label: "Support", value: "24 / 7", sub: "Emergency line available", color: "#10b981" },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-20 bg-[#050508] overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#00c8ff] opacity-[0.04] rounded-full blur-[100px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#00c8ff] text-sm font-semibold uppercase tracking-widest mb-4">Get in Touch</p>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-6">
            Contact{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c8ff] to-[#0066ff]">
              Us
            </span>
          </h1>
          <p className="text-[#7a8499] text-lg max-w-xl mx-auto">
            Have a question or ready to get started? Our team will respond
            promptly to help you find the right solution.
          </p>
        </div>
      </section>

      {/* Contact info cards */}
      <section className="py-12 bg-[#080810] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactCards.map(({ icon: Icon, label, value, sub, color }) => (
              <div
                key={label}
                className="relative bg-[#0d0d14] border border-white/6 rounded-2xl p-6 hover:border-white/12 transition-all overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }}
                />
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${color}15` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <p className="text-[#7a8499] text-xs font-semibold uppercase tracking-widest mb-1">{label}</p>
                <p className="text-white font-semibold text-lg leading-tight mb-1">{value}</p>
                <p className="text-[#7a8499] text-xs">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + aside */}
      <section className="py-20 bg-[#050508]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-[#0d0d14] border border-white/6 rounded-3xl p-8">
                <h2 className="text-white font-bold text-2xl mb-2">Send Us a Message</h2>
                <p className="text-[#7a8499] text-sm mb-8">
                  Fill out the form and we&apos;ll get back to you within 24 hours.
                </p>
                <ContactForm />
              </div>
            </div>

            {/* Aside */}
            <div className="flex flex-col gap-6">
              {/* Free assessment */}
              <div className="relative bg-gradient-to-br from-[#00c8ff]/8 to-[#0066ff]/8 border border-[#00c8ff]/15 rounded-2xl p-6 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00c8ff]/40 to-transparent" />
                <ShieldCheck className="w-10 h-10 text-[#00c8ff] mb-4" />
                <h3 className="text-white font-bold text-xl mb-2">Free Site Assessment</h3>
                <p className="text-[#7a8499] text-sm leading-relaxed">
                  Not sure what you need? Our experts will visit your site,
                  evaluate your requirements, and provide a detailed proposal at
                  no cost.
                </p>
              </div>

              {/* Response time */}
              <div className="bg-[#0d0d14] border border-white/6 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">What happens next?</h3>
                <div className="space-y-4">
                  {[
                    "We review your message within 2 hours",
                    "A specialist contacts you to discuss needs",
                    "We schedule a free site visit",
                    "You receive a detailed, no-obligation quote",
                  ].map((step, i) => (
                    <div key={step} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#00c8ff]/10 border border-[#00c8ff]/20 flex items-center justify-center shrink-0 text-[#00c8ff] text-xs font-bold">
                        {i + 1}
                      </div>
                      <p className="text-[#7a8499] text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
