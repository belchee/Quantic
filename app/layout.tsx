import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { LangProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import CartDrawer from "@/components/CartDrawer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Quantic SHPK — Sisteme Sigurie & Teknologji", template: "%s | Quantic SHPK" },
  description: "Kamera CCTV, sisteme alarmi, fiber optike dhe infrastrukturë rrjeti — instalim profesional në Kosovë.",
  keywords: ["kamera sigurie Kosovë", "CCTV Prishtinë", "fiber optike Kosovë", "sisteme alarmi", "Tiandy Dahua Kosovë"],
  metadataBase: new URL("https://quantic-ks.net"),
  openGraph: { type: "website", locale: "sq_AL", siteName: "Quantic SHPK" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-white text-gray-900 font-sans antialiased">
        <LangProvider>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            <main>{children}</main>
            <Footer />
            <WhatsAppButton />
          </CartProvider>
        </LangProvider>
      </body>
    </html>
  );
}
