"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

const services = [
  "CCTV Surveillance",
  "IP Cameras",
  "DVR / NVR Systems",
  "Alarm Systems",
  "Fiber Optic Installation",
  "FTTH Maintenance",
  "Network Infrastructure",
  "Technology Maintenance",
  "Other",
];

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 1500);
  };

  if (status === "sent") {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center mx-auto mb-4">
          <Send className="w-7 h-7 text-[#22c55e]" />
        </div>
        <h3 className="text-white font-bold text-xl mb-2">Message Sent!</h3>
        <p className="text-[#7a8499] text-sm">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm text-[#7a8499] font-medium mb-2">First Name *</label>
          <input
            required
            type="text"
            placeholder="John"
            className="w-full bg-[#050508] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-[#7a8499]/50 focus:outline-none focus:border-[#00c8ff]/40 focus:ring-1 focus:ring-[#00c8ff]/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm text-[#7a8499] font-medium mb-2">Last Name *</label>
          <input
            required
            type="text"
            placeholder="Doe"
            className="w-full bg-[#050508] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-[#7a8499]/50 focus:outline-none focus:border-[#00c8ff]/40 focus:ring-1 focus:ring-[#00c8ff]/20 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-[#7a8499] font-medium mb-2">Email *</label>
        <input
          required
          type="email"
          placeholder="john@company.com"
          className="w-full bg-[#050508] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-[#7a8499]/50 focus:outline-none focus:border-[#00c8ff]/40 focus:ring-1 focus:ring-[#00c8ff]/20 transition-all"
        />
      </div>

      <div>
        <label className="block text-sm text-[#7a8499] font-medium mb-2">Phone</label>
        <input
          type="tel"
          placeholder="+1 (555) 000-0000"
          className="w-full bg-[#050508] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-[#7a8499]/50 focus:outline-none focus:border-[#00c8ff]/40 focus:ring-1 focus:ring-[#00c8ff]/20 transition-all"
        />
      </div>

      <div>
        <label className="block text-sm text-[#7a8499] font-medium mb-2">Service Needed</label>
        <select className="w-full bg-[#050508] border border-white/8 rounded-xl px-4 py-3 text-[#7a8499] text-sm focus:outline-none focus:border-[#00c8ff]/40 focus:ring-1 focus:ring-[#00c8ff]/20 transition-all">
          <option value="">Select a service…</option>
          {services.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-[#7a8499] font-medium mb-2">Message *</label>
        <textarea
          required
          rows={5}
          placeholder="Tell us about your project, property size, and any specific requirements…"
          className="w-full bg-[#050508] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-[#7a8499]/50 focus:outline-none focus:border-[#00c8ff]/40 focus:ring-1 focus:ring-[#00c8ff]/20 transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full flex items-center justify-center gap-2 py-4 text-sm font-semibold text-[#050508] rounded-xl bg-gradient-to-r from-[#00c8ff] to-[#0066ff] hover:opacity-90 transition-opacity shadow-[0_0_40px_#00c8ff20] disabled:opacity-60"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send Message <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
