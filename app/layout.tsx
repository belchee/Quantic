import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Quantic SHPK — Security & Technology Solutions",
    template: "%s | Quantic SHPK",
  },
  description:
    "Professional CCTV, alarm systems, fiber optic, and network infrastructure installation in Kosovo. Trusted by businesses across the region.",
  keywords: [
    "CCTV installation Kosovo",
    "security cameras Prishtinë",
    "fiber optic Kosovo",
    "alarm systems",
    "Tiandy Dahua Kosovo",
    "network infrastructure",
  ],
  metadataBase: new URL("https://quanticshpk.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Quantic SHPK",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-white text-gray-900 font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
