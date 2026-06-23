import Link from "next/link";
import { Shield, Phone, Mail, MapPin } from "lucide-react";

const services = [
  "Security Cameras",
  "DVR / NVR Systems",
  "Alarm Systems",
  "Fiber Optic Install",
  "FTTH Maintenance",
  "Technology Maintenance",
];

const brands = ["Tiandy", "Dahua", "TvT"];

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0f] border-t border-[#1e2030]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#00d4ff] flex items-center justify-center">
                <Shield className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-white">Quan</span>
                <span className="text-[#00d4ff]">tic</span>
              </span>
            </Link>
            <p className="text-[#8892a4] text-sm leading-relaxed mb-6">
              Your trusted partner for professional security systems, fiber optic
              networks, and technology solutions.
            </p>
            <div className="flex items-center gap-3">
              {["f", "in", "𝕏"].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="w-9 h-9 rounded-lg border border-[#1e2030] flex items-center justify-center text-[#8892a4] hover:text-[#00d4ff] hover:border-[#00d4ff] transition-colors text-xs font-bold"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s}>
                  <Link
                    href="/services"
                    className="text-[#8892a4] text-sm hover:text-[#00d4ff] transition-colors"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-white font-semibold mb-4">Our Brands</h3>
            <ul className="space-y-3">
              {brands.map((b) => (
                <li key={b}>
                  <span className="text-[#8892a4] text-sm">{b}</span>
                </li>
              ))}
            </ul>
            <h3 className="text-white font-semibold mt-6 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: "/products", label: "Products" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[#8892a4] text-sm hover:text-[#00d4ff] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#00d4ff] mt-0.5 shrink-0" />
                <span className="text-[#8892a4] text-sm">+1 (555) 000-0000</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#00d4ff] mt-0.5 shrink-0" />
                <span className="text-[#8892a4] text-sm">info@quantic.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#00d4ff] mt-0.5 shrink-0" />
                <span className="text-[#8892a4] text-sm">
                  Your City, Country
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#1e2030] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#8892a4] text-sm">
            © {new Date().getFullYear()} Quantic. All rights reserved.
          </p>
          <p className="text-[#8892a4] text-sm">
            Professional Security & Technology Solutions
          </p>
        </div>
      </div>
    </footer>
  );
}
