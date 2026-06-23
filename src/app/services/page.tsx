import { Camera, Server, AlertTriangle, Wifi, Shield, Wrench, CheckCircle } from "lucide-react";

const services = [
  {
    icon: Camera,
    title: "Security Camera Sales & Installation",
    color: "#00d4ff",
    description:
      "We supply and install professional IP cameras, analog cameras, and PTZ systems for all environments.",
    features: [
      "Full HD, 2MP, 4MP, and 4K resolution cameras",
      "Indoor and outdoor weatherproof models",
      "IR night vision up to 100m",
      "Wide-angle and varifocal lens options",
      "AI-powered motion detection",
      "Remote viewing via mobile app",
    ],
  },
  {
    icon: Server,
    title: "DVR & NVR Systems",
    color: "#7c3aed",
    description:
      "Complete digital and network video recording solutions with local and cloud storage options.",
    features: [
      "4, 8, 16, and 32 channel recorders",
      "H.265+ compression for efficient storage",
      "Remote access and live streaming",
      "RAID storage configurations",
      "Scheduled and event-based recording",
      "Compatible with all major camera brands",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Alarm Systems",
    color: "#f59e0b",
    description:
      "Advanced intrusion detection systems with professional monitoring and instant mobile alerts.",
    features: [
      "Motion sensors, door/window contacts",
      "Smoke and CO detectors",
      "Siren and strobe light integration",
      "24/7 monitoring center connection",
      "Mobile app alerts and control",
      "Battery backup for power outages",
    ],
  },
  {
    icon: Wifi,
    title: "Fiber Optic Installation",
    color: "#10b981",
    description:
      "Enterprise-grade fiber optic cabling for high-speed data transmission over long distances.",
    features: [
      "Single-mode and multi-mode fiber",
      "Indoor and outdoor installation",
      "Splice and termination work",
      "OTDR testing and certification",
      "Patch panel and ODF installation",
      "Long-distance backbone networks",
    ],
  },
  {
    icon: Shield,
    title: "FTTH Maintenance",
    color: "#ef4444",
    description:
      "Fiber-to-the-home maintenance and troubleshooting to keep your internet connection running flawlessly.",
    features: [
      "ONT and OLT configuration",
      "Fault detection and repair",
      "Signal level testing",
      "Splitter replacement",
      "Drop cable installation",
      "Preventive maintenance contracts",
    ],
  },
  {
    icon: Wrench,
    title: "Technology Maintenance",
    color: "#06b6d4",
    description:
      "Preventive and corrective maintenance for servers, networks, and all IT infrastructure.",
    features: [
      "Network switches and routers",
      "Server and workstation maintenance",
      "UPS and power systems",
      "Structured cabling inspection",
      "Software updates and patches",
      "24/7 emergency support",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-24 min-h-screen bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <p className="text-[#00d4ff] text-sm font-semibold uppercase tracking-widest mb-3">
            What We Do
          </p>
          <h1 className="text-5xl font-extrabold text-white mb-4">Our Services</h1>
          <p className="text-[#8892a4] max-w-xl mx-auto">
            End-to-end security and technology services delivered by certified
            professionals with years of hands-on experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="bg-[#0f1117] border border-[#1e2030] rounded-2xl p-8 hover:border-[#00d4ff30] transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${service.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: service.color }} />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-xl mb-2">{service.title}</h2>
                    <p className="text-[#8892a4] text-sm leading-relaxed">{service.description}</p>
                  </div>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: service.color }} />
                      <span className="text-[#8892a4] text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-gradient-to-br from-[#00d4ff10] to-[#7c3aed10] border border-[#00d4ff20] rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-[#8892a4] mb-8">
            Every project is unique. Our team will design the perfect system for
            your specific requirements and budget.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-black bg-[#00d4ff] rounded-xl hover:bg-[#00b8d9] transition-all"
          >
            Request a Consultation
          </a>
        </div>
      </div>
    </div>
  );
}
