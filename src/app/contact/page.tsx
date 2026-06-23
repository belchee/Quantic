import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 000-0000",
    desc: "Mon–Fri, 8am–6pm",
    color: "#00d4ff",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@quantic.com",
    desc: "We reply within 24 hours",
    color: "#7c3aed",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Your City, Country",
    desc: "Visit our showroom",
    color: "#10b981",
  },
  {
    icon: Clock,
    label: "Support",
    value: "24 / 7",
    desc: "Emergency support available",
    color: "#f59e0b",
  },
];

export default function ContactPage() {
  return (
    <div className="pt-24 min-h-screen bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#00d4ff] text-sm font-semibold uppercase tracking-widest mb-3">
            Get in Touch
          </p>
          <h1 className="text-5xl font-extrabold text-white mb-4">Contact Us</h1>
          <p className="text-[#8892a4] max-w-xl mx-auto">
            Have a question or need a quote? Our team is ready to help you find
            the right security solution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-[#0f1117] border border-[#1e2030] rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <MessageSquare className="w-5 h-5 text-[#00d4ff]" />
              <h2 className="text-white font-semibold text-lg">Send Us a Message</h2>
            </div>

            <form className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-[#8892a4] mb-2">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    className="w-full bg-[#0a0a0f] border border-[#1e2030] rounded-xl px-4 py-3 text-white placeholder-[#8892a4] text-sm focus:outline-none focus:border-[#00d4ff40] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8892a4] mb-2">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full bg-[#0a0a0f] border border-[#1e2030] rounded-xl px-4 py-3 text-white placeholder-[#8892a4] text-sm focus:outline-none focus:border-[#00d4ff40] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#8892a4] mb-2">Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-[#0a0a0f] border border-[#1e2030] rounded-xl px-4 py-3 text-white placeholder-[#8892a4] text-sm focus:outline-none focus:border-[#00d4ff40] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-[#8892a4] mb-2">Phone (optional)</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[#0a0a0f] border border-[#1e2030] rounded-xl px-4 py-3 text-white placeholder-[#8892a4] text-sm focus:outline-none focus:border-[#00d4ff40] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-[#8892a4] mb-2">Service Interest</label>
                <select className="w-full bg-[#0a0a0f] border border-[#1e2030] rounded-xl px-4 py-3 text-[#8892a4] text-sm focus:outline-none focus:border-[#00d4ff40] transition-colors">
                  <option value="">Select a service…</option>
                  <option>Security Cameras</option>
                  <option>DVR / NVR Systems</option>
                  <option>Alarm Systems</option>
                  <option>Fiber Optic Installation</option>
                  <option>FTTH Maintenance</option>
                  <option>Technology Maintenance</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-[#8892a4] mb-2">Message</label>
                <textarea
                  rows={5}
                  placeholder="Tell us about your project or question…"
                  className="w-full bg-[#0a0a0f] border border-[#1e2030] rounded-xl px-4 py-3 text-white placeholder-[#8892a4] text-sm focus:outline-none focus:border-[#00d4ff40] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 text-base font-semibold text-black bg-[#00d4ff] rounded-xl hover:bg-[#00b8d9] transition-colors shadow-[0_0_30px_#00d4ff30]"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact info */}
          <div className="flex flex-col gap-6">
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <div
                  key={info.label}
                  className="bg-[#0f1117] border border-[#1e2030] rounded-2xl p-6 flex items-start gap-4 hover:border-[#00d4ff30] transition-all"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${info.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: info.color }} />
                  </div>
                  <div>
                    <div className="text-[#8892a4] text-xs font-semibold uppercase tracking-widest mb-1">
                      {info.label}
                    </div>
                    <div className="text-white font-semibold text-lg">{info.value}</div>
                    <div className="text-[#8892a4] text-sm">{info.desc}</div>
                  </div>
                </div>
              );
            })}

            <div className="bg-gradient-to-br from-[#00d4ff10] to-[#7c3aed10] border border-[#00d4ff20] rounded-2xl p-6 mt-2">
              <h3 className="text-white font-semibold text-lg mb-3">
                Free On-Site Assessment
              </h3>
              <p className="text-[#8892a4] text-sm leading-relaxed">
                Not sure what you need? We offer free on-site assessments to
                help you determine the best security solution for your property.
                Our experts will evaluate your premises and provide a detailed
                proposal at no cost.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
