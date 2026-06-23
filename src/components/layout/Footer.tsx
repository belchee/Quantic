import Link from 'next/link';
import QuanticLogo from '@/components/QuanticLogo';
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#050508] border-t border-[#1a1a2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <QuanticLogo className="h-10 w-auto mb-4" />
            <p className="text-[#7a8499] text-sm leading-relaxed max-w-xs mt-4">
              Your trusted security technology partner. Professional installation, maintenance, and support for CCTV, fiber optics, and network systems.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-9 h-9 rounded-lg border border-[#1a1a2a] flex items-center justify-center text-[#7a8499] hover:text-white hover:border-[#00c8ff]/50 transition-colors">
                <span className="text-xs font-bold">f</span>
              </a>
              <a href="#" className="w-9 h-9 rounded-lg border border-[#1a1a2a] flex items-center justify-center text-[#7a8499] hover:text-white hover:border-[#00c8ff]/50 transition-colors">
                <span className="text-xs font-bold">in</span>
              </a>
              <a href="#" className="w-9 h-9 rounded-lg border border-[#1a1a2a] flex items-center justify-center text-[#7a8499] hover:text-white hover:border-[#00c8ff]/50 transition-colors">
                <span className="text-xs font-bold">li</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['About', 'Services', 'Products', 'Projects', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-[#7a8499] hover:text-white text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-[#7a8499]">
                <Phone className="w-4 h-4 mt-0.5 text-[#00c8ff] flex-shrink-0" />
                +971 XX XXX XXXX
              </li>
              <li className="flex items-start gap-2 text-sm text-[#7a8499]">
                <Mail className="w-4 h-4 mt-0.5 text-[#00c8ff] flex-shrink-0" />
                info@quantictech.ae
              </li>
              <li className="flex items-start gap-2 text-sm text-[#7a8499]">
                <MapPin className="w-4 h-4 mt-0.5 text-[#00c8ff] flex-shrink-0" />
                Abu Dhabi, UAE
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-[#1a1a2a] text-center text-sm text-[#7a8499]">
          © {new Date().getFullYear()} Quantic Technology. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
